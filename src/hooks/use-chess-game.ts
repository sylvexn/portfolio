import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import * as api from '@/lib/chess-api'
import type { GameState, GameSummary } from '@/lib/chess-api'

// Mock game for when the backend isn't available yet
const MOCK_GAME: GameState = {
  id: 1,
  fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
  pgn: '1. e4',
  turn: 'owner',
  status: 'active',
  result: null,
  moves: [
    { moveNum: 1, side: 'visitor', moveSan: 'e4', createdAt: '2026-03-30T12:00:00Z' },
  ],
  capturedByVisitor: [],
  capturedByOwner: [],
  startedAt: '2026-03-30T12:00:00Z',
}

const ADMIN_KEY = 'chess_admin_token'

// Poll faster when waiting for the opponent, slower otherwise
const FAST_POLL_MS = 3_000
const SLOW_POLL_MS = 15_000

export function useChessGame() {
  const [game, setGame] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem(ADMIN_KEY))
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const gameRef = useRef<GameState | null>(null)

  const adminToken = isAdmin ? localStorage.getItem(ADMIN_KEY) ?? undefined : undefined

  // Keep a ref in sync so the interval callback always reads latest state
  useEffect(() => {
    gameRef.current = game
  }, [game])

  const fetchGame = useCallback(async () => {
    try {
      const data = await api.getGame()
      setGame(data)
      setError(null)
      return data
    } catch {
      if (!gameRef.current) setGame(MOCK_GAME)
      setError('Backend not available — showing demo')
      return null
    }
  }, [])

  // Adaptive polling: restart interval when turn changes
  const startPolling = useCallback(
    (waitingForOpponent: boolean) => {
      clearInterval(intervalRef.current)
      const ms = waitingForOpponent ? FAST_POLL_MS : SLOW_POLL_MS
      intervalRef.current = setInterval(fetchGame, ms)
    },
    [fetchGame],
  )

  useEffect(() => {
    setLoading(true)
    fetchGame().then((data) => {
      setLoading(false)
      if (data) {
        const waiting =
          (data.turn === 'owner' && !isAdmin) ||
          (data.turn === 'visitor' && isAdmin)
        startPolling(waiting)
      } else {
        startPolling(false)
      }
    })
    return () => clearInterval(intervalRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Restart polling when turn flips (so interval adapts)
  useEffect(() => {
    if (!game) return
    const waiting =
      (game.turn === 'owner' && !isAdmin) ||
      (game.turn === 'visitor' && isAdmin)
    startPolling(waiting)
  }, [game?.turn, isAdmin, startPolling])

  const makeMove = useCallback(
    async (from: string, to: string, promotion?: string): Promise<boolean> => {
      const current = gameRef.current
      if (!current) return false

      // Client-side validation
      const chess = new Chess(current.fen)
      const move = chess.move({ from, to, promotion })
      if (!move) return false

      // Optimistic update — show the move instantly
      const optimistic: GameState = {
        ...current,
        fen: chess.fen(),
        pgn: chess.pgn(),
        turn: current.turn === 'visitor' ? 'owner' : 'visitor',
        status: chess.isCheckmate()
          ? 'checkmate'
          : chess.isStalemate()
            ? 'stalemate'
            : chess.isDraw()
              ? 'draw'
              : 'active',
        moves: [
          ...current.moves,
          {
            moveNum: Math.ceil((current.moves.length + 1) / 2),
            side: current.turn,
            moveSan: move.san,
            createdAt: new Date().toISOString(),
          },
        ],
      }
      setGame(optimistic)

      try {
        const result = await api.makeMove(from, to, promotion, adminToken)
        if (result.success) {
          // Server state is authoritative — replace optimistic update
          setGame(result.game)
          return true
        }
        // Revert optimistic update on rejection
        setGame(current)
        setError(result.error ?? 'Move rejected')
        return false
      } catch {
        // Keep optimistic update if backend is unreachable
        return true
      }
    },
    [adminToken],
  )

  const loginAsOwner = useCallback((token: string) => {
    localStorage.setItem(ADMIN_KEY, token)
    setIsAdmin(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_KEY)
    setIsAdmin(false)
  }, [])

  const getHistory = useCallback(async (page = 1): Promise<{ games: GameSummary[]; hasMore: boolean }> => {
    try {
      return await api.getGameHistory(page)
    } catch {
      return { games: [], hasMore: false }
    }
  }, [])

  return { game, loading, error, makeMove, isAdmin, loginAsOwner, logout, getHistory, adminToken, refetch: fetchGame }
}
