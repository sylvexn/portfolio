import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MiniChessboard } from '@/components/chess/mini-chessboard'
import { getGame, type GameState } from '@/lib/chess-api'

interface DockProps {
  onItemClick: (modalId: string) => void
}

interface DockItem {
  id: string
  emoji: string
  label: string
}

const dockItems: DockItem[] = [
  { id: "whoami", emoji: "🧠", label: "whoami" },
  { id: "resume", emoji: "📄", label: "work history" },
  { id: "skills", emoji: "⚡", label: "skills" },
  { id: "projects", emoji: "🚀", label: "projects" },
  { id: "contact", emoji: "📬", label: "contact" },
  { id: "chess", emoji: "♟️", label: "chess vs. me" }
]

function ChessHoverPreview({ game }: { game: GameState | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="absolute -top-56 left-1/2 -translate-x-1/2 pointer-events-none z-50"
    >
      <div className="glass-effect rounded-xl p-3 shadow-lg">
        <p className="text-xs font-mono text-amber-400 mb-2 whitespace-nowrap text-center">
          want to play a game?
        </p>
        <MiniChessboard fen={game?.fen} size={180} />
        <p className="text-[10px] font-mono text-muted-foreground mt-1.5 text-center">
          {game
            ? game.turn === 'visitor'
              ? '♟ your move'
              : '⏳ waiting for owner'
            : 'loading...'}
        </p>
      </div>
    </motion.div>
  )
}

function DockIcon({
  item,
  mouseX,
  onClick,
  reduceMotion,
  chessGame,
  compact,
}: {
  item: DockItem
  mouseX: MotionValue<number>
  onClick: () => void
  reduceMotion: boolean
  chessGame?: GameState | null
  compact: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const isChess = item.id === 'chess'

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const baseSize = compact ? 46 : 62
  const hoverSize = compact ? 52 : 78
  const widthSync = useTransform(distance, [-150, 0, 150], [baseSize, hoverSize, baseSize])
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      className={cn(
        "relative flex items-center justify-center",
        "rounded-md transition-colors duration-200",
        "hover:bg-accent/45 cursor-pointer group border border-transparent",
        "hover:border-primary/35",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      aria-label={item.label}
      title={isChess ? undefined : item.label}
    >
      <motion.span
        className="text-3xl select-none"
        style={{
          fontSize: useTransform(width, (w) => `${(w as number) * 0.5}px`),
        }}
      >
        {item.emoji}
      </motion.span>

      {/* Hover tooltips - hidden on touch/mobile */}
      {!compact && (isChess ? (
        <AnimatePresence>
          {hovered && <ChessHoverPreview game={chessGame ?? null} />}
        </AnimatePresence>
      ) : (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs px-3 py-1.5 rounded-lg border border-border/50 whitespace-nowrap shadow-lg">
            {item.label}
          </div>
        </div>
      ))}
    </motion.button>
  )
}

export function Dock({ onItemClick }: DockProps) {
  const prefersReducedMotion = useReducedMotion()
  const mouseXSpring = useSpring(0, { mass: 0.1, stiffness: 150, damping: 12 })
  const [chessGame, setChessGame] = useState<GameState | null>(null)
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const handler = (e: MediaQueryListEvent) => setCompact(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const fetchChess = useCallback(async () => {
    try {
      setChessGame(await getGame())
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchChess()
    const interval = setInterval(fetchChess, 30_000)
    return () => clearInterval(interval)
  }, [fetchChess])

  return (
    <motion.div
      className="fixed bottom-4 sm:bottom-6 left-1/2 z-50"
      initial={prefersReducedMotion ? { x: "-50%", opacity: 0 } : { y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0.2 } : { type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
    >
      <motion.div
        className="glass-effect rounded-xl p-1.5 sm:p-2.5 shadow-2xl"
        onMouseMove={(e) => mouseXSpring.set(e.pageX)}
        onMouseLeave={() => mouseXSpring.set(0)}
      >
        <div className="flex items-end gap-0.5 sm:gap-1">
          {dockItems.map((item) => (
            <DockIcon
              key={item.id}
              item={item}
              mouseX={mouseXSpring}
              onClick={() => onItemClick(item.id)}
              reduceMotion={Boolean(prefersReducedMotion)}
              chessGame={item.id === 'chess' ? chessGame : undefined}
              compact={compact}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
