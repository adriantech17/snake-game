import { BOARD_SIZE } from './constants';
import { Position } from './types';

function positionKey(position: Position): string {
  return `${position.x},${position.y}`;
}

export function getAvailableFoodPositions(snake: Position[]): Position[] {
  const occupied = new Set(snake.map(positionKey));
  const available: Position[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const position = { x, y };
      if (!occupied.has(positionKey(position))) {
        available.push(position);
      }
    }
  }

  return available;
}

export function placeFood(
  snake: Position[],
  random: () => number = Math.random,
): Position | null {
  const available = getAvailableFoodPositions(snake);

  if (available.length === 0) {
    return null;
  }

  const index = Math.min(
    Math.floor(random() * available.length),
    available.length - 1,
  );

  return available[index] ?? available[0];
}
