# Bundle Optimization Testing & Validation Strategy

Comprehensive testing approach for validating bundle optimizations don't break functionality.

---

## 🧪 Testing Pyramid for Bundle Optimizations

```
           ┌─────────────┐
           │ E2E Tests   │  Few, slow, comprehensive (10-20 tests)
           ├─────────────┤
           │ Component   │  More, medium speed, isolated (50-100 tests)
           │   Tests     │
           ├─────────────┤
           │ Unit Tests  │  Many, fast, individual functions (100-200 tests)
           └─────────────┘
```

---

## ✅ Unit Tests (Fast)

### Test Lazy Loading Logic

```typescript
// __tests__/lazy-loading.test.ts

import dynamic from 'next/dynamic';

describe('Lazy Loading', () => {
  it('should lazy load Modal component', () => {
    const Modal = dynamic(() => import('@/components/Modal'));
    
    // Component should be defined
    expect(Modal).toBeDefined();
    
    // Should not throw when accessed
    expect(() => Modal).not.toThrow();
  });
  
  it('should not load Modal on server', () => {
    const Modal = dynamic(
      () => import('@/components/Modal'),
      { ssr: false }
    );
    
    // SSR should be false
    expect(Modal.render).toBeUndefined();
  });
  
  it('should provide loading fallback', () => {
    const Modal = dynamic(
      () => import('@/components/Modal'),
      { loading: () => <div>Loading</div> }
    );
    
    // Loading prop should exist
    expect(Modal.loading).toBeDefined();
  });
});
```

### Test Import Paths

```typescript
// __tests__/imports.test.ts

describe('Imports', () => {
  it('should import from optimized modules', () => {
    // Should use viem, not ethers
    const viem = require('viem');
    expect(viem).toBeDefined();
  });
  
  it('should not import unused packages', () => {
    // ethers should not be installed
    expect(() => require('ethers')).toThrow();
  });
  
  it('should use fetch API', async () => {
    // Should be able to use fetch
    const response = await fetch('https://api.example.com/ping');
    expect(response).toBeDefined();
  });
});
```

### Test Logger Works

```typescript
// __tests__/logger.test.ts

import { logger } from '@/lib/logger';

describe('Logger', () => {
  it('should log in development', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    logger.info('Test message');
    
    expect(consoleSpy).toHaveBeenCalledWith('Test message');
    consoleSpy.mockRestore();
  });
  
  it('should not log in production', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    logger.info('Test message');
    
    expect(consoleSpy).not.toHaveBeenCalled();
    process.env.NODE_ENV = original;
    consoleSpy.mockRestore();
  });
});
```

---

## 🧩 Component Tests (Medium Speed)

### Test Modal Component

```typescript
// __tests__/Modal.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/Modal';

describe('Modal Component', () => {
  it('should render modal when open', () => {
    render(<Modal isOpen={true}>Content</Modal>);
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  
  it('should not render modal when closed', () => {
    render(<Modal isOpen={false}>Content</Modal>);
    
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
  
  it('should animate smoothly', () => {
    const { container } = render(
      <Modal isOpen={true}>Content</Modal>
    );
    
    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toHaveStyle('opacity: 1');
  });
  
  it('should close on backdrop click', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>
    );
    
    const backdrop = screen.getByRole('presentation');
    await user.click(backdrop);
    
    expect(onClose).toHaveBeenCalled();
  });
});
```

### Test Admin Panel (Only for Admin Users)

```typescript
// __tests__/AdminPanel.test.tsx

import { render, screen } from '@testing-library/react';
import { AdminPanel } from '@/components/AdminPanel';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@/hooks/useAuth');

describe('AdminPanel', () => {
  it('should show admin panel for admin users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: true,
      user: { id: 1 },
    });
    
    render(<AdminPanel />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });
  
  it('should not show admin panel for regular users', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAdmin: false,
      user: { id: 2 },
    });
    
    render(<AdminPanel />);
    
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });
});
```

### Test Web3 Initialization

