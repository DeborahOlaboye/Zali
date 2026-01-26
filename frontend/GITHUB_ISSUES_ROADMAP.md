# GitHub Issues Roadmap - Post TODO Resolution

## Overview

This document outlines the GitHub issues that should be created to track the larger work items identified during Issue #147 (TODO Comments Resolution). These are the specific features, fixes, and improvements that require substantial development effort.

**Created by:** Issue #147 - TODO Comments Resolution  
**Date:** 2024  
**Total Issues to Create:** 4  
**Estimated Combined Effort:** 7-11 hours

---

## Issue #148: Toast Notification System Implementation

### Quick Reference
- **Type:** Feature Enhancement
- **Priority:** Medium
- **Effort:** 2-3 hours
- **Files Affected:** 3
- **Dependencies:** None

### Issue Title
> Implement system-wide toast notification system for contract interactions

### Issue Description

Currently, several critical contract interaction operations have disabled toast notifications. These notifications are essential for user feedback and error handling. This issue tracks the implementation of a centralized toast notification system that integrates with all contract hooks.

### Current State

Multiple hooks have placeholder code with disabled toast notifications:

```typescript
// useContractUtils.ts (line 55)
if (showNotifications) {
  // Notification system integration pending
  // toast.error(enhancedError.message, { ... });
}

// useContractRead.ts (line 75)
if (showNotifications) {
  // Notification system integration pending
  // toast.error(enhancedError.message, { ... });
}

// useContractWrite.ts (lines 85, 209)
if (showNotifications) {
  // Notification system integration pending
  // toast.error/success(message, { ... });
}
```

### Requirements

#### Functional Requirements
- [ ] Error notifications for contract creation failures
- [ ] Error notifications for contract read failures
- [ ] Error notifications for contract write failures
- [ ] Success notifications for transaction confirmations
- [ ] Notifications display error context and details
- [ ] Notifications include transaction hashes when applicable
- [ ] Auto-dismiss timers (5 seconds for errors, variable for success)
- [ ] User can manually dismiss notifications
- [ ] Notifications appear in consistent location (top-right recommended)

#### Technical Requirements
- [ ] Use existing toast library or add one (React Toastify or similar)
- [ ] Create centralized notification service/hook
- [ ] Implement error formatting for clarity
- [ ] Add success toast with transaction link when available
- [ ] Support multiple simultaneous notifications
- [ ] Prevent notification spam (coalesce similar errors)
- [ ] Add unit tests for notification logic
- [ ] Document notification patterns

#### User Experience
- [ ] Clear, user-friendly error messages
- [ ] Visual distinction between error and success states
- [ ] Don't show notifications for expected failures (user cancelled, etc.)
- [ ] Include actionable information (retry, learn more, etc.)
- [ ] Accessible (ARIA labels, keyboard dismissal)

### Implementation Files

1. **Create new file:** `frontend/src/services/toastService.ts`
   - Centralized notification logic
   - Error message formatting
   - Toast helper functions

2. **Update:** `frontend/src/hooks/useContractUtils.ts`
   - Uncomment and integrate error notifications
   - Use new toastService

3. **Update:** `frontend/src/hooks/useContractRead.ts`
   - Uncomment and integrate error notifications
   - Use new toastService

4. **Update:** `frontend/src/hooks/useContractWrite.ts`
   - Uncomment error notifications
   - Uncomment success notifications
   - Use new toastService

### Acceptance Criteria

- [ ] All three hooks emit notifications for errors
- [ ] useContractWrite shows success notification on transaction confirmation
- [ ] Notification content is contextual and helpful
- [ ] No duplicate notifications for same error
- [ ] Notifications respect user settings (if showNotifications=false)
- [ ] Unit tests cover notification scenarios
- [ ] Code review and approval complete

### Testing Checklist

- [ ] Manual test: contract creation failure notification
- [ ] Manual test: contract read failure notification
- [ ] Manual test: contract write error notification
- [ ] Manual test: transaction success notification
- [ ] Manual test: notification dismissal works
- [ ] Unit tests for toastService
- [ ] Unit tests for integration in each hook

### Related Issues
- Closes related notifications work from Issue #147

### Labels
- `type: feature`
- `priority: medium`
- `effort: moderate`
- `component: frontend`
- `component: ui`

---

## Issue #149: Farcaster Frame Signature Verification (SECURITY)

### Quick Reference
- **Type:** Security Fix
- **Priority:** Critical
- **Effort:** 2-3 hours
- **Files Affected:** 1
- **Dependencies:** @farcaster/hub-nodejs package
- **Security Impact:** HIGH - Currently accepts all frames without validation

