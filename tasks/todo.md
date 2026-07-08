# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L2 ｜ task: features-retirement

## 当前：features 体系退役（用户拍：无门槛、松耦合、目录整删）
- **用户拍的方向（2026-07-08）**：① rule-0001 **退役而非换锚**——动业务代码**没有任何硬门槛**；各 skill 松耦合、不强依赖其他 skill 产物、可独立工作；关联 skill 只加**提示**（指路 hc-prd 等上游）不硬耦合；hc-dev 自身走 superpowers 先 plan（这是 dev 内部纪律、非跨 skill 耦合）。② `docs/features/` **目录整体删掉**（含 6 存量包/README/index.yaml）+ `templates/feature-package.md`。③ 先退役、后 AGENTS.md 瘦身，分两批。
- **流程**：删规则走 hc-add-rule（ADR-0020 后首次实战"删"分支：引用点全仓 grep 要害 + eval 指针闭合 + hc-rule-reviewer 多视角巡查）。
- [x] 摸清全部引用点（行级 grep：~20 活文档 + 历史文档不改写清单）
- [x] ADR-0023 定稿登记（决策 4 条：rule-0001 删除编号不复用 / 目录整删 / eval 001 下架 / 历史不改写以本 ADR 为准；受影响 skill 栏如实）
- [x] 执行：AGENTS.md 删 rule-0001（规则段加编号空缺说明）+ rules-index regen；`git rm` docs/features/（8 文件）+ templates/feature-package.md + eval prompts/001 + 三索引 regen；eval index 注释下架；verify-control-plane 摘 features audit；hc-dev（description/② 吃上游软提示/⑧ 删条，v4）+ worker 双栈"需求切片"；hc-onboard（3 处交棒话术 + refs 2 处，v6）；hc-tech-design（:73，v5）；doc-sync-checklist / CURRENT_STATUS / 根 README / PROJECT_ONBOARDING（frontmatter+2 处）/ project-agents / prds README+index / kratos AGENTS×3（死链删）/ ADR-0002 frontmatter
- [x] hc-self-evolution references 7 份口径刷新（agent 做，含 gates-hooks 等 8 处清单外残留；历史案例按纪律保留）
- [x] hc-rule-reviewer 3 视角并行巡查（对照表 6/4+5/7+8 行分组）：逮出 5 major+5 minor 全修——CONTEXT_LOADING L3 档 / templates/prd.md 头注 / eval 010 引已删 001+闸门项 / docs/README 路由 / **rule-0007 本体"立了 feature"死触发**（顺带改措辞+考题 011 跟+regen）+ minors（test-case 模板 / eval 015 / hc-add-rule :30 / 夹具编号）；self-evolution-plan 按 reviewer 推荐留历史
- [x] 收尾 eval：**yellow → 4 项 warn 全修平**（`docs/eval/task-reviews/20260708T080252Z-features-retirement/`；014/rule-0002/0003 pass；010/011 的 findings：prds README 正文"派生 feature 包"+index schema feature 字段 / hc-dev:70"立了 feature"全仓最后一处 / ADR 连带清单未回填——已全修+回填，活文档零残留终核过）
- [x] make verify + docs-audit（57 篇）+ prds-audit + lessons-promote-check.test 全绿
- [ ] 提交（独立 PR）

## Review（features-retirement）
- **做了什么**：features 体系退役（ADR-0023，用户拍三点：无门槛/目录整删/先退役后瘦身）——rule-0001 删除（编号永久空缺）、docs/features/ 8 文件 + feature-package 模板 + eval 001 考题整删、verify 摘机检；hc-dev 吃上游改"prds 有则吃、无则提示走 hc-prd、可独立干"（提示非门禁）；~35 个活文档跟改；顺带清了 rule-0007 的"立了 feature"死触发。
- **三层防线各逮到谁**：hc-rule-reviewer 巡查逮 10 处我终核 grep 漏的（字面不带路径的"立了 feature"、eval 考题互引 001）；eval 又逮 4 处巡查也漏的（prds README 正文语义句、hc-dev:70 最后一处、ADR 清单未回填）——grep 口径盲区靠语义审补，两层不可互替再次实证。
- **哲学落地**：skill 间松耦合（各自可独立工作、上游产物有则吃、关联处只提示不硬卡）首次成文进 ADR；硬门禁只留真红线。
