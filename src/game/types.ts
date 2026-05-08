export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position | null;
  direction: Direction;
  nextDirection: Direction;
  gameOver: boolean;
  gameWon: boolean;
  score: number;
  isRunning: boolean;
}
