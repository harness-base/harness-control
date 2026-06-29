# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L3 ｜ task: doc-sync-redesign

## 当前：doc-sync 重构（skill → 数据清单 + reviewer + 钩子反馈闭环；收尾）
- [x] 出 spec + plan（docs/superpowers/），与用户逐条敲定
- [x] T1 删 skill + 表降数据文件 `docs/harness/doc-sync-checklist.md`
- [x] T2 `doc-sync-reviewer` 子 agent 双栈（haiku、只读）
- [x] T3 钩子改 log+状态(`- [ ]`)+反馈(correction-nudge 注入)；turn-backstop/correction-nudge 测试
- [x] T4 rewire 关联项（README/HOOKS/CURRENT_STATUS/docs-README + self-evolution 5 处 refs）
- [x] T5 ADR-0012 + 登记
- [x] T6 dogfood（reviewer 真抓到种下的漂移）+ verify + eval green + 提交

## Review
- **任务**：`doc-sync` 从 skill 重构为「数据文件 `docs/harness/doc-sync-checklist.md` + `doc-sync-reviewer` 子 agent + 钩子闭环」（L3，ADR-0012）。原 skill 是 advisory 死穴（不被 invoke）、钩子发现写 log 用 exit-0 stderr 送达（没人看见→漂移烂着，根 README 漂移为证）。
- **设计（与用户逐条敲定）**：删 skill；表降数据；reviewer（haiku、只读）做检查；钩子发现 → 写 log 带 `- [ ]` 状态 + `correction-nudge` 下一轮注入"有 N 条待处理"（可靠通道，非 exit-2 强拦）+ 处理标 `- [x]`；预防层取消、只留检测+反馈；**明确不做** dev/git-workflow、AGENTS.md 通用规矩。
- **质量**：① **dogfood** 派 doc-sync-reviewer——精准抓到种下的 `scripts/zzz-dogfood.sh→scripts/README` 漂移、且不误报真改动（ADR→index、agent→toml 已跟改它都认出），证检测真生效非橡皮图章；② 守护测试 mutation 自证（correction-nudge case 6/7、turn-backstop case4 接通闸）。
- **关联项（self-evolution 维度审查枚举，非手记）**：全 rewire（README/HOOKS/CURRENT_STATUS/docs-README/self-evolution 5 refs/ADR 衔接 0006），`git grep` 0 个活引用指向已删 skill；历史不改写。
- **验证**：`make verify` + `docs-audit`(36) 全绿；**收尾 eval green**（考题 011/014/010 全 pass，**self-evolution=是 名实相符、老坑未复现**）：`docs/eval/task-reviews/20260629T081537Z-doc-sync-redesign/`。
- **押后 backlog**：self-optimize(②) 闭环、log 全局 drain、**① capture 通道实测 0 产出根因**、`.codex/agents/` 无索引、lessons 46 条 seen 没裁决、optimization-log 旧 `⏳` 收敛进 checkbox。

## 已闭（已提交，下次清理滚 archive）
- demote-context-loading（L3，PR #6，eval green）；prd-orchestration（L4，PR #3/#5）；dev-skill（L4，7b6576d）；test-case-skill（L3，c0c94f6）。
