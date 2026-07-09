# candidate — hc-test 脚本线做实 + testing-flow 拆分（L3）

> 候选产出副本（调用方提交口径）。依据 `docs/decisions/0024-test-script-line.md`。改动为工作区未提交状态（26 修改 + 8 新增，`git diff origin/main...HEAD` 为空——本批全在工作区），分支 `feat/features-retirement`（与 origin/main 同点）。

## 声称的改动

1. **testing-flow 拆分**：总纲 150→75 行 + 3 分线平铺 `docs/harness/`（`testing-flow-{e2e,api,script}.md`；e2e/api 原文搬移、script 新写）。
2. **脚本线三步（写跑一体）**：case 镜像用例锚 `TC-NN`+线别消歧 / sandbox 卡门 / 失败两分（脚本 bug 改脚本、实现 bug 报 hc-dev）/ 全绿或如实归因 / 入池工程内 `test/<需求id>/`。
3. **新 hc-script-impl + hc-script-reviewer 双栈** + config 注册；hc-test SKILL v4 / hc-dev v5 / hc-create-sandbox v3；8 个现有 agent 指针跟改；docs/README 收纳原则成文；checklist / CURRENT_STATUS / 模板头注 / ADR-0016 前向指针。

## 声称的验证

- 4 镜头对抗验证：搬移零丢失 clean；挖出 4 major + 5 minor 已全修（最重：API-NN 凭空口径 → 改 TC-NN+线别消歧全链 9 文件；e2e-reviewer 双栈残留；两处"脚本线占位"未翻转；reviewer"篡改预期"矛盾；"分阶段实现整体发布"句移除无交代 → ADR 影响段已补）。
- `make verify` + `docs-audit`(61) + skills-index + TOML 全绿。

## 批清单（评委自 `git status` 复核）

- 修改（26）：hc-test / hc-dev / hc-create-sandbox SKILL、hc-self-evolution process-coverage、4 现有测试 agent 双栈（8 文件）、`.codex/config.toml`、`.agents/skills/README.md`、`.claude/agents/README.md`、`docs/README.md`、`docs/harness/README.md`、`doc-sync-checklist.md`、`testing-flow.md`、CURRENT_STATUS、ADR-0016、`decisions/index.yaml`、templates 两模板头注、tasks/{todo,optimization-log}。
- 新增（8）：hc-script-impl / hc-script-reviewer 双栈 4 文件、ADR-0024、testing-flow 3 分线。
