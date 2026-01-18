import { test, expect } from '@playwright/test';

test.describe('Navigation and Wallet Connection', () => {
  test('should load homepage and display main content', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    await expect(page.getByRole('heading', { name: 'Zali: Learn, Play, Earn' })).toBeVisible();

    // Check main description
    await expect(page.getByText('Learn about Celo & DeFi while earning real cUSD rewards via MiniPay')).toBeVisible();

    // Check navigation links
    await expect(page.getByRole('link', { name: 'Play' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Leaderboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Rewards' })).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to Play page
    await page.getByRole('link', { name: 'Play' }).click();
    await expect(page).toHaveURL(/.*play/);

    // Navigate to Leaderboard
    await page.getByRole('link', { name: 'Leaderboard' }).click();
    await expect(page).toHaveURL(/.*leaderboard/);

    // Navigate to Rewards
    await page.getByRole('link', { name: 'Rewards' }).click();
    await expect(page).toHaveURL(/.*rewards/);

    // Navigate back to home
    await page.getByRole('link', { name: 'Zali' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should display wallet connection button when not connected', async ({ page }) => {
    await page.goto('/');

    // Check for wallet connection button (text may vary based on wallet state)
    const connectButton = page.locator('button').filter({ hasText: /connect|Connect|wallet|Wallet/i });
    await expect(connectButton.first()).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();

    await page.goto('/');

    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label*="menu" i]');
    await mobileMenuButton.click();

    // Check mobile menu items
    await expect(page.getByRole('link', { name: 'Play' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Leaderboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Rewards' })).toBeVisible();
  });
});