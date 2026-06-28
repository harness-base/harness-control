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

**设计已闭环，待用户批准整版**（见会话最终版草案）。批准后：落 ADR-0008（设计存档）→ 写实现计划/todo Review → 实现（SKILL + template + `scripts/test-cases-audit.sh`+守护测试 + `docs/test-cases/index.yaml` + rule-0014 + eval 015 + 文档同步）→ make verify + 收尾 eval。

**之后依次问/做：** 输入来源（AC/FP 从哪来）→ 用例产物落哪 + 模板 → 跟 feature-delivery 怎么接（用户在考虑去掉 feature-package）→ 写 `SKILL.md` + 模板 + 护栏 + ADR → make verify + 收尾 eval。
（流程：在走 `superpowers:brainstorming`，HARD-GATE：设计获用户批准前不动手写。）

## 暂挂：prd-workflow-redesign（L3，done，**未提交**）
重做"产出需求"流程 + stop-check 收尾闸修复 + 对抗评审修 16 处（1 blocker+7 major+…）；ADR-0007；单轮 eval green → 对抗 red → 全修平、make verify 绿。**整摊未提交**。详见 `tasks/lessons.md`（2026-06-27/28 多条）+ `docs/eval/task-reviews/20260627T1630Z-prd-workflow-redesign/`。

## 暂挂：kratos-base 切片（已完成的标准上下文）
S0~S6 done，F-0001~0006，全量 24 AC PASS。详见各 `docs/eval/task-reviews/` 与 `docs/features/`。
