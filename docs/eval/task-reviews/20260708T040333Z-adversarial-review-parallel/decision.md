# decision — adversarial-review-parallel（ADR-0022）

评委：hc-eval（独立、只看证据）。档位：L3。复核方式：自行 grep / git diff / read + 独立重跑 make verify、make docs-audit、tomllib 校验，未只信候选自报。

## 逐考题 verdict

```yaml
prompt: "011"
rule: rule-0007
verdict: pass
severity: warn
reason: >
  ADR-0022 存在、status accepted、已登记 index.yaml（make verify「decisions 索引一致」绿）。
  受影响 skill 栏 7 条全标「是」且逐条注明改动步（⑤/⑥/loop），独立核 7 个 SKILL.md
  review 步确实全部改为引用 pattern、非仅 version bump；7 skill 全 version+1、
  last_reviewed=2026-07-08。8 reviewer×双栈（16 文件）加「并行对抗编排」定性、
  Claude/Codex 对等、TOML 全合法。hc-doc-sync-reviewer 排除有据（钩子驱动、非产出型
  skill 评审步）且双栈均实测未引用 pattern。ADR reviewer 计数=8、无「9」残留。
evidence: >
  grep -rl adversarial-review → 7 skill + 16 reviewer + CURRENT_STATUS/README/checklist；
  git diff 版本行=7 处 version+1；ADR line 26/36「8 个 reviewer」；
  grep hc-doc-sync-reviewer 双栈无 adversarial 引用；tomllib all valid。

prompt: "014"
rule: rule-0012
verdict: pass
severity: warn
reason: >
  状态文档做对了：CURRENT_STATUS 用「所有产出型 skill…单一真相源
  docs/harness/adversarial-review.md」指针，未硬编码 reviewer 清单/计数，且保留原
  skill「以 README 为准、不硬编码枚举」口径；make verify「状态文档未硬编码 skill 枚举
  (rule-0012)」绿。harness/README 仅加一行目录项（dir-index --check 无漂移）。
  无自动生成索引被复刻成枚举/计数。
evidence: >
  git diff docs/context/CURRENT_STATUS.md（指针写法）；make verify: ✓ rule-0012 +
  ✓ docs/harness 索引无漂移 + ✓ skills 目录无漂移。
note: >
  minor（非 fail）：7-skill 清单现同时出现在 pattern doc line 13 + ADR 受影响栏 +
  doc-sync-checklist（3 份），无 --check 守。当前无「引用 pattern 的 skill」自动索引，
  故不触 rule-0012 判失败；但属软漂移源——新增/移除引用 skill 时 3 处需手改。
  doc-sync-checklist 那条正是漂移闸，缓解了大半；建议 pattern doc 改「引用清单见
  doc-sync-checklist」收敛到 1 份，或加轻量 --check。

prompt: "010"
rule: rule-0005
verdict: pass
severity: blocker
reason: >
  收尾整体质量达标。① 单一真相源真抽真引用：7 skill review 步均写「引用不复制」
  并指向 adversarial-review.md，未各抄一份措辞（消除必漂）。② 双栈中性真中性：
  pattern §双栈中性 + 各 skill/reviewer 均同时讲 Claude(Workflow)/Codex(原生多 agent
  max_threads)、不偏袒。③ 无假完成：独立重跑 make verify 绿、docs-audit 56 篇过、
  skills-index 不漂、8 reviewer×双栈 TOML 合法——非仅采信自报。④ 无残留单线程矛盾：
  两处明写「单 reviewer 线性 loop」(hc-tech-design⑥/hc-onboard⑥) 已实质升级（还
  正确区分「设计对话不可拆并行 vs 评审步多视角并行」）；hc-test line 49 矛盾已解
  （「写用例单 worker」与「审步多视角并行」分列、明写「不是单 reviewer 一遍过」）。
  ⑤ dogfood 自报的 3 处修复其产物均可核（ADR「8」不「9」/hc-test:49/pattern 第5条伸缩）。
evidence: >
  make verify → ✓ 控制面自检通过（含 rule-0012/索引/账本全绿）；
  make docs-audit → ✓ 56 篇；git diff hc-tech-design/hc-onboard/hc-test review 步；
  grep「单 reviewer|单线程|一遍过|线性 loop」review 步无残留矛盾。

prompt: rule-0015
verdict: pass
severity: warn
reason: >
  pattern 机制与示例全中性（correctness/契约对账/安全/覆盖/可观测…均为通用维度），
  无 tenant_id/领域名词/业务规则；8 reviewer 双栈定性行亦中性。
evidence: >
  grep tenant|kratos|租户|订单|支付… → pattern/ADR 无领域词泄漏。
note: >
  minor（非 fail，warn 级）：pattern doc line 15 立意句引「本仓 kratos S4-S6 实证、
  36+ 真问题」——项目名出现在 harness 资产里。属佐证性/轶事（非嵌入式项目假设，不影响
  pattern 可复用性），与既有 lessons/self-evolution references 引用一致。ADR 引项目名
  可接受（ADR 本就记上下文）；pattern doc 作可复用资产，建议弱化为「本仓实证」去项目名。
```

## 综合分档：green

L3 harness 架构改动，收尾质量高：单一真相源真抽真引用（7 skill 不复制、消除必漂）、
双栈对等真中性（16 reviewer 文件对等 + TOML 全合法）、ADR 受影响栏与实际一一对应
（7 skill×version+1 + 8 reviewer，排除项讲清且实测排除）、机检独立重跑全绿、无假完成、
无残留单线程矛盾（两处明写「单 reviewer loop」+ hc-test:49 均已实质升级）。

两条 warn 级 minor（不阻断收尾）：
1. 7-skill 引用清单三处重复（pattern+ADR+checklist）无 --check——软漂移源，checklist
   已兜大半，建议收敛到 1 份或加轻量守。
2. pattern doc 立意句含「kratos」项目名——佐证性、不破坏可复用性，建议去项目名。

## 给用户一句话提示

可收尾（green）。两条 warn 级小尾巴择机清：pattern doc 里的 7-skill 清单收敛到单处（或
加 --check）、立意句去掉「kratos」项目名以守 rule-0015 的资产项目无关性；均不阻断本次合入。
