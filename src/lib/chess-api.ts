const API = 'https://chess.syl.rest/api'

export interface GameMove {
  moveNum: number
  side: 'visitor' | 'owner'
  moveSan: string
  createdAt: string
}

export interface GameState {
  id: number
  fen: string
  pgn: string
  turn: 'visitor' | 'owner'
  status: 'active' | 'checkmate' | 'stalemate' | 'draw' | 'resigned'
  result: 'visitor_win' | 'owner_win' | 'draw' | null
  moves: GameMove[]
  capturedByVisitor: string[]
  capturedByOwner: string[]
  startedAt: string
}

export interface GameSummary {
  id: number
  result: string | null
  status: string
  moveCount: number
  startedAt: string
  endedAt: string | null
}

export interface MoveResult {
  success: boolean
  game: GameState
  error?: string
}

function authHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function getGame(): Promise<GameState> {
  const res = await fetch(`${API}/game`)
  if (!res.ok) throw new Error('Failed to fetch game')
  return res.json()
}

export async function makeMove(
  from: string,
  to: string,
  promotion?: string,
  token?: string,
): Promise<MoveResult> {
  const res = await fetch(`${API}/game/move`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ from, to, promotion }),
  })
  return res.json()
}

export async function getGameHistory(page = 1): Promise<{ games: GameSummary[]; hasMore: boolean }> {
  const res = await fetch(`${API}/games?page=${page}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function getGameById(id: number): Promise<GameState> {
  const res = await fetch(`${API}/games/${id}`)
  if (!res.ok) throw new Error('Failed to fetch game')
  return res.json()
}

export async function startNewGame(token: string): Promise<GameState> {
  const res = await fetch(`${API}/game/new`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('Failed to start game')
  return res.json()
}

export async function resignGame(token: string): Promise<GameState> {
  const res = await fetch(`${API}/game/resign`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('Failed to resign')
  return res.json()
}
