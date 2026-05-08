import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import './App.css';

function App() {
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    changeDirection,
    BOARD_SIZE,
  } = useSnakeGame();

  const handlePauseResume = () => {
    if (gameState.isRunning) {
      pauseGame();
    } else {
      resumeGame();
    }
  };

  return (
    <div className="game-container">
      <ScoreBoard
        score={gameState.score}
        isRunning={gameState.isRunning}
        gameOver={gameState.gameOver}
        gameWon={gameState.gameWon}
      />
      <GameBoard
        boardSize={BOARD_SIZE}
        snake={gameState.snake}
        food={gameState.food}
        gameOver={gameState.gameOver}
        gameWon={gameState.gameWon}
      />
      <Controls
        onDirectionChange={changeDirection}
        onStart={startGame}
        onPauseResume={handlePauseResume}
        isRunning={gameState.isRunning}
        gameOver={gameState.gameOver || gameState.gameWon}
      />
    </div>
  );
}

export default App;
