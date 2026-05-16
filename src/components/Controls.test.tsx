import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { vi } from 'vitest';
import Controls from './Controls';

function setup(overrides: Partial<ComponentProps<typeof Controls>> = {}) {
  const props: ComponentProps<typeof Controls> = {
    onDirectionChange: vi.fn(),
    onStart: vi.fn(),
    onPauseResume: vi.fn(),
    isRunning: true,
    gameOver: false,
    ...overrides,
  };
  const user = userEvent.setup();
  const view = render(<Controls {...props} />);

  return { props, user, ...view };
}

test('shows a start button and delegates to pause/resume while idle', async () => {
  const { props, user } = setup({ isRunning: false, gameOver: false });

  const startButton = screen.getByRole('button', { name: 'Start' });

  expect(startButton).toBeInTheDocument();

  await user.click(startButton);

  expect(props.onPauseResume).toHaveBeenCalledTimes(1);
  expect(props.onStart).not.toHaveBeenCalled();
});

test('calls direction callbacks from visible controls', async () => {
  const { props, user } = setup();

  await user.click(screen.getByRole('button', { name: 'Move up' }));
  await user.click(screen.getByRole('button', { name: 'Move left' }));
  await user.click(screen.getByRole('button', { name: 'Move right' }));
  await user.click(screen.getByRole('button', { name: 'Move down' }));

  expect(props.onDirectionChange).toHaveBeenNthCalledWith(1, 'UP');
  expect(props.onDirectionChange).toHaveBeenNthCalledWith(2, 'LEFT');
  expect(props.onDirectionChange).toHaveBeenNthCalledWith(3, 'RIGHT');
  expect(props.onDirectionChange).toHaveBeenNthCalledWith(4, 'DOWN');
});

test('uses pause and resume action while the game is not over', async () => {
  const { props, rerender, user } = setup();

  await user.click(screen.getByRole('button', { name: 'Pause' }));
  expect(props.onPauseResume).toHaveBeenCalledTimes(1);

  rerender(<Controls {...props} isRunning={false} />);
  await user.click(screen.getByRole('button', { name: 'Start' }));
  expect(props.onPauseResume).toHaveBeenCalledTimes(2);
});

test('uses start action to restart after a terminal game', async () => {
  const { props, user } = setup({ isRunning: false, gameOver: true });

  await user.click(screen.getByRole('button', { name: 'Restart' }));

  expect(props.onStart).toHaveBeenCalledTimes(1);
  expect(props.onPauseResume).not.toHaveBeenCalled();
});
