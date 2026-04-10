import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome } from '../components/Chrome'
import { Button, Card, Progress, Badge } from '../components/ui'
import { readJson, remove, writeJson } from '../lib/storage'
import type { Answers } from '../lib/sbti/model'
import { defaultConfig } from '../lib/sbti/config'
import { computeResult, unansweredQuestionIds } from '../lib/sbti/engine'

const ANSWERS_KEY = 'sbti:v1:answers'
const RESULT_KEY = 'sbti:v1:result'
const INDEX_KEY = 'sbti:v1:index'

export function Test() {
  const nav = useNavigate()
  const config = defaultConfig

  const [answers, setAnswers] = useState<Answers>(() =>
    readJson<Answers>(ANSWERS_KEY, {}),
  )
  const [index, setIndex] = useState<number>(() =>
    readJson<number>(INDEX_KEY, 0),
  )
  const [shake, setShake] = useState(false)

  const total = config.questions.length
  const answeredCount = useMemo(() => {
    let n = 0
    for (const q of config.questions) if (answers[q.id]) n += 1
    return n
  }, [answers, config.questions])

  const progress = total === 0 ? 0 : (answeredCount / total) * 100
  const current = config.questions[clampIndex(index, total)]

  const missingIds = useMemo(
    () => unansweredQuestionIds(config, answers),
    [answers, config],
  )

  useEffect(() => {
    writeJson(ANSWERS_KEY, answers)
  }, [answers])

  useEffect(() => {
    writeJson(INDEX_KEY, index)
  }, [index])

  function onPick(optionId: string) {
    if (!current) return
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }))

    // 更像参考站点的体验：选完自动前进到下一题（尽量跳到未答题）
    const nextUnanswered = findNextUnansweredIndex(
      config.questions,
      { ...answers, [current.id]: optionId },
      clampIndex(index, total) + 1,
    )
    if (nextUnanswered !== null) setIndex(nextUnanswered)
    else setIndex((i) => clampIndex(i + 1, total))
  }

  function goPrev() {
    setIndex((i) => clampIndex(i - 1, total))
  }
  function goNext() {
    setIndex((i) => clampIndex(i + 1, total))
  }

  function goFirstMissing() {
    const first = missingIds[0]
    if (!first) return
    const idx = config.questions.findIndex((q) => q.id === first)
    if (idx >= 0) setIndex(idx)
  }

  function onSubmit() {
    if (answeredCount !== total) {
      setShake(true)
      setTimeout(() => setShake(false), 450)
      goFirstMissing()
      return
    }
    const result = computeResult(config, answers)
    writeJson(RESULT_KEY, result)
    nav('/result')
  }

  function onReset() {
    remove(ANSWERS_KEY)
    remove(RESULT_KEY)
    remove(INDEX_KEY)
    setAnswers({})
    setIndex(0)
  }

  if (!current) {
    return (
      <Chrome title="SBTI">
        <Card>
          <p className="text-sm text-white/70">题库为空。</p>
        </Card>
      </Chrome>
    )
  }

  const chosen = answers[current.id]

  return (
    <Chrome title="SBTI">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge>
                {answeredCount} / {total}
              </Badge>
              {answeredCount !== total ? (
                <span className="text-xs text-white/50">
                  全选完才会放行
                </span>
              ) : (
                <span className="text-xs text-emerald-300/80">已完成</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost">返回首页</Button>
              </Link>
              <Button variant="danger" onClick={onReset}>
                清空重做
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <Progress value={progress} />
          </div>
        </Card>

        <Card className={shake ? 'animate-[shake_.45s_ease-in-out]' : ''}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-white/55">
              {clampIndex(index, total) + 1} / {total}
            </div>
            {missingIds.length > 0 ? (
              <button
                onClick={goFirstMissing}
                className="text-xs text-purple-300/90 hover:text-purple-200"
              >
                跳到未答题（{missingIds.length}）
              </button>
            ) : (
              <span className="text-xs text-white/45">都答完了</span>
            )}
          </div>

          <h2 className="mt-2 text-balance text-xl font-semibold text-white">
            {current.title}
          </h2>

          <div className="mt-4 grid gap-2">
            {current.options.map((o) => {
              const active = chosen === o.id
              return (
                <button
                  key={o.id}
                  onClick={() => onPick(o.id)}
                  className={[
                    'group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                    active
                      ? 'border-purple-400/60 bg-purple-400/10 text-white'
                      : 'border-white/10 bg-white/0 text-white/80 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px]',
                      active
                        ? 'border-purple-300/70 bg-purple-500/20 text-purple-200'
                        : 'border-white/15 text-white/55 group-hover:text-white/70',
                    ].join(' ')}
                  >
                    {o.id.toUpperCase()}
                  </span>
                  <span className="leading-6">{o.text}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={goPrev} disabled={index <= 0}>
                上一题
              </Button>
              <Button
                variant="ghost"
                onClick={goNext}
                disabled={index >= total - 1}
              >
                下一题
              </Button>
            </div>
            <Button onClick={onSubmit}>提交并查看结果</Button>
          </div>
        </Card>
      </div>

      {/* 振动动画（内联到页面避免全局污染） */}
      <style>{`
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
`}</style>
    </Chrome>
  )
}

function clampIndex(i: number, total: number) {
  if (total <= 0) return 0
  return Math.max(0, Math.min(total - 1, i))
}

function findNextUnansweredIndex(
  questions: { id: string }[],
  answers: Answers,
  startIndex: number,
) {
  for (let i = startIndex; i < questions.length; i++) {
    const q = questions[i]!
    if (!answers[q.id]) return i
  }
  return null
}
