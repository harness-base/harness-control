# rules 审查手册

规则链路：`定义(就近 AGENTS.md + 标记) → 加载(CLAUDE.md @import / 就近规则) → 选取(按任务挑相关) → 遵守 → 拦截(hook/eval)`。本维度只查规则**写对地方、会被加载、引用不悬空、severity 没被偷改**；规则该不该存在/合不合理是 eval 维度的事。

## 规范（健康长什么样 / 不变量）

- **就近入驻**：规则一律是某个 `AGENTS.md` 里的 bullet，**没有独立规则文件**（`docs/rules/` 只剩 `index.yaml`，原 `0001..0009.md` 已删，ADR-0004）。放在"能覆盖其所有目标的最浅 `AGENTS.md`"——全局红线进根 `AGENTS.md`，工程通用进 `projects/<x>/AGENTS.md`，只管某层进离那层最近的 `<dir>/AGENTS.md`。
- **每条带隐形标记**：`<!-- rule: <id> | sev: blocker|warn | eval: <考题号,可空> -->`。id 两类口径（`rules-index.sh` 全仓扫、两种都收）：harness 用 `rule-00NN`（稳定引用键，全仓唯一，取现有最大 +1，被 eval/ADR/feature 按号引），项目用 `命名空间/slug`（如 `kratos/server-readyz-dedicated-ctx`）。
- **通用 / 项目分界（rule-0015）**：入驻根 `AGENTS.md` 的必须是通用中性的控制面规则；掺具体项目领域名词 / 业务假设的，归 `projects/<x>/**` 的 `AGENTS.md`（用工程命名 id）。定范围时先过这道分界。
- **catalog 自动生成、禁手改**：`docs/rules/index.yaml` 由 `scripts/rules-index.sh` 从所有标记扫出来；`--check` 进 `make verify` 防漂移。
- **引用不悬空**：标记里每个 `eval: NNN` 必须有对应 `docs/eval/prompts/NNN-*.md`（已固化进 `rules-index.sh` 的 `check_eval_pointers`）。
- **加载是机制不是自觉**：凡有 `AGENTS.md` 的目录必须有同级 `CLAUDE.md` shim（内容 `@AGENTS.md`），否则 Claude Code 那侧加载不到——这条是 `verify-control-plane.sh` 强校验的不变量。
- **severity 准**：blocker = 红线/不可越（假完成、共因污染、漏 DLQ…）；warn = 该做但非致命。改 severity 等于改约束强度，必须显式、对源核。

## 怎么检索现状（直接可跑）

```bash
# 看全部规则（编号+简述+位置+severity+eval）——审查/自进化时才读，默认不加载
cat docs/rules/index.yaml

# catalog 是否漂移 + eval 指针是否悬空（进 make verify，应 exit 0）
bash scripts/rules-index.sh --check

# 某条规则全文 / 它住在哪个 AGENTS.md
grep -rn 'rule-0009' --include=AGENTS.md .          # harness 规则
grep -rn 'kratos/server-readyz' --include=AGENTS.md . # 项目规则

# 所有规则标记一览（核对 catalog 是否对得上，应 = catalog 条数）
grep -rno '<!--[[:space:]]*rule:[[:space:]]*[A-Za-z][^>]*-->' --include=AGENTS.md . | grep -v '\.git'

# 某 id 被谁引用（改/删要害：引用点 = skill 正文 / reviewer 判据 / ADR / 模板 / 考题，全仓数百处）
git grep -E 'rule-[0-9]{4}'                 # harness 规则；改语义 / 删除时引用点全要跟
git grep -F 'kratos/server-readyz'          # 工程命名 id 同理

# shim 完整性 + 整个控制面自检（含 rules-index --check + shim 校验）
make verify

# 加载链路源头：启动顺序第 4 条——读/改某目录前加载向上最近的 AGENTS.md，就近规则随之生效
grep -n '向上最近的' AGENTS.md
```

加载链路要点：根 `CLAUDE.md` → `@AGENTS.md` 拉常驻全局规则；改/读某目录代码前加载**向上最近的 `AGENTS.md`**（连同同级 `CLAUDE.md` shim）→ 就近规则进上下文。Codex 原生按目录层级读 `AGENTS.md`，不依赖 shim；Claude Code 依赖 shim，故 shim 缺失只断 Claude 侧（这是常见隐形断点）。

## 怎么判（逐条可判定）

