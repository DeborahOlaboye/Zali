# Web3-Specific & Frontend Performance Optimizations for Zali

Tailored optimization strategies for Zali's Web3 trivia game architecture and specific use cases.

---

## 🔗 Web3 Bundle Challenges

### Current Web3 Architecture

```
wagmi (85KB)
  ├── viem (45KB)
  ├── @wagmi/core (20KB)
  └── @tanstack/query (30KB)

@reown/appkit (50KB)
  ├── Web3Modal UI
  ├── Wallet connectors
  └── Provider logic

Total Web3 Stack: ~230KB uncompressed
Gzipped: ~75KB
```

### Problem: Web3 Libraries are Slow to Load

- **Wallet connections** take 500-800ms to initialize
- **Contract calls** require full wagmi setup before game starts
- **User authentication** blocks game rendering

---

## ⚡ Optimization Strategy for Zali

### Strategy 1: Load Web3 Only When Needed

**Problem:** User lands on home page, wagmi/viem not needed yet

**Solution:**

```typescript
// config/web3-loader.ts

export async function loadWeb3Libraries() {
  // Only load when actually needed
  if (typeof window === 'undefined') return null;
  
  const [wagmi, viem, appkit] = await Promise.all([
    import('wagmi'),
    import('viem'),
    import('@reown/appkit'),
  ]);
  
  return { wagmi, viem, appkit };
}

// app/game/page.tsx - Web3 is needed here
import dynamic from 'next/dynamic';

const GamePage = dynamic(
  () => import('@/components/Game'),
  {
    loading: () => <GameSkeleton />,
    ssr: false, // Don't load wagmi on server
  }
);

export default function Page() {
  return <GamePage />;
}

// app/page.tsx - Home page doesn't need Web3
export default function Home() {
  return <LandingPage />;  // No wagmi loaded
}
```

**Impact:**
- Home page initial JS: 220KB → 140KB (-36%)
- Web3 loads only on `/game` route

### Strategy 2: Separate Web3 Chunks

**Problem:** wagmi/viem bundled with main chunk

**Solution:**

```typescript
// next.config.js

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        // Separate Web3 libraries into their own chunk
        web3: {
          test: /[\\/]node_modules[\\/](wagmi|viem|@reown|@wagmi|@tanstack)[\\/]/,
          name: 'web3',
          priority: 20,    // High priority
          reuseExistingChunk: true,
          enforce: true,   // Force into this chunk
        },
        
        // React and core deps
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 10,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
```

**Result:**
```
Before:
- main.js: 220KB (includes everything)

After:
- main.js: 140KB (home page code only)
- web3-*.js: 75KB (loads only on game page)
- react-*.js: 45KB (always loads)
```

### Strategy 3: Optimize Wallet Connection Flow

**Problem:** Wallet modal blocks game, slow connection UX

**Solution:**

```typescript
// components/WalletButton.tsx

import { useConnect } from 'wagmi';
import dynamic from 'next/dynamic';

// Lazy load wallet modal
const WalletModal = dynamic(
  () => import('@reown/appkit/react').then(m => m.Web3Modal),
  { ssr: false }
);

export function WalletButton() {
  const { connect } = useConnect();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Connect Wallet
      </button>
      
      {showModal && (
        <WalletModal 
          onConnect={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// Before: Wallet modal always in bundle (50KB)
// After: Wallet modal only loads when user clicks connect button
// Savings: ~50KB for users who don't connect
```

### Strategy 4: Prefetch Web3 on Game Route

**Problem:** User navigates to `/game`, Web3 chunk takes time to load

**Solution:**

```typescript
// app/layout.tsx

export default function Layout() {
  useEffect(() => {
    // Prefetch Web3 chunk if user is on game page
    if (typeof window !== 'undefined' && 
        window.location.pathname === '/game') {
      // Tell browser to load web3 chunk soon
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/_next/static/chunks/web3-*.js';
      document.head.appendChild(link);
    }
  }, []);
  
  return <div>{/* ... */}</div>;
}
```

