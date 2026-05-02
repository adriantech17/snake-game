import { type Direction } from '../engine/gameEngine';

interface ControlsProps {
  readonly onDirectionChange: (direction: Direction) => void;
  readonly onStart: () => void;
  readonly onPauseResume: () => void;
  readonly isRunning: boolean;
  readonly gameOver: boolean;
}

export function Controls({
  onDirectionChange,
  onStart,
  onPauseResume,
  isRunning,
  gameOver,
}: ControlsProps) {
  return (
    <div className="controls" role="group" aria-label="Game controls">
      <button onClick={() => onDirectionChange('UP')}    className="control-btn" aria-label="Move up">▲</button>
      <div className="control-row">
        <button onClick={() => onDirectionChange('LEFT')}  className="control-btn" aria-label="Move left">◀</button>
        <button onClick={() => onDirectionChange('RIGHT')} className="control-btn" aria-label="Move right">▶</button>
      </div>
      <button onClick={() => onDirectionChange('DOWN')}  className="control-btn" aria-label="Move down">▼</button>
      <div className="control-actions">
        {gameOver || !isRunning ? (
          <button onClick={gameOver ? onStart : onPauseResume} className="action-btn">
            {gameOver ? 'Restart' : 'Start'}
          </button>
        ) : (
          <button onClick={onPauseResume} className="action-btn">Pause</button>
        )}
      </div>
    </div>
  );
}

export default Controls;