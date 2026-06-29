# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L3 ｜ task: demote-context-loading

## 当前：context-loading 降级 skill → 政策（ADR-0011；收尾）
该 skill 是 advisory 壳（无触发 / 产物 / 闸、几乎不被 invoke），价值已由 `AGENTS.md` 启动序 + rule-0004 + `CONTEXT_LOADING.md` 承载。删壳、入口落 `AGENTS.md`（永远加载，比 skill 硬）。
- [x] ADR-0011 + 登记 index
- [x] AGENTS.md：rule-0004 去"该 skill"、启动序第 2 条强化入口（顺手修第 3 行"以后挂进"同款漂移）
- [x] rewire 活引用：根 README 技能例、`process-coverage.md` 候选行
- [x] 删 `.agents/skills/context-loading/` + regen skills-index（无残留）
- [x] 修 `CONTEXT_LOADING.md` L4 引不存在的 `docs/architecture/`
- [x] make verify + docs-audit + 对抗验证（2 agent clean）+ 收尾 eval green

## Review
- **任务**：`context-loading` 从 skill 降级为政策（L3，ADR-0011）——它是 advisory 壳（无触发/产物/闸、几乎不被 invoke），删壳、入口落到永远自动加载的 `AGENTS.md`（启动序第 2 条 + rule-0004 → `CONTEXT_LOADING.md`）。同时确立"什么配当 skill"判据（触发 + 产物/闸）。
- **产物**：ADR-0011 + 登记；删 `.agents/skills/context-loading/` + regen 索引；AGENTS.md 入口强化 + rule-0004 去 skill（+ 修第 3 行漂移）；rewire 根 README 技能例、self-evolution/process-coverage 候选行；CONTEXT_LOADING L4 修漂。
- **关联项（重点）**：全仓 grep 分类——活引用全 rewire（README / rule-0004 / process-coverage）、历史保留（旧 ADR 受影响栏 / eval task-reviews / features / *-plan / self-evolution 讲过去案例）；2 个独立 agent 对抗复扫（含语义级"把 L0-L6 当 skill"）均 **clean、0 漏网**。
- **验证**：`make verify` + `make docs-audit`（32 篇）绿；skills-index 无 context-loading。**收尾 eval green**（考题 011/014/004/010 全 pass，正面避开 ADR-0004 漏声明 skill 的旧坑）：`docs/eval/task-reviews/20260629T034158Z-demote-context-loading/`。
- **下一步（用户"继续优化 skills"）**：按 ADR-0011 判据体检其余 skill（`doc-sync` / `add-rule` / `git-workflow` 等是否也偏政策而非技能），逐个判留/降/并。

## 已闭（已提交，下次清理滚 archive）
- prd-orchestration（L4，PR #3/#5，eval green）：prd-elicitation 编排式重构 + 两轮 dogfood 复验。
- dev-skill（L4，7b6576d，eval green）；test-case-skill（L3，c0c94f6，eval green）；prd-workflow-redesign（L3，cbfbc7b）。
