## 当前：AGENTS.md 瘦身执行 + lessons 批量处置（用户拍，2026-07-10）
- **口径**：瘦身 = 之前审计过的三处修剪（语义不变、只去冗余）；lessons 处置 = 11 条 `opt: seen` 按词表裁决（覆盖型标 rule-00NN / 不升标 skip），可沉淀的落对应机制文档、**不新增全局规则**（与瘦身方向一致）。
- [x] AGENTS.md 三处修剪：rule-0011 机制尾巴 → HOOKS.md 指针（HOOKS.md L54-61 已承载机制细节，核过）；rule-0012 删轶事括号；eval 节去重（hc-eval 双栈路径/prompts/index.yaml 全在 eval README，核过）——7591→7325 字节
- [x] lessons 11 条裁决落标记：L18→rule-0003（正文明说 todo 变种）、L33→rule-0007（受影响栏回填=其执行纪律，补处置注）、其余 9 条 skip（L28/L58/L63 补"已沉淀"处置注）；误伤文件头模板示例已修回
- [x] 沉淀两条进 adversarial-review.md：①「按对象类型伸缩」文档/控制面资产审 2–3 视角封顶（L63）②核心 pattern 第 4 步"声称清单↔git status"对账（L18+L33 同型三次）
- [x] memory 更新：ask-with-recommendation 补"决策请求四件套"（L58，仓外 ~/.claude memory）
- [x] 索引 regen（rules-index 只存编号不存正文、剪正文无索引 diff）+ make verify ✓ + docs-audit 66 ✓ + lessons-promote-check 归 0
- [x] 对抗验证（2 视角：doc-sync 漂移 + 语义等价）：**2 major（同根）+ 3 minor 全修**——「按对象类型伸缩」段判据过宽（字面罩住 PRD/用例等有专属 reviewer 的领域产物审，与第 1 步矛盾）→ 收窄为"harness 控制面资产且无对口领域 rubric"+ 补两条边界（领域产物不适用 / 视角用尽的收敛口径）；HOOKS.md 小节旧名"自进化兜底"与 rule-0011 指针词对不上 → 标题正名"落文档提醒（①）"+ 全仓扫旧词 4 处活引用跟改（gates-hooks.md / verify-control-plane.sh / stop-check.sh 注释 / scripts/README）；orchestration-workflow.js 按 doc-sync-checklist L27 跟补对账注释行。**修复轮对账**（本口径首次自用）：新触文件 = HOOKS.md、orchestration-workflow.js、gates-hooks.md、verify-control-plane.sh、stop-check.sh、scripts/README.md、hc-prd/hc-self-evolution SKILL last_reviewed——全在 git status（skills README regen 无 diff 属预期：索引不含 last_reviewed），闸重跑全绿（verify/docs-audit/stop-check 16）
- [x] 末轮换新视角（指针有效性）：1 finding（HOOKS.md 新指针日期 06-26→06-29 指错）→ 修 + grep 机核目标在 lessons.md:277；被删短语反向核无外部依赖、"自进化兜底"活引用零残留
- [x] 收尾 eval：**green**（`docs/eval/task-reviews/20260710T051923Z-agents-slim-lessons/`；003/010/014/rule-0015 pass、011 判"无 ADR 定性站得住"——评委逐行核 .sh diff 零行为变更；2 minor[HOOKS frontmatter 日期未 bump / todo 对账措辞混入无 diff 项] 已修平）
- [x] commit/push/PR（新分支 feat/agents-slim-lessons 从 main 切；用户授权 2026-07-13"提交pr吧"；optimization-log 2 条钩子发现核为已做/误报、销号折入）

## Review（agents-slim-lessons）
- **做了什么**：AGENTS.md 瘦身三处执行（7591→7325 字节、语义等价逐项核过：机制细节归 HOOKS.md、路径明细归 eval README、轶事删除）；lessons 11 条 `opt: seen` 全裁决（2 覆盖型 + 9 skip，零新增全局规则）；4 条 lesson 干货沉淀到家（修复轮对账→adversarial-review 第 4 步、文档审编制→「按对象类型伸缩」段、决策四件套→memory、取数用脚本→ADR-0026 指针注）。
- **对抗+eval 的价值**：首轮逮出新段判据过宽（字面罩住有专属 reviewer 的领域产物审、与第 1 步矛盾）→ 收窄 + 补边界与收敛口径；正名"落文档提醒（①）"消掉 rule-0011 指针按词不可达 + 全仓 4 处旧词跟改；末轮新视角逮指针日期错；eval 再逮 frontmatter 日期与对账措辞两处一行级——**本批新立的对账纪律首次自用**（评委原话"声称与事实无一走样"）。
- **质量**：make verify / docs-audit 66 / stop-check 16 全绿复跑；lessons-promote-check 归 0；旧词残留零；两新段零项目词。
