---
title: 对抗评审 pattern（多视角并行 review）
status: active
owner: harness
last_updated: 2026-07-10
source_files: []
related_docs:
  - ../decisions/0022-adversarial-review-parallel.md
---

# 对抗评审 pattern（多视角并行 review）

各 skill 的 **review 步的唯一真相源**（编排口径）。凡有"派 reviewer 对抗挑刺 → 回改到过"评审步的**产出型 skill**（如 `hc-dev` / `hc-tech-design` 等，**完整清单以 ADR-0022 受影响栏 + 各 skill review 步实际引用本文为准**，不在此复列）**引用本文、不复制**——改 review 编排只动这里。依据 **ADR-0022**。

> 立意：**review 不许单线程扫一遍就算**。单个 reviewer 一个视角容易漏；"单轮零 = 假收敛"（视角钝化，本仓实证：单轮挑干净、换怀疑视角又挖出 36+ 真问题）。所以 review 步统一走**多视角并行对抗 + 迭代收敛**。

## 核心 pattern（总监按此编排 review 步）

1. **fan out 多个 reviewer 实例、每个盯一个不同视角**（并行）——视角 = 该 review 域 reviewer 自带 rubric 的各块（如代码：correctness / 契约对账 / 安全 / 边界 / 缺测试 / 视觉还原；需求：覆盖 / 可观测 / 范围闭合；用例：覆盖 / 源符合 / 质量……**以各 reviewer 上下文的 rubric 为准，本文不复制**）。**同一个 reviewer 开 N 个同视角 = 浪费**，价值在视角相异。
2. **每条 finding 独立证伪**——默认怀疑"没问题"，主动找证据。
3. **汇总去重**——各视角 findings 合并、去重、按 blocker / major / minor 排。
4. **回改 → 复审**——总监据清单派对应 worker 回改，再 review。**每轮修复收尾做"声称清单 ↔ git status"对账**：修复若改了原清单之外的新文件，ADR 受影响栏 / 连带清单当轮回填；todo 勾选同口径——项里点名的每个文件都要在实改清单里，否则不许勾（lessons 同型三次：修复轮不回填 ×2、打勾没做 ×1）。
5. **迭代到一轮干净**——**防假收敛的强度随改动面伸缩**：**深活 / 大改**末轮那一遍"干净"必须**用没用过的新视角**再挑一遍（同视角单轮零 = 视角钝化、存疑）；**小活**视角本就 1–2 个、可能无新视角可换，findings 集**跨一轮稳定为空**即算收敛。

**按改动面伸缩**：小活 1–2 个视角即可；深活 / 大改 / 命中深度信号 → 全视角 fan out + 多轮换视角。

**按对象类型伸缩**：review 对象是 **harness 控制面资产 / 机制文档**（规则、skill 本体、模板、机制文档、配置——**且无对口领域 reviewer rubric** 的 generic 文档审）时，别套代码审的角度矩阵（语言陷阱 / efficiency 等必然空转）——就 2–3 个对口视角**封顶**：关联项遗漏（现成机制 = `hc-doc-sync-reviewer` 对照 doc-sync-checklist）、语义冲突 / 前后矛盾（跨文件口径对照）、必要时指针有效性。文档审的"深"不等于视角多，等于**对照面全**。两条边界：**领域产物审不适用本段**——PRD / 设计方案 / 用例 / 接入这类有专属 reviewer 的产物（也多是纯 .md），仍按第 1 步走各自域 rubric 视角 + 按改动面伸缩；**收敛口径**——对口视角用尽、无新视角可换时，按"findings 跨一轮稳定为空"收敛（同小活），或预留一个对口视角（如指针有效性）作末轮新视角。

## 两个运行时怎么执行同一套（双栈中性）

编排写成**中性指令**（"并行开 N 个视角挑、汇总去重、回改到过、末轮换视角"），两个运行时各用原生机制执行、产出同一形状：

- **Claude Code**：用 **Workflow 工具**——`parallel` / `pipeline` fan out `agent(..., {agentType:'<reviewer>'})` 多实例，`label`/`phase` 分组，回改循环。
- **Codex**：用**原生多 agent 编排**（`multi_agent_v2`，`[agents] max_threads` 并发上限）——主 agent（总监）并行 spawn 同名双栈 reviewer 子 agent、等结果、汇总。`codex exec --json` 亦可 headless 跑。

> 差别只在"谁保证 fan out"：Claude Workflow 是脚本确定性、Codex 是主 agent 模型驱动——**编排指令一致**，都不许退回单 reviewer 一遍过。

## reviewer 子 agent 的角色

reviewer 子 agent（`.claude/agents/hc-*-reviewer.md` + `.codex/agents/hc-*-reviewer.toml` 双栈）**持有该域完整 rubric = 视角菜单**；被派时可能是"N 个并行视角之一"（按分配视角重点挑）、也可能独挑全 rubric（小活）。reviewer **只评不改**，回结构化清单（位置 / 严重度 / 问题 / 证据 / 修法）。约束本体在各 reviewer 上下文，本文只定编排、不复制判据。

## 边界

- 本文只管 review **步的编排**（怎么派、几个视角、怎么收敛）；**判据 / rubric** 归各 reviewer 子 agent、**流程位置**归各 skill 本体。
- 云端多 agent 深审（`/code-review ultra`）是另一条**用户触发、计费**的路，不归本 pattern、agent 起不了。
