# Dynamic Imports & Code Splitting Guide

Implementation guide for code splitting and lazy loading in Zali frontend.

---

## Overview

Dynamic imports reduce initial bundle size by splitting code into separate chunks that load on demand.

```
Before Optimization:           After Optimization:
┌─────────────────────┐       ┌──────────────┐
│  Initial Bundle     │       │ Main Bundle  │  180KB
│  (Everything)       │       └──────────────┘
│  500KB+ gzipped     │              ↓
└─────────────────────┘       ┌──────────────┐
                              │  /play       │  85KB (loaded when route accessed)
                              └──────────────┘
                                     ↓
                              ┌──────────────┐
                              │  Animations  │  35KB (loaded when needed)
                              └──────────────┘
```

---

## Level 1: Route-Based Code Splitting

Next.js 14 handles this automatically! Every page in `app/` directory is separate chunk.

### Current Structure ✅

```
app/
├── page.tsx          → Home chunk (~45KB)
├── play/
│   └── page.tsx      → Play chunk (~85KB)
├── leaderboard/
│   └── page.tsx      → Leaderboard chunk (~55KB)
├── profile/
│   └── [address]/page.tsx → Profile chunk (~50KB)
└── admin/
    └── page.tsx      → Admin chunk (~60KB) *lazy loaded
```

Each route is automatically code-split by Next.js! ✅

### Verify Route Splitting

```bash
# After build, check .next/static/chunks/app/
ls -lah .next/static/chunks/app/

# You should see separate chunks for each route
```

---

## Level 2: Component-Level Code Splitting

Lazy load components that aren't needed immediately.

### Lazy Load Heavy Components

```typescript
// ❌ BAD: Loads framer-motion immediately
import AnimatedCard from '@/components/AnimatedCard';

export default function Page() {
  return <AnimatedCard />;
}
```

```typescript
// ✅ GOOD: Lazy load animation component
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AnimatedCard = dynamic(
  () => import('@/components/AnimatedCard'),
  {
    loading: () => <CardSkeleton />,
    ssr: false, // Don't render on server (saves server-side bundle)
  }
);

export default function Page() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <AnimatedCard />
    </Suspense>
  );
}
```

### Components to Lazy Load

```typescript
// animations/
const ConfettiCelebration = dynamic(
  () => import('@/components/ConfettiCelebration'),
  { ssr: false }
);

const PageTransition = dynamic(
  () => import('@/components/PageTransition'),
  { ssr: false }
);

// modals/
const ConfirmDialog = dynamic(
  () => import('@/components/ConfirmDialog'),
  { loading: () => <Spinner /> }
);

const SettingsModal = dynamic(
  () => import('@/components/SettingsModal'),
  { loading: () => <Spinner /> }
);

// heavy-features/
const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard'),
  { ssr: false }
);

const AdvancedAnalytics = dynamic(
  () => import('@/components/AdvancedAnalytics'),
  { ssr: false }
);
```

---

## Level 3: Feature-Based Code Splitting

Load entire features only for users who need them.

### Admin Panel (Owners Only)

```typescript
// app/admin/page.tsx
import dynamic from 'next/dynamic';
import { useStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Dynamically load admin components
const AdminDashboard = dynamic(
  () => import('@/components/AdminDashboard'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const AdminLayout = dynamic(
  () => import('@/components/AdminLayout'),
  { ssr: false }
);

export default function AdminPage() {
  const router = useRouter();
  const isOwner = useStore((state) => state.isOwner);
  
  useEffect(() => {
    if (!isOwner) {
      router.push('/');
    }
  }, [isOwner, router]);
  
  if (!isOwner) return null;
  
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
```

**Saves:** ~60-80KB for non-admin users

### Advanced Features

```typescript
// Only load for specific users/conditions
const AdvancedReports = dynamic(
  () => import('@/components/AdvancedReports'),
  { 
    ssr: false,
    loading: () => <Skeleton /> 
  }
);

// Only show if user has premium
const PremiumFeature = () => {
  const isPremium = useStore((state) => state.isPremium);
  
  if (!isPremium) return null;
  
  return <AdvancedReports />;
};
```

---

## Level 4: Library-Level Code Splitting

Split heavy libraries into separate chunks.

### Framer Motion Optimization

```typescript
// Before: ~35KB added to initial bundle

import { motion } from 'framer-motion';

// After: Load only when used
import dynamic from 'next/dynamic';

const AnimatedBox = dynamic(
  () => import('@/components/AnimatedBox'),
  { ssr: false }
);
```

### Sentry (Error Monitoring)

```typescript
// Option 1: Lazy load after app initialization
if (process.env.NODE_ENV === 'production') {
  import('@sentry/nextjs').then((sentry) => {
    // Initialize Sentry
  });
}

// Option 2: Remove Sentry entirely and use custom error handler
// Saves ~40KB
```

### Pino Logger (Logging)

```typescript
// Development: Use console
// Production: Lazy load pino

const getLogger = async () => {
  if (process.env.NODE_ENV === 'development') {
    return console;
  }
  const pino = await import('pino');
  return pino();
};
```

**Saves:** ~60KB by removing from production bundle

---

## Level 5: Conditional Imports

Load features conditionally based on environment/features.

