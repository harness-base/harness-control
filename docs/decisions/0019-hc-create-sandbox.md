---
title: ADR-0019 sandbox 契约 + hc-create-sandbox skill——起/停/查三入口、基线态（资产/脏两分）、幂等 + 三层检查
status: accepted
date: 2026-07-03
last_updated: 2026-07-03
source_files:
  - ../../workspace/verification.yaml
related_docs:
  - ../harness/SANDBOX_CONTRACT.md
  - 0017-hc-onboard-project-onboarding.md
  - 0014-hc-test-orchestration.md
  - ../harness/testing-flow.md
---

# ADR-0019：sandbox 契约 + hc-create-sandbox skill

## 背景

hc-test 剩下的**脚本线**（用例 → 可执行脚本）与**统一回归**都要运行环境，一直"待 sandbox"；接入完的工程 sandbox 也多为 `PENDING:` 占位。用户定的方向（ADR-0017 follow-up）：**sandbox 是被管工程对外提供的标准接入点**——工程给命令入口、控制面统一调。分两半做：**先立契约（标准），再建 skill（照标准引导接实）**。

## 决策

1. **sandbox 契约落 `docs/harness/SANDBOX_CONTRACT.md`（唯一真相源，各处引用不复制）**，要点：
   - **入口**：`up`（起，**起完即基线**、阻塞到真就绪、fail loud）/ `down`（停）/ `status`（查，**exit code 机器可判**）三个**必须**；`reset`（回基线不拆环境）/ `seed`（导资产）**可选槽**——不是谁都有数据要清，不强制（用户定 2026-07-03）。
   - **数据口径（用户定 2026-07-03）**：**资产数据**（测试要用的基础数据，清了坏事）与**脏数据**（测试跑出的垃圾，该清的是它）两分；**基线态 = 资产在位 + 无脏数据**；`reset` 语义 = **回基线**（≠ 清空）。资产推荐**一键导入式**管理（seed 文件在工程仓库里版本化，`up`/`reset` 内部导入），不靠"库里一直留着"。
   - **硬约束**：**幂等**（`up` 已起=成功、`down` 没起=成功——调用方是 agent，中断重跑必须任何状态可重入，用户确认 2026-07-03）、**具名**（带工程名、不猜端口）、**自包含**（形式无关：docker / vm / 本地 / 远程，工程实现、控制面只调）、**fail loud**、**status 必须真查**（不许 sleep+echo 装）。
   - **三层检查（用户确认 2026-07-03）**：建时真跑验收（双 `up` 验幂等、`up`→`status` 0、`down`→非 0）+ `hc-sandbox-reviewer` 判断层（status 真假 / 幂等真假 / 硬编端口）+ 运行时卡门（脚本线跑前 `up`→`status`，不过不跑——契约先立，脚本线实现时执行）。

2. **登记 = `verification.yaml` 拆三个显式字段**（用户定 2026-07-03）：`sandbox`（起）/ `sandbox_down` / `sandbox_status`（+ 可选 `sandbox_reset` / `sandbox_seed`）——每行明白写命令、**不靠命名规律推**（不绑 make / 命名样式）；占位三态照旧、`verification-audit` 机检**扩认新字段**。

3. **`hc-create-sandbox` = 引导式 skill**（命名按 ADR-0013 带 `hc-` 前缀），给某个工程把 sandbox 从 `PENDING:` 接实，6 步：
   1. **定工程**：给哪个项目建（读 `verification.yaml` 现状）。
   2. **摸现状 + 聊形式**：看项目实际（有 docker-compose 就着它、纯本地就本地），**摆选项讲取舍用户拍**——不预设 docker（rule-0015 源驱动）；资产数据有哪些、从哪来（seed 文件？现有库导出？）也在这步聊定。
   3. **照契约落脚本**：在**工程内**建 起 / 停 / 查（+按需 reset / seed），具名、幂等、fail loud、status 真查。（边界：sandbox 脚本 = **测试基础设施**，不算业务代码、不越 `hc-dev` 的界；但**不动工程业务代码**。）
   4. **真跑验收**：双 `up`（验幂等）→ `status`（exit 0）→ `down` → `status`（exit 非 0），真运行证据（rule-0002 / 0003），不许"写完就算好"。
   5. **接线**：`verification.yaml` 三字段 PENDING → 真命令、工程 `AGENTS.md` 待补记录销掉 / 更新；`make verify`（verification-audit）绿。
   6. **对抗评审**：派 `hc-sandbox-reviewer`（双栈）审契约符合性，回改到过。

