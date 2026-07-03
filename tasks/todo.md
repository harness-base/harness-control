# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L3 ｜ task: old-skills-uplift

## 当前：老 skill 优化批（ADR-0020）——add-rule 重构 + git-workflow 修 + self-evolution references 刷新
- [x] 体检 + 方案敲定（用户逐点拍，2026-07-03）：
  - **hc-add-rule**：扩成**加/改/删统一入口** + **规则关联对照表**（8 行：本体标记[数字 rule-00NN + 工程命名 id 两种口径]/索引 regen/shim/执行挂钩/eval 指针/**引用点全仓 grep**[改删要害]/lessons 晋升销点/反向该引未引）+ **两角色分离**（用户提出）：主 agent 生成规则本体，新建 **hc-rule-reviewer** 双栈巡查关联对照表（只评不改、机器能查的不重复）。
  - **hc-git-workflow**：**不加 subagent**（无产物可审、硬防线已有）、**不加 agent 钩子**（用户砍：每次检查太蠢）；加**操作三档分级表**（只读随意/写需授权[授权不跨批]/高危禁止 hook 已拦）+ **发布前起手式**（只挂 push/合并/开 PR 前：status+fetch 对齐+核 PR 状态+force-with-lease 显式 SHA；**有效期=本轮对话**，轮内不重查）+ commit 规范补**不加 Co-Authored-By/AI 署名** + sandbox 环境 HTTPS push 备注；分支约定不动（用户：问题不大）。
  - **hc-self-evolution**：本体不动（检查层定位/链路诊断仍健康）；**11 份 references 对照现状刷新**（sandbox/project-onboarding 已随 ADR-0019 修，余 11 份不认识最近六轮新资产：hc-tech-design/hc-onboard/hc-create-sandbox、designs/verification 两机检、testing-flow/SANDBOX_CONTRACT、7 个新 reviewer）。
- [x] ADR-0020 定稿登记 + build（workflow 并行 7 agent：add-rule 重构 v3 / hc-rule-reviewer 双栈 / git-workflow 修 v3 / 11 份 references 四组刷新[检索命令实跑验证]）+ 接线（config 注册 rule-reviewer、self-evolution meta bump v3、索引 regen）。make verify + docs-audit(53) 绿。
- [x] **对抗评审 2 栈 + 修**：栈①忠实度 1 major+2 minor——**M1 对照表第 1 行"兜底=reviewer"但 reviewer 五块不含此项（声称的兜底没人干，rule-0009 同款）**→ 改"主 agent 第 1/2 步自查+用户拍"；m1 第 5 行 eval 指针正向存在性已有机检 → 兜底栏拆"机检管存在性/reviewer 管内容真伪"+reviewer ④ 两栈收窄；m2 标题正名。栈② references 事实抽查（~40 项实跑）**无 blocker/major**——新事实全证实、行号锚全精确、旧口径无漏网、历史案例保留；5 minor 旧日期锚/死 commit 哈希 → 全修（06-11→06-23/24/26、ee72ca4→task-review 路径）。修后 verify + docs-audit(53) 绿。
- [x] 收尾 eval：**yellow → 三针已修**（`docs/eval/task-reviews/20260703T075345Z-old-skills-uplift/`；010/011/012/rule-0012 pass、四项重点独立核全过[对照表兜底三方一致亲验/两栈 parity diff 空/git-workflow 四点无走样/references 锚点亲跑]；**F-1 rule-0015 fail**：add-rule 示例用了真实工程规则 id `kratos/...`——守隔离的 skill 自己越界 → 换中性占位；F-2 变异自证出处错位 → 改指 task-review；F-3 lessons 晋升补"先跟用户确认再升"步。修后 verify + docs-audit(53) 绿。）
- [ ] 提交（待授权）

## Review（old-skills-uplift）
- **做了什么**：三个老 skill 跟上这波 uplift——add-rule 扩加/改/删 + 关联对照表（8 行、谁兜底列三方一致）+ hc-rule-reviewer 双栈巡查（补齐"唯一没 reviewer 的 skill"）+ lessons 晋升入口（先确认再升）；git-workflow 三档分级表（授权不跨批）+ 发布前起手式（只挂发布类、轮内有效）+ 署名条款；self-evolution 11 份 references 对照现状刷新（检索命令实跑验证、历史案例保留）。
- **对抗+eval 的价值**：栈①逮到"对照表声称兜底=reviewer 但 reviewer 判据不含此项"（声称的保证没人干，rule-0009 同款）；栈② ~40 项实跑抽查证实 references 新事实全真；eval 又逮到"守 rule-0015 的 skill 自己示例越界"——三层各抓到别人漏的。
- **质量**：两栈 parity diff 为空；references 行号锚 ~20 个亲验全精确；旧口径无漏网。

## 已闭：sandbox 契约 + hc-create-sandbox skill（ADR-0019）——解锁 hc-test 脚本线的前置
- [x] 设计敲定（多轮，用户拍）：**契约先行**——入口 up（起完即基线）/down/status（exit 0 机器可判）必须 + reset（回基线≠清空）/seed 可选；**资产数据 vs 脏数据两分、基线态=资产在位+无脏**（用户提出）、资产推荐一键导入式（seed 文件版本化、不留库）；**幂等**（agent 调用、中断重跑任意状态可重入）+ **三层检查**（建时真跑验收[双 up+status 翻转] / reviewer 判断层[status 真假·幂等真假] / 运行时卡门[脚本线跑前 up→status]）；登记拆三显式字段（不靠命名猜）；配 hc-sandbox-reviewer。
- [x] 串行半边：`docs/harness/SANDBOX_CONTRACT.md`（契约真相源）+ ADR-0019 定稿登记 + `verification-audit` 扩认 sandbox_down/status/reset/seed（自测 **20/0**）+ verification.yaml 注释/示例三字段化 + **kratos 存量对齐**（sandbox_down 填真命令、sandbox_status 诚实 `PENDING`——补齐即 hc-create-sandbox 首个实战）+ 指针（VERIFICATION_ROUTING / PROJECT_ONBOARDING / hc-onboard skill / testing-flow 脚本线卡门）+ docs/harness 索引 regen。make verify + docs-audit(52) 绿。
- [x] build 另一半：workflow 并行建 `hc-create-sandbox` skill（6 步：定工程→聊形式源驱动→照契约落脚本→真跑验收[双 up 验幂等+status 翻转，缺任一不收]→接线→评审）+ `hc-sandbox-reviewer` 双栈（六块：status 真查还是装的=blocker / 幂等真处理 / 具名不猜端口 / 资产·脏口径 / 真跑证据=blocker / fail loud+边界）。
- [x] 接线：config 注册 reviewer、skills/agents 索引 regen、make verify + docs-audit(52) 绿。
- [x] **对抗评审 2 栈 + 修**（两栈收敛 ~7 major+3 minor，无 blocker；根因="登记模型 1→3 字段，旧模型复述点没扫"+机检守护缺口）：① 机检新字段 3/4 无守护测试（删正则分支自测全绿逃逸）→ 补 3 case、变异锁生效（删 sandbox_status 分支翻红），自测 **23/0**；② 「五个接入点」枚举集群全扩三字段（hc-onboard skill ×3 / onboard-reviewer 双栈 ×4 / 工程模板 / PROJECT_ONBOARDING）、缺键判据显式给 onboard-reviewer；③ verification.yaml 示例块三字段化+旧名改 hc-create-sandbox；④ CURRENT_STATUS 两行改契约口径；⑤ ADR-0017 follow-up ① 销掉+related_docs 加 0019；⑥ kratos AGENTS.md 补 sandbox_status 待补记录（闭环三态纪律）；⑦ testing-flow 场景表行与小节口径对齐；⑧ 契约可选槽措辞收紧（可缺省；声明则守三态）+ doc-sync-checklist 加 SANDBOX_CONTRACT 行。
- [x] 收尾 eval：**yellow → 两针已修**（`docs/eval/task-reviews/20260703T061743Z-create-sandbox/`；010/012/014/rule-0015 pass，评委亲做变异实验 **4/4 分支真锁**、kratos 对齐与诚实占位无可挑、五处口径一致；**011 fail**：旧口径又漏一网——`hc-self-evolution` 两份 references[sandbox.md 双入口旧模型+"无机器兜底"矛盾断言、project-onboarding.md 单字段+10 步旧流程] → 已按契约现状更新+ADR-0019 受影响栏补记；附带 hc-onboard meta bump v3、audit awk 注释补全。修后 make verify + docs-audit(52) + 自测 23/0 绿。eval 结果保留、统一优化时回看。）
- [x] 提交：合 PR #12 后 rebase → **独立 PR #13**（commit 3399729，待你合）

## Review（create-sandbox）
- **做了什么**：sandbox 契约（SANDBOX_CONTRACT：起/停/查三入口+基线态[资产/脏两分]+幂等+三层检查+三字段登记）+ hc-create-sandbox 引导 skill（6 步，真跑验收硬门槛）+ hc-sandbox-reviewer 双栈（status 真假=blocker）+ verification-audit 扩 4 字段（自测 23/0、变异锁 4/4）+ kratos 存量对齐（down 真命令、status 诚实 PENDING+待补记录）。hc-test 脚本线的前置就绪。
- **对抗评审+eval 的价值**：三轮接力（对抗两栈→eval）把"登记模型 1→3 字段"的旧口径消费方扫了三网才净（枚举集群→示例块/CURRENT_STATUS→hc-self-evolution references）；机检"3/4 新字段无守护、删分支全绿逃逸"被对抗栈变异实验挖出、补 case 后 eval 亲验 4/4 真锁。
- **质量**：契约/ADR/skill/reviewer 双栈五处口径一致（eval 独立比对）；kratos 无硬造、诚实占位；rule-0015 双向守住。

> 旧交付批（hc-tech-design / api 用例线 / hc-onboard 新+老 / turn-backstop / 打磨）已滚 `archive/2026-07-02-uplift-wave.md`。