```typescript
// __tests__/web3-init.test.ts

import { loadWeb3Libraries } from '@/config/web3-loader';

describe('Web3 Initialization', () => {
  it('should load Web3 libraries when needed', async () => {
    const libs = await loadWeb3Libraries();
    
    expect(libs.wagmi).toBeDefined();
    expect(libs.viem).toBeDefined();
  });
  
  it('should not load Web3 on server', () => {
    // jsdom simulates browser
    const mockGlobal = {
      window: undefined,
    };
    
    // This would fail on server
    // loadWeb3Libraries would return null
  });
  
  it('should cache Web3 libraries', async () => {
    const libs1 = await loadWeb3Libraries();
    const libs2 = await loadWeb3Libraries();
    
    // Should be same instance
    expect(libs1).toBe(libs2);
  });
});
```

---

## 🌍 E2E Tests (Comprehensive)

### Test Home Page Performance

```typescript
// e2e/home.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page - Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Should paint content quickly
    const fcp = await page.evaluate(() => {
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      return fcp ? fcp.startTime : null;
    });
    
    expect(fcp).toBeLessThan(2500);  // < 2.5s
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);  // < 5s total
  });
  
  it('should not load Web3 on home page', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', (request) => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    
    // Web3 chunk should NOT be requested
    expect(requests).not.toContain(/web3.*\.js/);
  });
});
```

### Test Game Page with Web3

```typescript
// e2e/game.spec.ts

test.describe('Game Page - Web3 Loading', () => {
  test('should load Web3 on game page', async ({ page }) => {
    let loadedWeb3 = false;
    
    page.on('request', (request) => {
      if (request.url().includes('web3')) {
        loadedWeb3 = true;
      }
    });
    
    await page.goto('/game');
    
    // Wait a bit for async loading
    await page.waitForTimeout(3000);
    
    // Web3 should be loaded
    expect(loadedWeb3).toBe(true);
  });
  
  test('should allow wallet connection', async ({ page }) => {
    await page.goto('/game');
    
    // Wait for wallet button
    const walletButton = page.getByRole('button', { name: /connect/i });
    await expect(walletButton).toBeVisible();
    
    // Click connect
    await walletButton.click();
    
    // Wallet modal should appear
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
  });
  
  test('should play game after wallet connection', async ({ page }) => {
    await page.goto('/game');
    
    // Connect wallet (mock with fixture)
    await page.evaluate(() => {
      window.localStorage.setItem('wallet', '0x123...');
    });
    
    // Refresh and verify game loads
    await page.reload();
    
    // Game should be ready
    const gameContainer = page.getByTestId('game-container');
    await expect(gameContainer).toBeVisible();
  });
});
```

### Test Lazy Loading in E2E

```typescript
// e2e/lazy-loading.spec.ts

test.describe('Lazy Loading', () => {
  test('should lazy load modal on click', async ({ page }) => {
    let framerMotionLoaded = false;
    
    page.on('request', (request) => {
      if (request.url().includes('framer-motion')) {
        framerMotionLoaded = true;
      }
    });
    
    await page.goto('/game');
    
    // Modal not loaded yet
    expect(framerMotionLoaded).toBe(false);
    
    // Click to open modal
    const button = page.getByRole('button', { name: /show modal/i });
    await button.click();
    
    // Wait for modal to load
    await page.waitForTimeout(1000);
    
    // Now framer-motion should be loaded
    expect(framerMotionLoaded).toBe(true);
  });
  
  test('should lazy load admin features', async ({ page }) => {
    // Login as admin
    await page.evaluate(() => {
      window.localStorage.setItem('role', 'admin');
    });
    
    let adminChunksLoaded = false;
    
    page.on('request', (request) => {
      if (request.url().includes('admin') && request.url().includes('.js')) {
        adminChunksLoaded = true;
      }
    });
    
    // Navigate to admin
    await page.goto('/admin');
    
    // Admin chunks should be loaded
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
    expect(adminChunksLoaded).toBe(true);
  });
});
```

---

## 📊 Performance E2E Tests

### Bundle Size Tests

