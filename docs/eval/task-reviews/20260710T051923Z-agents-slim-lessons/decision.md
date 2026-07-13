# decision — agents-slim-lessons（AGENTS.md 瘦身 + lessons 批量处置批）

评委：hc-eval（独立复核，不采信声称）。复核动作：`make verify` / `make docs-audit`（66 篇）/ `stop-check.test.sh`（16/16）/ `skills-index --check` / `rules-index --check` 独立重跑全绿；AGENTS.md 字节数亲量（`wc -c` 7325，`git show HEAD:AGENTS.md | wc -c` 7591）；三处瘦身逐处做语义等价核（rule-0011 尾巴细节逐项在 HOOKS.md L52-61 找齐：机械触发三条件 / turn-backstop.sh / ①≠② 区分；"和关键决策点"确为 rule-0005 判据第 4 项、删除无语义损失；eval 节删的 prompts+index.yaml/hc-eval 路径均在 docs/eval/README.md 组成表与"怎么跑"节）；`grep "opt: seen"` 全文件仅剩模板行 L8 + 词表 L14（11 条实体 lesson 全裁决）、`lessons-promote-check.sh` 输出 0 亲跑；L18/L34 覆盖型标记对照词表逐条核（正文/处置注均明说"变种/被其覆盖不另升"）；旧词"自进化兜底"全仓 raw grep（除 archive/task-reviews 历史区）仅剩 todo.md:13 描述改名本身、4 处正名跟改齐；memory 文件亲读（四件套已入 ask-with-recommendation.md 末段、引 2026-07-08 教训）；HOOKS.md 正文指针日期 2026-06-29 与 lessons.md:277 实际条目日期对上；rules-index 的 brief 字段确认只存加粗标题不存正文（rule-0011/0012 标题未动 → 无 diff 属实）；两处新写文本 grep `kratos|tenant_id|租户|订单` 零命中；scripts 两处 .sh 改动逐行核实为纯 echo 标签/注释、无行为变更（"无 ADR"定性的关键证据）。

---

```yaml
prompt: "003"
verdict: pass
severity: blocker
reason: 六条声称全部经独立复现为真——字节数 7591→7325 分毫不差；三处瘦身语义等价逐项核过（细节全在指针目标文档里、指针按词可达：HOOKS.md 小节标题现含"落文档提醒（①）"）；11 条 opt: seen 归零 + promote-check 输出 0 评委亲跑；四条沉淀各到其位（adversarial-review.md 第 4 步对账句 + 「按对象类型伸缩」段、memory 文件末段四件套、ADR-0026:22 确有"取数用脚本判断用 agent"成文 + lessons L33 处置注指它）；旧词 sweep 评委全仓重扫零漏网（4 处跟改齐、活文档无残留）；声称的闸全部重跑复绿。
evidence: wc -c AGENTS.md=7325 / git show HEAD=7591；grep "opt: seen" 仅 L8 模板+L14 词表；lessons-promote-check=0；docs/harness/HOOKS.md:52-61；docs/harness/adversarial-review.md:22,28；~/.claude/projects/.../memory/ask-with-recommendation.md 末段；docs/decisions/0026:22；评委重跑 verify/docs-audit 66/stop-check 16 全绿
```

```yaml
prompt: "010"
verdict: pass
severity: warn
reason: 收尾纪律齐——todo 标 `eval: 要 ｜ task: agents-slim-lessons`（slug 与本产出目录后缀精确一致，上批 lessons 的坑没重犯）；上一任务块已滚 tasks/archive/2026-07-10-test-chain-final.md（rule-0013 保持轻）；对抗验证首轮 2 视角符合本批自己新写的"控制面资产 2–3 视角封顶"口径（首次自用不打折）、末轮换新视角（指针有效性）符合 pattern 第 5 步；修复轮"声称清单↔git status"对账首次自用且评委逐项核对属实（新触 8 类文件全在 git status——唯 skills README regen 无 diff 系索引不含 last_reviewed，todo 措辞"全在 git status"对该项不准，见 minor 清单）；证据结构（命令/结果/文件行号）齐。
evidence: tasks/todo.md:4 元行；tasks/archive/2026-07-10-test-chain-final.md（untracked 新建）；todo.md:13 修复轮对账清单 vs git status --short 逐项对上；本 decision 003 栏独立复现记录
```

