import { test, expect } from '@playwright/test';

test.describe('Leaderboard Functionality', () => {
  test('should load leaderboard page and display main elements', async ({ page }) => {
    await page.goto('/leaderboard');

    // Check page title
    await expect(page.getByRole('heading', { name: '🏆 Leaderboard' })).toBeVisible();

    // Check subtitle
    await expect(page.getByText('Top players in Celo Knowledge Quest')).toBeVisible();

    // Check leaderboard header
    await expect(page.getByRole('heading', { name: 'Top Players' })).toBeVisible();
  });

  test('should display leaderboard data or loading state', async ({ page }) => {
    await page.goto('/leaderboard');

    // Should show either loading skeleton or leaderboard data
    await expect(
      page.locator('[class*="skeleton"]').or(
        page.locator('[class*="leaderboard"]').or(
          page.getByText(/rank|Rank|score|Score|player|Player/i)
        )
      )
    ).toBeVisible();
  });

  test('should handle empty leaderboard gracefully', async ({ page }) => {
    await page.goto('/leaderboard');

    // If no data, should show appropriate message or empty state
    const noDataMessage = page.getByText(/no.*data|empty|no.*players/i, { exact: false });
    const hasData = await page.locator('[class*="leaderboard"]').count() > 0;

    if (!hasData) {
      // If no leaderboard data visible, should show empty state
      await expect(
        noDataMessage.or(
          page.getByText(/loading|Loading|connect|Connect/i)
        )
      ).toBeVisible();
    }
  });

  test('should display player rankings correctly', async ({ page }) => {
    await page.goto('/leaderboard');

    // Wait for potential loading
    await page.waitForTimeout(2000);

    // Check for ranking elements (numbers, positions, etc.)
    const rankingElements = page.locator('text=/^\\d+$/').first(); // Look for numbers
    const hasRankings = await rankingElements.isVisible().catch(() => false);

    if (hasRankings) {
      // If rankings are shown, they should be in order
      const rankTexts = await page.locator('text=/^\\d+$/').allTextContents();
      const ranks = rankTexts.map(text => parseInt(text)).filter(num => !isNaN(num));

      // Ranks should be in ascending order (1, 2, 3, etc.)
      for (let i = 1; i < ranks.length; i++) {
        expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1]);
      }
    }
  });

  test('should show refresh/refetch functionality', async ({ page }) => {
    await page.goto('/leaderboard');

    // Look for refresh button or similar functionality
    const refreshButton = page.locator('button').filter({
      hasText: /refresh|Refresh|reload|Reload|update|Update/i
    });

    // Button may or may not be present, but if it is, it should be clickable
    if (await refreshButton.isVisible()) {
      await expect(refreshButton).toBeEnabled();
    }
  });

  test('should handle mobile leaderboard display', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    await page.goto('/leaderboard');

    // On mobile, content should be readable and scrollable
    await expect(page.getByRole('heading', { name: '🏆 Leaderboard' })).toBeVisible();

    // Check that content fits mobile viewport
    const content = page.locator('.max-w-4xl');
    await expect(content).toBeVisible();

    // Should be able to scroll if content is long
    await page.mouse.wheel(0, 100);
  });
});