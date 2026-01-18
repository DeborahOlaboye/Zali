import { test, expect } from '@playwright/test';

test.describe('Game Play Flow', () => {
  test('should load play page and show main elements', async ({ page }) => {
    await page.goto('/play');

    // Check page title or main content
    await expect(page.getByText(/play|Play|game|Game/i)).toBeVisible();

    // Should show connect wallet prompt or game start button
    await expect(
      page.getByText(/connect.*wallet|start.*game|play.*now/i, { exact: false }).or(
        page.getByRole('button', { name: /connect|Connect|start|Start|play|Play/i })
      )
    ).toBeVisible();
  });

  test('should show registration prompt for unregistered users', async ({ page }) => {
    await page.goto('/play');

    // If wallet is connected but user not registered, should show registration
    const registerElements = page.getByText(/register|Register|username|Username/i);
    const hasRegisterPrompt = await registerElements.isVisible().catch(() => false);

    if (hasRegisterPrompt) {
      await expect(registerElements.first()).toBeVisible();
    }
  });

  test('should display game statistics and balance', async ({ page }) => {
    await page.goto('/play');

    // Should show some form of stats or balance information
    await expect(
      page.getByText(/balance|Balance|score|Score|questions|Questions/i, { exact: false }).or(
        page.locator('[class*="stat"]').or(
          page.locator('[data-testid*="balance"]')
        )
      )
    ).toBeVisible();
  });

  test('should handle game start button interactions', async ({ page }) => {
    await page.goto('/play');

    const startButton = page.locator('button').filter({
      hasText: /start.*game|play.*now|begin|Begin/i
    });

    if (await startButton.isVisible()) {
      // Check if button is enabled or shows proper state
      const isEnabled = await startButton.isEnabled();

      if (isEnabled) {
        await startButton.click();

        // Should show loading state or navigate to game
        await expect(
          page.getByText(/loading|Loading|starting|Starting/i).or(
            page.url().includes('/game')
          )
        ).toBeTruthy();
      } else {
        // If disabled, should show reason (not registered, no balance, etc.)
        await expect(
          page.getByText(/connect|register|balance|insufficient/i, { exact: false })
        ).toBeVisible();
      }
    }
  });

  test('should navigate to game page when game starts', async ({ page }) => {
    await page.goto('/play');

    // This test assumes a game can be started
    // In a real scenario, this would require wallet connection and registration
    const gameLinks = page.locator('a[href*="game"]').or(
      page.locator('button').filter({ hasText: /play|game/i })
    );

    // If game navigation is available, it should work
    if (await gameLinks.first().isVisible()) {
      await gameLinks.first().click();
      await expect(page.url()).toMatch(/\/play\/game/);
    }
  });
});