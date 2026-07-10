---
name: hc-test
description: 编排式产出测试（而非实现）：测试总监（主 agent）按手上产物 + 到了哪一步自动选场景，调度专职 worker——e2e 用例 / api 用例 / 接口契约对照 / 测试脚本（写跑一体，ADR-0024）/ 回归（各线实现状态见 testing-flow）——带 默认编排 + 用户覆盖、worker→reviewer 回改 loop、两层覆盖防线。用户说「写测试用例 / 写 e2e 用例 / 写 api 用例 / 接口用例 / 测试覆盖 / 用例覆盖率 / 把验收点转成用例 / 写测试脚本 / 把用例落成脚本 / 做测试」时用。流程唯一真相源 = docs/harness/testing-flow.md（总纲）+ 分线文件；用例落 docs/test-cases/<id>/、脚本落工程内 test/<需求id>/，与实现体系松耦合。
version: 4
last_reviewed: 2026-07-08
---

# 编排式产出测试（hc-test）

本 skill = **测试总监总谱**（薄）：主 agent 当总监，按 `docs/harness/testing-flow.md`（**流程唯一真相源·总纲**）调度专职 worker 产出测试；**进哪条线先读对应分线文件**（`testing-flow-e2e.md` / `testing-flow-api.md` / `testing-flow-script.md`，ADR-0024）。同 `hc-prd`「默认编排 + 用户覆盖」、同 `hc-dev`「写 → 派 reviewer 挑刺 → 回改 loop」。依据 ADR-0014（脚本线 ADR-0024）。

> 本文不复制流程长叙述——各小节**引用总纲 / 分线文件对应小节**，改流程只动那里。

## ① 何时用 / 何时不用
- 用：把需求（AC / FP / US / PRD）或**接口来源**（接口契约 / 指定源）转成测试用例；管「用例对需求 / 接口覆盖全不全」；做 e2e 用例 / api 用例；**把用例落成可执行测试脚本并在 sandbox 调通**（写跑一体，ADR-0024）；（后续填空）接口契约对照 / 统一回归（各线实现状态见 `testing-flow.md`「场景 × 实现状态」）。
- 不用：**统一回归**（存量脚本池全量跑，占位未实现——脚本线内"跑通本需求"已含在写跑一体里，别混）；**产出**需求走 `hc-prd`；写 / 改实现走 `hc-dev`（脚本跑出**实现的 bug** 也回 `hc-dev` 修，本 skill 不改业务代码）；纯控制面 / 文档改动。

## ② 总监怎么派活
见 `testing-flow.md`「总监怎么派活」：
- **默认（A）**：按**手上产物 + 到了哪一步**自动选场景（有 PRD 先做 e2e 用例；有接口契约（或用户指定接口来源）才做 api 用例；开发彻底结束 + 有用例才写脚本）。
- **用户指令最高优先级**：随时点名做哪段 / 跳过哪段，覆盖默认（沿用 `hc-prd` 总监模式）。
- **每步解耦、可跳任意一步**：可以没用例、没脚本……都行。
- **进哪条线，先读对应分线文件**（约束主体在分线文件 + worker 上下文，本总谱不复制）。

## ③ 场景 × worker（实现状态以 testing-flow 为准）
**权威「场景 × 实现状态」表在 `testing-flow.md`（唯一真相源）**——本总谱**只列场景→worker 映射、不复刻状态列**（rule-0012：复刻状态会漂，已栽过）。哪些已实现 / 哪些占位、各自触发条件，全看那张表：

| 场景 | worker → reviewer |
|---|---|
| e2e 用例 | `hc-e2e-qa` → `hc-e2e-reviewer` |
| api 用例 | `hc-api-qa` → `hc-api-reviewer` |
| 接口契约对照 | 总监调度 |
| 测试脚本 | `hc-script-impl` → `hc-script-reviewer` |
| 统一回归 | 总监调度 |

> 已实现 / 占位与触发条件见 `testing-flow.md`「场景 × 实现状态」表 + 各分线文件——占位加时**填空、不重构** skill 形态。

## ④ 用例线编排（e2e / api）—— 写 → 审 → 回改
形态 = `hc-dev` 那套「写 → 派 reviewer 挑刺 → 回改 loop」；各线主体在分线文件（`testing-flow-e2e.md` / `testing-flow-api.md`）。**e2e 与 api 同构，只是输入源不同**，总监按此编排：

1. **取输入**：
   - **e2e**：需求，按 **AC > FP > US > PRD**（缺则略过、用现有的，不卡）。
   - **api**：**接口来源硬门槛**——① `api-contract.md`（`hc-tech-design` 产）＞ ② 用户指定源（proto / OpenAPI / 路由表 / 接口代码）＞ ③ **都无 → MUST STOP**（无源不臆造接口，rule-0008）。与 e2e「缺则略」不同、有硬地板。明细见 `testing-flow-api.md`。
