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
- [ ] 收尾 eval（L3）→ 提交
