'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  TransactionState,
  UseTransactionLoadingReturn,
  TransactionLoadingConfig,
} from '@/types/transaction';
import {
  createInitialTransactionState,
  updateToPending,
  updateToSigning,
  updateToSubmitted,
  updateToMining,
  updateToConfirming,
  updateWithConfirmation,
  updateToSuccess,
  updateToFailed,
  resetTransactionState,
  getTransactionMessage,
} from '@/utils/transactionStateManager';

/**
 * Hook for managing transaction loading states and progress
 */
export function useTransactionLoading(
  config: TransactionLoadingConfig = {}
): UseTransactionLoadingReturn {
  const {
    enableProgressTracking = true,
    enableRetry = true,
    maxRetries = 3,
    retryDelay = 1000,
    updateInterval = 1000,
  } = config;

  const [state, setState] = useState<TransactionState>(createInitialTransactionState());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  /**
   * Start transaction loading
   */
  const startLoading = useCallback(() => {
    setState(prev => updateToPending(prev));
    retryCountRef.current = 0;
  }, []);

  /**
   * Update to signing state
   */
  const updateSigning = useCallback(() => {
    setState(prev => updateToSigning(prev));
  }, []);

  /**
   * Update to submitted state with tx hash
   */
  const updateSubmitted = useCallback((txHash: string, from?: string) => {
    setState(prev => updateToSubmitted(prev, txHash, from));
  }, []);

  /**
   * Update to mining state
   */
  const updateMining = useCallback(() => {
    setState(prev => updateToMining(prev));
  }, []);

  /**
   * Update to confirming state
   */
  const updateConfirming = useCallback(() => {
    setState(prev => updateToConfirming(prev));
  }, []);

  /**
   * Update with confirmation data
   */
  const updateConfirmation = useCallback(
    (blockNumber: number, confirmations: number) => {
      setState(prev => updateWithConfirmation(prev, blockNumber, confirmations));
    },
    []
  );

  /**
   * Mark transaction as success
   */
  const markSuccess = useCallback(() => {
    setState(prev => updateToSuccess(prev));
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, []);

  /**
   * Mark transaction as failed
   */
  const markFailed = useCallback((error: Error) => {
    setState(prev => updateToFailed(prev, error));
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, []);

  /**
   * Reset transaction state
   */
  const reset = useCallback(() => {
    setState(createInitialTransactionState());
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    retryCountRef.current = 0;
  }, []);

  /**
   * Start automatic progress tracking
   */
  useEffect(() => {
    if (!enableProgressTracking || !state.isPending) return;

    progressIntervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.isSuccess || prev.isError) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return prev;
        }

        // Gradually increase progress for pending transactions
        const newProgress = Math.min(prev.progress + 5, 95);
        return { ...prev, progress: newProgress };
      });
    }, updateInterval);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [enableProgressTracking, state.isPending, updateInterval]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return {
    state,
    isLoading: state.isLoading,
    isPending: state.isPending,
    isConfirming: state.isConfirming,
    isSuccess: state.isSuccess,
    isError: state.isError,
    error: state.error,
    progress: state.progress,
    phase: state.phase,
    step: state.step,
    txHash: state.txHash,
    reset,
  };
}

/**
 * Hook for managing multiple transaction operations
 */
export function useTransactionManager() {
  const [transactions, setTransactions] = useState<Map<string, TransactionState>>(new Map());

  const addTransaction = useCallback(
    (id: string, initialState: Partial<TransactionState> = {}) => {
      setTransactions(prev => {
        const newMap = new Map(prev);
        newMap.set(id, {
          ...createInitialTransactionState(),
          ...initialState,
        });
        return newMap;
      });
    },
    []
  );

  const updateTransaction = useCallback(
    (id: string, updater: (state: TransactionState) => TransactionState) => {
      setTransactions(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(id);
        if (current) {
          newMap.set(id, updater(current));
        }
        return newMap;
      });
    },
    []
  );

  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const clearTransactions = useCallback(() => {
    setTransactions(new Map());
  }, []);

  const getTransaction = useCallback(
    (id: string) => transactions.get(id),
    [transactions]
  );

  const getAllTransactions = useCallback(
    () => Array.from(transactions.values()),
    [transactions]
  );

  return {
    transactions: Array.from(transactions.entries()).map(([id, state]) => ({
      id,
      ...state,
    })),
    addTransaction,
    updateTransaction,
    removeTransaction,
    clearTransactions,
    getTransaction,
    getAllTransactions,
  };
}
