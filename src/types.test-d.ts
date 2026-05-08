import { assertType, expectTypeOf } from 'vitest';
import type { Direction, GameState, Position } from './types';

assertType<Direction>('UP');
assertType<Direction>('DOWN');
assertType<Direction>('LEFT');
assertType<Direction>('RIGHT');

expectTypeOf<Position>().toEqualTypeOf<{ x: number; y: number }>();

expectTypeOf<GameState>().toEqualTypeOf<{
  snake: Position[];
  food: Position | null;
  direction: Direction;
  nextDirection: Direction;
  gameOver: boolean;
  gameWon: boolean;
  score: number;
  isRunning: boolean;
}>();
