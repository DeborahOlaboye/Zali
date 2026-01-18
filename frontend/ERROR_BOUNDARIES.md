# Error Boundary System

This document describes the comprehensive error boundary system implemented in the Zali application.

## Overview

The error boundary system provides:

- **Multiple specialized error boundaries** for different contexts
- **Automatic error recovery** with configurable strategies
- **Comprehensive error logging** and analysis
- **User-friendly error UI** with recovery options
- **Global error handling** for unhandled errors

## Error Boundary Components

### ErrorBoundary (Base Component)

The main error boundary component with comprehensive error handling features.

```tsx
import { ErrorBoundary } from '@/components/errorBoundaries';

<ErrorBoundary
  name="MyComponent"
  level="component"
  enableAutoRecovery={true}
  showDetails={false}
  onError={(error, errorInfo) => console.log('Error caught:', error)}
>
  <MyComponent />
</ErrorBoundary>
```

**Props:**
- `name`: Component identifier for logging
- `level`: Error level ('page' | 'section' | 'component')
- `enableAutoRecovery`: Enable automatic recovery attempts
- `showDetails`: Show error details in development
- `fallback`: Custom error UI component
- `onError`: Error callback function

### RouteErrorBoundary

Full-screen error boundary for page-level errors.

```tsx
import { RouteErrorBoundary } from '@/components/errorBoundaries';

<RouteErrorBoundary routeName="Dashboard">
  <DashboardPage />
</RouteErrorBoundary>
```

**Features:**
- Full-screen error UI
- Navigation options (back, home, refresh, retry)
- Route-specific error context
- Development mode error details

### FormErrorBoundary

Specialized error boundary for form components.

```tsx
import { FormErrorBoundary } from '@/components/errorBoundaries';

<FormErrorBoundary 
  formName="Registration"
  onReset={() => form.reset()}
>
  <RegistrationForm />
</FormErrorBoundary>
```

**Features:**
- Form-specific error messaging
- Form reset functionality
- Compact error UI
- Error message formatting

### QueryErrorBoundary

Error boundary for React Query data fetching errors.

```tsx
import { QueryErrorBoundary } from '@/components/errorBoundaries';

<QueryErrorBoundary>
  <DataComponent />
</QueryErrorBoundary>
```

**Features:**
- Integration with React Query error reset
- Data loading error UI
- Automatic retry functionality
- Connection error handling

### SuspenseErrorBoundary

Combines React Suspense with error boundary functionality.

```tsx
import { SuspenseErrorBoundary } from '@/components/errorBoundaries';

<SuspenseErrorBoundary 
  fallback={<LoadingSpinner />}
  name="LazyComponent"
>
  <LazyLoadedComponent />
</SuspenseErrorBoundary>
```

**Features:**
- Loading state management
- Error state handling
- Lazy component support
- Async operation error handling

## Error Recovery System

### Automatic Recovery

The system includes automatic error recovery with configurable strategies:

```tsx
import { useErrorRecovery } from '@/components/errorBoundaries';

function MyComponent() {
  const { attemptRecovery, addRecoveryStrategy } = useErrorRecovery();

  // Add custom recovery strategy
  addRecoveryStrategy({
    name: 'CustomRecovery',
    canRecover: (error) => error.message.includes('custom'),
    recover: async (error) => {
      // Custom recovery logic
      return true; // Return true if recovered
    },
    maxAttempts: 3,
    delay: 1000,
  });
}
```

### Default Recovery Strategies

1. **NetworkRetry**: Retries network-related errors
2. **LocalStorageRecovery**: Clears localStorage on quota errors
3. **ComponentRefresh**: Reloads page for chunk loading errors

### Recovery Manager

```tsx
import { globalRecoveryManager } from '@/components/errorBoundaries';

// Add global recovery strategy
globalRecoveryManager.addStrategy({
  name: 'DatabaseRecovery',
  canRecover: (error) => error.message.includes('database'),
  recover: async () => {
    // Attempt database reconnection
    return await reconnectDatabase();
  },
});
```

## Global Error Handling

### useGlobalErrorHandler Hook

Handles unhandled errors and promise rejections globally:

