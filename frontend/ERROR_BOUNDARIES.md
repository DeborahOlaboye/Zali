# Error Boundaries Documentation

## Overview

Error boundaries are React components that catch JavaScript errors anywhere in the child component tree, log those errors, and display a fallback UI instead of crashing the entire application. This document provides comprehensive guidance on implementing and using error boundaries in the Zali application.

## Table of Contents

1. [Types of Error Boundaries](#types-of-error-boundaries)
2. [Implementation Guide](#implementation-guide)
3. [Usage Examples](#usage-examples)
4. [Error Handling Strategy](#error-handling-strategy)
5. [Testing Error Boundaries](#testing-error-boundaries)
6. [Best Practices](#best-practices)
7. [API Reference](#api-reference)

## Types of Error Boundaries

### 1. ErrorBoundary (Base Component)

The foundational error boundary component with support for:
- Custom fallback UI
- Error logging and monitoring
- Error severity analysis
- Auto-recovery capabilities
- Development error details

**When to use:**
- Wrapping major sections of the application
- Protecting feature-specific components
- Implementing custom error handling logic

### 2. ContractErrorBoundary

Specialized error boundary for smart contract interactions with:
- Contract-specific error parsing
- Network switching support
- Transaction error handling
- Wallet error management

**When to use:**
- Wrapping components that interact with smart contracts
- Transaction forms and contract calls
- Wallet-dependent features

### 3. WalletErrorBoundary

Dedicated error boundary for wallet-related operations with:
- Wallet connection error handling
- Auto-recovery suggestions
- Enhanced error UI for wallet issues

**When to use:**
- Wrapping wallet provider components
- Authentication components
- Wallet selector components

### 4. AsyncErrorBoundary

Specialized for asynchronous operations with:
- Network request error handling
- Async operation tracking
- Loading state management
- Retry mechanisms

**When to use:**
- API call error handling
- Data fetching operations
- Async form submissions

## Implementation Guide

### Basic Setup

Each error boundary follows the same basic pattern:

```tsx
<ErrorBoundary 
  name="ComponentName"
  level="component"
  onError={(error, errorInfo) => {
    // Handle error
  }}
>
  {/* Your component content */}
</ErrorBoundary>
```

### With Custom Fallback

```tsx
<ErrorBoundary
  name="MyComponent"
  fallback={(error, errorInfo, reset) => (
    <div className="error-container">
      <h2>Custom Error Occurred</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  {/* Your component content */}
</ErrorBoundary>
```

### With Error Logging

```tsx
<ErrorBoundary
  name="MyComponent"
  level="page"
  enableLogging={true}
  onError={(error, errorInfo) => {
    // Send to error tracking service
    trackError({
      error,
      errorInfo,
      component: 'MyComponent'
    });
  }}
>
  {/* Your component content */}
</ErrorBoundary>
```

## Usage Examples

### Example 1: Page-level Error Boundary

```tsx
// src/app/play/page.tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import GameComponent from '@/components/GameComponent';

export default function PlayPage() {
  return (
    <ErrorBoundary
      name="PlayPage"
      level="page"
      enableLogging={true}
    >
      <GameComponent />
    </ErrorBoundary>
  );
}
```

### Example 2: Section-level Error Boundary

```tsx
// src/components/LeaderboardSection.tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import Leaderboard from '@/components/Leaderboard';

export function LeaderboardSection() {
  return (
    <ErrorBoundary
      name="LeaderboardSection"
      level="section"
      fallback={(error, errorInfo, reset) => (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p>Failed to load leaderboard</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    >
      <Leaderboard />
    </ErrorBoundary>
  );
}
```

### Example 3: Contract Interaction Error Boundary

```tsx
// src/components/PlayForm.tsx
import ContractErrorBoundary from '@/components/ContractErrorBoundary';
import GameForm from '@/components/GameForm';

export function PlayForm() {
  return (
    <ContractErrorBoundary
      context={{ operation: 'playGame' }}
    >
      <GameForm />
    </ContractErrorBoundary>
  );
}
```

### Example 4: Async Operation Error Boundary

```tsx
// src/components/UserProfile.tsx
import AsyncErrorBoundary from '@/components/AsyncErrorBoundary';
import ProfileContent from '@/components/ProfileContent';

export function UserProfile() {
  return (
    <AsyncErrorBoundary
      name="UserProfileFetch"
    >
      <ProfileContent />
    </AsyncErrorBoundary>
  );
}
```

## Error Handling Strategy

### Error Severity Levels

Errors are classified into three severity levels:

1. **Critical** - Application or feature cannot continue
   - Contract errors
   - Wallet disconnection
   - Type errors
   - Reference errors

2. **Warning** - Operation failed but can be retried
   - Network errors
   - Timeouts
   - Contract reverts

3. **Info** - Expected user actions
   - Transaction rejection
   - Permission denial
   - User cancellation

### Error Recovery Flow

```
Error Occurs
    ↓
Error Boundary Catches It
    ↓
Logger Records Error (with severity)
    ↓
Error Analysis (categorization)
    ↓
Display Appropriate UI
    ↓
User Can Retry / Navigate Away
```

### Error Categories

The system automatically categorizes errors:

- **wallet** - Wallet connection issues
- **network** - Network and timeout errors
- **contract** - Smart contract failures
- **permission** - Permission/denial errors
- **timeout** - Request timeout
- **balance** - Insufficient funds
- **type** - Type errors
- **reference** - Reference errors
- **syntax** - Syntax errors
- **unknown** - Unclassified errors

## Testing Error Boundaries

### Unit Tests

```tsx
describe('ErrorBoundary', () => {
  it('should render fallback on error', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('should call onError callback', () => {
    const onError = jest.fn();
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary onError={onError}>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });
});
```

### Integration Tests

```tsx
describe('Error Boundary Integration', () => {
  it('should recover from async errors', async () => {
    const { rerender } = render(
      <ErrorBoundary>
        <AsyncComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();

    // Rerender with fixed component
    rerender(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Granular Error Boundaries

Create error boundaries at multiple levels:

```tsx
<ErrorBoundary level="page">
  <PageContent>
    <ErrorBoundary level="section">
      <Section1 />
    </ErrorBoundary>
    <ErrorBoundary level="section">
      <Section2 />
    </ErrorBoundary>
  </PageContent>
</ErrorBoundary>
```

**Benefits:**
- Errors in one section don't crash the entire page
- Better error isolation and recovery
- More granular error tracking

### 2. Custom Error Messages

Always provide user-friendly error messages:

```tsx
<ErrorBoundary
  fallback={(error) => (
    <div>
      <h2>Unable to load content</h2>
      <p>Please refresh the page or try again later</p>
    </div>
  )}
>
  {children}
</ErrorBoundary>
```

### 3. Error Context

Include component context in error logs:

```tsx
<ErrorBoundary
  name="PaymentForm"
  onError={(error, errorInfo) => {
    logError({
      component: 'PaymentForm',
      operation: 'processPayment',
      error,
      timestamp: new Date(),
    });
  }}
>
  {children}
</ErrorBoundary>
```

### 4. Recovery Mechanisms

Implement auto-recovery when appropriate:

```tsx
<ErrorBoundary
  level="component"
  onError={(error) => {
    // Auto-refresh data after error
    setTimeout(() => {
      refetchData();
    }, 3000);
  }}
>
  {children}
</ErrorBoundary>
```

### 5. Error Logging

Always enable logging in production:

```tsx
<ErrorBoundary
  enableLogging={true}
  onError={(error, errorInfo) => {
    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      sentryClient.captureException(error, {
        contexts: { errorInfo }
      });
    }
  }}
>
  {children}
</ErrorBoundary>
```

## API Reference

### ErrorBoundary Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  name?: string;
  enableLogging?: boolean;
  showDetails?: boolean;
}
```

### ContractErrorBoundary Props

```typescript
interface ContractErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: ContractError, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: Record<string, any>;
}
```

### AsyncErrorBoundary Props

```typescript
interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error) => void;
  name?: string;
}
```

### Error Logger API

```typescript
class ErrorLogger {
  log(entry: ErrorLogEntry): void;
  logError(error: Error, context?: Record<string, any>, severity?: ErrorSeverity): void;
  getLogs(): ErrorLogEntry[];
  getLogsBySeverity(severity: ErrorSeverity): ErrorLogEntry[];
  clearLogs(): void;
}
```

### Error Analyzer API

```typescript
function analyzeError(error: Error | null, errorInfo?: ErrorInfo): ErrorAnalysis;
function getErrorCategory(error: Error): string;
function isRecoverableError(error: Error): boolean;
function getErrorMessage(error: Error | null): string;
```

## Troubleshooting

### Error Boundary Not Catching Errors

Error boundaries **cannot** catch errors from:
- Event handlers (use try-catch instead)
- Asynchronous code (use AsyncErrorBoundary)
- Server-side rendering
- The error boundary itself

### Multiple Error Boundaries Triggering

If multiple boundaries are catching the same error:
- Ensure boundaries are properly nested
- Use more specific error handling at lower levels
- Check component hierarchy

### Memory Leaks in Error Logging

If using error logging:
- Ensure cleanup in `componentWillUnmount()`
- Limit log storage to prevent memory issues
- Use log rotation or clearing strategies

## Migration Guide

To migrate existing error handling to the new system:

1. **Identify error-prone areas** in your components
2. **Choose appropriate error boundary** (page, section, or component level)
3. **Wrap components** with the selected error boundary
4. **Add custom fallback UI** if needed
5. **Test error scenarios** to ensure proper handling
6. **Add error logging** for monitoring

## Support & Feedback

For questions about error boundaries or to report issues:

1. Check existing documentation
2. Review component tests for usage examples
3. Create an issue with error boundary label
4. Submit PR with improvements

---

**Last Updated:** December 2025
**Version:** 1.0
