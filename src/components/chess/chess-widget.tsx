import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MiniChessboard } from './mini-chessboard'
import type { GameState } from '@/lib/chess-api'
import { getGame } from '@/lib/chess-api'

interface ChessWidgetProps {
  onOpen: () => void
}

// Simple pawn SVG
function PawnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="6" r="3" />
      <path d="M9 10h6l1 4H8l1-4z" />
      <path d="M7 16h10l1 4H6l1-4z" />
      <rect x="5" y="21" width="14" height="2" rx="1" />
    </svg>
  )
}

export function ChessWidget({ onOpen }: ChessWidgetProps) {
  const [hovered, setHovered] = useState(false)
  const [game, setGame] = useState<GameState | null>(null)
  const reduceMotion = useReducedMotion()

  const fetchGame = useCallback(async () => {
    try {
      const data = await getGame()
      setGame(data)
    } catch {
      // silently fail — widget still shows without preview data
    }
  }, [])

  useEffect(() => {
    fetchGame()
    const interval = setInterval(fetchGame, 30_000)
    return () => clearInterval(interval)
  }, [fetchGame])

  return (
    <motion.div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden sm:flex items-center gap-3"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.3, delay: 2 }
          : { type: 'spring', damping: 20, stiffness: 100, delay: 2 }
      }
    >
      {/* Pawn button */}
      <motion.button
        onClick={onOpen}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className={cn(
          'relative w-12 h-12 rounded-xl flex items-center justify-center',
          'glass-effect chess-widget cursor-pointer',
          'text-amber-400 hover:text-amber-300 transition-colors',
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={
          reduceMotion
            ? undefined
            : { animation: 'chess-float 3s ease-in-out infinite' }
        }
      >
        <PawnIcon className="w-6 h-6" />
      </motion.button>

      {/* Hover preview */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-effect rounded-xl p-3 pointer-events-none"
          >
            <p className="text-xs font-mono text-amber-400 mb-2 whitespace-nowrap">
              want to play a game?
            </p>
            <MiniChessboard fen={game?.fen} size={120} />
            <p className="text-[10px] font-mono text-muted-foreground mt-1.5">
              {game
                ? game.turn === 'visitor'
                  ? '♟ your move'
                  : '⏳ waiting for owner'
                : 'loading...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
