import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import { BOARD_SIZE } from './game/constants';
import './App.css';

function App() {
  const { gameState, elapsedSeconds, togglePrimaryAction, changeDirection } =
    useSnakeGame();

  return (
    <div className="game-container">
      <ScoreBoard
        score={gameState.score}
        status={gameState.status}
        elapsedSeconds={elapsedSeconds}
      />
      <GameBoard
        boardSize={BOARD_SIZE}
        snake={gameState.snake}
        food={gameState.food}
        status={gameState.status}
      />
      <Controls
        onDirectionChange={changeDirection}
        onPrimaryAction={togglePrimaryAction}
        status={gameState.status}
      />
    </div>
  );
}

export default App;