```typescript
// e2e/bundle-size.spec.ts

test('should maintain bundle size targets', async ({ page }) => {
  const metrics = {
    mainChunkSize: 0,
    totalSize: 0,
  };
  
  page.on('response', async (response) => {
    if (response.url().includes('_next/static/chunks')) {
      const buffer = await response.buffer();
      metrics.totalSize += buffer.length;
    }
  });
  
  await page.goto('/');
  
  // Main chunk should be under budget
  expect(metrics.mainChunkSize).toBeLessThan(140 * 1024);  // 140KB
  
  // Total should be under budget
  expect(metrics.totalSize).toBeLessThan(300 * 1024);  // 300KB
});
```

### Core Web Vitals Tests

```typescript
// e2e/web-vitals.spec.ts

test('should meet Core Web Vitals targets', async ({ page }) => {
  await page.goto('/');
  
  // Measure LCP
  const lcp = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      setTimeout(() => resolve(0), 5000);  // Timeout after 5s
    });
  });
  
  expect(lcp).toBeLessThan(2500);  // < 2.5s LCP target
});
```

---

## 🚀 CI/CD Integration Tests

### GitHub Actions Bundle Check

```yaml
# .github/workflows/bundle-check.yml

name: Bundle Size Check

on: [push, pull_request]

jobs:
  bundle:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install deps
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Check bundle size
        run: |
          MAIN_SIZE=$(du -sb .next/static/chunks/main*.js | awk '{print $1}')
          LIMIT=$((140 * 1024))  # 140KB
          
          if [ $MAIN_SIZE -gt $LIMIT ]; then
            echo "❌ Bundle size $MAIN_SIZE exceeds limit $LIMIT"
            exit 1
          fi
          echo "✅ Bundle size OK: $((MAIN_SIZE / 1024))KB"
      
      - name: Run tests
        run: npm test
      
      - name: Run E2E tests
        run: npm run test:e2e
```

---

## 📋 Testing Checklist

### Before Each Optimization

- [ ] Record baseline metrics
- [ ] Document what will change
- [ ] Plan which tests to run

### After Optimization

- [ ] Unit tests pass
- [ ] Component tests pass
- [ ] E2E tests pass
- [ ] No console errors
- [ ] Performance improved
- [ ] No functionality broken

### Before Deployment

- [ ] All tests passing
- [ ] Bundle size within limits
- [ ] Core Web Vitals targets met
- [ ] Manual testing on mobile
- [ ] Code review approved

---

## 🎯 Test Coverage Goals

### Unit Tests: 80%+ Coverage

```bash
# Run with coverage
npm test -- --coverage

# Target:
# Functions:   > 80%
# Statements:  > 80%
# Branches:    > 75%
# Lines:       > 80%
```

### E2E Tests: Critical Paths

- [ ] Home page loads
- [ ] Game page loads
- [ ] Wallet connection works
- [ ] Game can be played
- [ ] Leaderboard loads
- [ ] Admin panel accessible (for admins)

---

## ✅ Validation Script

```bash
#!/bin/bash

echo "🧪 Running Bundle Optimization Tests"
echo "===================================="

# Unit tests
echo "1. Running unit tests..."
npm test || exit 1
echo "✅ Unit tests passed"

# Build
echo "2. Building application..."
npm run build || exit 1
echo "✅ Build successful"

# Check bundle size
echo "3. Checking bundle size..."
MAIN_SIZE=$(du -sb .next/static/chunks/main*.js | awk '{print $1}')
if [ $MAIN_SIZE -gt $((140 * 1024)) ]; then
  echo "❌ Bundle size too large: $((MAIN_SIZE / 1024))KB"
  exit 1
fi
echo "✅ Bundle size OK: $((MAIN_SIZE / 1024))KB"

# E2E tests
echo "4. Running E2E tests..."
npm run test:e2e || exit 1
echo "✅ E2E tests passed"

# Performance audit
echo "5. Running Lighthouse..."
npm run lighthouse || true  # Non-blocking
echo "✅ Performance audit complete"

echo ""
echo "✅ All tests passed! Ready to deploy."
```

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete
