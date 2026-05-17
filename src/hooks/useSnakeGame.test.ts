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

  expect(gameState.status).toBe('idle');
  expect(gameState.score).toBe(0);
  expect(gameState.snake).toEqual(INITIAL_SNAKE);
});

test('startGame transitions to a running state', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });

  expect(result.current.gameState.status).toBe('running');
});

test('tracks elapsed time only while running', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  expect(result.current.elapsedSeconds).toBe(0);

  act(() => {
    vi.advanceTimersByTime(3000);
  });
  expect(result.current.elapsedSeconds).toBe(0);

  act(() => {
    result.current.startGame();
  });
  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.elapsedSeconds).toBe(1);
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

  expect(result.current.gameState.status).toBe('paused');
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

  expect(result.current.gameState.status).toBe('running');
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

test('elapsed time pauses and resumes without losing accumulated time', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  act(() => {
    result.current.pauseGame();
  });
  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(result.current.elapsedSeconds).toBe(1);

  act(() => {
    result.current.changeDirection('RIGHT');
  });
  act(() => {
    result.current.resumeGame();
  });
  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.elapsedSeconds).toBe(2);
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

  expect(result.current.gameState.status).toBe('gameOver');

  const snakeAtGameOver = result.current.gameState.snake;

  act(() => {
    vi.advanceTimersByTime(GAME_SPEED * 10);
  });

  expect(result.current.gameState.snake).toEqual(snakeAtGameOver);
});

test('elapsed time stops at game over', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    vi.advanceTimersByTime(GAME_SPEED * TICKS_TO_GAME_OVER);
  });

  expect(result.current.gameState.status).toBe('gameOver');

  const elapsedAtGameOver = result.current.elapsedSeconds;

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(result.current.elapsedSeconds).toBe(elapsedAtGameOver);
});

test('elapsed time resets when starting a new game', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.elapsedSeconds).toBe(1);

  act(() => {
    result.current.startGame();
  });

  expect(result.current.gameState.status).toBe('running');
  expect(result.current.elapsedSeconds).toBe(0);
});

test('elapsed time resets when restarting with the primary action', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => {
    result.current.startGame();
  });
  act(() => {
    vi.advanceTimersByTime(GAME_SPEED * TICKS_TO_GAME_OVER);
  });

  expect(result.current.gameState.status).toBe('gameOver');
  expect(result.current.elapsedSeconds).toBeGreaterThan(0);

  act(() => {
    result.current.togglePrimaryAction();
  });

  expect(result.current.gameState.status).toBe('running');
  expect(result.current.elapsedSeconds).toBe(0);
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

const inactiveDirectionCases = [
  ['idle', () => undefined],
  [
    'gameOver',
    (result: { current: ReturnType<typeof useSnakeGame> }) => {
      act(() => result.current.startGame());
      act(() => vi.advanceTimersByTime(GAME_SPEED * TICKS_TO_GAME_OVER));
    },
  ],
] as const;

test.each(inactiveDirectionCases)(
  'changeDirection is ignored in %s state',
  (_targetStatus, prepareState) => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSnakeGame());

    prepareState(result);

    const stateBefore = result.current.gameState;

    act(() => {
      result.current.changeDirection('RIGHT');
    });

    expect(result.current.gameState).toBe(stateBefore);
  },
);

test('changeDirection is accepted while paused', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useSnakeGame());

  act(() => result.current.startGame());
  act(() => result.current.pauseGame());
  act(() => result.current.changeDirection('RIGHT'));

  expect(result.current.gameState.nextDirection).toBe('RIGHT');
});
