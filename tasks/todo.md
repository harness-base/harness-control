# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L3 ｜ task: test-script-line

## 当前：hc-test 脚本线做实 + testing-flow 拆分（用户逐点拍，2026-07-08）
- **用户拍的口径**：① 脚本放**工程里**（`projects/<工程>/test/<需求id>/`，每需求独立；基础动作库跨需求共享）；② **写和跑（调通）一体、回归独立**——三步：写脚本 → sandbox 里跑本需求 case + 修（脚本 bug 改脚本 / 实现 bug 报 hc-dev，全绿或如实归因才算完）→ 回归关联项（存量脚本池，独立场景、本批只留位不实现）；③ **case 镜像用例格式**（一条用例一个 case、case 名锚 TC-NN）+ 抽象共享基础动作层；④ worker 写（hc-script-impl）、reviewer 审**对齐 + 明显 bug**（hc-script-reviewer）；⑤ **testing-flow 拆分**：总纲 + 3 分线平铺 docs/harness/（testing-flow-{e2e,api,script}.md），收纳原则（私有→references / 共享→docs/harness）成文进 docs/README。
- [x] ADR-0024 定稿登记（index-audit 绿）
- [x] testing-flow 拆分：总纲 150→70 行 + testing-flow-{e2e,api}.md 原文搬移 + testing-flow-script.md 新写（三步/判据/卡门/双向锚/rule-0014 边界）
- [x] hc-script-impl + hc-script-reviewer 双栈 4 文件（workflow 建，TOML 校验过、约束主体进上下文、分工界线清）+ config 注册 + 三索引 regen
- [x] hc-test SKILL v4（⑤ 脚本线编排段/场景触发/两层防线/门禁口径/description）+ hc-dev v5 交棒口径
- [x] 指针跟改：8 文件（4 agent 双栈）改指分线（workflow 首轮漏 e2e-reviewer 双栈 2 处残留，对抗验证逮出已补）；doc-sync-checklist 加 testing-flow 拆分行；CURRENT_STATUS
- [x] docs/README 收纳原则成文（私有→references / 共享→docs/harness，判据=消费方范围）
- [x] make verify + docs-audit（61 篇）绿；optimization-log 本批 3 条捞获全销
- [x] 对抗验证（workflow 4 镜头）：搬移零丢失 clean；挖出 4 major+5 minor——**API-NN 是凭空口径**（api 用例编号其实也是 TC-n、e2e/api 编号空间重叠，两镜头独立逮）/ e2e-reviewer 双栈残留总纲指针 / hc-create-sandbox・process-coverage 还标脚本线占位 / 模板头注・ADR-0016 指已拆走的小节 / reviewer"篡改预期"与无 Write 自相矛盾 / "分阶段实现整体发布"句移除无交代
- [x] 修 9 findings 全链：锚改「TC-NN+线别消歧」（9 文件）；残留指针补；两 skill 状态翻转+version bump；模板头注指分线；ADR-0016 前向指针；reviewer 改不落盘反向验证；ADR-0024 受影响栏回填（create-sandbox/self-evolution 改"是"）+ 影响段交代定位句移除；checklist 引用方名单补 templates。make verify + docs-audit(61) + TOML 复验绿
- [x] 收尾 eval：**yellow → 1 warn 修平**（`docs/eval/task-reviews/20260709T103753Z-test-script-line/`；010/011/014/rule-0015 全 pass、搬移全段机械 diff 逐字节一致、9 项修复逐条核真、机检独立重跑绿；warn=ADR-0014 更新注"脚本线仍占位"同型第三处漏网 → 已加 0024 前向指针注 + related_docs）
- [ ] 提交独立 PR

## Review（test-script-line）
- **做了什么**：hc-test 脚本线做实（ADR-0024，用户拍：写跑一体三步——写[case 镜像用例锚 TC-NN+线别消歧、共享基础动作层]→sandbox 卡门跑本需求+修[脚本 bug 改脚本/实现 bug 报 hc-dev、全绿或如实归因]→入池[工程内 test/<需求id>/、回归资产]）+ testing-flow 拆分（总纲 70 行+3 分线、做哪线读哪份）+ hc-script-impl/hc-script-reviewer 双栈 + 收纳原则成文（私有→references/共享→docs/harness）。
- **对抗+eval 的价值**：对抗 4 镜头逮出 **API-NN 是凭空口径**（api 用例编号其实也是 TC-n、e2e/api 编号空间重叠——两镜头独立逮到，photo 上线第一天锚就会全断）+ 8 项漂移；eval 又逮同型第三处漏网（ADR-0014 更新注）——"状态翻转要扫全部复述点"这坑本批扫了三网（skill→references→旧 ADR 注）才净。
- **质量**：搬移经评委全段机械 diff 逐字节一致；机检（verify/docs-audit 61/skills-index/22 份 TOML）独立重跑绿；四层口径（SKILL↔总纲↔分线↔agent）一致。
