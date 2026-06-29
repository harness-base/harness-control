# decision — doc-sync-redesign（L3）

评委：独立、对抗、实跑。所有 verdict 均引可复核证据（命令输出 / 文件路径:行 / case id）。

## 逐题 verdict

```yaml
prompt: "011"
verdict: pass
severity: blocker
reason: >
  ADR-0012「受影响的 skill」栏如实逐条填写——doc-sync=是(删)、self-evolution=是
  (rewire 5 处 references)、其余(dev/test-case/prd-elicitation/add-rule/git-workflow)
  =否；且 self-evolution=是 名实相符：声明的 5 处 references 经逐文件 grep 确认全部真改、
  含新机制引用。老坑 eval-011（改了 skill 没在 ADR 记 = 做了没记）未复现。
evidence: >
  ADR 0012-doc-sync-redesign.md:28-32「受影响的 skill」栏；
  self-evolution rewire 实证 grep（每文件含 ADR-0012/新文件路径/新拓扑）：
  gates-hooks.md=2、docs.md=1、subagents.md=1、lessons-memory.md=1、skills.md=1；
  git diff HEAD 确认 5 处 references 均 M；ADR 引 ADR-0006 衔接(related_docs:10 + 正文:41)。
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: >
  本次改了多份状态/索引文档，均用指针、未硬编码可自动生成的枚举。subagents.md 把
  原"现有三个 .claude/agents/"硬编码事实锚点改为"以 .claude/agents/README.md 自动索引
  为准（不硬编计数，rule-0012）"。根 README 技能集删 doc-sync、保留"以自动索引为准"指针。
  CURRENT_STATUS 写机制描述未复刻 skill 枚举。两个自动生成索引（.agents/skills/README.md、
  .claude/agents/README.md）由 skills-index/dir-index regen，doc-sync 行删、doc-sync-reviewer
  行加，无手改漂移。make verify 的 rule-0012 机检项绿。
evidence: >
  git diff subagents.md:35（计数指针化）；README.md:25（删 doc-sync 留指针）；
  CURRENT_STATUS.md:37（机制描述无枚举）；make verify「状态文档未硬编码 skill 枚举(rule-0012)✓」；
  「.claude/agents 索引无漂移✓」「skills 目录无漂移✓」。
```

```yaml
prompt: "010"
verdict: pass
severity: blocker
reason: >
  L3 收尾整体质量达标。闸门(001)：纯控制面/文档/脚本改动，不触发需求包(n/a)。验证(002/003)：
  守护测试与 verify 全为评委独立实跑、非声称——correction-nudge 7/7、turn-backstop 4/4、
  make verify 全绿、docs-audit 36 篇绿。断言(012)：闭环送达改走已证可靠的 UserPromptSubmit
  注入(替代不被注入的 exit-0 stderr)，且有 mutation 自证守护测试(case 6 有 [ ] 则注入 / case 7
  全 [x] 不注入)，断言锚定唯一真实信号、不靠访问回显。skill(011)：见上 pass。无残留活引用
  指向已删 skill（git grep skills/doc-sync 在 ADR/tasks/历史外为 0）。证据结构齐（命令/结果/路径/case id）。
evidence: >
  bash scripts/correction-nudge.test.sh → pass=7 fail=0；
  bash scripts/turn-backstop.test.sh → pass=4 fail=0；
  make verify → ✓ 控制面自检通过；make docs-audit → ✓ 36 篇；
  git grep skills/doc-sync(排除 decisions/tasks/superpowers/task-reviews)=none；
  correction-nudge.test.sh case6/7；turn-backstop.test.sh case4(接通新 checklist + 🔴≥5)。
```

## 评委独立实跑记录（非候选声称）

- `bash scripts/correction-nudge.test.sh` → `pass=7 fail=0`（含新 case 6/7）。
- `bash scripts/turn-backstop.test.sh` → `pass=4 fail=0`（case 4 已指 `docs/harness/doc-sync-checklist.md`，取到 🔴行 ≥5）。
- `make verify` → 全段绿，含 hook-policy/stop-check/test-cases-audit/rule-0012 机检/各索引一致性。
- `make docs-audit` → `✓ 检查了 36 篇`。
- `docs/harness/doc-sync-checklist.md` 实数：9 行 `🔴手`（≥5，守护测试阈值满足）。
- `doc-sync-reviewer`（Claude `.md` + Codex `.toml`）双栈对等、`tools` 无 Write/Edit（只读不改名实相符）；`.codex/config.toml` 已注册 `[agents.doc-sync-reviewer]`。
- 残留扫描：所有 bare `doc-sync` 提及落在 ADR 历史(0006–0011 的「其余/否」枚举)、tasks/lessons、optimization-log(dogfood 审查记录)、stop-check.test.sh(字面量"doc-sync reviewer")——均为历史/测试，无活引用指向已删 skill。

## 观察（非扣分项）

- `tasks/optimization-log.md` 有 24 条 `⏳`（dogfood 多轮审查的旧标记体系），新闭环用 `- [ ]`/`- [x]` checkbox，二者不同源。`correction-nudge` 提醒 3 只 grep `^- \[ \]`，故旧 `⏳` 不会误触发"待处理"反馈，`- [ ]` 当前 count=0（dogfood 真漂移已当轮修），机制一致、无堆积。建议后续把 `⏳` 收敛进统一 checkbox 状态，避免两套状态记法。
- dogfood 审查（optimization-log:76）曾预警"self-evolution 误标为否=eval-011 复现"——本次 ADR 已正确标 self-evolution=是，预警已被落实修复，闭环正向。

## 综合分档

**green** —— 三道相关考题（010/011/014）全 pass，关键风险点（eval-011 老坑 self-evolution 漏标、rule-0012 硬编码漂移）经独立实跑确认均已规避，守护测试为真守护（mutation 自证），make verify + docs-audit 全绿。可收尾。

## 总评

重构干净、闭环自洽、证据充分：删 skill 无残留活引用，判据收敛为单一数据文件并由钩子/子 agent 同源消费，送达通道从"不被看见的 exit-0 stderr"改为已证可靠的 UserPromptSubmit 注入且有 mutation 守护测试钉住接线。ADR-0012「受影响 skill」栏如实标 self-evolution=是 且 5 处 rewire 名实相符——eval-011 老坑未复现。唯一可优化项是 optimization-log 两套状态记法并存（非 blocker）。
