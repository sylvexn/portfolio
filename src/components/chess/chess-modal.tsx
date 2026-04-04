import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { History, ChevronLeft, LogIn, LogOut, Crown, Flag } from 'lucide-react'
import { toast } from 'sonner'
import { useChessGame } from '@/hooks/use-chess-game'
import type { GameSummary } from '@/lib/chess-api'

interface ChessModalProps {
  isOpen: boolean
  onClose: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

// Derive captured pieces from FEN
function getCapturedPieces(fen: string) {
  const initial: Record<string, number> = {
    P: 8, R: 2, N: 2, B: 2, Q: 1, K: 1,
    p: 8, r: 2, n: 2, b: 2, q: 1, k: 1,
  }
  const board = fen.split(' ')[0]
  const current: Record<string, number> = {}
  for (const ch of board) {
    if (/[prnbqkPRNBQK]/.test(ch)) {
      current[ch] = (current[ch] ?? 0) + 1
    }
  }

  const pieceSymbols: Record<string, string> = {
    K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
    k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
  }

  // Captured by visitor (white) = missing black pieces
  const capturedByVisitor: string[] = []
  for (const piece of ['q', 'r', 'b', 'n', 'p']) {
    const missing = initial[piece] - (current[piece] ?? 0)
    for (let i = 0; i < missing; i++) capturedByVisitor.push(pieceSymbols[piece])
  }

  // Captured by owner (black) = missing white pieces
  const capturedByOwner: string[] = []
  for (const piece of ['Q', 'R', 'B', 'N', 'P']) {
    const missing = initial[piece] - (current[piece] ?? 0)
    for (let i = 0; i < missing; i++) capturedByOwner.push(pieceSymbols[piece])
  }

  return { capturedByVisitor, capturedByOwner }
}

function MoveHistory({ moves }: { moves: { moveNum: number; side: string; moveSan: string }[] }) {
  // Group moves into pairs (white + black)
  const pairs: { num: number; white?: string; black?: string }[] = []
  for (const move of moves) {
    if (move.side === 'visitor') {
      pairs.push({ num: move.moveNum, white: move.moveSan })
    } else {
      const last = pairs[pairs.length - 1]
      if (last && !last.black) {
        last.black = move.moveSan
      } else {
        pairs.push({ num: move.moveNum, black: move.moveSan })
      }
    }
  }

  if (pairs.length === 0) {
    return <p className="text-xs text-muted-foreground italic">no moves yet</p>
  }

  return (
    <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
      {pairs.map((pair) => (
        <div key={pair.num} className="flex gap-2 text-xs font-mono">
          <span className="text-muted-foreground w-6 text-right shrink-0">{pair.num}.</span>
          <span className="text-foreground w-16">{pair.white ?? '...'}</span>
          <span className="text-muted-foreground w-16">{pair.black ?? ''}</span>
        </div>
      ))}
    </div>
  )
}

function GameHistoryView({ onBack }: { onBack: () => void }) {
  const { getHistory } = useChessGame()
  const [games, setGames] = useState<GameSummary[]>([])
  const [loaded, setLoaded] = useState(false)

  useState(() => {
    getHistory().then((data) => {
      setGames(data.games)
      setLoaded(true)
    })
  })

  const resultLabel = (g: GameSummary) => {
    if (g.result === 'visitor_win') return '👥 Visitors won'
    if (g.result === 'owner_win') return '👑 Owner won'
    if (g.result === 'draw') return '🤝 Draw'
    return g.status
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2 }}
    >
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-3 -ml-2 text-muted-foreground">
        <ChevronLeft className="h-4 w-4 mr-1" /> back to game
      </Button>

      <h3 className="text-sm font-semibold mb-3">game history</h3>