- **符合**：`rules-index.sh --check` 绿 + `make verify` 绿 + 每条规则住在最浅可覆盖的 `AGENTS.md` + 每个有规则的目录有 `@AGENTS.md` shim + `git grep rule-NNNN` 无指向已删规则的悬空引用。
- **缺口（热点无规则）**：某行为反复踩坑（`tasks/lessons.md` 同型条目 ≥2 次）却没有对应 bullet+标记 → 该晋升成规则没晋升。判据：lessons 里出现"反复""同型""兄弟实例"，但 `grep -rn` 在 AGENTS.md 找不到对应红线。
- **漏洞 — 链路断（定义了却加载不到）**：标记/规则在 `AGENTS.md` 里，但该目录**缺 CLAUDE.md shim 或 shim 不含 `@AGENTS.md`** → Claude 侧永远读不到。`make verify` 的"AGENTS.md ↔ CLAUDE.md shim"段会报。
- **漏洞 — catalog 漂移**：有人手改了 `index.yaml`，或加了标记没重生成 → `rules-index.sh --check` 非零退出（"rules 索引漂移"）。catalog 禁手改，唯一正解是重生成。
- **漏洞 — 坏指针（悬空 eval）**：标记 `eval: NNN` 但 `docs/eval/prompts/NNN-*.md` 不存在 → `check_eval_pointers` 报"引用了不存在的考题"。
- **漏洞 — 改/删规则引用点没跟**：改语义 / 删除时没全仓 `git grep` 该 id 的引用点（skill 正文 / reviewer 判据 / ADR / 模板 / 考题），留下悬空引用或过时复述——机器不兜这条（`--check` 只查索引与 eval 指针），靠 `hc-add-rule` 的关联对照表 + `hc-rule-reviewer` 巡查（ADR-0020）。
- **漏洞 — severity / 语义偷改**：ADR/总结声称"severity 全保留 / 语义无损"，但 bullet 或 catalog 里 severity 与事实源不符。判据：凡声称"X 保留/不变"，必须能对 `git show HEAD:<file>` 机械核对；对不上即偷改。
- **漏洞 — 例外被稀释**：规则带的例外/边界（如 rule-0001 的"纯控制面/文档/脚本不触发"、rule-0010 的"不强制 PRD 必须存在"）在迁移/重写时悄悄丢了 → 方向是"过触发"，warn 级，但仍算语义漂移。

## 常见漏洞模式（本仓真实案例）

- **声称"全保留"却偷改**（`tasks/lessons.md` 2026-06-26"声称全保留却实际偷改，被独立 eval 抓出" + `docs/eval/task-reviews/20260626T014408Z-harness-rules-distribution/`）：规则分布化时 ADR-0004 写"severity / eval 映射全保留"，实际把 rule-0007 的 `warn` 偷升 `blocker`，又给 rule-0005/0006/0008 编了不存在的 eval 指针（005/006/008）。凭记忆迁移、没对源核；hc-eval 子 agent 逐条 `git show HEAD` 对比判 yellow。**catalog 是忠实的——它如实继承了源头的坏标记**，所以坏指针不是 scanner 的锅，是标记的锅。
- **eval 指针悬空**（同案）：上面那三个坏指针正是"声称的考题不存在"。教训触发了把 `check_eval_pointers` 固化进 `rules-index.sh --check`（变异自证 load-bearing），现在这类漏洞机器会拦。
- **rule-0007 自身未履行**（`tasks/lessons.md` 2026-06-26"rule-0007 改了 skill 却没在 ADR 记录 = 判失败"）：改了 `hc-add-rule` skill 却没在 ADR 写 `templates/adr.md` 强制的"受影响的 skill"栏 → eval-011 判 blocker fail。改规则体系本身就是架构改动，连带回顾 skill 的义务别漏。
- **空字段折叠致 catalog 串位**（`tasks/lessons.md` 2026-06-26"bash 用 TAB 作 IFS 分隔会折叠空字段"）：scanner 早期用 TAB 分隔记录，eval 字段为空时被折叠、brief/location 串位。修法是改用 `\037`(US) 非空白分隔。审 catalog 时若发现某条 brief 空/location 串到正文，先怀疑生成器的字段解析。

## 修复用哪个操作 skill / 脚本

- **加 / 改 / 删一条规则（含从 lessons 晋升）** → `hc-add-rule` skill（`.agents/skills/hc-add-rule/SKILL.md`；ADR-0020 起是加改删统一入口）：仍走三步——①定范围（最浅可覆盖 `AGENTS.md` + rule-0015 通用/项目分界）②写 bullet + 标记 + `bash scripts/rules-index.sh` 重生成 catalog ③挂执行（能机器判进 `hook-policy.sh`+`.test.sh`，要人判进 `docs/eval/prompts/`+`index.yaml`）。SKILL.md 正文带**规则关联对照表**（本体两种 id 口径 / 索引 regen / shim / 执行挂钩 / eval 指针 / 引用点 / lessons 闭环标记 / 反向指针），改语义 / 删除时逐项跟；收尾派 **`hc-rule-reviewer`** 子 agent（双栈、只评不改）照对照表巡查——机器能查的（索引漂移 / shim / 登记）`make verify` 已兜、reviewer 不重复。
- **catalog 漂移 / 坏指针** → 修源头标记（对应 `AGENTS.md`），再 `bash scripts/rules-index.sh` 重生成；**禁手改 `index.yaml`**。`bash scripts/rules-index.sh --check` 复验绿。
- **shim 缺失（加载链路断）** → 在该目录补同级 `CLAUDE.md` 内容 `@AGENTS.md`；`make verify` 的 shim 段复验。
- **severity / 语义偷改** → 对 `git show HEAD:<file>` 逐条核对改回，或在 ADR 显式声明并解释；别让"全保留"措辞与事实矛盾。
- **收口** → `make verify`（含 `rules-index.sh --check` + shim 校验 + 控制面结构）必须真绿（exit 0，非声称）。
