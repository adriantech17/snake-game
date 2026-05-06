import React from 'react';

interface ScoreBoardProps {
  score: number;
  isRunning: boolean;
  gameOver: boolean;
  gameWon?: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  isRunning,
  gameOver,
  gameWon = false,
}) => {
  let status = 'Paused';

  if (isRunning) status = 'Playing...';
  if (gameOver) status = 'Game Over!';
  if (gameWon) status = 'You Win!';

  return (
    <div className="score-board">
      <h2>Snake Game</h2>
      <p>Score: {score}</p>
      <p>{status}</p>
    </div>
  );
};

export default ScoreBoard;
