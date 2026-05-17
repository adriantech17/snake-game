export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'idle' | 'running' | 'paused' | 'gameOver' | 'won';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position | null;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  status: GameStatus;
}
