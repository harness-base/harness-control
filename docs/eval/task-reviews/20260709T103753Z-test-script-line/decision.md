# decision — hc-test 脚本线做实 + testing-flow 拆分（L3）

评委独立复核方式：`git diff HEAD` 全貌（本批全在工作区，`git diff origin/main...HEAD` 为空已核）；搬移零丢失用机械 diff 抽验（`git show HEAD:docs/harness/testing-flow.md` 提旧 e2e/api 两段 vs 两分线正文逐行比）；`grep -rn 'API-NN'`/`线别`/`篡改`/`脚本线.*占位`/领域词 全仓扫；机检独立重跑（make verify / docs-audit / skills-index --check / 22 份 TOML tomllib parse），不采信候选声称。

## 逐考题

```yaml
prompt: "010"
verdict: pass
severity: warn
reason: 候选全部关键声称经独立复核为真——搬移零丢失（机械 diff 证实正文逐字节一致）、API-NN 功能文档零残留、新锚口径 9 文件一致、机检重跑全绿、4 镜头对抗验证的 9 项修复逐条见 diff；无假完成、无 blocked 充 pass。留 1 处 warn 级残留（ADR-0014 更新注过时，见 findings）。
evidence: |
  已核 pass 面：
  - 搬移零丢失（非抽 5 段、做了全段机械比对）：旧总纲 e2e 段（L50-92）/ api 段（L94-133）与 testing-flow-e2e.md / testing-flow-api.md 正文 diff——唯一差异 = 标题级别（###→##）+ 分线标题行 + 新增 1 行导语，正文逐字节一致，零丢失零改动。旧总纲其余段（场景表/占位段/"分阶段实现整体发布"句）在新总纲有承接或 ADR-0024 影响段有交代。
  - API-NN 零残留：grep 全仓唯一命中 tasks/todo.md:15（对抗验证记录、叙史非活口径）。新锚口径「TC-NN+线别消歧」（e2e/api 编号空间重叠、分目录或前缀）在 9 个功能文件一致：testing-flow.md:58 / testing-flow-script.md:21 / hc-test SKILL ⑤.2 / hc-script-impl .md+.toml / hc-script-reviewer .md+.toml / config.toml:94 / ADR-0024 决策 2①——抽 4 处逐字核对口径无分叉。
  - 机检独立重跑（非引用候选输出）：make verify EXIT=0（rules/dir/decisions 索引无漂移、shim、各账本 audit 绿，仅 kratos-base sandbox_status PENDING 提醒=既有已知项）；make docs-audit 61 篇过；skills-index --check 无漂移；22 份 .codex TOML tomllib 全 parse。
  - 对抗验证 9 项修复逐条 diff 核实：e2e-reviewer 双栈已改指 testing-flow-e2e.md（.md:9,34 + .toml:8,29）✓；hc-create-sandbox ①"占位中"→"已实现"+v3 ✓；process-coverage 三处刷新 ✓；模板头注指分线 ✓；ADR-0016 头部前向指针 ✓；hc-script-reviewer 改"不落盘反向验证"、无"篡改预期"残留（grep 证）✓；ADR-0024 影响段交代定位句移除 ✓；受影响栏回填 create-sandbox/self-evolution="是" ✓；checklist 引用方名单含 templates ✓。
  - 证据结构：todo.md 标 level: L3 ｜ task: test-script-line，逐项 [x] 带具体修复叙述；optimization-log 本批 3 条捞获全销、销号理由与 diff 对得上（分线文件进 dir-index 不进 docs/README 泛述行=守 rule-0012）。
  findings（warn 级，不推翻 pass）：
  - F1 ADR-0014 头部更新注（2026-07-01）仍写"（脚本线 / 统一回归仍占位）"——本批把脚本线翻转为已实现后该句已过时，且 ADR-0014 正是 ADR-0024 所填占位的出处 ADR、其 related_docs 无 0024。本仓惯例（ADR-0016 填 api 占位时给 0014 加过注；35e90d8 批"被推翻旧 ADR 加前向指针"；本批还给 0016 加了注）都指向应同步刷新此注。缓解：该注自带"实现状态以 testing-flow.md 场景表为准、本 ADR 不复刻"指针，读者可达真相源；对抗验证同类项（hc-create-sandbox / process-coverage"还标占位"）已修，此处属同类漏网第三处。
  - F2（minor）todo.md:9 写"总纲 150→75 行"，实测 wc -l = 70 行（ADR-0024 写 ~70，正确）；账面小误差、无实质影响。
  - F3（minor）todo.md 收尾 Review 段未补（rule-0013 要求收尾前补；"收尾 eval → 独立 PR"项尚开着，属流程内、收尾时须补上）。
```

