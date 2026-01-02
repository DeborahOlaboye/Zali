import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Async operation state
 */
export interface AsyncOperationState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  progress?: number;
}

/**
 * Async operation options
 */
export interface AsyncOperationOptions {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

/**
 * Hook for managing async operations with loading states, retries, and timeout
 */
export function useAsyncOperation<T = any>(
  options: AsyncOperationOptions = {}
) {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 30000,
    onSuccess,
    onError,
    onProgress,
  } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    progress: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retriesRef = useRef<number>(0);

  /**
   * Execute async operation with retry logic and timeout
   */
  const execute = useCallback(
    async (operation: () => Promise<T>) => {
      // Reset state
      setState({
        data: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
        progress: 0,
      });

      // Create abort controller
      abortControllerRef.current = new AbortController();
      retriesRef.current = 0;

      const attemptOperation = async (): Promise<T> => {
        try {
          // Set timeout
          const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutRef.current = setTimeout(() => {
              abortControllerRef.current?.abort();
              reject(new Error(`Operation timed out after ${timeout}ms`));
            }, timeout);
          });

          // Execute operation
          const operationPromise = operation();

          // Race between operation and timeout
          const result = await Promise.race([operationPromise, timeoutPromise]);

          // Clear timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          // Update state
          setState({
            data: result,
            isLoading: false,
            isSuccess: true,
            isError: false,
            error: null,
            progress: 100,
          });

          // Call success callback
          onSuccess?.(result);
          onProgress?.(100);

          return result;
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Operation failed');

          // Check if we should retry
          if (retriesRef.current < retries && !abortControllerRef.current?.signal.aborted) {
            retriesRef.current++;

            // Update progress
            const progress = (retriesRef.current / (retries + 1)) * 50;
            setState(prev => ({ ...prev, progress }));
            onProgress?.(progress);

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, retryDelay));

            // Retry
            return attemptOperation();
          }

          // Update state with error
          setState({
            data: null,
            isLoading: false,
            isSuccess: false,
            isError: true,
            error: err,
            progress: 0,
          });

          // Call error callback
          onError?.(err);

          throw err;
        }
      };

      return attemptOperation();
    },
    [retries, retryDelay, timeout, onSuccess, onError, onProgress]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      progress: 0,
    });
    retriesRef.current = 0;
  }, []);

  /**
   * Abort operation
   */
  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: new Error('Operation aborted'),
      isError: true,
    }));
  }, []);

  /**
   * Update progress manually
   */
  const updateProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
    onProgress?.(progress);
  }, [onProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    abort,
    updateProgress,
    isIdle: !state.isLoading && !state.isSuccess && !state.isError,
    retryCount: retriesRef.current,
  };
}
