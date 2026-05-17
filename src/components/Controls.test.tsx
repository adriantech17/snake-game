import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { vi } from 'vitest';
import Controls from './Controls';

function setup(overrides: Partial<ComponentProps<typeof Controls>> = {}) {
  const props: ComponentProps<typeof Controls> = {
    onDirectionChange: vi.fn(),
    onPrimaryAction: vi.fn(),
    status: 'running',
    ...overrides,
  };
  const user = userEvent.setup();
  const view = render(<Controls {...props} />);

  return { props, user, ...view };
}

test('shows a start button and delegates to the primary action while idle', async () => {
  const { props, user } = setup({ status: 'idle' });

  const startButton = screen.getByRole('button', { name: 'Start' });

  expect(startButton).toBeInTheDocument();

  await user.click(startButton);

  expect(props.onPrimaryAction).toHaveBeenCalledTimes(1);
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

test('uses pause and resume labels while the game is not over', async () => {
  const { props, rerender, user } = setup();

  await user.click(screen.getByRole('button', { name: 'Pause' }));
  expect(props.onPrimaryAction).toHaveBeenCalledTimes(1);

  rerender(<Controls {...props} status="paused" />);
  await user.click(screen.getByRole('button', { name: 'Resume' }));
  expect(props.onPrimaryAction).toHaveBeenCalledTimes(2);
});

test.each(['gameOver', 'won'] as const)(
  'uses restart label for a %s game',
  async (status) => {
    const { props, user } = setup({ status });

    await user.click(screen.getByRole('button', { name: 'Restart' }));

    expect(props.onPrimaryAction).toHaveBeenCalledTimes(1);
  },
);

test.each(['idle', 'gameOver', 'won'] as const)(
  'disables all direction buttons when status is %s',
  (status) => {
    setup({ status });

    expect(screen.getByRole('button', { name: 'Move up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move down' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move left' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move right' })).toBeDisabled();
  },
);

test.each(['running', 'paused'] as const)(
  'enables direction buttons when status is %s',
  (status) => {
    setup({ status });

    expect(screen.getByRole('button', { name: 'Move up' })).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Move down' }),
    ).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Move left' }),
    ).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Move right' }),
    ).not.toBeDisabled();
  },
);
