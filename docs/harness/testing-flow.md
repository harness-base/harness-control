---
title: 测试流程总纲（testing flow）
status: active
owner: harness
last_updated: 2026-07-08
source_files: []
related_docs:
  - testing-flow-e2e.md
  - testing-flow-api.md
  - testing-flow-script.md
  - ../decisions/0014-hc-test-orchestration.md
  - ../decisions/0024-test-script-line.md
  - ../superpowers/specs/2026-06-29-testing-flow-vision.md
---

# 测试流程总纲（testing flow）

> 测试全流程的**唯一真相源**。`hc-test` 总监 / 各测试子 agent / ADR 都**引用本文、不复制**——改流程只动这里。
> 北极星愿景见 [testing-flow-vision](../superpowers/specs/2026-06-29-testing-flow-vision.md)（`status: vision`，原始口述）；本文是**可执行总纲**。
> **结构（ADR-0024）**：本文只扛 定位 / 派活 / 时序 / 场景表 / 各线骨架；**各线细节分档到同目录分线文件，做哪条线读哪份**——`testing-flow-e2e.md` / `testing-flow-api.md` / `testing-flow-script.md`。

## 定位

- `hc-test` = **测试总监**（编排逻辑，**主 agent 当总监**），按本总纲调度专职子 agent。
- **贯穿原则：每步解耦、用户可跳过任意一步**（可以没用例、没脚本……都行）。

## 总监怎么派活

- **默认（A）：按手上产物 + 到了哪一步自动选场景**——有 PRD 先能做 e2e 用例；有研发方案 + 接口契约才做 api 用例；开发彻底结束才写脚本。
- **用户指令最高优先级**：随时点名做哪段 / 跳过哪段（覆盖默认）。沿用 `hc-prd` 总监"默认编排 + 用户覆盖"模式。
- **进哪条线，先读对应分线文件**（约束主体在分线文件 + 各 worker 上下文，本总纲不复制）。

## 全流程（目标态，按时序 + 依赖）

1. **PRD 产出后** → 可做 **e2e 用例**；**并行**产出**研发方案**（含接口契约）。
2. **研发方案产出后**（有接口契约）→ 可做 **api 用例**。
3. 用例产出 → **review 校验**。
4. **开发完成** + 有 routelist → **接口契约对照**。
5. **开发彻底结束** → **测试脚本**（api + e2e，**写跑一体**：写 → sandbox 跑本需求 + 修 → 交付入池）。
6. 脚本入池 → **统一回归**（先本需求、再统一，不一上来跑带过往的全量）→ 不通过 → 回改到通过。

## 场景 × 实现状态

| 场景 | 触发 | worker → reviewer | 状态 | 分线文件 |
|---|---|---|---|---|
| e2e 用例 | 有 PRD | `hc-e2e-qa` → `hc-e2e-reviewer` | ✅ 已实现 | `testing-flow-e2e.md` |
| api 用例 | 有接口契约（或用户指定接口来源） | `hc-api-qa` → `hc-api-reviewer` | ✅ 已实现（ADR-0016） | `testing-flow-api.md` |
| 接口契约对照 | 开发完成 + routelist | 总监调度 | 🔒 占位 | —（见下） |
| 测试脚本 | 开发彻底结束 + 有用例 | `hc-script-impl` → `hc-script-reviewer` | ✅ 已实现（ADR-0024，写跑一体） | `testing-flow-script.md` |
| 统一回归 | 脚本池就绪 | 总监调度 | 🔒 占位 | —（见下） |

> 占位 = 全量设计已留位，加时**填空、不重构** skill 形态。

## 各线一句话骨架（细节进分线文件）

- **e2e 用例线**：按 AC > FP > US > PRD 取输入（缺则略过不卡）→ `hc-e2e-qa` 写用例（交互点 ×{成功,失败,边界} 全覆盖、只写不跑）→ `hc-e2e-reviewer` 审 → 机检 `test-cases-audit` 兜结构。**读 `testing-flow-e2e.md`**。
- **api 用例线**：接口来源硬地板（契约 > 用户指定源 > 都无 MUST STOP）→ `hc-api-qa` 写用例（与来源一一对应、只写不跑）→ `hc-api-reviewer` 审（含回契约对账）→ 机检兜双向闭合。**读 `testing-flow-api.md`**。
- **脚本线**：三步**写跑一体**——写（case 镜像用例、锚 TC-NN+线别消歧、抽共享基础动作层）→ sandbox 跑本需求 + 修（脚本 bug 改脚本 / 实现 bug 报 `hc-dev`；全绿或如实归因才算完）→ 交付入池（工程内 `test/<需求id>/`、每需求独立、用例↔脚本双向登记）。**读 `testing-flow-script.md`**。

## 接口契约对照（占位·开发完成 + routelist）

- routelist 新增接口 vs 接口契约是否一致；不一致 → 复核根因：**契约不足** → 补契约 + 补用例；**实现不足** → 补实现。

## 回归（占位）

- 跑**存量脚本池**（脚本线交付物）：先本需求、再统一回归；**不一上来跑带过往的全量**。不通过 → 回改到通过。

## 引用约定

- 各 skill / 子 agent / ADR **引用本文（总纲）或对应分线文件，不复制**流程叙述。改流程：时序 / 场景表 / 骨架动本文，某线细节动对应分线文件——**两边都是真相源、各管各层，不互相复刻**。
