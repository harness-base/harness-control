# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L3 ｜ task: test-case-skill

## 当前：test-case-skill（设计中 / brainstorming）—— 加一个独立的"测试用例"skill

**已与用户定：**
- 定位：**产出测试用例 + 管"用例对需求/AC 的覆盖率"**；**不碰"过没过"**（执行结果）；真跑 / 执行脚本是后面单独一段（另一 skill/机制）。
- 覆盖率指"用例对需求的覆盖"，不是跑出来的代码覆盖率。
- **覆盖强度：软+硬，按"机器查不查得了"分层** —— 硬闸（`make verify` 红）卡存在性/完整性：映射表在 + 每条 AC、每个 FP 都被 ≥1 case 引用；软（对抗评审自查）卡质量：case 是否真覆盖该 AC/FP 的语义与边界。同 rule-0009 / doc-sync"机检兜得了的硬、兜不了的人审"。
- **覆盖锚点：AC + 功能点 FP。**
- **定位：独立 skill**——AC/FP 当通用输入，跟上游(prd-elicitation)/下游(feature-delivery)怎么衔接**后面再说**；硬闸只卡产物**自身内部完整性**（不跨文件核 user-stories.md）。
- **产物落 `docs/test-cases/<id>/`**（独立账本，平行 docs/prds/），套新建 `templates/test-case.md`：AC/FP 清单 + 用例(`covers:`) + 映射表（**从 covers 自动生成/交叉校验**，单一来源防漂）。
- **立 rule-0014 + eval 题 015**（产出用例标准：AC+FP 全覆盖 / 软硬分层 / 登记不漂）。

**设计已批准（用户："提交完那就写吧"），已实现 + make verify 绿。** 产物清单：
- [x] `templates/test-case.md`（AC/FP 清单 + 用例 `covers:` + 人读映射示例；covers 为唯一真相源）
- [x] `scripts/test-cases-audit.sh`（硬闸：AC/FP 全覆盖 + 无悬空 + 账本一致）+ `scripts/test-cases-audit.test.sh`（守护 7/7，变异自证 rule-0009）
- [x] `.agents/skills/test-case/SKILL.md`（已被自动发现）；`.claude/skills` 整目录软链无需动
- [x] `docs/test-cases/index.yaml` + `README.md`（账本，空，仿 docs/prds/）
- [x] rule-0014（AGENTS.md，sev blocker）+ regen `docs/rules/index.yaml`
- [x] eval 题 015（`015-test-case-coverage.md` + `docs/eval/index.yaml`）
- [x] ADR-0008（设计存档）
- [x] 接线：verify-control-plane.sh 挂硬闸+守护测试；doc-sync（CURRENT_STATUS / docs/README 路由 / scripts/README / 去硬编码枚举 rule-0012）
- [x] make verify 绿 + docs-audit 绿
- [x] 对抗评审 R1(9)+R2(8)+R3(4)+R4(4) 共 25 真问题全修平；解析收口为**严格 + fail-closed** awk（CommonMark 围栏同字符+裸行闭合 / 段标题前缀锚定 / 声明一行一 id「- AC-n：」否则判红 / covers 收全行 id / 三护栏 a·b·c）；守护 7→25 条、关键修复全变异自证；make verify + docs-audit 全绿
- [ ] **收尾 eval（rule-0005，L3）→ 提交**

## Review
- **任务**：新增独立 `test-case` skill（L3）——产出测试用例 + 管「用例对 AC/FP 覆盖」，不碰执行结果。设计 4 叉路经用户逐个拍板（软+硬分层 / 锚点 AC+FP / 独立 skill / covers 单一真相源 + rule-0014 + eval 015）。
- **产物**：`templates/test-case.md`、`scripts/test-cases-audit.sh`(+`.test.sh` 25 条)、`.agents/skills/test-case/SKILL.md`、`docs/test-cases/{index.yaml,README.md}`、rule-0014、eval 015、ADR-0008；接线 verify-control-plane + doc-sync（CURRENT_STATUS/README/scripts README，去硬编码枚举 rule-0012）。
- **质量**：4 轮对抗评审（每轮多视角找 + 每条独立证伪）共修 25 真问题、驳回 ~16 牵强项；硬闸解析从裸 grep 一路收口为严格 fail-closed；守护全变异自证 load-bearing（rule-0009）。教训落 `tasks/lessons.md` 2 条（裸 grep 解析坑 + 宽容分隔符是 whack-a-mole 该收口严格契约）。
- **验证**：`make verify` 绿（含新硬闸 + 守护 25/25 + rules/skills 索引无漂移 + rule-0012 不硬编码）、`make docs-audit` 27 篇绿、模板 happy-path 不回归。
- **未决**：与上下游（prd-elicitation / feature-delivery）衔接、执行（过没过）机制——用户定「后面再说」。空账本待首个真实用例集实战。

**之后依次问/做：** 输入来源（AC/FP 从哪来）→ 用例产物落哪 + 模板 → 跟 feature-delivery 怎么接（用户在考虑去掉 feature-package）→ 写 `SKILL.md` + 模板 + 护栏 + ADR → make verify + 收尾 eval。
（流程：在走 `superpowers:brainstorming`，HARD-GATE：设计获用户批准前不动手写。）

## 已闭：prd-workflow-redesign（L3，done，**已提交 cbfbc7b**）
重做"产出需求"流程 + stop-check 收尾闸修复 + 对抗评审修 16 处（1 blocker+7 major+…）；ADR-0007；单轮 eval green → 对抗 red → 全修平、make verify 绿。**已 commit（未 push）**。详见 `tasks/lessons.md`（2026-06-27/28 多条）+ `docs/eval/task-reviews/20260627T1630Z-prd-workflow-redesign/`。下次清理可滚进 archive。

## 暂挂：kratos-base 切片（已完成的标准上下文）
S0~S6 done，F-0001~0006，全量 24 AC PASS。详见各 `docs/eval/task-reviews/` 与 `docs/features/`。
