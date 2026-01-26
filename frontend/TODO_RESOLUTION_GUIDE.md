# Issue #147: TODO Comment Resolution Guide

Complete guide to resolving all 9 TODO comments found in the Zali codebase.

---

## 📋 TODO Summary

**Total TODOs Found:** 9 across 6 files  
**Priority Distribution:**
- High Priority (Blocking features): 3
- Medium Priority (Nice to have): 4
- Low Priority (Type improvements): 2

---

## 🔍 Detailed TODO Analysis

### 1. ✅ Notification System TODOs (4 files, 4 instances)

**Status:** Medium Priority - Feature Enhancement  
**Recommendation:** Create separate GitHub issue

#### File 1: useContractUtils.ts (Line 55)

```typescript
// Current (with TODO):
if (showNotifications) {
  // TODO: Uncomment and integrate with your notification system
  // toast.error(enhancedError.message, {
  //   errorId: `contract-utils-${Date.now()}`,
  //   autoClose: 5000,
  //   ...enhancedError.details
  // });
}

// Resolution: Remove TODO, keep disabled pending notification system implementation
```

**Action:** Remove TODO comment, keep disabled code for future integration  
**Reason:** Notification system integration depends on external dependency  
**Suggested GitHub Issue:** "Implement toast notification system for contract operations"

#### File 2: useContractRead.ts (Line 75)

```typescript
// Current (with TODO):
if (showNotifications) {
  // TODO: Uncomment and integrate with your notification system
  // toast.error(enhancedError.message, {
  //   errorId: `contract-read-${Date.now()}`,
  //   autoClose: 5000,
  //   ...enhancedError.details
  // });
}
```

**Action:** Remove TODO comment, keep disabled code  
**Reason:** Same as above - pending notification system setup

#### File 3: useContractWrite.ts (Line 85)

```typescript
// Current (with TODO):
if (showNotifications) {
  // TODO: Uncomment and integrate with your notification system
  // toast.error(enhancedError.message, {
  //   errorId: `contract-write-${txHash || Date.now()}`,
  //   autoClose: 10000, // Longer timeout for write operations
  //   ...enhancedError.details
  // });
}
```

**Action:** Remove TODO comment, keep disabled code  
**Reason:** Same as above - pending notification system setup

#### File 4: useContractWrite.ts (Line 209)

```typescript
// Current (with TODO):
if (showNotifications) {
  // TODO: Uncomment and integrate with your notification system
  // toast.success('Transaction confirmed!', {
  //   autoClose: 5000,
  //   txHash: hash,
  //   ...errorContext
  // });
}
```

**Action:** Remove TODO comment, keep disabled code  
**Reason:** Same as above - pending notification system setup

**Consolidated GitHub Issue:**
```markdown
Title: Implement Toast Notification System for Contract Operations
Priority: Medium
Labels: enhancement, notifications, contracts

Description:
The contract hooks (useContractRead, useContractWrite, useContractUtils) 
have disabled toast notifications pending implementation of a notification system.

This issue should:
1. Choose notification library (react-hot-toast, sonner, or custom)
2. Implement NotificationProvider wrapper
3. Integrate with useContractRead error handling
4. Integrate with useContractWrite error and success handling
5. Integrate with useContractUtils error handling
6. Add tests for notification display

Files affected:
- src/hooks/useContractUtils.ts
- src/hooks/useContractRead.ts
- src/hooks/useContractWrite.ts (2 locations)
```

---

### 2. 🔗 Type Import TODOs (2 instances in useEnhancedContract.ts)

**Status:** Low Priority - Code Quality  
**Recommendation:** Implement immediately

#### TODO 1: Line 79 - chain type import

```typescript
// Current:
chain: any; // TODO: Import proper chain type from wagmi

// Solution:
import type { Chain } from 'viem';
// Or from wagmi:
import { type Chain } from '@wagmi/core';

// Fixed:
chain: Chain | undefined;
```

**Implementation:**
- Import proper `Chain` type from wagmi
- Replace `any` with correct type
- No functional changes needed

#### TODO 2: Line 294 - chain initialization

```typescript
// Current:
chain: undefined, // TODO: Get from public client if needed

// Context: This is already correctly implemented
// The chain should be fetched from useNetwork() hook
// Or accessed via viemClient after initialization
```

**Analysis:**
- Currently undefined is correct - chain is not always available
- Already has getChainId() available
- Type hint comment is clear enough
- No action needed - comment can be removed

---

### 3. 🎮 Game Session Loading TODO

