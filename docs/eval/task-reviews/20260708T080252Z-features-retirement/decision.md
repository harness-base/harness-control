# decision — features 体系退役（L2）

评委独立复核方式：`git diff HEAD`（本批全在工作区，staged 删除 + unstaged 修改）看全貌；`grep -rn 'rule-0001|docs/features|feature-package'` 全仓分活/史两类核；语义层另 grep `需求包`/`feature 包`/`立了 feature`/`F-xxxx`；机检独立重跑（非采信候选声称）。

## 逐考题

```yaml
prompt: "010"
verdict: fail
severity: warn
reason: 删除与跟改主体真实、机检独立重跑全绿；但"活文档零残留终核 [x]"在语义层被证伪——两处活文档残留（prds README 正文仍教"派生 feature 包"、hc-dev:70 仍复述"立了 feature"）+ ADR-0023 连带清单未回填巡查后补改的 ~8 处。字面 grep 口径下声称为真（非假完成），是终核口径盲区，warn 级。
evidence: |
  真实性核过（pass 项）：
  - 删除本体：ls docs/features / templates/feature-package.md / docs/eval/prompts/001-*.md 均 "No such file"（git rm 已 staged，10 文件）。
  - 字面残留清净：grep 'rule-0001|docs/features|feature-package' 活文档命中仅合法注记——AGENTS.md:17 编号空缺注记、verify-control-plane.sh:74 退役注释、decisions-context-features.md:14 "已退役=漂移"判据、rules.md:8 退役编号示例、lessons-promote-check.test.sh 夹具改 rule-0999；其余命中全在 tasks 旧 plan / lessons 正文 / 旧 ADR / eval task-reviews（ADR-0023 决策 4 明文保留，合法）。
  - 机检独立重跑：make verify EXIT=0（rules 索引无漂移+eval 指针有效 / decisions 索引一致 / 各账本 audit 绿）；make docs-audit EXIT=0（57 篇）；lessons-promote-check.test pass=3 fail=0。
  - 巡查声称的 5 major 修复逐条见 diff：CONTEXT_LOADING L3 行 ✓ / templates/prd.md ✓ / eval 010 摘 001 ✓ / docs/README rules 行 ✓ / AGENTS.md rule-0007 死触发摘除 ✓。
  findings（fail 依据，均 warn 级）：
  - F1 docs/prds/README.md:17 "有 PRD 时可派生 feature 包衔接" + :20 "派生 feature"——ADR-0023 连带清单声称改了"docs/prds/（README/index 提松耦合处）"，实际只改了 README frontmatter 与 index 第 2 行，README 正文的提松耦合处漏改；docs/prds/index.yaml:3,11 仍留 feature（F-xxxx）schema 字段（F-xxxx 已不存在）。
  - F2 .agents/skills/hc-dev/SKILL.md:70 "大改（写了 ADR / 立了 feature）回顾相关 skill（rule-0007）"——本批改到 v4 的文件里漏掉旧措辞（详见 011）。
  - F3 ADR-0023 受影响/连带清单与实际改动不一一对应：巡查后补改的 CONTEXT_LOADING.md、templates/prd.md、templates/test-case.md、docs/README.md、eval 考题 010/011/015 内文、rule-0007 本体措辞变更、hc-dev-worker 双栈、lessons-promote-check.test.sh 夹具，均未回填；hc-add-rule 栏写"否（不引用运行时语义）"但该文件实际被改（SKILL.md:30 引用方口径）——栏与事实矛盾。
  - F4（minor）tasks/todo.md 与声称不同步：hc-rule-reviewer 巡查项仍 "[ ]" 未勾（修复本身已 diff 核实为真）、references 刷新仍 "[~] 6 份后台跑中"（实际 7 份已完成）；收尾 Review 段未补（rule-0013）。
  - F5（minor）CURRENT_STATUS.md:47 kratos-base 行仍含 "F-0003 done" / "F-0006 done" 字样（活状态文档里的 F-id 残留，叙史性质、无断链）。
```

