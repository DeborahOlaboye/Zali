import { useState, useCallback, useRef } from 'react';

/**
 * Batch operation state
 */
export interface BatchOperationState<T> {
  results: (T | null)[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errors: (Error | null)[];
  completedCount: number;
  totalCount: number;
  progress: number;
}

/**
 * Batch operation options
 */
export interface BatchOperationOptions {
  concurrent?: number;
  stopOnError?: boolean;
  onProgress?: (progress: number) => void;
  onItemComplete?: (index: number, result: any) => void;
  onItemError?: (index: number, error: Error) => void;
}

/**
 * Hook for executing multiple async operations in batch with progress tracking
 */
export function useAsyncBatch<T = any>(options: BatchOperationOptions = {}) {
  const {
    concurrent = 3,
    stopOnError = false,
    onProgress,
    onItemComplete,
    onItemError,
  } = options;

  const [state, setState] = useState<BatchOperationState<T>>({
    results: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    errors: [],
    completedCount: 0,
    totalCount: 0,
    progress: 0,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Execute batch operations
   */
  const executeBatch = useCallback(
    async (operations: (() => Promise<T>)[]) => {
      const totalCount = operations.length;

      // Reset state
      setState({
        results: new Array(totalCount).fill(null),
        isLoading: true,
        isSuccess: false,
        isError: false,
        errors: new Array(totalCount).fill(null),
        completedCount: 0,
        totalCount,
        progress: 0,
      });

      // Create abort controller
      abortControllerRef.current = new AbortController();

      const results: (T | null)[] = new Array(totalCount).fill(null);
      const errors: (Error | null)[] = new Array(totalCount).fill(null);
      let completedCount = 0;
      let hasError = false;

      /**
       * Execute single operation
       */
      const executeOperation = async (index: number) => {
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        try {
          const result = await operations[index]();
          results[index] = result;
          completedCount++;

          // Update state
          const progress = (completedCount / totalCount) * 100;
          setState(prev => ({
            ...prev,
            results: [...results],
            completedCount,
            progress,
          }));

          onItemComplete?.(index, result);
          onProgress?.(progress);
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Operation failed');
          errors[index] = err;
          completedCount++;
          hasError = true;

          // Update state
          const progress = (completedCount / totalCount) * 100;
          setState(prev => ({
            ...prev,
            errors: [...errors],
            completedCount,
            progress,
            isError: true,
          }));

          onItemError?.(index, err);
          onProgress?.(progress);

          if (stopOnError) {
            abortControllerRef.current?.abort();
          }
        }
      };

      /**
       * Execute operations with concurrency control
       */
      const queue = operations.map((_, index) => index);
      const executing: Promise<void>[] = [];

      while (queue.length > 0 || executing.length > 0) {
        // Check if aborted
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        // Start new operations up to concurrent limit
        while (queue.length > 0 && executing.length < concurrent) {
          const index = queue.shift()!;
          const promise = executeOperation(index).then(() => {
            executing.splice(executing.indexOf(promise), 1);
          });
          executing.push(promise);
        }

        // Wait for at least one operation to complete
        if (executing.length > 0) {
          await Promise.race(executing);
        }
      }

      // Wait for all remaining operations to complete
      await Promise.all(executing);

      // Update final state
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: !hasError && completedCount === totalCount,
        progress: 100,
      }));

      return { results, errors };
    },
    [concurrent, stopOnError, onProgress, onItemComplete, onItemError]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      results: [],
      isLoading: false,
      isSuccess: false,
      isError: false,
      errors: [],
      completedCount: 0,
      totalCount: 0,
      progress: 0,
    });
  }, []);

  /**
   * Abort all operations
   */
  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    setState(prev => ({
      ...prev,
      isLoading: false,
      isError: true,
    }));
  }, []);

  return {
    ...state,
    executeBatch,
    reset,
    abort,
    isIdle: !state.isLoading && !state.isSuccess && !state.isError,
  };
}
