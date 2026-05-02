import { useReducer, useEffect, useRef, useCallback } from 'react';
import {
  type GameState,
  type Direction,
  BOARD_SIZE,
  GAME_SPEED_MS,
  createInitialState,
  tick,
  queueDirection,
  startGame,
  pauseGame,
  resumeGame,
} from '../engine/gameEngine';

// ─── Reducer ──────────────────────────────────────────────────────────────────

type GameAction =
  | { readonly type: 'TICK' }
  | { readonly type: 'START' }
  | { readonly type: 'PAUSE' }
  | { readonly type: 'RESUME' }
  | { readonly type: 'DIRECTION'; readonly direction: Direction };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TICK':      return tick(state);
    case 'START':     return startGame(state.highScore);
    case 'PAUSE':     return pauseGame(state);
    case 'RESUME':    return resumeGame(state);
    case 'DIRECTION': return queueDirection(state, action.direction);
  }
}

// ─── Keyboard map ─────────────────────────────────────────────────────────────

const KEY_TO_DIRECTION: Readonly<Record<string, Direction>> = {
  ArrowUp: 'UP',    w: 'UP',    W: 'UP',
  ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
  ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
  ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
} as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSnakeGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    (): GameState => createInitialState(Number(localStorage.getItem('snakeHighScore') ?? 0)),
  );

  const rafRef       = useRef<number | null>(null);
  const lastTickRef  = useRef<number>(0);

  // ── Persist high score ──────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('snakeHighScore', String(state.highScore));
  }, [state.highScore]);

  // ── requestAnimationFrame game loop — drift-free timing ────────────────────
  useEffect(() => {
    if (!state.isRunning || state.gameOver) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const loop = (timestamp: number): void => {
      if (timestamp - lastTickRef.current >= GAME_SPEED_MS) {
        lastTickRef.current = timestamp;
        dispatch({ type: 'TICK' });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    lastTickRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [state.isRunning, state.gameOver]);

  // ── Keyboard controls ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const direction = KEY_TO_DIRECTION[e.key];
      if (direction !== undefined) {
        e.preventDefault();
        dispatch({ type: 'DIRECTION', direction });
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (state.gameOver)      dispatch({ type: 'START' });
        else if (state.isRunning) dispatch({ type: 'PAUSE' });
        else                      dispatch({ type: 'RESUME' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameOver, state.isRunning]);

  // ── Stable callbacks (React Compiler also handles this automatically) ───────
  const handleStart     = useCallback(() => dispatch({ type: 'START' }),   []);
  const handlePause     = useCallback(() => dispatch({ type: 'PAUSE' }),   []);
  const handleResume    = useCallback(() => dispatch({ type: 'RESUME' }),  []);
  const handleDirection = useCallback(
    (direction: Direction) => dispatch({ type: 'DIRECTION', direction }),
    [],
  );

  return {
    gameState:       state,
    BOARD_SIZE,
    startGame:       handleStart,
    pauseGame:       handlePause,
    resumeGame:      handleResume,
    changeDirection: handleDirection,
  } as const;
}