### Issue Title
> Implement actual Farcaster frame signature verification

### Issue Description

**SECURITY CRITICAL:** The current frame validation implementation accepts all frames without verifying their signatures. This is a security vulnerability that allows potentially malicious frames to be processed.

The `frameUtils.ts` file contains placeholder code that returns `valid: true` for all inputs without performing any actual signature verification. This must be fixed before the application handles any sensitive frame operations.

### Current State

```typescript
// frameUtils.ts (line 40)
const validateFrameSignature = async (trustedData) => {
  // Basic validation only - no signature verification
  if (!trustedData || typeof trustedData !== 'object') {
    return { valid: false, error: 'Invalid format' };
  }

  // SECURITY: Implement actual signature verification
  // See GitHub Issue #149 for implementation
  // const hubClient = getHubClient();
  // const result = await hubClient.validateMessage(trustedData);

  return { valid: true }; // ⚠️ SECURITY: Accepts all frames!
};
```

### Security Requirements

#### Signature Verification
- [ ] Use @farcaster/hub-nodejs for signature validation
- [ ] Verify frame trusted data signatures
- [ ] Check signature timestamp is recent (prevent replay attacks)
- [ ] Validate signer identity
- [ ] Reject frames with invalid signatures
- [ ] Handle and log verification failures

#### Error Handling
- [ ] Graceful handling of verification errors
- [ ] Comprehensive error logging for debugging
- [ ] Don't expose sensitive error details to users
- [ ] Add monitoring/alerting for suspicious frames

#### Documentation
- [ ] Document verification process
- [ ] Include comments on security implications
- [ ] Add security testing guide
- [ ] Document deployment considerations

### Technical Requirements

- [ ] Install and configure @farcaster/hub-nodejs
- [ ] Create hub client instance with proper config
- [ ] Implement message validation logic
- [ ] Handle async validation properly
- [ ] Type all inputs/outputs correctly
- [ ] Add comprehensive error handling
- [ ] Add logging for debugging and auditing

### Implementation Files

1. **Update:** `frontend/src/lib/frameUtils.ts`
   - Implement actual signature verification
   - Add proper error handling
   - Add logging
   - Update return types if needed

2. **Create:** `frontend/src/lib/frameClient.ts` (if needed)
   - Initialize hub client
   - Export client singleton
   - Handle configuration

3. **Create:** `frontend/src/utils/frameValidation.ts` (if needed)
   - Validation helper functions
   - Type definitions
   - Constants

### Acceptance Criteria

- [ ] Frame signatures are validated using hub-nodejs
- [ ] Invalid signatures return `valid: false`
- [ ] Verification errors are caught and logged
- [ ] Timestamp validation prevents replay attacks
- [ ] All frame data is properly typed
- [ ] Integration tests cover validation scenarios
- [ ] Security review completed
- [ ] No warnings from security tools

### Testing Checklist

- [ ] Unit test: Valid frame signature
- [ ] Unit test: Invalid frame signature
- [ ] Unit test: Expired signature (replay attack)
- [ ] Unit test: Malformed trusted data
- [ ] Unit test: Network error handling
- [ ] Integration test: End-to-end validation
- [ ] Manual test: Frame validation flow
- [ ] Security audit before deployment

### Deployment Considerations

- [ ] Requires @farcaster/hub-nodejs package
- [ ] May need environment variables for hub configuration
- [ ] Monitor validation failures in production
- [ ] Have rollback plan if issues discovered

### Related Issues
- Identified in Issue #147 - TODO Comments Resolution
- May depend on frame service infrastructure

### Labels
- `type: security`
- `priority: critical`
- `effort: moderate`
- `component: frontend`
- `component: frames`
- `security`

---

## Issue #150: Game Session Loading from API

### Quick Reference
- **Type:** Feature Implementation
- **Priority:** High
- **Effort:** 2-3 hours
- **Files Affected:** 2 (gameSlice.ts, potentially API service)
- **Dependencies:** Backend API endpoint

### Issue Title
> Implement game session loading from API

### Issue Description

The game state management currently has a `loadGameSession` function that is empty with no API integration. This function needs to be fully implemented to fetch active game session data from the backend and update the Redux store properly.

### Current State

```typescript
// gameSlice.ts (line 162)
loadGameSession: async (sessionId) => {
  set({ isLoading: true, error: null }, false, 'game/loadGameSession/pending');
  try {
    // FEATURE: Load game session from API
    // const session = await api.getGameSession(sessionId);
    // set({ gameSession: session }, false, 'game/loadGameSession/fulfilled');
  } catch (error) {
    set({ error: 'Failed to load game session' }, false, 'game/loadGameSession/rejected');
    throw error;
  } finally {
    set({ isLoading: false }, false, 'game/loadGameSession/finally');
  }
},
```

