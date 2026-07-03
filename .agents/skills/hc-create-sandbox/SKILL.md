---
name: hc-create-sandbox
description: 引导式给被管工程把 sandbox 从 PENDING 接实：按 SANDBOX_CONTRACT 建 起/停/查(+可选 reset/seed)，聊形式源驱动不预设、真跑验收[双 up 验幂等+status 翻转]、接线 verification.yaml 三字段、派 hc-sandbox-reviewer 对抗评审；用户说「接 sandbox / 建沙箱 / 补 sandbox_status / 测试环境接实」时用。
version: 1
last_reviewed: 2026-07-03
---

# 引导式给工程把 sandbox 接实（hc-create-sandbox）

本 skill 管"**给某个已接入 harness 的被管工程，把 sandbox（跑 e2e / 测试脚本要的运行环境）从 `PENDING:` 占位接成真命令**"——照 **sandbox 契约**（唯一真相源 = `docs/harness/SANDBOX_CONTRACT.md`，依据 **ADR-0019**）建 **起 / 停 / 查**（+ 可选 重置 / 导资产），**真跑验收 → 接线登记 → 对抗评审到过**。契约细节本文**引用不复刻**——语义有出入，以 `SANDBOX_CONTRACT.md` 为准。

**形态 = 交互式引导**（主 agent 当 **sandbox 向导**），同 `hc-onboard` / `hc-tech-design` 的「引导 → 用户确认 → 派 reviewer 对抗挑刺 → 回改 loop」——一条连贯对话、逐步确认、不可拆并行。

**铁律（贯穿全程）**：
- **形式源驱动、不预设**：sandbox 底层形式（容器编排 / 虚拟机 / 本地进程 / 远程环境……）**看项目实际有啥**，摆选项 + 讲取舍**让用户拍**，不默认某种形式、不替用户定（rule-0015 / rule-0008）。
- **只建测试基础设施，绝不动业务代码**：sandbox 脚本 / 配置 = 测试基础设施，落在**工程自己里面**（`projects/<名>/` 下），不算业务代码、不越 `hc-dev` 的界；但本 skill **不改工程任何业务代码**。

## ① 何时用 / 何时不用
- **用**：给**已接入的工程**把 sandbox 接实——`verification.yaml` 里 `sandbox` / `sandbox_down` / `sandbox_status` 还是 `PENDING:`（或缺 status 这类不全），要按契约建齐 起 / 停 / 查（+按需 reset / seed）并接线。用户说「接 sandbox / 建沙箱 / 补 sandbox_status / 测试环境接实 / 把沙箱接起来」时用。
- **不用**：
  - **跑测试 / 用例转脚本** → `hc-test` 脚本线（**占位中**；sandbox 是它的硬前置，脚本线跑前的运行时卡门 `up → status` 归脚本线，不归本 skill）；
  - **把工程接进 harness** → `hc-onboard`（那里 sandbox 只留三态占位，接实来这）；
  - **写功能 / 改业务代码** → `hc-dev`。
- 一句话边界：本 skill 只建"**环境的 起 / 停 / 查**"这层测试基础设施并接线，**不写测试、不跑测试、不动业务代码**。

## ② 前置
- **工程已在 `workspace/verification.yaml` 有条目**——还没有 = 工程没接入，先走 `hc-onboard`。
- **确认给哪个工程建**：`projects/` 是多工程目录，先明确目标工程，全程**只动它那份**。
- 动笔前**先读 `docs/harness/SANDBOX_CONTRACT.md`**（入口语义 / 数据口径 / 硬约束都在那，本 skill 各步引用它）。

## ③ 6 步流程（每步：问什么 / 确认什么 / 落什么）

