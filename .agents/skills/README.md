# 技能目录

> 由 `bash scripts/skills-index.sh` 从各 SKILL.md frontmatter 自动生成，请勿手改。

| name | description |
| --- | --- |
| hc-add-rule | 规则的加 / 改 / 删统一入口（团队规范、踩坑约束、编码红线）。用户说"以后都要/不许/必须…"、要改一条规则的语义/位置/severity、要删过时规则、或 lessons 攒到该升规则时用本 skill：走"定范围→写下来+登记→挂执行"三步，照「规则关联对照表」跟全关联点，派 hc-rule-reviewer 对抗巡查，确保规则会被加载、违反会被发现、改删不留悬空引用。 |
| hc-create-sandbox | 引导式给被管工程把 sandbox 从 PENDING 接实：按 SANDBOX_CONTRACT 建 起/停/查(+可选 reset/seed)，聊形式源驱动不预设、真跑验收[双 up 验幂等+status 翻转]、接线 verification.yaml 三字段、派 hc-sandbox-reviewer 对抗评审；用户说「接 sandbox / 建沙箱 / 补 sandbox_status / 测试环境接实」时用。 |
| hc-dev | 写代码的统一入口，开发总监编排式（写功能 / 工程代码 / 重构 / 改 bug / 迁移 都走它）：总监（主 agent）吃上游（需求产出 docs/prds + 设计方案 design.md + 接口契约 api-contract.md，有则必吃、无则可独立干）→ 按改动面定编制——单层小活 / 改 bug 直做或派 1 个 worker、跨层大活按项目真实分层并行派 hc-dev-worker（前端 / 后端 / 客户端是常见例，源驱动不硬编层种）、契约为接缝 → hc-code-reviewer 对抗 review 到零（含 实现↔契约对账 + UI 视觉还原证据）→ 提醒你测 + 指路 hc-test。纪律全程常开：不假设 / 决策点问你 / TDD 优先 / 验证如实。用户说「写 / 实现 / 改 / 重构 / 迁移 / 修 bug / 做个功能 / 开发」时用。 |
| hc-git-workflow | 做任何 git 写操作（建分支 / 提交 / rebase / 合并 / 解冲突 / 推送 / worktree 清理）前用本 skill：① 操作三档分级表（只读随意 / 写需授权且授权不跨批 / 高危禁止）② 发布前起手式（push / 合并 / 强推 / 开 PR 前核 status、ahead/behind、显式远端 SHA、目标 PR 状态）③ 本仓 git 约定（feat/fix 分支从 main 切、本地 rebase main 解冲突、PR 走 merge commit、commit 格式、不加 AI 署名）。打算 commit / push / reset / 合并 / 删分支 时必看。 |
| hc-onboard | 引导式把一个工程接进 harness 控制面（新 / 老两分支均已实现）：主 agent 当接入向导，先问 新/老 分流 → 新项目走 7 步（收信息 / 搭最小骨架 / 记第一个 ADR / 接执行口 / 对抗评审 / make verify 收尾 / 交棒），每步先摆选项 + 讲取舍让用户拍再落；老项目走 8 步（定位接管 / 拆模块引导对话 / 按模块滚 扫→确认→搬进规范 / 接执行口发现+对齐现有的 / 引入关联进主目录 / 对抗评审 / 收尾 / 交棒），倒着对齐：扫出来的先经用户逐条确认才落、只收规范不改业务代码 → 派 hc-onboard-reviewer 对抗评审到过。接入点占位守「三态」（真命令 / PENDING: / N/A:，静默空=红）。产出的项目骨架 / 规范（AGENTS.md / ADR / verification 条目）本就项目专属。用户说「接入项目 / 新建项目 / 挂个工程 / onboard / 接入老项目 / 存量项目 / 对齐现有项目」时用。 |
| hc-prd | 编排式产出需求（而非实现）：产品总监（主 agent）调度一队专职 worker——需求采集 / 外部调研(可选) / 用户故事+AC / PRD本体 / 功能点 / 原型(可选) / PRD审稿——带 必选·可选权重 + 确认门 + 并行 + review loop，分阶段产出 用户故事 → PRD →（可选）原型，每阶段用户确认。用户说"做需求 / PRD / 原型 / 理一理需求 / 出个原型"时用。它是实现（hc-dev）的【上游】，产物独立存放、松耦合。 |
| hc-self-evolution | harness 规范检查层。当要改 harness 本身、或发现 harness 漏洞（如"某规则工作时没被加载"）时用——引导按 harness 结构逐维度审查"哪一环出问题 / 该怎么改"，不靠记忆漏项。区别于操作层 skill（hc-add-rule/hc-prd 等是被检查对象 + 修复工具）。 |
| hc-tech-design | 交互式产出研发方案 / 技术设计（而非需求、而非实现）：主 agent 当设计者，读项目现状 → 提方案 → 不确定就查/问 → 决策点让用户拍 → 全明确 + 用户审核才落稿 → 派 hc-tech-design-reviewer 对抗评审到过。产出 项目专属 的 研发方案；有对外接口才附 接口契约（被 api 用例消费），纯内部无接口标 N/A。它填 hc-prd(需求) 与 hc-dev(实现) 之间的设计空档：hc-prd → hc-tech-design →（api 用例 / hc-dev）。用户说「出研发方案 / 技术设计 / 设计接口 / 接口契约 / 怎么实现这块 / 把需求落成方案」时用。 |
| hc-test | 编排式产出测试（而非实现）：测试总监（主 agent）按手上产物 + 到了哪一步自动选场景，调度专职 worker——e2e 用例 / api 用例 / 接口契约对照 / 测试脚本（写跑一体，ADR-0024）/ 回归（各线实现状态见 testing-flow）——带 默认编排 + 用户覆盖、worker→reviewer 回改 loop、两层覆盖防线。用户说「写测试用例 / 写 e2e 用例 / 写 api 用例 / 接口用例 / 测试覆盖 / 用例覆盖率 / 把验收点转成用例 / 写测试脚本 / 把用例落成脚本 / 做测试」时用。流程唯一真相源 = docs/harness/testing-flow.md（总纲）+ 分线文件；用例落 docs/test-cases/<id>/、脚本落工程内 test/<需求id>/，与实现体系松耦合。 |
