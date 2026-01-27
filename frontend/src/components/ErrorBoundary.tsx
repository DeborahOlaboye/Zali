'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree
 * 
 * Provides graceful error handling with customizable fallback UI, logging,
 * and recovery mechanisms. Supports different error boundary levels.
 * 
 * @component
 * @example
 * <ErrorBoundary level="page" name="HomePage">
 *   <Home />
 * </ErrorBoundary>
 * 
 * @example
 * // With custom fallback
 * <ErrorBoundary 
 *   fallback={(error, info, reset) => (
 *     <div>
 *       <p>Something went wrong: {error.message}</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 * >
 *   <Content />
 * </ErrorBoundary>
 */
interface ErrorBoundaryProps {
  /** Child components to protect with error boundary */
  children: ReactNode;
  
  /** Custom fallback UI to display on error. Receives error, errorInfo, and reset function */
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  
  /** Callback when an error is caught. Receives error and errorInfo */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /** Level of error boundary: 'page' | 'section' | 'component'. Affects recovery strategy */
  level?: 'page' | 'section' | 'component';
  
  /** Name of this error boundary for debugging/logging purposes */
  name?: string;
  
  /** Whether to log errors to console and analytics. Default: true */
  enableLogging?: boolean;
  
  /** Whether to show error details in development. Default: true */
  showDetails?: boolean;
  
  /** Whether to attempt automatic recovery after an error. Default: true */
  enableAutoRecovery?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
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
      const { fallback } = this.props;

      if (fallback) {
        return fallback(
          this.state.error!,
          this.state.errorInfo!,
          this.handleReset
        );
      }

      return this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
