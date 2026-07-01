---
title: ADR-0016 hc-test api 用例线——实现 ADR-0014 占位（接口来源硬门槛 + 源驱动 + 与契约一一对应）
status: accepted
date: 2026-07-01
last_updated: 2026-07-01
source_files: []
related_docs:
  - 0014-hc-test-orchestration.md
  - 0015-hc-tech-design.md
  - ../harness/testing-flow.md
---

# ADR-0016：hc-test api 用例线

## 背景

ADR-0014 把 `hc-test` 做成编排式测试总监、**分阶段实现**：e2e 线本期实现，api 用例线（`hc-api-qa` / `hc-api-reviewer`）留**占位**——前置是「研发方案 + 接口契约」。ADR-0015 建了 `hc-tech-design` 产出 `api-contract.md`，前置就绪。本 ADR **填 ADR-0014 的 api 占位**：结构照抄 e2e，输入换成接口来源。完整流程见 `../harness/testing-flow.md`「api 用例线」小节（唯一真相源）。

## 决策

1. **结构 = 复刻 e2e 那套**：`hc-api-qa`（写 api 用例）+ `hc-api-reviewer`（审）双栈子 agent（Claude `.md` + Codex `.toml`，注册 `.codex/config.toml`），会话模型、免 key、非 haiku。`hc-test` 总监场景表 api 行 🔒占位 → ✅实现，派 `hc-api-qa → hc-api-reviewer`（对抗到零）。流程叙述只落 `testing-flow.md`（agent / ADR 引用不复制）。

2. **接口来源是硬门槛——无源即停**（用户定 2026-07-01）：优先级 ① `docs/designs/<id>/api-contract.md`（`hc-tech-design` 产）＞ ② 用户指定接口来源（proto / OpenAPI / 路由表 / 现有接口代码）＞ ③ 都没有 → **MUST STOP**，交回总监提醒用户"没接口来源、无法确定测什么"，不凭空臆造接口（rule-0008）。与 e2e「缺则略」不同：api 有硬地板——不知接口形态则用例无从写起。**不升为全局规则**（见备选）：它只管"产 api 用例"一件事、非横切，落 `hc-api-qa` 上下文 + 本 ADR + testing-flow。

3. **源驱动、不预设**（用户定 2026-07-01）：协议（gRPC / HTTP-REST / MQ-event）、鉴权 / 限流等横切、Mock、字段、错误码——全按接口来源里**实际有什么**覆盖；agent 不硬编任何项目假设（"kratos 是 gRPC""必须测鉴权"都不行，rule-0015）。契约有 Mock 就用契约 Mock、没有不硬凑。

4. **覆盖 = 与接口来源一一对应**（用户定 2026-07-01）：接口来源 = 一份「接口清单」（协议无关）+ 每接口列举的「业务异常」（错误响应表）。① 契约每个接口都有对应用例、全覆盖；② 单接口列的每个业务异常各覆盖一个 case。**失败只覆盖契约列的约定内错误**（业务码 / 校验 400·422 / 鉴权 401·403 / 约定服务态如 503 `DB_UNAVAILABLE`），未约定的裸 500 / panic 不编用例（沿用 testing-flow 既有「约定 / 未约定」口径）。

5. **机检 = 扩 `test-cases-audit`（不新造）**：矩阵三列（成功 / 失败 / 边界）与 e2e 同构；api 用例走「声明段（`EP-NN` 接口 / `EX-NN` 业务异常）↔ 用例 `covers:`」双向闭合。扩法最小：DECL 段头兼容「接口清单」「业务异常」、声明 id 兼容 `EP`/`EX`，复用现有 closure + 登记 + 剥围栏 + 护栏逻辑；api 文件无矩阵段、矩阵闸自动跳过。自测加 5 条 api 变异自证（EP/EX 覆盖闭合 + 悬空 + 护栏）。

6. **两层「闭合」分工**：机检查「声明段 ↔ 用例」文内自洽（声明的 EP/EX 都被 covers、covers 不悬空 / 不臆造声明外的）；`hc-api-reviewer` 查「声明段 ↔ 契约原文」（契约的接口 / 错误码誊全没、字段约束抄对没、有没有臆造）——契约里有、声明段却没誊进来的接口机检看不见，必须 reviewer 抓。判断层与机检不重叠（同 e2e 两层防线）。

## 受影响的 skill（rule-0007）

- 子 agent：新增 `hc-api-qa` / `hc-api-reviewer`（双栈，会话模型，注册 config.toml）。
- 模板：新增 `templates/api-test-case.md`（接口清单 EP + 业务异常 EX + 用例；中性占位、rule-0015）。
- 机检：扩 `scripts/test-cases-audit.sh`（认 EP/EX + 接口清单 / 业务异常 DECL 段头）+ `test-cases-audit.test.sh` 加 api 自测；进 `make verify`。
- 流程：`testing-flow.md`「api 用例线」小节 占位 → 本期实现、场景表 api 行 🔒→✅。
- **ADR-0014**：其决策⑤的 api 占位由本 ADR 实现——0014 决策叙述不改写（历史），加前向指针 + 状态标记 + `related_docs` 引 0016 + bump `last_updated`（免状态漂移，rule-0012）。
- 规则 / 考题：`rule-0014` / 考题 015 **不变**（产出标准，skill 无关）；**不新增全局规则**（接口来源硬门槛是 skill 级产出门槛、非横切）。
- `hc-test` / `hc-tech-design` / `hc-dev` skill 正文：上下游松耦合不变。
- 脚本线 / 回归：仍占位（ADR-0014 不变）。

## 备选方案（拒）

- **api 用例不设来源硬门槛、缺料也硬编接口**：拒——不知接口形态的用例是凭空臆造（rule-0008），比没有更坏。
- **agent 预设协议 / 鉴权（如"按 gRPC 来"）**：拒——掺项目假设、违 rule-0015；一切按来源判。
- **把"无接口来源 MUST STOP"升成全局规则**：拒——它只管"产 api 用例"一件事、非横切（rule-0001 任何改码 / rule-0015 任何 harness 资产 那种才横切全 harness）；规则按 **scope**（横切多少 skill）判、不按 **form**（是不是 MUST-STOP）判，落 agent 上下文即可（lessons 2026-07-01）。
- **新造一套 api 机检**：拒——矩阵三列与 e2e 同构，扩现有 `test-cases-audit` 即可，别双维护。

## 影响

- 填 ADR-0014 的 api 占位；`hc-test` 测试链多一条实现线，「prd → 设计 → api 用例」闭环跑通。
- api 用例覆盖以「与接口来源一一对应」为硬地板：机检双向闭合（结构层）+ reviewer 回契约原文对账（判断层）两层防线。
- 本 ADR 为决策留档；实现（子 agent / 模板 / 扩机检 / 接线）随本批，收尾 eval + `make verify`。
- 脚本线 / 回归仍占位（分阶段实现 ≠ 分阶段发布，ADR-0014 口径不变）。
