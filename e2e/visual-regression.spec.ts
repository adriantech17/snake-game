import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 720 } });

test('captures the initial board visual baseline', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.42;
  });
  await page.goto('/');
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
    `,
  });

  const board = page.getByRole('img', { name: /snake game board/i });
  await expect(board).toBeVisible();
  await expect(board).toHaveScreenshot('snake-game-board-initial.png', {
    maxDiffPixels: 20,
  });
});
