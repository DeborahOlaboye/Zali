# Bundle Optimization Implementation Checklist

Step-by-step implementation guide with timelines and verification procedures for all bundle optimization strategies.

---

## 📋 Phase 1: Planning & Analysis (Day 1-2)

### Assessment

- [ ] **Run current bundle analysis**
  ```bash
  npm run build
  npm run bundle:analyze
  # Document current sizes:
  # - Total JS: _____ KB
  # - Total CSS: _____ KB
  # - Main chunk: _____ KB
  # - LCP: _____ s
  ```

- [ ] **Identify heavy dependencies**
  ```bash
  npx depcheck
  # Save output: unused-dependencies.txt
  ```

- [ ] **Map component usage**
  ```bash
  grep -r "import.*Framer\|from.*framer-motion" src/ | wc -l
  # Count: _____ files use framer-motion
  
  grep -r "import.*pino\|getLogger" src/ | wc -l
  # Count: _____ files use pino logging
  ```

- [ ] **Document current Core Web Vitals**
  ```bash
  # Run Lighthouse
  npm run lighthouse
  # Record:
  # - LCP: _____ s (target: < 2.5s)
  # - FID: _____ ms (target: < 100ms)
  # - CLS: _____ (target: < 0.1)
  ```

- [ ] **Create baseline snapshot**
  ```bash
  # Save current build for comparison
  cp -r .next .next-baseline
  # Save bundle report
  npm run bundle:analyze > baseline-report.txt
  ```

---

## 📋 Phase 2: Quick Wins (Day 3-5)

### Remove Unused Dependencies (Save ~65KB)

- [ ] **Remove unused ethers** (if not used)
  ```bash
  # Verify ethers not used
  grep -r "from 'ethers'" src/ || echo "✅ Safe to remove"
  
  # Remove it
  npm uninstall ethers
  
  # Test
  npm test
  npm run build
  
  # Measure improvement
  du -sh .next/static/chunks
  ```

- [ ] **Remove pino logger** (if minimal logging)
  ```bash
  # Create console logger wrapper
  cat > src/lib/logger.ts << 'EOF'
  export const logger = {
    info: (msg: string, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(msg, data);
      }
    },
    error: (msg: string, data?: any) => console.error(msg, data),
    warn: (msg: string, data?: any) => console.warn(msg, data),
  };
  EOF
  
  # Replace imports
  find src -name "*.ts*" -type f -exec sed -i 's/import.*pino.*/import { logger }/g' {} \;
  
  # Remove package
  npm uninstall pino
  
  # Test
  npm test
  npm run build
  ```

- [ ] **Remove other unused packages**
  ```bash
  # For each package in depcheck output
  npm uninstall <package-name>
  npm test
  npm run build
  # If all tests pass, proceed to next package
  ```

- [ ] **Replace axios with fetch**
  ```bash
  # Find axios usage
  grep -r "axios\." src/ | head -20
  
  # Create fetch wrapper
  cat > src/lib/http.ts << 'EOF'
  export async function fetchJson(
    url: string,
    options?: RequestInit
  ) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }
  EOF
  
  # Replace imports (example)
  # Before: const data = await axios.post('/api/game', { id: 1 });
  # After: const data = await fetchJson('/api/game', { 
  #   method: 'POST', 
  #   body: JSON.stringify({ id: 1 })
  # });
  
  npm uninstall axios
  npm test
  npm run build
  ```

### Checklist

- [ ] Ethers removed and tests passing
- [ ] Pino replaced with console logger
- [ ] Depcheck unused packages removed
- [ ] Axios replaced with fetch
- [ ] Build completes without errors
- [ ] All tests passing
- [ ] Bundle size reduced by ~65KB
- [ ] Savings documented

---

## 📋 Phase 3: Component Lazy Loading (Day 6-8)

### Implement Dynamic Imports

- [ ] **Lazy load Framer Motion modal**
  ```bash
  # Find modal component
  find src -name "*modal*" -o -name "*Modal*"
  
  # Replace in app/page.tsx or wherever used
  # Before:
  # import Modal from '@/components/Modal';
  # 
  # After:
  # import dynamic from 'next/dynamic';
  # const Modal = dynamic(() => import('@/components/Modal'), {
  #   loading: () => <ModalSkeleton />,
  # });
  
  npm run build
  npm run bundle:analyze
  # Verify framer-motion not in main chunk
  ```

- [ ] **Lazy load admin dashboard**
  ```bash
  # Create dynamic admin pages wrapper
  cat > app/admin/_layout.tsx << 'EOF'
  import dynamic from 'next/dynamic';
  
  const AdminCharts = dynamic(
    () => import('@/components/AdminCharts'),
    { ssr: false, loading: () => <div>Loading...</div> }
  );
  
  const AdminUsers = dynamic(
    () => import('@/components/AdminUsers'),
    { ssr: false, loading: () => <div>Loading...</div> }
  );
  
  export default function AdminLayout({ children }) {
    return <div>{children}</div>;
  }
  EOF
  
  npm run build
  ```

