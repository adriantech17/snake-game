import React from 'react';
import type { Direction, GameStatus } from '../types';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPrimaryAction: () => void;
  status: GameStatus;
}

const primaryActionLabel: Record<GameStatus, string> = {
  idle: 'Start',
  running: 'Pause',
  paused: 'Resume',
  gameOver: 'Restart',
  won: 'Restart',
};

const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  onPrimaryAction,
  status,
}) => {
  const isDirectionActive = status === 'running' || status === 'paused';

  return (
    <div className="controls">
      <button
        onClick={() => onDirectionChange('UP')}
        className="control-btn"
        aria-label="Move up"
        disabled={!isDirectionActive}
      >
        ▲
      </button>
      <div className="control-row">
        <button
          onClick={() => onDirectionChange('LEFT')}
          className="control-btn"
          aria-label="Move left"
          disabled={!isDirectionActive}
        >
          ◀
        </button>
        <button
          onClick={() => onDirectionChange('RIGHT')}
          className="control-btn"
          aria-label="Move right"
          disabled={!isDirectionActive}
        >
          ▶
        </button>
      </div>
      <button
        onClick={() => onDirectionChange('DOWN')}
        className="control-btn"
        aria-label="Move down"
        disabled={!isDirectionActive}
      >
        ▼
      </button>
      <div className="control-actions">
        <button onClick={onPrimaryAction} className="action-btn">
          {primaryActionLabel[status]}
        </button>
      </div>
    </div>
  );
};

export default Controls;
