import { Chessboard } from 'react-chessboard'

interface MiniChessboardProps {
  fen?: string
  size?: number
}

export function MiniChessboard({ fen, size = 120 }: MiniChessboardProps) {
  return (
    <div className="rounded-md overflow-hidden" style={{ width: size, height: size }}>
      <Chessboard
        options={{
          position: fen,
          allowDragging: false,
          darkSquareStyle: { backgroundColor: 'hsl(218 24% 13%)' },
          lightSquareStyle: { backgroundColor: 'hsl(214 28% 22%)' },
          showAnimations: false,
        }}
      />
    </div>
  )
}
