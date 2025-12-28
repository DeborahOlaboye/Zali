'use client';

import { TransactionState } from '@/types/transaction';
import { getStepLabel, getPhaseLabel } from '@/utils/transactionStateManager';

interface TransactionProgressBarProps {
  state: TransactionState;
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
  height?: string;
}

/**
 * Component for displaying transaction progress
 */
export function TransactionProgressBar({
  state,
  showLabel = true,
  showPercentage = true,
  animated = true,
  className = '',
  height = 'h-2',
}: TransactionProgressBarProps) {
  const getProgressColor = () => {
    if (state.isSuccess) return 'bg-green-500';
    if (state.isError) return 'bg-red-500';
    if (state.isConfirming) return 'bg-blue-500';
    if (state.isPending) return 'bg-amber-500';
    return 'bg-gray-300';
  };

  const getBackgroundColor = () => {
    if (state.isSuccess) return 'bg-green-100';
    if (state.isError) return 'bg-red-100';
    if (state.isConfirming) return 'bg-blue-100';
    if (state.isPending) return 'bg-amber-100';
    return 'bg-gray-100';
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {getPhaseLabel(state.phase)}
            </span>
            <span className="text-xs text-gray-500">
              {getStepLabel(state.step)}
            </span>
          </div>
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-700">
              {state.progress}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full ${height} ${getBackgroundColor()} rounded-full overflow-hidden ${
          animated ? 'transition-all duration-500' : ''
        }`}
      >
        <div
          className={`${height} ${getProgressColor()} rounded-full ${
            animated ? 'transition-all duration-500' : ''
          }`}
          style={{ width: `${Math.max(state.progress, 5)}%` }}
        />
      </div>
    </div>
  );
}

export default TransactionProgressBar;
