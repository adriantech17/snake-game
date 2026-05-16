import { render, screen } from '@testing-library/react';
import { BOARD_SIZE } from '../game/constants';
import GameBoard from './GameBoard';

test('renders an accessible game board with snake and food', () => {
  render(
    <GameBoard
      boardSize={BOARD_SIZE}
      snake={[
        { x: 10, y: 10 },
        { x: 10, y: 11 },
      ]}
      food={{ x: 3, y: 4 }}
      gameOver={false}
    />,
  );

  expect(
    screen.getByRole('img', { name: /snake game board/i }),
  ).toBeInTheDocument();
  expect(screen.getByTestId('snake-head')).toHaveAttribute('data-x', '10');
  expect(screen.getByTestId('snake-head')).toHaveAttribute('data-y', '10');
  expect(screen.getByTestId('food')).toHaveAttribute('data-x', '3');
  expect(screen.getByTestId('food')).toHaveAttribute('data-y', '4');
  expect(screen.queryByText(/press space to restart/i)).not.toBeInTheDocument();
});

test('renders game over overlay', () => {
  render(
    <GameBoard
      boardSize={BOARD_SIZE}
      snake={[{ x: 10, y: 10 }]}
      food={null}
      gameOver
    />,
  );

  expect(screen.getByText(/game over/i)).toBeInTheDocument();
  expect(screen.getByText(/press space to restart/i)).toBeInTheDocument();
});

test('renders win overlay', () => {
  render(
    <GameBoard
      boardSize={BOARD_SIZE}
      snake={[{ x: 10, y: 10 }]}
      food={null}
      gameOver={false}
      gameWon
    />,
  );

  expect(screen.getByText(/you win/i)).toBeInTheDocument();
  expect(screen.getByText(/press space to restart/i)).toBeInTheDocument();
});

test('renders an empty board without optional pieces', () => {
  render(
    <GameBoard
      boardSize={BOARD_SIZE}
      snake={[]}
      food={null}
      gameOver={false}
    />,
  );

  expect(
    screen.getByRole('img', { name: /snake game board/i }),
  ).toBeInTheDocument();
  expect(screen.queryByTestId('snake-head')).not.toBeInTheDocument();
  expect(screen.queryByTestId('food')).not.toBeInTheDocument();
});
