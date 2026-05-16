import { BOARD_SIZE, INITIAL_SNAKE } from './constants';
import {
  createInitialGameState,
  pauseGame,
  queueDirection,
  resumeGame,
  startGame,
  tick,
} from './engine';
import type { GameState, Position } from './types';

function runningState(overrides: Partial<GameState> = {}): GameState {
  return {
    snake: INITIAL_SNAKE.map((segment) => ({ ...segment })),
    food: { x: 0, y: 0 },
    direction: 'UP',
    nextDirection: 'UP',
    gameOver: false,
    gameWon: false,
    score: 0,
    isRunning: true,
    ...overrides,
  };
}

function fullSnakeExcept(emptyPosition: Position): Position[] {
  const snake: Position[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (x !== emptyPosition.x || y !== emptyPosition.y) {
        snake.push({ x, y });
      }
    }
  }

  return snake;
}

describe('game engine', () => {
  test('creates an idle initial state with valid food', () => {
    const state = createInitialGameState(() => 0);

    expect(state.snake).toEqual(INITIAL_SNAKE);
    expect(state.food).toEqual({ x: 0, y: 0 });
    expect(state.direction).toBe('UP');
    expect(state.nextDirection).toBe('UP');
    expect(state.score).toBe(0);
    expect(state.isRunning).toBe(false);
    expect(state.gameOver).toBe(false);
    expect(state.gameWon).toBe(false);
  });

  test.each([
    ['UP', { x: 5, y: 4 }],
    ['DOWN', { x: 5, y: 6 }],
    ['LEFT', { x: 4, y: 5 }],
    ['RIGHT', { x: 6, y: 5 }],
  ] as const)('moves one cell %s', (direction, expectedHead) => {
    const state = runningState({
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ],
      direction,
      nextDirection: direction,
      food: { x: 0, y: 0 },
    });

    expect(tick(state).snake[0]).toEqual(expectedHead);
  });

  test('stops the game on wall collision', () => {
    const state = runningState({
      snake: [{ x: 0, y: 0 }],
      direction: 'UP',
      nextDirection: 'UP',
    });

    expect(tick(state)).toMatchObject({
      gameOver: true,
      isRunning: false,
    });
  });

  test('allows moving into the vacated tail cell when not eating', () => {
    const state = runningState({
      snake: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 0 },
      ],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      food: { x: 0, y: 0 },
    });

    expect(tick(state)).toMatchObject({
      snake: [
        { x: 2, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      gameOver: false,
    });
  });

  test('stops the game when moving into a retained body segment', () => {
    const state = runningState({
      snake: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 1, y: 2 },
      ],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      food: { x: 0, y: 0 },
    });

    expect(tick(state)).toMatchObject({
      gameOver: true,
      isRunning: false,
    });
  });

  test('grows the snake and increments score after eating food', () => {
    const state = runningState({
      snake: [
        { x: 1, y: 0 },
        { x: 0, y: 0 },
      ],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      food: { x: 2, y: 0 },
      score: 2,
    });

    const next = tick(state, () => 0);

    expect(next.score).toBe(3);
    expect(next.snake).toHaveLength(3);
    expect(next.snake[0]).toEqual({ x: 2, y: 0 });
    expect(next.food).not.toEqual({ x: 2, y: 0 });
  });

  test('score accumulates correctly across consecutive food events', () => {
    // Food is always placed at the first available cell (random = 0).
    const deterministicRandom = () => 0;

    const state = runningState({
      snake: [
        { x: 1, y: 0 },
        { x: 0, y: 0 },
      ],
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      food: { x: 2, y: 0 },
      score: 0,
    });

    const afterFirst = tick(state, deterministicRandom);

    expect(afterFirst.score).toBe(1);
    expect(afterFirst.snake).toHaveLength(3);

    const afterSecond = tick(
      { ...afterFirst, food: { x: 3, y: 0 }, nextDirection: 'RIGHT' },
      deterministicRandom,
    );

    expect(afterSecond.score).toBe(2);
    expect(afterSecond.snake).toHaveLength(4);
  });

  test('marks the game as won when food is eaten on the final empty cell', () => {
    const food = { x: 1, y: 0 };
    const snake = fullSnakeExcept(food);
    const state = runningState({
      snake,
      food,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: snake.length - 1,
    });

    const next = tick(state);

    expect(next.food).toBeNull();
    expect(next.gameWon).toBe(true);
    expect(next.isRunning).toBe(false);
    expect(next.score).toBe(BOARD_SIZE * BOARD_SIZE - 1);
  });

  test('keeps rapid opposite input deterministic until the next tick', () => {
    const state = runningState({
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
      ],
      direction: 'UP',
      nextDirection: 'UP',
    });

    const queuedRight = queueDirection(state, 'RIGHT');
    const illegalBeforeTick = queueDirection(queuedRight, 'DOWN');
    const next = tick(illegalBeforeTick);

    expect(illegalBeforeTick.nextDirection).toBe('RIGHT');
    expect(next.direction).toBe('RIGHT');
    expect(next.snake[0]).toEqual({ x: 6, y: 5 });
  });

  test('handles start, pause, and resume lifecycle actions', () => {
    const started = startGame(() => 0);
    const paused = pauseGame(started);
    const resumed = resumeGame(paused);

    expect(started.isRunning).toBe(true);
    expect(paused.isRunning).toBe(false);
    expect(resumed.isRunning).toBe(true);
  });

  const guardedLifecycleCases: Array<
    [string, (state: GameState) => GameState, GameState]
  > = [
    [
      'pausing an already paused game',
      pauseGame,
      runningState({ isRunning: false }),
    ],
    ['pausing a game over state', pauseGame, runningState({ gameOver: true })],
    ['pausing a won state', pauseGame, runningState({ gameWon: true })],
    ['resuming an already running game', resumeGame, runningState()],
    [
      'resuming a game over state',
      resumeGame,
      runningState({ gameOver: true }),
    ],
    ['resuming a won state', resumeGame, runningState({ gameWon: true })],
  ];

  test.each(guardedLifecycleCases)(
    'returns the same state when %s',
    (_name, action, state) => {
      expect(action(state)).toBe(state);
    },
  );

  test('does not advance an idle game', () => {
    const state = createInitialGameState(() => 0);

    expect(tick(state)).toBe(state);
  });

  test('does not advance terminal games', () => {
    const over = runningState({ gameOver: true });
    const won = runningState({ gameWon: true });

    expect(tick(over)).toBe(over);
    expect(tick(won)).toBe(won);
  });

  test('ends the game if the snake has no head', () => {
    expect(tick(runningState({ snake: [] }))).toMatchObject({
      gameOver: true,
      isRunning: false,
    });
  });
});
