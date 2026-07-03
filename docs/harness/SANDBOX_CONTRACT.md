---
title: sandbox 契约（被管工程测试环境的标准接入点）
status: active
owner: harness
last_updated: 2026-07-03
source_files:
  - ../../workspace/verification.yaml
related_docs:
  - VERIFICATION_ROUTING.md
  - ../decisions/0019-hc-create-sandbox.md
  - testing-flow.md
---

# sandbox 契约

> **sandbox = 跑 e2e / 测试脚本要的运行环境**（数据库、消息队列、服务本体……）。本契约定的是**统一接入点**：工程提供几个标准命令、各代表什么、守什么约束；**底层形式（docker / 虚拟机 / 本地进程 / 远程环境）由工程自己实现，控制面只调命令、不管形式**。
> 给某个工程把 sandbox 接实（从 `PENDING:` 到真命令）走 **`hc-create-sandbox` skill**（ADR-0019）。

## 入口（必须 3 个 + 可选 2 个）

| 入口 | 登记字段（`workspace/verification.yaml`） | 语义 | 必须？ |
|---|---|---|---|
| **起** | `sandbox` | 把环境拉起来，**阻塞到真就绪才返回**（就绪=依赖健康检查过，不是"命令跑完"）；起不来**大声报错退出**。起完 = 处于**基线态**（见下） | ✅ |
| **停** | `sandbox_down` | 把环境拆掉 | ✅ |
| **查** | `sandbox_status` | 查环境就绪没：**就绪 exit 0、未就绪 exit 非 0**（机器可判——这是跑测试前"卡门"的依据） | ✅ |
| 重置 | `sandbox_reset` | **回到基线态但不拆环境**（清脏数据 + 保证资产数据在位）——比拆了重起快 | 可选 |
| 导资产 | `sandbox_seed` | 单独把资产数据导入 | 可选（通常是 `up`/`reset` 的内部实现细节，不必单独暴露） |

## 数据口径（资产 / 脏 两分 + 基线态）

- **资产数据**（有价值的）：测试要用的基础数据——账号、基础配置、字典……**没它测试跑不起来，清了坏事**。
- **脏数据**（临时的）：测试跑出来的垃圾——上一轮插的测试记录……**该清的是它**。
- **基线态 = 资产数据在位 + 无脏数据。** `up` 起完即基线；`reset` 回基线（不拆环境）。
- **资产数据推荐"一键导入"式管理**：以 seed 文件 / 脚本形式**放在工程仓库里**（跟代码一起版本化），`up` / `reset` 内部导入——**不靠"数据库里一直留着"**。好处：环境随时可丢可重建，资产不丢、有版本历史。

## 硬约束

1. **幂等**：`up` 时环境已起着 = 直接成功（不重复起、不报"已存在"）；`down` 时本来没起 = 也算成功。**调用方是 agent / 脚本，流程会中断重跑——任何时刻从任何状态，`up → status → 跑 → down` 都必须能走通。**
2. **具名**：环境资源有固定名字（**带工程名**，如容器名 `<工程名>-sandbox-<组件>`），多工程 sandbox 互不打架；状态靠 `status` 查，**不靠猜端口 / 猜进程**。
3. **自包含**：脚本本体在**工程自己里面**（`projects/<名>/` 下），底层形式工程自定；控制面只经 `verification.yaml` 调用。
4. **fail loud**：任何一步失败就报错退出（非零 exit + 说清哪步挂了），**不静默装好**。
5. **status 必须真查**：真去做健康检查（ping 依赖 / 查容器 health / 探端口），**不许 sleep 完 echo ok 装样子**。

## 三层检查（约束不是嘴上说说）

| 层 | 谁 / 何时 | 查什么 |
|---|---|---|
| **建时真跑验收** | `hc-create-sandbox` skill 落地时 | **连调两次 `up`**（第二次也成功 = 幂等真）；`up` 后 `status` exit 0、`down` 后 exit 非 0（= status 真反映状态）。真运行证据（rule-0002 / 0003） |
| **判断层评审** | `hc-sandbox-reviewer`（对抗挑刺） | status 是真查还是装的、幂等是真处理还是碰运气、有没有硬编端口猜测、资产 / 脏数据口径对不对 |
| **运行时卡门** | 测试脚本线每次跑之前 | 固定走 `up → status`，**status 不过就不跑测试**——环境坏了当场拦住，不带病跑出假失败 |

## 登记（`workspace/verification.yaml`，占位三态照旧）

```yaml
sandbox:        "make -C projects/<名> sandbox-up"       # 起（起完即基线）
sandbox_down:   "make -C projects/<名> sandbox-down"     # 停
sandbox_status: "make -C projects/<名> sandbox-status"   # 查（exit 0=就绪）
# sandbox_reset / sandbox_seed 可选：可整条不声明（缺省=不提供）；一旦声明就守三态（verification-audit 机检罩已声明字段）
# 三个必须字段（sandbox/sandbox_down/sandbox_status）键必须都在——没接实标 PENDING:/N/A:，缺键由 hc-onboard-reviewer 抓
```
