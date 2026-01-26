# Bundle Optimization Troubleshooting & Best Practices

Complete guide to troubleshooting common bundle optimization issues and following best practices.

---

## 🐛 Troubleshooting Common Issues

### Issue: Build Fails After Removing Dependency

**Symptom:** Error like `Module not found: ethers`

**Root Causes:**
1. Removed package but code still imports it
2. Removed dev dependency needed for build
3. Removed transitive dependency

**Solution:**

```bash
# 1. Find all imports of the package
grep -r "from '[package-name]'" src/
grep -r "require('[package-name]')" src/
grep -r "import.*[package-name]" src/

# 2. Remove or replace imports found

# 3. If it's a peer dependency, keep it
npm list --depth=0 [package-name]

# 4. Revert and try different package
git revert HEAD
npm install [package-name]
npm test
```

### Issue: Lazy Loaded Component Not Loading

**Symptom:** Component shows loading state indefinitely or blank screen

**Root Causes:**
1. Circular import in lazy loaded file
2. SSR rendering attempt on browser-only component
3. Missing loading component

**Solution:**

```bash
# 1. Check for circular imports
npx depcruise --focus "src/components/YourComponent" src/

# 2. Ensure ssr: false for browser-only components
// components/BrowserOnly.tsx
const Component = dynamic(() => import('./Heavy'), { ssr: false });

# 3. Provide proper loading component
const Component = dynamic(
  () => import('./Heavy'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

# 4. Check DevTools console for errors
# - Network tab: verify chunk loads
# - Console: check for JS errors
# - Application tab: check local storage/session storage
```

### Issue: Bundle Size Didn't Improve

**Symptom:** Same bundle size after optimization attempts

**Root Causes:**
1. Package not actually removed (still imported somewhere)
2. Lazy loading not working properly
3. Different import format still loading package
4. Transitive dependencies still pulled in

**Solution:**

```bash
# 1. Verify package truly removed
npm list [package-name]
# Should show "npm ERR! not installed"

# 2. Trace all imports
grep -r "[package-name]" src/ --include="*.ts" --include="*.tsx"

# 3. Check webpack to see what's in chunks
npm run bundle:analyze

# Look for the package in the bundle
# - If in main chunk: still being imported
# - If in separate chunk: lazy loading not working
# - If not present: successfully removed

# 4. Check for transitive dependencies
npm ls | grep "[package-name]"
# Shows what pulled it in

# 5. Force rebuild without cache
rm -rf .next
npm run build
```

### Issue: Performance Metrics Not Improving

**Symptom:** LCP, FID, CLS metrics unchanged despite bundle reduction

**Root Causes:**
1. Code splitting effective but not reaching initial load
2. Slow API/network calls blocking rendering
3. Large images or fonts not optimized
4. JavaScript execution time still high

**Solution:**

```bash
# 1. Check what's actually in initial load
npm run lighthouse -- --only-categories=performance

# 2. Profile JavaScript execution
# In DevTools > Performance tab:
# - Click "Record"
# - Interact with page
# - Look for long tasks

# 3. Check network waterfall
# DevTools > Network tab > Throttle to 4G
# See what loads first, what blocks rendering

# 4. Optimize images
# frontend/next.config.js
images: {
  formats: ['image/webp', 'image/avif'],
}

# 5. Defer non-critical JS
<script defer src="/analytics.js"></script>

# 6. Optimize fonts
// Use font-display: swap
@font-face {
  font-family: 'MyFont';
  src: url('/font.woff2');
  font-display: swap;
}
```

### Issue: Lazy Loading Causes Layout Shift

**Symptom:** Page jumps or content shifts when lazy component loads

**Root Causes:**
1. Loading skeleton doesn't match final component height
2. No reserved space for component
3. Component loads with different dimensions

**Solution:**

