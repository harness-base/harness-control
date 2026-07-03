# lessons / memory 审查手册

错题本、用户偏好、自进化 log 三件套的健康度。核心红线：**踩坑当场记、反复出现晋升成规则、log 是中转站不是终点。**

## 规范（健康长什么样 / 不变量）

- 踩坑当场记进 `tasks/lessons.md`，**三段式**（Mistake / Prevention / Earlier signal），按日期倒序，新的在上（格式与整理标记约定见文件头）；**用户纠正也算**（rule-0011，`correction-nudge.sh` 每轮注入这条自检提醒）。
- **反复出现的 lesson 必须晋升成规则**（走 `hc-add-rule`——ADR-0020 起是规则加/改/删统一入口、含"从 lessons 晋升"入口），不许同型坑反复记不收口（rule-0007）。
- **晋升闭环有机器送达**：`scripts/lessons-promote-check.sh` 数"标题行尾无 `<!-- opt: … -->` 标记"的未整理条数；`scripts/correction-nudge.sh`（UserPromptSubmit hook，stdout 注入当轮上下文）在未整理数超阈值（默认 10，`LESSONS_PROMOTE_THRESHOLD`）时提醒走 `hc-self-evolution` 挑该升的（升规则走 `hc-add-rule`）。**标记约定**（标题行尾）：无标记=未整理 ｜ `<!-- opt: seen -->`=提醒过·待决定 ｜ `<!-- opt: skip -->`=看过·不升 ｜ `<!-- opt: rule-00NN -->`=已升成该编号规则（晋升后必须回标销掉，`hc-add-rule` 对照表的 lessons 闭环项 + `hc-rule-reviewer` 巡查）。
- `tasks/optimization-log.md` 是**中转站**：兜底（①落文档提醒，`turn-backstop.sh`，Stop hook 机械触发）和 judgment（②自进化审查，hc-self-evolution / hc-self-optimize）捞到的候选落这里，**重要的必须晋升到家**——决策→ADR、踩坑→`lessons`、知识→就近 `AGENTS.md`/规则、偏好→memory（rule-0011）。① 的发现带 `- [ ]` 状态（待处理），`correction-nudge` 下一轮把"有 N 条待处理"注入主 agent（送达通道）；处理完改 `- [x]`、暂缓改 `- [~]` 并写理由。log 里不许烂着不动。
- memory（`~/.claude/projects/<工程根 slug>/memory/MEMORY.md` + 同目录条目）只存**跨会话的用户偏好/工作方式**，有 index、条目不悬空、不过期。
- 只认**预期格式**入库：兜底只把形如 `[类别] ...` 的行写进 log（`turn-backstop.sh` 里 `grep '^\['` 过滤）；LLM 报错（`Prompt is too long` / `overloaded` / `budget`）、`NONE`、空一律不记（lessons 2026-06-26 那条就是被这个坑过）。

## 怎么检索现状（命令可直接跑）

```bash
ROOT="$(git rev-parse --show-toplevel)"

# 错题本：总条数 / 未整理数（无 opt: 标记，nudge 阈值就吃这个数）/ 已晋升数
grep -c '^## 20' "$ROOT/tasks/lessons.md"
bash "$ROOT/scripts/lessons-promote-check.sh"
grep '^## 20' "$ROOT/tasks/lessons.md" | grep -c 'opt: rule-'

# 找"同型反复"——同主题词出现 ≥2 次 = 晋升信号（例：空转测试 / 共因 / 超时竞态 / CWD）
grep -niE '空转|共因|超时|竞态|CWD|牵强|假完成|裸 ?grep' "$ROOT/tasks/lessons.md"

# log 健康度：两类来源（`落文档`① / `judgment`②）都应有条目；`- [ ]` 待处理堆积是主要指标
sed -n '1,9p' "$ROOT/tasks/optimization-log.md"           # 头部约定（中转站语义）
grep -nE '`落文档`|`judgment`' "$ROOT/tasks/optimization-log.md" | head
grep -cE '^- \[ \]' "$ROOT/tasks/optimization-log.md"     # 待处理数（清零才算闭环）

# memory：index 与条目文件（路径 = 主仓工程根 slug，worktree 会话也用主仓的；本仓即下方路径）
cat ~/.claude/projects/-Users-zhouhaiyin-project-harness-kratos/memory/MEMORY.md
ls   ~/.claude/projects/-Users-zhouhaiyin-project-harness-kratos/memory/

# 兜底 + 送达机制本体（WHEN=脚本常量、WHAT 给 Haiku；送达走 correction-nudge）+ 各自 mutation 自测
grep -n 'BACKSTOP_\|TAIL_BYTES' "$ROOT/scripts/turn-backstop.sh" | head
bash "$ROOT/scripts/turn-backstop.test.sh"
bash "$ROOT/scripts/correction-nudge.test.sh"
bash "$ROOT/scripts/lessons-promote-check.test.sh"
```

