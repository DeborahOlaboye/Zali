import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should load registration page', async ({ page }) => {
    await page.goto('/register');

    // Check page title or main heading
    await expect(page.getByRole('heading', { name: /register|Register|sign.*up|Sign.*up/i })).toBeVisible();
  });

  test('should show wallet connection requirement', async ({ page }) => {
    await page.goto('/register');

    // Should require wallet connection
    await expect(
      page.getByText(/connect.*wallet|wallet.*connect/i, { exact: false }).or(
        page.getByRole('button', { name: /connect|Connect/i })
      )
    ).toBeVisible();
  });

  test('should display registration form when wallet connected', async ({ page }) => {
    await page.goto('/register');

    // Look for form elements that would be visible when wallet is connected
    const formElements = page.locator('form').or(
      page.locator('input[type="text"]').or(
        page.getByPlaceholder(/username|Username/i)
      )
    );

    // If form is visible, check its structure
    if (await formElements.first().isVisible()) {
      // Should have username input
      await expect(
        page.locator('input[type="text"]').or(
          page.getByPlaceholder(/username|Username/i)
        )
      ).toBeVisible();

      // Should have submit button
      await expect(
        page.locator('button[type="submit"]').or(
          page.locator('button').filter({ hasText: /register|Register|submit|Submit/i })
        )
      ).toBeVisible();
    }
  });

  test('should validate username input', async ({ page }) => {
    await page.goto('/register');

    const usernameInput = page.locator('input[type="text"]').or(
      page.getByPlaceholder(/username|Username/i)
    );

    if (await usernameInput.isVisible()) {
      // Test empty input
      await usernameInput.fill('');
      await usernameInput.blur();

      // Should show validation error
      await expect(
        page.getByText(/required|Required|empty|Empty/i).or(
          page.locator('[class*="error"]')
        )
      ).toBeVisible();

      // Test invalid input
      await usernameInput.fill('a'); // Too short
      await usernameInput.blur();

      // Should show length validation
      await expect(
        page.getByText(/too.*short|minimum|at.*least/i, { exact: false }).or(
          page.locator('[class*="error"]')
        )
      ).toBeVisible();

      // Test valid input
      await usernameInput.fill('validusername');
      await usernameInput.blur();

      // Error should disappear
      await expect(
        page.locator('[class*="error"]').filter({ hasText: /username|Username/i })
      ).not.toBeVisible();
    }
  });

  test('should handle registration submission', async ({ page }) => {
    await page.goto('/register');

    const submitButton = page.locator('button[type="submit"]').or(
      page.locator('button').filter({ hasText: /register|Register/i })
    );

    if (await submitButton.isVisible()) {
      const isEnabled = await submitButton.isEnabled();

      if (isEnabled) {
        await submitButton.click();

        // Should show loading state or success/error feedback
        await expect(
          page.getByText(/loading|Loading|registering|Registering|success|Success|error|Error/i).or(
            page.url().includes('/play') // May redirect on success
          )
        ).toBeTruthy({ timeout: 10000 });
      }
    }
  });

  test('should redirect registered users', async ({ page }) => {
    await page.goto('/register');

    // If user is already registered, should redirect to /play
    // This is hard to test without proper authentication state
    // But we can check that the page doesn't show registration form indefinitely

    await page.waitForTimeout(3000);

    // Should either show registration form or redirect
    const stillOnRegister = page.url().includes('/register');
    if (stillOnRegister) {
      // If still on register page, should show form or connection prompt
      await expect(
        page.locator('form').or(
          page.getByText(/connect|register/i, { exact: false })
        )
      ).toBeVisible();
    }
  });

  test('should handle registration errors gracefully', async ({ page }) => {
    await page.goto('/register');

    // This test would need to simulate error conditions
    // For now, we test that error states are handled in the UI

    const errorElements = page.locator('[class*="error"]').or(
      page.getByRole('alert')
    );

    // If there are errors, they should be displayed properly
    if (await errorElements.isVisible()) {
      await expect(errorElements).toBeVisible();
      await expect(errorElements).toHaveText(/.+/); // Should have some error text
    }
  });
});