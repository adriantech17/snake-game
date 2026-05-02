import React from 'react';

interface ScoreBoardProps {
  score: number;
  isRunning: boolean;
  gameOver: boolean;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, isRunning, gameOver }) => {
  return (
    <div className="score-board">
      <h2>Snake Game</h2>
      <p>Score: {score}</p>
      <p>{gameOver ? 'Game Over!' : isRunning ? 'Playing...' : 'Paused'}</p>
    </div>
  );
};

export default ScoreBoard;