---
title: ADR-0024 hc-test 脚本线做实（写跑一体、回归独立）+ testing-flow 拆分（总纲+分线）
status: accepted
date: 2026-07-08
last_updated: 2026-07-08
source_files:
  - ../harness/testing-flow.md
  - ../harness/testing-flow-script.md
related_docs:
  - 0014-hc-test-orchestration.md
  - 0019-hc-create-sandbox.md
  - 0022-adversarial-review-parallel.md
---

# ADR-0024：hc-test 脚本线做实（写跑一体、回归独立）+ testing-flow 拆分（总纲+分线）

## 背景

testing-flow 第 5 步「测试脚本」自 ADR-0014 起占位（`hc-script-impl` → `hc-script-reviewer` 位置已留）；前置已全就绪——sandbox 契约 + 接实路径（ADR-0019）、hc-dev 编排（ADR-0021）、多视角 review pattern（ADR-0022）。同时 testing-flow.md 已 150 行（e2e 线 44 行 + api 线 41 行细节全内联），再塞脚本线奔 200+，而总监一次任务只做一条线、每次全读是白吃上下文——与 hc-onboard 拆分（SKILL 骨架 + references 分档）同款问题，但 testing-flow 是**跨 skill 共享真相源**（4 个 worker/reviewer 双栈、SANDBOX_CONTRACT、上下游 skill 都指它），拆分后仍须留在 `docs/harness/`。

## 决策（用户逐点拍，2026-07-08）

1. **脚本落工程内**：`projects/<工程>/test/<需求id>/`——脚本是可执行代码，吃工程环境/依赖；**每需求独立目录**（不和过往混）；**基础动作库跨需求共享**（如 `test/lib/`，位置按工程惯例）——"每需求独立"指 case 集，helper 每需求抄一份才是灾难。用例文档登记对应脚本路径（用例↔脚本双向可查）。
2. **写与跑（调通）一体、回归独立**——脚本线三步：
   - ① **写脚本**：case 镜像用例格式（一条用例一个 case、case 名锚 `TC-NN` **+ 线别消歧**——e2e/api 用例编号都是 `TC-n`、空间重叠，脚本按线分目录 `{e2e,api}/` 或 case 名前缀区分）、断言照用例"预期"栏；底层抽**共享基础动作层**（api：请求构造/鉴权/断言 helper；e2e：开页/点击/填表/等待），case 只写业务动作序列。
   - ② **跑 + 修**：在 sandbox 里（`up` → `status` exit 0 才跑，SANDBOX_CONTRACT 运行时卡门）跑本需求 case；失败分两类——**脚本的问题改脚本；实现的问题不改脚本、报出去回 `hc-dev`**（脚本挖到真 bug 是它的功劳）。**本需求全绿（或如实报告残留失败 + 归因）才算这步完**——没跑过的测试脚本大概率是坏的，交付"没验证过的验证工具"= 假完成（rule-0002 精神）。
   - ③ **回归关联项**：本需求绿后跑**过往需求的存量脚本池**，确认本次改动没砸以前的功能；不过回改到过。**独立场景（第 6 步）、本批只留位不实现**。
   - 脚本因此是**可复用回归资产**而非一次性验证：每需求独立目录 + 锚用例 + 共享 helper，写完即入池。
