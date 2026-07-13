---
title: 文档地图
status: active
owner: harness
last_updated: 2026-05-29
source_files: []
related_docs:
  - context/CURRENT_STATUS.md
  - context/CONTEXT_LOADING.md
---

# 文档地图

按需读，不全读。下面是推荐阅读顺序和各目录职责。

## 阅读顺序

1. `../AGENTS.md` —— 常驻规则源（启动顺序、硬规则红线、验证命令）。
2. `context/CURRENT_STATUS.md` —— 当前真实状态。
3. `context/CONTEXT_LOADING.md` —— 本次任务该读多少。
4. `rules/index.yaml` —— 带编号规则库（按需查某条）。
5. `harness/VERIFICATION_ROUTING.md` —— 怎么验证。
6. `eval/README.md` —— 评分体系怎么用、何时触发。
7. 接工程时：走 `hc-onboard` skill（引导式，新 / 老两分支）；`harness/PROJECT_ONBOARDING.md` 是口子速查 + 校验清单。

## 目录职责

| 目录 | 职责 |
|---|---|
| `context/` | 项目简报、真实状态、渐进式引用指南 |
| `rules/` | 带编号的规则库；可被 eval 考题 / ADR 按号引用 |
| `decisions/` | ADR 架构决策记录 |
| `eval/` | 评分体系：考题、rubric、评委、评审产出 |
| `harness/` | 验证路由、CI、hooks 说明、工程接入指南、文档同步对照表（`doc-sync-checklist.md`） |
| `prds/` | 需求产出账本（`hc-prd` 产物：用户故事 + PRD + 可选原型） |
| `designs/` | 研发方案产出账本（`hc-tech-design` 产物：design.md + 可选 api-contract；`designs-audit` 硬闸校登记一致 / design.md 在 / 零 TBD） |
| `test-cases/` | 测试用例账本（`test-case` 产物：用例 + AC/FP 覆盖；`test-cases-audit` 硬闸校覆盖闭合） |
| `superpowers/` | brainstorming / writing-plans 的设计稿（`specs/`）与实现计划（`plans/`） |

`architecture/` 待接入 `projects/` 后再建；`drift/` 区已弃用、漂移处理并入自进化闭环（见 `decisions/0006-drop-drift-area.md`）。

## 收纳原则：skill 细节放哪（ADR-0024 明文化）

- **只有单个 skill 自己用的执行细节** → 该 skill 的 `references/`（私有，按需读；例：`hc-prd/references/` 的编排模板与写作指南、`hc-onboard/references/` 的分支 playbook）。
- **被多个 skill / 子 agent / 契约在运行时引用的** → `docs/harness/`（共享真相源；例：`testing-flow*.md`、`SANDBOX_CONTRACT.md`、`adversarial-review.md`、`doc-sync-checklist.md`）。
- 判据 = **消费方范围**：放进某 skill 的私有目录会让别的 skill 依赖它的内部结构，就该上浮到 `docs/harness/`；反之只有自己读的别占共享区。