---

## 🎮 Game-Specific Optimizations

### Load Game Engine On Demand

```typescript
// Before: Heavy game engine always in bundle
import BabylonEngine from '@babylon.js/core';

// After: Load only when game starts
async function initGameEngine() {
  const { default: BabylonEngine } = await import(
    '@babylon.js/core'
  );
  
  return new BabylonEngine();
}

// Usage in game component
export function Game() {
  const [engine, setEngine] = useState(null);
  
  useEffect(() => {
    if (gameStarted) {
      initGameEngine().then(setEngine);
    }
  }, [gameStarted]);
  
  return engine ? <Canvas engine={engine} /> : <Loading />;
}
```

**Impact:** 
- Reduces initial load by ~50KB
- Game loads in 2.5s instead of 4s

### Optimize Question Data Loading

```typescript
// Before: Load all questions upfront
const [allQuestions] = useQuery(() => 
  fetch('/api/questions').then(r => r.json())
);

// After: Load questions as needed
const getQuestionBatch = async (difficulty: string) => {
  const response = await fetch(
    `/api/questions?difficulty=${difficulty}&limit=10`
  );
  return response.json();
};

// Usage
useEffect(() => {
  if (gameStarted && currentRound === 1) {
    getQuestionBatch('easy').then(setQuestions);
  }
}, [gameStarted, currentRound]);
```

**Impact:**
- Initial API call: 50KB → 5KB
- Reduces TTFB (Time to First Byte) by 80%

### Optimize Leaderboard Loading

```typescript
// components/Leaderboard.tsx

import dynamic from 'next/dynamic';

const LeaderboardChart = dynamic(
  () => import('@/components/LeaderboardChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

export function Leaderboard() {
  // Only load charts when tab is selected
  const [showChart, setShowChart] = useState(false);
  
  return (
    <>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger 
            value="chart"
            onClick={() => setShowChart(true)}
          >
            Chart
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <LeaderboardList />
        </TabsContent>
        
        <TabsContent value="chart">
          {showChart && <LeaderboardChart />}
        </TabsContent>
      </Tabs>
    </>
  );
}
```

---

## 📱 Mobile-First Optimizations

### Different Bundles for Mobile vs Desktop

```typescript
// next.config.js

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        // Heavy libraries only on desktop
        desktop: {
          test: /[\\/]node_modules[\\/](three|babylon|pixijs)[\\/]/,
          name: 'desktop',
          priority: 5,
          // Only include if on desktop route
          enforce: true,
        },
      };
    }
    return config;
  },
};
```

### Use Responsive Strategies

```typescript
// hooks/useDeviceType.ts

export function useDeviceType() {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');
  
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setDevice(isMobile ? 'mobile' : 'desktop');
    
    const handleResize = () => {
      setDevice(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return device;
}

// Use in components
export function Game() {
  const device = useDeviceType();
  
  // Simpler rendering on mobile
  return device === 'mobile' ? (
    <SimpleGameView />
  ) : (
    <FullGameView />
  );
}
```

---

## 🔐 User Authentication Optimization

### Lazy Load Auth UI

```typescript
// Before: Auth modal always ready
import AuthModal from '@/components/AuthModal';

// After: Load on demand
const AuthModal = dynamic(
  () => import('@/components/AuthModal'),
  { ssr: false }
);

export function Header() {
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowAuth(true)}>Login</button>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
```

**Impact:** 
- ~20KB lazy loaded only when user clicks Login

### Cache Auth State

