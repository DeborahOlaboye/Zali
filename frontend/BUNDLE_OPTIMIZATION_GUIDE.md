# Bundle Size Optimization Guide

Comprehensive guide to analyzing and optimizing the Zali frontend bundle size.

---

## 📊 Current Bundle Analysis

### Target Metrics
- ✅ Initial load: **< 200KB gzipped** (Core JS)
- ✅ Time to interactive: **< 3s on 3G** (with optimal caching)
- ✅ Total bundle: **< 500KB gzipped** (All chunks combined)

### Key Dependencies (Size Estimates)

| Package | Size | Type | Priority |
|---------|------|------|----------|
| wagmi | ~85KB | Essential | Keep |
| viem | ~45KB | Essential | Keep |
| framer-motion | ~35KB | Animation | Optimize |
| react-query | ~30KB | Caching | Keep |
| @reown/appkit | ~50KB | Wallet UI | Keep |
| sentry | ~40KB | Monitoring | Optional |
| zod | ~18KB | Validation | Keep |
| pino | ~25KB | Logging | Optional |
| Others | ~100KB | Misc | Review |

---

## 🎯 Optimization Strategies

### 1. Code Splitting (Priority: HIGH)

**Current Issue:** All routes loaded in initial bundle

**Solution:** Route-based code splitting

```typescript
// next.config.ts - Already handled by Next.js automatically
// But ensure dynamic imports are used:

// ❌ Avoid
import AdminPage from '@/app/admin/page';

// ✅ Use
const AdminPage = dynamic(
  () => import('@/app/admin/page'),
  { loading: () => <div>Loading...</div> }
);
```

**Expected Savings:** 50-80KB

### 2. Component Lazy Loading (Priority: HIGH)

**Current Issue:** Framer Motion and heavy components load upfront

**Solution:** Lazy load animation components

```typescript
// Components that animate on scroll/hover
// Should be lazy loaded with dynamic import

const AnimatedCard = dynamic(
  () => import('@/components/AnimatedCard'),
  { ssr: false, loading: () => <Skeleton /> }
);
```

**Expected Savings:** 35-50KB

### 3. Dynamic Imports for Heavy Features (Priority: MEDIUM)

**Current Issue:** Admin panel, advanced features loaded for all users

**Solution:** Split by role/feature

```typescript
// Only load admin features when needed
const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard'),
  { loading: () => <LoadingSpinner /> }
);
```

**Expected Savings:** 20-30KB

### 4. Tree Shaking & Unused Code (Priority: MEDIUM)

**Current Issue:** Unused utilities and dead code

**Solution:** 
- Remove unused exports
- Use named imports
- Enable production optimizations

```typescript
// ❌ Import entire module
import * as utils from '@/utils';

// ✅ Import specific functions
import { formatAddress, formatTokenAmount } from '@/utils';
```

**Expected Savings:** 10-20KB

### 5. Dependency Optimization (Priority: MEDIUM)

**Evaluate these packages:**

| Package | Alternative | Savings | Notes |
|---------|-------------|---------|-------|
| framer-motion | CSS animations | 30-35KB | Consider for non-critical animations |
| pino | console.log | 25KB | Remove in production |
| sentry | Custom error handler | 40KB | Optional monitoring |
| @geist-ui/core | Tailwind UI | 50KB | Already using Tailwind |

### 6. Tree Shake Web3 Libraries (Priority: LOW)

**Current:** Importing all of Wagmi/Viem

**Solution:** Import only needed hooks

```typescript
// ✅ Named imports (automatically tree-shaken)
import { useAccount, useBalance } from 'wagmi';

// Can verify with webpack bundle analyzer
```

**Expected Savings:** 5-10KB (if done correctly)

---

## 🛠️ Implementation Checklist

### Phase 1: Analysis (Week 1)
- [ ] Install `@next/bundle-analyzer`
- [ ] Generate bundle report
- [ ] Document dependency sizes
- [ ] Identify largest chunks
- [ ] Create baseline metrics

