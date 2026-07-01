---
name: hc-test
description: 编排式产出测试（而非实现）：测试总监（主 agent）按手上产物 + 到了哪一步自动选场景，调度专职 worker——e2e 用例 / api 用例 / 接口契约对照 / 测试脚本 / 回归（各线实现状态见 testing-flow）——带 默认编排 + 用户覆盖、worker→reviewer 回改 loop、两层覆盖防线。用户说「写测试用例 / 写 e2e 用例 / 写 api 用例 / 接口用例 / 测试覆盖 / 用例覆盖率 / 把验收点转成用例 / 做测试」时用。流程唯一真相源 = docs/harness/testing-flow.md；产物独立落 docs/test-cases/<id>/，与实现体系松耦合。
version: 2
last_reviewed: 2026-07-01
---

# 编排式产出测试（hc-test）

本 skill = **测试总监总谱**（薄）：主 agent 当总监，按 `docs/harness/testing-flow.md`（**流程唯一真相源**）调度专职 worker 产出测试。同 `hc-prd`「默认编排 + 用户覆盖」、同 `hc-dev`「写 → 派 reviewer 挑刺 → 回改 loop」。依据 ADR-0014。

> 本文不复制流程长叙述——各小节**引用 `testing-flow.md` 对应小节**，改流程只动那里。

## ① 何时用 / 何时不用
- 用：把需求（AC / FP / US / PRD）或**接口来源**（接口契约 / 指定源）转成测试用例；管「用例对需求 / 接口覆盖全不全」；做 e2e 用例 / api 用例 / 测试覆盖；（后续填空）接口契约对照 / 脚本 / 回归（各线实现状态见 `testing-flow.md`「场景 × 实现状态」）。
- 不用：要「跑用例 / 看过没过」（执行结果，本 skill 不碰，见 `testing-flow.md`「e2e 用例线」「只写用例、不跑」）；**产出**需求走 `hc-prd`；写 / 改实现走 `hc-dev`；纯控制面 / 文档改动。

## ② 总监怎么派活
见 `testing-flow.md`「总监怎么派活」：
- **默认（A）**：按**手上产物 + 到了哪一步**自动选场景（有 PRD 先做 e2e 用例；有接口契约（或用户指定接口来源）才做 api 用例；开发彻底结束才写脚本）。
- **用户指令最高优先级**：随时点名做哪段 / 跳过哪段，覆盖默认（沿用 `hc-prd` 总监模式）。
- **每步解耦、可跳任意一步**：可以没用例、没脚本……都行。

## ③ 场景 × worker（实现状态以 testing-flow 为准）
**权威「场景 × 实现状态」表在 `testing-flow.md`（唯一真相源）**——本总谱**只列场景→worker 映射、不复刻状态列**（rule-0012：复刻状态会漂，已栽过）。哪些已实现 / 哪些占位、各自触发条件，全看那张表：

| 场景 | worker → reviewer |
|---|---|
| e2e 用例 | `hc-e2e-qa` → `hc-e2e-reviewer` |
| api 用例 | `hc-api-qa` → `hc-api-reviewer` |
| 接口契约对照 | 总监调度 |
| 测试脚本 | `hc-script-impl` → `hc-script-reviewer` |
| 统一回归 | 总监调度 |

> 已实现 / 占位与触发条件见 `testing-flow.md`「场景 × 实现状态」表 + 各线小节——占位加时**填空、不重构** skill 形态。

## ④ 用例线编排（已实现：e2e / api）—— 写 → 审 → 回改
形态 = `hc-dev` 那套「写 → 派 reviewer 挑刺 → 回改 loop」；各线主体在 `testing-flow.md`（「e2e 用例线」/「api 用例线」小节）。**e2e 与 api 同构，只是输入源不同**，总监按此编排：

1. **取输入**：
   - **e2e**：需求，按 **AC > FP > US > PRD**（缺则略过、用现有的，不卡）。
   - **api**：**接口来源硬门槛**——① `api-contract.md`（`hc-tech-design` 产）＞ ② 用户指定源（proto / OpenAPI / 路由表 / 接口代码）＞ ③ **都无 → MUST STOP**（无源不臆造接口，rule-0008）。与 e2e「缺则略」不同、有硬地板。明细见 `testing-flow.md` 对应小节。
