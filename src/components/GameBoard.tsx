import React from 'react';

interface GameBoardProps {
  boardSize: number;
  snake: Array<{ x: number; y: number }>;
  food: { x: number; y: number };
  gameOver: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ boardSize, snake, food, gameOver }) => {
  const cellSize = 100 / boardSize;

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some((segment) => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let className = 'cell';
    if (isSnakeHead) className += ' snake-head';
    else if (isSnakeBody) className += ' snake-body';
    else if (isFood) className += ' food';

    return <div key={`${x}-${y}`} className={className} style={{ width: `${cellSize}%`, height: `${cellSize}%` }} />;
  };

  const grid = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      grid.push(renderCell(x, y));
    }
  }

  return (
    <div className="game-board">
      {gameOver && <div className="game-over-overlay">Game Over!<br />Press SPACE to restart</div>}
      <div className="grid">{grid}</div>
    </div>
  );
};


export default GameBoard;