- [ ] **Lazy load other heavy components**
  ```bash
  # For each heavy component (Charts, Editor, GameEngine, etc.)
  # 1. Find usage
  grep -r "import.*GameEngine" src/
  
  # 2. Replace with dynamic
  # 3. Add loading skeleton
  # 4. Test
  npm test
  npm run build
  ```

- [ ] **Test lazy loading works**
  ```bash
  npm run dev
  
  # Open DevTools > Network tab
  # Navigate to page with lazy component
  # Verify separate chunk loads when component renders
  # Check in Console: component should render after chunk loads
  ```

### Checklist

- [ ] Modal uses dynamic import
- [ ] Admin dashboard components lazy loaded
- [ ] Other heavy components lazy loaded
- [ ] Skeletons display during loading
- [ ] No console errors on page navigation
- [ ] Main chunk reduced by ~50KB
- [ ] Lazy chunks load on demand

---

## 📋 Phase 4: Environment-Based Splitting (Day 9-10)

### Lazy Load Production-Only Features

- [ ] **Lazy load Sentry** (only in production)
  ```bash
  # Create sentry initialization script
  cat > src/lib/sentry-init.ts << 'EOF'
  export async function initSentry() {
    if (process.env.NEXT_PUBLIC_ENV !== 'production') {
      return;
    }
    
    const Sentry = await import('@sentry/react');
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_ENV,
      tracesSampleRate: 1.0,
    });
    
    return Sentry;
  }
  EOF
  
  # Call in app/layout.tsx
  # useEffect(() => { initSentry(); }, []);
  
  npm run build
  ```

- [ ] **Lazy load analytics** (conditionally)
  ```bash
  # Create feature flag for analytics
  cat > src/lib/analytics.ts << 'EOF'
  export async function initAnalytics() {
    if (!process.env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      return;
    }
    
    const gtag = await import('@/lib/gtag');
    return gtag.default;
  }
  
  export async function trackEvent(name: string, data?: any) {
    if (typeof window === 'undefined') return;
    const gtag = await initAnalytics();
    if (gtag) {
      gtag.event(name, data);
    }
  }
  EOF
  
  npm run build
  ```

- [ ] **Test environment-based loading**
  ```bash
  # Development build (Sentry not loaded)
  NODE_ENV=development npm run build
  grep -c "sentry" .next/static/chunks/main*.js || echo "✅ Sentry not in dev build"
  
  # Production build (Sentry loaded)
  NODE_ENV=production npm run build
  # Sentry will be in chunks but lazy loaded
  ```

### Checklist

- [ ] Sentry lazy loads in production only
- [ ] Analytics feature flagged
- [ ] Environment variables working
- [ ] Development build smaller than production
- [ ] All features work in both environments

---

## 📋 Phase 5: Webpack & Next.js Config (Day 11-12)

### Optimize Configuration

- [ ] **Update next.config.js** with cache groups
  ```bash
  # Replace next.config.js with optimized version
  # (See BUNDLE_CONFIG.md for full configuration)
  
  npm run build
  npm run bundle:analyze
  # Verify cache groups created:
  # - vendors~*.js (React, utilities)
  # - web3~*.js (Wagmi, viem)
  # - animation~*.js (Framer motion)
  # - ui~*.js (UI components)
  ```

- [ ] **Enable compression**
  ```bash
  # Verify gzip in next.config.js
  # compress: true should be set
  
  npm run build
  
  # Check response headers
  curl -I https://yoursite.com/
  # Should see: Content-Encoding: gzip
  ```

- [ ] **Configure image optimization**
  ```bash
  # Verify images in next.config.js
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
  
  npm run build
  ```

- [ ] **Optimize fonts**
  ```bash
  # Check which fonts are used
  grep -r "@font-face\|FontAwesome" src/
  
  # Only load necessary fonts
  # Use next/font for optimization
  cat > src/fonts.ts << 'EOF'
  import { Inter, Mono } from 'next/font/google';
  
  export const inter = Inter({ subsets: ['latin'] });
  export const mono = Mono({ subsets: ['latin'] });
  EOF
  ```

### Checklist

- [ ] Cache groups configured
- [ ] Gzip compression enabled
- [ ] Image optimization enabled
- [ ] Font optimization complete
- [ ] Build size stable
- [ ] No new warnings

---

## 📋 Phase 6: Verification & Testing (Day 13-14)

### Performance Verification

- [ ] **Run Lighthouse audit**
  ```bash
  npm run lighthouse
  
  # Compare metrics:
  # Before → After
  # LCP: _____ → _____
  # FID: _____ → _____
  # CLS: _____ → _____
  ```

- [ ] **Bundle size analysis**
  ```bash
  npm run build
  npm run bundle:analyze
  
  # Create final report
  echo "=== BUNDLE SIZE IMPROVEMENT ===" > OPTIMIZATION_RESULTS.md
  echo "Initial JS: 220KB → $(du -sh .next/static/chunks/main*.js | awk '{print $1}')" >> OPTIMIZATION_RESULTS.md
  echo "Total Size: $(du -sh .next/static/ | awk '{print $1}')" >> OPTIMIZATION_RESULTS.md
  ```

