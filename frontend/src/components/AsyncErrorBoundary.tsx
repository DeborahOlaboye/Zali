'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '@/utils/errorLogger';
import ErrorBoundary from './ErrorBoundary';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error) => void;
  name?: string;
}

interface AsyncErrorBoundaryState {
  error: Error | null;
  isLoading: boolean;
}

/**
 * Error boundary specialized for async operations
 * Catches errors thrown during async operations and network requests
 */
export class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      isLoading: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AsyncErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, name } = this.props;

    errorLogger.logError(error, {
      component: `AsyncErrorBoundary (${name || 'unknown'})`,
      isAsync: true,
      componentStack: errorInfo.componentStack,
    }, 'warning');

    console.error(`AsyncErrorBoundary (${name}) caught an error:`, error);
    onError?.(error);
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  private handleLoadingStart = () => {
    this.setState({ isLoading: true });
  };

  private handleLoadingEnd = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { fallback, children, name } = this.props;
    const { error } = this.state;

    if (error) {
      if (fallback) {
        return fallback(error, this.handleReset);
      }

      return (
        <div className="p-4 bg-orange-50 border-l-4 border-orange-400 text-orange-700 rounded">
          <h3 className="font-semibold">Async Operation Failed</h3>
          <p className="text-sm mt-2">{error.message || 'An async operation failed'}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={this.handleReset}
              className="px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 rounded font-medium"
            >
              Try Again
            </button>
            {name && (
              <span className="text-xs text-orange-600 py-1">({name})</span>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

export default AsyncErrorBoundary;
