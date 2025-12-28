# Error Boundaries Style Guide

## Component Error Handling Standards

This guide outlines the standards for implementing error boundaries across all components in the Zali application.

## Error Boundary Placement Rules

### Rule 1: Page-Level Boundaries

Every page component should be wrapped with an ErrorBoundary at the page level:

```tsx
// ✅ GOOD
export default function MyPage() {
  return (
    <ErrorBoundary name="MyPage" level="page">
      <PageContent />
    </ErrorBoundary>
  );
}

// ❌ BAD
export default function MyPage() {
  return <PageContent />;
}
```

### Rule 2: Feature Section Boundaries

Major feature sections should have their own error boundary:

```tsx
// ✅ GOOD
export function GameSection() {
  return (
    <ErrorBoundary name="GameSection" level="section">
      <Game />
    </ErrorBoundary>
  );
}

// ❌ BAD
export function GameSection() {
  return <Game />;
}
```

### Rule 3: Contract Interaction Boundaries

Components that interact with smart contracts must use ContractErrorBoundary:

```tsx
// ✅ GOOD
export function TransactionForm() {
  return (
    <ContractErrorBoundary>
      <Form />
    </ContractErrorBoundary>
  );
}

// ❌ BAD
export function TransactionForm() {
  return <Form />;
}
```

### Rule 4: Async Operation Boundaries

Components with async operations should use AsyncErrorBoundary:

```tsx
// ✅ GOOD
export function UserData() {
  return (
    <AsyncErrorBoundary name="UserDataFetch">
      <UserProfile />
    </AsyncErrorBoundary>
  );
}

// ❌ BAD
export function UserData() {
  return <UserProfile />;
}
```

## Error Message Standards

### User-Friendly Messages

All error messages must be user-friendly and non-technical:

```tsx
// ✅ GOOD
"Unable to load your profile. Please try again."

// ❌ BAD
"TypeError: Cannot read property 'user' of undefined"
```

### Action-Oriented Messages

Error messages should suggest next steps:

```tsx
// ✅ GOOD
"Your wallet is disconnected. Please connect your wallet to continue."

// ❌ BAD
"Wallet error"
```

### Context-Specific Messages

Customize messages based on the operation:

```tsx
// ✅ GOOD
switch (operation) {
  case 'playGame':
    return "Unable to start game. Check your wallet connection.";
  case 'claimReward':
    return "Unable to claim reward. Try again shortly.";
}

// ❌ BAD
return "Operation failed";
```

## Error Logging Standards

### Always Include Context

Log errors with relevant context:

```tsx
// ✅ GOOD
errorLogger.logError(error, {
  component: 'GameForm',
  operation: 'submitAnswer',
  questionId: '123',
  userId: user?.id,
  timestamp: new Date(),
}, 'critical');

// ❌ BAD
errorLogger.logError(error);
```

### Categorize by Severity

Use appropriate severity levels:

```tsx
// ✅ GOOD
if (isContractError) {
  errorLogger.logError(error, context, 'critical');
} else if (isNetworkError) {
  errorLogger.logError(error, context, 'warning');
} else {
  errorLogger.logError(error, context, 'info');
}

// ❌ BAD
errorLogger.logError(error, context, 'critical'); // Always critical
```

## Custom Fallback UI Standards

### Minimum Information

Every fallback UI should include:

1. Clear error indicator (icon + color)
2. User-friendly message
3. Action button (retry or navigate)
4. Optional: Details toggle (dev mode only)

```tsx
// ✅ GOOD
<ErrorBoundary
  fallback={(error, errorInfo, reset) => (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <div className="flex items-center gap-2">
        <AlertIcon className="h-5 w-5 text-red-600" />
        <h3 className="font-semibold">Something went wrong</h3>
      </div>
      <p className="mt-2 text-sm">{getErrorMessage(error)}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={reset}>Try Again</button>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
      {isDev && (
        <details className="mt-4">
          <summary>Details</summary>
          <pre className="text-xs">{error.message}</pre>
        </details>
      )}
    </div>
  )}
>
  {children}
</ErrorBoundary>
```

### Consistent Styling

Use consistent colors and styles for error boundaries:

- **Critical**: Red (#dc2626)
- **Warning**: Orange (#ea580c)
- **Info**: Blue (#2563eb)

## Testing Standards

### Unit Test Requirements

Every error boundary implementation must include:

```tsx
describe('ErrorBoundary', () => {
  // 1. Test rendering without error
  it('should render children when there is no error', () => {
    // ...
  });

  // 2. Test fallback rendering
  it('should render fallback when error occurs', () => {
    // ...
  });

  // 3. Test error callback
  it('should call onError callback', () => {
    // ...
  });

  // 4. Test error recovery
  it('should reset error when retry button is clicked', () => {
    // ...
  });

  // 5. Test metadata display
  it('should display component name when provided', () => {
    // ...
  });
});
```

### Integration Test Requirements

Test error boundaries in context:

```tsx
describe('Error Boundary Integration', () => {
  // Test error recovery flow
  // Test navigation after error
  // Test error logging
  // Test multiple nested boundaries
});
```

## Naming Conventions

### Component Names

Use descriptive names for error boundaries:

```tsx
// ✅ GOOD
<ErrorBoundary name="GamePlaySection" level="section">
<ErrorBoundary name="UserRegistration" level="page">
<ErrorBoundary name="RewardClaimForm" level="component">

// ❌ BAD
<ErrorBoundary name="Error1">
<ErrorBoundary name="Main">
```

### Context Variables

Include clear context in error logging:

```tsx
// ✅ GOOD
{
  component: 'GameForm',
  operation: 'submitAnswer',
  questionId: selectedQuestion?.id,
  userId: user?.id,
}

// ❌ BAD
{
  comp: 'gf',
  op: 'submit',
  qid: '123',
}
```

## Accessibility Standards

Error boundaries must be accessible:

```tsx
// ✅ GOOD
<div role="alert" aria-live="assertive">
  <h3 id="error-title">Something went wrong</h3>
  <p id="error-description">{message}</p>
  <button aria-describedby="error-description">
    Try Again
  </button>
</div>

// ❌ BAD
<div className="error">
  <p>{message}</p>
  <button>Try Again</button>
</div>
```

## Documentation Standards

Every error boundary implementation should include:

1. **Purpose comment**: Why this boundary exists
2. **Error types comment**: What errors it catches
3. **Usage example**: How to use it
4. **Recovery strategy**: How users can recover

```tsx
/**
 * GameErrorBoundary
 *
 * Purpose: Prevent game errors from crashing the entire application
 * Catches: Game logic errors, state management errors
 *
 * Usage:
 * ```
 * <GameErrorBoundary>
 *   <GameComponent />
 * </GameErrorBoundary>
 * ```
 *
 * Recovery: Users can click "Try Again" or navigate to home page
 */
export function GameErrorBoundary({ children }) {
  // ...
}
```

## Performance Standards

Error boundaries should not impact performance:

```tsx
// ✅ GOOD
- Minimal re-renders on error catch
- Efficient error logging (async)
- Lazy load error details in dev mode
- Cache error analysis results

// ❌ BAD
- Synchronous error logging
- Render heavy UI on every error
- No error caching
```

## Summary Checklist

Before implementing an error boundary, verify:

- [ ] Appropriate boundary type selected (page/section/component)
- [ ] User-friendly error messages used
- [ ] Error context logged with severity
- [ ] Custom fallback UI implemented
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Documentation added
- [ ] Accessibility verified
- [ ] Performance checked
- [ ] Code reviewed

---

**Last Updated:** December 2025
**Version:** 1.0
