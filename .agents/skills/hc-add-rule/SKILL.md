---
name: hc-add-rule
description: 规则的加 / 改 / 删统一入口（团队规范、踩坑约束、编码红线）。用户说"以后都要/不许/必须…"、要改一条规则的语义/位置/severity、要删过时规则、或 lessons 攒到该升规则时用本 skill：走"定范围→写下来+登记→挂执行"三步，照「规则关联对照表」跟全关联点，派 hc-rule-reviewer 对抗巡查，确保规则会被加载、违反会被发现、改删不留悬空引用。
version: 4
last_reviewed: 2026-07-08
---

# 规则的加 / 改 / 删（hc-add-rule）

规则写完没人读、没人拦 = 白写；改了语义 / 删了规则但引用点没跟 = 全仓悬空。本 skill 是规则**加 / 改 / 删的统一入口**：三步保证它放对地方、会被加载、会被执行；「规则关联对照表」保证一条规则的所有关联点（索引 / 挂钩 / eval 指针 / 引用点 / lessons 销点）加时挂全、改删时跟全。

## 何时用 / 何时不用
- 用（**加**）：用户说"以后都要 / 不许 / 必须…"，或你发现一条该固化的规范。
- 用（**改**）：一条既有规则的语义 / severity / 位置 / 挂钩要变。
- 用（**删**）：规则过时要收回（连同其全部关联点一起清）。
- 用（**晋升**）：lessons 里反复同根的坑该升成规则（见「从 lessons 晋升」）。
- 不用：一次性临时提醒（那只记 `tasks/lessons.md`）。

## 三步（缺一步，规则就等于白加）

### 第 1 步：定范围 —— 这规则管谁？
**先过 rule-0015 的边界**：通用的归控制面（harness 资产不掺具体项目的领域名词 / 业务假设），项目专属的归被管工程（`projects/<工程>/`）。然后一律**入驻就近的 `AGENTS.md`**（ADR-0004），放到"能覆盖其所有目标的最浅 `AGENTS.md`"：
- harness 全局治理（如"改业务码前先立项"）→ 根 `AGENTS.md`
- 某工程通用（如"这后端时间一律 UTC"）→ 该工程根 `projects/<x>/AGENTS.md`
- 只管某层（如"数据层用 ent、非必要不 raw SQL"）→ 离那层最近的 `<dir>/AGENTS.md`

### 第 2 步：写下来 + 登记 —— 让它会被读到
- 在选定的 `AGENTS.md` 加 / 改一条 bullet：一句"必须 / 禁止"（必要时带一行为什么 / 怎么做）。
- **带隐形标记**供索引扫描：`<!-- rule: <id> | sev: blocker|warn | eval: <考题号，可空> -->`。id 有**两种口径**，`scripts/rules-index.sh` 全仓扫 `AGENTS.md`、两种都收进 catalog：
  - **全局数字 `rule-00NN`**：harness 全局规则（根 `AGENTS.md`）。编号取现有最大 +1（查 `docs/rules/index.yaml`），全仓唯一、稳定引用键，被 eval 考题 / ADR 按号引用。
  - **工程命名 id `<工程>/<主题>`**（如 `backend-service/db-eager-load-fail-fast`，中性占位）：被管工程 / 目录级规则。命名空间 = 工程短名，主题 slug 说人话、见名知义。
- **重生成 catalog**：`bash scripts/rules-index.sh`（生成 `docs/rules/index.yaml`，**禁手改**）。加 / 改 / 删都要 regen。
- 自检：`make verify` 绿（rules 索引无漂移 + 该 `AGENTS.md` 有 `CLAUDE.md` shim）= 已收录、就近可加载。

### 第 3 步：挂执行 —— 让违反会被发现
按"能不能机器判"分两路：
- **能机器判**（某命令 / 字符串、改 A 必须改 B、某路径模式）→ `scripts/hook-policy.sh` 加一条匹配 + `scripts/hook-policy.test.sh` 加正反用例 → 提交 / CI 自动拦。
- **要人判**（设计是否合理 / 过度）→ `docs/eval/prompts/` 加一道考题引用规则 id + 登记 `docs/eval/index.yaml` → 收尾 eval 打分。
- 两者都不便 → 至少完成第 2 步（会被加载），显式标"软约束"。

## 规则关联对照表（一表两用）

一条规则在仓里有 8 个关联点。**主 agent 加 / 改 / 删时照它当操作清单；hc-rule-reviewer 照它当巡查判据。**机器能查的行 `make verify` 已兜，reviewer 不重复查。

| # | 关联点 | 要求 | 谁兜底 |
|---|--------|------|--------|
| 1 | 规则本体 | 就近 `AGENTS.md` bullet + 隐形标记，id 口径对（全局数字 / 工程命名，见第 2 步）；rule-0015 边界（通用归控制面 / 项目归工程） | **主 agent 第 1/2 步自查 + 用户拍**（范围与措辞在引导环节定，reviewer 不复审内容本身） |
| 2 | 索引 | `bash scripts/rules-index.sh` regen `docs/rules/index.yaml`（禁手改） | 机检（`make verify` 的 `--check` 防漂移） |
| 3 | shim | 所在 `AGENTS.md` 有同级 `CLAUDE.md` | 机检（`make verify`） |
| 4 | 执行挂钩 | 机器判 → `hook-policy.sh` + 测试；人判 → eval 考题 + 登记；都不便 → 显式标软约束 | reviewer（挂没挂、挂得对不对） |
| 5 | eval 指针 | 标记里的 `eval: NNN` 与 `docs/eval/` 考题**双向**对上（标了号考题在、考题引的规则号存在） | 正向存在性 / 登记 = 机检（`rules-index --check` + `verify-eval-materials`）；**内容真伪（考题真考这条）= reviewer** |
| 6 | **引用点（改 / 删要害）** | 全仓 grep 该规则 id——skill 正文 / reviewer 判据 / ADR / 模板都可能复述它；**改语义 / 删除时引用点全要跟**（防"复述点没扫"留悬空） | reviewer |
| 7 | lessons 闭环 | 源自错题晋升的，`tasks/lessons.md` 对应条标 `<!-- opt: rule-00NN -->` 销掉（该标记也用于"已被既有规则覆盖、不另升"的条目——两种来路读 lesson 正文分辨，覆盖型不当晋升源核） | reviewer |
| 8 | 反向引用 | 新规则该不该被现有 skill 引为指针（rule-0015 立完、各 skill 补指针，是先例） | reviewer |

