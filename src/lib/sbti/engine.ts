import type {
  Answers,
  Archetype,
  DimensionId,
  DimensionScore,
  Result,
  TestConfig,
} from './model'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

function magnitude(v: Record<string, number>) {
  let sum = 0
  for (const k of Object.keys(v)) sum += v[k]! * v[k]!
  return Math.sqrt(sum)
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>) {
  let dot = 0
  for (const k of Object.keys(a)) dot += (a[k] ?? 0) * (b[k] ?? 0)
  const ma = magnitude(a)
  const mb = magnitude(b)
  if (ma === 0 || mb === 0) return 0
  return dot / (ma * mb)
}

function computeRawDimensionTotals(config: TestConfig, answers: Answers) {
  const totals: Record<DimensionId, number> = Object.fromEntries(
    config.dimensions.map((d) => [d.id, 0]),
  ) as Record<DimensionId, number>

  const mins: Record<DimensionId, number> = Object.fromEntries(
    config.dimensions.map((d) => [d.id, 0]),
  ) as Record<DimensionId, number>

  const maxs: Record<DimensionId, number> = Object.fromEntries(
    config.dimensions.map((d) => [d.id, 0]),
  ) as Record<DimensionId, number>

  for (const q of config.questions) {
    const effectsByOption = q.options.map((o) => o.effects)
    for (const dim of config.dimensions) {
      const vals = effectsByOption
        .map((e) => e[dim.id] ?? 0)
        .filter((n) => Number.isFinite(n))
      if (vals.length === 0) continue
      mins[dim.id] += Math.min(...vals)
      maxs[dim.id] += Math.max(...vals)
    }

    const chosen = answers[q.id]
    if (!chosen) continue
    const option = q.options.find((o) => o.id === chosen)
    if (!option) continue
    for (const dim of Object.keys(option.effects) as DimensionId[]) {
      totals[dim] += option.effects[dim] ?? 0
    }
  }

  return { totals, mins, maxs }
}

function dimensionScores(config: TestConfig, answers: Answers): DimensionScore[] {
  const { totals, mins, maxs } = computeRawDimensionTotals(config, answers)
  return config.dimensions.map((d) => {
    const min = mins[d.id]
    const max = maxs[d.id]
    const raw = totals[d.id]
    const denom = max - min
    const percent =
      denom === 0 ? 50 : clamp(((raw - min) / denom) * 100, 0, 100)
    return {
      id: d.id,
      name: d.name,
      leftLabel: d.leftLabel,
      rightLabel: d.rightLabel,
      raw: round1(raw),
      min: round1(min),
      max: round1(max),
      percent: round1(percent),
    }
  })
}

function answersCount(config: TestConfig, answers: Answers) {
  let answeredCount = 0
  for (const q of config.questions) if (answers[q.id]) answeredCount += 1
  return { answeredCount, totalCount: config.questions.length }
}

function bestArchetype(
  config: TestConfig,
  dimScores: DimensionScore[],
): { archetype: Archetype; matchPercent: number } {
  const userVector: Record<string, number> = {}
  for (const s of dimScores) userVector[s.id] = (s.percent - 50) / 50

  let best = config.archetypes[0]!
  let bestScore = -Infinity

  for (const a of config.archetypes) {
    const aVec: Record<string, number> = {}
    for (const k of Object.keys(userVector)) aVec[k] = 0
    for (const k of Object.keys(a.vector)) aVec[k] = a.vector[k as DimensionId]!

    const sim = cosineSimilarity(userVector, aVec) // [-1, 1]
    const score = sim
    if (score > bestScore) {
      bestScore = score
      best = a
    }
  }

  // 把 [-1,1] 映射到 [0,100]，并加一点“不过度绝对”的压缩
  const matchPercent = clamp(((bestScore + 1) / 2) * 100, 0, 100)
  return { archetype: best, matchPercent: Math.round(matchPercent) }
}

export function computeResult(config: TestConfig, answers: Answers): Result {
  const dimScores = dimensionScores(config, answers)
  const { answeredCount, totalCount } = answersCount(config, answers)
  const { archetype, matchPercent } = bestArchetype(config, dimScores)
  return {
    archetype: {
      code: archetype.code,
      name: archetype.name,
      blurb: archetype.blurb,
      matchPercent,
    },
    dimensionScores: dimScores,
    answeredCount,
    totalCount,
  }
}

export function unansweredQuestionIds(config: TestConfig, answers: Answers) {
  return config.questions.filter((q) => !answers[q.id]).map((q) => q.id)
}
