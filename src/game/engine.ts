import { INITIAL_DIRECTION, INITIAL_SNAKE } from './constants';
import { placeFood } from './food';
import {
  getNextPosition,
  isOppositeDirection,
  isOutOfBounds,
  positionsEqual,
} from './movement';
import { Direction, GameState, Position } from './types';

export function createInitialGameState(
  random: () => number = Math.random,
): GameState {
  const snake = INITIAL_SNAKE.map((segment) => ({ ...segment }));

  return {
    snake,
    food: placeFood(snake, random),
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    gameOver: false,
    gameWon: false,
    score: 0,
    isRunning: false,
  };
}

export function startGame(random: () => number = Math.random): GameState {
  return {
    ...createInitialGameState(random),
    isRunning: true,
  };
}

export function pauseGame(state: GameState): GameState {
  if (!state.isRunning || state.gameOver || state.gameWon) {
    return state;
  }

  return {
    ...state,
    isRunning: false,
  };
}

export function resumeGame(state: GameState): GameState {
  if (state.isRunning || state.gameOver || state.gameWon) {
    return state;
  }

  return {
    ...state,
    isRunning: true,
  };
}

export function queueDirection(
  state: GameState,
  nextDirection: Direction,
): GameState {
  if (isOppositeDirection(state.direction, nextDirection)) {
    return state;
  }

  return {
    ...state,
    nextDirection,
  };
}

function collidesWithSnake(
  position: Position,
  snake: Position[],
  ateFood: boolean,
): boolean {
  const occupiedSegments = ateFood ? snake : snake.slice(0, -1);

  return occupiedSegments.some((segment) => positionsEqual(position, segment));
}

export function tick(
  state: GameState,
  random: () => number = Math.random,
): GameState {
  if (!state.isRunning || state.gameOver || state.gameWon) {
    return state;
  }

  const head = state.snake[0];

  if (!head) {
    return {
      ...state,
      gameOver: true,
      isRunning: false,
    };
  }

  const direction = state.nextDirection;
  const nextHead = getNextPosition(head, direction);

  if (isOutOfBounds(nextHead)) {
    return {
      ...state,
      direction,
      nextDirection: direction,
      gameOver: true,
      isRunning: false,
    };
  }

  const ateFood = state.food !== null && positionsEqual(nextHead, state.food);

  if (collidesWithSnake(nextHead, state.snake, ateFood)) {
    return {
      ...state,
      direction,
      nextDirection: direction,
      gameOver: true,
      isRunning: false,
    };
  }

  const snake = ateFood
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, -1)];
  const food = ateFood ? placeFood(snake, random) : state.food;
  const gameWon = ateFood && food === null;

  return {
    ...state,
    snake,
    food,
    direction,
    nextDirection: direction,
    gameWon,
    isRunning: gameWon ? false : state.isRunning,
    score: ateFood ? state.score + 1 : state.score,
  };
}
