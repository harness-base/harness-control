# decision — test-chain-final（契约对照 ADR-0026 + 统一回归 ADR-0027 收官批）

评委：hc-eval（独立复核，不采信声称）。复核动作：`make verify` / `make docs-audit`（66 篇）/ `verification-audit.test.sh`（25/25）独立重跑；**mutation 亲手做**（撤 audit 正则里的 `routelist` 分支 → case 24 翻红 `pass=24 fail=1`，还原后复绿 25/25 + verify 绿）；routelist 枚举全仓一致终核（grep `sandbox_status` 全仓逐处分类：全枚举位 8 处全带 routelist，其余命中均为 sandbox 专属语境或历史文档）；"占位/🔒"残留全仓 grep 终核（**逮到 5+2 处漏网**，见 010/011）；ADR-0026/0027 受影响栏逐项对 `git status` 31 文件；hc-test 编排段重排后内部引用（④.6"见 ⑤"/⑤.3"同 ④.4"/"见 ⑥⑦"）逐个解析；skills-index / dir-index `--check` 亲跑；新分线 grep `kratos|tenant_id|租户` 零命中。

**评委过程披露（如实）**：mutation 还原时误用 `git checkout --` 把 `scripts/verification-audit.sh` 整体回退到 HEAD（连带撤掉了本批的未提交 routelist 改动）；随即按此前逐字捕获的三行原文精确重建，重建后 `git diff` 与原始 stat 完全一致（3 insertions / 3 deletions，仅 3 行、均为 routelist 增补），测试 25/25、verify 全绿。已复核无其它差异，但用户可再 `git diff scripts/verification-audit.sh` 复查。

---

```yaml
prompt: "002"
verdict: pass
severity: blocker
reason: 无 blocked/PENDING 被报成 pass——kratos routelist 如实标 "PENDING: 待写 proto 解析脚本…"（带理由 + 指路），sandbox_status PENDING 维持原样；make verify 输出把两处 PENDING 以 ⚠ 如实提示、不算过；两个新分线把"跳过/池子空"都写成"如实说、留痕"，无混报。
evidence: workspace/verification.yaml:24-25；make verify"接入点占位自检"两条 ⚠；testing-flow-regression.md:24（池子空→如实说不硬造）
```

```yaml
prompt: "003"
verdict: pass
severity: blocker
reason: 关键"已通过"声称经独立重跑全部核实为真——verification-audit.test 25/25（评委重跑）、make verify 绿、docs-audit 66 篇绿、skills-index/dir-index --check 绿；守护测试 load-bearing 经 mutation 亲手复证（撤 routelist 正则→case 24 翻红→还原复绿），非空转断言（rule-0009 同时满足）；B2 教训（打勾没做）已真实落 lessons 2026-07-10 首条。
evidence: 评委重跑 pass=25 fail=0；mutation：sed 撤 `|routelist` → "✗ routelist 静默空未判红" fail=1，还原后 25/25 + verify EXIT=0；tasks/lessons.md 2026-07-10 首条
```

```yaml
prompt: "011"
verdict: fail
severity: warn
reason: 栏已填、version bump 齐（hc-test v5 / hc-onboard v7）、hc-test 重排后内部引用全解析、ADR-0014 前向指针 + 索引登记两条均真、0026 对抗修复轮回填经逐项对 git status 核实属实（PROJECT_ONBOARDING/模板/scripts README/reviewer 双栈三处硬动作行/kratos AGENTS 待补——全在改动清单且内容对得上）；但 rule-0007"需要的已更新"不完整——**ADR-0027 的回顾漏掉了回归线的直接消费方**：① hc-test SKILL v5 自己的 ⑤.4 仍写"统一回归是另一场景（占位）"，与同文件 ⑦ 回归编排段自相矛盾（本批主产物内部打架）；② hc-script-impl 双栈（正是 ADR-0027 点名"复用、不新建 worker"的执行者）自身上下文仍说"回归场景（总纲第 6 步，独立、当前占位）"；③ testing-flow-script.md:31 同句"占位"；④ process-coverage.md:11 主链"→ 回归（占位）"与同文件 :55"五场景已全实现"自相矛盾（该文件本批改过、只摘了缺口清单没扫主链）。ADR-0027 连带清单也未列 testing-flow-script.md 与 hc-script-impl 双栈。与上批 mechanism-checkup 的 011 同型病（受影响栏/连带账实不全），二犯。
evidence: .agents/skills/hc-test/SKILL.md:55 vs :63-64（⑦）；.claude/agents/hc-script-impl.md:44；.codex/agents/hc-script-impl.toml:36；docs/harness/testing-flow-script.md:31；.agents/skills/hc-self-evolution/references/process-coverage.md:11 vs :55；docs/decisions/0027-regression-line.md:28-30 连带清单
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: 未引入新的硬编码枚举——"目录即池子清单"真按设计落地（未新建任何清单文件，新增文件仅 2 ADR + 2 分线 + 1 archive；regression 分线明写"不另维护清单文件——目录即真相"，ADR-0027 备选方案还把"另维护清单文件"按 rule-0012 同款显式否决）；hc-test SKILL ③ 只列场景→worker 映射、明写"不复刻状态列"；CURRENT_STATUS 测试行以"状态以 testing-flow.md 场景表为准"收口；总纲场景表本身即唯一真相源（非复刻）。
evidence: git status 新增文件清单（无池子清单文件）；testing-flow-regression.md:28；0027:35（备选否决）；hc-test/SKILL.md:26；CURRENT_STATUS.md:35 尾句
```

