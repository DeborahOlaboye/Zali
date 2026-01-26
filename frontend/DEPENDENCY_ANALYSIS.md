# Detailed Dependency Analysis & Alternatives

Comprehensive analysis of frontend dependencies, their bundle impact, and viable alternatives for reducing bundle size.

---

## 📦 Current Dependency Overview

### Production Dependencies (27 total)

| Dependency | Size | Category | Priority | Alternative | Status |
|------------|------|----------|----------|-------------|--------|
| wagmi | ~85KB | Web3 | CRITICAL | Keep (essential) | ✅ Current |
| viem | ~45KB | Web3 | CRITICAL | Keep (essential) | ✅ Current |
| @reown/appkit | ~50KB | Wallet | HIGH | Slim build or lazy load | ⚠️ Review |
| framer-motion | ~35KB | Animation | MEDIUM | Lazy load or react-spring | ⚠️ Lazy load |
| react-query | ~30KB | Data fetching | HIGH | Keep or replace with SWR | ✅ Current |
| sentry | ~40KB | Error tracking | MEDIUM | Lazy load | ⚠️ Lazy load |
| zod | ~18KB | Validation | LOW | Keep (small) | ✅ Current |
| pino | ~25KB | Logging | LOW | Lazy load or console | ⚠️ Lazy load |
| zustand | ~5KB | State | CRITICAL | Keep (essential) | ✅ Current |
| react-icons | ~20KB | Icons | MEDIUM | Tree-shake or SVG | ⚠️ Optimize |
| axios | ~15KB | HTTP | MEDIUM | Fetch API | ⚠️ Review |
| ethers | ~30KB | Web3 | HIGH | Keep (optional fallback) | ⚠️ Remove if unused |
| tailwind | ~8KB | CSS | CRITICAL | Keep (utility) | ✅ Current |
| typescript | ~30KB | Dev only | N/A | Dev dependency | ✅ Dev |
| others | ~65KB | Various | LOW | Review individually | 🔍 Review |

**Total:** ~596KB uncompressed, ~160-200KB gzipped

---

## 🎯 Priority 1: Remove Unused Dependencies

### Audit Unused Packages

```bash
cd frontend

# Install depcheck
npm install --save-dev depcheck

# Find unused dependencies
npx depcheck

# Example output to check:
# - ethers (if viem is primary)
# - pino (if console logging sufficient)
# - lodash (common culprit)
# - moment (if date-fns used)
```

### Verification Steps

1. Check if `ethers` is actually used:
```bash
grep -r "from 'ethers'" src/
grep -r "import.*ethers" src/
# If no results, safe to remove
```

2. Check logging usage:
```bash
grep -r "pino\|logger\|getLogger" src/ | head -20
# If mostly console.log, can remove pino
```

3. Audit other potential duplicates:
```bash
# Check for duplicate date libraries
grep -r "moment\|dayjs\|date-fns" src/

# Check for duplicate http clients
grep -r "axios\|fetch\|request" src/

# Check for duplicate form libraries
grep -r "react-hook-form\|formik" src/
```

---

## 🎯 Priority 2: Replace Heavy Dependencies

### Framer Motion Alternatives

**Current:** 35KB  
**Replacement Cost:** React Spring (25KB) or Native CSS (0KB)

**Option 1: CSS Animations (Recommended)**
```typescript
// Instead of Framer Motion for simple animations
import styles from './fade.module.css';

export function FadeIn({ children }) {
  return <div className={styles.fadeIn}>{children}</div>;
}
```

```css
/* fade.module.css */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
```

**Savings:** 35KB  
**Tradeoff:** Less complex animations possible

**Option 2: React Spring**
```bash
npm install react-spring
npm uninstall framer-motion
```

**Savings:** ~10KB (35KB - 25KB)

### Replace Pino with Console

If logging is minimal:

```typescript
// Before: using pino
import pino from 'pino';
const logger = pino();

logger.info('Event', { data });
// Bundle cost: +25KB

// After: using console
const logger = {
  info: (msg, data) => console.log(msg, data),
  error: (msg, data) => console.error(msg, data),
  warn: (msg, data) => console.warn(msg, data),
};

logger.info('Event', { data });
// Bundle cost: 0KB
```

**Savings:** 25KB

### Replace Axios with Fetch API

```typescript
// Before: using axios
import axios from 'axios';

const response = await axios.post('/api/data', payload);
// Bundle cost: +15KB

// After: using fetch
const response = await fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
// Bundle cost: 0KB (native API)
```

**Savings:** 15KB

---

## 🎯 Priority 3: Lazy Load Optional Features

### Sentry Error Tracking

```typescript
// Before: Always loaded
import * as Sentry from '@sentry/react';

// After: Lazy load on demand
async function initializeSentry() {
  if (process.env.NEXT_PUBLIC_ENV === 'production') {
    const Sentry = await import('@sentry/react');
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  }
}

// Call only when needed
if (typeof window !== 'undefined') {
  initializeSentry();
}
```

**Savings:** 40KB (when lazy loaded)

### Heavy Animation Libraries

