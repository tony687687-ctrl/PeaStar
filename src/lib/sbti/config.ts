import type { Archetype, Dimension, DimensionId, Question, TestConfig } from './model'

const dimensions: Dimension[] = [
  { id: 'C', name: '掌控', leftLabel: '放手', rightLabel: '掌控' },
  { id: 'T', name: '情绪', leftLabel: '感性', rightLabel: '冷静' },
  { id: 'R', name: '现实', leftLabel: '理想', rightLabel: '现实' },
  { id: 'L', name: '社交', leftLabel: '内向', rightLabel: '外向' },
  { id: 'S', name: '秩序', leftLabel: '随性', rightLabel: '规矩' },
  { id: 'A', name: '表达', leftLabel: '含蓄', rightLabel: '直球' },
  { id: 'B', name: '边界', leftLabel: '共情', rightLabel: '边界感' },
  { id: 'D', name: '效率', leftLabel: '松弛', rightLabel: '效率怪' },
  { id: 'E', name: '风险', leftLabel: '保守', rightLabel: '冒险' },
  { id: 'F', name: '反馈', leftLabel: '回避', rightLabel: '对线' },
  { id: 'G', name: '消费', leftLabel: '节制', rightLabel: '享乐' },
  { id: 'H', name: '信念', leftLabel: '务实', rightLabel: '信仰派' },
  { id: 'I', name: '注意力', leftLabel: '发散', rightLabel: '专注' },
  { id: 'J', name: '自我', leftLabel: '自嘲', rightLabel: '自信' },
  { id: 'K', name: '干预', leftLabel: '不插手', rightLabel: '爱管' },
]

function likert(
  id: string,
  title: string,
  dim: DimensionId,
  leftHint: string,
  rightHint: string,
): Question {
  return {
    id,
    title,
    options: [
      { id: 'a', text: `更像：${leftHint}（强）`, effects: { [dim]: -2 } },
      { id: 'b', text: `更像：${leftHint}（弱）`, effects: { [dim]: -1 } },
      { id: 'c', text: `更像：${rightHint}（弱）`, effects: { [dim]: 1 } },
      { id: 'd', text: `更像：${rightHint}（强）`, effects: { [dim]: 2 } },
    ],
  }
}

const questions: Question[] = [
  likert('q1', '朋友说“随便吃点”，你脑子里会立刻生成表格吗？', 'C', '随便真随便', '我来给方案'),
  likert('q2', '群里突然吵起来，你第一反应是？', 'T', '先安抚情绪', '先捋清对错'),
  likert('q3', '听到“稳赚不赔”的机会时，你会？', 'R', '先心动再说', '先怀疑再查'),
  likert('q4', '公司团建自由麦环节，你通常是？', 'L', '假装在回消息', '直接拿麦'),
  likert('q5', '计划被临时改动，你更像？', 'S', '那就摆了', '重新排版'),
  likert('q6', '别人离谱发言时，你会怎么回？', 'A', '点到为止', '当场直说'),
  likert('q7', '朋友深夜长文倾诉，你会？', 'B', '陪着共沉沦', '先设边界再帮'),
  likert('q8', 'DDL 前 24 小时你的状态是？', 'D', '再等等灵感', '火力全开'),
  likert('q9', '看到“明天出发”的机票特价，你会？', 'E', '关掉页面', '立刻下单'),
  likert('q10', '被误会时你的处理方式？', 'F', '算了懒得解释', '必须说清楚'),
  likert('q11', '发工资当天，你的钱包走向？', 'G', '先存后花', '先奖励自己'),
  likert('q12', '重大决定你更信哪套？', 'H', '证据链', '感觉对了'),
  likert('q13', '做一件事时，你会？', 'I', '开十个窗口', '一路做到底'),
  likert('q14', '被夸“你真厉害”时，你会？', 'J', '别尬黑我', '谢谢我知道'),
  likert('q15', '看见别人流程明显有 bug，你会？', 'K', '尊重他人命运', '忍不住插手'),
  likert('q16', '你对“规矩”更像哪类？', 'S', '规矩是建议', '规矩就是规矩'),
  likert('q17', '关系里你最在意的是？', 'B', '互相感受', '边界清晰'),
  likert('q18', '冲突现场你更擅长？', 'F', '冷处理消失', '当场对线'),
  likert('q19', '做长期目标，你通常？', 'I', '随缘推进', '拆解到周'),
  likert('q20', '同伴拖延严重，你会？', 'K', '爱咋咋地', '我来推动'),
  likert('q21', '你有“控场冲动”吗？', 'C', '几乎没有', '一直在线'),
  likert('q22', '压力山大时你更像？', 'D', '先躺一下', '先把活清掉'),
  likert('q23', '在大群里你的形态通常是？', 'L', '潜水生物', '气氛担当'),
  likert('q24', '面对高风险高回报机会，你会？', 'E', '稳住别浪', '搏一把'),
  likert('q25', '你说话风格更接近？', 'A', '委婉拐弯', '直给输出'),
  likert('q26', '什么最能让你做决定？', 'H', '现实可行', '信念拉满'),
  likert('q27', '消费观更像哪边？', 'G', '理性克制', '快乐优先'),
  likert('q28', '吵架时你通常先？', 'T', '先感受受伤', '先定义问题'),
  likert('q29', '你的人生观更偏向？', 'R', '理想先行', '现实优先'),
  likert('q30', '你对自我评价更像？', 'J', '自嘲防御', '自信表达'),
  likert('q31', '朋友一句“你帮我安排下”，你会？', 'C', '你自己来', '交给我'),
]

