# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L4 ｜ task: prd-orchestration

## 当前：prd-elicitation 编排式重构（按 plan 执行；T6 进行中）
设计稿/计划 `docs/superpowers/{specs,plans}/2026-06-29-prd-orchestration*`（approved）。产品总监(主 agent)调度 7 worker（6 双栈 subagent + 外部调研复用 deep-research），必选/可选·权重 + 确认门 + 并行 + review loop（框并行、回原 worker、只重跑有问题的）。
- [x] T1 ADR-0010 + 重写 SKILL 总谱（5e22c2d）
- [x] T2 prd-reviewer 子 agent 双栈（a33c349）
- [x] T3 5 个产出 worker 子 agent 双栈（fe442c7）
- [x] T4 Workflow 编排模板（7564fa7）
- [x] T5 doc-sync + verify（7bbef49）
- [ ] T6 对抗挑刺(dogfood) 修平 → 收尾 eval（task=prd-orchestration）→ 补 Review → 提交

## 已闭（已提交，下次清理滚 archive）
- dev-skill（L4，7b6576d，eval green）：写代码统一入口替代 feature-delivery/bugfix；两轮挑刺修 8 处。
- test-case-skill（L3，c0c94f6，eval green）：产用例 + AC/FP 覆盖硬闸；4 轮挑刺修 25 处。
- prd-workflow-redesign（L3，cbfbc7b）：产出需求流程重做（ADR-0007）。
