---
title: ADR-0023 features 体系退役——rule-0001 删除、无硬门槛、skill 间松耦合
status: accepted
date: 2026-07-08
last_updated: 2026-07-08
source_files: []
related_docs:
  - 0003-prd-elicitation-and-prototype.md
  - 0009-dev-skill.md
  - 0010-prd-orchestration.md
---

# ADR-0023：features 体系退役——rule-0001 删除、无硬门槛、skill 间松耦合

## 背景

`docs/features/`（需求包）是旧交付 workflow（"一个包走到底"：立包 → 实现 → 验收）的交付单元，rule-0001（改业务代码前先立需求包，MUST STOP）是它的门禁。随 skill 链条建成——需求 → `docs/prds/`（hc-prd，ADR-0010）、设计 → `docs/designs/`（hc-tech-design，ADR-0015）、测试 → `docs/test-cases/`（hc-test，ADR-0014）——feature 包承载的东西被打散进各环节：**新链条里它既无生产者（hc-prd 不产它）也无真实消费者（hc-dev 要的"需求+验收"prds 全有）**。存量 6 包（F-0001~0006，全 kratos-base）已全 done，initial commit（2026-06-26）后零新增。旧 workflow 已不存在，引用只是惯性残留。

## 决策（用户拍板，2026-07-08）

1. **rule-0001 退役（删除，编号不复用）**——动业务代码**没有任何硬门槛**。不是"换锚继续 MUST STOP"，而是回归本仓一贯哲学：**skill 间松耦合**——每个 skill 不强依赖其他 skill 的产物、可独立工作（同 ADR-0003"松耦合"、testing-flow"每步解耦可跳过"、hc-prd→hc-test 软提醒先例）；关联 skill 只加**提示**（指路 `hc-prd` 等上游），不做硬耦合。hc-dev 自身仍走 superpowers 流程先 plan（brainstorming → writing-plans → 实现）——那是 dev 的**内部纪律**，与跨 skill 门禁是两回事。
2. **`docs/features/` 目录整体删除**（6 个存量包 + README + index.yaml）+ `templates/feature-package.md` 删除 + `verify-control-plane.sh` 摘除 features 的 index-audit。
3. **eval 考题 001 下架**（考的就是这条门禁）+ `docs/eval/index.yaml` 同步。
4. 历史文档**不改写**：旧 ADR（0002/0003/0009/0013/0016/0017/0018/0021）与 eval 产物、tasks 旧 plan 里提 rule-0001 / features 的正文保留原样，**以本 ADR 为准**；仅处理会让 `docs-audit` 悬空的 frontmatter 引用。

## 受影响的 skill（rule-0007）
- skill：hc-dev ／ 是否已更新：是（description "需求包门禁"删；② 吃上游第 1 条"需求包 MUST STOP"改为软提示指 `docs/prds/`；⑧ 硬规则对应条删）
- skill：hc-onboard ／ 是否已更新：是（③ 第 7 步 / ④ 第 8 步交棒话术"第一个需求包按 rule-0001 立"改为指路 hc-prd 的提示；references 两文件同步）
- skill：hc-tech-design ／ 是否已更新：是（⑧ 提 rule-0001 需求包那条改）
- skill：hc-self-evolution ／ 是否已更新：是（references 里 features/rule-0001 口径按现状刷新）
- skill：hc-add-rule ／ 是（:30 引用方口径"被 eval 考题 / ADR 按号引用"随根 AGENTS.md 对齐）
- skill：hc-prd / hc-test / hc-create-sandbox / hc-git-workflow ／ 否（不引用 rule-0001 / features 运行时语义；hc-prd 的产物模板 `templates/prd.md` 属连带、见下）
- 连带：`AGENTS.md`（删规则 + **rule-0007 本体措辞顺带改**："写了 ADR 或立了 feature"→"写了 ADR"，死触发清除，考题 011 同步跟改 + rules-index regen）、`docs/rules/index.yaml`（regen）、`templates/feature-package.md`（删）+ templates README（regen）、`templates/prd.md`（头注下游衔接 + 派生 feature 字段删）、`templates/test-case.md`（AC 来源列表）、`PROJECT_ONBOARDING.md`、`templates/project-agents.md`、`doc-sync-checklist.md`（features 行）、`CURRENT_STATUS.md`、根 `README.md` 目录表、`docs/README.md`（路由表 features 行 + rules 行引用方）、`docs/context/CONTEXT_LOADING.md`（L3 档"features/ 需求包"→"prds/ 需求产出有则读"）、`docs/prds/`（README 正文松耦合句 + index schema 的 feature 字段删）、`docs/eval/prompts/` 010（摘 001 引用与"立项闸门"检查项）/ 011（"立了 feature"删）/ 015（来源枚举 feature 包→PRD）、`hc-dev-worker` 双栈（"需求切片"）、`scripts/lessons-promote-check.test.sh`（夹具编号 rule-0001→rule-0999）、`projects/kratos-base/` 三个 AGENTS.md 指引（死链删）。

## 备选方案

- **换锚保门禁**（rule-0001 改锚到"prds approved 用户故事"继续 MUST STOP）——否决：违背 skill 间松耦合哲学；硬门禁留给真红线（密钥 / 假完成），"先有需求"该是提示不是闸。
- **目录保留归档**（README 标退役、存量保留）——用户拍：整体删掉；历史引用以本 ADR 为准，不为死目录留壳。
- **维持现状**——否决：门禁指着一个无人生产/消费的目录，第一个真业务需求进来就会卡在"立一个没人用的包"上。

## 影响

- agent 动业务代码前不再被"需求包就绪"硬拦；需求侧质量由 hc-prd 自身的确认门（用户 approved）+ 各 skill 提示承担。
- `docs/` 产物区收敛为 prds / designs / test-cases 三账本（+decisions/eval/harness），一物一家。
- rule-0001 编号**永久空缺**（历史 eval / ADR 按号引用过，不复用）。
