import React from 'react';
import type { GameStatus, Position } from '../types';

interface GameBoardProps {
  boardSize: number;
  snake: Position[];
  food: Position | null;
  status: GameStatus;
}

const GameBoard: React.FC<GameBoardProps> = ({
  boardSize,
  snake,
  food,
  status,
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
    <div className="game-board" role="img" aria-label="Snake game board">
      <div className="grid-overlay" />

      {/* Food */}
      {food && (
        <div
          className="food"
          data-testid="food"
          data-x={food.x}
          data-y={food.y}
          style={pieceStyle(food.x, food.y)}
        />
      )}

      {/* Body segments (rendered before head so head sits on top) */}
      {snake.slice(1).map((segment) => (
        <div
          key={`${segment.x}-${segment.y}`}
          className="snake-body"
          style={pieceStyle(segment.x, segment.y)}
        />
      ))}

      {/* Head */}
      {snake[0] && (
        <div
          className="snake-head"
          data-testid="snake-head"
          data-x={snake[0].x}
          data-y={snake[0].y}
          style={pieceStyle(snake[0].x, snake[0].y)}
        >
          <span className="eye eye-left" />
          <span className="eye eye-right" />
        </div>
      )}

      {(status === 'gameOver' || status === 'won') && (
        <div className="game-over-overlay">
          {status === 'won' ? 'You Win!' : 'Game Over!'}
          <br />
          Press SPACE to restart
        </div>
      )}
    </div>
  );
};

export default GameBoard;