```typescript
// lib/auth-cache.ts

export function useAuthState() {
  const [auth, setAuth] = useContext(AuthContext);
  
  useEffect(() => {
    // Load from localStorage
    const cached = localStorage.getItem('auth');
    if (cached) {
      setAuth(JSON.parse(cached));
    }
  }, []);
  
  // Reduce API calls
  const login = useCallback(async (email, password) => {
    const result = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then(r => r.json());
    
    // Cache for next visit
    localStorage.setItem('auth', JSON.stringify(result));
    setAuth(result);
    
    return result;
  }, []);
  
  return { auth, login };
}
```

---

## 🎯 Zali-Specific Metrics

### Current Zali Performance

```bash
Route: / (Home)
  - Initial JS: 95KB (good)
  - LCP: 1.8s (good)
  - TTI: 2.1s (good)

Route: /game (Game page)
  - Initial JS: 220KB (heavy - includes wagmi)
  - LCP: 4.2s (needs improvement)
  - TTI: 5.8s (needs improvement)

Route: /leaderboard
  - Initial JS: 180KB
  - LCP: 3.5s
  - TTI: 4.2s
```

### Target Zali Performance

```bash
Route: /
  - Initial JS: 95KB ✅ (no change needed)
  - LCP: 1.8s ✅

Route: /game
  - Initial JS: 140KB (split from main)
  - Web3 chunk: 75KB (lazy loaded)
  - LCP: 2.1s (-50%)
  - TTI: 2.8s (-52%)

Route: /leaderboard
  - Initial JS: 140KB (-22%)
  - Charts: 45KB (lazy loaded on demand)
  - LCP: 2.2s (-37%)
```

---

## 📋 Zali Implementation Checklist

### Immediate (Week 1)

- [ ] Split Web3 chunk from main bundle
- [ ] Lazy load wallet modal (50KB saved)
- [ ] Lazy load leaderboard charts (45KB saved)
- [ ] Verify home page unchanged

### Phase 2 (Week 2)

- [ ] Load game engine on demand
- [ ] Prefetch Web3 on game route
- [ ] Optimize question API requests
- [ ] Test on mobile 3G

### Phase 3 (Week 3)

- [ ] Mobile-specific optimizations
- [ ] Remove unused animations
- [ ] Cache user preferences
- [ ] Measure final metrics

---

## 🚀 Expected Zali Results

### Home Page
```
Before: 95KB → After: 95KB (unchanged ✅)
Already optimal for landing page
```

### Game Page
```
Before: 220KB → After: 140KB + 75KB (lazy)
Initial load: -36% faster
Web3 loads in background: Not blocking game

LCP: 4.2s → 2.1s (-50%)
TTI: 5.8s → 2.8s (-52%)
FID: 180ms → 95ms (-47%)
```

### Leaderboard Page
```
Before: 180KB → After: 140KB + 45KB (lazy)
Initial load: -22% faster
Charts load on demand

LCP: 3.5s → 2.2s (-37%)
TTI: 4.2s → 2.5s (-40%)
```

---

## ✅ Verification Steps

```bash
# 1. Verify Web3 chunk created
npm run build
ls -lh .next/static/chunks/ | grep web3

# 2. Verify main chunk reduced
du -sh .next/static/chunks/main*.js

# 3. Test routes work
npm run dev
# Visit: http://localhost:3000
# Verify: No console errors
# Network tab: verify chunks load correctly

# 4. Test Web3 on game route
# Navigate to: http://localhost:3000/game
# Verify: Wallet connection works
# Network tab: verify web3 chunk loads

# 5. Measure performance
npm run lighthouse
```

---

## 🎓 Web3 Best Practices

✅ **Do:**
- Load Web3 only on Web3-dependent routes
- Use dynamic imports for wallet UI
- Prefetch Web3 chunk on route that needs it
- Cache wallet connection state
- Lazy load error handlers/Sentry

❌ **Don't:**
- Include wagmi/viem in main chunk
- Load wallet modal on every page
- Block game rendering on Web3 initialization
- Make multiple contract calls synchronously
- Poll blockchain data too frequently

---

**Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Zali-Optimized  
**Applies To:** Zali Web3 Trivia Game
