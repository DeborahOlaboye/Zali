# Architecture Quick Reference Card

One-page cheat sheet for understanding the Zali architecture at a glance.

---

## 🏗️ System Layers (Bottom to Top)

```
┌─────────────────────────────────────────────┐
│         User Interface Layer                 │
│      React Components + Tailwind CSS         │
└─────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────┐
│      State Management Layer                  │
│   Zustand (Global) + React Query (Cache)    │
└─────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────┐
│       Web3 Integration Layer                 │
│   Wagmi (React hooks) + AppKit (Wallets)    │
└─────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────┐
│     Smart Contract Layer                     │
│  SimpleTriviaGame.sol (Solidity on Base)    │
└─────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────┐
│      Blockchain Layer                        │
│     Base Network (EVM-compatible)            │
└─────────────────────────────────────────────┘
```

---

## 📁 Project Structure (Most Important Folders)

```
frontend/src/
├── app/              ← Next.js routes (/play, /profile, etc)
├── components/       ← React components (40+)
├── store/            ← Zustand state management
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts      (user, isAuthenticated)
│       ├── gameSlice.ts      (currentQuestion, score)
│       ├── uiSlice.ts        (theme, notifications)
│       └── achievementSlice.ts
├── hooks/            ← Custom React hooks
├── services/         ← Business logic & API calls
├── utils/            ← Helper functions
└── types/            ← TypeScript definitions

contracts/src/
├── SimpleTriviaGame.sol  ← Main game contract
├── Faucet.sol           ← USDC faucet
└── MockVRFCoordinator.sol (testing)
```

---

## 🔄 Data Flow (One Cycle)

```
1. User Action
   (click, form input)
   
   ↓
   
2. React Component
   (handler function)
   
   ↓
   
3. Zustand Store
   (dispatch action)
   
   ↓
   
4. Wagmi Hook
   (useContractWrite)
   
   ↓
   
5. Smart Contract
   (submitAnswer)
   
   ↓
   
6. Blockchain
   (execute TX)
   
   ↓
   
7. Event Emission
   (AnswerSubmitted)
   
   ↓
   
8. Event Listener
   (frontend)
   
   ↓
   
9. Update Store
   (new score, etc)
   
   ↓
   
10. Component Re-render
    (show new UI)
```

---

## 🎮 Key Components

### Game Page Component Tree
```
PlayPage (/play)
├── GameLayout
│   ├── QuestionCard        ← Shows question
│   ├── OptionButtons       ← Answer choices
│   ├── Timer               ← Time remaining
│   ├── ScoreDisplay        ← Current score
│   └── RewardCard          ← Result & reward
```

### Leaderboard Page
```
LeaderboardPage (/leaderboard)
├── LeaderboardHeader       ← Filters
├── DataTable               ← Rankings
│   └── Row × N             ← User entries
└── Pagination              ← Page controls
```

### Profile Page
```
ProfilePage (/profile/[address])
├── ProfileHeader           ← User info & avatar
├── Tabs                    ← Overview, History, Achievements
├── StatsCards              ← Score, games, winrate
└── HistoryList             ← Past games
```

---

## 🧠 State Structure (Zustand)

```typescript
// RootState = combination of:

AuthSlice
├── user: User | null
├── isAuthenticated: boolean
└── functions: login(), logout()

GameSlice
├── currentQuestion: Question | null
├── userScore: number
└── functions: loadQuestion(), submitAnswer()

UISlice
├── theme: 'light' | 'dark'
├── notifications: Notification[]
└── functions: toggleTheme(), showNotification()

AchievementSlice
├── achievements: Achievement[]
├── badges: Badge[]
└── functions: unlockAchievement()
```

---

## 🔐 Access Patterns

### Reading Data (useContractRead)
```
Component
  ↓
Custom Hook (e.g., useUserScore)
  ↓
React Query (Cache Check)
  ├─ HIT → Return cached data
  └─ MISS → RPC Call → Contract → Cache → Return
```

### Writing Data (useContractWrite)
```
User Action
  ↓
Validation
  ↓
Estimate Gas
  ↓
Request Wallet Signature
  ↓
Send Transaction
  ↓
Wait for Confirmation
  ↓
Event Listener Catches Event
  ↓
Update State
  ↓
Re-render UI
```

---

## 🚨 Error Handling Layers

```
┌─────────────────────────────────────────┐
│  RootLayout (Catches anything)          │
├─────────────────────────────────────────┤
│  ↓ WalletErrorBoundary                  │
│  ↓ QueryErrorBoundary                   │
│  ↓ ContractErrorBoundary                │
├─────────────────────────────────────────┤
│  → TransactionErrorBoundary (txs)       │
│  → FormErrorBoundary (forms)            │
│  → RouteErrorBoundary (components)      │
└─────────────────────────────────────────┘
```

---

## 🔗 Key Integrations

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Wallet | AppKit (Reown) | Connect & manage wallets |
| Web3 | Wagmi + Viem | Contract interactions |
| State | Zustand | Global app state |
| Caching | React Query | API response caching |
| Styling | Tailwind CSS | Component styles |
| Forms | React + Zod | Validation & submission |
| Tables | Tanstack Table | Data display |
| Blockchain | Base Network | Deploy & execute TX |
| Token | USDC (ERC20) | Rewards |
| Contract | SimpleTriviaGame | Game logic |

---

## 📊 Smart Contract Structure

