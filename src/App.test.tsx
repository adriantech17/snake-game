import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, vi } from 'vitest';
import App from './App';
import { GAME_SPEED } from './game/constants';

function setup() {
  const user = userEvent.setup();
  const view = render(<App />);

  return { user, ...view };
}

function getSnakeHead(container: HTMLElement): HTMLElement {
  const head = container.querySelector<HTMLElement>('.snake-head');
  if (!head) {
    throw new Error('Expected the snake head to be rendered');
  }

  return head;
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
  setup();
  expect(
    screen.getByRole('heading', { name: /snake game/i }),
  ).toBeInTheDocument();
});

test('renders accessible direction controls', () => {
  setup();

  expect(screen.getByRole('button', { name: 'Move up' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Move left' })).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Move right' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Move down' })).toBeInTheDocument();
});

test('starts, pauses, and resumes from visible controls', async () => {
  const { user } = setup();

  expect(screen.getByText('Paused')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Start' }));
  expect(screen.getByText('Playing...')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Pause' }));
  expect(screen.getByText('Paused')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Start' }));
  expect(screen.getByText('Playing...')).toBeInTheDocument();
});

test('toggles start, pause, resume, and restart with the spacebar', async () => {
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
  await advanceGame(GAME_SPEED * 11);
  expect(screen.getByText('Game Over!')).toBeInTheDocument();

  fireEvent.keyDown(window, { key: ' ' });
  expect(screen.getByText('Playing...')).toBeInTheDocument();
  expect(screen.queryByText('Game Over!')).not.toBeInTheDocument();
});

test('changes direction from keyboard input before the next tick', async () => {
  vi.useFakeTimers();
  const { container } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  await advanceGame(GAME_SPEED);

  expect(getSnakeHead(container)).toHaveStyle({
    left: '55.25%',
    top: '50.25%',
  });
});

test('changes direction from pointer controls', async () => {
  vi.useFakeTimers();
  const { container } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Start' }));
  fireEvent.click(screen.getByRole('button', { name: 'Move right' }));
  await advanceGame(GAME_SPEED);

  expect(getSnakeHead(container)).toHaveStyle({
    left: '55.25%',
    top: '50.25%',
  });
});