2. **派 worker 写用例**：e2e 派 `hc-e2e-qa`（套 `templates/e2e-test-case.md`、每交互点 ×{成功,失败,边界}）、api 派 `hc-api-qa`（套 `templates/api-test-case.md`、与接口来源**一一对应**：每接口一用例、每业务异常各一 case）；预期锚唯一真实信号（rule-0009）、`covers:` 声明覆盖、**只写不跑**。要求**写在 worker 子 agent 上下文里**，本总谱不复制、明细见 `testing-flow.md`。
3. **派 reviewer 审用例**：e2e 派 `hc-e2e-reviewer`、api 派 `hc-api-reviewer`（api reviewer 多一条「无接口来源硬产用例 → blocker」门槛复核 + 回契约原文对账）；**只评不改**，出结构化清单。
4. **回改 loop**：reviewer 挑问题 → 总监派对应 worker 回改 → 复审 → **到覆盖齐、清单清零**（同 `hc-dev` 对抗 review 循环到零）。
5. **`test-cases-audit` 机检兜底**：结构层闸（e2e 覆盖矩阵完整性 / api 的 EP·EX ↔ `covers:` 双向闭合，带「无·理由」逃生口）跑通、`make verify` 绿。见下「两层防线」。
6. **提醒用户**：产物落 `docs/test-cases/<id>/`（登记不漂移）；明确告诉用户用例齐了、覆盖闸过了，**用例没跑**（执行另起）。

派 worker / reviewer 怎么编排：Claude Code 用 workflow / Task（`agent(..., {agentType:'hc-e2e-qa'/'hc-e2e-reviewer'/'hc-api-qa'/'hc-api-reviewer'})` 循环，会话模型）；Codex 派同名双栈 worker。**e2e / api 均单 worker 线性 loop（写→审→回改），无独立 `references/` 编排模板文件——同 `hc-dev`**；待脚本 / 多 worker 并行落地再补 `references/`，与 `hc-prd` 对齐。

## ⑤ 两层覆盖防线（不重叠）
权威表见 `testing-flow.md`「两层覆盖防线」：
- **机器**（`test-cases-audit`）查**结构**：**e2e** 覆盖矩阵格子填没填 / 标没标（带「无·理由」逃生口，空着没理由 = 红）、**api** 的 `EP`/`EX` ↔ `covers:` 双向闭合（每接口 / 业务异常都被覆盖、covers 不悬空不臆造）、`covers:` 闭合无悬空。判据 rule-0014。
- **`hc-e2e-reviewer`** 查**判断**：覆盖够不够、懂没懂源、忠不忠、质量牵不牵强。判据 考题 015 + rule-0009。
- 机器查结构、reviewer 查判断，分工不重叠。

## ⑥ 门禁（rule-0014 / 考题 015）
- 产出测试用例须满足 **rule-0014**（测试用例产出标准：AC + FP 双轴全覆盖、`covers:` 唯一真相源、正常 / 边界 / 异常齐、登记不漂移）。
- 结构 / 覆盖闭合由 `scripts/test-cases-audit.sh` 机检（+ 守护测试），进 `make verify`。
- 收尾跑 eval **考题 015**（用例真覆盖语义 + 边界异常齐）。
- **不强制测试用例必须存在**（松耦合）——门禁只在产出时适用。

## ⑦ 演进（rule-0007）
编排 / 场景 / worker / 防线 / 门禁变化时回顾本 skill（连同 `hc-e2e-qa` / `hc-e2e-reviewer` / `hc-api-qa` / `hc-api-reviewer` 双栈子 agent、`templates/e2e-test-case.md` / `templates/api-test-case.md`、`scripts/test-cases-audit.sh`）；**流程实质改动改 `docs/harness/testing-flow.md`（唯一真相源），本总谱只跟引用**。改完同步 `version` / `last_reviewed`，跑 `bash scripts/skills-index.sh`。
