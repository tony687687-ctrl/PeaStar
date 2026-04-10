import { Link, NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

export function Chrome(props: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6">
        <header className="flex items-center justify-between gap-3">
          <Link to="/" className="group inline-flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-white">
              {props.title}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
              beta
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm text-white/70">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-1.5 transition',
                  isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5',
                ].join(' ')
              }
              end
            >
              首页
            </NavLink>
            <NavLink
              to="/test"
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-1.5 transition',
                  isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5',
                ].join(' ')
              }
            >
              测试
            </NavLink>
          </nav>
        </header>

        <main className="mt-6 flex-1">{props.children}</main>

        <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-white/45">
          <p>
            Made for fun. 数据仅存本地。你可以把题库配置替换成自己的版本。
          </p>
        </footer>
      </div>
    </div>
  )
}
