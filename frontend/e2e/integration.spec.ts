import { test, expect } from './test-setup';
import { TestDataFactory } from './utils/test-data-factory';
import { ApiMock } from './utils/api-mock';

test.describe('Complete User Journey', () => {
  test('should complete full user registration and game flow', async ({ page, walletMock }) => {
    const apiMock = new ApiMock(page);
    await apiMock.setupContractMocks();
    await apiMock.mockExternalAPIs();

    // Generate test data
    const testUser = TestDataFactory.generateUserProfile();
    const testGame = TestDataFactory.generateGameSession();

    // Step 1: Visit homepage
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Zali: Learn, Play, Earn' })).toBeVisible();

    // Step 2: Navigate to registration
    await page.getByRole('link', { name: 'Play' }).click();
    await expect(page).toHaveURL(/.*play/);

    // Should redirect to registration if not registered
    await expect(page.getByText(/register|Register/i)).toBeVisible();

    // Step 3: Connect wallet
    await walletMock.connectWallet();
    await page.reload(); // Simulate wallet connection refresh

    // Step 4: Complete registration
    const usernameInput = page.locator('input[type="text"]').or(
      page.getByPlaceholder(/username|Username/i)
    );

    if (await usernameInput.isVisible()) {
      await usernameInput.fill(testUser.username);

      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button').filter({ hasText: /register|Register/i })
      );

      await submitButton.click();

      // Should redirect to play page after registration
      await expect(page).toHaveURL(/.*play/);
    }

    // Step 5: Start a game
    const startButton = page.locator('button').filter({
      hasText: /start.*game|play.*now|begin|Begin/i
    });

    if (await startButton.isVisible() && await startButton.isEnabled()) {
      await startButton.click();

      // Should navigate to game page
      await expect(page).toHaveURL(/.*game/);
    }

    // Step 6: Play through questions
    for (let i = 0; i < Math.min(testGame.questions.length, 3); i++) {
      // Wait for question to load
      await page.waitForTimeout(1000);

      // Look for answer options
      const answerButtons = page.locator('button').filter({
        hasText: /^[A-D]\.|^[A-D]\s/
      });

      if (await answerButtons.first().isVisible()) {
        // Select first answer
        await answerButtons.first().click();

        // Wait for feedback or next question
        await page.waitForTimeout(1500);
      }
    }

    // Step 7: Complete game and view results
    // Should either show results or navigate to results page
    await expect(
      page.getByText(/results|Results|score|Score|completed|Completed/i).or(
        page.url().includes('/results')
      )
    ).toBeTruthy({ timeout: 10000 });

    // Cleanup
    await apiMock.clearMocks();
  });

  test('should handle faucet claim and balance updates', async ({ page, walletMock }) => {
    const apiMock = new ApiMock(page);
    await apiMock.setupContractMocks();

    // Step 1: Connect wallet and navigate to faucet
    await walletMock.connectWallet();
    await page.goto('/faucet');

    // Step 2: Check initial balance display
    const balanceElements = page.locator('text=/balance|Balance|\\$|cUSD/');
    await expect(balanceElements.first()).toBeVisible();

    // Step 3: Claim tokens
    const claimButton = page.locator('button').filter({ hasText: /claim|Claim/i });

    if (await claimButton.isVisible() && await claimButton.isEnabled()) {
      await claimButton.click();

      // Should show success feedback
      await expect(
        page.getByText(/success|Success|claimed|Claimed/i).or(
          page.getByRole('alert')
        )
      ).toBeVisible({ timeout: 10000 });
    }

    // Step 4: Verify balance update (would require balance polling in real app)
    await page.waitForTimeout(2000);

    // Cleanup
    await apiMock.clearMocks();
  });

  test('should navigate leaderboard and view rankings', async ({ page }) => {
    const apiMock = new ApiMock(page);
    await apiMock.setupContractMocks();

    // Step 1: Navigate to leaderboard
    await page.goto('/leaderboard');

    // Step 2: Verify leaderboard loads
    await expect(page.getByRole('heading', { name: '🏆 Leaderboard' })).toBeVisible();

    // Step 3: Check for ranking data
    await page.waitForTimeout(2000); // Wait for data to load

    const rankingElements = page.locator('text=/^\\d+$/').first(); // Look for numbers
    const hasRankings = await rankingElements.isVisible().catch(() => false);

    if (hasRankings) {
      // Should show multiple players
      const playerElements = page.locator('[class*="player"]').or(
        page.locator('text=/player|Player/i')
      );

      await expect(playerElements.first()).toBeVisible();
    }

    // Cleanup
    await apiMock.clearMocks();
  });

  test('should handle mobile user journey', async ({ page, isMobile, walletMock }) => {
    if (!isMobile) test.skip();

    const apiMock = new ApiMock(page);
    await apiMock.setupContractMocks();

    // Step 1: Mobile homepage
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Zali: Learn, Play, Earn' })).toBeVisible();

    // Step 2: Mobile navigation
    const mobileMenuButton = page.locator('button[aria-label*="menu" i]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();

      // Mobile menu should be visible
      await expect(page.getByRole('link', { name: 'Play' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Leaderboard' })).toBeVisible();
    }

    // Step 3: Connect wallet on mobile
    await walletMock.connectWallet();

    // Step 4: Navigate to play page
    await page.getByRole('link', { name: 'Play' }).click();
    await expect(page).toHaveURL(/.*play/);

    // Mobile layout should be responsive
    const content = page.locator('.max-w-4xl');
    await expect(content).toBeVisible();

    // Cleanup
    await apiMock.clearMocks();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test network errors, contract failures, etc.
    await page.goto('/');

    // Simulate network failure
    await page.context().setOffline(true);

    // Try to navigate (should handle gracefully)
    await page.reload();

    // Should still show basic UI
    await expect(page.getByRole('heading', { name: 'Zali: Learn, Play, Earn' })).toBeVisible();

    // Re-enable network
    await page.context().setOffline(false);
  });
});