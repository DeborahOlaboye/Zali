import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage should match visual baseline', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.1, // Allow 10% difference for minor variations
    });
  });

  test('play page should match visual baseline', async ({ page }) => {
    await page.goto('/play');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('play-page.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('leaderboard should match visual baseline', async ({ page }) => {
    await page.goto('/leaderboard');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('leaderboard.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('faucet page should match visual baseline', async ({ page }) => {
    await page.goto('/faucet');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('faucet-page.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('registration page should match visual baseline', async ({ page }) => {
    await page.goto('/register');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('registration-page.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('mobile homepage should match visual baseline', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    await page.goto('/');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('mobile navigation should match visual baseline', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    await page.goto('/');

    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label*="menu" i]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500); // Wait for animation

      await expect(page).toHaveScreenshot('mobile-navigation-open.png', {
        threshold: 0.1,
      });
    }
  });

  test('game interface should match visual baseline', async ({ page }) => {
    await page.goto('/play/game');

    await page.waitForLoadState('networkidle');

    // Take screenshot even if redirected (will capture the actual state)
    await expect(page).toHaveScreenshot('game-interface.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('error states should match visual baseline', async ({ page }) => {
    // Navigate to a non-existent page to test 404
    await page.goto('/non-existent-page');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('404-error.png', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('loading states should match visual baseline', async ({ page }) => {
    await page.goto('/play');

    // Look for loading elements and capture them
    const loadingElements = page.locator('[class*="loading"]').or(
      page.locator('[class*="skeleton"]')
    );

    if (await loadingElements.first().isVisible()) {
      await expect(page).toHaveScreenshot('loading-states.png', {
        threshold: 0.1,
      });
    }
  });
});