### 第 1 步 · 定工程
- **问什么**：给哪个工程建；读 `workspace/verification.yaml` 现状——该工程 `sandbox` / `sandbox_down` / `sandbox_status` 现在各是哪态（真命令 / `PENDING:` / `N/A:`），哪些要接实、哪些已有现成可对齐。
- **确认什么**：目标工程 + 接实范围（三个必须入口之外，`reset` / `seed` 可选槽要不要，第 2 步聊完数据再定也行）跟用户核准。
- **落什么**：先不落文件，确认的范围是后续所有步骤的边界。

### 第 2 步 · 摸现状 + 聊形式（源驱动，数据也这步聊定）
- **问什么**：看项目**实际有啥**——已有容器编排配置就着它、纯本地进程就本地、依赖远程环境就远程；把可行形式**摆选项 + 讲取舍**（起停速度 / 可重建性 / 依赖多少 / 团队现有习惯）让用户拍，**不预设形式**。
- **资产数据也这步聊定**：测试要用的基础数据有哪些（账号、基础配置、字典……）、**从哪来**（seed 文件？现有库导出后落仓版本化？压根没有=不需要 reset/seed？）；据此定可选槽 `reset` / `seed` 建不建（口径见 ④）。
- **确认什么**：形式 + 资产数据清单 + 可选槽取舍，**全部用户拍板了才动笔**。
- **落什么**：确认过的方案（形式 / 组件 / 资产来源 / 建哪几个入口），作为第 3 步的输入。

### 第 3 步 · 照契约落脚本（工程内）
- **落什么**：在**工程内**（`projects/<名>/` 下）建 起 / 停 / 查（+按需 reset / seed）的脚本 / 配置，守契约**硬约束**（全文见 `SANDBOX_CONTRACT.md`「硬约束」，此处只点名）：
  - **幂等**：`up` 已起=成功、`down` 没起=成功——调用方是 agent / 脚本，中断重跑**任何状态可重入**；
  - **具名**：资源带**工程名**（多工程不打架），状态靠 `status` 查、**不猜端口 / 不猜进程**；
  - **自包含**：形式工程自定，控制面只经 `verification.yaml` 调；
  - **fail loud**：任何一步失败就非零 exit + 说清哪步挂了，不静默装好；
  - **status 真查**：真做健康检查（探依赖 / 查健康态），**不许 sleep 完 echo ok 装样子**；`up` 阻塞到**真就绪**才返回、起完即**基线态**（见 ④）。
- **红线（本步命根）**：sandbox 脚本 = 测试基础设施，落工程内**不算越界**；但**绝不动工程业务代码**——发现业务代码要改才能接 sandbox，停下来跟用户说、走 `hc-dev`，本 skill 不代改。

### 第 4 步 · 真跑验收（缺任一不许收）
契约三层检查的第一层，**建时必须真跑**、拿**真运行证据**（rule-0002 / rule-0003）：
1. **连调两次 `up`**——第二次也成功 = 幂等是真的，不是碰运气；
2. `up` 后跑 `status`——**exit 0**（就绪真被查出来）；
3. `down`；
4. `down` 后再跑 `status`——**exit 非 0**（status 真反映状态，不是永远绿）。

四条**逐条摆真实运行证据**（命令 + exit code / 输出），**缺任一不许收尾**、不许"写完就算好"、blocked / skipped ≠ pass。

### 第 5 步 · 接线（登记 + 销待补）
- **落什么**：`workspace/verification.yaml` 该工程 `sandbox` / `sandbox_down` / `sandbox_status` 三字段 `PENDING:` → 真命令（可选 `sandbox_reset` / `sandbox_seed` 建了就登真命令，没建照三态标 `PENDING:` / `N/A:`，静默空 = 红）；工程 `AGENTS.md` 里对应的"待补"记录**销掉 / 更新**。
- **接线纪律**：本 skill **教怎么标、教 reviewer 怎么审**，实际写 `workspace/verification.yaml` / 工程 `AGENTS.md` 这几笔由**主 agent 串行接线**做（不代跑 index / regen / 机检脚本）。接完 `make verify`（verification-audit 机检）**绿**。