```yaml
prompt: "011"
verdict: pass
severity: warn
reason: ADR-0024「受影响 skill」栏逐条与实际 diff 一一对应（含修复后回填的 create-sandbox/self-evolution="是"）；4 支"是"的更新属实 + version bump 齐（hc-test 3→4、hc-dev 4→5、hc-create-sandbox 2→3）；4 支"否"的核实为真（仅 hc-prd 引总纲路径、未拆走不悬空）；连带清单 12 项逐项落地；ADR-0016 前向指针形态照 35e90d8 惯例。唯一 warn 缺口=ADR-0014 更新注未随本批刷新（010-F1，ADR 非 skill、不触本题判失败线）。
evidence: |
  - 受影响栏 vs diff：hc-test="是"（场景表🔒→✅、⑤ 脚本线编排段、description 加"写跑一体/写测试脚本"触发词、v4）✓；hc-dev="是"（⑦ 收尾交棒改"脚本线已实现[ADR-0024]、契约对照/回归占位、以场景表为准"、v5）✓；hc-create-sandbox="是"（①"占位中"→"已实现"、v3）✓；hc-self-evolution="是"（process-coverage 3 hunks：主链接力加 script-impl→reviewer、缺口清单摘"测试脚本"改留契约对照/回归+指针、优先补改口径）✓。
  - "否"的核实：grep testing-flow 于 hc-prd/hc-tech-design/hc-onboard/hc-add-rule SKILL——仅 hc-prd:42 引 `docs/harness/testing-flow.md`（总纲路径未变、不悬空），其余零引用。"否"的说明成立。
  - 连带清单逐项：新双栈 4 文件 + config.toml 两注册块（L93-99）+ .claude/agents/README regen（2 行新增）✓；8 个现有 agent 双栈指针改指分线（hc-e2e-qa/hc-api-qa/hc-e2e-reviewer/hc-api-reviewer × .md/.toml，diff 全见）✓；SANDBOX_CONTRACT 卡门处（:50）只提"测试脚本线"不提小节、无需改（清单写"若提小节则跟"）✓；doc-sync-checklist 新增 testing-flow 总纲/分线行（含两层互指自洽 + 6 worker/reviewer 双栈 + 模板头注）✓；CURRENT_STATUS test-cases 行 ✓；docs/README 收纳原则 3 条成文 ✓；templates 两头注指分线 ✓；ADR-0016 头部"更新（2026-07-08）"注 + related_docs 补 0024、正文保留原样（照 35e90d8 惯例）✓；decisions/index.yaml 登记 ADR-0024、make verify decisions 索引一致 ✓；docs/harness/README（dir-index）收录 3 分线、--check 绿 ✓。
  - warn 缺口：docs/decisions/0014-hc-test-orchestration.md:18 更新注"（脚本线 / 统一回归仍占位）"已过时、related_docs 无 0024——本批给 0016 加注却漏 0014（0014 才是脚本占位的出处）。判 pass 依据：011 判失败线=「大改没回顾 skill / 受影响栏空着」，两者均不成立；此缺口计 warn 进综合分档。
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: 本批触碰的状态/索引类文档全部守住"指针不复刻"：hc-test SKILL ③ 场景表只列场景→worker 映射、明文拒绝复刻状态列（引 rule-0012）；总纲场景表是唯一状态真相源本体（非复刻方）；process-coverage 刷新后无新硬编状态（缺口举例带"实况以场景表为准、别在这复刻"指针）；CURRENT_STATUS 新增叙述带"状态以场景表为准"指针；自动生成索引（skills/agents/harness README、decisions index）全走 regen + --check 绿。
evidence: |
  - hc-test SKILL ③：表仅两列（场景｜worker → reviewer），状态列不存在；表头明文"权威表在 testing-flow.md——本总谱只列映射、不复刻状态列（rule-0012：复刻状态会漂，已栽过）"。
  - process-coverage 3 hunks 复核：缺口行改为"接口契约对照/统一回归=缺口（……测试脚本已实现 ADR-0024——各线实况以 testing-flow.md 场景表为准，别在这复刻）"；优先补行同加"实况以场景表为准"——举例＋指针形态，合 rule-0012"举 1–2 例可以"。
  - CURRENT_STATUS test-cases 行：新增"测试脚本线已实现（ADR-0024…）；契约对照/统一回归仍占位，状态以 docs/harness/testing-flow.md 场景表为准"——模块状态变更进 CURRENT_STATUS 是 checklist 明文要求（🔴手行），带指针、非整列枚举。
  - 自动生成清单零手写：.agents/skills/README（skills-index regen、--check 绿）、.claude/agents/README（dir-index +2 行）、docs/harness/README（dir-index +3 行）、decisions/index.yaml（index-audit 一致）——均由生成器产出，make verify 独立重跑绿。
  - warn 备注：CURRENT_STATUS 那句"契约对照/统一回归仍占位"是场景表状态的局部复述（带指针缓解），将来回归线做实时是潜在漂移点——与 ADR-0014 注（010-F1）同型，收尾时可顺手収敛表述。
```

