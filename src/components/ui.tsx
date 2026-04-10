import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'ghost' | 'danger'
    left?: ReactNode
  },
) {
  const { className, variant = 'primary', left, ...rest } = props
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-400/40 disabled:cursor-not-allowed disabled:opacity-50'
  const variants: Record<string, string> = {
    primary:
      'bg-purple-500 text-white hover:bg-purple-400 active:bg-purple-500/90',
    ghost: 'bg-white/5 text-white/80 hover:bg-white/10 active:bg-white/10',
    danger: 'bg-red-500/90 text-white hover:bg-red-500 active:bg-red-500/90',
  }

  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {left}
      {props.children}
    </button>
  )
}

export function Card(props: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        'rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm',
        props.className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {props.children}
    </div>
  )
}

export function Badge(props: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/75">
      {props.children}
    </span>
  )
}

export function Progress(props: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-white/10">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-[width]"
        style={{ width: `${Math.max(0, Math.min(100, props.value))}%` }}
      />
    </div>
  )
}
