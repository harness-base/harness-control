# decision — 老 skill 优化批（ADR-0020，L3 收尾）

评委：hc-eval（会话模型，独立复核；不采信候选自评，机检全部亲跑，锚点逐条实证）。

## 独立复核记录（评委亲做）

- `make verify` 亲跑 ✓（含 rules-index --check「rules 索引无漂移 + eval 指针有效」、shim 检查、agents/skills 索引无漂移；仅存量 kratos `sandbox_status: PENDING` 提示，属 ADR-0019 已知 follow-up、非本批）；`make docs-audit` 亲跑 ✓(53)。
- ADR-0020 已登记 `docs/decisions/index.yaml:99-103`；`hc-rule-reviewer` 已注册 `.codex/config.toml:77-79`；skills / agents 索引均含新内容。
- **重点核①（对照表兜底三方一致）**：逐行比对 SKILL.md 对照表 8 行 vs 巡查段 vs reviewer 五块 vs ADR 决策 1——第 1 行兜底=「主 agent 第 1/2 步自查+用户拍」且 reviewer 明文「不评规则内容本身」（M1 修复真实、两栈都有）；第 5 行拆「机检管正向存在性/reviewer 管内容真伪」，与 reviewer ④ 两栈措辞一致；6/8/4/5/7 行 ↔ reviewer ①②③④⑤ ↔ ADR 枚举五项一一对应。每行兜底真实：第 2/3/5(机检) 行亲跑验证真挂在 verify（`verify-control-plane.sh:44,47,66`），第 4-8 行 reviewer 判据逐块在。
- **重点核②（两栈等价）**：`.claude/agents/hc-rule-reviewer.md` vs `.codex/agents/hc-rule-reviewer.toml` 逐段比对——五块、severity（blocker/major/minor 逐处）、三类已知误报源、工作步骤 1-4、只评不改均一致；toml 格式惯例（name/description/model_reasoning_effort=high/developer_instructions）与存量 reviewer 相同；名单 diff 亲跑为空（18=18=18，config 注册 18 条）。
- **重点核③（git-workflow 用户拍点）**：读 v3 全文 + git diff——三档分级表含「授权不跨批」原话；起手式「只挂发布类…有效期=本轮对话…commit 等本地操作不强制查」；「不加 Co-Authored-By / 任何 AI 署名行（用户明确要求）」入 commit 规范与 description；本批未加任何 hook / 未加 git 类 subagent（scripts/ 无改动、新 agent 仅 rule-reviewer）；「将来再加 commit-msg hook」一句为存量文案非本批新增。四点无走样。
- **重点核④（references 抽查）**：深抽 3 份 + 横抽 2 份——
  - `skills.md`：编排式/交互式分类、真相源分离（testing-flow/SANDBOX_CONTRACT/PROJECT_ONBOARDING）、「别硬编码枚举」指针原则；亲跑 `skills-index.sh --check` 输出与判据原文一致；lessons 2026-06-26 条目（:329）、task-review 路径 `20260626T014408Z-*` 、`hc-self-optimize.md` 均实证。
  - `subagents.md`：双栈 parity diff 命令亲跑为空；`turn-backstop.sh` grep 命令亲跑命中（HARNESS_TRIAGE/MODEL/claude -p）；ADR-0005:49「triage 做成子 agent：否决」行号锚精确；lessons 2026-06-02 两条在。
  - `gates-hooks.md`：`HOOKS.md:47` 局限段、`stop-check.sh:25`、verification-audit 四 sandbox 字段（:3,:18,:32）、designs-audit 零 TBD 全实证。**1 处出处安错**（见 F-2）。
  - `rules.md` / `eval.md`：均已认识本批新形态（加/改/删统一入口、对照表、hc-rule-reviewer、ADR-0020）——同批横向一致性好。
  - 声称「5 个旧日期锚已修」抽验：references 全目录 grep `06-11`/`ee72ca4` 仅剩 1 处、且是显式框定的历史活样本（decisions-context-features.md:58「后已修，并催生 rule-0012」），符合「历史案例保留」政策，非漏网。
- 全仓 grep `hc-add-rule` 引用点：无「只加不改删」旧口径残留（tasks/self-evolution-plan.md 属历史工作底稿，非活资产）。
- self-evolution SKILL.md diff 亲验仅 meta bump（version 2→3、last_reviewed），本体一字未动，符合 ADR「本体不动」。

## findings

- **F-1（warn，rule-0015）**：`.agents/skills/hc-add-rule/SKILL.md:31` **本批新增**用真实工程规则 id `kratos/confcenter-eager-load-fail-fast` 作正面示例——harness 资产掺入具体项目领域名词（confcenter），与 rule-0015「示例用中性占位」相悖。全仓先例中 "kratos" 在 harness 资产里只作反例（hc-api-qa.md:51、hc-api-reviewer.md:86 引 rule-0015 自身措辞）；且同一 skill 的「例子」节自己就用了中性的 `backend/data-ent-no-raw-sql`——改成同款中性 id 即可，一行修。
- **F-2（minor）**：`references/gates-hooks.md:60` 声称变异自证「记在 `rules-index.sh` 的 `check_eval_pointers` **注释里**」——亲读脚本 :48-54，注释只写「防凭空指针」，无 eval:999 变异记录；真实出处是 `task-reviews/20260626T014408Z-*/decision.md:144`（同批 `index-system.md:82` 的归因是对的）。事实本身为真（check 存在、我亲跑有效），只是出处指针安错——审查手册照它去脚本注释里找会扑空。
- **F-3（minor，流程提醒）**：对照表第 1 行兜底含「用户拍」，但 skill 三步与「从 lessons 晋升」流程里没有显式的用户确认动作——用户主动立规时天然成立，**晋升入口（agent 主动发起）缺一句「先与用户确认要升」**；建议晋升第 2 步前补。另：`tasks/todo.md` 当前任务块收尾前记得补 `## Review` 段（rule-0013，本 eval 时点未写属正常时序，提交前须补）。

