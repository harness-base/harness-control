# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L3 ｜ task: adversarial-review-parallel

## 当前：所有 review 步 单 reviewer → 多视角并行对抗（双栈，用户点名全改）
- **决定（用户拍）**：所有 review 不许单线程；全改 + 关联处一起改。走 Codex 原生（模型驱动）——中性指令，Claude 用 Workflow、Codex 用原生多 agent（max_threads=4）执行同一套。
- **核心设计**：单一真相源 reference 定"多视角并行对抗 review"pattern（fan out N 个**不同视角** reviewer 并行 → 汇总去重 → 回改 → 迭代到一轮干净，**末轮用新视角**防假收敛）；各 skill review 步引用不复制。
- **血缘（改动面）**：7 skill（hc-dev/hc-prd/hc-tech-design/hc-onboard/hc-test/hc-create-sandbox/hc-add-rule）review 步 + 9 reviewer 双栈（18 文件）+ config 描述 + CURRENT_STATUS + doc-sync-checklist + ADR。
- [x] 写共享 reference `docs/harness/adversarial-review.md`（pattern 单一真相源，runtime-neutral：多视角并行/汇总去重/末轮换新视角防假收敛/双栈中性）
- [x] 写 ADR-0022 + index 登记 + regen docs/harness 索引
- [x] 铺开：7 skill review 步引用 pattern（2 处"单 reviewer 线性 loop"升级）+ version bump；16 reviewer 文件（8×双栈）加定性（workflow，TOML 校验合法）；doc-sync-checklist 加行 + CURRENT_STATUS 提一句
- [x] make verify ✓ + docs-audit ✓（56 篇）+ 抽验 7 skill/8 reviewer 双栈全引用 pattern
- [x] 对抗验证铺开（workflow 4 镜头，dogfood 刚建的 pattern）：双栈对等 clean；挖出 1 major（ADR"9 个 reviewer"应为 8，两镜头独立逮到）+ 2 minor（hc-test line 49 残留"单 worker 线性"矛盾、pattern 第5条防假收敛没随改动面伸缩）
- [x] 修 3 findings：ADR 9→8（+注明 hc-doc-sync-reviewer 不在内）/ hc-test line 49 改"宏观次序线性但审步多视角并行" / pattern 第5条防假收敛随改动面伸缩。make verify + docs-audit + 零残留抽验绿
- [x] 收尾 eval（L3）**green**（`docs/eval/task-reviews/20260708T040333Z-adversarial-review-parallel/`；010/011/014/rule-0015 pass，评委独立重跑机检+逐条核）；清 2 warn（去 kratos 项目名守 rule-0015、7-skill 整列改举例守 rule-0012）
- [x] 提交：新分支 `feat/adversarial-review-parallel` → **PR #16**（2 commit：hc-onboard 拆分[本该进 #15 被落下] + ADR-0022；base=main）

## Review（adversarial-review-parallel）
- **做了什么**：所有产出型 skill 的 review 步从"单 reviewer 一遍过"统一升级为"多视角并行对抗"——抽单一真相源 `adversarial-review.md`（7 skill + 8 reviewer 双栈引用不复制）、双栈中性（Claude Workflow / Codex 原生多 agent 同跑）、防假收敛随改动面伸缩。用户点名全改、走 Codex 原生。
- **Codex 对等**：查证 Codex 原生 multi_agent_v2 + max_threads 支持并行子 agent（纠正了"Codex 没有类似模式"的前提），中性指令两栈同跑，补齐此前 Codex 单 reviewer 短板。
- **dogfood + eval 的价值**：拿刚建的多视角 pattern 验它自己（4 镜头对抗）逮出 ADR 计数 9→8（两镜头独立逮）+ hc-test 残留矛盾 + pattern 第5条没伸缩；eval 又清 2 warn（自己的通用资产掺 kratos 项目名——守 rule-0015 的东西自己越界，同款 lesson 再现）。
- **质量**：make verify/docs-audit/skills-index/TOML 全绿；单一真相源引用不复制（不漂）；双栈真中性。
- **git 教训**：hc-onboard 拆分 commit 当初被落在 #15 合并点之后成孤儿，本 PR 补进——已记 lessons 提醒"push 后确认真进了目标 PR 的合并点"。