- 这三类**没有进 `make verify` 的硬闸**（不像 rules/skills 有 `--check` 索引校验）——未整理数 / `- [ ]` 堆积已有 `correction-nudge` 阈值提醒兜送达，但**裁决仍靠人判**，是已知的弱机器化点。

## 怎么判（逐条可判定）

- **符合**：lessons 全三段式；同型坑出现 ≥2 次的都已有对应规则、原条目标了 `<!-- opt: rule-00NN -->`；log 里每条候选要么已晋升（家里能查到、行标 `- [x]`）、要么 `- [~]` 带理由；memory 条目都在 index 里且仍真。
- **缺口**：lessons 有条目但缺 Earlier signal / Prevention 段；`opt: seen` 长期只提醒不裁决（= 假闭环，本仓 backlog 已点名一批 seen 从没裁决）；log `- [ ]` 躺着没人动、也没标暂缓；memory index 指向不存在的条目文件。
- **漏洞**：同一主题 lesson 反复记 ≥2 次却没规则（晋升断链，rule-0007 失守）；log 长期堆积无人晋升（空转，rule-0011 失守）；把 LLM 错误串/`NONE` 当发现写进 log（污染）；memory 存了过期/错误的偏好仍被当事实加载。

## 常见漏洞模式（本仓真实案例）

- **log 空转 / 污染——本仓踩过**：`tasks/lessons.md` 2026-06-26「兜底把超长 transcript 喂给 Haiku，"Prompt is too long" 被当发现记进 log」。`turn-backstop` 按**行**截 transcript，JSONL 单行含工具输出可能极大→prompt 超限→Haiku 回报错串→脚本没识别，当成发现追加进 `optimization-log` 还提交了一条。修法已固化：改按**字节**截（`TAIL_BYTES` 常量），入库只认 `^\[`（findings 过滤）。
- **同型坑反复未晋升**：2026-06-12「池类依赖掩盖探活失败不重建」与多条 e2e/共因/超时竞态 lesson 同主题（断言锚错信号）反复出现——这类一旦 ≥2 次就该考虑晋升，对应已沉淀为 rule-0009（验收断言锚定唯一真实证据）。判 lessons 健康时，专盯"同主题第 2 次还在记 lesson、却没规则"。
- **晋升断链被 eval 抓**：2026-06-26「rule-0007 改了 skill 却没在 ADR 记录 = 判失败」——做了没记 = 没履行（eval-011 判 blocker fail）。
- **log 闭环要看真跑没跑**：`② judgment` 与 `① 落文档`（turn-backstop）现均有真实条目——但 ① 曾长期 **0 产出**：headless 报错（budget 超限等）被 `2>/dev/null` 吞掉、静默失效（ADR-0012 曾列 backlog）；修法已固化：stderr 接进诊断日志 `tasks/.turn-backstop.log`、budget 留足头寸。审查时区分"没东西要记"与"机制没启动"（看诊断日志的 FIRE/skip/exit 行），并查 `- [ ]` 有没有堆积、`opt: seen` 有没有只提醒不裁决。

## 修复用哪个操作 skill / 脚本

- **反复 lesson → 晋升成规则**：用 `hc-add-rule` skill（`.agents/skills/hc-add-rule/SKILL.md`，规则加/改/删统一入口，ADR-0020，含"从 lessons 晋升"入口）——定范围→写进就近 `AGENTS.md`+登记→挂执行/考题；晋升后回 lessons 把该条标 `<!-- opt: rule-00NN -->` 销掉（对照表 lessons 闭环项，`hc-rule-reviewer` 巡查）。
- **处理 log 候选 / 主动深审**：用 `hc-self-evolution` skill（`.agents/skills/hc-self-evolution/SKILL.md`，规范检查层入口）；复杂时 spawn `hc-self-optimize` 子 agent（`.claude/agents/hc-self-optimize.md`）。把候选搬到 ADR/lessons/就近 AGENTS.md/规则/memory，处理完把 `- [ ]` 改 `- [x]`，不许烂在 log（rule-0011）。
- **写/整理用户偏好**：写 memory 文件 + 维护 index；整理用 `anthropic-skills:consolidate-memory`（合并重复、修过期、剪 index）。
- **兜底/送达机制本身的修复**：`scripts/turn-backstop.sh`（①触发与入库）+ `scripts/correction-nudge.sh`（每轮送达 + 阈值提醒）+ `scripts/lessons-promote-check.sh`（未整理计数），各配 `.test.sh`（改了必须红得起来，mutation 自证）。
