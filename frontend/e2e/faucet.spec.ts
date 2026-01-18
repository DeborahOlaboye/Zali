import { test, expect } from '@playwright/test';

test.describe('Faucet Functionality', () => {
  test('should load faucet page and display main elements', async ({ page }) => {
    await page.goto('/faucet');

    // Check page title
    await expect(page.getByRole('heading', { name: /faucet|Faucet/i })).toBeVisible();

    // Check for claim button or related elements
    const claimButton = page.locator('button').filter({ hasText: /claim|Claim/i });
    await expect(claimButton.or(page.getByText(/connect wallet|Connect Wallet/i))).toBeVisible();
  });

  test('should show wallet connection prompt when not connected', async ({ page }) => {
    await page.goto('/faucet');

    // Should show connect wallet message or button
    await expect(
      page.getByText(/connect.*wallet|wallet.*connect/i, { exact: false }).or(
        page.getByRole('button', { name: /connect|Connect/i })
      )
    ).toBeVisible();
  });

  test('should display balance information when wallet is connected', async ({ page }) => {
    // This test would need a connected wallet in a real scenario
    // For now, we'll test the UI elements that should be present
    await page.goto('/faucet');

    // Check for balance display elements (may show 0 or loading when not connected)
    const balanceElements = page.locator('text=/balance|Balance|\\$|cUSD/');
    await expect(balanceElements.first()).toBeVisible();
  });

  test('should handle claim button interactions', async ({ page }) => {
    await page.goto('/faucet');

    const claimButton = page.locator('button').filter({ hasText: /claim|Claim/i });

    // Button should be visible (may be disabled if wallet not connected)
    await expect(claimButton).toBeVisible();

    // If button is enabled, clicking should show some feedback
    const isEnabled = await claimButton.isEnabled();
    if (isEnabled) {
      await claimButton.click();
      // Should show loading state or error message
      await expect(
        page.getByText(/loading|Loading|error|Error|success|Success/i).or(
          page.getByRole('alert')
        )
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test('should display contract balance information', async ({ page }) => {
    await page.goto('/faucet');

    // Should show contract balance or related information
    await expect(
      page.getByText(/contract.*balance|available|remaining/i, { exact: false }).or(
        page.locator('[data-testid*="balance"]').or(
          page.locator('[class*="balance"]')
        )
      )
    ).toBeVisible();
  });
});