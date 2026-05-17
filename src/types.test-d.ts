import { assertType, expectTypeOf } from 'vitest';
import type { Direction, GameState, GameStatus, Position } from './types';

assertType<Direction>('UP');
assertType<Direction>('DOWN');
assertType<Direction>('LEFT');
assertType<Direction>('RIGHT');
assertType<GameStatus>('idle');
assertType<GameStatus>('running');
assertType<GameStatus>('paused');
assertType<GameStatus>('gameOver');
assertType<GameStatus>('won');

expectTypeOf<Position>().toEqualTypeOf<{ x: number; y: number }>();

expectTypeOf<GameState>().toEqualTypeOf<{
  snake: Position[];
  food: Position | null;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: GameStatus;
}>();
