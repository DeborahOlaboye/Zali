import { useState, useCallback, useRef } from 'react';
import { clearCache } from './useAsyncData';

/**
 * Mutation state
 */
export interface MutationState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Mutation options
 */
export interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void;
  invalidateQueries?: string[];
  optimisticUpdate?: (variables: TVariables) => TData;
  rollbackOnError?: boolean;
}

/**
 * Hook for async mutations with optimistic updates and cache invalidation
 */
export function useAsyncMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {}
) {
  const {
    onSuccess,
    onError,
    onSettled,
    invalidateQueries = [],
    optimisticUpdate,
    rollbackOnError = true,
  } = options;

  const [state, setState] = useState<MutationState<TData>>({
    data: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const previousDataRef = useRef<TData | null>(null);

  /**
   * Execute mutation
   */
  const mutate = useCallback(
    async (variables: TVariables) => {
      // Apply optimistic update
      if (optimisticUpdate) {
        const optimisticData = optimisticUpdate(variables);
        previousDataRef.current = state.data;
        setState(prev => ({
          ...prev,
          data: optimisticData,
        }));
      }

      // Update loading state
      setState(prev => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      try {
        // Execute mutation
        const data = await mutationFn(variables);

        // Update state with result
        setState({
          data,
          isLoading: false,
          isSuccess: true,
          isError: false,
          error: null,
        });

        // Invalidate queries
        if (invalidateQueries.length > 0) {
          invalidateQueries.forEach(cacheKey => {
            clearCache(cacheKey);
          });
        }

        // Call success callback
        await onSuccess?.(data, variables);

        // Call settled callback
        onSettled?.(data, null, variables);

        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Mutation failed');

        // Rollback optimistic update
        if (rollbackOnError && optimisticUpdate) {
          setState(prev => ({
            ...prev,
            data: previousDataRef.current,
          }));
        }

        // Update state with error
        setState(prev => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: err,
          isSuccess: false,
        }));

        // Call error callback
        onError?.(err, variables);

        // Call settled callback
        onSettled?.(null, err, variables);

        throw err;
      }
    },
    [mutationFn, onSuccess, onError, onSettled, invalidateQueries, optimisticUpdate, rollbackOnError, state.data]
  );

  /**
   * Execute mutation asynchronously without waiting
   */
  const mutateAsync = useCallback(
    (variables: TVariables) => {
      return mutate(variables);
    },
    [mutate]
  );

  /**
   * Reset mutation state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
    previousDataRef.current = null;
  }, []);

  return {
    ...state,
    mutate,
    mutateAsync,
    reset,
    isIdle: !state.isLoading && !state.isSuccess && !state.isError,
  };
}