```typescript
// Before: Always loaded
import { motion } from 'framer-motion';

// After: Lazy load
const motion = dynamic(() => import('framer-motion').then(m => m.motion), {
  ssr: false,
  loading: () => <div className="animate-pulse" />,
});
```

**Savings:** 35KB (when not on route)

### Admin Features

```typescript
// Before
import AdminPanel from '@/components/AdminPanel';

// After
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <div>Loading...</div>,
});

export default function Dashboard() {
  const { isAdmin } = useAuth();
  
  return (
    <>
      <UserPanel />
      {isAdmin && <AdminPanel />}
    </>
  );
}
```

---

## 📊 Web3 Dependencies Deep Dive

### Current Web3 Stack

```json
{
  "wagmi": "^2.x",
  "viem": "^2.x",
  "@reown/appkit": "latest",
  "ethers": "^6.x"  // Consider removing if viem only
}
```

### Analysis

**wagmi + viem (130KB combined)**
- Essential for Web3 integration
- Cannot remove without losing blockchain functionality
- Already optimized
- Consider: Extract to separate bundle chunk

**@reown/appkit (50KB)**
- Wallet connection UI
- Can be lazy loaded on specific routes
- Consider: Only load on blockchain-dependent pages

**ethers (30KB - if unused)**
- Duplicate of viem functionality
- Remove if viem is primary library
- Verify no legacy code depends on it

### Optimization Strategy

```typescript
// frontend/config/web3.ts

// Lazy load Web3 dependencies
export async function getWeb3Modules() {
  const { WagmiConfig } = await import('wagmi');
  const { createClient, configureChains } = await import('wagmi');
  
  return { WagmiConfig, createClient, configureChains };
}

// Only initialize Web3 on pages that need it
export function withWeb3(Component) {
  return dynamic(
    () => Promise.all([
      import('wagmi'),
      import('viem'),
    ]).then(([{ default: WagmiWrapper }]) => WagmiWrapper(Component)),
    { ssr: false }
  );
}
```

---

## 🔍 Package Analysis Commands

### Find Large Packages

```bash
# See individual package sizes
npm list --depth=0

# See actual bundled sizes
npx webpack-bundle-analyzer .next/static/chunks/main*.js

# See which packages export what
npx depcruise --include-only "^src" src

# Find duplicate packages
npm ls

# Analyze specific dependency tree
npm ls wagmi
npm ls react
```

### Generate Detailed Report

```bash
# Create a size report
npx bundle-report

# Save to file
npx bundle-report > bundle-report.txt

# Compare with previous build
git checkout main
npm run build
mv .next .next-main
git checkout issue-144
npm run build
npx bundle-report > bundle-report.txt
diff <(npx bundle-report .next-main) <(npx bundle-report .next)
```

---

## 📈 Dependency Update Strategy

### Safe Updates

```bash
# Update minor versions (safe, mostly backward compatible)
npm update

# Check what would update
npm outdated

# Test after updates
npm test
npm run build
npm run bundle:check
```

### Risky Updates

```bash
# Major version updates require testing
npm install wagmi@latest
npm test
npm run build

# Revert if issues
npm install wagmi@previous-version
```

### Version Pinning

```json
{
  "dependencies": {
    "wagmi": "^2.5.0",      // Allow patch updates
    "react": "18.2.0",      // Fixed version for stability
    "framer-motion": "^10.0" // Allow minor updates
  }
}
```

---

## 💡 Recommended Actions

### Immediate (Week 1) - Save 65KB

- [ ] Remove unused `ethers` package (30KB)
- [ ] Remove `pino` logger, use console (25KB)
- [ ] Remove unused packages from depcheck (10KB)

### Short-term (Week 2-3) - Save 50KB

- [ ] Lazy load Sentry (40KB)
- [ ] Replace Axios with Fetch API (15KB)
- [ ] Lazy load admin features (10KB)

### Medium-term (Month 2) - Save 35KB

- [ ] Replace Framer Motion with CSS animations (35KB)
- [ ] Or switch to React Spring (10KB)

### Long-term (Quarter 2)

- [ ] Evaluate Web3 library consolidation
- [ ] Consider Preact for production
- [ ] Tree-shake unused icon library

---

## 🚨 What NOT to Remove

| Package | Why | Size | Impact |
|---------|-----|------|--------|
| wagmi | Web3 core | 85KB | CRITICAL - blockchain integration |
| viem | Web3 core | 45KB | CRITICAL - contract interaction |
| react | Framework | 45KB | CRITICAL - entire app |
| zustand | State management | 5KB | CRITICAL - app state |
| zod | Validation | 18KB | IMPORTANT - data validation |

---

## ✅ Verification Checklist

- [ ] Audit unused packages with depcheck
- [ ] Verify ethers truly unused
- [ ] Test feature removal in development
- [ ] Run full test suite after changes
- [ ] Measure bundle size reduction
- [ ] Check no regressions in CI/CD
- [ ] Update documentation
- [ ] Monitor production metrics

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Maintainer:** Development Team  
**Status:** In Progress
