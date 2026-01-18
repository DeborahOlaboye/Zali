# End-to-End Testing Guide

This guide covers the E2E testing setup for the Zali trivia game using Playwright.

## Overview

The E2E test suite covers critical user flows and ensures production quality:

- ✅ Wallet connection flow
- ✅ Complete game play session
- ✅ Faucet claim process
- ✅ Leaderboard interactions
- ✅ Mobile responsive flows
- ✅ Visual regression testing

## Test Structure

```
e2e/
├── navigation.spec.ts      # Page navigation and wallet connection
├── faucet.spec.ts          # Faucet claim functionality
├── leaderboard.spec.ts     # Leaderboard display and interactions
├── game-play.spec.ts       # Game start and play page
├── game-session.spec.ts    # Active game session flow
├── registration.spec.ts    # User registration flow
├── visual-regression.spec.ts # Visual regression tests
└── utils/
    ├── wallet-mock.ts      # Wallet connection mocking
    └── test-setup.ts       # Test configuration and fixtures
```

## Running Tests

### Local Development

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test navigation.spec.ts

# Debug mode
npm run test:e2e:debug
```

### Visual Regression

```bash
# Run visual regression tests and update baselines
npm run test:visual

# Run visual tests without updating baselines
npx playwright test visual-regression.spec.ts
```

### CI Environment

```bash
# Run tests for CI (GitHub reporter)
npm run test:e2e:ci
```

## Test Configuration

### Playwright Config (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Desktop + Mobile (Pixel 5, iPhone 12)
- **Auto-start**: Development server on `http://localhost:3000`
- **Parallel**: Fully parallel execution
- **Retries**: 2 retries on CI, 0 locally

### Test Fixtures

#### Wallet Mock (`utils/wallet-mock.ts`)

Provides wallet connection mocking for tests that require authentication:

```typescript
test('wallet-dependent feature', async ({ walletMock }) => {
  await walletMock.connectWallet();
  // Test authenticated functionality
});
```

## Writing E2E Tests

### Test Patterns

#### 1. Page Load Tests
```typescript
test('should load page correctly', async ({ page }) => {
  await page.goto('/target-page');
  await expect(page.getByRole('heading', { name: 'Title' })).toBeVisible();
});
```

#### 2. User Flow Tests
```typescript
test('should complete user flow', async ({ page }) => {
  await page.goto('/start');
  await page.getByRole('button', { name: 'Action' }).click();
  await expect(page).toHaveURL('/expected-result');
});
```

#### 3. Form Interaction Tests
```typescript
test('should handle form submission', async ({ page }) => {
  await page.goto('/form-page');
  await page.getByLabel('Username').fill('testuser');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Success')).toBeVisible();
});
```

#### 4. Mobile-Specific Tests
```typescript
test('mobile navigation', async ({ page, isMobile }) => {
  if (!isMobile) test.skip();
  // Mobile-specific test logic
});
```

### Best Practices

#### Selectors
- Prefer semantic selectors: `getByRole()`, `getByLabel()`
- Use data attributes for complex cases: `data-testid`
- Avoid CSS selectors when possible

#### Assertions
- Use `toBeVisible()` for UI elements
- Use `toHaveURL()` for navigation
- Use `toHaveScreenshot()` for visual regression

#### Waiting
- Let Playwright auto-wait for elements
- Use `waitForLoadState('networkidle')` for full page loads
- Use explicit waits sparingly

## Visual Regression Testing

### Setup
1. Run tests once to create baseline screenshots
2. Review and approve baselines
3. Tests will fail if visuals change significantly

### Updating Baselines
```bash
npm run test:visual  # Updates all visual baselines
```

### Threshold Configuration
- Default threshold: 10% difference allowed
- Adjust per test as needed for dynamic content

## CI Integration

### GitHub Actions
- Tests run on push/PR to main/develop
- Parallel jobs for E2E and visual regression
- Test results uploaded as artifacts
- GitHub reporter for test summaries

### Environment Variables
```bash
CI=true  # Enables CI-specific behavior
```

## Debugging Tests

### Local Debugging
```bash
# Run in debug mode
npm run test:e2e:debug

# Run specific test
npx playwright test --grep "test name"

# Run with browser visible
npm run test:e2e:headed
```

### Test Reports
- HTML report generated after runs
- View with: `npx playwright show-report`

### Common Issues

#### Flaky Tests
- Use `await page.waitForLoadState('networkidle')`
- Add explicit waits for async operations
- Use `test.slow()` for slow operations

#### Mobile Testing
- Use `isMobile` fixture to skip desktop-only tests
- Test touch interactions with `page.tap()`

#### Wallet Interactions
- Use `walletMock` fixture for authenticated tests
- Mock blockchain responses for deterministic testing

## Test Coverage Areas

### Critical User Flows
1. **Anonymous User Flow**
   - Visit homepage
   - Navigate between pages
   - View leaderboard (read-only)

2. **Wallet Connection Flow**
   - Connect wallet
   - View balance information
   - Access authenticated features

3. **Registration Flow**
   - Connect wallet
   - Fill registration form
   - Submit and redirect to play

4. **Game Play Flow**
   - Start game
   - Answer questions
   - Complete game
   - View results

5. **Faucet Flow**
   - Connect wallet
   - Claim tokens
   - View updated balance

### Mobile Responsiveness
- Navigation menu
- Form layouts
- Game interface
- Touch interactions

### Error Handling
- Network failures
- Invalid inputs
- Wallet disconnections
- Contract errors

## Maintenance

### Adding New Tests
1. Create new `.spec.ts` file in `e2e/`
2. Follow naming convention: `feature.spec.ts`
3. Add to this documentation

### Updating Tests
- Run tests locally before committing
- Update visual baselines when UI changes
- Keep tests in sync with application changes

### Performance
- Tests should complete within 10 minutes on CI
- Use parallel execution when possible
- Optimize waits and selectors

## Troubleshooting

### Test Timeouts
- Increase timeout for slow operations
- Check network requests are completing
- Verify selectors are correct

### Flaky Visual Tests
- Adjust threshold values
- Exclude dynamic content from screenshots
- Use `mask` option for changing elements

### CI Failures
- Check GitHub Actions logs
- Download test artifacts
- Reproduce locally with same conditions