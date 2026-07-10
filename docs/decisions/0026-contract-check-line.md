---
title: ADR-0026 接口契约对照线做实——routelist 接入点（脚本取数）+ agent 对比判断
status: accepted
date: 2026-07-10
last_updated: 2026-07-10
source_files:
  - ../harness/testing-flow-contract-check.md
  - ../../scripts/verification-audit.sh
related_docs:
  - 0024-test-script-line.md
  - 0017-hc-onboard-project-onboarding.md
---

# ADR-0026：接口契约对照线做实——routelist 接入点（脚本取数）+ agent 对比判断

## 背景

testing-flow 第 4 场景「接口契约对照」自 ADR-0014 起占位：开发完成后把实现侧实际暴露的接口和设计契约（`api-contract.md`）对账，抓"契约有实现无（实现不足）/ 实现有契约无（野接口或漏记）/ 形态对不上"。占位期设想依赖 routelist 但未定义其来源。

## 决策（用户拍板，2026-07-10）

1. **偏脚本验证的场景——取数用脚本、判断用 agent**：路由导出由**脚本**实现（确定性、可重复、可审计）；agent 只做**对比判断**（读契约端点索引 ↔ 脚本输出清单，语义对齐——容忍 `:id` vs `{id}` 等写法差异、gRPC↔HTTP 映射）。**agent 临场读代码提取被否**（不确定、不可重复）；**机械 diff 也被否**（契约是 markdown 端点表格、清单是纯文本行，格式不同；解析 markdown 的脚本是仓里栽过的裸 grep 坑）。agent 对比该量级（契约几十端点、清单百行内）不重。
2. **`routelist` 成为新接入点**：进 `workspace/verification.yaml`（登记"导出实现侧接口清单的命令"，输出约定一行一个接口），守三态（真命令 / `PENDING:` / `N/A: 无对外接口`）；`verification-audit` 机检扩认 + 守护测试（mutation 自证）。
3. **hc-onboard 补"routelist 能力创建"**（新老两分支的接执行口步骤）：新项目问"接口定义在哪（proto / OpenAPI / 路由注册）、怎么导最稳"，用户拍了落导出脚本；老项目发现现有导出方式对齐。onboard-reviewer 双栈判据④的必须接入点七个 → 八个。
4. **对照场景门槛两查**（查登记不猜）：契约不存在 → 跳过（松耦合"缺则略"）；`routelist` PENDING → 指路补脚本、N/A → 跳过留痕。两查都过 → 跑脚本取数 → agent 对比 → 偏差三类 + 归因分发（补实现→hc-dev / 补契约→hc-tech-design+api 用例线）。**总监调度、不新建 worker**。
5. **kratos 存量**：`routelist` 先 `PENDING: 待写 proto 解析脚本`（诚实占位，同 sandbox_status 先例）。

## 受影响的 skill（rule-0007）
- skill：hc-test ／ 是（① 何时用 + ③ 映射行 + 新 ⑥ 契约对照编排段[对抗修复轮重排编号 ④⑤⑥⑦⑧⑨⑩] + ⑩ 连带 + description，v5）
- skill：hc-onboard ／ 是（references 新老两分支第 4 步补 routelist + SKILL ③ 第 4 步骨架句 + ⑤ 三态枚举，v7）
- skill：hc-dev ／ 是（⑦ 交棒的各线状态句跟翻——对抗验证逮出"占位"残留，与回归线同批改为五场景全实现指针）
- skill：hc-self-evolution ／ 是（references/process-coverage 缺口清单摘除契约对照与统一回归[对抗修复轮]；references/project-onboarding 路由枚举补 routelist）
- skill：hc-prd / hc-tech-design / hc-create-sandbox / hc-add-rule / hc-git-workflow ／ 否（不复述本场景细节；hc-dev 的"实现↔契约对账"是 review 判据层、与本场景互补不冲突——分工写进分线文件）
- 连带：新 `docs/harness/testing-flow-contract-check.md`（分线真相源）；`testing-flow.md`（场景表翻状态 ✅ + 骨架 + 占位小节删 + related_docs）；`workspace/verification.yaml`（routelist 字段说明 + 示例 + kratos PENDING）；`scripts/verification-audit.sh` + `.test.sh`（扩认 + 2 用例）；`hc-onboard-reviewer` 双栈（八个必须接入点）；`doc-sync-checklist`（testing-flow 行分线枚举）；`CURRENT_STATUS`；`VERIFICATION_ROUTING`（routelist 条目）；**对抗修复轮 sweep 连带**：`PROJECT_ONBOARDING`、`templates/project-agents.md`、`scripts/README.md`（audit 行）、hc-onboard references 两分支「落什么」枚举、reviewer 双栈三处硬动作枚举、`projects/kratos-base/AGENTS.md` 待补记录、ADR-0014 前向指针注（0026/0027）、总纲时序第 4 步口径；docs/harness dir-index + skills-index regen。

## 备选方案

- **agent 按优先级临场提取 routelist（含读路由注册代码兜底）**——否决（用户裁）：取数不确定（"可能漏"）、不可重复；确定性的取数环节脚本化，agent 留给语义判断——与两层防线（机器管结构 / agent 管判断）同构。
- **脚本先做集合 diff、agent 只看差异**——否决（用户戳穿）：契约与清单格式不同，机械 diff 需先写解析 markdown 的脚本（栽过的坑）；agent 对比该量级不重且语义对齐正是其强项。
- **要求工程开发 routelist API/功能**——否决：不需要，导出脚本读 proto / OpenAPI / 路由注册即可，onboard 时顺手建，对工程零侵入。

## 影响

- 测试工具链五场景对四（e2e / api 用例、脚本、契约对照 ✅；统一回归 🔒 最后一块）。
- 必须接入点 7→8（routelist；含可选 reset/seed 的机检认定字段 9→10），onboard 的接执行口覆盖"接口清单可导出"能力。
- "取数用脚本、判断用 agent"的分工首次成文，后续同类场景（依赖清单、schema 清单）可复用此模式。