**Status:** High Priority - Feature Implementation  
**Location:** gameSlice.ts, Line 162  
**Recommendation:** Create separate GitHub issue

```typescript
// Current:
loadGameSession: async (sessionId) => {
  set({ isLoading: true, error: null }, false, 'game/loadGameSession/pending');
  try {
    // TODO: Implement actual session loading
    // const session = await api.getGameSession(sessionId);
    // set({ gameSession: session }, false, 'game/loadGameSession/fulfilled');
  } catch (error) {
    set(
      { error: 'Failed to load game session' },
      false,
      'game/loadGameSession/rejected'
    );
    throw error;
  } finally {
    set({ isLoading: false }, false, 'game/loadGameSession/finally');
  }
},
```

**Analysis:**
- Function is implemented but disabled (commented code path)
- Requires API integration (`api.getGameSession`)
- Affects game state management
- Currently returns without loading data

**Implementation Steps:**
1. Verify API endpoint exists: `GET /api/sessions/:sessionId`
2. Uncomment API call
3. Add error handling
4. Test with mock data
5. Verify state updates correctly

**Suggested GitHub Issue:**
```markdown
Title: Implement Game Session Loading from API
Priority: High
Labels: feature, game, backend

Description:
The loadGameSession action in gameSlice is currently disabled.
This needs to be implemented to load saved game sessions.

Requirements:
1. API endpoint: GET /api/sessions/:sessionId
2. Response should include: {id, questions, currentQuestion, score, etc.}
3. Update gameSlice state with loaded session
4. Handle loading and error states
5. Add tests for session loading
```

---

### 4. 🔐 Signature Verification TODO

**Status:** Medium Priority - Security Feature  
**Location:** frameUtils.ts, Line 40  
**Recommendation:** Create separate GitHub issue

```typescript
// Current:
try {
  if (!trustedData || typeof trustedData !== 'object') {
    return {
      valid: false,
      error: 'Invalid trusted data format',
    };
  }

  // TODO: Implement actual signature verification
  // const hubClient = getHubClient();
  // const result = await hubClient.validateMessage(trustedData);

  return {
    valid: true,
  };
} catch (error) {
  console.error('Frame validation error:', error);
  return {
    valid: false,
    error: 'Validation failed',
  };
}
```

**Analysis:**
- Currently returns `valid: true` for all inputs
- Security issue: all frames would be accepted
- Requires Farcaster hub client setup
- Should verify Farcaster frame signatures

**Implementation Steps:**
1. Install `@farcaster/hub-nodejs` package
2. Setup hub client
3. Implement proper signature verification
4. Add message validation
5. Test with real frames

**Suggested GitHub Issue:**
```markdown
Title: Implement Farcaster Frame Signature Verification
Priority: High
Labels: security, farcaster, frames

Description:
Frame validation in frameUtils.ts currently accepts all frames without verification.
This is a security issue and needs proper signature verification.

Requirements:
1. Use @farcaster/hub-nodejs for verification
2. Validate frame signature against Farcaster public key
3. Validate message with validateMessage API
4. Return proper validation result
5. Add tests for frame validation
6. Document security considerations
```

---

### 5. 💰 Unclaimed Sessions TODO

**Status:** Medium Priority - Feature Implementation  
**Location:** useRewardManagement.ts, Line 216  
**Recommendation:** Create separate GitHub issue

```typescript
// Current:
return {
  ...queries,
  ...mutations,
  unclaimedSessions: [], // TODO: Implement unclaimed sessions logic
};
```

**Analysis:**
- Currently hardcoded empty array
- Should query API for unclaimed game sessions
- Part of reward/incentive system
- Affects user experience on rewards page

**Implementation Steps:**
1. Add query hook for unclaimed sessions
2. Call API to fetch sessions with unclaimed rewards
3. Filter and format response
4. Return actual data instead of empty array
5. Add loading and error states
6. Test with mock data

**Suggested GitHub Issue:**
```markdown
Title: Implement Unclaimed Game Sessions Tracking
Priority: Medium
Labels: feature, rewards, queries

Description:
The useRewardManagement hook returns an empty array for unclaimedSessions.
This should fetch and return actual unclaimed game sessions from the API.

Requirements:
1. Create query hook for unclaimed sessions
2. API endpoint: GET /api/rewards/unclaimed-sessions
3. Response should include session details, reward amounts, etc.
4. Add pagination support if needed
5. Handle loading and error states
6. Add tests for unclaimed sessions query
```

---

## 📊 Resolution Summary

