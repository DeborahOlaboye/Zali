'use client';

import { ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface WalletErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReconnect?: () => void;
}

export function WalletErrorBoundary({
  children,
  onError,
  onReconnect
}: WalletErrorBoundaryProps) {
  
  const getWalletErrorDetails = (error: Error) => {
    const message = error.message.toLowerCase();
    
    if (message.includes('no ethereum provider') || message.includes('no injected provider')) {
      return {
        title: 'Wallet Not Found',
        message: 'No wallet detected. Please install MetaMask or another Web3 wallet.',
        action: 'Install Wallet',
        actionUrl: 'https://metamask.io/download/',
        canReconnect: false
      };
    }
    
    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        title: 'Connection Rejected',
        message: 'Wallet connection was rejected. Please try connecting again.',
        action: 'Try Again',
        canReconnect: true
      };
    }
    
    if (message.includes('already pending') || message.includes('already processing')) {
      return {
        title: 'Connection Pending',
        message: 'A wallet connection is already in progress. Please check your wallet.',
        action: 'Check Wallet',
        canReconnect: false
      };
    }
    
    if (message.includes('unsupported chain') || message.includes('wrong network')) {
      return {
        title: 'Wrong Network',
        message: 'Please switch to the correct network in your wallet.',
        action: 'Switch Network',
        canReconnect: true
      };
    }
    
    if (message.includes('unauthorized') || message.includes('not authorized')) {
      return {
        title: 'Unauthorized',
        message: 'Wallet access is not authorized. Please reconnect your wallet.',
        action: 'Reconnect',
        canReconnect: true
      };
    }
    
    return {
      title: 'Wallet Connection Error',
      message: 'Failed to connect to wallet. Please try again.',
      action: 'Retry Connection',
      canReconnect: true
    };
  };

  return (
    <ErrorBoundary
      name="WalletErrorBoundary"
      level="component"
      onError={onError}
      fallback={(error, errorInfo, reset) => {
        const { title, message, action, actionUrl, canReconnect } = getWalletErrorDetails(error);
        
        return (
          <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-orange-800">
                  {title}
                </h3>
                <div className="mt-2 text-sm text-orange-700">
                  <p>{message}</p>
                </div>
                
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  {actionUrl ? (
                    <a
                      href={actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      {action}
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : canReconnect ? (
                    <button
                      type="button"
                      onClick={() => {
                        onReconnect?.();
                        reset();
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      {action}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={reset}
                      className="px-4 py-2 bg-orange-100 text-orange-800 rounded-md text-sm font-medium hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Dismiss
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={reset}
                    className="px-4 py-2 bg-white text-orange-800 border border-orange-300 rounded-md text-sm font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Close
                  </button>
                </div>
                
                <div className="mt-4 text-xs text-orange-600">
                  <p>💡 <strong>Tip:</strong> Make sure your wallet is unlocked and connected to the correct network.</p>
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