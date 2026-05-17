import { expect, test } from '@playwright/test';

test('renders the initial game shell in a real browser', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /snake game/i }),
  ).toBeVisible();
  await expect(page.getByText('Score: 0')).toBeVisible();
  await expect(page.getByText('Ready')).toBeVisible();
  await expect(
    page.getByRole('img', { name: /snake game board/i }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move up' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move left' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move right' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move down' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
});

test('starts, pauses, resumes, and accepts keyboard input in a real browser', async ({
  page,
}) => {
  await page.goto('/');

  const head = page.getByTestId('snake-head');
  const initialX = Number(await head.getAttribute('data-x'));

  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByText('Playing...')).toBeVisible();

  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByText('Paused')).toBeVisible();

  await page.getByRole('button', { name: 'Resume' }).click();
  await expect(page.getByText('Playing...')).toBeVisible();
  await page.keyboard.press('ArrowRight');

  await expect
    .poll(() => head.getAttribute('data-x').then(Number), {
      message: 'snake head should move right after a real keyboard event',
      timeout: 5000,
    })
    .toBeGreaterThan(initialX);
});
