# Bundle Optimization - Practical Implementation Roadmap

Detailed 4-week implementation roadmap with specific daily tasks and milestones.

---

## 📅 4-Week Implementation Plan

### Week 1: Quick Wins & Analysis (Target: 65KB Savings)

**Goal:** Remove unused dependencies and identify optimization opportunities

#### Day 1-2: Audit & Planning

- [ ] **Day 1 Morning (1 hour)**
  ```bash
  # Baseline measurements
  npm run build
  CURRENT_SIZE=$(du -sh .next/static/chunks | awk '{print $1}')
  npm run lighthouse > baseline-lighthouse.txt
  echo "Current size: $CURRENT_SIZE"
  
  # Document in OPTIMIZATION_PROGRESS.md
  ```
  
- [ ] **Day 1 Afternoon (2 hours)**
  ```bash
  # Dependency analysis
  npx depcheck > unused-packages.txt
  npm ls > dependency-tree.txt
  
  # Check imports
  grep -r "from 'ethers'" src/ > ethers-imports.txt
  grep -r "from 'pino'" src/ > pino-imports.txt
  grep -r "from 'axios'" src/ > axios-imports.txt
  
  # Review findings
  cat unused-packages.txt
  ```

- [ ] **Day 2 Morning (2 hours)**
  ```bash
  # Plan removals
  # Create REMOVAL_PLAN.md with:
  # - What to remove
  # - Why it's safe
  # - What tests to run
  # - Rollback plan
  ```

- [ ] **Day 2 Afternoon (2 hours)**
  ```bash
  # Code review of dependencies
  # Verify no critical usage
  # Check for alternatives
  ```

#### Day 3-4: Remove Ethers (30KB)

- [ ] **Day 3 Morning (1 hour)**
  ```bash
  # Verify ethers not used
  git checkout -b remove-ethers
  
  grep -r "from 'ethers'" src/
  grep -r "require.*ethers" src/
  grep -r "import.*ethers" src/
  
  # Should show no results (safe to remove)
  ```

- [ ] **Day 3 Afternoon (2 hours)**
  ```bash
  # Remove package
  npm uninstall ethers
  npm test
  npm run build
  
  # Verify size reduction
  NEW_SIZE=$(du -sh .next/static/chunks | awk '{print $1}')
  echo "Size after removing ethers: $NEW_SIZE"
  ```

- [ ] **Day 4 Morning (1 hour)**
  ```bash
  # Run full test suite
  npm test
  npm run test:e2e
  
  # Manual testing
  npm run dev
  # Test: Home page, Game page, Wallet connection
  ```

- [ ] **Day 4 Afternoon (1 hour)**
  ```bash
  # Commit
  git add -A
  git commit -m "Remove unused ethers dependency - 30KB saved"
  ```

#### Day 5: Remove Pino (25KB)

- [ ] **Day 5 Morning (2 hours)**
  ```bash
  # Create logger wrapper
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
  ```

- [ ] **Day 5 Afternoon (1 hour)**
  ```bash
  # Replace imports
  find src -name "*.ts*" -exec sed -i.bak 's/import.*pino.*/import { logger }/g' {} \;
  
  # Verify replacements
  grep -r "pino" src/ | grep -v ".bak"
  
  # Remove backup files
  find src -name "*.bak" -delete
  ```

- [ ] **Day 5 Late (2 hours)**
  ```bash
  npm uninstall pino
  npm test
  npm run build
  
  # Commit
  git add -A
  git commit -m "Replace pino with console logging - 25KB saved"
  
  # Check cumulative progress
  echo "Week 1 savings so far: 55KB"
  ```

### Week 2: Component Lazy Loading (Target: 50KB Savings)

**Goal:** Implement dynamic imports for heavy components

#### Day 6-7: Lazy Load Framer Motion

