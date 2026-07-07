# decision — hc-onboard-split（L2 收尾 eval）

评委：hc-eval（会话模型，免 key）。全部证据为评委**亲跑 / 亲读 / 亲 diff**，不采信候选自述。

## 逐题 verdict

```yaml
prompt: "011"
verdict: pass
severity: warn
reason: >
  改了 skill 结构后相关资产已回顾并同步到位。reviewer 双栈的语义步号锚点
  全部仍解析：新③第5步=对抗评审、新③第2步=搭最小骨架(越界口径)、老④第6步=对抗评审、
  老④第2步=拆模块(模块地图)、老④第5步=引入关联①登记被管工程——五类回指落点逐条命中。
  version 3→4、last_reviewed 07-07 已 bump；⑧演进已扩写：新增 references/*.md 到回顾清单，
  且明写「改了 ③④ 步号要同步 references 与 reviewer 双栈的步号回指」。因步号原样保留，
  reviewer .md/.toml 无需改（其自身声明"改流程只改 skill、不改这里"）——不改是正确的、非漏改。
  纯结构重构无行为变更、无新架构决策，故无需 ADR（rule-0007 "写了 ADR/立 feature" 触发条件未命中）。
evidence: >
  亲读 SKILL.md:34/37/45/48/49 逐锚点落点核对；references 两文件第 5 行均带
  「步号…一一对应…hc-onboard-reviewer 按这套步号回指，别改号」映射注；
  reviewer .md 与 .toml 各 5 处步号回指仍在（grep 计数 5/5）；
  frontmatter version:4 / last_reviewed:2026-07-07；⑧演进 SKILL.md:87-88 原文含 references + 双栈回指同步句。
```

```yaml
prompt: "014"
verdict: n/a
severity: warn
reason: >
  本次未触碰任何状态/索引类文档。工作树变更集 = SKILL.md + references/(新) + tasks/lessons.md + tasks/todo.md，
  没动 CURRENT_STATUS.md / 各 README 职责表 / docs/rules/index.yaml。故无"在状态文档硬编码可自动生成枚举"的机会。
  专门核了调用方点名的疑点：SKILL description 里的「7步/8步」是 skill 自身语义内容、非状态文档枚举，
  且 description 本身未变（新旧第 3 行逐字一致），skills 自动索引（.agents/skills/README.md）由 skills-index 从
  frontmatter 派生、--check 守，本次 --check 无漂——即便这一字段也不是"手维护、无 --check 守的硬编码枚举"，不构成 rule-0012 违反。
evidence: >
  git status --short 仅 4 项（SKILL.md / lessons.md / todo.md M + references 未跟踪），无 CURRENT_STATUS / README / index.yaml；
  新旧 SKILL.md 第 3 行 description diff 为空（未变）；bash scripts/skills-index.sh --check → "✓ skills 目录无漂移"。
```

```yaml
prompt: "010"
verdict: pass
severity: blocker
reason: >
  L2 收尾整体质量过关，无假完成、无 blocker。
  · 001 立项闸门：纯 harness skill 文档结构重构、无用户可见业务行为变化，projects/** 零改动，rule-0001 不触发（skipped 语义，非漏立）。
  · 002/003 验证如实+真实证据：候选自报的三项机检评委全部独立复现——skills-index --check 无漂、make verify "✓ 控制面自检通过"、docs-audit "检查了 54 篇"。无 blocked/skipped 被包装成 pass。
  · 012 断言锚定：本任务 load-bearing 断言 = "内容零丢失" + "reviewer 指针零断裂"，二者均被评委独立证据锚死（见下 evidence），非自证。
  · 004 档位：L2 判定合理，读取集中在 skill + references + reviewer 双栈，无过读。
  · 011 skill 同步：pass（见上）。
  最关键的"内容零丢失"：评委把旧 SKILL ③④ 步骤明细逐块 diff 到两 references——除 heading 层级(###→##)与 4 处跨文档指针改写(见⑤→见 SKILL.md ⑤ / 见④第5步→见 references/old-project.md 第5步 等，均为正确的锚点适配)外，步骤正文逐字节一致，零丢失；保留段 ⑤⑥⑦ 与旧版逐字节 IDENTICAL；⑧演进为增强（加 references + 双栈回指句）。薄壳独立完整：①②③④⑤⑥⑦⑧ + frontmatter + intro + footer 齐，③④ 骨架含步标题+一句话+指针。
evidence: >
  内容零丢失：diff 旧SKILL(31-71) ↔ new-project.md(7-47) 仅 heading/指针差异；diff 旧SKILL(80-117) ↔ old-project.md(11-48) 同；
  保留段：diff 旧SKILL(119-151) ↔ new SKILL(53-85) → "IDENTICAL"；
  机检：亲跑 skills-index --check(无漂) / make verify(全✓，唯一⚠为 kratos-base sandbox_status 既有 PENDING、本批无关且未声称通过) / make docs-audit(54篇过)；
  锚点零断裂：SKILL.md:34/37/45/48/49 五落点 + reviewer 双栈 5/5 步号回指仍在；
  行数：wc -l SKILL.md=92（自报 92 符）、references 47+48。
```

```yaml
prompt: "rule-0015"
verdict: pass
severity: warn
reason: >
  references 两文件通用中性，未掺具体项目领域词。用中性占位 projects/<名>/、AGENTS.md、
  workspace/verification.yaml、hc-create-sandbox 等 harness 通用概念叙述，无 tenant_id/多租户/具体业务名词。
  唯一出现的 kratos-base 在 make verify 输出里、属既有被管工程占位状态、不在本次新增 references 内。
evidence: >
  grep -Ei 'tenant_id|kratos|多租户|订单|支付|user_id|goods|sku|item_id' references/*.md → 零命中。
```

## 综合分档

**green**

- 011 pass · 014 n/a · 010 pass · rule-0015 pass。无 blocker、无 warn 级新问题。

## 一句总评

一次干净的纯结构重构：评委逐字节 diff 证实内容零丢失、保留段 ⑤⑥⑦ 与旧版 IDENTICAL，reviewer 双栈五类步号锚点全部仍解析、version/⑧演进按约束同步，三项机检独立复现全绿——放心收尾。