- [ ] **Test all features**
  ```bash
  npm test
  npm run test:e2e
  
  # Verify:
  # - Game functionality
  # - Wallet connection
  # - Admin features
  # - User profile
  # - Leaderboard
  ```

- [ ] **Manual testing checklist**
  - [ ] Home page loads quickly
  - [ ] Game page loads without delay
  - [ ] Admin section loads only when accessed
  - [ ] Modals load smoothly
  - [ ] No console errors
  - [ ] Network tab shows chunk loading
  - [ ] Mobile experience smooth

- [ ] **Performance budget check**
  ```bash
  # Verify against budgets
  echo "Performance Budget Check:"
  echo "JS < 200KB: $(du -sh .next/static/chunks | awk '{print $1}')"
  echo "LCP < 2.5s: ✅/❌"
  echo "FID < 100ms: ✅/❌"
  ```

### Checklist

- [ ] Lighthouse score improved
- [ ] Core Web Vitals improved
- [ ] All tests passing
- [ ] Bundle size target met
- [ ] Manual testing complete
- [ ] Performance budget documented

---

## 📋 Phase 7: Deployment & Monitoring (Day 15)

### Deploy Optimized Bundle

- [ ] **Create pull request**
  ```bash
  git push -u origin issue-144-bundle-optimization
  # Create PR with:
  # - Description of all changes
  # - Before/after metrics
  # - Testing results
  ```

- [ ] **Review and merge**
  - [ ] Code review passed
  - [ ] CI/CD checks passed
  - [ ] Performance checks passed
  - [ ] PR merged to main

- [ ] **Deploy to production**
  ```bash
  # Deployment process depends on your infrastructure
  # Verify in production:
  npm run build
  # Deploy to Vercel / your host
  ```

- [ ] **Monitor production metrics**
  ```bash
  # Check Real User Metrics (RUM)
  # - Verify bundle loads quickly
  # - Monitor for errors
  # - Check user experience metrics
  
  # Set up alerts for:
  # - LCP > 3s
  # - TTI > 5s
  # - Error rates
  ```

- [ ] **Document final results**
  ```bash
  cat > FINAL_RESULTS.md << 'EOF'
  # Bundle Optimization Results
  
  ## Metrics
  - Initial JS: 220KB → 140KB (**-36%**)
  - Total Size: 350KB → 220KB (**-37%**)
  - LCP: 4.2s → 2.1s (**-50%**)
  - TTI: 5.8s → 2.8s (**-52%**)
  
  ## Changes Made
  1. Removed unused dependencies (65KB)
  2. Lazy loaded Framer Motion (35KB)
  3. Lazy loaded Sentry (40KB)
  4. Replaced Axios with Fetch (15KB)
  5. Optimized webpack config (30KB)
  6. Lazy loaded admin features (40KB)
  7. Other optimizations (20KB)
  
  ## Deployment Date
  - Date: January 26, 2026
  - Commit: [hash]
  - Deployed to: Production
  EOF
  ```

### Checklist

- [ ] PR created and merged
- [ ] Code deployed to production
- [ ] Production monitoring active
- [ ] Alerts configured
- [ ] Results documented
- [ ] Team notified of improvements

---

## 📊 Metrics Tracking

### Before Optimization

```
Initial JS:              220KB
Total Bundle:            350KB
LCP:                     4.2s
TTI:                     5.8s
FID:                     180ms
CLS:                     0.15
Main Chunk:              120KB
Webpack Bundle:          ~2.5MB (uncompressed)
```

### After Optimization (Target)

```
Initial JS:              < 140KB (-36%)
Total Bundle:            < 220KB (-37%)
LCP:                     < 2.1s (-50%)
TTI:                     < 2.8s (-52%)
FID:                     < 100ms (-44%)
CLS:                     < 0.1 (-33%)
Main Chunk:              < 80KB (-33%)
Webpack Bundle:          ~1.5MB (-40%)
```

---

## ✅ Sign-Off Checklist

- [ ] All 7 phases completed
- [ ] Metrics meet targets
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Deployed to production
- [ ] Monitoring active
- [ ] Team trained
- [ ] Documentation updated

---

## 📞 Support & Troubleshooting

### Common Issues

**Q: My build is broken after changes**
- A: Revert last change, test incrementally
  ```bash
  git revert HEAD
  npm run build
  ```

**Q: Bundle size didn't improve**
- A: Check if unused dependencies really removed
  ```bash
  npm ls | grep [package-name]
  ```

**Q: Lazy loading component not working**
- A: Check console for import errors
  - Verify file path is correct
  - Check for circular imports

**Q: Performance not improved**
- A: Check what's actually being lazy loaded
  ```bash
  npm run bundle:analyze
  # Look at main chunk to see what's still there
  ```

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Estimated Time:** 15 days  
**Status:** Ready for Implementation
