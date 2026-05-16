import { BOARD_SIZE } from './constants';
import { getAvailableFoodPositions, placeFood } from './food';
import type { Position } from './types';

function fullBoard(): Position[] {
  const positions: Position[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      positions.push({ x, y });
    }
  }

  return positions;
}

describe('food placement', () => {
  test('places food at the only available cell when the board is almost full', () => {
    // Fill the board except for the bottom-right corner.
    const snake = fullBoard().filter(
      (p) => !(p.x === BOARD_SIZE - 1 && p.y === BOARD_SIZE - 1),
    );
    // Any random value works when there is only one cell left; () => 0 makes that explicit.
    expect(placeFood(snake, () => 0)).toEqual({
      x: BOARD_SIZE - 1,
      y: BOARD_SIZE - 1,
    });
  });

  test('excludes occupied positions and preserves board order', () => {
    const available = getAvailableFoodPositions([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]);

    expect(available).toHaveLength(BOARD_SIZE * BOARD_SIZE - 2);
    expect(available).not.toContainEqual({ x: 0, y: 0 });
    expect(available).not.toContainEqual({ x: 1, y: 0 });
    expect(available.slice(0, 3)).toEqual([
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ]);
  });

  test('clamps a random value of 1 to the final available position', () => {
    expect(placeFood([], () => 1)).toEqual({
      x: BOARD_SIZE - 1,
      y: BOARD_SIZE - 1,
    });
  });

  test('falls back to the first available position for an invalid random index', () => {
    expect(placeFood([], () => -1)).toEqual({ x: 0, y: 0 });
  });

  test('returns null when the board is completely full', () => {
    expect(placeFood(fullBoard())).toBeNull();
  });

  test('places food at the midpoint cell when random returns 0.5', () => {
    // random=0.5 on an empty board: index = floor(0.5 * 400) = 200.
    // Board is scanned row-first (y outer, x inner), so index 200 = { x: 0, y: 10 }.
    expect(placeFood([], () => 0.5)).toEqual({ x: 0, y: 10 });
  });
});
