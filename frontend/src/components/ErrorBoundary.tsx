'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '@/utils/errorLogger';
import { analyzeError, getErrorMessage, isRecoverableError } from '@/utils/errorAnalyzer';
import { ErrorSeverity } from '@/types/errorBoundary';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  name?: string;
  enableLogging?: boolean;
  showDetails?: boolean;
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
    const { onError, enableLogging = true, name, level = 'component' } = this.props;

    // Update state with error info and increment count
    this.setState(prev => ({
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    // Log the error
    if (enableLogging) {
      const severity = this.determineSeverity(error);
      errorLogger.logError(error, {
        component: name,
        level,
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        recoverable: isRecoverableError(error),
      }, severity);
    }

    // Call the onError handler if provided
    onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`ErrorBoundary (${name || level}) caught an error:`, error);
      console.error('Error Info:', errorInfo);
    }
  }

  componentWillUnmount() {
    // Clean up timeout
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  private determineSeverity(error: Error): ErrorSeverity {
    const analysis = analyzeError(error);
    return analysis.severity;
  }

  private handleReset = () => {
    // Clear any pending reset timeouts
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleAutoReset = () => {
    // Auto-reset after 5 seconds if error count is low
    if (this.state.errorCount < 3) {
      this.resetTimeout = setTimeout(() => {
        this.handleReset();
      }, 5000);
    }
  };

  private renderDefaultFallback = () => {
    const { error, errorInfo, errorCount } = this.state;
    const { name, showDetails } = this.props;
    const analysis = analyzeError(error);
    const userMessage = getErrorMessage(error);
    const isRecoverable = isRecoverableError(error);

    return (
      <div className={`p-6 rounded-lg border-l-4 ${this.getSeverityStyles(analysis.severity)}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {this.getSeverityIcon(analysis.severity)}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium">
              {analysis.severity === 'critical' ? 'Something went wrong' : 'We encountered an issue'}
            </h3>
            <p className="text-sm mt-2">{userMessage}</p>

            {showDetails && error && (
              <details className="mt-4 text-xs">
                <summary className="cursor-pointer font-medium">Details</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                  {error.message}
                  {errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:\n'}
                      {errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="mt-4 flex gap-2">
              {isRecoverable && (
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Home
              </button>
            </div>

            {errorCount > 2 && (
              <p className="text-xs text-yellow-600 mt-3">
                Multiple errors detected. Try refreshing the page.
              </p>
            )}

            {name && (
              <p className="text-xs text-gray-500 mt-3">
                Error in: <code className="bg-gray-100 px-1 rounded">{name}</code>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  private getSeverityStyles(severity: ErrorSeverity): string {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-400 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-700';
      case 'info':
        return 'bg-blue-50 border-blue-400 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-700';
    }
  }

  private getSeverityIcon(severity: ErrorSeverity): ReactNode {
    switch (severity) {
      case 'critical':
        return (
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        );
    }
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
