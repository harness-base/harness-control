# candidate — agents-slim-lessons（调用方声称清单，逐条可核）

命中的 rule-0005 判据：多步改产物（AGENTS.md + docs/harness 两文件 + lessons + memory + 连带 4 处正名跟改）。

1. AGENTS.md 瘦身三处、声称语义不变：rule-0011 尾巴（turn-backstop 机制细节）改指 docs/harness/HOOKS.md（HOOKS.md 小节同步正名"落文档提醒（①）"使指针按词可达）；rule-0012 删"三次漂移"轶事括号；eval 节删与 rule-0005 重复的"和关键决策点"+ 删可循 docs/eval/README.md 找到的路径明细。7591→7325 字节。
2. lessons 11 条 `opt: seen` 全裁决：L18(todo 打勾没做)→`opt: rule-0003`、L33(ADR 受影响栏不回填)→`opt: rule-0007`（各按词表"覆盖型"标准，L33 补处置注）；其余 9 条 `opt: skip`（L28/L58/L63 补"已沉淀"处置注）。未新增全局规则。lessons-promote-check 归 0。
3. 四条 lesson 的干货沉淀到家：修复轮"声称清单↔git status"对账 → adversarial-review.md 核心 pattern 第 4 步；文档审 2–3 视角封顶 → 同文件新增「按对象类型伸缩」段（后按对抗发现收窄为"harness 控制面资产且无对口领域 rubric"+ 补领域产物边界与收敛口径）；决策请求四件套 → 仓外 memory（~/.claude/.../memory/ask-with-recommendation.md）；取数用脚本 → 已在 ADR-0026、只补指针注。
4. 对抗验证：首轮 2 视角（doc-sync + 语义等价）5 findings（2 major 同根 + 3 minor）全修——含 HOOKS.md 小节正名后全仓扫"自进化兜底"旧词、4 处活引用跟改（gates-hooks.md / verify-control-plane.sh / stop-check.sh / scripts/README.md）、orchestration-workflow.js 按 doc-sync-checklist L27 补对账注释；末轮新视角（指针有效性）1 finding（HOOKS.md 指针日期错 06-26→06-29）已修 + grep 机核目标在 lessons.md:277。
5. 声称闸全绿：make verify ✓ / make docs-audit 66 ✓ / stop-check.test 16/16 ✓ / skills-index、rules-index regen（rules-index 无 diff 属预期——索引不存正文）；hc-prd、hc-self-evolution 的 last_reviewed 已 bump（references 变动）。
6. 本批无 ADR：定性为"去冗余 + lessons 处置 + pattern 文档细化"，无架构/接口/机制语义变更（若判定该写 ADR，请点出哪个决策够格）。

要套的考题：003 / 010 / 011 / 014 + rule-0015 抽查两处新写文本零项目词。
