# Performance Tuning & Web Vitals

Guide to achieving Core Web Vitals targets and performance optimization.

---

## 🎯 Target Metrics

### Core Web Vitals (CWV)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Largest Contentful Paint (LCP)** | < 2.5s | ~3-4s | ⚠️ |
| **First Input Delay (FID)** | < 100ms | ~80-120ms | ⚠️ |
| **Cumulative Layout Shift (CLS)** | < 0.1 | ~0.05 | ✅ |

### Bundle Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Initial JS** | < 200KB | ~350KB | ⚠️ |
| **Total CSS** | < 50KB | ~60KB | ⚠️ |
| **Time to Interactive (TTI)** | < 3s (3G) | ~4-5s | ⚠️ |
| **First Contentful Paint (FCP)** | < 1.8s | ~2.5-3s | ⚠️ |

---

## 🔧 Performance Tuning Techniques

### 1. Image Optimization

```typescript
// ❌ BAD: Unoptimized images
<img src="/logo.png" />

// ✅ GOOD: Use Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Zali Logo"
  width={200}
  height={100}
  priority // Load above the fold
  placeholder="blur"
  blurDataURL="data:image/..." // LQIP
/>
```

**Impact:** Saves 50-70% image size

### 2. Font Optimization

```typescript
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

// Load only needed weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap', // Show fallback immediately
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});
```

**Impact:** Reduces font file size, prevents layout shift

### 3. JavaScript Optimization

```typescript
// ✅ Minimize main thread work
- Remove unused JavaScript
- Defer non-critical JavaScript
- Use web workers for heavy computation

// main.ts - Remove any initialization that's not critical
// ❌ BAD: Runs immediately
import { initAnalytics } from '@/lib/analytics';
initAnalytics();

// ✅ GOOD: Lazy load analytics
if (process.env.NODE_ENV === 'production') {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('@/lib/analytics').then(m => m.initAnalytics());
    });
  } else {
    setTimeout(() => {
      import('@/lib/analytics').then(m => m.initAnalytics());
    }, 2000);
  }
}
```

**Impact:** Reduces main thread blocking time

### 4. CSS Optimization

```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // Limit color palette for smaller CSS
    colors: {
      // Use color variables instead of 100s of colors
    },
  },
  // Disable unused CSS features
  corePlugins: {
    preflight: true,
    container: false, // If not used
  },
};
```

**Impact:** Reduces CSS bundle by 20-40%

### 5. Third-Party Script Optimization

```typescript
// ❌ BAD: Blocks rendering
<script src="https://analytics.js" />

// ✅ GOOD: Load asynchronously
<script
  src="https://analytics.js"
  async
  defer
/>

// ✅ BEST: Load with next/script
import Script from 'next/script';

export default function Layout() {
  return (
    <>
      <Script
        src="https://analytics.js"
        strategy="afterInteractive"
        // Strategies: beforeInteractive, afterInteractive, lazyOnload
      />
    </>
  );
}
```

**Impact:** Reduces LCP by 0.5-1s

### 6. React Component Optimization

```typescript
// ❌ BAD: Unnecessary re-renders
function Component({ data }) {
  return <div>{data.map(...)}</div>;
}

// ✅ GOOD: Memoize when appropriate
import { memo } from 'react';

const Component = memo(({ data }) => {
  return <div>{data.map(...)}</div>;
});

// ✅ BETTER: Use useMemo for expensive calculations
import { useMemo } from 'react';

function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(expensiveFunction);
  }, [data]);
  
  return <div>{processed}</div>;
}
```

**Impact:** Reduces re-render time by 30-50%

### 7. Database Query Optimization

```typescript
// ❌ BAD: N+1 queries
const users = await getAllUsers();
const scores = await Promise.all(
  users.map(u => getUserScore(u.id))
);

// ✅ GOOD: Batch queries
const data = await db.query(`
  SELECT users.*, scores.total
  FROM users
  JOIN scores ON users.id = scores.user_id
`);
```

**Impact:** Reduces API response time by 50-80%

---

## 📊 Monitoring Metrics

### Using Lighthouse

```bash
# Run local Lighthouse audit
npm run build
npm run start

# CLI audit
npx lighthouse https://localhost:3000 --view

# Headless audit
npx lighthouse https://localhost:3000 --output=json
```

### Using Chrome DevTools

1. Open DevTools (F12)
2. Go to "Performance" tab
3. Click "Record"
4. Interact with page
5. Click "Stop"
6. Analyze metrics

### Key Metrics to Watch

