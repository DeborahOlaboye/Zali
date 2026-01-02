'use client';

import { TransactionState } from '@/types/transaction';
import { getStepLabel } from '@/utils/transactionStateManager';

interface TransactionLoadingOverlayProps {
  state: TransactionState;
  message?: string;
  showProgress?: boolean;
  blurred?: boolean;
  onCancel?: () => void;
}

/**
 * Full-screen overlay for transaction loading states
 */
export function TransactionLoadingOverlay({
  state,
  message,
  showProgress = true,
  blurred = true,
  onCancel,
}: TransactionLoadingOverlayProps) {
  if (!state.isLoading && !state.isPending && !state.isConfirming) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${blurred ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/40'}`}
        onClick={onCancel}
      />

      {/* Loading content */}
      <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Spinner */}
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          {/* Message */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {message || getStepLabel(state.step)}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {state.isConfirming ? 'Waiting for confirmations...' : 'Please wait...'}
          </p>

          {/* Progress bar */}
          {showProgress && (
            <div className="mb-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(state.progress, 10)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{state.progress}% complete</p>
            </div>
          )}

          {/* Transaction hash */}
          {state.txHash && (
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <p className="text-xs text-gray-600 mb-1">Transaction Hash</p>
              <p className="text-xs font-mono text-gray-800 break-all">{state.txHash}</p>
            </div>
          )}

          {/* Cancel button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionLoadingOverlay;
