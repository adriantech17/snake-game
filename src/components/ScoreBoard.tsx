import React from 'react';
import type { GameStatus } from '../types';

interface ScoreBoardProps {
  score: number;
  status: GameStatus;
  elapsedSeconds: number;
}

const statusLabel: Record<GameStatus, string> = {
  idle: 'Ready',
  running: 'Playing...',
  paused: 'Paused',
  gameOver: 'Game Over!',
  won: 'You Win!',
};

function formatElapsedTime(elapsedSeconds: number): string {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  status,
  elapsedSeconds,
}) => {
  return (
    <div className="score-board">
      <h2>Snake Game</h2>
      <p>Score: {score}</p>
      <p>Time: {formatElapsedTime(elapsedSeconds)}</p>
      <p>{statusLabel[status]}</p>
    </div>
  );
};

export default ScoreBoard;