```
Performance Metrics:
├── First Contentful Paint (FCP): 1.5-2.0s ✅
├── Largest Contentful Paint (LCP): < 2.5s
├── Cumulative Layout Shift (CLS): < 0.1
├── Time to Interactive (TTI): 2.5-3s
└── Frames Per Second (FPS): > 60fps

Resource Metrics:
├── Total size: < 500KB gzipped
├── JS size: < 200KB gzipped
├── CSS size: < 50KB
└── Images: Optimized with WebP
```

---

## 🚀 Quick Wins (Implement First)

### Week 1 Implementation

1. **Enable Image Optimization** (Save 60%)
   ```typescript
   // Already have Image component? Great!
   // Just ensure all <img> tags are converted
   ```

2. **Remove Unused CSS** (Save 20-30KB)
   ```bash
   npm run build
   # Check CSS sizes in .next/static
   ```

3. **Code Split Routes** (Already done by Next.js)
   ```bash
   # Verify in .next/static/chunks/app/
   ```

4. **Defer Non-Critical JS** (Save 0.5-1s LCP)
   ```typescript
   // Move analytics to afterInteractive
   ```

5. **Font Optimization** (Save 50KB)
   ```typescript
   // Use next/font with display: 'swap'
   ```

---

## 📈 Performance Budget

Set limits for different resources:

```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// After building, set these budgets
const budgets = {
  bundles: [
    {
      type: 'javascript',
      maxSize: '250kb', // All JS chunks combined
    },
    {
      type: 'css',
      maxSize: '50kb',
    },
    {
      type: 'fonts',
      maxSize: '100kb',
    },
    {
      type: 'image',
      maxSize: '500kb',
    },
  ],
};
```

---

## 🔍 Debugging Performance Issues

### Issue: Slow Initial Load

**Diagnosis:**
```bash
1. Run Lighthouse audit
2. Check "Opportunities" section
3. Look for unoptimized images, render-blocking JS
```

**Solutions:**
- Optimize images
- Code split
- Defer non-critical JS
- Use dynamic imports

### Issue: High Main Thread Time

**Diagnosis:**
```bash
1. Open Performance tab in DevTools
2. Look for long tasks (> 50ms)
3. Identify slow functions
```

**Solutions:**
- Break long tasks into smaller ones
- Use requestAnimationFrame
- Move work to web workers
- Optimize algorithms

### Issue: CLS (Layout Shift)

**Diagnosis:**
```bash
1. Monitor CLS in DevTools
2. Find elements that shift
3. Check for unsized images, fonts, ads
```

**Solutions:**
- Set explicit dimensions
- Use aspect-ratio
- Optimize fonts with display: swap
- Use skeleton loaders

### Issue: Large Bundle

**Diagnosis:**
```bash
npm run build:analyze
# Identify large dependencies
```

**Solutions:**
- Remove unused packages
- Use lighter alternatives
- Tree shake
- Code split

---

## 🎯 Performance Checklist

### Before Deploy

- [ ] Run `npm run build`
- [ ] Check build size report
- [ ] Run Lighthouse audit (> 90 score)
- [ ] Test on 3G connection
- [ ] Check Core Web Vitals
- [ ] Verify no console errors/warnings
- [ ] Test on real devices
- [ ] Check mobile performance

### After Deploy

- [ ] Monitor analytics (avg LCP, FID, CLS)
- [ ] Set up real user monitoring (RUM)
- [ ] Track performance metrics
- [ ] Alert on degradation
- [ ] Regular audits (weekly/monthly)

---

## 📊 Real User Monitoring (RUM)

```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  // Send to analytics
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', JSON.stringify(metric));
  } else {
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  }
}

// Initialize in app
getCLS(reportWebVitals);
getFID(reportWebVitals);
getFCP(reportWebVitals);
getLCP(reportWebVitals);
getTTFB(reportWebVitals);
```

---

## 🔗 Performance Budgets by Route

| Route | Budget | Current | Gap |
|-------|--------|---------|-----|
| / | 150KB | 180KB | -30KB |
| /play | 200KB | 240KB | -40KB |
| /leaderboard | 160KB | 190KB | -30KB |
| /profile | 150KB | 170KB | -20KB |
| /admin | 180KB | 220KB | -40KB |

**Total:** Must reduce by ~160KB to hit targets

---

## 📚 Resources

- [Web.dev Performance Guide](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/learn/foundations/how-nextjs-works/rendering)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals Guide](https://web.dev/vitals/)

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete
