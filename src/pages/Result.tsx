import { Link, Navigate } from 'react-router-dom'
import { Chrome } from '../components/Chrome'
import { Badge, Button, Card } from '../components/ui'
import { defaultConfig } from '../lib/sbti/config'
import type { Result as SbtiResult } from '../lib/sbti/model'
import { readJson, remove } from '../lib/storage'

const RESULT_KEY = 'sbti:v1:result'

export function Result() {
  const config = defaultConfig
  const result = readJson<SbtiResult | null>(RESULT_KEY, null)

  if (!result) return <Navigate to="/test" replace />

  const roast = roastByMatch(result.archetype.matchPercent)
  const spicy = spicyLineByType(result.archetype.code)

  return (
    <Chrome title="SBTI">
      <div className="space-y-4">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_55%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>结果页</Badge>
                <Badge>
                  {result.answeredCount} / {result.totalCount}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/test">
                  <Button variant="ghost">返回题目</Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => {
                    remove('sbti:v1:answers')
                    remove('sbti:v1:index')
                    remove(RESULT_KEY)
                    location.href = '/test'
                  }}
                >
                  重新测试
                </Button>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              你的主类型
            </h1>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-sm text-white/55">主类型</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {result.archetype.code}（{result.archetype.name}）
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/55">匹配度</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {result.archetype.matchPercent}%
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm leading-6 text-white/70">
                <div className="mb-1 text-white/55">系统备注（毒舌版）</div>
                <div>{result.archetype.blurb ?? '你很难被一句话概括。'}</div>
                <div className="mt-2 rounded-lg border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-2 text-fuchsia-100">
                  {spicy}
                </div>
                <div className="mt-2 text-xs text-white/55">匹配度锐评：{roast}</div>
              </div>
            </div>
            <div className="mt-4">
              <MemeCard code={result.archetype.code} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">十五维度评分</h2>
          <div className="mt-4 space-y-4">
            {result.dimensionScores.map((d) => (
              <DimensionRow
                key={d.id}
                name={d.name}
                left={d.leftLabel}
                right={d.rightLabel}
                percent={d.percent}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">友情提示</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            {config.brand.disclaimer}
          </p>
        </Card>
      </div>
    </Chrome>
  )
}

function roastByMatch(percent: number) {
  if (percent >= 90) return '这不是测试结果，这是系统在点你名。'
  if (percent >= 75) return '像到离谱，建议你少看点自己。'
  if (percent >= 60) return '基本对上号，嘴硬也没用。'
  if (percent >= 45) return '你是混合体，主打一个薛定谔人格。'
  return '你过于抽象，系统决定先尊重你的自由意志。'
}

function spicyLineByType(code: string) {
  const lines: Record<string, string> = {
    CTRL: '你不是在交流，你是在开项目周会。',
    FLOW: '你的人生战略：船到桥头自然抄近道。',
    RAGE: '你的耐心像手机电量，掉到 20% 就开始红温。',
    HUST: '别人下班回血，你下班开第二战场。',
    ROMA: '现实让你低头，你偏要先抬杠再抬头。',
    REAL: '你听故事只问一句：所以 KPI 呢？',
    BNDY: '你帮人是情分，不帮是你一贯作风。',
    SOC1: '你一开口，空气都被你调成了活跃模式。',
  }
  return lines[code] ?? '你很难定义，但你一定很会整活。'
}

function MemeCard(props: { code: string }) {
  const map: Record<
    string,
    { image: string; title: string; line1: string; line2: string }
  > = {
    CTRL: {
      image: '/meme-types/ctrl.svg',
      title: '控场大师上线',
      line1: '你说“大家随意”，但你已经建好了流程图。',
      line2: '项目经理看了都想叫你前辈。',
    },
    FLOW: {
      image: '/meme-types/flow.svg',
      title: '随缘仙人模式',
      line1: '你不是拖延，你是让命运先走一步。',
      line2: '计划可以改，心态不能崩。',
    },
    RAGE: {
      image: '/meme-types/rage.svg',
      title: '正义开麦现场',
      line1: '你对离谱行为零容忍，红温速度 5G。',
      line2: '路见不平，先发三段论。',
    },
    HUST: {
      image: '/meme-types/hust.svg',
      title: '肝帝觉醒时刻',
      line1: '别人说晚安，你说“再改一版”。',
      line2: '你的松弛感在下一个里程碑之后。',
    },
    ROMA: {
      image: '/meme-types/roma.svg',
      title: '浪漫信念流',
      line1: '你做决定不只看收益，还看灵魂同不同意。',
      line2: '现实很硬，你的理想更硬。',
    },
    REAL: {
      image: '/meme-types/real.svg',
      title: '现实派核算中',
      line1: '你听完故事只问一句：所以怎么落地？',
      line2: '一切浪漫，先过预算。',
    },
    BNDY: {
      image: '/meme-types/bndy.svg',
      title: '边界感战神',
      line1: '你可以帮，但不会替别人活。',
      line2: '温柔是有的，分寸也是有的。',
    },
    SOC1: {
      image: '/meme-types/soc1.svg',
      title: '社交发动机启动',
      line1: '哪里冷场，你就在哪里点火。',
      line2: '你一开口，空气都开始转场。',
    },
  }

  const m = map[props.code] ?? {
    image: '/meme-result.svg',
    title: '抽象人格',
    line1: '你是系统暂时无法归类的稀有生物。',
    line2: '建议保持整活频率。',
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <img
        src={m.image}
        alt={`${props.code} 搞笑配图`}
        className="w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{m.title}</h3>
        <p className="mt-1 text-sm leading-6 text-white/80">{m.line1}</p>
        <p className="mt-1 text-sm leading-6 text-white/70">{m.line2}</p>
      </div>
    </div>
  )
}

function DimensionRow(props: {
  name: string
  left: string
  right: string
  percent: number
}) {
  const p = Math.max(0, Math.min(100, props.percent))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm font-medium text-white">{props.name}</div>
        <div className="text-xs tabular-nums text-white/50">{p.toFixed(1)}%</div>
      </div>
      <div className="mt-2">
        <div className="relative h-2 rounded-full bg-white/10">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
            style={{ width: `${p}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-zinc-950"
            style={{ left: `${p}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/45">
          <span>{props.left}</span>
          <span>{props.right}</span>
        </div>
      </div>
    </div>
  )
}