```yaml
prompt: "rule-0015（另核）"
verdict: pass
severity: warn
reason: testing-flow-script.md + hc-script-impl / hc-script-reviewer 双栈 4 文件全为通用中性——占位一律 projects/<工程>/、test/<需求id>/、docs/test-cases/<id>/；grep kratos/tenant/租户/订单/商品/支付 于全部新分线+新 agent 文件零命中；bash/go test/playwright/pytest 仅作"技术形态源驱动"的中性举例（调用方明示口径内）且明文"按工程真实栈定、不硬编不预设"。
evidence: |
  - grep -in 'kratos|tenant|租户|订单|商品|支付' testing-flow-{script,e2e,api}.md testing-flow.md + 新 agent 双栈 4 文件 → (none)。
  - 领域假设检查：脚本落点（projects/<工程>/test/<需求id>/）、helper 位置（"如 test/lib/，位置随工程惯例"）、语言框架（源驱动条款，rule-0015 自引）均无项目预设；ADR-0024 备选段提 kratos 先例属决策依据叙述（decisions 区，非 harness 资产），不违隔离。
```

## 综合分档：yellow

**总评**：一批扎实的 L3——搬移零丢失经机械 diff 证实、9 项对抗修复逐条落地、受影响栏与事实一一对应、机检独立重跑全绿、新资产通用中性；唯一实质残留是 ADR-0014 头部更新注仍称"脚本线仍占位"（本批翻转状态后过时、related_docs 缺 0024），与本批已修的两处同型漏网、且违背本仓自己两次演练过的前向指针惯例——warn 级、3 行即修，按 rubric 计 yellow、可有条件收尾。

**给用户的提示**：收尾前顺手三件小事——① ADR-0014 头部注补一句"更新（2026-07-08）：脚本线占位已由 ADR-0024 实现"+ related_docs 加 0024；② todo.md 补 Review 段（rule-0013）并把"150→75 行"改成实测 70；③ 其余可直接进 PR，无 blocker。
