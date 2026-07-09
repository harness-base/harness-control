# candidate — mechanism-checkup（机制体检批，ADR-0025）

> 候选 = 调用方转述的产出要点 + 未提交工作树全量改动（本分支 stack 在未合 #18 之上，本批以 `git diff HEAD` + `git status` 为准，~32 文件）。ADR 本体：`docs/decisions/0025-mechanism-checkup.md`；todo 块：`tasks/todo.md`。

## 声称要点（调用方给的 candidate）

1. rule-0004 删（编号空缺注记）+ rule-0005 直接判据 + rule-0013 eval: 标注 + CONTEXT_LOADING 改写 29 行 + 启动顺序 2/4 条。
2. stop-check 判当前节「> 元：」行的 `eval:`（兼容旧 L2+；防归档残留误拦 / 正文引用误匹配）+ 16 用例。
3. hook-policy 补拦：裸 force / -f、直推 main（含 `+main` / `:main` / `HEAD:refs/heads/main` / `--mirror` 形态）+ 17 用例。
4. Codex `[hooks]` 接线（PENDING + 四项风险 checklist：stdin 字段名 / matcher 工具名 / timeout 单位 / cwd）。
5. eval 004 下架；~20 处引用面（AGENTS eval 段 / README×3 / hc-eval 派单四件套 / git-workflow 分级表 / gates-hooks Codex 断言三态化等）；ADR-0011 前向指针。
6. 对抗验证 3 视角逮 8 major + 9 minor 已全修（最重：stop-check 归档残留误拦 bug 实跑复现 → 改元行提取）。

## 改动面（git diff HEAD --stat 摘要）

- 规则/入口：`AGENTS.md`（rule-0004 删、0005/0013 改、启动顺序 2/4 条、eval 段）、`docs/rules/index.yaml`（regen）
- 上下文：`docs/context/CONTEXT_LOADING.md`（档位表→渐进式引用链改写）、`docs/context/README.md`
- 脚本：`scripts/stop-check.sh(+.test)`、`scripts/hook-policy.sh(+.test)`、`scripts/README.md`、`scripts/run-eval.sh`
- Codex：`.codex/config.toml`（[hooks] 三事件接线，PENDING）、`.codex/agents/hc-eval.toml`
- eval：`docs/eval/prompts/004`（删）、`index.yaml`、`README.md`、`evaluator.md`、`prompts/010`、`.claude/agents/hc-eval.md`
- skill：`.agents/skills/hc-git-workflow/SKILL.md`（分级表跟两拦）、`hc-self-evolution/references/`（docs / eval / gates-hooks / process-coverage）
- 文档：`docs/harness/HOOKS.md`、`PROJECT_ONBOARDING.md`、根 `README.md`、`docs/README.md`
- 决策：`docs/decisions/0025-mechanism-checkup.md`（新）、`index.yaml`、`0011`（前向指针）
- 任务面：`tasks/todo.md`、`tasks/lessons.md`（新 lesson + rule-0004 旧 opt 标记跟改）、`tasks/optimization-log.md`（Codex hooks 销号注 PENDING）
