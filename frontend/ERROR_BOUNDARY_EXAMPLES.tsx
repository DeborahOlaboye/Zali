// Example implementations of error boundaries in different scenarios

import ErrorBoundary from '@/components/ErrorBoundary';
import ContractErrorBoundary from '@/components/ContractErrorBoundary';
import AsyncErrorBoundary from '@/components/AsyncErrorBoundary';
import WalletErrorBoundary from '@/components/WalletErrorBoundary';

/**
 * Example 1: Page-level Error Boundary
 * 
 * Purpose: Protect an entire page from crashing
 * Use case: Game playing page, leaderboard page
 */
export function PageLevelExample() {
  return (
    <ErrorBoundary
      name="PlayPage"
      level="page"
      enableLogging={true}
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        // Send to monitoring service
        console.log('Page error:', error);
      }}
    >
      <div className="container">
        <h1>Play Game</h1>
        {/* Page content */}
      </div>
    </ErrorBoundary>
  );
}

/**
 * Example 2: Section-level Error Boundary
 * 
 * Purpose: Isolate errors within a feature section
 * Use case: Leaderboard section, rewards section, stats section
 */
export function SectionLevelExample() {
  return (
    <div className="page">
      <ErrorBoundary
        name="LeaderboardSection"
        level="section"
        fallback={(error, errorInfo, reset) => (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Leaderboard Unavailable</h3>
            <p className="text-sm text-yellow-700 mt-2">
              We couldn't load the leaderboard. Please try again.
            </p>
            <button
              onClick={reset}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        )}
      >
        <div className="section">
          <h2>Leaderboard</h2>
          {/* Leaderboard content */}
        </div>
      </ErrorBoundary>

      <ErrorBoundary
        name="RewardsSection"
        level="section"
        fallback={(error, errorInfo, reset) => (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Rewards Unavailable</h3>
            <p className="text-sm text-yellow-700 mt-2">
              We couldn't load your rewards. Please try again.
            </p>
            <button
              onClick={reset}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        )}
      >
        <div className="section">
          <h2>My Rewards</h2>
          {/* Rewards content */}
        </div>
      </ErrorBoundary>
    </div>
  );
}

/**
 * Example 3: Contract Error Boundary
 * 
 * Purpose: Handle smart contract interaction errors
 * Use case: Transaction forms, contract calls, wallet operations
 */
export function ContractErrorExample() {
  return (
    <ContractErrorBoundary
      context={{
        operation: 'playGame',
        gameId: '123',
      }}
      onError={(error, errorInfo) => {
        console.log('Contract error:', error);
        // Track contract errors for analysis
      }}
    >
      <div className="form">
        <h2>Play Game</h2>
        <form>
          {/* Form content - may throw contract errors */}
        </form>
      </div>
    </ContractErrorBoundary>
  );
}

/**
 * Example 4: Async Error Boundary
 * 
 * Purpose: Handle asynchronous operation errors
 * Use case: Data fetching, API calls, async form submission
 */
export function AsyncErrorExample() {
  return (
    <AsyncErrorBoundary
      name="UserProfileFetch"
      onError={(error) => {
        console.log('Async error:', error);
        // Retry or reload data
      }}
    >
      <div className="profile">
        <h2>User Profile</h2>
        {/* Profile content loaded asynchronously */}
      </div>
    </AsyncErrorBoundary>
  );
}

/**
 * Example 5: Wallet Error Boundary
 * 
 * Purpose: Handle wallet-specific errors
 * Use case: Wallet connection, authentication, wallet operations
 */
export function WalletErrorExample() {
  return (
    <WalletErrorBoundary>
      <div className="wallet-section">
        <h2>Wallet Connection</h2>
        {/* Wallet-dependent content */}
      </div>
    </WalletErrorBoundary>
  );
}

/**
 * Example 6: Nested Error Boundaries
 * 
 * Purpose: Multi-level error protection
 * Use case: Complex pages with multiple independent sections
 * 
 * Benefits:
 * - Error in one section doesn't crash the entire page
 * - Different sections can handle errors independently
 * - Better error isolation and recovery
 */
