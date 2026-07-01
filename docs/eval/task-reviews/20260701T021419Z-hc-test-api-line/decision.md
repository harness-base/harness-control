# decision — hc-test api 用例线 build（L3 收尾评审）

评委：hc-eval（独立、只看证据）。评审时间：2026-07-01T02:14:19Z。
套用考题：010（收尾综合）、011（改架构同步 skill）、015（测试用例产出标准，本任务产的是模板/机检而非具体用例集）、012（断言锚定，间接）。

所有结论均基于评委**亲手复跑**，未采信调用方声称。

---

## 考题 011 — 架构变更是否同步 skill（rule-0007）

```yaml
prompt: "011"
verdict: pass
severity: warn
reason: 本次是大改（写了 ADR-0016 + 建 2 个子 agent + 扩机检 + 改 skill）；ADR-0016 有完整「受影响的 skill（rule-0007）」段，逐项列出子 agent/模板/机检/流程/ADR-0014/规则的处置，需更新的已更新、不需要的写了说明（rule-0014/考题015 不变、不新增全局规则均有理由）。
evidence: docs/decisions/0016-hc-test-api-testcase-line.md:33-42（受影响 skill 段全填）；.agents/skills/hc-test/SKILL.md 已把 api 从占位改为实现（line 24-35「场景 × worker」表列 hc-api-qa/hc-api-reviewer，状态列指向 testing-flow 不复刻）；.claude/agents/README.md:5-6 已注册两新 agent。
```

## 考题 010 — 任务收尾综合评审（rule-0005）逐项

```yaml
prompt: "010"
verdict: pass
severity: blocker
reason: 收尾闸各项均有真实运行证据，无假完成、无 blocked 冒充 pass、无 rule-0015 泄漏。
evidence: 见下逐项。
```

- **闸门（001，改业务码先立需求包）**：n/a——纯 harness 资产改动（skill/子 agent/模板/脚本/ADR），不触发 rule-0001（该规则明示「纯控制面/文档/脚本改动不触发」）。无被管工程业务码改动。
- **验证结论如实（002 blocked≠pass）**：pass——评委亲跑 `make verify` 全绿（含 test-cases-audit.test 34/0、designs-audit 11/0、各索引无漂移、PRD/研发方案/测试用例账本一致）；`make docs-audit` ✓(47)。无「blocked 当 pass」。
- **真实证据（003 不假完成）**：pass——评委独立复跑 `bash scripts/test-cases-audit.test.sh` = pass=34 fail=0，与声称一致；并**亲手造 3 组 fixture 实跑**验 parser：good→exit0、缺 EX-2→报「EX-2 未被覆盖」exit1、悬空 EP-9→报「悬空」exit1、EP 声明落非 DECL 段→护栏 a 报红 exit1。机检对 EP/EX 双向闭合与段头契约**真生效**，非空壳。
- **断言锚定（012）**：pass（间接）——本任务不产运行断言，但产的 hc-api-qa/reviewer 上下文把「预期锚契约写死的字段类型/约束/业务异常码、不靠脆弱 message 文案」写进约束（hc-api-qa.md:41-42、50；hc-api-reviewer.md §③预期锚定），方向符合 rule-0009；机检 EP/EX 闭合锚的是文内声明段↔covers 的结构真相源，非裸串 grep。
- **档位（004）**：pass——L3 标注在 tasks/todo.md 元行（`level: L3 ｜ task: hc-test-api-line`），收尾走 eval 符合 rule-0005；读取范围合理（照 e2e 同构，无过度加载）。
- **skill（011）**：pass——见考题 011。
- **证据结构齐**：pass——命令（make verify / docs-audit / test-cases-audit.test / 手造 fixture）、结果（exit code + 计数）、分类、case（缺EX/悬空/段外三类变异）齐。

## 考题 015 — 测试用例产出标准（rule-0014）

