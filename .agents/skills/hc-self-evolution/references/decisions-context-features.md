# decisions / context 审查手册

> 规范检查层用。审「决策记录（ADR）/ 当前状态（context）」两区是否真实、一致、不漂移。原第三区「需求账本 features」已退役（ADR-0023，需求侧由 `docs/prds/` 承接）；文件名保留旧称不改。
> 红线口吻，逐条可判。给的命令都能从 harness 根直接跑。
> 产物三账本（`docs/prds` / `docs/designs` / `docs/test-cases`，各有 index.yaml + 专属 audit 硬闸）**不在本手册范围**——这里只管 decisions / context 两区。

## 规范（健康长什么样 / 不变量）

- **每区有索引，索引即真相骨架**：`docs/decisions/index.yaml` 登记每条目的 id/title/file。清单 / 计数一律**以 index 为准**、不在别处复刻（rule-0012）。
- **index ⇄ 目录双向一致**：index 登记的 `file` 都在目录里存在；目录里的每个 `NNNN-*.md` 都被 index 登记。无孤儿、无幽灵。decisions 区由 `scripts/index-audit.sh` 机检（已挂进 `make verify`）。
- **大改必有 ADR，且被按号引用**：架构/接口/机制级变更要有 `docs/decisions/NNNN-*.md`；ADR 编号 `ADR-NNNN` 是稳定引用键，被 plan / skill / eval review 按号引用，不复制正文。现存条目以 `docs/decisions/index.yaml` 为准（已滚动到 ADR-0023，别在文档里硬编码总数）。
- **ADR 用模板、栏不缺**：照 `templates/adr.md`，背景/决策/**受影响的 skill（rule-0007）**/备选/影响齐全。「受影响 skill」栏不许空（大改尤其）。
- **context 反映真实状态、不漂移、不硬编码枚举**：`docs/context/CURRENT_STATUS.md` 的 frontmatter `last_updated` 与正文（阶段、各区状态）必须跟代码/index 当前事实对齐；凡已有自动索引的清单（skill / 规则 / ADR / 子 agent），正文只写「以该自动生成索引为准」的指针、不复刻计数清单（rule-0012）。`docs/context/README.md` 是 `dir-index.sh` 自动生成、禁手改。
- **`docs/features/` 已退役**（ADR-0023，需求侧由 `docs/prds/` 承接）：审查时发现活文档仍引用 features / rule-0001 = 漂移。

## 怎么检索现状（能直接跑）

```bash
cd "$(git rev-parse --show-toplevel)"

# 两区索引与目录
cat docs/decisions/index.yaml
ls docs/decisions/*.md

# context 真实状态 + 自动索引
cat docs/context/CURRENT_STATUS.md
cat docs/context/README.md          # dir-index.sh 生成，禁手改

# index ⇄ 目录双向一致（机检；同款检查已在 make verify 里）
bash scripts/index-audit.sh docs/decisions

# ADR 是否被按号引用（每条 ADR 至少应在引用方出现一次）
git grep -oE 'ADR-[0-9]{4}' | grep -v '^docs/decisions/' | sort | uniq -c

# context README 漂移 / docs frontmatter 引用通不通
bash scripts/dir-index.sh docs/context --check
bash scripts/docs-audit.sh
```

**注意（已核实的机器检查边界）**：
- `make verify`（`verify-control-plane.sh`）现在兜住的：decisions 的 **index ⇄ 目录双向一致**（`index-audit.sh`，正反向都查）；CURRENT_STATUS 的 **skill 行硬编码枚举**（rule-0012 专检：`.agents/skills/` 行列举 ≥4 个真实 skill 名即红）；`dir-index --check` 覆盖 `docs/context|docs/harness|templates|.claude/agents` 的 **README 漂移**。产物三账本另有 `prds-audit / designs-audit / test-cases-audit` 硬闸、接入点三态有 `verification-audit`——都进 make verify（早期只有 PRD 区有机检的状态已成历史）。
- 机器仍兜不住的：**CURRENT_STATUS 除 skill 行外的内容真实性**（阶段描述、各区状态、`last_updated` 新不新）靠人判；`docs-audit.sh` 只查 frontmatter 的 `source_files/related_docs` 路径在不在，不查 index 登记。

## 怎么判（逐条可判定）

- **index 漏登记 / 幽灵条目**：`index-audit.sh <dir>` 非零退出即 fail。目录有文件 index 没登 = 漏登记；index 登了目录没文件 = 幽灵。两者都 fail。
- **大改没落 ADR**：本轮改了架构/接口/加载机制/脚本骨架，但 `docs/decisions/` 没新增 ADR、index 没登记 → fail（blocker 级，触 rule-0007 精神）。
- **ADR 没被引用 / 引用悬挂**：`git grep ADR-NNNN`（排除自身目录）为空 = 写了没人按号引用，形同孤本；引用指向不存在的 ADR 号 = 悬挂。
- **ADR 缺「受影响 skill」栏**：`grep -niE '受影响|skill' docs/decisions/NNNN-*.md` 命中不到那一栏（或栏在但空着）→ fail。这是 eval-011 的直接判失败口径。
- **context 漂移 / 硬编码枚举**：正文对某区的状态描述 ≠ 当前事实，或 `last_updated` 早于正文已描述的最新阶段 → fail；正文复刻本应指向自动索引的清单 / 计数（skill / 规则 / ADR 整列枚举，举 1–2 例豁免）→ fail（rule-0012；skill 行有机检、其余行人判）。对照锚点：ADR 清单看 `docs/decisions/index.yaml`、规则清单看 `docs/rules/index.yaml`（`rules-index.sh` 自动生成）。
- **「全保留 / 完全一致」无 diff 证据**：ADR/总结出现绝对措辞却不贴逐条 `git show HEAD:<file>` 对比 → 高度可疑，按偷改对待，逐条核。

## 常见漏洞模式（本仓真实案例）

- **context 漂移（2026-06-27 写本手册时实测的活样本；后已修，并催生 rule-0012）**：`docs/context/CURRENT_STATUS.md` `last_updated: 2026-06-11`，但正文已描述 S6（2026-06-23 落地）；控制面表仍写「8 条规则（rule-0001~0008）」「ADR-0001 奠基设计」「`docs/features/` skeleton 空账本」，而当时实际是 11 条规则、5 条 ADR、6 个 features 全 done。典型「内容往前跑、状态页没跟」——skill 清单前后三次漂移，教训晋升成 rule-0012（状态文档不硬编码可自生成枚举），skill 行枚举现已有机检兜。
- **大改没把 ADR 栏填全 = 判失败**：`docs/eval/task-reviews/20260626T014408Z-harness-rules-distribution/`（verdict yellow）——ADR-0004 是大改（重写 AGENTS.md / 删全部规则文件 / 换加载机制 / 新建 scanner），却漏掉 `templates/adr.md` 强制的「受影响的 skill（rule-0007）」栏，`context-loading` 未回顾未声明 → eval-011 直接 **blocker fail**（「做了没记」=没履行）。
- **凭记忆迁移、没对源核（catalog/索引指针造假）**：同一评审 + `tasks/lessons.md`「2026-06-26：声称『保留/不变』凭记忆没对源核」——ADR 写「severity / eval 映射全保留」，实际偷偷把 rule-0007 severity warn→blocker、给 rule-0005/0006/0008 编了不存在的 eval 指针（005/006/008）。教训：凡声称「X 保留/不变」必须 `git show HEAD:<file>` 机械核对再写。

## 修复用哪个操作 skill / 脚本

- **补 / 改 ADR**：照 `templates/adr.md` 起草（别手搓省「受影响 skill」栏），写 `docs/decisions/NNNN-*.md`，登记进 `docs/decisions/index.yaml`，跑 `bash scripts/index-audit.sh docs/decisions` 防漂。大改连带回顾 `.agents/skills/` 并在该栏逐条写（已改写已改 / 不需改写「无需更新+理由」）——rule-0007。
- **需求侧修复入口**：`hc-prd`（编排式产出需求，落 `docs/prds/`；与实现松耦合，指路提示、非门禁）。
- **修 context 漂移**：直接改 `docs/context/CURRENT_STATUS.md`（含 `last_updated` + 正文事实）；清单类内容改成「以自动生成索引为准」的指针而非复刻（rule-0012）。然后 `bash scripts/dir-index.sh docs/context` 重生成 README、`bash scripts/docs-audit.sh` 复核引用。
- **固化 / 加红线**：用 `hc-add-rule` skill——它已是规则**加 / 改 / 删的统一入口**（ADR-0020：带规则关联对照表 + `hc-rule-reviewer` 巡查）。「index⇄目录一致」这类机器门禁 decisions 已由 `index-audit.sh` 挂进 make verify；新账本可仿 `prds-audit / designs-audit / test-cases-audit` 写校验挂进去。
- **自检收尾**：`make verify`（结构 + docs-audit + 索引漂移 + index-audit + 各账本 audit）、`make docs-audit`（frontmatter 引用通不通）；判断与归档走 `hc-self-evolution` skill（复杂时 spawn `hc-self-optimize` 子 agent）。
