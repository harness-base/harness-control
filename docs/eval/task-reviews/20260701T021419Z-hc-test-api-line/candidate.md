# candidate（副本）— hc-test api 用例线 build

任务：填 ADR-0014 占位的 api 用例线——照 e2e 那套结构建 api 用例 worker + reviewer 双栈子 agent + 模板 + 扩机检 + 接线。
task slug：`hc-test-api-line` ｜ level：L3 ｜ 收尾闸：rule-0005。

核心设计决策（ADR-0016，用户 2026-07-01 拍）：
- A) 覆盖 = 与接口来源一一对应（每接口一用例、每业务异常各一 case）。
- B) 接口来源硬门槛（契约 ＞ 用户指定源 ＞ 无则 MUST STOP，不升全局规则、落 agent 上下文）。
- C) 源驱动不预设（协议/横切/Mock 按来源，不硬编项目假设，rule-0015）。

## 候选产物清单
- ADR：`docs/decisions/0016-hc-test-api-testcase-line.md`（决策留档）+ `docs/decisions/0014-hc-test-orchestration.md`（前向指针，占位→已由 0016 实现）
- 子 agent 双栈：`.claude/agents/hc-api-qa.md` + `.codex/agents/hc-api-qa.toml`、`.claude/agents/hc-api-reviewer.md` + `.codex/agents/hc-api-reviewer.toml`
- 模板：`templates/api-test-case.md`
- 机检：`scripts/test-cases-audit.sh` 扩展（认 EP/EX + 接口清单/业务异常 DECL 段头）+ `scripts/test-cases-audit.test.sh`（34/0）
- 接线：`.codex/config.toml` 注册、`docs/harness/testing-flow.md`「api 用例线」小节 + 场景表、`.agents/skills/hc-test/SKILL.md`（api 占位→实现、de-复刻状态表）

## 调用方声称（供评委核，不背书）
`make verify` ✓、`docs-audit` ✓(47)、机检自测 34/0、两轮独立对抗评审（正确性栈无 blocker/major、亲手造 fixture 实跑验 parser；设计忠实栈揪出「SKILL.md 仍标 api 占位」blocker，已修：SKILL 占位→实现 + de-复刻状态表指向 testing-flow）。
