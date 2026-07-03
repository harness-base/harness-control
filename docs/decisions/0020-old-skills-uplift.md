---
title: ADR-0020 老 skill 优化批——hc-add-rule 扩加/改/删 + 关联对照表 + hc-rule-reviewer；hc-git-workflow 分级表 + 发布前起手式；hc-self-evolution references 刷新
status: accepted
date: 2026-07-03
last_updated: 2026-07-03
source_files: []
related_docs:
  - 0004-rules-distribution-and-loading.md
  - 0013-project-naming-hc-prefix.md
  - 0019-hc-create-sandbox.md
---

# ADR-0020：老 skill 优化批

## 背景

这波 uplift（ADR-0013~0019）重建了 hc-prd / hc-test / hc-tech-design / hc-onboard / hc-create-sandbox，三个老资产没跟上：`hc-add-rule`（6-26）、`hc-git-workflow`（6-29）、`hc-self-evolution`（6-28）。体检结论：三个都要优化，两小一大。本批按用户逐点拍的方案落。

## 决策

### 1. `hc-add-rule`：扩「加 / 改 / 删」统一入口 + 关联对照表 + `hc-rule-reviewer`

- **扩 scope**：从"加一条规则"扩成**加 / 改 / 删规则的统一入口**——对照表恰对改 / 删最关键（引用点悬空）。
- **规则关联对照表**（用户提出"rule 关联很多地方，要有对照表照着看"；放 SKILL.md 正文一节、一表两用——主 agent 操作清单 + reviewer 巡查判据）：
  1. 规则本体：就近 `AGENTS.md` bullet + 隐形标记——**两种 id 口径**：全局数字 `rule-00NN`（取最大+1）/ 工程命名 id（如 `<工程>/<主题>`，rules-index 全仓扫都收）；
  2. 索引：`rules-index.sh` regen `docs/rules/index.yaml`（机检兜）；
  3. shim：所在 `AGENTS.md` 有同级 `CLAUDE.md`（make verify 查）；
  4. 执行挂钩：机器判 → `hook-policy.sh`+测试；人判 → eval 考题+登记；都不便 → 显式标软约束；
  5. eval 指针：标记 `eval: NNN` 与考题双向对上；
  6. **引用点（改 / 删要害）**：全仓 grep 该规则 id——skill 正文 / reviewer 判据 / ADR / 模板，**改语义 / 删除时引用点全要跟**（防"复述点没扫"）；
  7. lessons 闭环：源自错题晋升的，`lessons.md` 对应条标 `<!-- opt: rule-00NN -->` 销掉；
  8. 反向：新规则该不该被现有 skill 引为指针（如 rule-0015 立完各处改指针的先例）。
- **两角色分离**（用户提出）：**主 agent 生成规则本体**（skill 引导）；**`hc-rule-reviewer` 子 agent（双栈，只评不改）巡查关联对照表**——逐行核引用点全不全 / 该引未引 / 挂钩挂没挂挂得对不对 / eval 指针闭合 / lessons 销没销，出清单回改到过。**机器能查的（索引漂移 / shim / 登记）`make verify` 已兜、reviewer 不重复**（两层防线惯例）。
- 小缺口修补：范围判定引 **rule-0015**（通用归控制面 / 项目归工程）；补「**从 lessons 晋升**」入口（correction-nudge 天天提醒"该升的升"，skill 里现在没这条路）。

### 2. `hc-git-workflow`：分级表 + 发布前起手式；不加 subagent、不加钩子

- **不加 subagent**（无产物值得对抗评审；安全靠硬防线：rule-0006 + hook 拦高危 + git pre-push 跑 verify）。**不加 agent 钩子**（用户砍："每次都检查太蠢"）；现有拦高危的 hook 不动。
- **操作三档分级表**：
  - **只读随意**：status / log / diff / fetch / ls-remote——不用问；
  - **写需授权**：commit / push / rebase 后强推 / 删分支 / 改 remote / tag——**授权不跨批**（上一批的"提交吧"不延续到下一批）；
  - **高危禁止**：`reset --hard` / 强推 main / `rm -rf`——hook 拦，授权也不做。
- **发布前起手式（只挂发布类操作前；有效期 = 本轮对话）**：push / 合并 / rebase 后强推 / 开 PR 之前——① `git status`（分支 / 工作树）；② `git fetch` + 核 ahead/behind（本地远程对齐）；③ force-with-lease 用**显式远端 SHA**（防 stale info）；④ **核目标 PR 状态**（防"PR 已被合了还往老分支推"——踩过两次）。**commit 等本地操作不强制查**；同一轮内查过不重查，跨轮 / 有理由怀疑远端变了（用户说"我合了"）才重查。
- commit 规范补：**不加 `Co-Authored-By` / AI 署名**（用户明确要求——此前只在单 agent 记忆里，Codex 栈看不到，必须进 skill）。
- 备注：sandbox 环境 SSH 不通时 push 走 `git -c credential.helper='!gh auth git-credential' push https://…`。
- 分支约定（feat/fix 从 main 切）**不动**（用户：问题不大）。

### 3. `hc-self-evolution`：本体不动，11 份 references 对照现状刷新

- 本体（检查层定位 / 链路诊断法 / 维度索引 / 4 meta）仍健康，**不动**。
- `references/` 13 份里 `sandbox.md` / `project-onboarding.md` 已随 ADR-0019 修；**余 11 份写于 6-27/28、不认识 ADR-0013~0019 六轮新资产**（hc-tech-design / hc-onboard / hc-create-sandbox 三个新 skill、designs-audit / verification-audit 两个新机检、testing-flow / SANDBOX_CONTRACT 两个真相源、7 个新 reviewer、api 用例线）——审查手册不认识新资产 = 巡检必漏。**逐份对照现状刷新**：保留五段结构（规范 / 检索 / 判据 / 漏洞 / 修复），只更新过时事实、补新资产；历史案例（lessons 引用）保留不删。

## 受影响（rule-0007）

- `hc-add-rule` SKILL 重构（version bump）+ 新增 `hc-rule-reviewer` 双栈（注册 `.codex/config.toml`）。
- `hc-git-workflow` SKILL 修（version bump）。
- `hc-self-evolution` 11 份 references 刷新（本体 version/last_reviewed bump 记"references 刷新"）。
- 索引 regen（skills / agents）。规则 / 考题不动。

## 备选（拒）

- **add-rule 拆成两个独立 agent（生成 agent + 巡查 agent）**：形态上取"主 agent 生成 + reviewer 巡查"——与本仓所有 skill 的「做 → 挑刺」结构一致，生成本就是主 agent 的活、无需再拆一个生成 agent。
- **git-workflow 配 reviewer / 加发布前提醒钩子**：拒——无产物可审；钩子每次弹提醒被用户否（太蠢），靠 skill 约定 + 现有硬防线。
- **git 起手式挂所有写操作前**：拒（用户改）——每次都跑 status 太慢；只挂发布类、轮内有效。
- **self-evolution references 重写**：拒——结构没坏，刷新事实即可；重写丢历史案例。

## 影响 / follow-up

- 三个老资产跟上这波 uplift；add-rule 补齐"唯一没有 reviewer 的 skill"这块短板；规则的加改删有对照表 + 巡查兜底。
- follow-up：references 刷新后，`hc-self-evolution` 巡检实战一轮（等全流程建完、统一优化那批一起）。
