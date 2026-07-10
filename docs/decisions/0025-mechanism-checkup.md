---
title: ADR-0025 机制体检批——加载档位退役（eval 门槛直接化）+ hooks 补齐（force-push 拦截、Codex hooks 接线）
status: accepted
date: 2026-07-09
last_updated: 2026-07-09
source_files:
  - ../context/CONTEXT_LOADING.md
  - ../../scripts/stop-check.sh
  - ../../scripts/hook-policy.sh
related_docs:
  - 0011-demote-context-loading.md
  - 0023-features-retirement.md
---

# ADR-0025：机制体检批——加载档位退役（eval 门槛直接化）+ hooks 补齐

## 背景

**档位半边**：L0–L6 加载档位（ADR-0011 定型为政策、rule-0004 守）是早期设计——当时"读什么"没有结构承载，靠档位表规定读多深。此后渐进式引用结构逐步建成：启动顺序（状态页→按需路由）、就近 `AGENTS.md`、目录 `README.md` 规则、skill 分线文件"做哪条线读哪份"、references 按需读——"读什么"已被结构整体承载，**"先判 L 几再照表读"这个动作在实际工作流里从不发生**（L4–L6 从未用过）。档位的唯一实质残余 = rule-0005 的 eval 门槛（stop-check 判 `level >= 2`）。与 features 退役（ADR-0023）同型：机制被结构取代后的惯性残留。

**hooks 半边**：`hook-policy.sh` 只拦四类（密钥 / Bearer / `git reset --hard` / `rm -rf`），git-workflow 写的"高危禁止"（裸强推、直推 main）没有机器拦；Codex 侧 hooks 长期未接（旧 backlog "等 Codex hook schema"），现查证 Codex 已有完整 hooks 支持（`[hooks]` + PreToolUse/Stop 等事件 + command handler），立项前提成熟。

## 决策（用户拍板，2026-07-09）

1. **加载档位退役**：**rule-0004 删除**（编号永久空缺）——"读多少"不再判档，AI 顺渐进式引用结构自主判断；"少读、按需读、渐进加载"的精神保留在根 `AGENTS.md` 默认策略与结构本身。eval 考题 004（考档位合理性）下架。
2. **eval 门槛直接化**（rule-0005 改措辞）：不再以"L2 以上"为门槛，直接列判据——**命中任一即收尾 eval：多步改产物 / 写了 ADR / 动业务代码 / 关键决策点**；轻量问答、琐碎修补不触发。
3. **todo 标注改 `eval: 要|不要`**（rule-0013 改措辞）：直接声明本任务收尾要不要 eval（按上述判据自判），`stop-check` 改判 `eval: 要` + Review 段（原 `level: L?` 标注退役）。
4. **CONTEXT_LOADING.md 改写不删**（启动顺序第 2 条仍指它）：档位表删除，改写为半页「渐进式引用怎么走」（引用链：状态页 → 按需路由 → 就近 AGENTS → 目录 README → skill 分线 / references），并留 eval 判据指针。
5. **hook-policy 补两拦**：裸 `git push --force`（非 `--force-with-lease`）与直推 main（`git push … main`）——对应 git-workflow 分级表"高危禁止"行；正反用例进 `hook-policy.test.sh`。
6. **Codex hooks 接线**：`.codex/config.toml` 按官方 schema 加 `[hooks]`（PreToolUse→`hook-policy.sh`、Stop→`stop-check.sh`、UserPromptSubmit→`correction-nudge.sh`）。**验证状态诚实标注**：本机 codex 二进制损坏（悬空软链）无法真跑，接线正确性 `PENDING: 待真机验证`（三态纪律，不声称接好；Claude/Codex 两侧 hook 的 stdin 输入格式差异风险在 HOOKS.md 记明）。

## 受影响的 skill（rule-0007）
- skill：hc-self-evolution ／ 是（references/eval.md、gates-hooks.md 的 L2+ 口径与 stop-check 判据描述刷新；process-coverage/docs/skills 如提档位则跟）
- skill：hc-git-workflow ／ 是（hooks 半边：操作分级表跟两拦刷新——"写需授权"档强推限定 with-lease 形态、"高危禁止"档补裸强推与直推 main 并注明 hook 已拦）
- skill：hc-dev / hc-prd / hc-tech-design / hc-test / hc-onboard / hc-create-sandbox / hc-add-rule ／ 否（不引用 rule-0004 / 档位语义；hc-dev"深度信号"是自己的仪式判据、非加载档位）
- 连带：`AGENTS.md`（rule-0004 删 + rule-0005/0013 改 + 启动顺序第 2 条）、`docs/context/CONTEXT_LOADING.md`（改写）+ `docs/context/README.md`、`scripts/stop-check.sh` + `.test.sh`、`scripts/hook-policy.sh` + `.test.sh`、`.codex/config.toml`、`docs/eval/`（004 下架 + index 注释 + README/010 考题的 L2+ 措辞）、`docs/harness/HOOKS.md`（stop-check 行为 / 拦截枚举 / 误伤面与自指预期误报 / Codex 四项风险）+ `PROJECT_ONBOARDING.md`、根 `README.md`（L2+ 句与三处档位描述）、`docs/README.md`（context 路由行）、`scripts/README.md`（stop-check/hook-policy 行为行）、hc-eval 派单口径四件套（`docs/eval/README.md` / `evaluator.md` / `hc-eval` 双栈）、`scripts/run-eval.sh`（档位词汇）、ADR-0011 前向指针、rules-index regen。（`templates/project-agents.md` 核过本就无档位残留、未改。）

## 备选方案

- **档位收敛为三档（保留双职责）**——否决（用户裁）：还是档位思维；"读多少"半边已被结构取代，无需任何档。
- **eval 门槛保留数字分级**——否决：只剩一个二值判断（要不要 eval），直接列判据比编号间接层更清楚。
- **Codex hooks 等真机修好再接**——否决：接线与验证分离，先按官方 schema 接上、验证状态三态诚实标注，比无限期搁置好。

## 影响

- 上下文策略从"机制（判档）"简化为"结构（引用链）"，与 harness 演进方向一致（结构承载 > 机制约束）。
- eval 门禁语义更直白：`eval: 要` + 判据清单，stop-check 判断逻辑等价迁移（自报制的半强制局限不变，HOOKS.md 已诚实标注）。
- rule-0004 编号永久空缺（同 rule-0001，ADR-0023 先例）。
- git 高危操作从"纸面禁止"升为机器拦截；Codex 侧钩子从"裸奔"进到"已接线待验证"。
