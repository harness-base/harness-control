---
name: hc-git-workflow
description: 做任何 git 写操作（建分支 / 提交 / rebase / 合并 / 解冲突 / 推送 / worktree 清理）前用本 skill：① 操作三档分级表（只读随意 / 写需授权且授权不跨批 / 高危禁止）② 发布前起手式（push / 合并 / 强推 / 开 PR 前核 status、ahead/behind、显式远端 SHA、目标 PR 状态）③ 本仓 git 约定（feat/fix 分支从 main 切、本地 rebase main 解冲突、PR 走 merge commit、commit 格式、不加 AI 署名）。打算 commit / push / reset / 合并 / 删分支 时必看。
version: 4
last_reviewed: 2026-07-23
---

# Git Workflow

git 写操作可能不可逆（reset / 删分支 / 强推），未授权的提交 / 推送会污染历史。先授权、走约定。

## 何时用 / 何时不用
- 用：建分支 / 提交 / 合并 / rebase / 解冲突 / 推送 / worktree。
- 不用：只读查询（status / log / diff）随意。

## 操作三档分级表（rule-0006）

| 档 | 操作 | 规矩 |
|---|---|---|
| **只读随意** | status / log / diff / fetch / ls-remote | 不用问，随时跑 |
| **写需授权** | commit / push / rebase 后强推（**仅 `--force-with-lease` 形态**）/ 删分支 / 改 remote / tag | 先问用户；**授权不跨批**——上一批的"提交吧"不延续到下一批新改动，新改动要重新授权 |
| **高危禁止** | `reset --hard` / 裸强推（`--force` / `-f`，任意分支——一律用 `--force-with-lease`）/ 直推·强推 `main`（main 只走 PR merge）/ `rm -rf` | hook 会拦（ADR-0025 补齐机器拦截）；**有授权也不做** |

- 不直接在 `main` 上干活。

## 发布前起手式（只挂发布类操作前）

发布类操作 = push / 合并 / rebase 后强推 / 开 PR。动手前先过四步：

1. `git status`——确认在哪个分支、工作树干不干净。
2. `git fetch` + 核 ahead/behind——本地远程对齐了没。
3. force-with-lease 用**显式远端 SHA**（`git ls-remote origin <branch>` 拿），防本地 remote-tracking 信息 stale：
   ```bash
   git push --force-with-lease=<branch>:<远端SHA> origin <branch>
   ```
4. **核目标 PR 状态**（如 `gh pr view`）——防"PR 已被合了还往老分支推"。

**有效期 = 本轮对话**：同一轮内查过不重查；跨轮、或有理由怀疑远端变了（如用户说"我合了"）才重查。**commit 等本地操作不强制查。**

## 分支约定
- **需求分支 `feat/<desc>`、bug 分支 `fix/<desc>`，都从最新 `main` 切。**
- Claude Code 自动开的 worktree 分支（`claude/<auto>`，前缀不可配）**无视它**——在 worktree 里手动切自己的需求/bug 分支：
  ```bash
  git fetch origin main
  git switch -c feat/<desc> origin/main   # bug 修复用 fix/<desc>
  ```

## 改完 → 更新 → 合并
1. 干活、提交都在 `feat/` / `fix/` 分支上。
2. 落后 main 时**本地 `rebase main`**（不是 merge main，保持历史线性）：
   ```bash
   git fetch origin main && git rebase origin/main
   ```
3. **冲突在本地解决**：逐文件看 `<<<<<<<` 标记、留对的、`git add <file>`、`git rebase --continue`；拿不准停下问，别瞎合。
4. push 分支（rebase 后用 `git push --force-with-lease`；`main` 受保护、不可强推）。
5. **开 PR 到 `main`，CI 绿 + review 才合，合并方式 = merge commit。**

> 备注：SSH 不通的环境（sandbox）push 走：
> ```bash
> git -c credential.helper='!gh auth git-credential' push https://github.com/<org>/<repo>.git <branch>
> ```

## CI 处理（工程级快门，通用不针对具体项目）

CI = **工程级 / 运维级的事故拦截**，不针对某个需求、不针对某个具体工程。权威口径见 `docs/harness/CI.md`；这里讲它跟 git 流程的接口。

**三层分工**（各管一层，别混）：

| 层 | 拦什么 | 谁真跑 |
|---|---|---|
| **CI（工程级门）** | 编译不过 / 依赖装不上 / lint 崩 / 构建失败——「会让整个工程坏掉」的东西 | push / PR 时自动跑，纯项目级、不依赖 sandbox |
| **sandbox 真跑（需求级）** | 某切片做对没做对（e2e / api 真打服务） | 依赖 docker 起 PG/Redis/起服务/浏览器，在 sandbox 里跑，**不进 CI** |
| **对抗评审（判断级）** | 值不值、对不对味 | 独立评委 / reviewer |

**CI 怎么消费被管工程**：CI 遍历 `workspace/verification.yaml`，对每个工程只跑它的 `verify` 字段（纯项目级命令：编译 / vet / lint / build / 单测，已确认不依赖 sandbox/DB）；**不碰 `sandbox` 字段**（依赖 docker 的重环境不进 CI 快门）。

**接新工程时对 CI 的处理**：因为 CI 消费 verification.yaml，**接工程只要在 verification.yaml 登记好 `verify`，CI 自动覆盖、通常不用改 CI 配置**（rule-0015：CI 对每个被管工程都成立，零改动接入）。只有引入**新语言栈**（当前工具链是 Go / Node）时，才需要扩 CI 的工具链。别以为接工程还得手改 workflow。

**PR 与 CI**：开 PR 后 **CI 必须绿才合**——这里「CI 绿」就是上面「工程级门」全过；CI fail / unknown 时 MUST STOP，先修绿再继续（`docs/harness/CI.md`）。需求级是否做对由 sandbox 里 e2e/api + 对抗评审兜，不靠 CI。

## commit 规范
- 格式：`<范围>: <中文主题一句>`（范围如 `docs`、`skills 优化`、`prd 编排`、`fix`）。
- 正文：bullet 说清"做了什么 / 为什么"。
- **不加 `Co-Authored-By` / 任何 AI 署名行**（用户明确要求）。

## 演进（rule-0007）
git 约定变化时回顾本 skill，改完同步 `version` / `last_reviewed`、跑 `bash scripts/skills-index.sh`。（约定目前只写进本 skill；将来要机器校验 commit 格式 / 分支名，再加 commit-msg / pre-push hook。）
