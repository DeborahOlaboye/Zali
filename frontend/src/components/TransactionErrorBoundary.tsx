'use client';

import { ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface TransactionErrorBoundaryProps {
  children: ReactNode;
  transactionType?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
}

export function TransactionErrorBoundary({
  children,
  transactionType = 'Transaction',
  onError,
  onRetry
}: TransactionErrorBoundaryProps) {
  
  const getErrorDetails = (error: Error) => {
    const message = error.message.toLowerCase();
    
    if (message.includes('insufficient funds')) {
      return {
        title: 'Insufficient Funds',
        message: 'You don\'t have enough ETH to complete this transaction.',
        severity: 'error' as const,
        canRetry: false
      };
    }
    
    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        title: 'Transaction Cancelled',
        message: 'You cancelled the transaction in your wallet.',
        severity: 'warning' as const,
        canRetry: true
      };
    }
    
    if (message.includes('gas')) {
      return {
        title: 'Gas Error',
        message: 'Transaction failed due to gas issues. Try adjusting gas settings.',
        severity: 'error' as const,
        canRetry: true
      };
    }
    
    if (message.includes('nonce')) {
      return {
        title: 'Nonce Error',
        message: 'Transaction nonce conflict. Please try again.',
        severity: 'warning' as const,
        canRetry: true
      };
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return {
        title: 'Network Error',
        message: 'Network connection failed. Check your connection and try again.',
        severity: 'warning' as const,
        canRetry: true
      };
    }
    
    if (message.includes('reverted')) {
      return {
        title: 'Transaction Reverted',
        message: 'The smart contract rejected this transaction.',
        severity: 'error' as const,
        canRetry: false
      };
    }
    
    return {
      title: 'Transaction Failed',
      message: `${transactionType} could not be completed. Please try again.`,
      severity: 'error' as const,
      canRetry: true
    };
  };

  return (
    <ErrorBoundary
      name="TransactionErrorBoundary"
      level="component"
      onError={onError}
      fallback={(error, errorInfo, reset) => {
        const { title, message, severity, canRetry } = getErrorDetails(error);
        
        const severityStyles = {
          error: 'bg-red-50 border-red-200 text-red-800',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          info: 'bg-blue-50 border-blue-200 text-blue-800'
        };
        
        const iconColor = {
          error: 'text-red-400',
          warning: 'text-yellow-400',
          info: 'text-blue-400'
        };
        
        return (
          <div className={`p-4 border rounded-lg ${severityStyles[severity]}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className={`h-5 w-5 ${iconColor[severity]}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  {severity === 'error' ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium">
                  {title}
                </h3>
                <div className="mt-2 text-sm">
                  <p>{message}</p>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  {canRetry && (
                    <button
                      type="button"
                      onClick={() => {
                        onRetry?.();
                        reset();
                      }}
                      className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        severity === 'error' 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500'
                      }`}
                    >
                      Retry {transactionType}
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={reset}
                    className={`px-3 py-2 rounded-md text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      severity === 'error'
                        ? 'bg-white text-red-800 border-red-300 hover:bg-red-50 focus:ring-red-500'
                        : 'bg-white text-yellow-800 border-yellow-300 hover:bg-yellow-50 focus:ring-yellow-500'
                    }`}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}