按操作类型走表：
- **加**：1→5 全做；来自 lessons 的做 7；想一下 8。
- **改**（语义 / severity / 位置 / 挂钩）：第 6 行是要害——先 `grep -rn '<规则id>'` 全仓列引用点，逐个跟改；再 regen 索引（第 2 行）、核挂钩与 eval 指针（4 / 5）。
- **删**：本体删 bullet + 标记 → regen 索引 → 挂钩同步撤（hook 条目 + 测试用例、eval 考题改注或下架，**连带扫其它考题对被下架考题的互引**）→ 第 6 行引用点全清（活文档零残留）→ **历史文档两件事**：正文不改写（历史是真的）+ **决策被实质推翻的旧 ADR 头部加"更新"前向指针块**（related_docs 补新 ADR，照 ADR-0009→0021 先例；顺带提及的不加，防稀释）——"以新 ADR 为准"必须给旧文档读者到达新 ADR 的路径；编号**不复用**（历史 eval / ADR 按号引用过）。

## 从 lessons 晋升

`correction-nudge` / `scripts/lessons-promote-check.sh` 攒够未整理条目会提醒"该升的升"——这就是本入口：
1. 确认**反复同根**（同类坑 ≥2 次，或一次但代价大到必须硬约束）；一次性的标 `<!-- opt: skip -->` 不升。
2. **先跟用户确认再升**（规则是约束、升错很烦人）：把"哪条 lesson、拟升成什么规则、放哪、什么 severity"摆给用户拍——agent 主动发起的晋升尤其不许静默落。
3. 走上面三步把它落成规则（范围、id 口径、挂钩照常）。
3. **销点**：回 `tasks/lessons.md` 把对应条目标 `<!-- opt: rule-00NN -->`（脚本据此计数，不销会一直被提醒）。

## 对抗巡查（hc-rule-reviewer）

两角色分离：**主 agent 生成 / 修改规则本体**（本 skill 引导），**`hc-rule-reviewer`（双栈子 agent，只评不改）照对照表巡查**——**多视角并行对抗**（编排 pattern = `docs/harness/adversarial-review.md`，ADR-0022，唯一真相源、引用不复制）：
- 派单时给它：本次动了哪条规则（id）、操作类型（加 / 改 / 删）、涉及文件。
- **fan out 多实例、各盯对照表的一组行**（引用点第 6 行 / 该引未引第 8 行 / 挂钩第 4 行 / eval 指针第 5 行 / lessons 销点第 7 行）→ 汇总去重 → 出问题清单；Claude Code 用 workflow 并行、Codex 用原生多 agent（`max_threads` 并发）并行派同名双栈。
- 主 agent 回改 → 复查 → **到过为止**（末轮换新视角防假收敛）。
- **机器能查的（索引漂移 / shim / 登记）`make verify` 已兜，reviewer 不重复**（两层防线惯例：机检管形式、reviewer 管语义）。

## 收尾自检
- [ ] 范围对（rule-0015 边界 + 放在最浅该管处）
- [ ] 登记了（id 口径对、`rules-index.sh` regen 过）
- [ ] 挂了执行（hook 或 eval）或显式标"软约束"
- [ ] 对照表按操作类型走完（改 / 删尤其第 6 行引用点）
- [ ] 来自 lessons 的销点已标 `<!-- opt: rule-00NN -->`
- [ ] hc-rule-reviewer 巡查过、清单清零
- [ ] `make verify` 还绿

## 例子

**加**（工程命名 id）："数据层用 ent、非必要不 raw SQL"：
1. 范围：某工程数据层 → `projects/backend-service/internal/data/AGENTS.md`
2. 写 + 标记：加 bullet + `<!-- rule: backend/data-ent-no-raw-sql | sev: warn -->`，跑 `scripts/rules-index.sh`
3. 执行：`hook-policy.sh` 加"数据层外出现 raw SQL（`database/sql`、手拼 `.Query` / `.Exec`）→ 提醒" + 正反用例
4. 派 hc-rule-reviewer 过对照表 → `make verify` 绿 → 落地完成

**改 / 删**：先 `grep -rn '<规则id>'` 全仓列出引用点（skill / ADR / 判据 / 模板），按对照表"改 / 删"行逐项跟，最后 reviewer 巡查确认无悬空。

## 演进（rule-0007）
随规则体系 / 工程结构演进时回顾本 skill；对照表的关联点变了（新机检上线、挂钩形态变化）要同步改表并知会 hc-rule-reviewer 的判据；步骤变了更新 `version` / `last_reviewed`。