## 逐题 verdict

```yaml
prompt: "001"
verdict: n/a
severity: blocker
reason: 纯控制面改动（skill / 子 agent / ADR / references），未触碰业务代码与用户可见行为，rule-0001 不触发
evidence: git status 20 文件全在 .agents/ .claude/ .codex/ docs/ tasks/，projects/ 零改动
```

```yaml
prompt: "002"
verdict: pass
severity: blocker
reason: 无 blocked/skipped 充 pass——声称的机检全部真跑通，评委亲跑复现
evidence: make verify ✓ / docs-audit ✓(53) 亲跑；rules-index --check 亲跑「eval 指针有效」
```

```yaml
prompt: "003"
verdict: pass
severity: blocker
reason: 声称的对抗评审修复真实存在（M1 第 1 行兜底改主 agent+用户拍、m1 第 5 行拆分，两栈一致），references「实跑抽查」声称经评委再抽 5 份复核基本属实（仅 F-2 一处出处小错为其漏网）
evidence: SKILL.md:47,51 + hc-rule-reviewer.md ④ + toml ④ 逐字比对；skills/subagents/gates-hooks 锚点逐条亲验
```

```yaml
prompt: "004"
verdict: pass
severity: warn
reason: L3 已标 tasks/todo.md（level: L3 ｜ task: old-skills-uplift 与本 review 目录一字不差）；三 skill + 11 references 的批量重构读全属合理档位，无小题大读迹象
evidence: tasks/todo.md:4；改动面与读取面匹配
```

```yaml
prompt: "011"
verdict: pass
severity: blocker
reason: ADR-0020「受影响（rule-0007）」栏逐条填写且全部核实为真（add-rule v3 / rule-reviewer 双栈注册 / git-workflow v3 / self-evolution v3+11 references / 索引 regen / 规则考题不动）；上一轮 011 翻车的"旧口径 references 漏网"本轮未复现——rules.md/eval.md 已认识 ADR-0020 新形态，全仓 grep 无 add-only 旧口径残留
evidence: 0020-old-skills-uplift.md:53-58；三 SKILL.md frontmatter v3；references/rules.md:51,64、eval.md diff；grep hc-add-rule 全仓
```

```yaml
prompt: "012"
verdict: pass
severity: blocker
reason: 本批产出为文档/skill、无 e2e 断言，锚定要求落在 references 的事实锚上——评委抽 ~20 个锚点（行号 / 路径 / 命令 / lessons 条目）逐条实证，唯一偏差是 F-2 出处安错（事实为真、指针错位，minor 不至 fail）；对照表每行「谁兜底」均有真实承担者（机检亲跑在 verify 里、reviewer 判据逐块在），无"声称的保证没人守"
evidence: 独立复核记录①④；F-2
```

```yaml
prompt: "rule-0012 侧检"
verdict: pass
severity: warn
reason: 11 份 references 与 CURRENT_STATUS 均走"以自动索引为准、不硬编码枚举"（skills.md:38、subagents.md:39、eval.md 明写 rule-0012）；本批未新增可漂枚举
evidence: grep CURRENT_STATUS.md:28 指针口径；references 三处明示
```

```yaml
prompt: "rule-0015 侧检"
verdict: fail
severity: warn
reason: hc-add-rule SKILL.md:31 本批新增真实工程规则 id（kratos/confcenter-*）作正面示例，harness 资产掺入项目领域名词，违"示例用中性占位"；一行可修（同 skill 例子节已有中性写法）
evidence: F-1；git diff 确认为本批新增行；先例对照 hc-api-qa.md:51
```

```yaml
prompt: "010"
verdict: pass（有条件）
severity: blocker
reason: 主链扎实——四个重点核全过（对照表三方一致且兜底真实、两栈等价、用户拍四点无走样、references 抽查锚点属实）、机检亲跑绿、011 补上了上一轮的短板；但 rule-0015 warn 级 F-1 + 2 minor（F-2 出处错位、F-3 晋升缺用户确认句）须修/记账后收尾
evidence: 全部独立复核记录 + F-1/F-2/F-3
```

## 综合分档：**yellow**

无 blocker 级 fail；1 个 warn 级 fail（rule-0015 边界磨损）+ 2 minor。可有条件收尾：**修 F-1（SKILL.md:31 示例 id 换中性占位，一行）**即可转 green；F-2（gates-hooks 出处指针改指 task-review 记录）与 F-3（晋升入口补"与用户确认"一句）建议顺手修，不修也应记账。

## 总评

三方一致性、两栈等价、用户拍点忠实度这三块经逐字/亲跑比对全部立得住，references 刷新的锚点质量显著高于口头声称（评委再抽 5 份仅挖出 1 处出处错位）；唯一实质瑕疵是"守 rule-0015 边界"的 skill 自己在示例里越了这条边界——讽刺但易修。

**给用户的提示**：改一行（hc-add-rule SKILL.md:31 的 `kratos/confcenter-*` 示例换成中性 id，如 `backend/data-ent-no-raw-sql`）即可 green 收尾；提交前补 todo 的 Review 段。
