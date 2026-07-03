# templates 维度 审查手册

> 链路：**标准产出该有模板 → 模板字段反映当前规范 → 起草时真用模板（不手搓省栏）**。任一环断 = 强制栏漂移、字段过期。

## 规范（健康长什么样 / 不变量）

- 每类**反复出现的标准产出**都有模板，全在 `templates/`，**清单以自动生成的 `templates/README.md` 为准（rule-0012，别在这硬编码枚举）**。老三样（`adr.md` / `feature-package.md` / `prd.md` 等）之外，ADR-0007~0019 陆续补齐：`user-story.md`（PRD 上游）、`design.md` + `api-contract.md`（hc-tech-design）、`e2e-test-case.md` + `api-test-case.md`（hc-test，格式契约被 `scripts/test-cases-audit.sh` 硬闸按字面解析）、`project-agents.md`（hc-onboard 工程入口规则）。
- 模板字段**反映当前规范**：规则一改（尤其新增强制披露栏），相关模板同步。例：`templates/adr.md` 必须有 `## 受影响的 skill（rule-0007）` 栏。
- 起草用模板、不手搓：ADR/feature/PRD/design/用例/skill 起草时从对应模板拷字段，省栏 = 漏强制项。
- 模板被操作 skill / worker 显式引用（投送），指针不悬空：`hc-prd` worker → `templates/prd.md` / `templates/user-story.md`；`hc-tech-design` → `templates/design.md` / `templates/api-contract.md`；`hc-test` worker → `templates/e2e-test-case.md` / `templates/api-test-case.md`；`hc-onboard`（经 `docs/harness/PROJECT_ONBOARDING.md`）→ `templates/project-agents.md`；需求包（rule-0001，`docs/features/README.md` 指引）→ `templates/feature-package.md`。
- `templates/README.md` 是**自动生成的索引**（`scripts/dir-index.sh templates`），禁手改、进 `make verify`。

## 怎么检索现状（命令可直接跑）

```bash
# 1. 模板清单 + 自动索引是否漂移（已进 make verify：verify-control-plane.sh 的 dir-index 循环）
ls templates/ templates/skill/
bash scripts/dir-index.sh templates --check

# 2. 谁引用模板（操作 skill / worker 子 agent 是否真把模板当起草源）
grep -rn "templates/" --include="*.md" .agents/skills .claude/agents docs

# 3. 强制栏漂移核心检查：哪些 ADR 连"受影响"段都没有（宽 grep，栏名已有变体见下）
grep -L "受影响" docs/decisions/00*.md   # 输出 = 缺段的 ADR；再人工核栏名是否合模板

# 4. feature 产出是否带模板强制字段
for f in docs/features/000*.md; do grep -c "delivery_status\|implementation_allowed" "$f"; done

# 5. 反查"有产出无模板"：列 docs/ 下反复出现的产出类型，比对 templates/
ls docs/eval/task-reviews/*/    # summary.md/decision.md/candidate.md —— 反复产出，但 templates/ 无对应模板
```

`templates/adr.md:16-17` 是受影响-skill 栏的源；`docs/decisions/0002`（line 109-112）的同名段是正确范例。

## 怎么判（逐条可判定）

- **缺模板**：某类产出在 `docs/` 反复出现（≥2 份、结构同形），`templates/` 却没有对应模板 → 缺口。当前已知：eval task-review 的 `summary.md`/`decision.md`/`candidate.md` 三联无模板。
- **字段脱规范**：模板里的强制栏与现行规则对不上——规则要求披露某项（如 rule-0007 受影响 skill），模板却没这一栏 → 漏洞（强制项无处可填，必被省）。
- **产出不依模板**：同类产出之间字段不齐——部分有强制栏、部分没（如 `grep -L` 抓到的缺栏 ADR），或栏名偏离模板字面（判据 grep 静默失灵）→ 手搓省栏的实锤。
- **索引漂移**：`dir-index.sh templates --check` 非零 → README 与目录不一致（手改了模板没重生成索引）。
- **指针悬空**：skill / 子 agent 里写的 `templates/xxx` 文件不存在 → 投送断。
- **注意**：机器门覆盖有限——`dir-index.sh --check` 只校验 README **是否漏列文件**；`prds-audit` / `designs-audit` / `test-cases-audit` / `verification-audit`（均进 `make verify`）管产物区**登记 / 覆盖 / 三态**，其中只有 `test-cases-audit` 真按模板格式契约解析（e2e / api 用例）。**"产出是否符合模板字段"整体仍无机器门**——字段脱规范、产出缺栏必须人工逐份判（ADR / PRD / design 尤其，这是本维度最大盲区）。

## 常见漏洞模式（本仓真实案例）

- **手搓省了强制栏**（已发生，最典型）：`tasks/lessons.md` 2026-06-26 条 + eval 评审 `docs/eval/task-reviews/20260626T014408Z-harness-rules-distribution/`（decision.md / summary.md）——架构大改改了 `hc-add-rule` skill，但 ADR-0004 漏掉 `templates/adr.md` 强制的"受影响的 skill（rule-0007）"栏，`context-loading` 也没回顾声明 → eval-011 直接判 **blocker fail**（"做了没记 = 没履行"）。lesson 的 prevention 明写：**ADR 用 `templates/adr.md` 起草别手搓省栏**。
- **同类漏洞的演化——修了实例、模式换壳再来**：旧的缺栏 ADR（0001 / 0003）已回填；但又漂出**栏名变体**——`grep -n "受影响" docs/decisions/00*.md` 可见 ADR-0017/0018 手写「## 受影响」、0019/0020 写「## 受影响（rule-0007）」，与模板栏名「## 受影响的 skill（rule-0007）」不一致 → 按模板字面 grep 的判据会把有段的误报成缺栏 / 把缺栏的漏掉。模板栏名是判据锚点，产出偏离字面 = 机检 / 判据静默失效。
- **缺模板导致格式各凭手感**：eval task-review 三联（summary/decision/candidate）无模板，新评审只能照抄旧目录，字段易漂。
- **字段过期**（防范类）：规则演进后模板没跟。判据 = 拿 `docs/rules/index.yaml` 里每条 blocker 规则，反查它要求披露的项在对应模板里有没有栏位。

## 修复用哪个操作 skill / 脚本

- **改/加模板**：直接编辑 `templates/<x>.md`（加强制栏、对齐规则字段），然后 `bash scripts/dir-index.sh templates` 重生成索引。
- **规则牵动模板**：用 `hc-add-rule` skill 落规则时，同步把"该规则需披露的项"加进相关模板的栏位（rule ↔ 模板字段成对维护）。
- **回填已发生的缺栏 / 栏名漂移**：按 `templates/adr.md` 统一成 `## 受影响的 skill（rule-0007）` 段（旧例 0001/0003 已回填；现存变体见 0017~0020），逐条写"已更新 / 无需更新+理由"。
- **补缺模板**：为反复产出（如 eval task-review 三联）新建 `templates/<x>.md`，纳入 `dir-index.sh` 索引，并在产出该物的 skill / 评委文档里引用它。
- **收口**：`make verify`（含 `templates --check`）必须绿。
