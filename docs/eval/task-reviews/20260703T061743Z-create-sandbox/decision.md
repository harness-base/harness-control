# decision — sandbox 契约 + hc-create-sandbox skill（L3 收尾闸）

评委独立复核（不采信声称）：`make verify` / `make docs-audit` / `verification-audit.test.sh` 亲跑；**变异实验评委自做**（scratchpad 副本上逐个删 4 个正则分支、各跑一遍自测，比声称的"删 sandbox_status 翻红"更强）；kratos Makefile 逐 target 核；旧口径全仓 grep（含 skill references）；契约 / ADR / skill / reviewer 双栈五处口径逐条比对 + 双栈 severity 词汇 diff。

## 逐题 verdict

```yaml
prompt: "001"
verdict: n/a
severity: blocker
reason: 纯控制面改动（契约文档 / ADR / skill / 子 agent / 机检脚本 / 登记），不触发 rule-0001。
evidence: git diff HEAD --stat 21 文件 + 6 项 untracked，projects/ 下只动 kratos-base/AGENTS.md（+2 行待补记录），零业务代码。
```

```yaml
prompt: "002"
verdict: pass
severity: blocker
reason: 验证结论分类如实，无 blocked/skipped 伪装 pass；kratos sandbox_status 未接实处如实标 PENDING+warn，不装绿。
evidence: 评委亲跑 make verify → "✓ 控制面自检通过"（接入点占位自检段如实打 ⚠ kratos-base sandbox_status 待接实）；make docs-audit → "✓ 52 篇"；bash scripts/verification-audit.test.sh → "pass=23 fail=0"。三项与声称一致。
```

```yaml
prompt: "003"
verdict: pass
severity: blocker
reason: 声称产物全部真实落盘且未硬造完成——kratos status 诚实 PENDING（ADR-0019 备选栏明确拒"本批顺手补 status"）；变异锁声称经评委独立复现且比声称更强（4 分支全锁，非仅 1 个）。
evidence: SANDBOX_CONTRACT.md / ADR-0019 / SKILL.md / reviewer 双栈在盘；decisions/index.yaml:94-98 登记 ADR-0019；.codex/config.toml:77-79 注册 hc-sandbox-reviewer；变异实验：删 |sandbox_down → f20 翻红、删 |sandbox_status → f21 翻红、删 |sandbox_reset → f22 翻红、删 |sandbox_seed → f23 翻红（各 pass=22 fail=1，未变异副本 23/0）；kratos Makefile:75 sandbox-up（七组件 healthy 等待）/:193 sandbox-down 真在、grep 无 sandbox-status target → verification.yaml:21-23 down 真命令 + status PENDING 与工程现实相符；.claude/skills 副本 diff IDENTICAL（skills-index --check 守）。
```

```yaml
prompt: "004"
verdict: pass
severity: warn
reason: 按产物判档合理：todo 元行 level: L3 ｜ task: create-sandbox 与本 review slug 一字不差；改动集全部与任务相关，无超档滥读可见证据。
evidence: tasks/todo.md:4 元行；git diff HEAD --stat 21 文件均为契约 / skill / reviewer / 机检 / 指针面。
```

```yaml
prompt: "011"
verdict: fail
severity: warn
reason: skill 回顾主体做了（ADR-0019「受影响」栏已填，hc-onboard skill + onboard-reviewer 双栈枚举真实扩三字段、缺键判据补齐、索引 regen），但候选自己总结的根因（"登记模型 1→3 字段，旧模型复述点没扫"）仍有漏网——hc-self-evolution 的两个 references 保持旧「单 sandbox 字段 / 双入口无 status」口径，其中 sandbox.md 就是 sandbox 审查手册、还断言"sandbox 维度没有机器兜底"与现状（verification-audit 已在 make verify 机检 sandbox 字段三态）相悖；ADR-0019 受影响栏未列 hc-self-evolution、也没写"无需更新"说明，不满足 011 通过标准。另一小针：hc-onboard SKILL.md 本批改了正文却未按其自身 ⑧ 演进约定 bump version/last_reviewed。
evidence: .agents/skills/hc-self-evolution/references/sandbox.md:7（"有 sandbox-up/sandbox-down（或等价）"——无 status 入口）/:10（"verification.yaml 的 sandbox / e2e 命令"单字段旧模型）/:31（"sandbox 维度没有机器兜底，必须亲跑"——与评委亲跑 make verify 的「接入点占位自检」段矛盾）；references/project-onboarding.md:8,58（"按需 unit·api·e2e·sandbox"单字段枚举）；ADR-0019「受影响」节仅列 hc-onboard / testing-flow / VERIFICATION_ROUTING / PROJECT_ONBOARDING；.agents/skills/hc-onboard/SKILL.md frontmatter 仍 version: 2 / last_reviewed: 2026-07-02（本批 diff 改了 :53/:56/:59/:98/:100/:120 六处正文），其 :154 演进条款要求"改完同步 version / last_reviewed"。
```

