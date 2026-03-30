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

function Bubbles({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <>
      <span className="bubble" style={{ left: '18%', bottom: '10%', ['--dur' as string]: '2.2s', ['--delay' as string]: '0s' }} />
      <span className="bubble" style={{ left: '45%', bottom: '6%', ['--dur' as string]: '1.8s', ['--delay' as string]: '0.6s' }} />
      <span className="bubble" style={{ left: '72%', bottom: '12%', ['--dur' as string]: '2.5s', ['--delay' as string]: '1.1s' }} />
      <span className="bubble" style={{ left: '30%', bottom: '4%', ['--dur' as string]: '2s', ['--delay' as string]: '1.7s' }} />
      <span className="bubble" style={{ left: '60%', bottom: '8%', ['--dur' as string]: '2.3s', ['--delay' as string]: '0.3s' }} />
    </>
  )
}

export function HydrationRing() {
  const [data, setData] = useState<WidgetData | null>(null)
  const [status, setStatus] = useState<StatusData | null>(null)
  const [error, setError] = useState(false)
  const [hovered, setHovered] = useState(false)
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
  // Water fill level: map goalPct to Y position (36 = bottom, ~8 = top)
  const fillY = 36 - (goalPct / 100) * 28

  return (
    <motion.a
      href="https://water.syl.rest"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed top-6 right-6 z-40 flex items-center gap-3 rounded-xl px-3.5 py-2.5 no-underline',
        'glass-effect water-widget cursor-pointer overflow-hidden',
        error && 'opacity-50',
      )}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduceMotion ? { duration: 0.3, delay: 1.5 } : { type: 'spring', damping: 20, stiffness: 100, delay: 1.5 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Bubbles */}
      <Bubbles visible={hovered && !reduceMotion} />

      {/* Ring */}
      <div className="relative w-10 h-10 shrink-0">
        <svg viewBox="0 0 36 36" className="w-10 h-10">
          <defs>
            <clipPath id="ring-clip">
              <circle cx="18" cy="18" r="14" />
            </clipPath>
            <linearGradient id="water-fill-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Background ring */}
          <circle
            cx="18" cy="18" r="15.9"
            fill="none"
            strokeWidth="3.5"
            className="stroke-border"
          />

          {/* Water fill inside circle */}
          <g clipPath="url(#ring-clip)">
            <motion.path
              d={`M 0 ${fillY} Q 9 ${fillY - 3} 18 ${fillY} Q 27 ${fillY + 3} 36 ${fillY} L 36 36 L 0 36 Z`}
              fill="url(#water-fill-grad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2 }}
              style={{
                animation: reduceMotion ? 'none' : undefined,
              }}
            >
              {!reduceMotion && (
                <animate
                  attributeName="d"
                  dur="2.5s"
                  repeatCount="indefinite"
                  values={`
                    M 0 ${fillY} Q 9 ${fillY - 3} 18 ${fillY} Q 27 ${fillY + 3} 36 ${fillY} L 36 36 L 0 36 Z;
                    M 0 ${fillY} Q 9 ${fillY + 3} 18 ${fillY} Q 27 ${fillY - 3} 36 ${fillY} L 36 36 L 0 36 Z;
                    M 0 ${fillY} Q 9 ${fillY - 3} 18 ${fillY} Q 27 ${fillY + 3} 36 ${fillY} L 36 36 L 0 36 Z
                  `}
                />
              )}
            </motion.path>
          </g>

          {/* Progress ring */}
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