| TODO | File | Priority | Type | Action | Est. Effort |
|------|------|----------|------|--------|-------------|
| 1-4 | Notification System | Medium | Code | Remove comments, create issue | 1 hour |
| 5 | useEnhancedContract chain type | Low | Type | Add type import | 15 min |
| 6 | useEnhancedContract chain init | Low | Comment | Remove comment | 5 min |
| 7 | Game session loading | High | Feature | Implement, create issue | 2-3 hours |
| 8 | Frame signature verification | High | Security | Implement, create issue | 2-3 hours |
| 9 | Unclaimed sessions | Medium | Feature | Implement, create issue | 1-2 hours |

---

## ✅ Resolution Plan

### Phase 1: Quick Fixes (15-20 minutes)
- [ ] Remove notification system TODOs (keep disabled code)
- [ ] Add chain type import
- [ ] Remove chain initialization comment

### Phase 2: Code Improvements (30-40 minutes)
- [ ] Improve gameSlice session loading placeholder
- [ ] Document disabled features

### Phase 3: Create GitHub Issues (30-45 minutes)
- [ ] Issue #148: Implement Toast Notification System
- [ ] Issue #149: Implement Game Session Loading
- [ ] Issue #150: Implement Farcaster Frame Signature Verification
- [ ] Issue #151: Implement Unclaimed Sessions Query

### Phase 4: Documentation (30-45 minutes)
- [ ] Update TODO documentation
- [ ] Create issue templates
- [ ] Update developer guide

---

## 🎯 Implementation Details

### For Notification System

Create `src/contexts/NotificationContext.tsx`:

```typescript
import { ReactNode, useCallback } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  details?: Record<string, any>;
}

interface NotificationContextType {
  toast: {
    success: (msg: string, options?: Partial<Toast>) => void;
    error: (msg: string, options?: Partial<Toast>) => void;
    warning: (msg: string, options?: Partial<Toast>) => void;
    info: (msg: string, options?: Partial<Toast>) => void;
  };
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts(prev => [...prev, toast]);
    
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration || 5000);
    }
  }, []);

  const value: NotificationContextType = {
    toast: {
      success: (msg, opts) => addToast({ id: `${Date.now()}`, type: 'success', message: msg, ...opts }),
      error: (msg, opts) => addToast({ id: `${Date.now()}`, type: 'error', message: msg, ...opts }),
      warning: (msg, opts) => addToast({ id: `${Date.now()}`, type: 'warning', message: msg, ...opts }),
      info: (msg, opts) => addToast({ id: `${Date.now()}`, type: 'info', message: msg, ...opts }),
    },
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} />
    </NotificationContext.Provider>
  );
}
```

---

## 📚 GitHub Issues to Create

### Issue #148: Toast Notification System Implementation
- Priority: Medium
- Labels: enhancement, notifications, ui
- Affects: 3 files (useContractRead, useContractWrite, useContractUtils)

### Issue #149: Game Session Loading from API
- Priority: High
- Labels: feature, game, backend
- Affects: gameSlice.ts

### Issue #150: Farcaster Frame Signature Verification
- Priority: High
- Labels: security, farcaster, frames
- Affects: frameUtils.ts

### Issue #151: Unclaimed Game Sessions Query
- Priority: Medium
- Labels: feature, rewards, queries
- Affects: useRewardManagement.ts

---

## 📝 Code Modifications Required

### 1. Remove Notification TODOs

Replace in 4 files:
- `useContractUtils.ts`: Line 55
- `useContractRead.ts`: Line 75
- `useContractWrite.ts`: Lines 85, 209

Action: Remove `// TODO:` comment, keep disabled code

### 2. Fix Type Imports

In `useEnhancedContract.ts`:
- Line 79: Add type import for `Chain`
- Line 294: Remove TODO comment or update

### 3. Create Documentation

Create `TODOS_RESOLVED.md` documenting:
- What was removed and why
- What was created as GitHub issues
- Reference to new issues
- Implementation notes

---

## ✨ Best Practices Going Forward

**Policy:** No TODO comments in code

**Instead:**
1. ✅ Create GitHub issue for any pending work
2. ✅ Link issue number in PR comments if needed
3. ✅ Use issue labels for tracking
4. ✅ Reference issues in commit messages

**Workflow:**
```
Issue Found → Create GitHub Issue → Reference in PR → Resolve → Close Issue
```

---

**Version:** 1.0  
**Created:** January 26, 2026  
**Status:** Ready for Implementation