### Requirements

#### Functional Requirements
- [ ] Fetch game session from API by session ID
- [ ] Handle loading state during fetch
- [ ] Update Redux state with session data
- [ ] Handle API errors gracefully
- [ ] Cache session data appropriately
- [ ] Support session refresh/refetch
- [ ] Validate response data structure
- [ ] Set proper error messages on failure

#### Data Requirements
- [ ] Ensure GameSession type definition exists
- [ ] Type session response data correctly
- [ ] Validate required fields are present
- [ ] Handle partial data gracefully
- [ ] Map API response to GameSession type

#### Error Handling
- [ ] Network errors (timeout, no connection)
- [ ] Invalid session ID
- [ ] Malformed API response
- [ ] User not authenticated
- [ ] Session expired or not found
- [ ] Server errors (5xx)

### Implementation Steps

1. **Verify API Service**
   - Check `frontend/src/services/api.ts` or similar
   - Ensure `getGameSession(sessionId)` endpoint exists
   - Verify endpoint returns properly typed data
   - Add if not present

2. **Update gameSlice.ts**
   ```typescript
   loadGameSession: async (sessionId: string) => {
     set({ isLoading: true, error: null }, false, 'game/loadGameSession/pending');
     try {
       const session = await api.getGameSession(sessionId);
       
       // Validate response
       if (!session || typeof session !== 'object') {
         throw new Error('Invalid session data received');
       }

       set({ gameSession: session }, false, 'game/loadGameSession/fulfilled');
     } catch (error) {
       const errorMessage = error instanceof Error 
         ? error.message 
         : 'Failed to load game session';
       set({ error: errorMessage }, false, 'game/loadGameSession/rejected');
       throw error;
     } finally {
       set({ isLoading: false }, false, 'game/loadGameSession/finally');
     }
   },
   ```

3. **Add Tests**
   - Unit tests for happy path
   - Unit tests for error scenarios
   - Integration tests with API mock

### Acceptance Criteria

- [ ] API call fetches session correctly
- [ ] Loading state updates properly
- [ ] Session data stored in Redux
- [ ] Errors handled and displayed
- [ ] Type safety enforced (TypeScript)
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Code review approved

### Testing Checklist

- [ ] Unit test: Successful session load
- [ ] Unit test: Session not found (404)
- [ ] Unit test: Network error
- [ ] Unit test: Invalid response format
- [ ] Unit test: Loading state management
- [ ] Integration test: Full flow
- [ ] Manual test: Load valid session
- [ ] Manual test: Handle invalid session

### Related Issues
- Identified in Issue #147 - TODO Comments Resolution
- May depend on backend API implementation

### Labels
- `type: feature`
- `priority: high`
- `effort: moderate`
- `component: frontend`
- `component: game`
- `component: state-management`

---

## Issue #151: Unclaimed Game Sessions Query

### Quick Reference
- **Type:** Feature Implementation
- **Priority:** Medium
- **Effort:** 1-2 hours
- **Files Affected:** 1 (useRewardManagement.ts)
- **Dependencies:** Backend API endpoint

### Issue Title
> Implement query for unclaimed game sessions

### Issue Description

The rewards management hook currently returns a hardcoded empty array for `unclaimedSessions`. This needs to be implemented to actually query the backend API for game sessions that have rewards pending claim.

### Current State

```typescript
// useRewardManagement.ts (line 216)
return {
  ...queries,
  ...mutations,
  // FEATURE: Query unclaimed game sessions - See GitHub Issue #150
  unclaimedSessions: [],
};
```

### Requirements

#### Functional Requirements
- [ ] Query backend API for unclaimed sessions
- [ ] Return typed array of unclaimed sessions
- [ ] Handle loading state for query
- [ ] Handle errors gracefully
- [ ] Cache results appropriately
- [ ] Support refetch/refresh
- [ ] Validate response structure
- [ ] Filter to only unclaimed/claimable sessions

#### Data Requirements
- [ ] Define/verify GameSession or RewardSession type
- [ ] API returns sessions with reward information
- [ ] Include claim amount and deadline
- [ ] Include session metadata (questions, score, etc.)
- [ ] Type response correctly

#### Error Handling
- [ ] Network errors
- [ ] User not authenticated
- [ ] Invalid response format
- [ ] Server errors

### Implementation Approach

#### Option 1: Use Existing Query System
If the project uses React Query or SWR:

