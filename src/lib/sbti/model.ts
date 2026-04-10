export type DimensionId =
  | 'C'
  | 'T'
  | 'R'
  | 'L'
  | 'S'
  | 'A'
  | 'B'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'

export type Dimension = {
  id: DimensionId
  name: string
  leftLabel: string
  rightLabel: string
}

export type Option = {
  id: string
  text: string
  effects: Partial<Record<DimensionId, number>>
}

export type Question = {
  id: string
  title: string
  options: Option[]
}

export type Archetype = {
  code: string
  name: string
  blurb?: string
  vector: Partial<Record<DimensionId, number>>
}

export type TestConfig = {
  brand: {
    title: string
    subtitle: string
    disclaimer: string
  }
  dimensions: Dimension[]
  questions: Question[]
  archetypes: Archetype[]
}

export type Answers = Record<string, string>

export type DimensionScore = {
  id: DimensionId
  name: string
  leftLabel: string
  rightLabel: string
  raw: number
  min: number
  max: number
  percent: number
}

export type Result = {
  archetype: {
    code: string
    name: string
    matchPercent: number
    blurb?: string
  }
  dimensionScores: DimensionScore[]
  answeredCount: number
  totalCount: number
}
