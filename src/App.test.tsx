import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, vi } from 'vitest';
import App from './App';
import { GAME_SPEED, INITIAL_SNAKE } from './game/constants';

// Ticks needed for the initial UP-moving snake to leave the board:
// head starts at y=INITIAL_SNAKE[0].y; it exits at y=-1.
const TICKS_TO_GAME_OVER = INITIAL_SNAKE[0].y + 1;

function setup() {
  const user = userEvent.setup();
  const view = render(<App />);

  return { user, ...view };
}

function expectSnakeHeadAt(x: number, y: number) {
  const head = screen.getByTestId('snake-head');

  expect(head).toHaveAttribute('data-x', String(x));
  expect(head).toHaveAttribute('data-y', String(y));
}

async function advanceGame(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

afterEach(() => {
  vi.useRealTimers();
});

test('renders the snake game heading', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /snake game/i }),
  ).toBeInTheDocument();
  expect(screen.getByText('Time: 00:00')).toBeInTheDocument();
});

test('renders accessible direction controls', () => {
  render(<App />);

  expect(
    screen.getByRole('img', { name: /snake game board/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Move up' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Move left' })).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Move right' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Move down' })).toBeInTheDocument();
});

test('starts, pauses, and resumes from visible controls', async () => {
  const { user } = setup();

  expect(screen.getByText('Ready')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Start' }));
  expect(screen.getByText('Playing...')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Pause' }));
  expect(screen.getByText('Paused')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Resume' }));
  expect(screen.getByText('Playing...')).toBeInTheDocument();
});

test('toggles start, pause, and resume with the spacebar', async () => {
  const { user } = setup();

  await user.keyboard('[Space]');
  expect(screen.getByText('Playing...')).toBeInTheDocument();

  await user.keyboard('[Space]');
  expect(screen.getByText('Paused')).toBeInTheDocument();

  await user.keyboard('[Space]');
  expect(screen.getByText('Playing...')).toBeInTheDocument();
});

test('restarts with the spacebar after game over', async () => {
  vi.useFakeTimers();
  render(<App />);

  fireEvent.keyDown(window, { key: ' ' });
  await advanceGame(GAME_SPEED * TICKS_TO_GAME_OVER);
  expect(screen.getAllByText(/game over/i)).toHaveLength(2);

  fireEvent.keyDown(window, { key: ' ' });
  expect(screen.getByText('Playing...')).toBeInTheDocument();
  expect(screen.queryByText(/game over/i)).not.toBeInTheDocument();
});

test('restarts with the visible control after game over', async () => {
  vi.useFakeTimers();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
  await advanceGame(GAME_SPEED * TICKS_TO_GAME_OVER);
  expect(screen.getAllByText(/game over/i)).toHaveLength(2);

  fireEvent.click(screen.getByRole('button', { name: 'Restart' }));
  expect(screen.getByText('Playing...')).toBeInTheDocument();
  expect(screen.queryByText(/game over/i)).not.toBeInTheDocument();
});

test('changes direction from keyboard input before the next tick', async () => {
  vi.useFakeTimers();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  await advanceGame(GAME_SPEED);

  expectSnakeHeadAt(11, 10);
});

test.each([
  ['ArrowLeft', 9, 10],
  ['a', 9, 10],
  ['A', 9, 10],
  ['d', 11, 10],
  ['D', 11, 10],
] as const)('changes direction from the %s key', async (key, x, y) => {
  vi.useFakeTimers();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
  fireEvent.keyDown(window, { key });
  await advanceGame(GAME_SPEED);

  expectSnakeHeadAt(x, y);
});

test.each([
  ['ArrowUp', 11, 9],
  ['ArrowDown', 11, 11],
  ['w', 11, 9],
  ['W', 11, 9],
  ['s', 11, 11],
  ['S', 11, 11],
] as const)(
  'changes direction from the %s key after horizontal movement',
  async (key, x, y) => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.keyDown(window, { key: 'd' });
    await advanceGame(GAME_SPEED);
    fireEvent.keyDown(window, { key });
    await advanceGame(GAME_SPEED);

    expectSnakeHeadAt(x, y);
  },
);

test('changes direction from pointer controls', async () => {
  vi.useFakeTimers();
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
  fireEvent.click(screen.getByRole('button', { name: 'Move right' }));
  await advanceGame(GAME_SPEED);

  expectSnakeHeadAt(11, 10);
});
