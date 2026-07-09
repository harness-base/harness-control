---
title: 渐进式引用（读什么怎么定）
status: active
owner: harness
last_updated: 2026-07-09
source_files: []
related_docs:
  - ../README.md
  - ../decisions/0025-mechanism-checkup.md
---

# 渐进式引用（读什么怎么定）

默认**少读、按需读**。读什么**不判档位、不按关键词**——顺着结构的引用链走，由你按任务自主判断（加载档位 L0–L6 已退役，ADR-0025；早期靠档位表规定读多深，现在"读什么"由结构本身承载）。

## 引用链（结构怎么把你带到该读的东西）

1. **状态起步**：`docs/context/CURRENT_STATUS.md`（当前真实状态）——每次任务的起点。
2. **按需路由**：要找文档去 `docs/README.md`（文档地图 + 各区职责 + 收纳原则）。
3. **就近规则**：在某目录**读或改**文件前，加载向上最近的 `AGENTS.md`（连同同级 `CLAUDE.md`）——就近规则随之生效；只加载最近那一个 + 它显式指向的，不把一路祖先全吞进来。例：动 `projects/backend-service/internal/data/` → 加载 `internal/data/AGENTS.md`（数据层规矩）；动别处时它根本不进上下文。工程级规则就靠这个分层放：工程根 `AGENTS.md` 精简 + 指针，细则下沉到各层。
4. **目录导读**：进某目录想读 / 动其下文件前，若有 `README.md` 先扫一眼（知道这里有什么、该挑哪个，不必通读）。`AGENTS.md` 走 `@import` 自动加载、是必须遵守的红线；README 不在加载机制内、装查阅型材料，靠根 `AGENTS.md` 启动顺序第 5 条触发。
5. **skill 分档**：skill 只常驻薄壳，细节按需读——进哪条分支 / 哪条线，读对应 `references/` 或分线文件（如 hc-onboard 的 new/old-project、testing-flow 的三分线）；共享真相源在 `docs/harness/`，被指到才读（收纳原则见 `docs/README.md`）。
6. **产物上游**：做实现 / 设计 / 测试时，上游产物（`docs/prds/` / `designs/` / `test-cases/`）**有则读、无不卡**（skill 间松耦合，ADR-0023）。

一句话：**别囤上下文——顺着指针走，指到什么读什么，读了不够再跟下一层指针。**

## 收尾要不要 eval（这才是要判的）

读多少不判档，但**收尾要不要 eval 有判据**（rule-0005）：**多步改产物 / 写了 ADR / 动业务代码 / 关键决策点**——命中任一，`tasks/todo.md` 标 `eval: 要`（rule-0013），收尾前跑 task eval review（见 `../eval/README.md`）；轻量问答、琐碎修补标 `eval: 不要`。
