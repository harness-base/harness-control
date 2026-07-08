# candidate — 所有产出型 skill 的 review 步统一升级为多视角并行对抗（ADR-0022）

任务档位：L3（harness 架构改动）。

## 改动摘要（依据 ADR-0022）

1. 新增 `docs/harness/adversarial-review.md`：review 编排 pattern 单一真相源（多视角并行 / 每条独立证伪 / 汇总去重 / 回改迭代 / 末轮换新视角防假收敛[随改动面伸缩] / 双栈中性）。
2. 新增 `docs/decisions/0022-adversarial-review-parallel.md` + `docs/decisions/index.yaml` 登记 + regen `docs/harness/README.md` 索引。
3. 7 个 skill review 步改为引用 pattern（hc-dev ⑤ / hc-prd / hc-tech-design ⑥ / hc-onboard ⑥ / hc-test / hc-create-sandbox / hc-add-rule），其中 hc-tech-design ⑥、hc-onboard ⑥ 明写的"单 reviewer 线性 loop"已升级；各 version+1、last_reviewed=2026-07-08。
4. 8 个 reviewer 双栈（`.claude/agents/*.md` + `.codex/agents/*.toml`：hc-code / prd / tech-design / onboard / e2e / api / sandbox / rule-reviewer）加"并行对抗编排"定性引用 pattern（hc-doc-sync-reviewer 钩子驱动、非产出型 skill 评审步，不在内）。
5. `doc-sync-checklist.md` 加漂移预防行（改 pattern → 回查引用它的 7 skill + 8 reviewer 双栈）、`CURRENT_STATUS.md` 提一句（指向单一真相源）。

## 候选自报的验证

- 4 镜头对抗验证 workflow（dogfood pattern 本身）：双栈对等 clean；挖出并修 1 major（ADR 原写"9 个 reviewer"→改 8）+ 2 minor（hc-test line 49 残留矛盾→改、pattern 第 5 条防假收敛随改动面伸缩→改）。
- make verify 绿 + docs-audit 56 篇过 + skills-index 不漂 + 8 reviewer×双栈 TOML 合法。

## 套用考题

- 010（rule-0005 收尾综合评审）
- 011（rule-0007 架构/skill 变更同步 + ADR 受影响栏）
- 014（rule-0012 状态/索引文档不硬编码可自动生成的枚举）
- 另核 rule-0015（通用/项目隔离）
