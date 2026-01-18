'use client';

import { ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { isAddress } from '@/utils/typeGuards';

interface TokenTransferErrorBoundaryProps {
  children: ReactNode;
  tokenSymbol?: string;
  recipientAddress?: string;
  amount?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
}

export function TokenTransferErrorBoundary({
  children,
  tokenSymbol = 'Token',
  recipientAddress,
  amount,
  onError,
  onRetry
}: TokenTransferErrorBoundaryProps) {
  
  const getErrorMessage = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return `Insufficient ${tokenSymbol} balance for this transfer.`;
    }
    
    if (message.includes('user rejected') || message.includes('user denied')) {
      return 'Transaction was cancelled by user.';
    }
    
    if (message.includes('gas') && message.includes('limit')) {
      return 'Transaction failed due to gas limit. Try increasing gas limit.';
    }
    
    if (message.includes('nonce')) {
      return 'Transaction nonce error. Please try again.';
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return 'Network connection error. Please check your connection and try again.';
    }
    
    if (message.includes('allowance') || message.includes('approval')) {
      return `Please approve ${tokenSymbol} spending first.`;
    }
    
    return `Failed to transfer ${tokenSymbol}. Please try again.`;
  };

  return (
    <ErrorBoundary
      name="TokenTransferErrorBoundary"
      level="component"
      onError={onError}
      fallback={(error, errorInfo, reset) => {
        const errorMessage = getErrorMessage(error);
        const isUserRejection = error.message.toLowerCase().includes('user rejected');
        
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Transfer Failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage}</p>
                  
                  {amount && recipientAddress && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-xs">
                      <p><strong>Amount:</strong> {amount} {tokenSymbol}</p>
                      {isAddress(recipientAddress) && (
                        <p><strong>To:</strong> {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  {!isUserRejection && (
                    <button
                      type="button"
                      onClick={() => {
                        onRetry?.();
                        reset();
                      }}
                      className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Retry Transfer
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={reset}
                    className="bg-white px-3 py-2 rounded-md text-sm font-medium text-red-800 border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {isUserRejection ? 'Try Again' : 'Cancel'}
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