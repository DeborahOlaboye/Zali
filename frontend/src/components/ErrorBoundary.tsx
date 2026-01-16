'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Track error in analytics
    trackEvent(ANALYTICS_EVENTS.ERROR_OCCURRED, {
      error: error.message,
      componentStack: errorInfo.componentStack,
      context: 'global_error_boundary',
    });
    
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          <p className="font-bold">Something went wrong</p>
          {this.state.error?.message && (
            <p className="text-sm mt-1">{this.state.error.message}</p>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