const archetypes: Archetype[] = [
  {
    code: 'CTRL',
    name: '拿捏者',
    blurb:
      '你习惯把变量收进手里：流程、节奏、以及人的情绪。不是强迫症，是你真的看不惯失控。',
    vector: { C: 2, S: 1.5, D: 1.5, K: 1, T: 1, A: 0.5, I: 0.5 },
  },
  {
    code: 'FLOW',
    name: '随缘者',
    blurb:
      '你不抢方向盘，也不怕迷路。看似佛系，实则是“没必要的仗一场不打”。',
    vector: { C: -1.5, S: -1.5, D: -1, F: -1, I: -0.5, E: 0.5 },
  },
  {
    code: 'RAGE',
    name: '愤世者',
    blurb:
      '你对离谱行为有天然雷达，遇到不公会自动开麦。你不是暴躁，你只是忍耐额度偏低。',
    vector: { F: 2, A: 1.5, J: 0.5, B: -0.5, T: 1, C: 0.5 },
  },
  {
    code: 'HUST',
    name: '肝帝',
    blurb:
      '你松弛不了一点，把“先做完”当成情绪稳定器。别人靠深呼吸，你靠清任务。',
    vector: { D: 2, I: 1.5, S: 1, T: 1, G: -0.5 },
  },
  {
    code: 'ROMA',
    name: '浪漫派',
    blurb:
      '你是信念驱动型选手：现实重要，但如果没有热爱，再正确也像无聊。',
    vector: { H: 2, R: -1.2, T: -0.8, G: 0.8, E: 0.8 },
  },
  {
    code: 'REAL',
    name: '现实家',
    blurb:
      '你不爱听故事，更爱看结论：可执行、可落地、可复盘。浪漫可以有，先过预算表。',
    vector: { R: 2, T: 1.2, D: 0.8, H: -0.8, S: 0.6 },
  },
  {
    code: 'BNDY',
    name: '边界怪',
    blurb:
      '你不冷血，只是清醒：我可以帮你，但不替你活。边界感是你的自保天赋。',
    vector: { B: 2, A: 0.8, F: 0.6, C: 0.5, K: -0.3 },
  },
  {
    code: 'SOC1',
    name: '社交发动机',
    blurb:
      '你在人群里充电，冷场会让你手痒。你不是爱表现，只是太擅长让空气流动起来。',
    vector: { L: 2, A: 1, J: 0.8, E: 0.5, B: -0.2 },
  },
]

export const defaultConfig: TestConfig = {
  brand: {
    title: 'SBTI 人格测试（网页版）',
    subtitle: 'MBTI 只是过时，做题才是永恒。',
    disclaimer:
      '本测试仅供娱乐，请勿用于诊断、面试、相亲、分手、算命或人生判决书。',
  },
  dimensions,
  questions,
  archetypes,
}
