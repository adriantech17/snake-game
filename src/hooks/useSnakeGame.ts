import { useEffect, useRef, useState } from 'react';
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

const ELAPSED_TIMER_INTERVAL_MS = 1000;

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

function shouldStartFreshRun(status: GameState['status']): boolean {
  return status === 'idle' || status === 'gameOver' || status === 'won';
}

export function useSnakeGame() {
  const [gameState, setGameState] = useState(() => createInitialGameState());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  // Forces the timer effect to restart when a new run starts while already running.
  const [timerEpoch, setTimerEpoch] = useState(0);
  const accumulatedElapsedMsRef = useRef(0);
  const runStartedAtMsRef = useRef<number | null>(null);

  function resetTimer() {
    accumulatedElapsedMsRef.current = 0;
    runStartedAtMsRef.current = null;
    setElapsedSeconds(0);
    setTimerEpoch((prev) => prev + 1);
  }

  function startGame() {
    resetTimer();
    setGameState(startGameState());
  }

  function pauseGame() {
    setGameState(pauseGameState);
  }

  function resumeGame() {
    setGameState(resumeGameState);
  }

  function togglePrimaryAction() {
    if (shouldStartFreshRun(gameState.status)) {
      resetTimer();
    }

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

    const gameLoopId = setInterval(() => {
      setGameState((prev) => tick(prev));
    }, GAME_SPEED);

    return () => {
      clearInterval(gameLoopId);
    };
  }, [gameState.status]);

  // Elapsed run timer
  useEffect(() => {
    if (gameState.status !== 'running') {
      return;
    }

    runStartedAtMsRef.current = Date.now();
    setElapsedSeconds(Math.floor(accumulatedElapsedMsRef.current / 1000));

    function tick() {
      if (runStartedAtMsRef.current === null) return;
      setElapsedSeconds(
        Math.floor(
          (accumulatedElapsedMsRef.current +
            Date.now() -
            runStartedAtMsRef.current) /
            1000,
        ),
      );
    }

    // Fire at the next second boundary to preserve partial seconds across pauses.
    const msToNextSecond =
      ELAPSED_TIMER_INTERVAL_MS -
      (accumulatedElapsedMsRef.current % ELAPSED_TIMER_INTERVAL_MS);
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, ELAPSED_TIMER_INTERVAL_MS);
    }, msToNextSecond);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      if (runStartedAtMsRef.current !== null) {
        accumulatedElapsedMsRef.current +=
          Date.now() - runStartedAtMsRef.current;
        runStartedAtMsRef.current = null;
      }
    };
  }, [gameState.status, timerEpoch]);

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
          if (shouldStartFreshRun(gameState.status)) {
            resetTimer();
          }
          setGameState(resolvePrimaryAction);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status]);

  return {
    gameState,
    elapsedSeconds,
    startGame,
    pauseGame,
    resumeGame,
    togglePrimaryAction,
    changeDirection,
  };
}