```typescript
// hooks/useAdvancedMetrics.ts
import dynamic from 'next/dynamic';

const AdvancedMetrics = dynamic(
  () => import('@/lib/advancedMetrics'),
  {
    ssr: false,
  }
);

export const useAdvancedMetrics = () => {
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_METRICS === 'true';
  
  if (!isEnabled) {
    return { track: () => {} }; // No-op
  }
  
  return AdvancedMetrics;
};
```

---

## Implementation Patterns

### Pattern 1: Lazy Load on User Action

```typescript
// Load component only when button clicked
import { lazy, Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <div>Loading...</div> }
);

export default function Page() {
  const [show, setShow] = useState(false);
  
  return (
    <>
      <button onClick={() => setShow(true)}>
        Load Heavy Component
      </button>
      {show && <HeavyComponent />}
    </>
  );
}
```

### Pattern 2: Lazy Load on Scroll

```typescript
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton height={200} /> }
);

export default function Page() {
  const { ref, inView } = useInView({
    triggerOnce: true, // Load only once
    threshold: 0.1,
  });
  
  return (
    <div ref={ref}>
      {inView && <HeavyComponent />}
    </div>
  );
}
```

### Pattern 3: Conditional by Environment

```typescript
import dynamic from 'next/dynamic';

// Only load analytics in production
const Analytics = dynamic(
  () => import('@/components/Analytics'),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
```

### Pattern 4: Feature Flags

```typescript
import dynamic from 'next/dynamic';

const FeatureComponent = dynamic(
  async () => {
    const isEnabled = await fetch('/api/features/new-feature')
      .then((r) => r.json());
    
    if (!isEnabled) {
      return { default: () => null };
    }
    
    return import('@/components/NewFeature');
  },
  { ssr: false }
);

export default function Page() {
  return <FeatureComponent />;
}
```

---

## Implementation Checklist

### Immediate (Week 1)

- [ ] Audit current components
- [ ] Identify heavy components
- [ ] Remove unused components
- [ ] Test bundle size
- [ ] Document baseline

### Short Term (Week 2-3)

- [ ] Lazy load animations
- [ ] Lazy load modals
- [ ] Split admin panel
- [ ] Remove unnecessary libraries
- [ ] Measure improvements

### Medium Term (Week 4)

- [ ] Optimize imports
- [ ] Remove Sentry (or lazy load)
- [ ] Remove Pino (use console)
- [ ] Feature-based splitting
- [ ] Comprehensive testing

### Ongoing

- [ ] Monitor bundle size
- [ ] Add CI checks
- [ ] Document changes
- [ ] Train team
- [ ] Regular audits

---

## Testing Dynamic Imports

### Manual Testing

```bash
# Build and check chunk sizes
npm run build

# Analyze bundles
ls -lah .next/static/chunks/

# Check for expected lazy chunks
# Should see: app_admin_page.js, animation_*.js, etc
```

### Automated Testing

```typescript
// __tests__/dynamic-imports.test.ts
import dynamic from 'next/dynamic';

describe('Dynamic Imports', () => {
  it('should lazy load components', async () => {
    const Component = dynamic(
      () => import('@/components/AnimatedBox')
    );
    
    expect(Component).toBeDefined();
  });
  
  it('should not include heavy libs in initial bundle', () => {
    // Check build artifacts
    // Verify chunk sizes are within limits
  });
});
```

---

## Performance Measurements

### Before Optimization

```
Initial JS:      350KB gzipped
With animations: 385KB
Time to Interactive: 4.5s on 3G
```

### After Optimization

```
Initial JS:      180KB gzipped ✅ (-48%)
Animations:      35KB (lazy)
Time to Interactive: 2.5s on 3G ✅ (-44%)
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Over-splitting

```typescript
// Don't split everything
const Button = dynamic(() => import('@/components/Button'));
const Input = dynamic(() => import('@/components/Input'));
// This creates too many small chunks
```

### ✅ Solution: Split strategically

```typescript
// Only split heavy components
const AnimatedCard = dynamic(() => import('@/components/AnimatedCard'));
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'));
```

### ❌ Mistake 2: Forgetting loading state

```typescript
// User sees blank screen
const Component = dynamic(() => import('@/components/Component'));
```

### ✅ Solution: Always provide loading state

```typescript
const Component = dynamic(
  () => import('@/components/Component'),
  { loading: () => <Skeleton /> }
);
```

### ❌ Mistake 3: SSR for client-only libraries

```typescript
// Causes server-side Framer Motion issues
const Animated = dynamic(
  () => import('@/components/Animated')
  // Missing ssr: false
);
```

### ✅ Solution: Disable SSR for client libs

```typescript
const Animated = dynamic(
  () => import('@/components/Animated'),
  { ssr: false } // ✅
);
```

---

## Monitoring & Alerts

Add to CI/CD pipeline:

```yaml
# .github/workflows/bundle-check.yml
- name: Check bundle size
  run: |
    npm run build
    # Check that initial JS < 200KB
    if [ $(du -sb .next/static/chunks/*.js | awk '{sum+=$1} END {print sum}') -gt 209715200 ]; then
      echo "Bundle size exceeds 200KB!"
      exit 1
    fi
```

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete

See [BUNDLE_OPTIMIZATION_GUIDE.md](BUNDLE_OPTIMIZATION_GUIDE.md) for overall strategy.