### Phase 2: Quick Wins (Week 1-2)
- [ ] Remove unused dependencies
- [ ] Enable Next.js compression
- [ ] Configure dynamic imports
- [ ] Remove console.log in prod
- [ ] Add bundle size budgets

### Phase 3: Code Splitting (Week 2-3)
- [ ] Split by routes
- [ ] Split by features
- [ ] Lazy load components
- [ ] Test performance
- [ ] Measure improvements

### Phase 4: Dependency Reduction (Week 3-4)
- [ ] Evaluate alternatives
- [ ] Replace heavy packages
- [ ] Update imports
- [ ] Remove dead code
- [ ] Final measurements

### Phase 5: Monitoring (Ongoing)
- [ ] Add CI bundle checks
- [ ] Monitor metrics
- [ ] Alert on increases
- [ ] Documentation
- [ ] Team training

---

## 📈 Expected Results

### Before Optimization
```
Initial JS:     ~350KB gzipped
Framer Motion:  ~35KB
Admin Bundle:   ~50KB
Total:          ~500KB+ gzipped
Time to Interactive: ~4-5s on 3G
```

### After Optimization
```
Initial JS:     ~180KB gzipped ✅
Framer Motion:  Lazy loaded
Admin Bundle:   Lazy loaded
Total:          ~400KB gzipped ✅
Time to Interactive: ~2-3s on 3G ✅
```

---

## 🔍 Monitoring & Alerts

### Bundle Size Budgets (next.config.ts)

```typescript
experimental: {
  isrMemoryCacheSize: 50 * 1024 * 1024, // 50 MB
},
swcMinify: true,
compress: {
  level: 11,
},
```

### CI/CD Integration

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check bundle size
        run: npm run bundle:analyze
      - name: Compare with main
        run: npm run bundle:compare
```

---

## 📝 Per-Route Bundle Breakdown

### Pages (Estimated Post-Optimization)

| Route | Size | Load Time |
|-------|------|-----------|
| / (Home) | 45KB | 0.5s |
| /play | 85KB | 1.0s |
| /leaderboard | 55KB | 0.7s |
| /profile | 50KB | 0.6s |
| /admin | 60KB* | 0.8s* |
| /faucet | 35KB | 0.4s |

*Lazy loaded on demand

---

## 🎯 Performance Goals

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3s on 3G

### Bundle Size Targets

- **Initial JS chunk:** < 200KB gzipped
- **CSS:** < 50KB gzipped
- **Per route:** < 100KB gzipped
- **Total all chunks:** < 500KB gzipped

---

## 💡 Best Practices

### DO ✅
- Use dynamic imports for heavy components
- Tree shake dependencies with named imports
- Code split at route level
- Lazy load images with Next.js Image
- Use production builds for testing
- Monitor bundle size in CI/CD
- Document bundle size decisions

### DON'T ❌
- Import entire utility modules
- Mix default and named imports
- Load all features for all users
- Ignore bundle warnings
- Skip performance testing
- Assume optimization is "done"
- Load heavy animations on initial render

---

## 🔗 Related Files

- [BUNDLE_CONFIG.md](BUNDLE_CONFIG.md) - Configuration details
- [DYNAMIC_IMPORTS.md](DYNAMIC_IMPORTS.md) - Implementation guide
- [PERFORMANCE_TUNING.md](PERFORMANCE_TUNING.md) - Performance tips
- [BUNDLE_MONITORING.md](BUNDLE_MONITORING.md) - CI/CD integration

---

## 📚 Resources

- [Next.js Bundle Analysis](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Webpack Bundle Analyzer](https://github.com/webpack-bundle-analyzer/webpack-bundle-analyzer)
- [Web.dev Performance Guide](https://web.dev/performance)
- [Framer Motion Optimization](https://www.framer.com/motion)

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete
