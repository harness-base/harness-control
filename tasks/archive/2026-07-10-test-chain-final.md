## 当前：接口契约对照线 + 统一回归线做实（用户拍，2026-07-10；测试链五场景收官）
- **用户拍的口径**：偏**脚本验证**场景——路由导出由脚本实现（routelist 接入点，onboard 时创建）、**agent 只做对比判断**（读契约端点索引 ↔ 脚本输出清单，语义对齐；不做机械 diff——两边格式不同，agent 对比这个量级不重且能容忍写法差异）；agent 临场读代码提取被砍（取数用脚本、判断用 agent）。
- [x] `routelist` 接入点进 verification.yaml（登记导出命令、三态占位）+ kratos 存量先 `PENDING: 待写 proto 解析脚本`（诚实占位）
- [x] verification-audit 机检扩认 routelist 字段 + 守护测试（mutation 红得起来）
- [x] hc-onboard 接执行口补"routelist 能力创建"（新老两分支 references + SKILL ⑤ 三态枚举 + onboard-reviewer 双栈判据④枚举 + PROJECT_ONBOARDING）+ version bump
- [x] 契约对照场景做实：新分线 `testing-flow-contract-check.md`（门槛两查[契约在？routelist 真命令？PENDING→指路补/N/A→跳过留痕] → agent 跑脚本拿清单 → 对照契约端点索引 → 偏差三类+归因分发[补契约→hc-tech-design+api 用例线 / 补实现→hc-dev]；总监调度不新建 worker）+ 总纲场景表翻状态/骨架/小节 + hc-test SKILL 跟改 + version bump
- [x] ADR-0026 定稿登记 + doc-sync-checklist 分线枚举跟 + CURRENT_STATUS + VERIFICATION_ROUTING（若枚举字段）+ 索引 regen
- [x] **回归线做实**：分线 testing-flow-regression.md（卡门→逐需求顺序跑→报告→归因两分→重跑到过；目录即池子清单）+ 总纲翻 ✅（五场景全实现）+ hc-test 编排段 + hc-dev 交棒句 + ADR-0027 登记 + checklist/CURRENT_STATUS
- [x] 对抗验证（3 镜头）：**2 blocker + 6 major + 8 minor 全修**——B1 reviewer 双栈"头句八个、动作清单核七个"（routelist 永不被核，双栈 6 处补齐）；B2 **PROJECT_ONBOARDING 打了勾没做**（rule-0003 todo 变种，lessons 记"勾选前名单↔git status 对账"）；接入点枚举全仓 sweep 6 处补 routelist；hc-test 编排段重排 ④⑤⑥⑦⑧⑨⑩（消 ⑤′/⑤″ 编号病+编排段归属矛盾）；process-coverage 缺口清单两线全摘；ADR-0014 前向指针注补 0026/0027；kratos AGENTS 待补记录；ADR-0026 受影响栏回填（hc-dev/hc-self-evolution 改"是"+sweep 连带清单）
- [x] 收尾 eval：**yellow → 修平**（`docs/eval/task-reviews/20260710T025209Z-test-chain-final/`；002/003/014/rule-0015 pass——评委 mutation 亲手复现[过程中误回退 audit 脚本后精确重建、已 diff 复查无误]、routelist 枚举全仓终核 8 处全带、零项目词；010/011 warn=回归"占位"旧口径 5 处漏扫[回归线同批后加、扫残留时只扫了契约对照]+ADR-0027 连带漏 2 项→ 全修+回填，占位零残留终核过）
- [x] commit（PR 等 #19 合后开）

## Review（test-chain-final）
- **做了什么**：测试链收官——契约对照线（ADR-0026：routelist 接入点[脚本取数]+agent 语义对比判断，onboard 补能力创建、必须接入点 7→8、audit 机检 25/25+mutation）+ 统一回归线（ADR-0027：目录即池子清单、卡门、逐需求顺序跑、归因两分[脚本过时→hc-script-impl/实现回归→hc-dev]、复用不新建 worker）。**testing-flow 五场景全实现**，脚本池生产（脚本线）→消费（回归线）闭环成型。
- **用户塑形的设计**："取数用脚本、判断用 agent"（砍掉 agent 临场读代码提取与机械 diff 两个我提的坏方案）——首次成文，后续同类场景（依赖清单/schema 清单）可复用。
- **对抗+eval 的价值**：对抗逮 2 blocker（reviewer 双栈"头句八个动作清单核七个"=routelist 永不被核；**PROJECT_ONBOARDING 打了勾没做**=rule-0003 todo 变种，lessons 记"勾选前名单↔git status 对账"）+6 major+8 minor；eval 又逮同型"状态翻转扫残留不全"第 N 次（回归占位 5 处）——收尾自检该固化"改状态口径时 grep 旧口径词全仓"。
- **质量**：机检独立重跑全绿；mutation 双向自证；routelist 枚举 8 处全仓一致；两新分线零项目词；hc-test 编排段重排 ④-⑩ 内部引用全解析。