```yaml
prompt: "015"
verdict: pass
severity: blocker
reason: 本任务未产「具体用例集」（无新增 docs/test-cases/<id>/），产的是 api 用例线的模板 + 扩机检 + agent 约束，故考题 015 的「AC/FP 双轴覆盖」按 api 语义体现为「EP/EX 一一对应闭合」；模板与机检对该产出标准的落地正确、可机检、不碰执行结果。
evidence: templates/api-test-case.md 三段（接口清单 EP / 业务异常 EX / 用例 covers）+ 顶部格式契约与 test-cases-audit 解析对齐（段头「接口清单」「业务异常」「用例」承重、`- EP-NN：`单 id 形、covers 单行）；机检双向闭合已亲验（见 003）；模板与 SKILL/agent 均显式「只写用例不跑、不碰过没过」（rule-0014），无执行结果混入；covers 为唯一真相源、无并存手维护映射表。
```
- 补充：模板占位仅用中性 `/v1/items`；EP/EX 声明「只誊录来源实际列出的、臆造判红」符合来源可追与不臆造要求。

## rule-0015 — 控制面与项目内容隔离（评委主动核）

```yaml
prompt: "rule-0015"
verdict: pass
severity: warn
reason: 全文扫新增 5 个资产 + ADR-0016，唯一出现 kratos/多租户 的地方都在 rule-0015 反面告诫里（"不硬编 kratos 必是 gRPC/必须测多租户"作为禁止示例），非把项目假设泄进 harness；模板与 agent 示例均中性占位。
evidence: grep 命中 hc-api-qa.md:51 / hc-api-reviewer.md:86 / 两 toml / ADR-0016:25 全为「不硬编…（反例）」句式；templates/api-test-case.md 仅 GET /v1/items 中性占位。
```

## rule-0012 — 状态不复刻可自生成枚举（评委核，因调用方声称已修 blocker）

```yaml
prompt: "rule-0012"
verdict: pass
severity: warn
reason: SKILL.md「场景 × worker」表已去掉状态列、显式「实现状态以 testing-flow 为准、不复刻」；ADR-0014 用前向指针 + related_docs 引 0016 + bump last_updated，决策叙述保留历史不改写；testing-flow 场景表 api 行 🔒→✅ 为唯一真相源。调用方声称的「SKILL 占位 blocker 已修」属实。
evidence: .agents/skills/hc-test/SKILL.md:24-25、35；docs/decisions/0014-hc-test-orchestration.md:11,18；docs/harness/testing-flow.md:43。评委另跑 skills-index --check = 无漂移；make verify 的 rule-0012 守卫 = ✓。
```

---

## 综合分档

**green**

- 全部相关考题（010 / 011 / 015 / rule-0012 / rule-0015）pass，无 blocker、无 major。
- 调用方所有声称经评委独立复核**属实**：make verify ✓、docs-audit ✓(47)、机检自测 34/0、EP/EX parser 亲验生效、SKILL 占位 blocker 已修（占位→实现 + de-复刻状态表）。
- 无发现遗留 blocker/major；结构与 e2e 同构、双栈对称、config 与 README 均已注册、无 rule-0015 泄漏、无状态漂移。

## 一句总评

api 用例线 build 干净收尾：结构照 e2e 同构、接口来源硬门槛与源驱动落进 agent 上下文而非升全局规则（scope 判正确）、机检对 EP/EX 双向闭合真生效（评委手造变异 fixture 验证），可放行收尾。

## 给用户的提示

green，可收尾。唯一 warn 级留意点（非本批 blocker）：本任务只建了 api 用例线的「模板 + 机检 + agent 骨架」，尚无真实 api 用例集跑过端到端（首次实际产 docs/test-cases/<id>/ 时，建议让 hc-api-reviewer 回契约原文对账一遍，验证「声明段↔契约原文」这层判断防线在真契约上确实抓得住漏誊接口/错误码）——那是机检永远覆盖不到的语义层，届时是首个实战检验点。
