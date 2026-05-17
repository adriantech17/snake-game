import { render, screen } from '@testing-library/react';
import ScoreBoard from './ScoreBoard';

test('renders the current score and paused state', () => {
  render(<ScoreBoard score={7} status="paused" elapsedSeconds={83} />);

  expect(
    screen.getByRole('heading', { name: /snake game/i }),
  ).toBeInTheDocument();
  expect(screen.getByText('Score: 7')).toBeInTheDocument();
  expect(screen.getByText('Time: 01:23')).toBeInTheDocument();
  expect(screen.getByText('Paused')).toBeInTheDocument();
});

test.each([
  ['idle', 'Ready'],
  ['running', 'Playing...'],
  ['gameOver', 'Game Over!'],
  ['won', 'You Win!'],
] as const)('renders the %s status', (status, expectedStatus) => {
  render(<ScoreBoard score={0} status={status} elapsedSeconds={0} />);

  expect(screen.getByText(expectedStatus)).toBeInTheDocument();
});
