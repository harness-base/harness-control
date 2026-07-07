# 当前任务

> 只记手头这一件事；干完清空、旧的 roll 进 `archive/`。保持轻。
> 元：level: L2 ｜ task: hc-onboard-split

## 当前：hc-onboard SKILL.md 拆分（158 行 → SKILL 薄壳 + references 分支细节）
- **动因**：hc-onboard 158 行、全塞一个 SKILL.md（无 references、无 per-step 子 agent），是所有 skill 里最长的异类。交互式引导没法拆成并行 worker，正确拆法 = hc-prd 式的 `references/`。
- **硬约束（侦察出）**：hc-onboard-reviewer 双栈用语义锚点引用「新 7 步第 5 步 / 老 8 步第 6 步 / ⑥ 总览」，历史栽过指针漂移（eval decision.md:77）→ **步骤编号原样保留、⑤⑥⑦ 留 SKILL.md**，只搬每步「问/确认/落」细节。
- [x] 建 `references/new-project.md`（③ 7 步细节，47 行）+ `references/old-project.md`（④ 8 步细节 + 老分支铁律/红线，48 行）
- [x] 重写 SKILL.md：留 frontmatter/intro/①②/③④骨架(标题+一句+指针,保步号)/⑤⑥⑦/⑧/footer；version 3→4、last_reviewed 07-07。**158→92 行(-42%)**
- [x] skills-index --check（不漂）+ make verify（绿）+ docs-audit（54 篇过）
- [x] 对抗验证（workflow 4 镜头并行）：内容零丢失 clean / reviewer 指针零断裂 clean / 薄壳独立完整 clean / 加载时机 1 minor
- [x] 修 minor（② 分流两条岔路的 read-reference 指针提出来加粗，与 ③④ 醒目度对齐）→ skills-index 不漂 + make verify 绿

## Review（hc-onboard-split）
- **做了什么**：hc-onboard SKILL.md 158→92 行(-42%)，③新7步/④老8步细节搬进 `references/{new,old}-project.md`；步号原样保、⑤三态/⑥评审判据/⑦硬规则留 SKILL.md（reviewer 双栈指着它们）。version 3→4。
- **对抗验证的价值**：命门（内容零丢失 + reviewer 指针零断裂）两镜头 clean——历史栽过一次"reviewer 回指落空"的同款坑，这次专门 fan-out 查、守住了；仅 1 minor（醒目度）已修。
- **质量**：四道机检闸全绿（skills-index/verify/docs-audit）；渐进披露正确（分支点加粗指示 read-reference，playbook 不静默丢）。
- **收尾 eval**：**green 一把过**（`docs/eval/task-reviews/20260707T083442Z-hc-onboard-split/`；011 pass[version bump+⑧演进+reviewer 双栈五类步号锚点逐条解析]、014 n/a[没碰状态/索引文档]、010 pass[评委字节级 diff：③④明细↔references 逐字节一致、⑤⑥⑦与旧版 IDENTICAL、三机检独立复现绿]、rule-0015 pass[references 零项目领域词]）。
