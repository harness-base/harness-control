# candidate — hc-onboard 老项目分支（L3，ADR-0018）

任务：填 ADR-0017 留的老项目占位。同一 `hc-onboard` skill 的第二岔路：老项目 8 步（定位接管 → 拆模块[引导对话、地图用户确认才作数] → 按模块滚[扫→逐条确认→搬进规范] → 接执行口[发现+对齐现有的、三态] → 引入关联进主目录五项 → 对抗评审 → make verify → 交棒）；铁律 = 扫到先确认再落（rule-0008）、只收规范不改业务代码。

## 候选产物（git diff HEAD，9 文件 +178/−47）

- ADR：`docs/decisions/0018-hc-onboard-legacy-branch.md`（新增）+ `docs/decisions/index.yaml` 登记 ADR-0018 + `docs/decisions/0017-hc-onboard-project-onboarding.md` 前向指针（顶部更新注 + follow-up ② 标已实现 + related_docs + last_updated bump）
- skill：`.agents/skills/hc-onboard/SKILL.md` v2（② 分流老=已实现、④ 老项目 8 步小节、⑤ 三态、⑥ 总览 6 块 + 老分支 a–d、⑦ 硬规则加老项目 3 条、⑧ 演进；version 1→2、last_reviewed bump）
- reviewer 双栈：`.claude/agents/hc-onboard-reviewer.md` + `.codex/agents/hc-onboard-reviewer.toml`（description 双分支、「先判新/老再选用判据」引言、a–d 判据、工作步骤/scope/回步映射双分支化）
- 接线：`docs/harness/PROJECT_ONBOARDING.md`（两分支口径 + related_docs 加 0018）、`docs/context/CURRENT_STATUS.md`（projects 行改"新 / 老 + ADR-0017/0018"）、`.agents/skills/README.md` 索引 regen、`tasks/todo.md`（level: L3 ｜ task: hc-onboard-legacy + Review 段）

## 候选声称（待独立复核）

- `make verify` ✓、`docs-audit` ✓(50)
- 两栈干净对抗评审挖出 2 major + 5 minor 已全修：
  - **M2**：原稿"项目 ADR 进根级 decisions index"锚了不存在机制 → 统一口径为「只有 rules 半边自动（rules-index 全仓扫 AGENTS.md），项目 ADR 落项目自己的决策记录处」，三处：ADR-0018 步骤5-③ / SKILL ④第5步-3 / reviewer d-3 两栈
  - **M1**：reviewer 执行环（工作步骤 / scope / 回步映射）双分支化，两栈同步
  - M3：CURRENT_STATUS 漏改；minors：步号残留 / last_reviewed·last_updated bump / 0017 follow-up 注 / ⑥ 总览对齐 6 块 / CI 措辞"尚未建则建起"——声称全修
