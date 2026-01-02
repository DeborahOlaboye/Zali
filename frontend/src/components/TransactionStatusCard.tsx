'use client';

import { TransactionState } from '@/types/transaction';
import { getStepLabel, getTransactionMessage } from '@/utils/transactionStateManager';

interface TransactionStatusCardProps {
  state: TransactionState;
  title?: string;
  showDetails?: boolean;
  className?: string;
}

/**
 * Component for displaying detailed transaction status
 */
export function TransactionStatusCard({
  state,
  title = 'Transaction Status',
  showDetails = true,
  className = '',
}: TransactionStatusCardProps) {
  const getStatusIcon = () => {
    if (state.isSuccess) {
      return (
        <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (state.isError) {
      return (
        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (state.isLoading || state.isPending || state.isConfirming) {
      return (
        <svg className="h-6 w-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }
    return null;
  };

  const getStatusColor = () => {
    if (state.isSuccess) return 'bg-green-50 border-green-200 text-green-900';
    if (state.isError) return 'bg-red-50 border-red-200 text-red-900';
    if (state.isLoading || state.isPending || state.isConfirming) return 'bg-blue-50 border-blue-200 text-blue-900';
    return 'bg-gray-50 border-gray-200 text-gray-900';
  };

  return (
    <div className={`rounded-lg border p-4 ${getStatusColor()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-sm mt-1">{getTransactionMessage(state)}</p>

          {showDetails && state.step !== 'initial' && (
            <div className="mt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span>{getStepLabel(state.step)}</span>
              </div>

              {state.txHash && (
                <div className="flex justify-between">
                  <span className="font-medium">Hash:</span>
                  <span className="font-mono break-all">{state.txHash.slice(0, 10)}...</span>
                </div>
              )}

              {state.progress > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Progress:</span>
                  <span>{state.progress}%</span>
                </div>
              )}

              {state.confirmations > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Confirmations:</span>
                  <span>{state.confirmations}</span>
                </div>
              )}

              {state.transactionFee && (
                <div className="flex justify-between">
                  <span className="font-medium">Fee:</span>
                  <span>{state.transactionFee}</span>
                </div>
              )}
            </div>
          )}

          {state.isError && state.error && (
            <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
              <p className="font-mono">{state.error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionStatusCard;
