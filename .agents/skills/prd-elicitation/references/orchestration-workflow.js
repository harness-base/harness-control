// prd-elicitation 编排模板（reference）。产品总监(主 agent)拿它当总谱、按需改后用 Workflow 跑。
// 确认门是人在环断点——Workflow 跑不了交互。实际用法 = 总监【分两段跑】：
//   段一 Gather+Stories(轻审收敛) → 返回 user-stories.md 给用户 approved；
//   段二 Produce+Review → 返回整套给用户收尾确认。本模板写在一起、用注释标确认门。
// 输入 args = { id:'<prd-id>', brief:'<采集到的原始材料/对话摘要>', needResearch:bool, needPrototype:bool }

export const meta = {
  name: 'prd-orchestration',
  description: 'prd-elicitation 编排模板：产品总监调度 worker 产出 用户故事→PRD→原型，带权重/确认门/review loop',
  phases: [
    { title: 'Gather', detail: '需求采集 + 可选外部调研' },
    { title: 'Stories', detail: '用户故事+AC + 轻审 loop' },
    { title: 'Produce', detail: '并行产出 PRD/功能点/原型' },
    { title: 'Review', detail: 'PRD 审稿重审 loop' },
  ],
}

const REVIEW = {
  type: 'object', additionalProperties: false,
  required: ['clean', 'findings'],
  properties: {
    clean: { type: 'boolean' },
    findings: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['worker', 'severity', 'issue', 'fix'],
      properties: {
        worker: { type: 'string', enum: ['user-story-writer', 'prd-writer', 'feature-point-writer', 'prototype-builder'] },
        severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
        issue: { type: 'string' }, fix: { type: 'string' },
      },
    } },
  },
}

const id = (args && args.id) || '<prd-id>'
const dir = 'docs/prds/' + id

// ── 必选：需求采集 ──
phase('Gather')
const reqs = await agent(
  '你是需求采集员。把下面原始材料理成结构化需求摘要(JTBD/页面/数据/四态/边界/验收/非目标)+待确认清单。不静默假设。\n材料：' + ((args && args.brief) || ''),
  { agentType: 'requirements-gatherer', label: 'gather' })

// ── 可选·权重低：外部调研(用户要查 / 有市场 SOP 且摸不透才跑;复用 deep-research) ──
let research = ''
if (args && args.needResearch) {
  research = await agent('对这个需求做外部调研(市场 SOP/事实)，过 rule-0008 验收后给带来源的要点。需求：' + reqs,
    { label: 'external-research' })
}

// ── 必选：用户故事+AC，轻审 loop(≤2 轮，只盯地基四项) ──
phase('Stories')
let stories = await agent(
  '你是用户故事+AC 员。把需求摘要写成 ' + dir + '/user-stories.md(US-NN + 可观测 AC)。\n摘要：' + reqs + (research ? '\n外部要点：' + research : ''),
  { agentType: 'user-story-writer', label: 'write-stories' })

for (let round = 0; round < 2; round++) {
  const rv = await agent(
    '你是 PRD 审稿员【轻审地基模式】。审 ' + dir + '/user-stories.md 四项：AC 可观测/故事完整/内部一致/对齐采集。clean=true 表示无问题。',
    { agentType: 'prd-reviewer', label: 'light-review:' + round, schema: REVIEW })
  if (rv.clean || !rv.findings.length) break
  stories = await agent(
    '你是用户故事+AC 员。按审稿发现修 ' + dir + '/user-stories.md：\n' + JSON.stringify(rv.findings),
    { agentType: 'user-story-writer', label: 'fix-stories:' + round })
}
log('用户故事+AC 轻审收敛 → 确认门：总监把 user-stories.md 交用户 approved 再往下')

// ════ 确认门(人在环)：用户 approved user-stories 后才继续(总监在此停 / 本段作段一返回)。 ════

// ── 必选并行：PRD 本体 ∥ 功能点 ∥ 可选原型(权重中) ──
phase('Produce')
const produced = await parallel([
  () => agent('你是 PRD 本体员。按已确认 ' + dir + '/user-stories.md 写 ' + dir + '/prd.md(套 templates/prd.md，四态/范围闭合/验收可观测)。',
    { agentType: 'prd-writer', label: 'prd' }),
  () => agent('你是功能点清单员。写功能点 + US↔FP↔正文 映射(基于 ' + dir + '/user-stories.md 与 prd.md)。',
    { agentType: 'feature-point-writer', label: 'fp' }),
  ...((args && args.needPrototype) ? [() => agent('你是原型员。按 ' + dir + ' 的故事/PRD 产可点原型到 ' + dir + '/prototype/。',
    { agentType: 'prototype-builder', label: 'prototype' })] : []),
])

// ── 必选：PRD 审稿重审 loop(框住并行产出；loop-until-dry；只重跑被审出问题的 worker) ──
phase('Review')
let dry = 0
while (dry < 1) {                       // 连续 1 轮干净即停(要更严可加大)
  const rv = await agent(
    '你是 PRD 审稿员【重审下游模式】。审整套(' + dir + ' 的 stories+prd+功能点+原型)：PRD 合故事/FP 映射齐/原型可点/四态/范围闭合。clean=true 表示无问题。',
    { agentType: 'prd-reviewer', label: 'heavy-review', schema: REVIEW })
  if (rv.clean || !rv.findings.length) { dry++; continue }
  dry = 0
  const byWorker = {}
  for (const f of rv.findings) { (byWorker[f.worker] = byWorker[f.worker] || []).push(f) }
  await parallel(Object.keys(byWorker).map(w => () =>     // 回原 worker 角色重跑，只跑有问题的
    agent('你是 ' + w + '。按审稿发现修你产出的部分(' + dir + ')：\n' + JSON.stringify(byWorker[w]),
      { agentType: w, label: 'fix:' + w })))
}
log('整套 PRD 重审收敛 → 收尾确认：总监把整套交用户最终确认')

// ════ 收尾确认(人在环)：总监把整套交用户最终确认。 ════
return { id, stories, produced }
