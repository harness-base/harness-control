---
title: ADR-0012 doc-sync 重构——skill 降为数据清单 + doc-sync-reviewer 子 agent + 钩子反馈闭环（log+状态+送达）
status: accepted
date: 2026-06-29
last_updated: 2026-06-29
source_files:
  - ../harness/doc-sync-checklist.md
related_docs:
  - 0005-self-evolution-loop.md
  - 0006-drop-drift-area.md
  - 0011-demote-context-loading.md
---

# ADR-0012：doc-sync 重构

## 背景

`doc-sync` 是一个 skill，同时承担两件事：① 一张"改 X → 查 Y"的对照表（数据）；② 一个"改完主动查"的预防层入口。问题：作为 skill 它几乎不被主动 invoke（advisory 死穴，同 context-loading）；而钩子兜底（`turn-backstop`）发现漂移只写 `optimization-log` 然后 `exit 0 + stderr` —— 而 exit-0 stderr **不注入上下文、agent 看不见**（HOOKS.md 自陈），findings 烂着没人修（实证：根 README 漂移从没被捞到）。按 ADR-0011 判据，"夹带的数据被机器读" ≠ "配当 skill"。

## 决策

1. **删 `.agents/skills/doc-sync/` skill。**
2. **对照表降为数据文件** `docs/harness/doc-sync-checklist.md`（唯一判据源），由 `turn-backstop` 与 `doc-sync-reviewer` 共读。
3. **新建 `doc-sync-reviewer` 子 agent**（双栈）：读本轮 `git diff` + checklist 的 `🔴手` 行 → 报漂移、只读不改。Claude 侧 `model: haiku`（依据：doc-drift 是轻量对照判断、hook-headless 廉价兜底，非会话子 agent）；Codex `model_reasoning_effort = low`。
4. **闭环 = log + 状态 + 送达**（按用户敲定）：`turn-backstop` 把 doc-drift 发现写 `optimization-log`、每条带 `- [ ]` 状态（待处理）；**送达**改走 `UserPromptSubmit` 钩子（`correction-nudge.sh`）下一轮注入"有 N 条待处理"——这是已证可靠的注入通道，替代不被看见的 exit-0 stderr。处理后标 `- [x]`（暂缓 `- [~]`）。`turn-backstop` 仍 best-effort、永不阻断收尾（不改其安全契约）。
5. **预防层取消、只留检测 + 反馈兜底**：原 doc-sync skill 的"主动 checklist 预防层"删除，不再有独立主动入口；主动查靠 agent 收尾对照该 checklist。**这是有意取舍**——事后机械检测（每 8 轮/commit/大改触发）+ 可靠送达 + 状态追踪，足以让漂移不再烂在 log；不为一个几乎不被 invoke 的 advisory skill 续命。

## 受影响的 skill（rule-0007）
- skill：`doc-sync` ／ **是（删）**——降为数据文件 + reviewer 子 agent。
- skill：`self-evolution` ／ **是**——rewire 其 references：`gates-hooks.md`（文档同步自洽不变量重写为新拓扑 + 检索命令改路径）、`docs.md`、`subagents.md`（agent 计数指针化）、`lessons-memory.md`、`skills.md`（"能力不必硬做 skill"判据）。
- skill：`dev` / `test-case` / `prd-elicitation` / `add-rule` / `git-workflow` ／ 否——本次未动其流程。

## 备选方案
- **保留 doc-sync skill 原样**：拒——advisory 死穴（不被 invoke）、闭环断（写 log 没人看）。
- **反馈走 `exit 2` 强拦收工**：拒——`turn-backstop` 跑 flaky Haiku，让它阻断收尾会引入卡死/递归风险；改用安全的 UserPromptSubmit 下一轮注入 + 状态追踪（不丢、持续反馈直到处理）。
- **从 hook 直接 spawn `doc-sync-reviewer` 子 agent**：本次不做——hook 派命名子 agent 无先例、且会破坏 `turn-backstop.test.sh` 的 hermetic；hook 仍用 inline headless Haiku（读同一 checklist），reviewer 作为同判据的可手动派/Codex 版本。

## 影响
- doc-drift 检测的判据从藏在 skill 里变为明面数据文件；发现从"写 log 烂着"变为"带状态 + 下一轮反馈给主 agent 处理"。
- **Codex 局限**：doc-drift 自动检测靠 Claude Code 的 Stop / UserPromptSubmit 钩子，Codex 无等价自动触发——Codex 侧靠 `make verify` 机检半 + 手动派 `doc-sync-reviewer`。已在 ADR/HOOKS 诚实写明。
- ADR-0006 确立的"预防层 = doc-sync skill"由本 ADR **删除**，预防职责转 `doc-sync-reviewer`（检测）+ 数据清单（唯一判据源）；ADR-0006 正文不改写（历史），本 ADR 衔接说明。
- 守护测试：`turn-backstop.test.sh` 接通闸改指新 checklist；`correction-nudge.test.sh` 加"`- [ ]` 待处理 → 注入反馈"用例（mutation 自证）。
- 押后 backlog：`self-optimize`(②) 闭环、`optimization-log` 全局 drain、**① capture 通道实测 0 产出根因**、`.codex/agents/` 无索引、`lessons.md` 46 条 `seen` 从没裁决。
