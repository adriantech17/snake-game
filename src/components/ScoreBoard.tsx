import React from 'react';
import type { GameStatus } from '../types';

interface ScoreBoardProps {
  score: number;
  status: GameStatus;
}

const statusLabel: Record<GameStatus, string> = {
  idle: 'Ready',
  running: 'Playing...',
  paused: 'Paused',
  gameOver: 'Game Over!',
  won: 'You Win!',
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, status }) => {
  return (
    <div className="score-board">
      <h2>Snake Game</h2>
      <p>Score: {score}</p>
      <p>{statusLabel[status]}</p>
    </div>
  );
};

export default ScoreBoard;