### 第 6 步 · 对抗评审（派 hc-sandbox-reviewer 到过）
- **派 `hc-sandbox-reviewer`** 子 agent 对抗挑刺（契约三层检查的判断层）：status 是**真查还是装的**、幂等是**真处理"已存在"还是碰运气**、有没有**硬编端口 / 猜进程**、**资产 / 脏数据口径**与基线态语义对不对、**真跑验收证据**在不在。
- reviewer **只评不改**，出结构化清单；主 agent（sandbox 向导）据清单**回改 → 复审 → 到过**。
- **怎么派**：**Claude Code** 用 Task（`agentType: 'hc-sandbox-reviewer'`）；**Codex** 派**同名**双栈 reviewer。

## ④ 数据口径（引契约，不复刻）
完整口径见 `SANDBOX_CONTRACT.md`「数据口径」，工作时守这几句：
- **资产数据**（测试要用的基础数据，**清了坏事**）vs **脏数据**（测试跑出的垃圾，**该清的是它**）**两分**——聊数据先分清哪边是哪边。
- **基线态 = 资产在位 + 无脏数据**；`up` 起完即基线；`reset` = **回基线**（≠ 清空、**不拆环境**）。
- 资产推荐**一键导入式**：seed 文件 / 脚本放工程仓库里版本化，`up` / `reset` 内部导入——**不靠"库里一直留着"**（环境随时可丢可重建，资产不丢、有版本历史）。
- 没数据要管的项目**不硬造** reset / seed——可选槽照三态标即可。

## ⑤ 硬规则
- **不动业务代码**：本 skill 只落 sandbox 脚本 / 配置（测试基础设施，工程内）；业务代码要动 = 停下来说清、归 `hc-dev`。
- **全程用户确认、不替用户定**：形式 / 组件 / 资产来源 / 可选槽都**摆选项 + 讲取舍让用户拍**，不"看见啥落啥"；不确定就查 + 问（rule-0008）。
- **无真跑验收不收尾**：第 4 步四条（双 `up` / `status` exit 0 / `down` / `status` exit 非 0）**逐条真运行证据**，缺任一不许声称完成（rule-0002 / rule-0003）。
- **多工程隔离**：只动目标工程的 `projects/<名>/` 与它在 `verification.yaml` 的那条，绝不碰别的工程。
- **通用 / 项目隔离别搞反**（rule-0015）：**skill 本体 / hc-sandbox-reviewer** 通用中性——不预设某容器技术 / 某语言 / 领域词；但**产出的 sandbox 脚本 / 配置本就项目专属**，写满项目真实组件 / 端口 / 数据是对的。方向别反：通用的归资产、具体的归产物。
- **引用契约不复刻**：入口语义 / 数据口径 / 硬约束的唯一真相源 = `SANDBOX_CONTRACT.md`，本 skill 与产物只引用；发现出入以契约为准、别在别处另立口径。
- **接线归主 agent**：`verification.yaml` / 工程 `AGENTS.md` 的实际写入、index / regen / 机检由主 agent 串行做，本 skill 不代跑。
- **对抗评审到过**：派 `hc-sandbox-reviewer` 回改到零缺陷。

## ⑥ 演进（rule-0007）
sandbox 契约（`docs/harness/SANDBOX_CONTRACT.md` 的入口 / 数据口径 / 硬约束 / 三层检查）或评审机制变化时回顾本 skill（连同 `.claude/agents/hc-sandbox-reviewer.md`、`.codex/agents/hc-sandbox-reviewer.toml`）；改完同步 `version` / `last_reviewed`，跑 `bash scripts/skills-index.sh`（由主 agent 串行做，skill 本身不代跑）。

---

> 本 skill 为通用引导，环境轻重可按需伸缩（单进程小环境几步从简、多组件重环境逐项做实）；但**门槛**（形式用户拍 / 契约硬约束 / 真跑验收四条 / 三态登记不静默 / 不动业务代码 / 对抗评审到过）不省。