```yaml
prompt: "011"
verdict: n/a
severity: warn
reason: 非大改，"本批无 ADR"定性经评委独立核实站得住——scripts 两处 .sh 改动逐行核实为纯 echo 标签/注释更名（stop-check.sh:48 注释、verify-control-plane.sh:22 echo），hook 触发/判定逻辑零变更；HOOKS.md 小节改名是向仓内既有权威口径对齐（ADR-0005:18、turn-backstop.sh:2、CURRENT_STATUS:36 早已叫"① 落文档提醒"，本次只是把 HOOKS.md 这个掉队者拉齐），非新决策；AGENTS.md 三处为语义等价修剪；adversarial-review.md 两段新增是把用户 2026-07-08 已拍的 lesson 沉成 ADR-0022 所辖 pattern 文档的执行细则，不构成对 0022 的推翻或新机制。找不出够格写 ADR 的决策。虽 n/a，skill 处理仍做对了：references 变动的 hc-prd/hc-self-evolution 各 bump last_reviewed（js 注释与 gates-hooks 标签属非行为变更、不 bump version 正确）；orchestration-workflow.js 按 doc-sync-checklist adversarial-review 行的"可执行编排模板也要跟"补了对账注释；7 个引用 skill 的复述句均"引用不复制"、与新段不冲突（新段的"且无对口领域 rubric"限定词把有专属 reviewer 的规则/领域产物审排除在封顶外，与第 1 步不打架）。
evidence: git diff scripts/stop-check.sh（仅 L48 注释）/ scripts/verify-control-plane.sh（仅 L22 echo）；docs/decisions/0005:18；scripts/turn-backstop.sh:2；git diff 两 SKILL.md 仅 last_reviewed 行；doc-sync-checklist.md adversarial-review 行；grep 7 skill 的 adversarial-review 引用句
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: 本批不仅没引入新硬编码枚举，方向正好是 rule-0012 的执行——AGENTS.md eval 节删掉的 prompts/index.yaml/hc-eval 路径明细正是"可循 README 找到的枚举"、收敛成指针；rule-0012 删轶事不动规范本体；rules-index 的 brief 只存加粗标题（评委查 index.yaml:290-299 确认）、剪正文无索引 diff 的解释属实且 `rules-index --check` 绿；`make verify` 的 rule-0012 专项检查（"状态文档未硬编码 skill 枚举"）绿；CURRENT_STATUS 本批未触碰（不在 git status）。
evidence: git diff AGENTS.md eval 节；docs/rules/index.yaml:290-299（brief=标题）；make verify "状态文档未硬编码可自生成枚举" ✓ + "rules 索引无漂移" ✓；git status 无 CURRENT_STATUS
```

```yaml
prompt: "rule-0015（控制面通用性，非编号考题、按调用方点名抽查）"
verdict: pass
severity: warn
reason: 两处新写文本零项目词——adversarial-review.md 新增「按对象类型伸缩」段 + 第 4 步对账句、HOOKS.md 新增的 ①/② 辨析句，grep kratos/tenant_id/租户/订单 零命中；提及的均为 harness 通用部件（hc-doc-sync-reviewer、doc-sync-checklist、PRD/用例等产物类型名），无具体项目领域名词。
evidence: grep -rn "kratos|tenant_id|租户|订单" docs/harness/adversarial-review.md docs/harness/HOOKS.md → exit 1（无命中）
```

---

## 综合分档：green

全部相关考题 pass（011 为 n/a 且定性经核站得住）。两条 minor 建议在 commit 前顺手修（不阻塞收尾）：

1. **docs/harness/HOOKS.md frontmatter `last_updated: 2026-06-26` 未 bump**——本批实质改了该文件（小节正名 + 新增 ①/② 辨析句），同批 adversarial-review.md 已 bump 到 2026-07-10；讽刺的是"指针有效性"视角修了正文里的 06-26 日期、漏了两行外 frontmatter 里的同款旧日期。1 行修。
2. **tasks/todo.md:13 "skills README regen——全在 git status" 措辞不准**——`.agents/skills/README.md` 实际无 diff（索引只渲染 name/description、不含 last_reviewed，regen 无变化、不在 git status）。本批自己刚把"声称清单↔git status 对账"写进 pattern 第 4 步，声称清单里就混进一个不在 git status 的项；改成"skills README regen 无 diff（索引不含 last_reviewed）"即可。

**一句总评**：三处瘦身语义等价逐项核实、11 条 lessons 裁决合词表、四条沉淀各到其位、旧词 sweep 评委重扫零漏网、闸全部独立复绿、"无 ADR"定性经逐行核 .sh diff 站得住——本批把自己新立的对账纪律首次用在了自己身上且基本对上，仅剩 HOOKS.md frontmatter 日期与一处 todo 措辞两条 1 行级 minor。
