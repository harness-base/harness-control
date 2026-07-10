# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L2 ｜ eval: 要 ｜ task: mechanism-checkup

## 当前：机制体检批（用户拍：合一起）——档位退役 + hooks 补齐
- **用户拍的口径（2026-07-09）**：① **加载档位退役**——"读多少"已被渐进式引用结构整体承载（启动顺序/就近 AGENTS/README 规则/skill 分线与 references），AI 自己判断读什么，不再判档；**只留一个标准判断要不要 eval**。② CONTEXT_LOADING.md **改写不删**（档位表删、改成半页"渐进式引用怎么走"）。③ todo 标注改 **`eval: 要|不要`** 直接声明。④ 与 hooks 补齐**合一批**。
- **A. 档位退役**：
- [x] ADR-0025（档位退役 + eval 门槛直接化 + hooks 补齐，衔接 ADR-0011 前向指针）
- [x] AGENTS.md：删 rule-0004（编号空缺注记）；rule-0005 改直接判据（多步改产物/写 ADR/动业务代码/关键决策点 → 收尾 eval）；rule-0013 的 level 标注改 eval 标注；rules-index regen
- [x] CONTEXT_LOADING.md 改写（渐进式引用链半页）+ AGENTS 启动顺序第 2 条措辞跟改
- [x] stop-check.sh 判 `eval: 要` 替代 `level>=2` + stop-check.test.sh 用例跟改（mutation 红得起来）
- [x] eval 004 下架 + index 注释；引用面 9 文件跟改（self-evolution refs×3 / PROJECT_ONBOARDING / context README / project-agents / eval）
- **B. hooks 补齐**：
- [x] hook-policy.sh 加：裸 `git push --force`（非 --force-with-lease）+ 直推 main 拦截；hook-policy.test.sh 正反用例
- [x] Codex 原生 hooks 接线（.codex/config.toml [hooks] 按官方 schema：PreToolUse→hook-policy 等）——本机 codex 二进制损坏无法真跑，验证状态照三态诚实标 PENDING，不声称接好
- [x] Build 全落：ADR-0025 登记；AGENTS.md（rule-0004 删+0005 直接判据+0013 eval 标注+启动顺序 2/4 条）；CONTEXT_LOADING 改写 29 行；stop-check 判元行 eval:（16/16+mutation）；hook-policy 两拦+冷门形态（17/17+mutation）；codex [hooks] 接线（PENDING 四项风险 checklist）；eval 004 下架；~20 处引用面；ADR-0011 前向指针
- **收尾**：
- [x] 对抗验证（3 视角：引用点/挂钩 eval 指针/hooks 质量含 35 命令实测）：**8 major+9 minor 全修**——最重 stop-check 归档残留误拦 bug（实跑复现）→ 改判当前节「> 元：」行+3 混合用例；AGENTS eval 段/启动顺序 4/README×3/scripts README/hc-eval 派单四件套的档位残留；git-workflow 分级表跟两拦；gates-hooks Codex 裸奔断言改三态；010 引已删 004；冷门形态 +main/:refs/heads/main/--mirror 补拦
- [x] 收尾 eval：**yellow → 修平**（`docs/eval/task-reviews/20260709T163847Z-mechanism-checkup/`；002/003/010/014 pass——评委双 mutation 亲手复现、6 形态绕 harness 直调实测、活文档档位零残留终核；011 warn=ADR-0025 受影响栏没随对抗修复轮刷新[同型第二次，lessons 记]→ hc-git-workflow 改"是"+连带清单补 6 文件+顺手项 gates-hooks 括号修复）
- [ ] commit → PR（等 #18 合后开）

## Review（mechanism-checkup）
- **做了什么**：加载档位整体退役（ADR-0025，用户拍：读什么由渐进式引用结构承载、AI 自主判断不判档；只留一个 eval 判据）——rule-0004 删、rule-0005 直接判据、rule-0013 改 `eval: 要|不要` 标注、CONTEXT_LOADING 改写 29 行引用链指南、stop-check 判元行 eval:（防归档残留误拦）、eval 004 下架、~20 处引用面清、ADR-0011 前向指针；hooks 补齐——hook-policy 拦裸强推/直推 main（含 refspec/--mirror 冷门形态，17 用例+mutation）、Codex [hooks] 按官方 schema 接线（PENDING+四项真机 checklist，诚实三态）。
- **对抗+eval 的价值**：对抗 3 视角逮 8 major+9 minor——最重 stop-check 归档残留误拦 bug（reviewer 实跑复现，改判当前节「> 元：」行根治）+ hc-eval 派单四件套/README×3 等档位暗残留；eval 双 mutation 亲手验证测试 load-bearing、又逮"受影响栏不回填"同型第二次。
- **质量**：stop-check 16/16 + hook-policy 17/17（各 mutation 翻红自证）；活文档档位/L2+/level: 零残留（评委独立终核）；机检独立重跑全绿；Codex 接线四处一致 PENDING 无假完成。