export function NestedErrorBoundariesExample() {
  return (
    <ErrorBoundary
      name="GamePage"
      level="page"
    >
      <div className="page">
        <header>
          <WalletErrorBoundary>
            <div>Wallet Status</div>
          </WalletErrorBoundary>
        </header>

        <main>
          <ErrorBoundary
            name="GameSection"
            level="section"
          >
            <div>Game Content</div>
          </ErrorBoundary>

          <ErrorBoundary
            name="StatsSection"
            level="section"
          >
            <AsyncErrorBoundary name="StatsFetch">
              <div>Game Statistics</div>
            </AsyncErrorBoundary>
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Example 7: Custom Error Handler
 * 
 * Purpose: Implement custom error handling logic
 * Use case: Analytics, custom recovery, error reporting
 */
export function CustomErrorHandlerExample() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to analytics
    logAnalytics({
      event: 'error_boundary_caught',
      error: error.message,
      component: 'CustomComponent',
    });

    // Send to error tracking service (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      sendToErrorTracking({
        error,
        errorInfo,
        userId: getCurrentUserId(),
        timestamp: new Date(),
      });
    }

    // Send notification to user
    showNotification({
      type: 'error',
      message: 'Something went wrong. Our team has been notified.',
    });

    // Trigger recovery action
    resetAppState();
  };

  return (
    <ErrorBoundary
      name="CriticalComponent"
      level="page"
      onError={handleError}
      fallback={(error, errorInfo, reset) => (
        <div className="error-recovery-screen">
          <h1>We're Sorry</h1>
          <p>Something unexpected happened. Please try refreshing the page.</p>
          <div className="actions">
            <button onClick={reset}>Try Again</button>
            <button onClick={() => location.href = '/'}>Go Home</button>
            <button onClick={() => location.reload()}>Refresh Page</button>
          </div>
        </div>
      )}
    >
      <div>{/* Critical component content */}</div>
    </ErrorBoundary>
  );
}

/**
 * Example 8: Development-specific Error Boundary
 * 
 * Purpose: Show detailed errors in development
 * Use case: Development/debugging of components
 */
export function DevelopmentErrorExample() {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <ErrorBoundary
      name="DebugComponent"
      level="component"
      showDetails={isDev}
      fallback={(error, errorInfo, reset) => (
        <div className="p-6 bg-red-50 border-2 border-red-400 rounded">
          <h3 className="font-bold text-red-900">Development Error</h3>
          
          {isDev && (
            <div className="mt-4 space-y-2">
              <div>
                <p className="text-sm font-semibold text-red-800">Error Message:</p>
                <code className="block bg-red-100 p-2 rounded text-xs mt-1">
                  {error.message}
                </code>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800">Stack Trace:</p>
                <pre className="bg-red-100 p-2 rounded text-xs mt-1 overflow-auto max-h-48">
                  {error.stack}
                </pre>
              </div>
              {errorInfo?.componentStack && (
                <div>
                  <p className="text-sm font-semibold text-red-800">Component Stack:</p>
                  <pre className="bg-red-100 p-2 rounded text-xs mt-1 overflow-auto max-h-48">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          <button
            onClick={reset}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
    >
      <div>{/* Component content */}</div>
    </ErrorBoundary>
  );
}

/**
 * Example 9: Conditional Error Boundaries
 * 
 * Purpose: Apply error boundaries conditionally
 * Use case: Different error handling based on app state
 */
export function ConditionalErrorBoundaryExample({
  isUserLoggedIn,
}: {
  isUserLoggedIn: boolean;
}) {
  if (!isUserLoggedIn) {
    return <div>Please log in</div>;
  }

  return (
    <ErrorBoundary
      name="UserContent"
      level="page"
      // Only enable detailed errors for premium users
      showDetails={isPremiumUser()}
    >
      <div>{/* User content */}</div>
    </ErrorBoundary>
  );
}

/**
 * Example 10: Error Boundary with Logging Callback
 * 
 * Purpose: Integrate with error logging system
 * Use case: Production monitoring and analytics
 */
export function LoggingErrorBoundaryExample() {
  return (
    <ErrorBoundary
      name="MonitoredComponent"
      level="component"
      enableLogging={true}
      onError={(error, errorInfo) => {
        // This is called in addition to ErrorLogger
        // Use it for custom analytics or notifications
        
        console.log('Custom handler - Error occurred:', error.message);

        // Could trigger additional actions like:
        // - Notifying user support
        // - Sending custom metrics
        // - Triggering recovery actions
      }}
    >
      <div>{/* Component content */}</div>
    </ErrorBoundary>
  );
}

// Placeholder functions for examples
function logAnalytics(data: any) { }
function sendToErrorTracking(data: any) { }
function showNotification(data: any) { }
function resetAppState() { }
function getCurrentUserId() { return 'user-123'; }
function isPremiumUser() { return false; }
