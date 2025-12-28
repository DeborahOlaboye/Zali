'use client';

import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface WalletErrorBoundaryProps {
  children: ReactNode;
}

export function WalletErrorBoundary({ children }: WalletErrorBoundaryProps) {
  return (
    <ErrorBoundary
      name="WalletErrorBoundary"
      level="section"
      fallback={(error, errorInfo, reset) => (
        <div className="p-6 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Wallet Connection Error</h3>
              <p className="text-sm mt-2">
                We couldn't connect to your wallet. Please try again or use a different wallet.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded-md text-sm font-medium hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                >
                  Reload Page
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-3 text-xs">
                  <summary className="cursor-pointer">Error Details</summary>
                  <pre className="mt-2 p-2 bg-yellow-100 rounded overflow-auto text-yellow-900">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export default WalletErrorBoundary;
