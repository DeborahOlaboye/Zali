'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  name?: string;
  enableLogging?: boolean;
  showDetails?: boolean;
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
