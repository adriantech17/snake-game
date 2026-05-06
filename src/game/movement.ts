import { BOARD_SIZE } from './constants';
import { Direction, Position } from './types';

const DIRECTION_DELTAS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export function getNextPosition(
  head: Position,
  direction: Direction,
): Position {
  const delta = DIRECTION_DELTAS[direction];
  return {
    x: head.x + delta.x,
    y: head.y + delta.y,
  };
}

export function isOppositeDirection(
  direction: Direction,
  otherDirection: Direction,
): boolean {
  return OPPOSITE_DIRECTIONS[direction] === otherDirection;
}

export function isOutOfBounds(position: Position): boolean {
  return (
    position.x < 0 ||
    position.x >= BOARD_SIZE ||
    position.y < 0 ||
    position.y >= BOARD_SIZE
  );
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}
