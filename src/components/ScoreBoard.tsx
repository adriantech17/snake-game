interface ScoreBoardProps {
  readonly score: number;
  readonly highScore: number;
  readonly isRunning: boolean;
  readonly gameOver: boolean;
}

export function ScoreBoard({ score, highScore, isRunning, gameOver }: ScoreBoardProps) {
  const status = gameOver ? 'Game Over!' : isRunning ? 'Playing...' : 'Paused';
  return (
    <div className="score-board">
      <h2>Snake Game</h2>
      <p>Score: {score}</p>
      <p>Best: {highScore}</p>
      <p>{status}</p>
    </div>
  );
}

export default ScoreBoard;