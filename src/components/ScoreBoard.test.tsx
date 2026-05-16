import { render, screen } from '@testing-library/react';
import ScoreBoard from './ScoreBoard';

test('renders the current score and paused state', () => {
  render(
    <ScoreBoard score={7} isRunning={false} gameOver={false} gameWon={false} />,
  );

  expect(
    screen.getByRole('heading', { name: /snake game/i }),
  ).toBeInTheDocument();
  expect(screen.getByText('Score: 7')).toBeInTheDocument();
  expect(screen.getByText('Paused')).toBeInTheDocument();
});

test.each([
  [
    'playing',
    { isRunning: true, gameOver: false, gameWon: false },
    'Playing...',
  ],
  [
    'game over',
    { isRunning: false, gameOver: true, gameWon: false },
    'Game Over!',
  ],
  ['win', { isRunning: false, gameOver: false, gameWon: true }, 'You Win!'],
] as const)('renders the %s status', (_name, state, expectedStatus) => {
  render(<ScoreBoard score={0} {...state} />);

  expect(screen.getByText(expectedStatus)).toBeInTheDocument();
});
