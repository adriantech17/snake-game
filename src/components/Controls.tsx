import React from 'react';
import { Direction } from '../types';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onStart: () => void;
  onPauseResume: () => void;
  isRunning: boolean;
  gameOver: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  onStart,
  onPauseResume,
  isRunning,
  gameOver,
}) => {
  return (
    <div className="controls">
      <button onClick={() => onDirectionChange('UP')} className="control-btn">
        ▲
      </button>
      <div className="control-row">
        <button
          onClick={() => onDirectionChange('LEFT')}
          className="control-btn"
        >
          ◀
        </button>
        <button
          onClick={() => onDirectionChange('RIGHT')}
          className="control-btn"
        >
          ▶
        </button>
      </div>
      <button onClick={() => onDirectionChange('DOWN')} className="control-btn">
        ▼
      </button>
      <div className="control-actions">
        {gameOver || !isRunning ? (
          <button
            onClick={gameOver ? onStart : onPauseResume}
            className="action-btn"
          >
            {gameOver ? 'Restart' : 'Start'}
          </button>
        ) : (
          <button onClick={onPauseResume} className="action-btn">
            Pause
          </button>
        )}
      </div>
    </div>
  );
};

export default Controls;
