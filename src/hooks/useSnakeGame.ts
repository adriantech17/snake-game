import { useState, useEffect } from 'react';
import { GAME_SPEED } from '../game/constants';
import {
  createInitialGameState,
  pauseGame as pauseGameState,
  queueDirection,
  resumeGame as resumeGameState,
  startGame as startGameState,
  tick,
} from '../game/engine';
import type { Direction, GameState } from '../types';

/** Pure reducer used by both the keyboard handler and the exposed toggle. */
function resolvePrimaryAction(state: GameState): GameState {
  if (
    state.status === 'idle' ||
    state.status === 'gameOver' ||
    state.status === 'won'
  ) {
    return startGameState();
  }

  if (state.status === 'running') {
    return pauseGameState(state);
  }

  return resumeGameState(state);
}

function queueDirectionIfActive(
  state: GameState,
  nextDirection: Direction,
): GameState {
  if (state.status !== 'running' && state.status !== 'paused') {
    return state;
  }

  return queueDirection(state, nextDirection);
}

export function useSnakeGame() {
  const [gameState, setGameState] = useState(() => createInitialGameState());

  function startGame() {
    setGameState(startGameState());
  }

  function pauseGame() {
    setGameState(pauseGameState);
  }

  function resumeGame() {
    setGameState(resumeGameState);
  }

  function togglePrimaryAction() {
    setGameState(resolvePrimaryAction);
  }

  function changeDirection(newDirection: Direction) {
    setGameState((prev) => queueDirectionIfActive(prev, newDirection));
  }

  // Game loop
  useEffect(() => {
    if (gameState.status !== 'running') {
      return;
    }

    const gameLoopId = window.setInterval(() => {
      setGameState((prev) => tick(prev));
    }, GAME_SPEED);

    return () => {
      clearInterval(gameLoopId);
    };
  }, [gameState.status]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setGameState((prev) => queueDirectionIfActive(prev, 'UP'));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setGameState((prev) => queueDirectionIfActive(prev, 'DOWN'));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setGameState((prev) => queueDirectionIfActive(prev, 'LEFT'));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setGameState((prev) => queueDirectionIfActive(prev, 'RIGHT'));
          break;
        case ' ':
          e.preventDefault();
          setGameState(resolvePrimaryAction);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    togglePrimaryAction,
    changeDirection,
  };
}
