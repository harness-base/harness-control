---
title: ADR-0027 统一回归线做实——跑存量脚本池、失败归因两分、复用 hc-script-impl
status: accepted
date: 2026-07-10
last_updated: 2026-07-10
source_files:
  - ../harness/testing-flow-regression.md
related_docs:
  - 0024-test-script-line.md
  - 0026-contract-check-line.md
---

# ADR-0027：统一回归线做实——跑存量脚本池、失败归因两分、复用 hc-script-impl

## 背景

testing-flow 第 6 步「统一回归」自 ADR-0014 起占位；其消费的**存量脚本池**由脚本线（ADR-0024）建立——每需求独立目录 `projects/<工程>/test/<需求id>/`、写跑一体入池。池子的生产端就绪后，消费端（回归）是测试链最后一块占位。用户口径（2026-07-08 捋定三步之第 3 步）："回归关联项——跑过往需求的存量脚本，确认这次改动没砸以前的功能，不过就回改到过。"

## 决策（用户拍板，2026-07-10"回归线也做"）

1. **回归 = 消费存量脚本池**：盘点 `test/` 下全部需求目录（**目录即池子清单**，不另维护清单文件）→ sandbox 卡门（同脚本线：up→status exit 0 才跑→down；PENDING 指路 `hc-create-sandbox`）→ **逐需求顺序跑**（防环境状态互染；"每需求独立"纪律在此兑现）→ 汇总报告（每需求 pass/fail，运行输出为证据，rule-0002/0003）。
2. **失败归因两分**：**脚本过时**（需求演进的预期效果、旧断言没跟上）→ 派 `hc-script-impl` 更新旧脚本（锚新预期、不为绿弱化断言）；**实现回归**（意外破坏旧功能）→ 报 `hc-dev` 修实现、脚本不动；分不清 → 回用例/PRD 对照"旧行为该不该保持"，再分不清**问用户**（rule-0008）。修复后重跑到过。
3. **先本需求、再统一**的分工：本需求调绿归脚本线（写跑一体已含）；本线只管"统一"半边——不拿全量回归替代本需求调通。
4. **编制**：总监调度；跑 + 修脚本**复用 `hc-script-impl`**（其能力域），**不新建 worker**。
5. 落 `docs/harness/testing-flow-regression.md` 分线（与其余四线对称）；至此 **testing-flow 五场景全部实现**。

## 受影响的 skill（rule-0007）
- skill：hc-test ／ 是（① 何时用[回归从"不用"挪"用"] + ③ 映射行注 + 编排段 + ⑧ 连带，与契约对照同批 v5）
- skill：hc-dev / hc-prd / hc-tech-design / hc-onboard / hc-create-sandbox / hc-add-rule / hc-self-evolution ／ 否（不复述回归细节；hc-dev ⑦ 交棒的"统一回归占位"句跟翻已实现）
- 连带：`testing-flow.md`（场景表翻 ✅ + 骨架 + 回归小节改指分线 + related_docs）；`testing-flow-script.md`（入池句的"回归占位"翻已实现）；`hc-script-impl` 双栈（同句）；`doc-sync-checklist`（分线枚举加 regression）；`CURRENT_STATUS`（五场景全实现）；ADR-0014 前向指针注（0027）；docs/harness dir-index + skills-index regen。

## 备选方案

- **为回归新建 worker（hc-regression-runner）**——否决：跑+修脚本就是 hc-script-impl 的能力域，回归只是换个时机消费同一池子；一次性对照/跑池任务由总监调度即可（同契约对照先例）。
- **另维护池子清单文件**——否决：`test/` 下需求目录本身就是清单（目录即真相），另维护必漂（rule-0012 同款）。
- **并行跑各需求**——否决（本期）：case 间共享 sandbox 环境状态，并行互染风险大于速度收益；池子大到顺序跑不动时再议（届时或按需求粒度起隔离环境）。

## 影响

- **testing-flow 五场景全实现**（e2e 用例 / api 用例 / 契约对照 / 脚本 / 回归），测试工具链收官；"分阶段实现"至此全齐。
- 回归资产池形成生产（脚本线）→ 消费（回归线）闭环；新需求入池即自动纳入下次回归覆盖面。
