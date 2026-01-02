'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { LoadingButton } from './LoadingButton';

/**
 * RetryableOperation Props
 */
export interface RetryableOperationProps<T> {
  operation: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  maxRetries?: number;
  retryDelay?: number;
  children: (state: RetryState<T>) => ReactNode;
  autoRetry?: boolean;
}

/**
 * Retry state
 */
export interface RetryState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  retryCount: number;
  retry: () => Promise<void>;
  reset: () => void;
}

/**
 * RetryableOperation component for operations with retry capability
 */
export function RetryableOperation<T>({
  operation,
  onSuccess,
  onError,
  maxRetries = 3,
  retryDelay = 1000,
  children,
  autoRetry = false,
}: RetryableOperationProps<T>) {
  const [state, setState] = useState<Omit<RetryState<T>, 'retry' | 'reset'>>({
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    retryCount: 0,
  });

  const executeOperation = async (isRetry = false) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
      retryCount: isRetry ? prev.retryCount + 1 : 0,
    }));

    try {
      const data = await operation();

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      }));

      onSuccess?.(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Operation failed');

      // Auto retry if enabled and within limit
      if (autoRetry && state.retryCount < maxRetries) {
        setTimeout(() => executeOperation(true), retryDelay);
        return;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: err,
      }));

      onError?.(err);
    }
  };

  const retry = async () => {
    if (state.retryCount >= maxRetries) {
      return;
    }
    await executeOperation(true);
  };

  const reset = () => {
    setState({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      retryCount: 0,
    });
  };

  return <>{children({ ...state, retry, reset })}</>;
}

/**
 * Default retry UI component
 */
export function RetryUI({
  error,
  onRetry,
  retryCount,
  maxRetries,
  isLoading,
}: {
  error: Error | null;
  onRetry: () => void;
  retryCount: number;
  maxRetries: number;
  isLoading: boolean;
}) {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
    >
      <div className="text-red-600 font-semibold mb-2">Operation Failed</div>
      <div className="text-gray-600 text-sm mb-4">{error.message}</div>

      {retryCount < maxRetries && (
        <div className="space-y-2">
          <div className="text-sm text-gray-500">
            Retry attempt {retryCount} of {maxRetries}
          </div>
          <LoadingButton
            onClick={onRetry}
            isLoading={isLoading}
            variant="primary"
            size="md"
          >
            Retry Operation
          </LoadingButton>
        </div>
      )}

      {retryCount >= maxRetries && (
        <div className="text-sm text-gray-500">
          Maximum retry attempts reached. Please try again later.
        </div>
      )}
    </motion.div>
  );
}
