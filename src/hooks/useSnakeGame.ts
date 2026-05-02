import { useState, useCallback, useRef, useEffect } from 'react';
import { Position, Direction, GameState } from '../types';

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

function getRandomPosition(snake: Position[]): Position {
  const isSnakeOccupied = (pos: Position, snake: Position[]): boolean => {
    return snake.some((segment) => segment.x === pos.x && segment.y === pos.y);
  };
  
  let position: Position = {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  };
  
  while (isSnakeOccupied(position, snake)) {
    position = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  }
  
  return position;
}

export function useSnakeGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: getRandomPosition(INITIAL_SNAKE),
    direction: INITIAL_DIRECTION,
    gameOver: false,
    score: 0,
    isRunning: false,
  });

  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const lastMoveTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setGameState({
      snake: INITIAL_SNAKE,
      food: getRandomPosition(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      gameOver: false,
      score: 0,
      isRunning: true,
    });
    directionRef.current = INITIAL_DIRECTION;
    lastMoveTimeRef.current = Date.now();
  }, []);

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isRunning: true }));
    lastMoveTimeRef.current = Date.now();
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    setGameState((prev) => {
      if (opposites[newDirection] === prev.direction) {
        return prev;
      }
      directionRef.current = newDirection;
      return { ...prev, direction: newDirection };
    });
  }, []);

  const moveSnake = useCallback(() => {
    setGameState((prev) => {
      if (prev.gameOver || !prev.isRunning) return prev;

      const head = prev.snake[0];
      const direction = directionRef.current;

      let newHead: Position;
      switch (direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= BOARD_SIZE ||
        newHead.y < 0 ||
        newHead.y >= BOARD_SIZE
      ) {
        return { ...prev, gameOver: true, isRunning: false };
      }

      // Check self collision
      if (prev.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, gameOver: true, isRunning: false };
      }

      const newSnake = [newHead, ...prev.snake];

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        return {
          ...prev,
          snake: newSnake,
          food: getRandomPosition(newSnake),
          score: prev.score + 1,
        };
      }

      // Remove tail
      newSnake.pop();

      return { ...prev, snake: newSnake };
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isRunning || gameState.gameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = window.setInterval(() => {
      moveSnake();
    }, GAME_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isRunning, gameState.gameOver, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameState.gameOver) {
            startGame();
          } else if (gameState.isRunning) {
            pauseGame();
          } else {
            resumeGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, startGame, pauseGame, resumeGame, gameState.gameOver, gameState.isRunning]);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    changeDirection,
    BOARD_SIZE,
  };
}