```tsx
import { useGlobalErrorHandler } from '@/components/errorBoundaries';

function App() {
  useGlobalErrorHandler({
    enableConsoleLogging: true,
    enableRemoteLogging: true,
    onError: (error, context) => {
      // Custom global error handling
      console.error(`Global error in ${context}:`, error);
    },
  });

  return <AppContent />;
}
```

**Features:**
- Catches unhandled promise rejections
- Handles global JavaScript errors
- Configurable logging options
- Custom error callbacks

## Error Analysis and Logging

### Error Analysis

```tsx
import { analyzeError, getErrorMessage } from '@/components/errorBoundaries';

const error = new Error('Network timeout');
const analysis = analyzeError(error);

console.log(analysis.severity); // 'warning' | 'critical' | 'info'
console.log(analysis.category); // 'network' | 'validation' | 'system'
console.log(getErrorMessage(error)); // User-friendly message
```

### Error Logging

```tsx
import { errorLogger } from '@/components/errorBoundaries';

errorLogger.logError(error, {
  component: 'UserProfile',
  level: 'component',
  context: { userId: '123' },
}, 'warning');
```

## Usage Examples

### Page-Level Error Handling

```tsx
// app/dashboard/page.tsx
import { RouteErrorBoundary } from '@/components/errorBoundaries';

export default function DashboardPage() {
  return (
    <RouteErrorBoundary routeName="Dashboard">
      <DashboardContent />
    </RouteErrorBoundary>
  );
}
```

### Form Error Handling

```tsx
// components/RegistrationForm.tsx
import { FormErrorBoundary } from '@/components/errorBoundaries';

export function RegistrationForm() {
  const form = useForm();

  return (
    <FormErrorBoundary 
      formName="Registration"
      onReset={() => form.reset()}
    >
      <form onSubmit={form.handleSubmit}>
        {/* Form fields */}
      </form>
    </FormErrorBoundary>
  );
}
```

### Data Fetching Error Handling

```tsx
// components/UserList.tsx
import { QueryErrorBoundary } from '@/components/errorBoundaries';

export function UserList() {
  return (
    <QueryErrorBoundary>
      <UserListContent />
    </QueryErrorBoundary>
  );
}

function UserListContent() {
  const { data, error } = useQuery('users', fetchUsers);
  
  if (error) throw error; // Will be caught by QueryErrorBoundary
  
  return <div>{/* Render users */}</div>;
}
```

### Lazy Component Error Handling

```tsx
// components/LazyDashboard.tsx
import { SuspenseErrorBoundary } from '@/components/errorBoundaries';
import { lazy } from 'react';

const LazyDashboard = lazy(() => import('./Dashboard'));

export function LazyDashboardWrapper() {
  return (
    <SuspenseErrorBoundary 
      fallback={<DashboardSkeleton />}
      name="LazyDashboard"
    >
      <LazyDashboard />
    </SuspenseErrorBoundary>
  );
}
```

### Nested Error Boundaries

```tsx
// Complex component with multiple error boundaries
export function ComplexPage() {
  return (
    <RouteErrorBoundary routeName="ComplexPage">
      <Header />
      
      <QueryErrorBoundary>
        <DataSection />
      </QueryErrorBoundary>
      
      <FormErrorBoundary formName="Settings">
        <SettingsForm />
      </FormErrorBoundary>
      
      <SuspenseErrorBoundary>
        <LazyWidget />
      </SuspenseErrorBoundary>
    </RouteErrorBoundary>
  );
}
```

## Error UI Customization

### Custom Error Fallback

