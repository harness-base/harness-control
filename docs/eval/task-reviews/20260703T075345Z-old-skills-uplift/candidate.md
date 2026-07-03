# candidate — 老 skill 优化批（L3，ADR-0020）

任务：三个老 skill 跟上这波 uplift——① `hc-add-rule` 扩加/改/删统一入口 + 规则关联对照表（8 行、一表两用）+ 新建 `hc-rule-reviewer` 双栈巡查（两角色分离：主 agent 生成、reviewer 照表巡关联闭合，机检项不重复）+ lessons 晋升入口 + rule-0015 进定范围；② `hc-git-workflow` 操作三档分级表（授权不跨批）+ 发布前起手式（只挂发布类、有效期=本轮对话）+ 不加 Co-Authored-By 署名条款 + 不加 subagent 不加钩子（用户砍）；③ `hc-self-evolution` 本体只 meta bump，11 份 references 对照现状刷新（保留五段结构与历史案例）。

## 候选产物（git diff 未提交，20 文件）

- ADR：`docs/decisions/0020-old-skills-uplift.md`（新增）+ `docs/decisions/index.yaml` 登记
- skill：`.agents/skills/hc-add-rule/SKILL.md` v3（加/改/删统一入口 + 8 行对照表 + 晋升入口 + 巡查段）
- reviewer 双栈：`.claude/agents/hc-rule-reviewer.md` + `.codex/agents/hc-rule-reviewer.toml` + `.codex/config.toml` 注册
- skill：`.agents/skills/hc-git-workflow/SKILL.md` v3（三档分级表 / 发布前起手式 / 署名条款 / sandbox HTTPS push 备注）
- skill：`.agents/skills/hc-self-evolution/SKILL.md` v3（仅 meta bump）+ `references/` 11 份刷新（decisions-context-features / docs / eval / gates-hooks / index-system / lessons-memory / process-coverage / rules / skills / subagents / templates）
- 索引 regen：`.agents/skills/README.md`、`.claude/agents/README.md`
- 另：`tasks/lessons.md` 两条新纠正记录、`tasks/todo.md` 更新

## 候选声称（待独立复核）

- `make verify` ✓、`docs-audit` ✓(53)
- 两轮对抗评审已修——栈① 1 major（对照表第 1 行"兜底=reviewer"但 reviewer 判据不含此项 → 改主 agent 自查+用户拍）+ 2 minor（eval 指针兜底拆机检/reviewer、标题正名）；栈② 11 份 references ~40 项实跑抽查无 blocker/major，5 个旧日期锚 minor 已修
- 规则 / 考题不动；rule-0015 边界守住

## 调用方指定重点独立核

① add-rule 对照表 8 行「谁兜底」列三方一致（表格 vs skill 巡查段 vs reviewer 五块 vs ADR）且每行兜底真有人/机干；② rule-reviewer 两栈等价；③ git-workflow 用户拍的点无走样（不加钩子/授权不跨批/轮内有效/署名）；④ references 抽 2-3 份核新事实与检索命令真伪。
