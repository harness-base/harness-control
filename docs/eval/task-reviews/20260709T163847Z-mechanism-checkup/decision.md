# decision — mechanism-checkup（机制体检批，ADR-0025）

评委：hc-eval（独立复核，不采信声称）。复核动作：`make verify` / `make docs-audit` 独立重跑；`stop-check.test.sh` / `hook-policy.test.sh` 独立重跑；**两个 mutation 亲手做**（杀 stop-check `eval: 要` 判据行 → 15/16 红、杀 hook-policy 裸 force 行 → 16/17 红，均还原复绿）；hook-policy 6 条命令**直接管道实测**（绕开测试 harness）；活文档残留全仓 grep（档位 / L2+ / L[0-6] 档 / level: L）；rule-0004 全仓引用点 grep；ADR-0025 受影响栏逐项对 `git diff HEAD` 文件清单；`codex` 二进制实测（command not found，PENDING 声称属实）。

---

```yaml
prompt: "002"
verdict: pass
severity: blocker
reason: 无 blocked/PENDING 被报成 pass——Codex hooks 接线在 4 处（ADR-0025 决策 6、.codex/config.toml 注释、HOOKS.md codex 对等段、gates-hooks 判据行）一致标 PENDING 待真机，未声称"接好了"；optimization-log 销号注明确写"验证状态 PENDING"；本机 codex 实测 command not found，与"无法真跑"声称一致。
evidence: .codex/config.toml:99-105（PENDING + 四项风险 checklist）；docs/harness/HOOKS.md:73；`which codex` → not found
```

```yaml
prompt: "003"
verdict: pass
severity: blocker
reason: 所有关键"已通过"声称经独立重跑核实为真——stop-check 16/16、hook-policy 17/17（评委重跑，非采信）；两个 mutation 声称亲手复现（杀判据行→翻红→还原复绿，load-bearing 非空转）；hook-policy 6 形态直接管道实测行为与声称一致（--force/main/HEAD:refs/heads/main/--mirror 拦，with-lease/feat/main-page 放）；make verify、docs-audit 全绿。
evidence: 评委重跑输出 pass=16 fail=0 / pass=17 fail=0；mutation：注释 stop-check.sh:24 → "eval:要 +Review 无产出未拦" fail=1，注释 hook-policy 裸 force 行 → fail=1，均还原后复绿；6 条直调 exit 码 1/1/1/1/0/0
```

```yaml
prompt: "011"
verdict: fail
severity: warn
reason: rule-0007 的实质（skill 真回顾、该改的真改了）做了，但 ADR-0025「受影响 skill」栏没随对抗修复轮刷新，与实际改动不一一对应——hc-git-workflow 列在"否"，实际本批改了它的分级表（SKILL.md 还自引"ADR-0025 补齐机器拦截"，自相矛盾）；连带清单漏了对抗轮实改的 scripts/README.md、docs/README.md、hc-eval 派单四件套（.claude/agents/hc-eval.md、.codex/agents/hc-eval.toml、evaluator.md、run-eval.sh）；反向还多列了 templates/project-agents.md（实际未改、本就无档位残留）。此外规则删改本身走 hc-add-rule 对照表核实合格：本体删+空缺注记 ✓、rules-index regen（verify 绿）✓、eval 004 下架+互引清（010 摘引、prompts 零残引）✓、活文档引用点零残留 ✓、ADR-0011 前向指针 ✓、编号不复用 ✓、lessons 旧 opt: rule-0004 标记跟改 ✓。
evidence: docs/decisions/0025-mechanism-checkup.md:34（hc-git-workflow ／ 否）vs git diff HEAD -- .agents/skills/hc-git-workflow/SKILL.md（高危禁止行改写并注 ADR-0025）；:35 连带清单 vs git status 32 文件对照；templates/project-agents.md 无 diff 且 grep 档位/L2+ 零命中
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: 新写/改写的文档未引入可自动生成清单的硬编码枚举——CONTEXT_LOADING 改写为流程性引用链（举例 hc-onboard/testing-flow 各 1，属允许的 1–2 例）；HOOKS.md 新增拦截形态清单镜像 hook-policy.sh（无对应 *-index 自动生成源，且 source_files 已声明、行为一致靠人审的局限 gates-hooks 已写明）；gates-hooks 还顺手把硬编码用例数"pass=6"改成"以 fail=0 为准"（主动消灭一处枚举漂移源）；verify 的 rule-0012 机检绿。
evidence: docs/context/CONTEXT_LOADING.md 引用链 6 条（流程非枚举）；gates-hooks.md:36 diff；make verify "状态文档未硬编码 skill 枚举" ✓
```

```yaml
prompt: "010"
verdict: pass
severity: blocker
reason: 收尾综合——验证真实（002/003 全核实）、断言锚定（stop-check/hook-policy 测试断言真实 exit 码、mutation 自证 load-bearing，符合 rule-0009）、活文档档位残留终核为零（全仓 grep：剩余命中均为 ADR-0025 自述/兼容注记/向后兼容测试夹具/带前向指针的历史 ADR/task-reviews 与 archive/lessons 正文/已完结的 kratos-base s0-s3 plan 历史工作产物）、机检独立重跑全绿；唯一拖分项是 011 的 ADR 受影响栏账实不符（warn）。
evidence: grep -rn '档位|L2+|L[0-6] 档|level: L' 活文档过滤后零实质残留；make verify EXIT=0；docs-audit 62 篇 ✓；010 考题本身已摘 004 引用（本评按新版 002/003/011/012 口径套用）
```

---

## 综合分档：yellow

**总评**：批本体扎实——两个新闸门（stop-check eval 判据、hook-policy 两拦+冷门形态）经评委亲手 mutation 复证 load-bearing，PENDING 三态诚实，活文档档位残留清得干净，规则删改走全了 hc-add-rule 对照表；唯一 warn 是 ADR-0025「受影响 skill」栏没随对抗修复轮回填——hc-git-workflow 明明改了却还挂在"否"，连带清单也漏了对抗轮补改的 6 个文件、多列了 1 个未改文件。账实不符正是本仓 gates-hooks 里记过的老坑型（"声称无损实则偷改"同族，方向相反：实改了却记没改）。

**修复清单（修完可收尾）**：
1. ADR-0025:34 —— hc-git-workflow 从"否"行拆出：`是（hooks 半边：分级表"高危禁止/写需授权"行跟两拦刷新）`。
2. ADR-0025:35 连带清单补：`.agents/skills/hc-git-workflow/SKILL.md`、`scripts/README.md`、`docs/README.md`、hc-eval 派单四件套（`.claude/agents/hc-eval.md` / `.codex/agents/hc-eval.toml` / `docs/eval/evaluator.md` / `scripts/run-eval.sh`）；`templates/project-agents.md` 改注"核过无残留、未改"或删除。

**顺手项（不卡收尾）**：
- gates-hooks.md:62 格式残缺：「〔旧口径存档」括号只开不闭（〔=1、〕=0）+ 残留半个 `机制**` 粗体闭标记，存档段边界读不出来。
- tasks/self-evolution-plan.md:35 维度 4 仍写"L2+/关键点收尾必评"（半历史 plan，但被 gates-hooks 引用过，建议顺手同步或加历史注）。

**给用户的一句话**：机制本体（闸门+退役+接线）经独立 mutation/实跑复证全部属实，放心；只差 ADR-0025 受影响栏两处账实回填（约 3 行），修完即绿。
