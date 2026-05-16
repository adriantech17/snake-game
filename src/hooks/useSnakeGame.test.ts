import { act, renderHook } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { GAME_SPEED, INITIAL_SNAKE } from '../game/constants';
import { useSnakeGame } from './useSnakeGame';

// Ticks until the default UP-moving snake exits the top wall.
const TICKS_TO_GAME_OVER = INITIAL_SNAKE[0].y + 1;

afterEach(() => {
  vi.useRealTimers();
});

test('initializes with an idle, non-terminal state', () => {
  const { result } = renderHook(() => useSnakeGame());
  const { gameState } = result.current;

  expect(gameState.isRunning).toBe(false);
  expect(gameState.gameOver).toBe(false);
  expect(gameState.gameWon).toBe(false);
  expect(gameState.score).toBe(0);
  expect(gameState.snake).toEqual(INITIAL_SNAKE);
});

test('startGame transitions to a running state', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });

  expect(result.current.gameState.isRunning).toBe(true);
  expect(result.current.gameState.gameOver).toBe(false);
});

test('pauseGame stops a running game without ending it', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    result.current.pauseGame();
  });

  expect(result.current.gameState.isRunning).toBe(false);
  expect(result.current.gameState.gameOver).toBe(false);
});

test('resumeGame restarts a paused game without resetting state', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  // Advance one tick so the snake moves and gives us a non-initial position.
  act(() => {
    vi.advanceTimersByTime(GAME_SPEED);
  });

  const snakeBeforePause = result.current.gameState.snake;
  const scoreBeforePause = result.current.gameState.score;

  act(() => {
    result.current.pauseGame();
  });
  act(() => {
    result.current.resumeGame();
  });

  expect(result.current.gameState.isRunning).toBe(true);
  expect(result.current.gameState.gameOver).toBe(false);
  // State must be preserved, not reset to initial values.
  expect(result.current.gameState.snake).toEqual(snakeBeforePause);
  expect(result.current.gameState.score).toBe(scoreBeforePause);
});

test('game loop advances the snake on each tick interval', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());
  const initialY = result.current.gameState.snake[0].y;

  act(() => {
    result.current.startGame();
  });
  act(() => {
    vi.advanceTimersByTime(GAME_SPEED);
  });

  // Default direction is UP so y decreases by 1 per tick.
  expect(result.current.gameState.snake[0].y).toBe(initialY - 1);
});

test('game loop does not advance while paused', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    result.current.pauseGame();
  });

  const snakeAfterPause = result.current.gameState.snake;

  act(() => {
    vi.advanceTimersByTime(GAME_SPEED * 5);
  });

  expect(result.current.gameState.snake).toEqual(snakeAfterPause);
});

test('does not advance after game over', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    vi.advanceTimersByTime(GAME_SPEED * TICKS_TO_GAME_OVER);
  });

  expect(result.current.gameState.gameOver).toBe(true);

  const snakeAtGameOver = result.current.gameState.snake;

  act(() => {
    vi.advanceTimersByTime(GAME_SPEED * 10);
  });

  expect(result.current.gameState.snake).toEqual(snakeAtGameOver);
});

test('changeDirection queues a valid direction before the next tick', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());
  const initialX = INITIAL_SNAKE[0].x;

  act(() => {
    result.current.startGame();
  });
  act(() => {
    result.current.changeDirection('RIGHT');
  });
  act(() => {
    vi.advanceTimersByTime(GAME_SPEED);
  });

  expect(result.current.gameState.snake[0].x).toBe(initialX + 1);
});

test('changeDirection ignores the opposite of the current direction', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    result.current.changeDirection('DOWN');
  });

  expect(result.current.gameState.nextDirection).toBe('UP');
});