2. **派 worker 写用例**：e2e 派 `hc-e2e-qa`（套 `templates/e2e-test-case.md`、每交互点 ×{成功,失败,边界}）、api 派 `hc-api-qa`（套 `templates/api-test-case.md`、与接口来源**一一对应**：每接口一用例、每业务异常各一 case）；预期锚唯一真实信号（rule-0009）、`covers:` 声明覆盖、**只写不跑**（rule-0014 管用例这种文档产物）。要求**写在 worker 子 agent 上下文里**，本总谱不复制、明细见对应分线文件。
3. **派 reviewer 审用例**：e2e 派 `hc-e2e-reviewer`、api 派 `hc-api-reviewer`（api reviewer 多一条「无接口来源硬产用例 → blocker」门槛复核 + 回契约原文对账）；**只评不改**，出结构化清单。
4. **回改 loop**：**多视角并行对抗**——fan out 对应 reviewer 多实例、各盯一个视角（覆盖 / 源符合 / 质量…）→ 汇总去重 → 总监派 worker 回改 → 复审 → **到覆盖齐、清单清零**（末轮换新视角防假收敛；编排 pattern = `docs/harness/adversarial-review.md`，ADR-0022，唯一真相源、引用不复制）。
5. **`test-cases-audit` 机检兜底**：结构层闸（e2e 覆盖矩阵完整性 / api 的 EP·EX ↔ `covers:` 双向闭合，带「无·理由」逃生口）跑通、`make verify` 绿。见下「两层防线」。
6. **提醒用户**：产物落 `docs/test-cases/<id>/`（登记不漂移）；明确告诉用户用例齐了、覆盖闸过了，**用例没跑**（脚本线才跑，见 ⑤）。

## ⑤ 脚本线编排（写跑一体，ADR-0024）—— 写 → sandbox 跑+修 → 审 → 入池
主体在 `testing-flow-script.md`（**做脚本先读它**），总监按此编排：
1. **门槛**：开发彻底结束 + `docs/test-cases/<id>/` 有用例（**没用例就停**，指路用例线，不凭空造 case）；sandbox 未接实（PENDING）→ 停下指路 `hc-create-sandbox`。
2. **派 `hc-script-impl`**（写+跑+修一体）：case 镜像用例（case 名锚 `TC-NN`+线别消歧——e2e/api 编号空间重叠，按线分目录或前缀）+ 抽共享基础动作层 → sandbox 卡门（up→status→跑→down）跑**本需求** case → 失败两分（**脚本 bug 改脚本 / 实现 bug 报总监回 `hc-dev`**，不为绿弱化断言）→ **全绿或如实归因才算完**（rule-0002/0003）。
3. **派 `hc-script-reviewer`** 审（只评不改）：**对齐**（case↔用例一一对照、断言忠于预期）+ **明显 bug**（空转断言 / 卡门缺失 / 硬编 / 顺序耦合）+ 运行报告如实性；多视角并行对抗（同 ④.4，pattern 引用不复制）→ 回改到零。
4. **交付入池**：脚本落**工程内** `projects/<工程>/test/<需求id>/`（每需求独立、helper 共享）；用例文档登记脚本路径（双向锚）；报告用户"本需求绿了、脚本已入回归资产池"——**统一回归是另一场景**（占位），本线不带过往全量。

派 worker / reviewer 怎么编排：Claude Code 用 workflow / Task（`agentType:'hc-e2e-qa'/'hc-api-qa'/'hc-script-impl'/…'` 对应 reviewer，会话模型）；Codex 用原生多 agent 派同名双栈。**宏观次序线性（写 → 审 → 回改）、审步多视角并行**（ADR-0022）；待多 worker 并行落地再补编排 `references/`，与 `hc-prd` 对齐。

## ⑥ 两层防线（不重叠）
权威表见各分线文件（e2e/api 分线的「两层覆盖防线」、script 分线的「两层防线」小节）：
- **用例线**：机器（`test-cases-audit`）查**结构**（e2e 覆盖矩阵 / api EP·EX 双向闭合 / `covers:` 无悬空，rule-0014）；reviewer 查**判断**（覆盖够不够、忠不忠、质量，考题 015 + rule-0009）。
- **脚本线**：机器 = **运行本身**（跑没跑通，运行输出即证据，rule-0002/0003）；reviewer 查**判断**（对齐 + 明显 bug，rule-0009 + ADR-0024）。

## ⑦ 门禁（rule-0014 / 考题 015 / 脚本线口径）
- 产出**测试用例**须满足 **rule-0014**（AC + FP 双轴全覆盖、`covers:` 唯一真相源、正常 / 边界 / 异常齐、登记不漂移；**用例只写不跑**）；结构由 `scripts/test-cases-audit.sh` 机检进 `make verify`；收尾跑 eval **考题 015**。
- 产出**测试脚本**口径 = ADR-0024：**写跑一体**（交付即调通或如实归因）——与 rule-0014 不冲突，两种产物各管各的。
- **不强制用例 / 脚本必须存在**（松耦合）——门禁只在产出时适用。

## ⑧ 演进（rule-0007）
编排 / 场景 / worker / 防线 / 门禁变化时回顾本 skill（连同 `hc-e2e-qa` / `hc-e2e-reviewer` / `hc-api-qa` / `hc-api-reviewer` / `hc-script-impl` / `hc-script-reviewer` 双栈子 agent、`templates/e2e-test-case.md` / `templates/api-test-case.md`、`scripts/test-cases-audit.sh`）；**流程实质改动改 `docs/harness/testing-flow.md`（总纲）或对应分线文件（唯一真相源，两层各管各），本总谱只跟引用**。改完同步 `version` / `last_reviewed`，跑 `bash scripts/skills-index.sh`。
