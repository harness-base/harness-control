---
title: ADR-0011 context-loading 降级 skill → 政策（删 skill 壳，入口落 AGENTS.md）
status: accepted
date: 2026-06-29
last_updated: 2026-06-29
source_files:
  - ../context/CONTEXT_LOADING.md
related_docs:
  - 0025-mechanism-checkup.md
  - 0001-harness-skeleton-design.md
  - 0004-rules-distribution-and-loading.md
---

# ADR-0011：context-loading 降级 skill → 政策

> **更新（2026-07-09）**：本 ADR 降级保留的「加载档位政策」（L0–L6 档位表 + rule-0004）已随 [ADR-0025](0025-mechanism-checkup.md) 整体退役——\"读什么\"由渐进式引用结构承载、不再判档；`CONTEXT_LOADING.md` 已改写为「渐进式引用」指南。下方叙述保留历史原样。

## 背景

`context-loading` 是一个 advisory skill：教 agent"按 L0–L6 档位 + 就近 `AGENTS.md` 判读多少"。但拿"什么配当 skill"衡量，它是这套里最弱的——硬 skill（dev / test-case / prd-elicitation）都占**具体触发 + 具体产物 + 机检闸**，它一样都不占：触发是"每个任务开始"（太泛、实际几乎没人专门 invoke）、无产物、无闸。它的价值其实已经被两处承载：`AGENTS.md` 启动顺序第 2 条（"按 `CONTEXT_LOADING.md` 判读多少"）+ **rule-0004**（按产物/证据/目标文件判档）；`SKILL.md` 那层壳基本只是"去看 `CONTEXT_LOADING.md`"，冗余。

## 决策

1. **删 `.agents/skills/context-loading/`**（skill 壳）。
2. **政策保留、入口落 `AGENTS.md`**：`docs/context/CONTEXT_LOADING.md`（L0–L6 档位表）为细节、按需读；`AGENTS.md` 启动顺序第 2 条 + rule-0004 为**永远自动加载的入口**（`CLAUDE.md` `@AGENTS.md`）——比 skill 更可靠：skill 要主动 invoke 才生效，`AGENTS.md` 永远在上下文。"少读、按需读"纪律一点不丢。
3. **确立"什么配当 skill"判据**（本次即首个应用）：一个流程配占 skill 位，需有**具体触发** + **具体产物或机检闸**；纯 advisory 政策归 `AGENTS.md` / 规则 / doc，不占 skill 位。按此判据对其余 skill 的全面体检**押后**（待启动）。

## 受影响的 skill（rule-0007）
- skill：`context-loading` ／ **是**——删 skill 壳，降为政策（`CONTEXT_LOADING.md` 细节 + `AGENTS.md` 入口）。
- skill：`dev` / `test-case` / `prd-elicitation` / `doc-sync` / `add-rule` / `git-workflow` / `self-evolution` ／ 否——本次只动 context-loading；按新判据的全面体检押后。

## 备选方案
- **保留 skill 原样**：拒——冗余壳、稀释 skill 信号、实际不被 invoke。
- **把政策全塞进 `AGENTS.md` 正文**（不留 `CONTEXT_LOADING.md`）：拒——`AGENTS.md` 要精简（rule-0012 精神），L0–L6 表是按需读的细节，留 doc、入口指过去即可。
- **改造成场景化加载 skill**（按 bugfix/迁移/评审 直接进对应上下文）：押后——这是 `self-evolution/references/process-coverage.md` 标记的更大演进候选，独立评估，不在本次范围。

## 影响
- skill 集少一个 advisory 壳；入口从"需 invoke 的 skill"变为"永远加载的 `AGENTS.md`"，更硬。
- eval 考题 **004**（context-loading-budget）仍有效——它测的是"读取量与任务风险匹配"这条政策，不依赖 skill 存在。
- 历史 ADR / eval task-reviews / feature 包里的"context-loading 受影响栏"= 历史，不改写。
- 押后：按本 ADR 确立的判据，体检其余 skill（`doc-sync` / `add-rule` / `git-workflow` 等是否也偏政策而非技能）。
