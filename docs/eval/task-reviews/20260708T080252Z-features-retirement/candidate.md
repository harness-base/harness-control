# candidate — features 体系退役（L2）

> 候选产出副本（调用方提交口径）。依据 `docs/decisions/0023-features-retirement.md`。改动为工作区未提交状态（staged 删除 + unstaged 修改），分支 `feat/adversarial-review-parallel`（与 origin/main 同点）。

## 声称的改动

1. **rule-0001 删除**：AGENTS.md 摘 bullet + 规则段加"编号永久空缺"注记 + rules-index regen；决策=无硬门槛、skill 间松耦合、关联 skill 只加提示。
2. **`git rm`**：`docs/features/`（8 文件）+ `templates/feature-package.md` + `docs/eval/prompts/001-*.md`；eval index 注释下架；`verify-control-plane.sh` 摘 features index-audit。
3. **skill 跟改**：hc-dev（description / ② 吃上游软提示 / ⑧ 删条，v4）+ dev-worker 双栈；hc-onboard（3 处 + refs 2 处，v6）；hc-tech-design（v5）；hc-add-rule（:30 引用方口径）。
4. **文档跟改**：CONTEXT_LOADING L3 档 / docs/README 路由表 / doc-sync-checklist / CURRENT_STATUS / 根 README / PROJECT_ONBOARDING / templates/prd.md / templates/test-case.md / project-agents / prds README+index / kratos AGENTS×3 / ADR-0002 frontmatter / eval 010/011/015 考题内文。
5. **hc-self-evolution references 7 份口径刷新**（含 gates-hooks 等 8 处清单外残留）。
6. **rule-0007 本体措辞顺带改**（"写了 ADR 或立了 feature"→"写了 ADR"）+ 考题 011 跟改 + regen。
7. **历史文档不改写纪律**：旧 ADR 正文 / eval task-reviews / tasks 旧 plan / lessons 正文保留原样，以 ADR-0023 为准。

## 声称的验证

- hc-rule-reviewer 3 视角巡查（对照表 6/4+5/7+8 行分组）逮出 5 major + 5 minor 已全修（CONTEXT_LOADING L3 / templates/prd.md / eval 010 引 001 / docs/README / rule-0007 死触发 + minors）；`tasks/self-evolution-plan.md` 按 reviewer 推荐①保留为历史。
- `make verify` 绿 + `docs-audit` 57 篇 + `lessons-promote-check.test` 3/0。
