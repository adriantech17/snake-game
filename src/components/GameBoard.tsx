import React from 'react';

interface GameBoardProps {
  boardSize: number;
  snake: Array<{ x: number; y: number }>;
  food: { x: number; y: number } | null;
  gameOver: boolean;
  gameWon?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  boardSize,
  snake,
  food,
  gameOver,
  gameWon = false,
}) => {
  const cellPct = 100 / boardSize;
  const gap = 0.5; // percentage gap between pieces

  const pieceStyle = (x: number, y: number): React.CSSProperties => ({
    position: 'absolute',
    left: `${x * cellPct + gap / 2}%`,
    top: `${y * cellPct + gap / 2}%`,
    width: `${cellPct - gap}%`,
    height: `${cellPct - gap}%`,
  });

  return (
    <div className="game-board">
      <div className="grid-overlay" />

      {/* Food */}
      {food && <div className="food" style={pieceStyle(food.x, food.y)} />}

      {/* Body segments (rendered before head so head sits on top) */}
      {snake.slice(1).map((segment, i) => (
        <div
          key={`seg-${i}`}
          className="snake-body"
          style={pieceStyle(segment.x, segment.y)}
        />
      ))}

      {/* Head */}
      {snake[0] && (
        <div className="snake-head" style={pieceStyle(snake[0].x, snake[0].y)}>
          <span className="eye eye-left" />
          <span className="eye eye-right" />
        </div>
      )}

      {(gameOver || gameWon) && (
        <div className="game-over-overlay">
          {gameWon ? 'You Win!' : 'Game Over!'}
          <br />
          Press SPACE to restart
        </div>
      )}
    </div>
  );
};

export default GameBoard;
