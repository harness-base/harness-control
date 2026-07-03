# candidate — sandbox 契约 + hc-create-sandbox skill（L3，ADR-0019）

任务：契约先行——入口 up（起完即基线）/down/status（exit 0 机器可判）必须 + reset（回基线≠清空）/seed 可选；资产/脏数据两分 + 基线态 + 一键导入推荐；幂等/具名/自包含/fail loud/status 真查五硬约束；三层检查（建时真跑验收[双 up+status 翻转] / hc-sandbox-reviewer 判断层 / 运行时卡门归脚本线）；登记拆三显式字段；kratos 存量对齐（down 真命令、status 诚实 PENDING，本批不硬造——那是 skill 首个实战）。

## 候选产物（git diff HEAD 21 文件 +99/−108，另 6 项 untracked 新增）

- 契约真相源：`docs/harness/SANDBOX_CONTRACT.md`（新增：入口表 / 数据口径 / 五硬约束 / 三层检查 / 登记块）
- ADR：`docs/decisions/0019-hc-create-sandbox.md`（新增）+ `docs/decisions/index.yaml` 登记 + ADR-0017 follow-up ① 标"已由 ADR-0019 实现" + related_docs 加 0019
- skill：`.agents/skills/hc-create-sandbox/SKILL.md`（新增，6 步：定工程 → 聊形式源驱动 → 照契约落脚本 → 真跑验收[双 up 验幂等 + status 翻转，缺任一不收] → 接线 → 对抗评审）
- reviewer 双栈：`.claude/agents/hc-sandbox-reviewer.md` + `.codex/agents/hc-sandbox-reviewer.toml`（六块：status 真查还是装的=blocker / 幂等真处理 / 具名不猜端口 / 资产·脏口径 / 真跑证据=blocker / fail loud+边界）+ `.codex/config.toml` 注册
- 机检：`scripts/verification-audit.sh` 字段正则扩认 `sandbox_down`/`sandbox_status`/`sandbox_reset`/`sandbox_seed` + `verification-audit.test.sh` 加 case 19–23（含逐分支变异锁）
- 登记：`workspace/verification.yaml` 注释/示例三字段化 + kratos-base 存量对齐（`sandbox_down` 真命令、`sandbox_status: PENDING` 有理由）
- 指针面：VERIFICATION_ROUTING / PROJECT_ONBOARDING / testing-flow（脚本线卡门）/ hc-onboard skill + onboard-reviewer 双栈「七个必须接入点」扩三字段 + 缺键判据 / templates/project-agents.md / CURRENT_STATUS / doc-sync-checklist 加 SANDBOX_CONTRACT 行 / projects/kratos-base/AGENTS.md 待补记录 / skills·agents·harness README 索引 regen

## 候选声称（待独立复核）

- `make verify` ✓、`docs-audit` ✓(52)、`verification-audit.test` **23/0**
- **变异锁生效**：删正则 `|sandbox_status` 分支 → 自测翻红（对抗评审挖出"3/4 新字段无守护、删分支全绿逃逸"后补）
- 两轮对抗评审（契约一致性栈 + 忠实栈）收敛 ~7 major + 3 minor 已全修，根因 = "登记模型 1→3 字段，旧模型复述点没扫"——「五个接入点」枚举集群 / 示例块 / CURRENT_STATUS / ADR-0017 follow-up / kratos 待补记录 / testing-flow 表行全扫
- kratos 存量对齐真实：Makefile 真有 sandbox-up/down、无 status

## 调用方指定重点独立核

① 变异实验真锁住没（评委自删 4 个分支各跑一遍）；② 全仓残留「五个接入点/单 sandbox 字段」旧口径；③ 契约/ADR/skill/reviewer 双栈五处口径一致；④ kratos 存量对齐真实。
