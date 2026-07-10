---
title: 工程接入指南
status: active
owner: harness
last_updated: 2026-07-02
source_files:
  - ../../workspace/verification.yaml
related_docs:
  - VERIFICATION_ROUTING.md
  - ../context/CONTEXT_LOADING.md
  - ../decisions/0017-hc-onboard-project-onboarding.md
  - ../decisions/0018-hc-onboard-legacy-branch.md
---

# 工程接入指南（把一个工程挂进 harness）

> **接入走 `hc-onboard` skill（引导式，ADR-0017 新项目 / ADR-0018 老项目）**——它领着你一步步把工程接进来、每步先确认再落、最后对抗评审。**流程实质以 `hc-onboard` skill + ADR-0017/0018 为准**；本文只留「口子速查 + 校验清单」，**不复刻步骤流程**（rule-0012，防两处各写一份、改一处漂一处）。新项目（从零搭骨架）与老项目（拆模块 → 扫→确认→搬 → 对齐）两分支均已实现。

## 接入口子速查（各样东西落哪）

| 要接的 | 落哪 / 怎么接 |
|---|---|
| 代码 | `projects/<name>/`（kebab-case）；控制面只管、不持有其测试本体（测试跟代码同处） |
| 工程规范 / 红线 | 工程根 `projects/<name>/AGENTS.md`（精简）+ 就近下沉各层 `<dir>/AGENTS.md`（`CONTEXT_LOADING.md`）；套 `templates/project-agents.md`；规则走 `hc-add-rule` |
| 验证命令 | `workspace/verification.yaml` 登记 `verify`/`unit`/`api`/`e2e` + **sandbox 三字段**（`sandbox`·`sandbox_down`·`sandbox_status`，见 `SANDBOX_CONTRACT.md`）+ `routelist`（导出接口清单，契约对照用，ADR-0026），**每项守三态**（真命令 / `PENDING:理由` / `N/A:理由`，静默空=红，`verification-audit` 机检）；详见 `VERIFICATION_ROUTING.md` |
| sandbox / E2E 环境 | 形式无关（docker / 虚拟机 / 本地 / 远程，工程实现、控制面只调）；契约=起/停/查三入口（`SANDBOX_CONTRACT.md`），接实走 `hc-create-sandbox`（ADR-0019）；没接实先 `PENDING` 占位 + 工程 `AGENTS.md` 留待补 |
| 需求 / 开发 / 测试 | 走 `hc-prd` → `hc-tech-design` →（`hc-dev` / `hc-test`）；建议先走 hc-prd 理需求（提示、非门禁，ADR-0023） |
| 文档同步 | `hc-doc-sync` 机制（ADR-0012：`hc-doc-sync-reviewer` + `doc-sync-checklist.md`） |
| CI | `.github/workflows` 加 affected verify（按 `verification.yaml` 路由、只跑改动相关工程） |
| 收尾 | `make verify` 绿 + 命中判据的任务过 eval（`hc-eval`，rule-0005）+ Stop hook 兜底 |

## 接入校验清单（速查；详细流程见 `hc-onboard` skill）

- [ ] 代码在 `projects/<name>/`
- [ ] 工程 `AGENTS.md`（精简 + 就近下沉）+ 同级 `CLAUDE.md` shim
- [ ] `workspace/verification.yaml` 填了路由（每项守三态、无静默空）
- [ ] 选型 / 结构落了第一个 ADR
- [ ] 工程级规则按 `hc-add-rule` 落地（放对 + 登记 + 挂执行）
- [ ] `make verify` 绿