```typescript
// Before: CLS > 0.15
function Modal() {
  const [loaded, setLoaded] = useState(false);
  
  return (
    loaded ? <HeavyComponent /> : <div>Loading...</div>
  );
}

// After: CLS < 0.1
function Modal() {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div style={{ minHeight: '400px' }}>
      {loaded ? <HeavyComponent /> : <ModalSkeleton />}
    </div>
  );
}

// Or use Suspense with fallback that matches dimensions
<Suspense fallback={<ModalSkeleton />}>
  <HeavyComponent />
</Suspense>
```

### Issue: Website Breaks in Production But Works Locally

**Symptom:** Works fine with `npm run dev` but broken after `npm run build`

**Root Causes:**
1. Tree-shaking removed needed code
2. Minification broke code
3. Environment variables not set
4. Lazy imports not resolving in production

**Solution:**

```bash
# 1. Test production build locally
npm run build
npm run start  # Runs Next.js in production mode

# 2. Check browser console for errors
# Open DevTools > Console tab
# Look for red error messages

# 3. Check network tab for failed requests
# Look for 404s or failed chunk loads

# 4. Verify environment variables
# In production environment, set all NEXT_PUBLIC_* vars
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_API_URL=https://api.example.com

# 5. Disable tree-shaking temporarily to debug
// next.config.js
webpack: (config) => {
  config.optimization.usedExports = false;
  return config;
}

# After fixing, re-enable
```

---

## ✅ Best Practices

### 1. Always Measure Before and After

```bash
# Before optimization
npm run build
BEFORE_SIZE=$(du -sh .next/static/chunks | awk '{print $1}')
BEFORE_LCP=$(npm run lighthouse 2>/dev/null | grep "Largest Contentful Paint" | awk '{print $NF}')

# After optimization
# ... make changes ...
npm run build
AFTER_SIZE=$(du -sh .next/static/chunks | awk '{print $1}')
AFTER_LCP=$(npm run lighthouse 2>/dev/null | grep "Largest Contentful Paint" | awk '{print $NF}')

echo "Bundle size: $BEFORE_SIZE → $AFTER_SIZE"
echo "LCP: $BEFORE_LCP → $AFTER_LCP"
```

### 2. Incremental Changes

✅ **Good:** Make one change, test, measure, commit
```bash
# Step 1: Remove ethers
npm uninstall ethers
npm test && npm run build
git add -A && git commit -m "Remove unused ethers dependency"

# Step 2: Remove pino
npm uninstall pino
npm test && npm run build
git add -A && git commit -m "Replace pino with console logging"

# Each change is isolated and reversible
```

❌ **Bad:** Remove multiple packages at once
```bash
npm uninstall ethers pino axios lodash
npm test  # Fails - which one caused it?
```

### 3. Test Every Change

```bash
# Run full test suite
npm test

# Run end-to-end tests
npm run test:e2e

# Test in production mode
npm run build
npm run start

# Test on actual mobile device
# Use ngrok to expose local server: npx ngrok http 3000
```

### 4. Use Feature Flags for Safe Rollout

```typescript
// utils/features.ts
export const FEATURES = {
  NEW_UI: process.env.NEXT_PUBLIC_ENABLE_NEW_UI === 'true',
  LAZY_MODALS: process.env.NEXT_PUBLIC_LAZY_MODALS === 'true',
  OPTIMIZED_IMAGES: process.env.NEXT_PUBLIC_OPTIMIZED_IMAGES === 'true',
};

// Deploy to production with all flags off
// Then gradually enable: NEXT_PUBLIC_ENABLE_NEW_UI=true
// Monitor metrics for regressions
// If issues, disable: NEXT_PUBLIC_ENABLE_NEW_UI=false
```

### 5. Document Changes

```markdown
# Commit Message Template

## What
Short description of what changed

## Why
Explain the reasoning and business impact

## How
Technical details of the change

## Metrics
Before/After comparisons:
- Bundle size: 220KB → 140KB (-36%)
- LCP: 4.2s → 2.1s (-50%)

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing on mobile
- [ ] Performance metrics checked
```

### 6. Monitor After Deployment

