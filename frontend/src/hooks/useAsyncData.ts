import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Cache entry
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Global cache
 */
const globalCache = new Map<string, CacheEntry<any>>();

/**
 * Async data state
 */
export interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isFetching: boolean;
  isStale: boolean;
  error: Error | null;
  lastFetchedAt: number | null;
}

/**
 * Async data options
 */
export interface AsyncDataOptions<T> {
  cacheKey?: string;
  cacheTime?: number;
  staleTime?: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retry?: number;
  retryDelay?: number;
}

/**
 * Hook for fetching data with caching and auto-refetch
 */
export function useAsyncData<T = any>(
  fetcher: () => Promise<T>,
  options: AsyncDataOptions<T> = {}
) {
  const {
    cacheKey,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 0,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    enabled = true,
    onSuccess,
    onError,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<AsyncDataState<T>>(() => {
    // Check cache on mount
    if (cacheKey) {
      const cached = globalCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        const isStale = Date.now() - cached.timestamp > staleTime;
        return {
          data: cached.data,
          isLoading: false,
          isSuccess: true,
          isError: false,
          isFetching: false,
          isStale,
          error: null,
          lastFetchedAt: cached.timestamp,
        };
      }
    }

    return {
      data: null,
      isLoading: enabled,
      isSuccess: false,
      isError: false,
      isFetching: enabled,
      isStale: false,
      error: null,
      lastFetchedAt: null,
    };
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const refetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch data
   */
  const fetchData = useCallback(
    async (isRefetch = false) => {
      if (!enabled) return;

      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Update state
      setState(prev => ({
        ...prev,
        isLoading: !isRefetch,
        isFetching: true,
        isError: false,
        error: null,
      }));

      const attemptFetch = async (): Promise<T> => {
        try {
          const data = await fetcher();

          // Update cache
          if (cacheKey) {
            globalCache.set(cacheKey, {
              data,
              timestamp: Date.now(),
              expiresAt: Date.now() + cacheTime,
            });
          }

          // Update state
          setState({
            data,
            isLoading: false,
            isSuccess: true,
            isError: false,
            isFetching: false,
            isStale: false,
            error: null,
            lastFetchedAt: Date.now(),
          });

          // Reset retry count
          retryCountRef.current = 0;

          // Call success callback
          onSuccess?.(data);

          return data;
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Fetch failed');

          // Retry logic
          if (retryCountRef.current < retry && !abortControllerRef.current?.signal.aborted) {
            retryCountRef.current++;
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return attemptFetch();
          }

          // Update state with error
          setState(prev => ({
            ...prev,
            isLoading: false,
            isFetching: false,
            isError: true,
            error: err,
          }));

          // Call error callback
          onError?.(err);

          throw err;
        }
      };

      return attemptFetch();
    },
    [enabled, fetcher, cacheKey, cacheTime, retry, retryDelay, onSuccess, onError]
  );

  /**
   * Refetch data
   */
  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  /**
   * Invalidate cache
   */
  const invalidate = useCallback(() => {
    if (cacheKey) {
      globalCache.delete(cacheKey);
    }
    setState(prev => ({ ...prev, isStale: true }));
  }, [cacheKey]);

  /**
   * Mutate data optimistically
   */
  const mutate = useCallback((updater: (oldData: T | null) => T) => {
    setState(prev => {
      const newData = updater(prev.data);

      // Update cache
      if (cacheKey) {
        globalCache.set(cacheKey, {
          data: newData,
          timestamp: Date.now(),
          expiresAt: Date.now() + cacheTime,
        });
      }

      return {
        ...prev,
        data: newData,
      };
    });
  }, [cacheKey, cacheTime]);

  // Initial fetch
  useEffect(() => {
    if (enabled && refetchOnMount && state.isLoading) {
      fetchData();
    }
  }, [enabled, refetchOnMount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      if (state.data && Date.now() - (state.lastFetchedAt || 0) > staleTime) {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, enabled, state.data, state.lastFetchedAt, staleTime, refetch]);

  // Refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    refetchIntervalRef.current = setInterval(() => {
      refetch();
    }, refetchInterval);

    return () => {
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, [refetchInterval, enabled, refetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    invalidate,
    mutate,
    isIdle: !state.isLoading && !state.isSuccess && !state.isError,
  };
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  globalCache.clear();
}

/**
 * Clear cache by key
 */
export function clearCache(key: string) {
  globalCache.delete(key);
}

/**
 * Get cache size
 */
export function getCacheSize() {
  return globalCache.size;
}
