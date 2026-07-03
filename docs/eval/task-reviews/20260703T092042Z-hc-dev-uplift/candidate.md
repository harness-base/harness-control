# candidate — hc-dev 编排式重构（ADR-0021）

> 候选产出副本（调用方提交口径 + 产物清单，评委存档）。

## 任务

hc-dev 从「单 agent 两级」重构为**开发总监编排式**（决策 `docs/decisions/0021-hc-dev-orchestration.md`；coding 环，用户点名重中之重）：

1. **吃上游**：需求包 → design.md + api-contract → PRD；有方案照方案拆、契约定死不擅改、发现方案问题停回 hc-tech-design 不许绕、无契约涉接口设计 = 硬门。
2. **按改动面定编制**：单层直做 / 跨层按项目真实分层并行派 hc-dev-worker，源驱动不硬编层种、契约为接缝、范围 disjoint 防踩踏。
3. **UI/UX 视觉纪律**（用户点名"读 HTML 不准"）：边写边看渲染 + 两件套（截图对比＋inspect 计算后样式）+ 状态过全含原型照点 + 读源码不算验证。
4. **hc-code-reviewer 加两判据**：实现↔契约对账（有契约硬核）+ UI 视觉还原证据两件套。
5. **改 bug 用户口径**：本地核实 + 确认复现场景 → 复现↔根因互相印证缺一不可 → 修改（守护测试先红）→ 再测试通过后结束。
6. **保留资产**：需求包门禁 / TDD / 重构行为保持 / 迁移核源 / 验证如实 / 提醒测 + 指路 hc-test。

## 产物清单（评委按工作区实况核对）

- `docs/decisions/0021-hc-dev-orchestration.md`（新，accepted）+ `docs/decisions/index.yaml` 登记
- `docs/decisions/0009-dev-skill.md` 前向指针（历史叙述保留原样）
- `.agents/skills/hc-dev/SKILL.md` v2（version: 2，last_reviewed: 2026-07-03）
- `.claude/agents/hc-dev-worker.md` + `.codex/agents/hc-dev-worker.toml`（net-new 双栈；`.codex/config.toml` 注册；派单**四件套**含"任务口径"槽）
- `.claude/agents/hc-code-reviewer.md` + `.codex/agents/hc-code-reviewer.toml`（加两判据 + 尾段口径对齐）
- `.codex/config.toml` 两处 description（worker 新注册 + reviewer 补判据）
- 消费方修：`hc-tech-design` SKILL 类比改写、`hc-self-evolution/references/skills.md` 形态分类、`decisions-context-features.md` / `project-onboarding.md` "深度级"悬空 ×2 清、`process-coverage.md` 缺口句销
- 索引 regen：`.agents/skills/README.md`、`.claude/agents/README.md`
- `tasks/todo.md`（level: L3 ｜ task: hc-dev-uplift）、`tasks/lessons.md`（用户纠正"复现是根因验证器"三段式）

## 已验证声称（调用方口径，评委独立复核）

- make verify ✓、make docs-audit ✓（54）、三份 TOML 解析过。
- 两轮对抗评审合计 ~7 major + 4 minor 已全修，要点：reviewer 视觉判据"或"弱于用户"两件套＋"→ 已统一；子模式口径在派 worker 路径无承载 → 派单四件套 + SKILL ③ 补句；"深度级"悬空术语清。

## 调用方点名的独立复核项

① 改 bug 子模式与用户最终口径（复现↔根因互相印证）一字一义对上；② 视觉"两件套＋"在 SKILL / worker / reviewer 四处（含两栈）一致、无"或"残留；③ worker 派单四件套与 SKILL ③"必附 ⑥ 口径"闭环；④ 全仓再扫"深度级 / 常规级 / 两级"活文档残留；⑤ 两栈等价抽查。
