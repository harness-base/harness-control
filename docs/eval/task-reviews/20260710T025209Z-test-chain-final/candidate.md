# candidate — test-chain-final（契约对照线 ADR-0026 + 统一回归线 ADR-0027，测试链收官批）

> 候选产出 = 未提交工作树（`git diff HEAD` 26 文件改 + 5 新文件；分支 feat/mechanism-checkup，stack 在未合 #19 之上）。以下为调用方提供的 candidate 要点原文 + 评委核对的实际改动清单。

## 调用方 candidate 要点（原文）

1. **契约对照**（用户拍：取数用脚本、判断用 agent）：routelist 接入点进 verification.yaml（kratos PENDING 占位+指路）+ verification-audit 扩认（25/25+mutation）+ hc-onboard 补能力创建（新老两分支 问什么/落什么 + SKILL ⑤ 枚举 + reviewer 双栈"八个必须键"三处硬动作行 + PROJECT_ONBOARDING/模板/scripts README 等全仓枚举 sweep）+ 分线 testing-flow-contract-check.md（门槛两查/agent 语义对比不机械 diff/偏差三类归因/与 hc-dev 对账分工）。
2. **回归线**：分线 testing-flow-regression.md（目录即池子清单/卡门/逐需求顺序跑防互染/归因两分[脚本过时→hc-script-impl 更新/实现回归→hc-dev 修、分不清问用户]/重跑到过）+ 复用 hc-script-impl 不新建 worker。
3. hc-test SKILL v5 编排段重排 ④用例⑤脚本⑥契约对照⑦回归⑧防线⑨门禁⑩演进；hc-dev 交棒句翻五场景全实现；kratos AGENTS 待补记录；ADR-0014 前向指针注补 0026/0027；ADR 索引登记两条。

声称的已做验证：对抗验证 3 镜头逮 2 blocker + 6 major + 8 minor 已全修（B1 reviewer 双栈枚举病、B2 PROJECT_ONBOARDING 打勾没做[lessons 已记]）；make verify + docs-audit(66) + verification-audit.test 25/25 + TOML 全绿。

## 评委核对的实际改动清单（git status，2026-07-10）

修改 26：`.agents/skills/README.md`、`hc-dev/SKILL.md`、`hc-onboard/SKILL.md`、`hc-onboard/references/{new,old}-project.md`、`hc-self-evolution/references/{process-coverage,project-onboarding}.md`、`hc-test/SKILL.md`、`.claude/agents/hc-onboard-reviewer.md`、`.codex/agents/hc-onboard-reviewer.toml`、`docs/context/CURRENT_STATUS.md`、`docs/decisions/0014-hc-test-orchestration.md`、`docs/decisions/index.yaml`、`docs/harness/{PROJECT_ONBOARDING,README,VERIFICATION_ROUTING,doc-sync-checklist,testing-flow}.md`、`projects/kratos-base/AGENTS.md`、`scripts/README.md`、`scripts/verification-audit.{sh,test.sh}`、`tasks/{lessons,todo}.md`、`templates/project-agents.md`、`workspace/verification.yaml`

新增 5：`docs/decisions/0026-contract-check-line.md`、`docs/decisions/0027-regression-line.md`、`docs/harness/testing-flow-contract-check.md`、`docs/harness/testing-flow-regression.md`、`tasks/archive/2026-07-09-mechanism-checkup.md`
