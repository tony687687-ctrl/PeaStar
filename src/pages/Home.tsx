import { Link } from 'react-router-dom'
import { Chrome } from '../components/Chrome'
import { Button, Card, Badge } from '../components/ui'
import { defaultConfig } from '../lib/sbti/config'
import { readJson } from '../lib/storage'
import type { Answers } from '../lib/sbti/model'

export function Home() {
  const answers = readJson<Answers>('sbti:v1:answers', {})
  const answeredCount = Object.keys(answers).length
  const total = defaultConfig.questions.length
  return (
    <Chrome title="SBTI">
      <div className="space-y-5">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_55%)]" />
          <div className="relative space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>
                {answeredCount} / {total}
              </Badge>
              <Badge>全选完才会放行</Badge>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {defaultConfig.brand.title}
            </h1>
            <p className="text-sm leading-6 text-white/70 sm:text-base">
              {defaultConfig.brand.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/test">
                <Button>开始测试</Button>
              </Link>
              <a
                href="https://sbti.unun.dev/"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost">参考站点</Button>
              </a>
            </div>
            <img
              src="/meme-home.svg"
              alt="搞笑测试插图"
              className="mt-4 w-full rounded-xl border border-white/10 object-cover"
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">友情提示</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            {defaultConfig.brand.disclaimer}
          </p>
        </Card>
      </div>
    </Chrome>
  )
}