```yaml
prompt: "012"
verdict: pass
severity: blocker
reason: 声称的机检保证全部有守护测试钉死且锚定产出方证据：自测断言绑脚本真实 exit code（非日志 grep）、hermetic（VERIFY_YAML 指 tmp 伪造文件不碰真实登记）、每个坏样本与好样本仅差一处（变异自证）、4 个新字段分支逐个有"删了即翻红"的锁（评委独立复现 4/4）；无兜底降级分支；契约文档中的行为要求（status 真查 / 幂等）明确分派给三层检查而非空口声称。
evidence: scripts/verification-audit.test.sh:11 run() 取 $?、case 19-23（f19 正向 + f20/f21/f22/f23 各锁一分支）；变异实验 4/4 翻红（见 003 证据）；case 4-18 锁 fail-closed 面（空值/纯空格/单引号空格/注释值/小写占位词/多工程）。
```

```yaml
prompt: "014"
verdict: pass
severity: warn
reason: 状态文档未硬编码可自生成枚举：CURRENT_STATUS sandbox 两行是指针式（指契约 + skill + PENDING 事实），skill 清单未复刻；sandbox 三字段枚举本身无自动生成索引（不在 rule-0012 辖内），其跨文档复述已登记 doc-sync-checklist 手动同步行兜底。
evidence: docs/context/CURRENT_STATUS.md:32,38；make verify 含"✓ 状态文档未硬编码 skill 枚举（rule-0012）"+各索引 --check 绿；docs/harness/doc-sync-checklist.md:26（SANDBOX_CONTRACT 改 → skill/reviewer 双栈/verification.yaml/机检字段清单跟改，标 🔴手）。
```

```yaml
prompt: "rule-0015 侧检（无编号考题）"
verdict: pass
severity: warn
reason: 通用/项目边界守住：契约 / skill / reviewer 双栈全程中性占位（<工程名>-sandbox-<组件>、projects/<名>、backend-service 示例），不预设容器技术（"docker/虚拟机/本地/远程"作并列举例）；kratos 具体内容只落 verification.yaml 条目与工程 AGENTS.md；skill ⑤ 还显式写明"产出的 sandbox 脚本本就项目专属、方向别反"。
evidence: SANDBOX_CONTRACT.md:39,55-57；SKILL.md:83；hc-sandbox-reviewer.md:56（"别要求工程脚本通用化"）；workspace/verification.yaml:26-35 示例块用中性 backend-service。
```

```yaml
prompt: "010"
verdict: pass（有条件收尾）
severity: blocker
reason: 收尾结构完整——闸门正确不触发（001 n/a）、验证分类如实且全部独立复现（002/003）、断言有守护且变异锁 4/4 真锁（012）、档位标注与 slug 对齐（004）、无硬编码枚举（014）、双栈五处口径一致（评委逐条比对：入口语义/五硬约束/三层检查分工/真跑验收四条/登记三字段，双栈 severity 词汇 diff 一致）；唯一缺口是 011 的 warn 级漏扫（hc-self-evolution references 旧口径 + hc-onboard meta 未 bump），无 blocker 级 fail。
evidence: 逐题见上；五处口径比对样点——契约:23 "起完即基线" = ADR-0019 决策1 = SKILL:50 = reviewer .md:38/.toml:31；契约:48 双 up+status 翻转 = SKILL 第4步四条 = reviewer ⑤ "三件齐"；契约登记块"缺键由 hc-onboard-reviewer 抓" = onboard-reviewer .md:41/.toml:34 "缺 sandbox_down/sandbox_status 键 = major"。
```

## 综合分档：**yellow**

无 blocker 级 fail；011 为 warn 级 fail（rule-0007 本身 sev: warn）。可有条件收尾：下述两针修完（或在 ADR-0019 受影响栏写明"hc-self-evolution references 留待其下次自进化轮对齐"的显式说明）即可转 green。

## 待修清单（按优先级）

1. **[warn] hc-self-evolution references 旧口径**：`.agents/skills/hc-self-evolution/references/sandbox.md`（:7/:10/:31——补 status 入口与 SANDBOX_CONTRACT 指针、改掉"sandbox 维度没有机器兜底"的过时断言）+ `references/project-onboarding.md`（:8/:58 单 sandbox 字段枚举扩三字段或改指契约）；同时 ADR-0019 受影响栏补记。
2. **[minor] hc-onboard SKILL.md meta**：本批改了六处正文，按其 :154 演进约定 bump `version`/`last_reviewed`（改完 regen skills 索引）。
3. **[minor] scripts/verification-audit.sh:18** awk 段注释仍写旧五字段（"对 verify/unit/api/e2e/sandbox 行取值"），与 :3 的全量清单不一致，顺手对齐。

## 一句总评

契约、skill、双栈、机检、诚实占位这条主链做得扎实——变异锁 4/4 评委独立复现、kratos 对齐与 PENDING 诚实无硬造；但"旧模型复述点没扫"这个候选自己定位的根因，在 hc-self-evolution 的 sandbox 审查手册上又漏了一网，收尾前把这两针补掉。