- [ ] **Day 6 Morning (3 hours)**
  ```bash
  git checkout -b lazy-load-framer-motion
  
  # Find Modal component usage
  grep -r "import.*Modal" src/ | head -10
  
  # Create lazy loading wrapper
  cat > src/components/LazyModal.tsx << 'EOF'
  import dynamic from 'next/dynamic';
  
  const Modal = dynamic(
    () => import('./Modal'),
    { loading: () => <ModalSkeleton /> }
  );
  
  export default Modal;
  EOF
  ```

- [ ] **Day 6 Afternoon (2 hours)**
  ```bash
  # Replace imports
  # Before: import Modal from '@/components/Modal';
  # After: import Modal from '@/components/LazyModal';
  
  # Update in pages/game/page.tsx and other files
  sed -i 's|from.*Modal|from "@/components/LazyModal"|g' src/app/game/page.tsx
  ```

- [ ] **Day 7 Morning (2 hours)**
  ```bash
  npm test
  npm run build
  
  # Verify Framer Motion not in main chunk
  npm run bundle:analyze
  # Should see framer-motion in separate chunk
  ```

- [ ] **Day 7 Afternoon (1 hour)**
  ```bash
  git add -A
  git commit -m "Lazy load Framer Motion modal - 35KB saved"
  ```

#### Day 8: Lazy Load Sentry

- [ ] **Day 8 Morning (2 hours)**
  ```bash
  git checkout -b lazy-load-sentry
  
  # Create sentry initializer
  cat > src/lib/sentry-init.ts << 'EOF'
  export async function initSentry() {
    if (process.env.NEXT_PUBLIC_ENV !== 'production') {
      return;
    }
    
    const Sentry = await import('@sentry/react');
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_ENV,
    });
    
    return Sentry;
  }
  EOF
  ```

- [ ] **Day 8 Afternoon (2 hours)**
  ```bash
  # Update app/layout.tsx
  # Add: useEffect(() => { initSentry(); }, []);
  
  npm test
  npm run build
  git add -A
  git commit -m "Lazy load Sentry error tracking - 40KB saved"
  ```

#### Day 9: Lazy Load Admin Features

- [ ] **Day 9 Morning (1 hour)**
  ```bash
  git checkout -b lazy-load-admin
  
  # Create lazy admin panel
  cat > src/components/LazyAdminPanel.tsx << 'EOF'
  import dynamic from 'next/dynamic';
  
  const AdminPanel = dynamic(
    () => import('./AdminPanel'),
    { ssr: false }
  );
  
  export default AdminPanel;
  EOF
  ```

- [ ] **Day 9 Afternoon (2 hours)**
  ```bash
  # Update app/admin/page.tsx to use lazy loading
  npm test
  npm run build
  git add -A
  git commit -m "Lazy load admin panel - 20KB saved for regular users"
  ```

#### Day 10: Replace Axios with Fetch

- [ ] **Day 10 Morning (2 hours)**
  ```bash
  git checkout -b replace-axios-fetch
  
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
  ```

- [ ] **Day 10 Afternoon (2 hours)**
  ```bash
  # Replace axios calls
  # grep -r "axios\." src/ | head -5 to see usage
  
  # Example replacements:
  # Before: const data = await axios.post('/api/game', { id: 1 });
  # After: const data = await fetchJson('/api/game', {
  #   method: 'POST',
  #   body: JSON.stringify({ id: 1 })
  # });
  
  npm uninstall axios
  npm test
  npm run build
  git add -A
  git commit -m "Replace axios with fetch API - 15KB saved"
  ```

### Week 3: Build Configuration (Target: 30KB Savings)

**Goal:** Optimize webpack and Next.js configuration

#### Day 11: Configure Webpack Cache Groups

- [ ] **Day 11 Morning (3 hours)**
  ```bash
  git checkout -b optimize-webpack-config
  
  # Update next.config.js
  # See BUNDLE_CONFIG.md for full configuration
  
  # Key changes:
  # - Add cache groups for web3, animation, ui
  # - Enable compression
  # - Configure source maps
  ```