```typescript
const useUnclaimedSessions = () => {
  return useQuery({
    queryKey: ['unclaimedSessions'],
    queryFn: async () => {
      const sessions = await api.getUnclaimedSessions();
      return sessions.filter(s => s.hasClaimableReward);
    },
    enabled: isConnected, // Only run if user is connected
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
```

#### Option 2: Manual State Management
If using Zustand or similar:

```typescript
unclaimedSessions: async () => {
  set({ unclaimedLoading: true }, false, 'unclaimed/pending');
  try {
    const sessions = await api.getUnclaimedSessions();
    set({ unclaimedSessions: sessions }, false, 'unclaimed/fulfilled');
  } catch (error) {
    set({ unclaimedError: error.message }, false, 'unclaimed/rejected');
  } finally {
    set({ unclaimedLoading: false }, false, 'unclaimed/finally');
  }
},
```

### Implementation Files

1. **Update:** `frontend/src/hooks/useRewardManagement.ts`
   - Add unclaimed sessions query
   - Integrate with existing hook pattern
   - Return typed data

2. **Verify:** `frontend/src/services/api.ts` or similar
   - Ensure `getUnclaimedSessions()` exists
   - Verify proper response type
   - Add endpoint if missing

### Acceptance Criteria

- [ ] Unclaimed sessions fetched from API
- [ ] Returns typed array of sessions
- [ ] Loading state works properly
- [ ] Errors handled gracefully
- [ ] Results cached appropriately
- [ ] Unit tests pass
- [ ] Type safety enforced
- [ ] Code review approved

### Testing Checklist

- [ ] Unit test: Successful query
- [ ] Unit test: Empty results
- [ ] Unit test: Network error
- [ ] Unit test: Invalid response
- [ ] Unit test: Loading state
- [ ] Integration test: Full flow
- [ ] Manual test: Query returns sessions
- [ ] Manual test: Results update correctly

### Related Issues
- Identified in Issue #147 - TODO Comments Resolution
- Related to reward claiming workflow
- May depend on backend API

### Labels
- `type: feature`
- `priority: medium`
- `effort: quick`
- `component: frontend`
- `component: rewards`
- `component: hooks`

---

## Creation Checklist

When creating these issues in GitHub:

### Before Creating
- [ ] Review all four issue descriptions
- [ ] Ensure titles are clear and specific
- [ ] Verify acceptance criteria are testable
- [ ] Check dependencies are documented
- [ ] Confirm effort estimates

### Creating Issues
- [ ] Create Issue #148: Toast Notifications
- [ ] Create Issue #149: Frame Verification (SECURITY)
- [ ] Create Issue #150: Session Loading
- [ ] Create Issue #151: Unclaimed Sessions

### After Creating
- [ ] Add appropriate labels to each issue
- [ ] Set priority field if available
- [ ] Add to project board if applicable
- [ ] Link issues together (depends on, related to)
- [ ] Update TODO resolution issue with links

### Linking to Issue #147

Add this reference to Issue #147:

```markdown
## Created GitHub Issues

The following GitHub issues were created to track larger work items identified during this resolution:

- Issue #148: Toast Notification System Implementation (2-3h)
- Issue #149: Farcaster Frame Signature Verification - SECURITY (2-3h)
- Issue #150: Game Session Loading from API (2-3h)
- Issue #151: Unclaimed Game Sessions Query (1-2h)

See GITHUB_ISSUES_ROADMAP.md for detailed specifications.
```

---

## Timeline & Prioritization

### Immediate (Critical - Before Deployment)
1. **Issue #149** (Frame Verification) - SECURITY CRITICAL
   - Must be fixed before handling real frames
   - 2-3 hours to implement

### Short Term (1-2 sprints)
2. **Issue #148** (Toast Notifications) - Improves UX
   - Affects user experience significantly
   - 2-3 hours to implement

3. **Issue #150** (Session Loading) - Blocks Game Features
   - Prevents game session management
   - 2-3 hours to implement

### Medium Term (2-3 sprints)
4. **Issue #151** (Unclaimed Sessions) - Feature Complete
   - Rewards feature needs this
   - 1-2 hours to implement

---

## Effort Summary

| Issue | Type | Priority | Effort | Total |
|-------|------|----------|--------|-------|
| #148 | Feature | Medium | 2-3h | 7-11h |
| #149 | Security | Critical | 2-3h |  |
| #150 | Feature | High | 2-3h |  |
| #151 | Feature | Medium | 1-2h |  |

---

*Last Updated: Issue #147 - TODO Comments Resolution*  
*Reference: GITHUB_ISSUES_ROADMAP.md*
