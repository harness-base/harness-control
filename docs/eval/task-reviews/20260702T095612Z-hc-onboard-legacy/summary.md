# summary

- level: L3
- task: hc-onboard-legacy
- prompts: 001(n/a), 002(pass), 003(pass), 004(pass), 011(fail·warn), 012(pass), 014(pass), rule-0015 侧检(pass)
- 综合分档: **yellow**
- 生成时间: 20260702T095612Z（UTC）
- 评委: hc-eval（会话模型，独立复核：亲跑 make verify / docs-audit、核 rules-index/index-audit/workflows 机制真实性、M2 三处逐字比对、两栈逐段比对、全仓 grep 步号引用）
- 关键 finding: templates/project-agents.md:32 项目 ADR 指针仍指控制面 docs/decisions/，与 M2 修后口径（SKILL/reviewer/ADR-0018 三处）直接相悖，ADR 受影响栏未列该模板；reviewer 两栈 .md:15/.toml:12 残留分支盲"第 5 步"引用。两针修完可转 green。