3. **与 rule-0014 的边界**：rule-0014 的"只写不跑"管的是**用例**（markdown 文档产物）；脚本是另一种产物（可执行代码），口径是**写跑一体**——两者不冲突，各管各的产物。
4. **worker / reviewer**：`hc-script-impl`（写 + 跑 + 修，双栈）；`hc-script-reviewer`（只评不改，双栈）审两块——**对齐**（case ↔ 用例一一对照齐不齐、断言忠不忠于用例预期、有没有漏 case / 幽灵 case）+ **明显 bug**（断言空转 / 假绿、共享 helper 误用、sandbox 卡门缺失、硬编端口/环境）。review 步走多视角并行对抗（ADR-0022 pattern）。
5. **testing-flow 拆分**：总纲（`testing-flow.md`，~70 行：定位/派活/时序/场景表/各线骨架+指针）+ 3 个分线文件**平铺** `docs/harness/`（`testing-flow-e2e.md` / `testing-flow-api.md` / `testing-flow-script.md`）——做哪条线读哪份；平铺不建子目录（dir-index 只扫本层，平铺自动进索引、机制零改动）。e2e/api 两分线为**原文搬移**（内容零改动）。
6. **收纳原则成文**（进 `docs/README.md`）：**只有单个 skill 自己用的细节 → 该 skill 的 `references/`（私有）；被多个 skill / 子 agent / 契约引用的 → `docs/harness/`（共享真相源）**——此前是事实惯例（hc-prd references vs testing-flow/SANDBOX_CONTRACT），本次明文化。

## 受影响的 skill（rule-0007）
- skill：hc-test ／ 是否已更新：是（场景表脚本线 🔒→✅、编排段接脚本线三步、description、version bump）
- skill：hc-dev ／ 是否已更新：是（⑦ 收尾交棒"脚本线/回归占位"口径跟新状态——脚本线已实现、回归仍占位）
- skill：hc-create-sandbox ／ 是（① "hc-test 脚本线占位中"翻转为已实现，version bump）
- skill：hc-self-evolution ／ 是（references/process-coverage.md 三处脚本线状态刷新为已实现/指针化）
- skill：hc-prd / hc-tech-design / hc-onboard / hc-add-rule ／ 否（不复述 testing-flow 分线内容；引用总纲路径未变不悬空）
- 连带：新 `hc-script-impl` + `hc-script-reviewer` 双栈（`.claude/agents/*.md` + `.codex/agents/*.toml` + config 注册 + agents 索引 regen）；4 个现有 worker/reviewer 双栈（8 文件）"明细见 testing-flow.md 对应小节"指针改指对应分线文件；`SANDBOX_CONTRACT.md` 卡门指向若提小节则跟；`doc-sync-checklist` testing-flow 相关行跟拆分口径；`CURRENT_STATUS`；`docs/README.md`（收纳原则 + harness 路由描述）；`templates/{e2e,api}-test-case.md` 头注改指分线；ADR-0016 加前向指针更新注（api 线小节已拆走）；docs/harness dir-index regen。

## 备选方案

- **脚本落产物区 `docs/test-cases/<id>/scripts/`**——否决：脚本要吃工程环境/依赖才能跑，产物区是 markdown 账本；kratos 先例（`test/resilience/run_all.sh`）也在工程内。
- **写与跑拆成两个场景**——否决（用户裁）：没跑过的脚本交付等于假完成；"先本需求再统一"的前半段本来就发生在写的阶段。回归（统一跑存量池）保持独立。
- **testing-flow 拆进 hc-test 的 `references/`**——否决：它是跨 skill 共享真相源（4 worker 双栈 + SANDBOX_CONTRACT + hc-dev/hc-prd 都指它），进私有目录会让别的 skill 依赖 hc-test 的内部结构（收纳原则，决策 6）。
- **分线文件建子目录 `docs/harness/testing-flow/`**——否决：dir-index 只扫本层 `.md`，子目录要给索引机制开洞；平铺零改动。

## 影响

- 测试工具链五场景对三（e2e 用例 / api 用例 / 脚本 ✅；契约对照 / 回归 🔒）；脚本产出直接形成回归资产池，为第 6 步回归线铺路。**ADR-0014「分阶段实现、整体发布」的三件套（e2e + api + 脚本）至此实现齐，该定位句完成使命、从总纲移除**——后续增强场景（契约对照 / 回归）的实况由场景表状态承载，不再有"未发布 WIP"态。
- 总监上下文成本降：进哪条线读哪份分线文件，不再全读 150+ 行。
- 收纳原则明文化后，新 skill 的细节归属不再靠悟。
