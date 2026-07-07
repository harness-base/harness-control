# candidate — hc-onboard skill 拆分（薄壳 + 2 references）

## 任务
L2 · 改动 load-bearing 的 harness skill 结构，无行为变更的纯重构。

## 变更内容
把 hc-onboard skill 从单个 158 行 `SKILL.md` 拆成「薄壳 + 2 references」：

- `.agents/skills/hc-onboard/SKILL.md`（158→92 行）：保留 frontmatter / intro / ①何时用 / ②入口分流 / ③新7步骨架 / ④老8步骨架 / ⑤三态 / ⑥评审判据 / ⑦硬规则 / ⑧演进 / footer；③④ 只留步号骨架（步标题 + 一句话 + 指针），每步「问 / 确认 / 落」细节移出。version 3→4、last_reviewed 07-07。
- `.agents/skills/hc-onboard/references/new-project.md`（47 行）：③ 新项目 7 步详细 playbook。
- `.agents/skills/hc-onboard/references/old-project.md`（48 行）：④ 老项目 8 步详细 + 老分支铁律 / 红线。

## 拆分硬约束（自报）
1. ③④ 步骤编号原样保留（新 7 步、老 8 步，对抗评审=新第5/老第6）——hc-onboard-reviewer 双栈（`.claude/agents/hc-onboard-reviewer.md` + `.codex/agents/hc-onboard-reviewer.toml`）用语义锚点回指。
2. ⑤三态 / ⑥评审判据 / ⑦硬规则 留在 SKILL.md。
3. version bump + ⑧演进 提到 references 且写明「改步号要同步 references 与 reviewer 双栈回指」。

## 自报验证
- 4 镜头对抗验证：内容零丢失 clean / reviewer 指针零断裂 clean / 薄壳独立完整 clean / 加载时机 1 minor（②分流指针醒目度，已修加粗）。
- `bash scripts/skills-index.sh --check` 不漂、`make verify` 绿、`make docs-audit` 54 篇过。