```solidity
SimpleTriviaGame {
    STATE:
    - usdcToken (immutable)
    - questionId (counter)
    - questions[] (mapping)
    - userScores[] (mapping)
    
    ENUMS:
    - Difficulty (Easy, Medium, Hard)
    - Category (Celo, DeFi, Web3, etc)
    
    FUNCTIONS:
    - addQuestion() [owner]
    - submitAnswer() [public]
    - deactivateQuestion() [owner]
    - getQuestion() [view]
    - getUserScore() [view]
    
    EVENTS:
    - QuestionAdded
    - AnswerSubmitted
}
```

---

## 🎯 Common Operations

### Add a Question (Owner Only)
```
1. Call addQuestion() with:
   - Question text
   - Answer options (array)
   - Correct option (index)
   - Reward amount (USDC)
   - Category
   - Difficulty

2. Contract emits QuestionAdded event
3. Frontend listens & updates UI
```

### Player Submits Answer
```
1. User selects answer
2. Call submitAnswer(questionId, selectedOption)
3. Contract verifies correctness
4. If correct: Transfer USDC reward
5. Increment user score
6. Emit AnswerSubmitted event
7. Frontend updates leaderboard
```

---

## 🔌 API Endpoints (If Backend Exists)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/questions | GET | Fetch all questions |
| /api/questions | POST | Add question (admin) |
| /api/users/:addr | GET | Get user profile |
| /api/leaderboard | GET | Get rankings |
| /api/scores/:addr | GET | Get user score |

---

## 📱 Route Map

```
/ (Home)
├── /play (Game)
├── /leaderboard (Rankings)
├── /profile/[address] (User Profile)
├── /admin (Admin Panel) [owner only]
├── /faucet (USDC Faucet) [testnet]
├── /results (Game Results)
├── /signin (Sign In)
└── /register (Register)
```

---

## 🧪 Testing Strategy

```
UNIT TESTS
├── Component tests (React Testing Library)
├── Utility tests (Jest)
└── Hook tests (Testing Library)

CONTRACT TESTS
├── Unit tests (Foundry)
├── Integration tests (Foundry)
└── Scenario tests (Foundry)

E2E TESTS
├── User flow (Playwright)
├── Auth flow (Playwright)
└── Game flow (Playwright)
```

---

## ⚡ Performance Tips

- ✅ Use React Query for data caching
- ✅ Memoize expensive computations
- ✅ Code split with dynamic imports
- ✅ Batch contract reads when possible
- ✅ Use event-driven updates vs polling
- ⚠️ Avoid unnecessary re-renders
- ⚠️ Don't fetch all data upfront
- ⚠️ Limit event listeners

---

## 🔒 Security Checklist

- ✅ Validate all inputs (frontend + contract)
- ✅ Check user permissions before operations
- ✅ Use SafeERC20 for token transfers
- ✅ Verify signatures properly
- ✅ Protect sensitive data
- ✅ Use https in production
- ✅ Sanitize user input (XSS prevention)
- ✅ Implement proper error boundaries

---

## 🚀 Deployment Steps

```
1. Local Development
   npm run dev

2. Test on Base Testnet
   npm run build
   deploy to staging

3. Contract Audit
   Review security

4. Mainnet Deployment
   Deploy contract
   Deploy frontend to CDN
   Set DNS records

5. Monitoring
   Setup alerts
   Monitor transactions
```

---

## 📚 File Size Reference

| File | Size | Lines |
|------|------|-------|
| SimpleTriviaGame.sol | ~3KB | 106 |
| PlayPage.tsx | ~5KB | 150 |
| useContract.ts | ~2KB | 80 |
| Zustand store | ~4KB | 120 |
| Main bundle | ~200KB | (after minify) |

---

## 🔍 Debugging Tips

### Contract Issues
```
1. Check tx hash on Base Explorer
2. Look for revert reasons
3. Verify contract address
4. Check account permissions
5. Verify balance/allowance
```

### Frontend Issues
```
1. Check browser console
2. React DevTools
3. Redux DevTools (if using Redux)
4. Network tab (API calls)
5. Application tab (localStorage)
```

### Web3 Issues
```
1. Verify wallet connected
2. Check account address
3. Check network (should be Base)
4. Verify contract ABI
5. Check RPC endpoint
```

---

## 🎓 Learning Resources

- **Solidity:** [docs.soliditylang.org](https://docs.soliditylang.org)
- **React:** [react.dev](https://react.dev)
- **Next.js:** [nextjs.org](https://nextjs.org)
- **Wagmi:** [wagmi.sh](https://wagmi.sh)
- **Zustand:** [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **Base:** [base.org](https://base.org)

---

## 📞 Quick Support

**Question:** How do I add a new page?
**Answer:** Create file in `app/`, add route, build components

**Question:** How do I update the store?
**Answer:** Use `useStore()` hook, dispatch actions

**Question:** How do I call a contract function?
**Answer:** Use `useContractWrite()` from Wagmi

**Question:** How do I handle errors?
**Answer:** Wrap component in appropriate ErrorBoundary

**Question:** How do I test my code?
**Answer:** Use Jest for units, Foundry for contracts, Playwright for E2E

---

## ✨ Pro Tips

1. **Before coding:** Check diagrams in ARCHITECTURE_DIAGRAMS.md
2. **Data flows:** Always check state sync to avoid bugs
3. **New feature:** Identify all affected components first
4. **Testing:** Write tests as you code, not after
5. **Deployments:** Always test on testnet first
6. **Performance:** Profile before optimizing
7. **Security:** Review access control always

---

**Quick Reference Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete

For detailed information, see:
- [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md)
- [ARCHITECTURE_INDEX.md](ARCHITECTURE_INDEX.md)