4. **`hc-sandbox-reviewer` 子 agent（双栈）**：判断层审——status **真查**（健康检查 / 探活）还是**装的**（sleep + echo）；幂等**真处理**"已存在"还是碰运气；具名 / 硬编端口猜测；资产 vs 脏数据口径、基线态语义对不对；真跑验收证据在不在。只评不改。

5. **存量对齐（kratos-base）**：现有 `sandbox-up` / `sandbox-down` make target（up 已带七组件健康等待）、无 status——`sandbox_down` 填真命令、`sandbox_status` 标 `PENDING: 按 SANDBOX_CONTRACT 补`（诚实占位，机检 warn 提醒；补齐走 `hc-create-sandbox`，不在本批硬造）。

## 受影响（rule-0007）

- 新增：`docs/harness/SANDBOX_CONTRACT.md`（契约真相源）+ `hc-create-sandbox` skill + `hc-sandbox-reviewer` 双栈（注册 `.codex/config.toml`）。
- 机检：`scripts/verification-audit.sh` 字段正则扩认 `sandbox_down` / `sandbox_status` / `sandbox_reset` / `sandbox_seed`（+ 自测）。
- `workspace/verification.yaml`：注释 / 示例按三字段更新；kratos-base 条目存量对齐（决策 5）。
- 指针：`VERIFICATION_ROUTING.md` sandbox 行指 SANDBOX_CONTRACT；`PROJECT_ONBOARDING.md` 速查 sandbox 行"create-sandbox（待建）"改已建；`testing-flow.md` 脚本线占位处加"sandbox 接实走 hc-create-sandbox"指针（脚本线本身仍占位）；`hc-onboard` skill 里 create-sandbox 提法核措辞。
- 「登记模型 1→3 字段」的旧枚举消费方全扫（对抗评审 + eval 011 逐轮挖出）：`hc-onboard` skill ×3 处 + `hc-onboard-reviewer` 双栈 ×4 处（缺键判据显式归它）+ `templates/project-agents.md` + `PROJECT_ONBOARDING` 验证行 + `CURRENT_STATUS` 两行 + verification.yaml 示例块 + **`hc-self-evolution` 的 `references/sandbox.md`（三入口 + "登记形态已有机检、命令可跑仍靠亲跑"的准确口径）与 `references/project-onboarding.md`（hc-onboard 引导式 + 三字段三态）**。
- `projects/kratos-base/AGENTS.md`：验证段加 `sandbox_status` 待补记录（闭环三态纪律）。
- `hc-test` 脚本线 / 统一回归：**仍占位**（本 ADR 只解锁前置，不建脚本线）。

## 备选（拒）

- **四入口全必须**：拒——没数据要清的项目被迫写空 reset，负担；可选槽即可。
- **登记单字段 + 命名规律推另两条**：拒——绑死命令命名样式（不用 make 就翻车）、猜错难发现；三行显式换通用与机检直罩。
- **seed 必须单独入口**：拒——通常是 `up`/`reset` 的实现细节；想暴露的自己加（可选槽）。
- **不配 reviewer、靠真跑+机检**：拒——"status 真查还是装的、幂等真处理还是碰运气"是判断活，机器与一次真跑都兜不住（装的 status 也能跑绿一次）。
- **本批顺手把 kratos 的 status 补了**：拒——那是 `hc-create-sandbox` 的活（走 skill 引导 + 真跑验收 + 评审），本批只立契约与 skill，别绕过自己刚立的流程。

## 影响 / follow-up

- 脚本线与统一回归的硬前置就绪：环境有了标准的 起 / 停 / 查 + 卡门依据。
- follow-up：① 给 kratos-base 走一次 `hc-create-sandbox` 补 `sandbox_status`（顺带实战检验 skill）；② hc-test 脚本线 + 统一回归（下一摊）。