```tsx
const CustomErrorFallback = (error: Error, errorInfo: ErrorInfo, reset: () => void) => (
  <div className="custom-error-container">
    <h2>Oops! Something went wrong</h2>
    <details>
      <summary>Error details</summary>
      <pre>{error.message}</pre>
    </details>
    <button onClick={reset}>Try again</button>
  </div>
);

<ErrorBoundary fallback={CustomErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

### Themed Error UI

```tsx
const ThemedErrorBoundary = ({ children, theme = 'light' }) => (
  <ErrorBoundary
    fallback={(error, errorInfo, reset) => (
      <div className={`error-boundary ${theme}`}>
        <div className="error-content">
          <h3>Something went wrong</h3>
          <p>{error.message}</p>
          <button onClick={reset} className={`btn-${theme}`}>
            Retry
          </button>
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);
```

## Best Practices

### 1. Use Appropriate Error Boundaries

- **RouteErrorBoundary**: For page-level components
- **FormErrorBoundary**: For form components
- **QueryErrorBoundary**: For data fetching components
- **SuspenseErrorBoundary**: For lazy-loaded components
- **ErrorBoundary**: For general component error handling

### 2. Provide Meaningful Error Context

```tsx
// Good - Specific error context
<ErrorBoundary name="UserProfile" level="component">
  <UserProfile userId={userId} />
</ErrorBoundary>

// Bad - Generic error context
<ErrorBoundary>
  <UserProfile userId={userId} />
</ErrorBoundary>
```

### 3. Enable Auto-Recovery for Recoverable Errors

```tsx
// Enable auto-recovery for network components
<ErrorBoundary enableAutoRecovery={true}>
  <NetworkDependentComponent />
</ErrorBoundary>

// Disable auto-recovery for critical components
<ErrorBoundary enableAutoRecovery={false}>
  <PaymentComponent />
</ErrorBoundary>
```

### 4. Implement Custom Recovery Strategies

```tsx
// Add domain-specific recovery strategies
const { addRecoveryStrategy } = useErrorRecovery();

addRecoveryStrategy({
  name: 'AuthRecovery',
  canRecover: (error) => error.message.includes('unauthorized'),
  recover: async () => {
    await refreshAuthToken();
    return true;
  },
});
```

### 5. Log Errors Appropriately

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      logToExternalService(error, errorInfo);
    }
  }}
>
  <CriticalComponent />
</ErrorBoundary>
```

## Testing Error Boundaries

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/errorBoundaries';

const ThrowError = () => {
  throw new Error('Test error');
};

test('should catch and display error', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

### Integration Tests

```tsx
test('should recover from network errors', async () => {
  const { rerender } = render(
    <ErrorBoundary enableAutoRecovery={true}>
      <NetworkComponent shouldFail={true} />
    </ErrorBoundary>
  );

  // Wait for auto-recovery
  await waitFor(() => {
    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });
});
```

## Performance Considerations

### 1. Minimize Error Boundary Nesting

```tsx
// Good - Strategic placement
<RouteErrorBoundary>
  <Page>
    <QueryErrorBoundary>
      <DataSection />
    </QueryErrorBoundary>
  </Page>
</RouteErrorBoundary>

// Avoid - Excessive nesting
<ErrorBoundary>
  <ErrorBoundary>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </ErrorBoundary>
</ErrorBoundary>
```

### 2. Use Lazy Loading for Error UI

```tsx
const LazyErrorFallback = lazy(() => import('./ErrorFallback'));

<ErrorBoundary
  fallback={(error, errorInfo, reset) => (
    <Suspense fallback={<div>Loading error UI...</div>}>
      <LazyErrorFallback error={error} onReset={reset} />
    </Suspense>
  )}
>
  <Component />
</ErrorBoundary>
```

### 3. Debounce Error Logging

```tsx
const debouncedLogger = debounce((error) => {
  errorLogger.logError(error);
}, 1000);

<ErrorBoundary onError={debouncedLogger}>
  <Component />
</ErrorBoundary>
```

## Troubleshooting

### Common Issues

1. **Error boundaries not catching errors**
   - Ensure errors are thrown during render, not in event handlers
   - Use try-catch for event handler errors

2. **Auto-recovery not working**
   - Check if error is marked as recoverable
   - Verify recovery strategy conditions

3. **Multiple error boundaries triggering**
   - Review error boundary hierarchy
   - Ensure proper error propagation

### Debug Mode

Enable detailed error logging:

```tsx
<ErrorBoundary
  showDetails={process.env.NODE_ENV === 'development'}
  enableLogging={true}
>
  <Component />
</ErrorBoundary>
```

## Future Enhancements

- **Error analytics dashboard** for monitoring error patterns
- **Smart error recovery** with machine learning
- **User feedback integration** for error reporting
- **Performance impact monitoring** for error boundaries
- **A/B testing** for error UI effectiveness