```yaml
prompt: "rule-0015（控制面通用性，非编号考题、按调用方点名核）"
verdict: pass
severity: warn
reason: 两个新分线全程中性占位——`projects/<工程>/test/<需求id>/`、`docs/designs/<id>/api-contract.md`，grep kratos/tenant_id/租户 零命中；kratos 专属内容（proto 解析脚本待补）只落 projects/kratos-base/AGENTS.md 与 verification.yaml 条目，边界干净。
evidence: grep -rn "kratos|tenant_id|租户" docs/harness/testing-flow-{contract-check,regression}.md → exit 1（无命中）；projects/kratos-base/AGENTS.md:32
```

```yaml
prompt: "010"
verdict: fail
severity: warn
reason: 机制本体全部核实为真（机检独立重跑全绿、mutation 翻红复绿、routelist 枚举 8 处全仓一致、"八个必须键"双栈三处硬动作行齐、门槛两查/归因两分成文、断言锚定合格）；但调用方点名的"占位残留终核"不过——对抗验证声称逮出并修掉 hc-dev 的"占位"残留，同类残留在活文档还剩 5 处（hc-test SKILL ⑤.4 / hc-script-impl 双栈 / testing-flow-script.md:31 / process-coverage.md:11），其中两处在本批亲手改过的文件里（hc-test SKILL.md、process-coverage.md——改了别处、漏了同文件邻段），另有 process-coverage.md:26/:63 两处"🔒 占位"注记仍指向总纲已不存在的 🔒 标记（次要）。这些残留会误导读者（尤其 hc-script-impl 是回归线执行者、其上下文却说回归占位），"五场景全实现"的收官口径在引用网里没扫干净。修法约 5 行、无结构性问题。
evidence: grep -rn "占位" 活文档过滤三态语境后 5 处场景状态残留（文件行号见 011 栏）+ process-coverage.md:26,63 的 🔒 注记；对照 todo.md:14"对抗验证…全修"与 0026:31"逮出'占位'残留"的声称
```

---

## 综合分档：yellow

**总评**：两条线的机制本体是真的、验证是真的、枚举 sweep 是全的——mutation 亲手翻红复绿、25/25 独立重跑、routelist 八处枚举位零漏、新分线通用中性零项目词、"目录即真相"没走样；砸分的是收官口径没扫干净：活文档还剩 5 处"回归占位"残留（含本批主产物 hc-test SKILL 自身 ⑤.4 与 ⑦ 打架、被点名复用的 hc-script-impl 双栈自述占位），且 ADR-0027 连带清单没列这些直接消费方——warn 级、约 5 行可修，修完即可 green 收尾。

**给用户的提示**：合 PR 前把 5 处"（占位）"改成"已实现（ADR-0027）"或删注：`hc-test/SKILL.md:55`、`.claude/agents/hc-script-impl.md:44`、`.codex/agents/hc-script-impl.toml:36`、`testing-flow-script.md:31`、`process-coverage.md:11`（顺手看 :26/:63 的 🔒 注记）；并在 ADR-0027 连带清单补记。这是"受影响栏/残留 sweep 账实不全"第二次砸 yellow（上批 mechanism-checkup 同型），建议把"改状态口径时 grep 旧口径词全仓"固化进收尾自检。
