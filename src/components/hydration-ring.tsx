import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface WidgetData {
  today_ml: number
  goal_pct: number
  sip_count: number
  last_temp_c: number | null
}

interface StatusData {
  online: boolean
  last_sync: string | null
}

const API = 'https://water.syl.rest/api'

export function HydrationRing() {
  const [data, setData] = useState<WidgetData | null>(null)
  const [status, setStatus] = useState<StatusData | null>(null)
  const [error, setError] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    async function fetchData() {
      try {
        const [wr, sr] = await Promise.all([
          fetch(`${API}/widget`),
          fetch(`${API}/status`),
        ])
        setData(await wr.json())
        setStatus(await sr.json())
        setError(false)
      } catch {
        setError(true)
      }
    }

    fetchData()
    interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const goalPct = data?.goal_pct ?? 0
  const dashOffset = 100 - goalPct

  return (
    <motion.a
      href="https://water.syl.rest"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed top-6 right-6 z-40 flex items-center gap-3 rounded-xl px-3.5 py-2.5 no-underline',
        'glass-effect cursor-pointer',
        error && 'opacity-50',
      )}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduceMotion ? { duration: 0.3, delay: 1.5 } : { type: 'spring', damping: 20, stiffness: 100, delay: 1.5 }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Ring */}
      <div className="relative w-10 h-10 shrink-0">
        <svg viewBox="0 0 36 36" className="w-10 h-10">
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            strokeWidth="3.5"
            className="stroke-border"
          />
          <motion.circle
            cx="18" cy="18" r="15.9"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="stroke-primary"
            strokeDasharray="100"
            transform="rotate(-90 18 18)"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 1.8 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-primary font-mono">
            {data ? `${goalPct}%` : '—'}
          </span>
        </div>
      </div>

      {/* Info - hidden on mobile */}
      <div className="hidden sm:block">
        <div className="text-sm font-semibold text-foreground font-mono leading-tight">
          {data ? `${data.today_ml}` : '—'}
          <span className="text-[10px] text-muted-foreground ml-0.5">ml</span>
        </div>
        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
          <span className={cn(
            'inline-block w-1.5 h-1.5 rounded-full',
            status?.online ? 'bg-emerald-500' : 'bg-red-400',
          )} />
          {data ? `${data.sip_count} sips` : 'loading'}
        </div>
      </div>
    </motion.a>
  )
}
