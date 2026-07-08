---
title: ADR-0022 所有 review 步统一为多视角并行对抗（双栈中性、单一真相源）
status: accepted
date: 2026-07-08
last_updated: 2026-07-08
source_files: []
related_docs:
  - ../harness/adversarial-review.md
  - 0021-hc-dev-orchestration.md
  - 0009-dev-skill.md
---

# ADR-0022：所有 review 步统一为多视角并行对抗（双栈中性、单一真相源）

## 背景

各 skill 的 review 步（"派 reviewer 对抗挑刺 → 回改到过"）**只有 `hc-dev` 已是多实例多视角并行**（SKILL ⑤：派 hc-code-reviewer 多视角对抗、循环到零），其余 6 个（`hc-prd` / `hc-tech-design` / `hc-onboard` / `hc-test` / `hc-create-sandbox` / `hc-add-rule`）仍是**单 reviewer 一遍过**。单线程 review 有两个实证弱点：① 一个视角容易漏；② **"单轮零 = 假收敛"**——本仓 kratos S4–S6 亲历：单轮挑干净、换怀疑视角又挖出 36+ 真问题。

用户点名：review 不许单线程扫一遍，**全改、关联处一起改**。并明确走 **Codex 原生（模型驱动）**——查证 Codex 原生支持多 agent 并行编排（`multi_agent_v2` + `[agents] max_threads`，headless `codex exec --json`），故无需为 Codex 从零造 workflow 原语，用中性编排指令即可两栈同跑。

## 决策

1. **抽单一真相源** `docs/harness/adversarial-review.md`：定"多视角并行对抗 review"pattern（fan out N 个**相异视角** reviewer 并行 → 每条独立证伪 → 汇总去重 → 回改 → 迭代到一轮干净、**末轮换新视角防假收敛**；按改动面伸缩）。
2. **7 个 skill 的 review 步引用本 pattern、不复制**——`hc-dev` ⑤（已多视角）改为指针；其余 6 个从单 reviewer **升级**为引用 pattern。
3. **双栈中性**：编排写成中性指令，Claude Code 用 Workflow 执行、Codex 用原生多 agent（`max_threads`）执行，产出同一形状；**都不许退回单 reviewer 一遍过**。
4. **reviewer 子 agent 持 rubric = 视角菜单**：8 个产出型 skill review 步的 reviewer 双栈各加一句"可能作为 N 个并行视角之一被派"的定性，rubric 本体不动（`hc-doc-sync-reviewer` 是钩子驱动的文档漂移检查、非产出型 skill 的评审步，不在本 pattern 内）。

## 受影响的 skill（rule-0007）
- skill：hc-dev ／ 是否已更新：是（⑤ 挑刺步保留原多视角措辞、追加 `adversarial-review.md` 真相源指针）
- skill：hc-prd ／ 是否已更新：是（review 步单→多视角，引用 pattern）
- skill：hc-tech-design ／ 是否已更新：是（⑥ 评审步单→多视角，引用 pattern）
- skill：hc-onboard ／ 是否已更新：是（⑥ 对抗评审单→多视角，引用 pattern）
- skill：hc-test ／ 是否已更新：是（review loop 单→多视角，引用 pattern）
- skill：hc-create-sandbox ／ 是否已更新：是（对抗评审步单→多视角，引用 pattern）
- skill：hc-add-rule ／ 是否已更新：是（对抗巡查步单→多视角，引用 pattern）
- 连带：8 个 reviewer 子 agent 双栈（`hc-code`/`prd`/`tech-design`/`onboard`/`e2e`/`api`/`sandbox`/`rule`-reviewer 的 `.claude/agents/*.md` + `.codex/agents/*.toml`）加视角定性；`doc-sync-checklist` 加行（改 pattern → 回查引用它的 skill）；`CURRENT_STATUS` 控制面表提一句。（`hc-doc-sync-reviewer` 不在内——钩子驱动、非产出型 skill 评审步。）

## 备选方案

- **给 Codex 从零造 workflow 脚本编排器**（headless `codex exec --json` fan out）——真·确定性对等，但要建要维护；用户选先走 Codex 原生（模型驱动），本 ADR 采之。脚本编排器留作未来若原生不可靠再上的选项（不锁死）。
- **只改落后的 6 个 skill、不抽真相源**——会各写一份多视角措辞、必漂（rule-0012 同款风险）；否决，抽单一真相源引用。
- **维持现状（只 hc-dev 多视角）**——用户明确否决"单线程扫一遍"。

## 影响

- review 质量下限抬高：所有产出型 skill 收尾都走多视角并行 + 防假收敛，不再靠单 reviewer 一遍。
- 双栈一致：Claude / Codex 同一套编排指令，Codex 侧用原生多 agent 落地（补齐此前"Codex 只单 reviewer"的对等短板）。
- 成本上升：review 步并发多个 reviewer 实例（token / 时延）——按改动面伸缩（小活 1–2 视角）控本。
- 单一真相源：改 review 编排只动 `adversarial-review.md`，7 skill 自动跟随、不漂。