```yaml
prompt: "011"
verdict: fail
severity: warn
reason: ADR-0023 受影响 skill 栏已填且 4 支 skill 更新属实、考题 011 已跟改、rules-index 已 regen 且 --check 绿；但 rule-0007 本体措辞变更自身的同步漏了一处——hc-dev SKILL.md:70 仍复述旧措辞"立了 feature"（本批改过的文件），且 hc-add-rule 栏写"否"与其实际被改矛盾、措辞变更未记入 ADR。
evidence: |
  - 已核 pass 面：AGENTS.md rule-0007 bullet 已改"（写了 ADR）"；docs/eval/prompts/011-*.md:4 已改"（写了 ADR / 改了接口）"；docs/rules/index.yaml rule-0007 条目（brief/severity/eval:["011"]）与 bullet 一致，make verify "rules 索引无漂移" 独立重跑绿。
  - 已核 skill 更新属实：hc-dev（description 去"需求包门禁"、② 改软提示指 docs/prds、⑧ 删 rule-0001 条，v4）、hc-onboard（③7/④8/⑦ 三处 + refs 2 份，v6）、hc-tech-design（:73，v5）、hc-self-evolution（SKILL.md + references 7 份）——均见 git diff HEAD。
  - fail 依据：grep '立了 feature' 全仓唯一活残留 = .agents/skills/hc-dev/SKILL.md:70（⑧ 硬规则汇总末条），旧 rule-0007 措辞 + 已死的 feature 语义；ADR-0023 无 rule-0007 措辞变更记录；受影响栏 hc-add-rule="否" vs 实际 diff 改了 SKILL.md:30。
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: 本批未引入新硬编码枚举，反而净删——CURRENT_STATUS 摘掉 features 整行、index-system 现状表删 features 行（带"核到 2026-07-03"时点注记）、templates/README 与 .agents/skills/README 均走生成器 regen；eval index 下架用注释留痕而非复刻清单。
evidence: |
  - git diff HEAD：docs/context/CURRENT_STATUS.md 删 `docs/features/` 行（skill 行仍是"以 README.md 为准"指针）；.agents/skills/hc-self-evolution/references/index-system.md 表删 features 行 + "已滚动到 ADR-0023，别在文档里硬编码总数"；templates/README.md / .agents/skills/README.md 为 dir-index / skills-index 生成产物。
  - make verify 独立重跑：目录索引无漂移 ×4 + rules/skills --check 绿（含 CURRENT_STATUS skill 行 rule-0012 专检）。
  - 注：ADR-0023 受影响栏枚举 skill 是 ADR 模板强制栏（rule-0007），不属状态文档复刻，不计违规。
```

```yaml
prompt: "rule-0002/0003 抽查"
verdict: pass
severity: blocker
reason: 抽查声称的删除/跟改 ≥5 处全为真，验证结论无虚报——删除本体 ls 确认不存在、5 major 修复逐条见 diff、三项机检评委独立重跑同绿（非转述候选输出）。
evidence: |
  抽查点：① docs/features/ 等 10 文件 git rm 已 staged 且工作区不存在；② hc-dev ② "MUST STOP" → "提示、非门禁（ADR-0023）" 见 diff；③ hc-onboard 交棒话术 3 处 + references 2 份见 diff；④ verify-control-plane.sh 摘 features audit 且注释留痕，make verify 重跑 EXIT=0；⑤ eval index 001 注释下架 + prompts/001 删除，rules-index check_eval_pointers 绿；⑥ docs-audit 57 篇 / lessons-promote-check 3/0 与声称一致（独立重跑）。
  瑕疵已归入 010-F4：todo.md 勾选状态落后于事实（不构成虚报，方向是"做了没勾"而非"没做说做了"）。
```

## 综合分档：**yellow**

一句总评：退役的骨干动作（删规则、删目录、摘机检、四支 skill 与两栈跟改）真实且机检独立复核全绿，但"零残留"收口在语义层欠三口气——prds README 正文还在教人派生已死的 feature 包、hc-dev 还复述旧版 rule-0007、ADR-0023 连带清单没把巡查后补改的 ~8 处回填——全是 warn 级、可在收尾前顺手修平。

给用户的提示：合并前建议修 4 处（约十分钟）——① `docs/prds/README.md:17,20` 与 `index.yaml:3,11` 的 feature 包/F-xxxx 口径；② `.agents/skills/hc-dev/SKILL.md:70` "立了 feature" 摘除（版本已是 v4，顺手改）；③ ADR-0023 连带清单回填补改文件 + hc-add-rule 栏改"是（仅引用方口径措辞）"，并补记 rule-0007 措辞变更；④ tasks/todo.md 勾平 + 补 Review 段。CURRENT_STATUS:47 的 F-id 属叙史，可自行取舍。
