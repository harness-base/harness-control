# decision — demote-context-loading（L3）

独立评委，只看证据。复核命令均在当前工作树（未提交）实跑。

## 逐题 verdict

```yaml
- prompt: "011"   # 改/删 skill 必须回顾并在 ADR「受影响的 skill」栏逐条声明（rule-0007）
  verdict: pass
  severity: warn
  reason: >
    本次属大改（写了 ADR-0011 + 删一个 skill）。ADR-0011 模板五栏齐全（背景/决策/受影响的 skill/备选方案/影响），
    「受影响的 skill（rule-0007）」栏如实填：context-loading=是/删 skill 壳降为政策；其余 7 个 skill
    （dev/test-case/prd-elicitation/doc-sync/add-rule/git-workflow/self-evolution）逐条=否+理由（本次只动
    context-loading、全面体检押后）。受影响栏列举的 7 个其余 skill 与当前实际 skill 清单逐一对齐、无遗漏。
    这正是本仓踩过的坑（ADR-0004 漏声明 context-loading → eval-011 blocker fail），本次未重蹈。
  evidence: >
    docs/decisions/0011-demote-context-loading.md L25-27；grep '^##' templates/adr.md 显示五栏；
    ls .agents/skills/ = add-rule/dev/doc-sync/git-workflow/prd-elicitation/self-evolution/test-case（7 个，与受影响栏一致）

- prompt: "014"   # 状态/索引文档不硬编码可自生成枚举（rule-0012）
  verdict: pass
  severity: warn
  reason: >
    删 skill 未引入硬编码漂移。skills-index 已 regen（.agents/skills/README.md 移除 context-loading 行）；
    CURRENT_STATUS 本次未改动，其 skill 一栏明文"以 .agents/skills/README.md 为准、--check 防漂移、此处不硬编码枚举"，
    故删 skill 自动随索引同步、无残留计数/清单。make verify 的 rule-0012 守门项「状态文档未硬编码 skill 枚举」通过。
    README.md 技能行属"举例 + 指向自动索引为准"，删 context-loading 举例后仍指 .agents/skills/README.md，合规。
  evidence: >
    make verify → "✓ 状态文档未硬编码 skill 枚举（rule-0012：指向自动生成索引）" + "✓ skills 目录无漂移"；
    git status docs/context/CURRENT_STATUS.md = 未改动；git diff README.md（举例删 context-loading，仍指自动索引）

- prompt: "004"   # context-loading-budget 政策降级后仍可达可用（rule-0004）
  verdict: pass
  severity: warn
  reason: >
    "读取量与任务风险匹配"政策在降级后入口更硬：AGENTS.md 启动顺序第 2 条（经 CLAUDE.md @AGENTS.md 永远自动加载）
    + rule-0004 双入口指向 docs/context/CONTEXT_LOADING.md（L0-L6 档位表保留）。比原 skill（需主动 invoke 才生效）
    更可靠。考题 004 测的是政策本身、不依赖 skill 存在，仍有效。本任务自身档位 L3 合理（读 ADR/AGENTS/索引/政策文件 +
    跑 verify，未全量通读）。顺带修了 CONTEXT_LOADING.md L4 档引不存在的 docs/architecture/（改为"待建"），减一处死引。
  evidence: >
    git diff AGENTS.md（启动顺序第 2 条 + rule-0004 双入口指 CONTEXT_LOADING.md）；
    git diff docs/context/CONTEXT_LOADING.md（L0-L6 表保留、L4 行修死引）；docs/eval/prompts/004 不依赖 skill

- prompt: "010"   # 任务收尾综合评审（rule-0005）
  verdict: pass
  severity: blocker
  reason: >
    综合达标。闸门(001)：纯控制面/文档/skill 改动，不触发需求包，n-a。验证(002/003)：make verify 全绿、
    make docs-audit 32 篇通过，有真实命令输出，非声称。断言(012)：本任务无 e2e；唯一真实信号是
    skills-index --check + docs-audit + rule-0012 守门，均产出方机检、无访问日志回显假阳性。档位(004)：合理。
    skill(011)：大改已回顾并 ADR 逐条声明。删除干净：context-loading 目录已不存在、git grep 残留全部为历史
    （旧 ADR 受影响栏/lessons/features/plan/self-evolution 讲过去案例=应保留），活引用（README/rule-0004/
    process-coverage）已全部 rewire，无悬空。
  evidence: >
    make verify "✓ 控制面自检通过"；make docs-audit "✓ 32 篇"；ls .agents/skills/context-loading = No such file；
    git grep -i context-loading 分类核对：活引用已改、历史保留
```

## 综合分档

**green**

## 一句总评

降级干净、入口比 skill 更硬，最关键的 011（删 skill 须在 ADR 受影响栏逐条声明）正面避开了本仓 ADR-0004 踩过的坑——受影响栏 8 个 skill 全声明、与实际清单对齐；rule-0012 守门 + skills-index regen 保证删 skill 不引漂移；活引用全 rewire、历史保留、verify/docs-audit 双绿。可收尾。

## 给用户的提示

无 blocker。两点观察（不影响 green，供参考）：
1. ADR-0011 在「决策 3」与「影响」均把"其余 skill 全面体检"标为押后——这是一张显式开口的待办，建议落进 tasks/todo 或后续 feature，别让它只活在 ADR 里。
2. CONTEXT_LOADING.md L4 档现写"架构级文档 docs/architecture/ 待建"——与 CURRENT_STATUS 里"architecture 暂未建（drift 区已弃，见 ADR-0006）"一致，措辞自洽；若 architecture 最终确定不建，这条档位描述未来应再收一次口径。