      {!loaded ? (
        <p className="text-xs text-muted-foreground">loading...</p>
      ) : games.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">no completed games yet</p>
      ) : (
        <div className="space-y-2">
          {games.map((g) => (
            <Card key={g.id} className="bg-card/50 p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">{resultLabel(g)}</span>
                <span className="text-xs text-muted-foreground">{g.moveCount} moves</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {new Date(g.startedAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function AdminPanel() {
  const { isAdmin, loginAsOwner, logout, adminToken } = useChessGame()
  const [tokenInput, setTokenInput] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Crown className="h-3 w-3 text-amber-400" />
        <span>admin mode</span>
        <Button variant="ghost" size="sm" onClick={logout} className="h-6 px-2 text-xs">
          <LogOut className="h-3 w-3 mr-1" /> logout
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={async () => {
            try {
              const { startNewGame } = await import('@/lib/chess-api')
              await startNewGame(adminToken!)
              toast('New game started')
              window.location.reload()
            } catch {
              toast.error('Failed to start new game')
            }
          }}
        >
          new game
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-red-400"
          onClick={async () => {
            try {
              const { resignGame } = await import('@/lib/chess-api')
              await resignGame(adminToken!)
              toast('Game resigned')
              window.location.reload()
            } catch {
              toast.error('Failed to resign')
            }
          }}
        >
          <Flag className="h-3 w-3 mr-1" /> resign
        </Button>
      </div>
    )
  }

  if (!showLogin) {
    return (
      <button
        onClick={() => setShowLogin(true)}
        className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
      >
        admin
      </button>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (tokenInput.trim()) {
          loginAsOwner(tokenInput.trim())
          setTokenInput('')
          setShowLogin(false)
          toast('Logged in as owner')
        }
      }}
      className="flex items-center gap-2"
    >
      <input
        type="password"
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
        placeholder="token"
        className="h-6 px-2 text-xs bg-secondary/50 border border-border/50 rounded-md w-32 text-foreground placeholder:text-muted-foreground"
        autoFocus
      />
      <Button type="submit" variant="ghost" size="sm" className="h-6 px-2 text-xs">
        <LogIn className="h-3 w-3" />
      </Button>
    </form>
  )
}

export function ChessModal({ isOpen, onClose }: ChessModalProps) {
  const { game, loading, error, makeMove, isAdmin } = useChessGame()
  const [showHistory, setShowHistory] = useState(false)

  const { capturedByVisitor, capturedByOwner } = useMemo(
    () => (game ? getCapturedPieces(game.fen) : { capturedByVisitor: [], capturedByOwner: [] }),
    [game?.fen],
  )

  const canMove = game?.status === 'active' && (
    (game.turn === 'visitor' && !isAdmin) ||
    (game.turn === 'owner' && isAdmin)
  )

  const statusText = () => {
    if (!game) return 'loading...'
    if (game.status === 'checkmate') return game.result === 'visitor_win' ? '👥 visitors win!' : '👑 owner wins!'
    if (game.status === 'stalemate') return '🤝 stalemate'
    if (game.status === 'draw') return '🤝 draw'
    if (game.status === 'resigned') return game.result === 'visitor_win' ? '👥 owner resigned' : '👑 visitors forfeit'

    const chess = new Chess(game.fen)
    const inCheck = chess.inCheck()
    if (game.turn === 'visitor') return inCheck ? '♟ your move (check!)' : '♟ your move'
    return inCheck ? '⏳ owner\'s move (check!)' : '⏳ waiting for owner...'
  }

  function onDrop({ piece, sourceSquare, targetSquare }: {
    piece: { isSparePiece: boolean; position: string; pieceType: string }
    sourceSquare: string
    targetSquare: string | null
  }): boolean {
    if (!canMove || !targetSquare) return false

    // Handle pawn promotion
    const pieceType = piece.pieceType
    const promotion = pieceType.endsWith('P') &&
      ((pieceType.startsWith('w') && targetSquare[1] === '8') || (pieceType.startsWith('b') && targetSquare[1] === '1'))
      ? 'q'
      : undefined

    makeMove(sourceSquare, targetSquare, promotion)
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95%] lg:max-w-4xl max-h-[85dvh] overflow-y-auto bg-background/95 backdrop-blur-md border-border/60">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-shimmer">
            chess vs. me
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showHistory ? (
            <GameHistoryView key="history" onBack={() => setShowHistory(false)} />
          ) : (
            <motion.div
              key="game"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="py-2"
            >
              {/* Description */}
              <motion.p variants={itemVariants} className="text-sm text-muted-foreground mb-4">
                any visitor vs. me — a communal chess game! make a move as white,
                i get notified and play back as black. let's see who wins.
              </motion.p>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Board */}
                <motion.div variants={itemVariants} className="shrink-0 w-full lg:w-auto">
                  <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-[360px] aspect-square mx-auto">
                    <Chessboard
                      options={{
                        position: game?.fen,
                        onPieceDrop: onDrop,
                        allowDragging: canMove ?? false,
                        boardOrientation: isAdmin ? 'black' : 'white',
                        darkSquareStyle: { backgroundColor: 'hsl(218 24% 13%)' },
                        lightSquareStyle: { backgroundColor: 'hsl(214 28% 22%)' },
                        boardStyle: { borderRadius: '0.5rem' },
                        animationDurationInMs: 200,
                      }}
                    />
                  </div>
                  {loading && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">loading game...</p>
                  )}
                  {error && (
                    <p className="text-xs text-amber-400/70 mt-2 text-center">{error}</p>
                  )}
                </motion.div>

                {/* Game info */}
                <motion.div variants={itemVariants} className="flex-1 space-y-4 min-w-0">
                  {/* Status */}
                  <Card className="bg-card/50 p-3">
                    <p className="text-sm font-medium">{statusText()}</p>
                    {game && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        game #{game.id} · started {new Date(game.startedAt).toLocaleDateString()}
                      </p>
                    )}
                  </Card>

                  {/* Captured pieces */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">captured by visitors</span>
                      <span className="text-sm tracking-wide">
                        {capturedByVisitor.length > 0 ? capturedByVisitor.join(' ') : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">captured by owner</span>
                      <span className="text-sm tracking-wide">
                        {capturedByOwner.length > 0 ? capturedByOwner.join(' ') : '—'}
                      </span>
                    </div>
                  </div>

                  <Separator className="opacity-30" />

                  {/* Move history */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      moves
                    </h4>
                    <MoveHistory moves={game?.moves ?? []} />
                  </div>

                  <Separator className="opacity-30" />

                  {/* Game history button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(true)}
                    className="w-full text-xs"
                  >
                    <History className="h-3.5 w-3.5 mr-1.5" />
                    game history
                  </Button>

                  {/* Admin */}
                  <div className="pt-2">
                    <AdminPanel />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
