import { useState, useEffect } from 'react';
import { BOARD_SIZE, GAME_SPEED } from '../game/constants';
import {
  createInitialGameState,
  pauseGame as pauseGameState,
  queueDirection,
  resumeGame as resumeGameState,
  startGame as startGameState,
  tick,
} from '../game/engine';
import { Direction } from '../types';

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

  function changeDirection(newDirection: Direction) {
    setGameState((prev) => queueDirection(prev, newDirection));
  }

  // Game loop
  useEffect(() => {
    if (!gameState.isRunning || gameState.gameOver || gameState.gameWon) {
      return;
    }

    const gameLoopId = window.setInterval(() => {
      setGameState((prev) => tick(prev));
    }, GAME_SPEED);

    return () => {
      clearInterval(gameLoopId);
    };
  }, [gameState.isRunning, gameState.gameOver, gameState.gameWon]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setGameState((prev) => queueDirection(prev, 'UP'));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setGameState((prev) => queueDirection(prev, 'DOWN'));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setGameState((prev) => queueDirection(prev, 'LEFT'));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setGameState((prev) => queueDirection(prev, 'RIGHT'));
          break;
        case ' ':
          e.preventDefault();
          if (gameState.gameOver || gameState.gameWon) {
            setGameState(startGameState());
          } else if (gameState.isRunning) {
            setGameState(pauseGameState);
          } else {
            setGameState(resumeGameState);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameOver, gameState.gameWon, gameState.isRunning]);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    changeDirection,
    BOARD_SIZE,
  };
}
