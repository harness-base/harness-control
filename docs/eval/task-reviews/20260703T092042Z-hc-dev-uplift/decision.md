# decision — hc-dev-uplift（L3 收尾 eval）

评委：hc-eval（会话模型，免 key）。全部证据为评委**亲跑 / 亲读**，不采信候选自述。

## 逐题 verdict

```yaml
prompt: "001"
verdict: skipped
severity: blocker
reason: 纯控制面改动（skill / 子 agent / ADR / references），无用户可见业务代码变化，rule-0001 不触发。
evidence: git status 变更集全部落在 .agents/ .claude/ .codex/ docs/decisions/ tasks/——projects/** 零改动。
```

```yaml
prompt: "002"
verdict: pass
severity: blocker
reason: 无 blocked/skipped 被包装成 pass；唯一 ⚠（kratos sandbox_status PENDING）是本任务之前遗留、显式占位，与本任务无关且未被声称通过。
evidence: 评委亲跑 make verify → "✓ 控制面自检通过"；⚠ 行原文为 PENDING 占位提示，非本批引入（ADR-0019 follow-up）。
```

```yaml
prompt: "003"
verdict: pass
severity: blocker
reason: 三项验证声称全部独立复现，无假完成。
evidence: 评委亲跑 make verify（全 ✓）、make docs-audit（"检查了 54 篇"，与声称 54 一致）、python3 tomllib 解析 hc-dev-worker.toml / hc-code-reviewer.toml / config.toml 三份 OK。
```

```yaml
prompt: "004"
verdict: pass
severity: warn
reason: L3 档位判定正确（写 ADR + 改多 skill/子 agent = 高档），高档仪式齐全：方案用户逐点拍、ADR、两轮对抗评审、收尾 eval。
evidence: tasks/todo.md 头部 "level: L3 ｜ task: hc-dev-uplift"（与 review 目录 slug 一字不差）；todo 逐条记方案敲定→build→对抗→eval 链。
```

```yaml
prompt: "011"
verdict: pass
severity: warn
reason: ADR-0021「受影响（rule-0007）」栏五项全填且逐项落实，消费方连带修到位、索引 regen。
evidence: SKILL v2（version:2 / last_reviewed:2026-07-03）；ADR-0009 顶部前向指针（historical 叙述保留）；hc-dev-worker 双栈 + config.toml 注册（git diff 亲核）；hc-code-reviewer 双栈两判据；hc-tech-design 类比改写、hc-test/hc-onboard 互指亲核仍然成立（hc-test 引的"写→审→回改 loop"在新形态 ⑤ 依然存在，非悬空）；.agents/skills/README.md 与 .claude/agents/README.md regen（skills-index --check 随 make verify 过）。
```

```yaml
prompt: "012"
verdict: pass
severity: blocker
reason: 声称与证据锚定关系成立——"~7 major+4 minor 已全修"的每个点名修复评委逐个亲验存在；prose 资产无守护测试可加属合理（结构/索引由 make verify 机检兜）。
evidence: 点名修复逐核——视觉判据无"或"残留（grep "或 inspect|截图或|或截图" 空）；四件套两栈在（worker .md:9-18 / .toml:8-13）；SKILL ③:31 必附 ⑥ 口径句在；skills.md 形态分类 hc-dev 已挪编排式（git diff）；hc-tech-design 类比改写（git diff）；reviewer 尾段用新口径"深度信号"（.md:29）；config description 补两判据（git diff）；minors"原型可点的照点"在 worker/reviewer 四处（grep 命中 4 文件）。
```

```yaml
prompt: "rule-0012 侧检（自定）"
verdict: pass
severity: warn
reason: 无硬编码枚举复刻——两份索引走脚本 regen（--check 进 make verify），CURRENT_STATUS 未被牵动（grep docs/context 无 hc-dev 硬编条目），process-coverage 盘点行按现状更新而非复刻清单。
evidence: make verify 含 skills-index/dir-index --check 全绿；grep hc-dev docs/context → 零命中。
```

```yaml
prompt: "rule-0015 侧检（自定）"
verdict: pass
severity: warn
reason: 新增/改动的 harness 资产全部通用无项目泄漏——"前端/后端/客户端"明标"常见例、不硬编"，路径全用 docs/designs/<id>/ 占位。
evidence: grep "kratos|tenant|租户" 于 SKILL/worker 双栈/reviewer 双栈/ADR-0021 → 零命中（exit=1）；ADR-0021 备选栏明拒"硬编三种专职 worker"。
```

```yaml
prompt: "010"
verdict: pass
severity: blocker
reason: 相关考题全 pass（001 为合理 skipped）；调用方点名的五项重点独立复核全过（明细见下）。
evidence: 本文件五项重点核查记录 + 上列各题证据。
```

## 调用方点名五项重点——独立复核明细

1. **改 bug 用户口径一字一义**：pass。SKILL ⑥:56 四步 = ①本地核实+确认复现场景（"读代码不好核实的，直接从复现下手"）②复现↔根因互相印证（缺一不可）——两个方向都写全（"复现不了就不能说它是真根因（万一找错了呢）"＋"只复现、挖不到根因也没用"）③修改（守护测试先红，"修复前红、修复后绿=抓对点"）④再测试，通过后结束（守护测试转绿+复现重跑+无连带破坏）。与 todo 记录的用户最终口径逐义对上，无"两条路都行"残留（grep 全仓活文档零命中）；且该次用户纠正已按 rule-0011 落 lessons 三段式（tasks/lessons.md 2026-07-03"复现是根因的验证器"条）。
2. **视觉"两件套＋"四处一致、无"或"残留**：pass。八处逐核全为合取（＋/+）：SKILL ④:42 与 ⑤:51、worker .md:31、worker .toml:22、reviewer .md:18、reviewer .toml:17、config.toml:30 description、ADR-0021 决策 5——reviewer 两栈均带"缺一按'未验证渲染'如实标"；grep "或 inspect|截图或|或截图" 全仓零命中。
3. **四件套 ↔ SKILL ③ 闭环**：pass。发端：SKILL ③:31"子模式活（改 bug/重构/迁移）委派 worker 时，派单必附 ⑥ 对应子模式的步骤口径——不靠 worker 自悟"；收端：worker 双栈 ①"派单四件套"第三槽"任务口径（子模式活必附）……照口径走，缺了向总监要，不自悟"（.md:15 / .toml:11，均举改 bug 四步为例）。发收两端 + 缺省兜底（缺了先问）齐。四件套本体只定义在 worker 上下文、SKILL 不复制——符合本仓编排式"约束本体在 worker、skill 留总谱"的既定形态（references/skills.md 不变量），不算漂。
4. **"深度级/常规级/两级"活文档残留**：pass。全仓 grep 命中仅四类：ADR-0009 正文与标题（历史叙述，顶部前向指针明示"保留历史原样"）、decisions/index.yaml 该行 title（须与 ADR-0009 标题一致，index-audit 机检约束）、ADR-0021:37"两级纪律精神"（有锚定所指的保留声明，非悬空）、tasks/todo.md（工作日志转述修复项）。所有 live 规范文档（skill/子 agent/references/config）零残留；替代术语"深度信号/深度活"在 SKILL ③:30 有定义、⑦:62 与 reviewer 尾段引用一致。
5. **两栈等价抽查**：pass。worker .md vs .toml 逐段比对——四件套/就近规则加载/范围硬边界/契约是死的（逐条目枚举一致）/TDD/防技术债/视觉纪律/上报路径/验证如实（blocked≠pass+交付报告三段）/交回 loop 全对齐，无语义差。reviewer .md vs .toml——两条新判据措辞逐句一致（含"= major"定级与"装验证过=挑出"）；尾段差异仅平台派单机制（.md 讲 workflow/agentType，.toml 以"与 .md 行为一致"收口），属双栈惯例、非漂移。config.toml 两处 description 与本体判据同步。

## 综合分档

**green**

总评：主链与五项点名复核全部立得住——用户口径逐义落进 SKILL、八处视觉判据全为合取无弱化、派单口径发收两端闭环、旧术语只活在被明示保留的历史叙述里、双栈零语义差；验证声称三项全部独立复现。

给用户的提示：可以收尾提交（提交仍需你授权，rule 不擅自 git 写）。两个无关本批的已知遗留照旧：kratos sandbox_status 仍 PENDING（ADR-0019 follow-up）；多 worker 并行实战检验按 ADR-0021 follow-up 等真项目大活。