- [ ] **Day 11 Afternoon (2 hours)**
  ```bash
  npm run build
  npm run bundle:analyze
  
  # Verify cache groups created
  ls -lh .next/static/chunks/ | grep -E "web3|animation|ui"
  ```

#### Day 12: Enable Compression & Optimizations

- [ ] **Day 12 Morning (1 hour)**
  ```bash
  # Verify in next.config.js:
  # compress: true
  # swcMinify: true
  # productionBrowserSourceMaps: false (for production)
  ```

- [ ] **Day 12 Afternoon (2 hours)**
  ```bash
  npm run build
  
  # Check gzip compression
  UNCOMPRESSED=$(du -sb .next | awk '{print $1}')
  # Typical gzip ratio: 60-70% reduction
  
  git add -A
  git commit -m "Optimize webpack and Next.js configuration - 30KB saved"
  ```

### Week 4: Monitoring & Validation (Target: Setup & Verify)

**Goal:** Setup monitoring and validate all improvements

#### Day 13: Setup Monitoring

- [ ] **Day 13 Morning (2 hours)**
  ```bash
  git checkout -b setup-monitoring
  
  # Implement Web Vitals tracking
  npm install web-vitals
  
  # Create lib/web-vitals.ts
  # See METRICS_DASHBOARD.md for implementation
  ```

- [ ] **Day 13 Afternoon (2 hours)**
  ```bash
  # Setup bundle metrics collection
  # Create scripts/collect-bundle-metrics.ts
  
  # Add to package.json:
  # "build": "next build && npm run collect:metrics"
  
  npm run build
  npm run collect:metrics
  ```

#### Day 14: Final Validation & Documentation

- [ ] **Day 14 Morning (3 hours)**
  ```bash
  # Run comprehensive tests
  npm test
  npm run test:e2e
  npm run lighthouse
  
  # Document final results
  cat > OPTIMIZATION_RESULTS.md << 'EOF'
  # Bundle Optimization Complete
  
  ## Metrics
  - Initial JS: 220KB → 140KB (-36%)
  - Total Bundle: 350KB → 220KB (-37%)
  - LCP: 4.2s → 2.1s (-50%)
  - TTI: 5.8s → 2.8s (-52%)
  
  ## Changes Made
  1. Removed ethers (30KB)
  2. Replaced pino with console (25KB)
  3. Lazy loaded Framer Motion (35KB)
  4. Lazy loaded Sentry (40KB)
  5. Lazy loaded admin features (20KB)
  6. Replaced axios with fetch (15KB)
  7. Optimized webpack config (30KB)
  
  Total Savings: 195KB
  EOF
  ```

- [ ] **Day 14 Afternoon (2 hours)**
  ```bash
  # Create PR
  git checkout -b final/bundle-optimization
  git merge remove-ethers
  git merge lazy-load-framer-motion
  git merge lazy-load-sentry
  git merge lazy-load-admin
  git merge replace-axios-fetch
  git merge optimize-webpack-config
  git merge setup-monitoring
  
  # Push all changes
  git push -u origin final/bundle-optimization
  
  # Create PR on GitHub
  ```

---

## 📊 Progress Tracking Template

```markdown
# Bundle Optimization Progress

## Week 1: Quick Wins
- [x] Day 1-2: Audit & Planning (2 hours)
- [x] Day 3-4: Remove Ethers (6 hours) - 30KB saved
- [x] Day 5: Remove Pino (5 hours) - 25KB saved
- [ ] Day 5: Depcheck cleanup (1 hour) - 10KB saved

**Week 1 Savings:** 65KB (-30% from baseline)
**Cumulative:** 65KB
**Time Spent:** 14 hours

## Week 2: Component Lazy Loading
- [ ] Day 6-7: Lazy load Framer Motion (7 hours) - 35KB saved
- [ ] Day 8: Lazy load Sentry (4 hours) - 40KB saved
- [ ] Day 9: Lazy load Admin (3 hours) - 20KB saved
- [ ] Day 10: Replace Axios (4 hours) - 15KB saved

**Week 2 Savings:** 110KB
**Cumulative:** 175KB (-60% from baseline)
**Time Spent:** 18 hours

## Week 3: Build Optimization
- [ ] Day 11: Webpack Config (5 hours) - 20KB saved
- [ ] Day 12: Compression (3 hours) - 10KB saved

**Week 3 Savings:** 30KB
**Cumulative:** 205KB (-65% from baseline)
**Time Spent:** 8 hours

## Week 4: Monitoring & Validation
- [ ] Day 13: Setup Monitoring (4 hours)
- [ ] Day 14: Final Validation & PR (5 hours)

**Week 4 Time:** 9 hours
**Total Project Time:** 49 hours (about 1.2 work weeks)
```

---

## 🎯 Daily Standup Template

```
Date: [Date]
Completed Yesterday:
- [Task]
- [Task]

Blockers:
- [Issue]

Today's Plan:
1. [Task]
2. [Task]

Metrics:
- Bundle Size: [KB] (Target: <140KB)
- LCP: [s] (Target: <2.5s)
- Tests Passing: ✅/❌
```

---

## ✅ Sign-Off Checklist

### Developer Sign-Off
- [ ] All changes implemented
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Metrics documented

### QA Sign-Off
- [ ] E2E tests passing
- [ ] Manual testing complete
- [ ] No regressions found
- [ ] Performance improved

### DevOps Sign-Off
- [ ] CI/CD pipelines working
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Ready for production

### PM Sign-Off
- [ ] Goals achieved
- [ ] Timeline met
- [ ] Budget acceptable
- [ ] Approved for release

---

## 🚀 Deployment Steps

1. **Code Review** (Day 14)
   ```bash
   # PR created, reviews requested
   # At least 2 approvals needed
   ```

2. **Deploy to Staging** (Day 15)
   ```bash
   # After PR merged to main
   git checkout main
   git pull
   npm run build
   # Deploy to staging environment
   ```

3. **Performance Validation** (Day 15)
   ```bash
   # Run Lighthouse on staging
   # Compare metrics with baseline
   # Verify all features work
   ```

4. **Deploy to Production** (Day 16)
   ```bash
   # After staging validation
   # Deploy during low-traffic period
   git tag v1.1.0-bundle-optimized
   # Deploy tagged version
   ```

5. **Monitor Metrics** (Day 16+)
   ```bash
   # Watch Real User Metrics (RUM)
   # Check for errors or regressions
   # Verify improvements in production
   ```

---

## 📞 Support & Escalation

### If Something Goes Wrong

1. **Build Fails**
   ```bash
   # Immediate action:
   git revert HEAD
   npm install
   npm run build
   
   # Root cause:
   # Check which change caused it
   # Fix the issue
   # Retry
   ```

2. **Tests Fail**
   ```bash
   # Debug in development
   npm run dev
   npm test -- --watch
   
   # Find test failure
   # Fix code or test
   ```

3. **Performance Doesn't Improve**
   ```bash
   # Check what's still in bundle
   npm run bundle:analyze
   
   # Verify lazy loading works
   # Check network tab in DevTools
   ```

---

## 📈 Success Metrics

### Primary Metrics

| Metric | Baseline | Target | Achieved |
|--------|----------|--------|----------|
| Initial JS | 220KB | 140KB | ___ |
| LCP | 4.2s | 2.1s | ___ |
| TTI | 5.8s | 2.8s | ___ |
| Lighthouse Score | 65 | 85+ | ___ |

### Secondary Metrics

| Metric | Baseline | Target | Achieved |
|--------|----------|--------|----------|
| CSS Bundle | 35KB | 25KB | ___ |
| Total Size | 350KB | 220KB | ___ |
| FID | 180ms | 95ms | ___ |
| CLS | 0.15 | 0.08 | ___ |

---

**Version:** 1.0  
**Timeline:** 4 weeks  
**Total Hours:** ~49 hours  
**Status:** Ready for Implementation