```bash
# Set up alerts for regressions
PERFORMANCE_THRESHOLD_JS=210000  # 210KB
PERFORMANCE_THRESHOLD_LCP=2.7    # 2.7s

# Monitor real user metrics (RUM)
# Set up dashboards in Datadog/Grafana
# Get alerted if metrics exceed thresholds

# Review metrics weekly
# Compare with previous weeks for trends
```

### 7. Don't Premature Optimize

**Focus on:**
- High-impact changes first (remove 100KB packages)
- Frequently used paths (home page, game page)
- Slow metrics (LCP > 3s, TTI > 5s)

**Avoid:**
- Optimizing unused features
- Over-complicating code for 1-2KB savings
- Removing features users need
- Sacrificing UX for bundle size

### 8. Use Tools Effectively

```bash
# Bundle Analyzer
npm run bundle:analyze
# Visual representation of bundle

# Lighthouse
npm run lighthouse
# Performance audits

# Depcheck
npx depcheck
# Find unused dependencies

# Webpack Bundle Analyzer
npx webpack-bundle-analyzer .next/static/chunks/main*.js
# See what's in each chunk

# Depcruise
npx depcruise src
# Visualize dependencies
```

---

## 📊 Performance Optimization Workflow

```
┌─────────────────────────────────┐
│  1. Measure Current Metrics     │
│     - Bundle size               │
│     - Core Web Vitals          │
│     - Lighthouse score          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  2. Identify Low Hanging Fruit  │
│     - Unused packages           │
│     - Large dependencies        │
│     - Frequently unused features│
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  3. Implement Optimizations     │
│     - One change at a time      │
│     - Test each change          │
│     - Commit with metrics       │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  4. Measure Improvement         │
│     - Compare before/after      │
│     - Document results          │
│     - Alert if regression       │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  5. Deploy & Monitor            │
│     - Deploy to production      │
│     - Set up RUM monitoring     │
│     - Alert on regressions      │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  6. Iterate & Improve           │
│     - Monthly reviews           │
│     - Compare with competitors  │
│     - Plan next optimizations   │
└─────────────────────────────────┘
```

---

## 🎯 Performance Champions Checklist

Team members working on performance should:

- [ ] Understand Web Vitals (LCP, FID, CLS)
- [ ] Know how to use bundle analyzer
- [ ] Can identify optimization opportunities
- [ ] Know how to implement dynamic imports
- [ ] Can measure before/after metrics
- [ ] Write good commit messages
- [ ] Follow performance review process
- [ ] Alert team of regressions
- [ ] Document changes well
- [ ] Consider mobile-first approach

---

## 📚 Resources & References

### Documentation
- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/learn/seo/introduction-to-performance)
- [Webpack Documentation](https://webpack.js.org/)

### Tools
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://github.com/webpack-bundle-analyzer/webpack-bundle-analyzer)
- [Web Vitals Library](https://github.com/GoogleChrome/web-vitals)

### Guides
- [HTTP Archive State of JavaScript](https://httparchive.org/reports/state-of-javascript)
- [Web.dev Performance Audit](https://web.dev/performance/)
- [Web Almanac JavaScript Report](https://almanac.httparchive.org/en/2023/javascript)

---

## 🚀 Quick Reference

### Common Commands

```bash
# Analyze bundle
npm run bundle:analyze

# Check for unused packages
npx depcheck

# Run performance audit
npm run lighthouse

# Build in production mode
npm run build

# Start production server
npm run start

# Check specific dependency
npm ls [package-name]

# Update package safely
npm update [package-name]

# Remove unused code
npx depcheck --update-notree
```

### Performance Targets

| Metric | Target | Warning |
|--------|--------|---------|
| Initial JS | < 50KB | > 60KB |
| Total Bundle | < 150KB | > 170KB |
| LCP | < 2.5s | > 2.8s |
| FID | < 100ms | > 120ms |
| CLS | < 0.1 | > 0.12 |
| TTI | < 3s | > 3.5s |

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete
