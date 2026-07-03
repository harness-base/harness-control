# decision — hc-onboard 老项目分支（L3 收尾闸）

评委独立复核（不采信声称）：`make verify` / `make docs-audit` 亲跑，机制真实性（rules-index / index-audit / workflows）逐个核脚本与目录，M2 三处口径逐字比对，两栈逐段比对，步号/段号交叉引用全仓 grep。

## 逐题 verdict

```yaml
prompt: "001"
verdict: n/a
severity: blocker
reason: 纯控制面改动（skill / 子 agent / ADR / 接线文档），不触发 rule-0001。
evidence: git diff HEAD --stat 共 9 文件，全在 .agents/.claude/.codex/docs/tasks，未动 projects/ 业务代码。
```

```yaml
prompt: "002"
verdict: pass
severity: blocker
reason: 无 blocked/skipped 伪装通过；验证结论分类如实。
evidence: 评委亲跑 make verify → "✓ 控制面自检通过"（含 skills/rules/dir 索引无漂移、decisions/features 索引一致、AGENTS↔CLAUDE shim 齐）；make docs-audit → "✓ 50 篇"。与声称一致。
```

```yaml
prompt: "003"
verdict: pass
severity: blocker
reason: 声称的产物与修复全部真实落盘，验证独立复现。
evidence: 0018 在盘 + index.yaml 登记（id: ADR-0018/file 对）；0017 顶部前向指针 + follow-up ② 标"已由 ADR-0018 实现" + related_docs 含 0018；SKILL version:2 / last_reviewed:2026-07-02；reviewer 双栈 diff 逐段核；.agents/skills/README.md 索引已 regen（hc-onboard 行=新描述）。
```

```yaml
prompt: "004"
verdict: pass
severity: warn
reason: 按产物/目标文件判档合理：todo 标 level: L3 ｜ task: hc-onboard-legacy（与本 review slug 一字不差），改动集覆盖 ADR/skill/reviewer 双栈/接线四路，无超档滥读可见证据。
evidence: tasks/todo.md 元行 + git diff HEAD --stat（9 文件全部与任务相关）。
```

```yaml
prompt: "011"
verdict: fail
severity: warn
reason: skill 回顾主体做了（受影响栏四项全部真实更新、version bump、索引 regen），但 M2 口径变更（"项目 ADR 不进控制面 docs/decisions/、落项目自己的决策记录处"）漏同步受影响资产 templates/project-agents.md——其第 32 行仍把项目"设计 / 选型 / 决策记录"指向 `../../docs/decisions/`（即控制面根账本）并写"本工程第一个 ADR 由 hc-onboard 第 3 步落（那里）"，与 SKILL ③第3步/④第5步-3、reviewer ③/d-3、ADR-0018 步骤5-③ 的新口径直接打架：照模板产出的骨架会被自家 reviewer ③/d-3 判 major（"混进控制面 docs/decisions/"）——正是 M2 要堵的"首次实战死锁"同款。ADR-0018 受影响栏未列该模板、也没写"无需更新"说明，不满足 011 通过标准。
evidence: templates/project-agents.md:32（"设计 / 选型 / 决策记录：`../../docs/decisions/`"）vs .claude/agents/hc-onboard-reviewer.md:34+88（"不是混进控制面 docs/decisions/ 的 harness ADR"/"项目 ADR 不进控制面 docs/decisions/…违 rule-0015"）vs ADR-0018 决策3步骤5-③；ADR-0018「受影响」节仅列 skill/reviewer/PROJECT_ONBOARDING/0017 四项。附注：PROJECT_ONBOARDING 口子速查明确"套 templates/project-agents.md"，模板是 hc-onboard 产骨架的直接输入，非旁枝。
```

```yaml
prompt: "012"
verdict: pass
severity: blocker
reason: M2 修后锚定的机制全部真实存在、无编造：rules 半边确系自动（rules-index.sh 全仓 find AGENTS.md 扫 <!-- rule --> 标记生成 docs/rules/index.yaml、--check 进 make verify）；decisions index 确系手维护（无生成脚本，仅 index-audit.sh 双向存在性守）；"现根 workflows 只有 verify.yml"属实；docs/harness/CI.md 存在。本任务无新脚本/机制，不欠守护测试。
evidence: scripts/rules-index.sh 头部+gen()（find . -name AGENTS.md）；grep decisions/index.yaml scripts/ 仅 verify-control-plane.sh 存在性检查；ls .github/workflows/ = verify.yml；ls docs/harness/ 含 CI.md。
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: 无硬编码可自生成枚举：PROJECT_ONBOARDING 守"流程实质以 skill + ADR 为准，不复刻步骤"（正文 0 流程步）；CURRENT_STATUS projects 行只写指针（走 hc-onboard，ADR-0017/0018）；skills 索引由 skills-index regen。
evidence: docs/harness/PROJECT_ONBOARDING.md 引言 + 全文仅速查表/清单；make verify 含"状态文档不硬编码可自生成枚举 ✓"+ 各索引 --check 绿。
```

```yaml
prompt: "rule-0015（侧检，自定）"
verdict: pass
severity: warn
reason: 新增 harness 资产文本零项目词——skill/reviewer 双栈无 kratos/领域名词；tenant_id 仅作 rule-0015 规定的反例警示出现（否定句），非预设。
evidence: grep -rn "kratos|tenant_id" 三文件：仅 SKILL:148 / reviewer.md:62 / toml:53 的反例句。
```

## 调用方指定的四项独立核（结果）

1. **M2 三处口径**：✓ 真一致——ADR-0018 步骤5-③ / SKILL ④第5步-3 / reviewer d-3（.md:88 + .toml:73）四处逐字同口径（"只有 rules 半边自动 + 项目 ADR 落项目自己处"），且锚定机制全部真实（见 012）。**但存在第四处未同步**：templates/project-agents.md:32 与新口径相悖（见 011 fail）。
2. **两栈等价 + 执行环双分支化**：✓ ——description / scope 段（新分支=骨架、老分支=对齐产物）/「先判分支」引言 / a–d 判据 / 工作步骤 1（老分支追加读产物集）/ 步骤 2（老分支硬动作 a–d，含"grep 本次 diff 确认没改业务代码"）/ 步骤 3 回步映射（按分支取步号）/ 结尾"与脚本路径的关系"（新第5步/老第6步）——.md 与 .toml 逐段对得上，toml 在 .codex/config.toml 已注册。
3. **SKILL ⑥ 总览 ↔ reviewer 六块**：✓ 对上——①骨架最小没越界（含老分支口径改判注，两边都有）②AGENTS.md 红线+shim ③选型 ADR ④三态 ⑤忠于确认 ⑥隔离反向越界，语义一一对应；老分支 a–d 四条两边一致。
4. **步号/段号残留**：✗ 有残留（minor，两处）——
   - reviewer `.md:15` / `.toml:12`"对应 hc-onboard skill **第 5 步**「reviewer 审什么」的总览"：分支盲 + 位置过期（总览现居 SKILL ⑥，派发点=新第5步/老第6步；老分支的第 5 步是"引入关联"）。两栈对称残留；同文件第 9/115 行已是正确双分支口径、六块清单就地内联，故非死链，但与 todo"步号残留全修"的声称不符。
   - templates/project-agents.md:4"见 PROJECT_ONBOARDING.md **第 2 步**"：PROJECT_ONBOARDING 已瘦身为 0 流程步的速查（上一批改的），该步号引用悬空；同文件 :32"由 hc-onboard 第 3 步落"未分支限定。属上批遗留，但本次口径变更本应回顾到该模板（并入 011）。

## 综合分档：**yellow**

无 blocker 级 fail：验证真实可复现、无假完成、断言锚定全部核实、隔离守住。两处 warn 级问题（均属同一根因：口径变更没滚到 templates/project-agents.md + reviewer 两栈一处分支盲步号）需修——尤其模板第 32 行，不修则首次老项目实战照模板落骨架会被自家 reviewer ③/d-3 判 major，M2 堵的死锁换个门重新出现。

**给用户的一句话提示**：主体扎实可收，但先补两针再合——① `templates/project-agents.md:32` 项目决策记录指针改为"项目自己的决策记录处"（顺手修 :4 悬空的"第 2 步"引用与 :32 未分支限定的"第 3 步"），并在 ADR-0018 受影响栏补记；② reviewer 两栈 `.md:15`/`.toml:12` 的"skill 第 5 步"改成"skill ⑥（新第 5 步 / 老第 6 步派发）"。
