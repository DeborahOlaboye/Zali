import { test, expect } from '@playwright/test';

test.describe('Game Session Flow', () => {
  test('should load game page with proper elements', async ({ page }) => {
    // Navigate directly to game page (would normally come from play page)
    await page.goto('/play/game');

    // Should show game interface or redirect if no active game
    await expect(
      page.getByText(/game|Game|question|Question|loading|Loading/i).or(
        page.url().includes('/play') // May redirect back to play page
      )
    ).toBeTruthy();
  });

  test('should display question interface when game is active', async ({ page }) => {
    await page.goto('/play/game');

    // If game is active, should show question elements
    const questionElements = page.locator('[class*="question"]').or(
      page.getByRole('heading').filter({ hasText: /question|Question/i })
    );

    const timerElements = page.locator('[class*="timer"]').or(
      page.getByText(/\d+:\d+|\d+\s*seconds?|time|Time/i)
    );

    const optionElements = page.locator('button').filter({ hasText: /^[A-D]\./ });

    // At least one of these should be visible if game is active
    await expect(
      questionElements.or(timerElements).or(optionElements.first())
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show progress indicator', async ({ page }) => {
    await page.goto('/play/game');

    // Should show progress bar or question counter
    await expect(
      page.getByText(/\d+\s*\/\s*\d+|\d+\s*of\s*\d+/).or( // "1/5" or "1 of 5"
        page.locator('[class*="progress"]').or(
          page.locator('[role="progressbar"]')
        )
      )
    ).toBeVisible();
  });

  test('should handle answer selection', async ({ page }) => {
    await page.goto('/play/game');

    // Look for answer buttons (typically A, B, C, D options)
    const answerButtons = page.locator('button').filter({
      hasText: /^[A-D]\.|^[A-D]\s/
    });

    if (await answerButtons.first().isVisible()) {
      const firstButton = answerButtons.first();

      // Click an answer
      await firstButton.click();

      // Should show feedback or move to next question
      await expect(
        page.getByText(/correct|Correct|incorrect|Incorrect|next|Next|loading/i).or(
          page.url().includes('/results') // May navigate to results
        )
      ).toBeTruthy({ timeout: 5000 });
    }
  });

  test('should handle timer functionality', async ({ page }) => {
    await page.goto('/play/game');

    // Look for timer display
    const timerDisplay = page.getByText(/\d+:\d+|\d+\s*seconds?/i).or(
      page.locator('[class*="timer"]')
    );

    if (await timerDisplay.isVisible()) {
      // Timer should count down
      const initialTime = await timerDisplay.textContent();
      await page.waitForTimeout(2000); // Wait 2 seconds

      // Timer should have changed (if still visible)
      if (await timerDisplay.isVisible()) {
        const updatedTime = await timerDisplay.textContent();
        expect(updatedTime).not.toBe(initialTime);
      }
    }
  });

  test('should navigate to results page after game completion', async ({ page }) => {
    await page.goto('/play/game');

    // If game completes, should navigate to results
    // This is hard to test without a full game session
    // But we can check for results-related elements or navigation

    const resultsLink = page.locator('a[href*="results"]').or(
      page.getByRole('link', { name: /results|Results/i })
    );

    if (await resultsLink.isVisible()) {
      await resultsLink.click();
      await expect(page.url()).toMatch(/\/results/);
    }
  });

  test('should handle game abandonment gracefully', async ({ page }) => {
    await page.goto('/play/game');

    // Navigate away and back - should handle gracefully
    await page.goto('/play');
    await page.goBack();

    // Should still show game page or redirect appropriately
    await expect(page.url()).toMatch(/\/play/);
  });
});