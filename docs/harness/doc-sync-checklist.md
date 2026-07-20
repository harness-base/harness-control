---
title: 文档同步对照表（doc-sync checklist）
status: active
owner: harness
last_updated: 2026-07-13
source_files: []
related_docs:
  - HOOKS.md
---

# 文档同步对照表（doc-sync checklist）

"改了 X → 须查 Y 是否跟改"的**唯一真相源**（数据）。原 `doc-sync` skill 降级后（ADR-0012），这张表独立成数据文件，由两处消费：

- `scripts/turn-backstop.sh`（Stop 钩子）：触发时 grep 本表的 `🔴手` 行当判据，复查"动了文件但没同步文档"。
- `hc-doc-sync-reviewer` 子 agent：读本表 + 本轮 `git diff` 报漂移。

**`谁兜底` 列**：`✅机检` = `make verify` 已自动兜底（索引/shim/audit 漂了就红），不用人专门记；`🔴手` = 无机器兜底、只能人手同步——**这几行才是真漂移面、钩子/reviewer 只读这几行**。

| 你改了什么 | 回查什么 | 谁兜底 |
|---|---|---|
| `scripts/*.sh` 加 / 删 / 重命名 | `scripts/README.md` 对应章节是否要更新 | 🔴手 |
| 顶层目录加 / 删 | 根 `README.md` 的目录结构表 | 🔴手 |
| 某流程的走法被 skill 承接 / 实质演进（接入、验证、eval 等机制换走法） | 根 `README.md` 与 `docs/README.md` 的对应**叙述节**是否还在教旧走法（门面文档不在批内连带清单里最易漏——2026-07-13 README「接入一个工程」教旧手工三步被用户逮，即此坑） | 🔴手 |
| `docs/` 加 / 删子目录 | `docs/README.md` 路由表 | 🔴手 |
| `docs/decisions/*.md` 新建或大改（ADR）| 相关 skill 是否要更新（rule-0007，必填"受影响 skill"栏）+ `docs/decisions/index.yaml` 登记 | 🔴手（skill 回顾要判断；index 那半机检） |
| `docs/harness/SANDBOX_CONTRACT.md` 改（sandbox 契约） | `hc-create-sandbox` skill + `hc-sandbox-reviewer` 双栈里复述的入口/约束口径要跟改；`verification.yaml` 字段约定、`verification-audit` 字段清单 | 🔴手 |
| `docs/harness/adversarial-review.md` 改（review 编排 pattern，ADR-0022） | **所有引用它的下游都要跟改**（数量勿硬编、以 `grep -rl adversarial-review.md` 为准）：各产出型 skill 的 review 步与「改完重评」行、`hc-self-evolution` 的 review 步、域 部分域 reviewer 双栈（tech-design / prd / e2e / api）的「工作步骤 0：核派单基线」「固定必查（派单方不可省）」节与"并行对抗编排"定性口径、`docs/eval/prompts/010-task-completion-review.md` 的「结论时效」项、ADR-0022 连带栏；**可执行编排模板也要跟**（现有 `hc-prd/references/orchestration-workflow.js` 的 review 段——skill 指它当模板，措辞改了模板没跟=执行者照旧跑单线程） | 🔴手 |
| `docs/harness/testing-flow.md`（总纲）或 `testing-flow-{e2e,api,script,contract-check,regression}.md`（分线）改（ADR-0024/0026/0027） | 两层互指要自洽（总纲场景表/骨架 ↔ 分线细节口径一致）；引用方跟改——`hc-test` SKILL、6 个测试 worker/reviewer 双栈（e2e-qa/api-qa/script-impl 及其 reviewer）上下文里复述的口径、`templates/{e2e,api}-test-case.md` 头注指针、`SANDBOX_CONTRACT` 卡门衔接 | 🔴手 |
| `AGENTS.md` 加 / 改 `<!-- rule: -->` 标记 | `docs/eval/prompts/` 是否要新增 / 更新考题；跑 `bash scripts/rules-index.sh` 重生成 catalog | 🔴手（考题要判断；catalog 机检） |
| `.claude/agents/*.md` 新建 / 改**子 agent** | `.codex/agents/*.toml` 对等是否要同步（**仅子 agent**；skill 走 `.agents/skills/` 双栈共享，Codex 侧**无** skill 对等目录，别把 skill 当子 agent 报） | 🔴手 |
| harness 模块状态变更（done / planned / skeleton）| `docs/context/CURRENT_STATUS.md` 控制面表 | 🔴手 |
| `scripts/turn-backstop.sh` 或其它 hook 触发逻辑变 | `docs/harness/HOOKS.md`；对应 `*.test.sh` 必须红得起来 | 🔴手 |
| 改了 `workspace/verification.yaml` 路由 | `docs/harness/VERIFICATION_ROUTING.md` | 🔴手 |
| 新建 `AGENTS.md` | 同级必补 `CLAUDE.md`（一行 `@AGENTS.md`）—— `verify-control-plane.sh` shim 段会拦 | ✅机检 |
| 新建 skill 目录（`.agents/skills/<name>/`）| 跑 `bash scripts/skills-index.sh` 重生成 `.agents/skills/README.md`；**skill 双栈共享（Claude 侧 `.claude/skills` 软链读同一份），Codex 侧无 skill 对等目录，不用同步** | ✅机检 |
| 新建 / 改模板 `templates/*.md` | `templates/README.md`（`dir-index.sh` 生成，跑 `bash scripts/dir-index.sh templates`） | ✅机检 |
| 改了 PRD 内容 / 新增 PRD | `docs/prds/index.yaml`；`prds-audit.sh` 守章节齐全 | ✅机检 |

**维护**：新增一类资产 / 文档承诺 / hook，本表加对应行（否则该类漂移没人预防也没人检测）。本表是 `🔴手` 判据的唯一来源，turn-backstop 与 hc-doc-sync-reviewer 都读这里，不另抄子集。
