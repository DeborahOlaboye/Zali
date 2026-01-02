'use client';

import { ReactNode, ErrorInfo } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from './ErrorBoundary';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  routeName?: string;
}

export function RouteErrorBoundary({ 
  children, 
  fallback,
  onError,
  routeName 
}: RouteErrorBoundaryProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <ErrorBoundary
      name={`RouteErrorBoundary${routeName ? ` (${routeName})` : ''}`}
      level="page"
      onError={onError}
      showDetails={process.env.NODE_ENV === 'development'}
      fallback={(error, errorInfo, reset) => {
        if (fallback) {
          return fallback(error, reset);
        }

        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Oops! Something went wrong
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {routeName ? `Error on ${routeName} page` : 'Page error occurred'}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {error.message || 'An unexpected error occurred while loading this page.'}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
                
                <button
                  onClick={handleRefresh}
                  className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Refresh Page
                </button>

                <div className="flex space-x-3">
                  <button
                    onClick={handleGoBack}
                    className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go Home
                  </button>
                </div>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto max-h-40 text-xs">
                    {error.stack}
                    {errorInfo?.componentStack && (
                      <>
                        {'\n\nComponent Stack:\n'}
                        {errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}