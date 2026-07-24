---
title: CI 闸门
status: active
owner: harness
last_updated: 2026-07-23
source_files:
  - ../../.github/workflows/verify.yml
related_docs:
  - VERIFICATION_ROUTING.md
  - HOOKS.md
---

# CI 闸门

`.github/workflows/verify.yml` 在 push / PR 时跑，是**工程级 / 运维级的事故拦截**——拦「会让整个工程坏掉」的东西（编译不过 / 依赖装不上 / lint 崩 / 构建失败），**不针对某个需求、不针对某个具体工程**。需求级（某切片做对没做对）由 sandbox 里的 e2e/api 真跑 + 对抗评审兜，不进 CI。

## 三个 job

1. **`control-plane`** — 控制面自检 `make verify`（结构 / 文档 / hook policy / 索引 / CLAUDE.md shim）。
2. **`discover`** — 读 `workspace/verification.yaml`，逐工程解析 `name/path/verify` 生成 matrix（注释掉的示例块自动跳过；解析出 0 工程即红）。
3. **`project-verify`** — 按 matrix 每个工程一个并行 job（`fail-fast: false`、job 名 `verify (<工程名>)`，某工程红不牵连其他、一眼看出是哪个），装通用工具链（当前 Go / Node）后跑该工程的 **`verify` 字段**。

## 只跑 verify，不碰 sandbox

CI 只消费每个工程的 `verify` 字段（纯项目级：编译 / vet / lint / build / 单测，不依赖 DB）；**不碰 `sandbox` / `e2e` / `api` 字段**——那些依赖 docker 起 PG/Redis/起服务/浏览器，属需求级重环境，在 sandbox 里跑，不进 CI 快门。

## 接新工程零改 CI

CI 消费 `verification.yaml`，**接工程只要登记好 `verify`，`discover` 下次自动把它纳入 matrix、`project-verify` 自动多一个并行 job**——CI 配置一行不动（rule-0015：对每个被管工程都成立）。**唯一例外**：引入新语言栈（当前工具链是 Go / Node）时才需扩 `project-verify` 的工具链步骤；同栈工程零改动。

## 规矩

- **CI fail / unknown 时 MUST STOP**，先修绿再继续。
- 开 PR 后 **CI 必须绿才合**（「CI 绿」= 上面工程级门全过）。
- 本地等价：控制面 `make verify`；单个工程 = 它在 `verification.yaml` 的 `verify` 命令。
