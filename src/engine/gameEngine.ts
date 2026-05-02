/**
 * Pure game engine — zero React dependencies.
 * All functions are referentially transparent: given the same input they always
 * produce the same output, making the logic trivially unit-testable.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const BOARD_SIZE = 20 as const;
export const GAME_SPEED_MS = 150 as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface GameState {
  readonly snake: readonly Position[];
  readonly food: Position;
  /** Direction that was applied on the last tick */
  readonly direction: Direction;
  /** Direction queued by the player, applied on the NEXT tick.
   *  Decouples input from the game loop to prevent 180° reversal bugs
   *  caused by two rapid key presses between ticks. */
  readonly nextDirection: Direction;
  readonly gameOver: boolean;
  readonly score: number;
  readonly isRunning: boolean;
  readonly highScore: number;
}

// ─── Internal constants ───────────────────────────────────────────────────────

const OPPOSITE: Readonly<Record<Direction, Direction>> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
} as const;

const DELTA: Readonly<Record<Direction, Position>> = {
  UP:    { x:  0, y: -1 },
  DOWN:  { x:  0, y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
} as const;

const INITIAL_SNAKE: readonly Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function posKey(p: Position): string {
  return `${p.x},${p.y}`;
}

/**
 * Picks a random empty cell using a Set for O(1) occupancy checks.
 * Guards against the (theoretical) edge case of a completely full board.
 */
function generateFood(snake: readonly Position[]): Position {
  const occupied = new Set(snake.map(posKey));
  const totalCells = BOARD_SIZE * BOARD_SIZE;

  if (occupied.size >= totalCells) {
    // Board is full — the player has won; return first cell as sentinel.
    return snake[0] ?? { x: 0, y: 0 };
  }

  let candidate: Position;
  do {
    candidate = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (occupied.has(posKey(candidate)));

  return candidate;
}

// ─── Public API (pure functions) ──────────────────────────────────────────────

export function createInitialState(highScore = 0): GameState {
  return {
    snake: INITIAL_SNAKE,
    food: generateFood(INITIAL_SNAKE),
    direction: 'UP',
    nextDirection: 'UP',
    gameOver: false,
    score: 0,
    isRunning: false,
    highScore,
  };
}

/** Advance the game by one tick. Returns the same reference when idle. */
export function tick(state: GameState): GameState {
  if (!state.isRunning || state.gameOver) return state;

  const direction = state.nextDirection;
  const delta = DELTA[direction];
  const head = state.snake[0];

  // Unreachable in practice, but satisfies `noUncheckedIndexedAccess`.
  if (head === undefined) return state;

  const newHead: Position = {
    x: head.x + delta.x,
    y: head.y + delta.y,
  };

  // ── Wall collision ──────────────────────────────────────────────────────────
  if (
    newHead.x < 0 || newHead.x >= BOARD_SIZE ||
    newHead.y < 0 || newHead.y >= BOARD_SIZE
  ) {
    return {
      ...state,
      direction,
      gameOver: true,
      isRunning: false,
      highScore: Math.max(state.score, state.highScore),
    };
  }

  // ── Self-collision ──────────────────────────────────────────────────────────
  // Exclude the tail: it vacates its cell this same tick, so overlapping it is
  // valid — a technique known as the "tail exclusion" rule.
  const bodyWithoutTail = state.snake.slice(0, -1);
  const occupied = new Set(bodyWithoutTail.map(posKey));
  if (occupied.has(posKey(newHead))) {
    return {
      ...state,
      direction,
      gameOver: true,
      isRunning: false,
      highScore: Math.max(state.score, state.highScore),
    };
  }

  // ── Normal movement / food ──────────────────────────────────────────────────
  const ateFood = newHead.x === state.food.x && newHead.y === state.food.y;
  const newSnake: readonly Position[] = ateFood
    ? [newHead, ...state.snake]
    : [newHead, ...state.snake.slice(0, -1)];

  return {
    ...state,
    direction,
    snake: newSnake,
    food: ateFood ? generateFood(newSnake) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}

/** Queue a direction change, silently ignoring illegal 180° reversals. */
export function queueDirection(state: GameState, direction: Direction): GameState {
  if (OPPOSITE[direction] === state.direction) return state;
  return { ...state, nextDirection: direction };
}

export function startGame(highScore: number): GameState {
  return { ...createInitialState(highScore), isRunning: true };
}

export function pauseGame(state: GameState): GameState {
  return { ...state, isRunning: false };
}

export function resumeGame(state: GameState): GameState {
  if (state.gameOver) return state;
  return { ...state, isRunning: true };
}
