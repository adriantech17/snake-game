import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import './App.css';

export default function App() {
  const { gameState, startGame, pauseGame, resumeGame, changeDirection } = useSnakeGame();

  const handlePauseResume = (): void => {
    if (gameState.isRunning) pauseGame();
    else resumeGame();
  };

  return (
    <div className="game-container">
      <ScoreBoard
        score={gameState.score}
        highScore={gameState.highScore}
        isRunning={gameState.isRunning}
        gameOver={gameState.gameOver}
      />
      <GameBoard
        snake={gameState.snake}
        food={gameState.food}
        gameOver={gameState.gameOver}
      />
      <Controls
        onDirectionChange={changeDirection}
        onStart={startGame}
        onPauseResume={handlePauseResume}
        isRunning={gameState.isRunning}
        gameOver={gameState.gameOver}
      />
    </div>
  );
}
