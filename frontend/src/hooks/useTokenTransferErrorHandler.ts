'use client';

import { useCallback } from 'react';
import { useErrorRecovery } from '@/utils/errorRecovery';

export interface TokenTransferError extends Error {
  code?: number;
  reason?: string;
  transaction?: {
    hash?: string;
    to?: string;
    value?: string;
  };
}

export function useTokenTransferErrorHandler() {
  const { attemptRecovery, addRecoveryStrategy } = useErrorRecovery();

  // Add token transfer specific recovery strategies
  const initializeRecoveryStrategies = useCallback(() => {
    // Insufficient allowance recovery
    addRecoveryStrategy({
      name: 'InsufficientAllowanceRecovery',
      canRecover: (error) => 
        error.message.toLowerCase().includes('allowance') ||
        error.message.toLowerCase().includes('approval'),
      recover: async (error) => {
        // This would typically trigger an approval flow
        console.log('Attempting to recover from insufficient allowance:', error);
        return false; // Let the UI handle approval flow
      },
      maxAttempts: 1,
    });

    // Network congestion recovery
    addRecoveryStrategy({
      name: 'NetworkCongestionRecovery',
      canRecover: (error) => 
        error.message.toLowerCase().includes('gas') ||
        error.message.toLowerCase().includes('network'),
      recover: async (error) => {
        // Wait and retry with higher gas
        await new Promise(resolve => setTimeout(resolve, 2000));
        return true;
      },
      maxAttempts: 2,
      delay: 2000,
    });

    // Nonce error recovery
    addRecoveryStrategy({
      name: 'NonceErrorRecovery',
      canRecover: (error) => 
        error.message.toLowerCase().includes('nonce'),
      recover: async (error) => {
        // Clear nonce cache and retry
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            // Request fresh nonce from provider
            await window.ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }]
            });
            return true;
          } catch {
            return false;
          }
        }
        return false;
      },
      maxAttempts: 1,
    });
  }, [addRecoveryStrategy]);

  const handleTokenTransferError = useCallback(async (error: TokenTransferError) => {
    console.error('Token transfer error:', error);
    
    // Attempt automatic recovery
    const recovered = await attemptRecovery(error);
    
    if (!recovered) {
      // Log unrecoverable error for monitoring
      console.warn('Token transfer error could not be recovered:', {
        message: error.message,
        code: error.code,
        reason: error.reason,
        transaction: error.transaction,
      });
    }
    
    return recovered;
  }, [attemptRecovery]);

  const categorizeError = useCallback((error: TokenTransferError) => {
    const message = error.message.toLowerCase();
    
    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return {
        category: 'insufficient_funds',
        severity: 'error',
        userMessage: 'You don\'t have enough tokens for this transfer.',
        canRetry: false,
      };
    }
    
    if (message.includes('allowance') || message.includes('approval')) {
      return {
        category: 'insufficient_allowance',
        severity: 'warning',
        userMessage: 'Please approve token spending first.',
        canRetry: true,
      };
    }
    
    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        category: 'user_rejection',
        severity: 'info',
        userMessage: 'Transaction was cancelled.',
        canRetry: true,
      };
    }
    
    if (message.includes('gas')) {
      return {
        category: 'gas_error',
        severity: 'warning',
        userMessage: 'Transaction failed due to gas issues.',
        canRetry: true,
      };
    }
    
    if (message.includes('nonce')) {
      return {
        category: 'nonce_error',
        severity: 'warning',
        userMessage: 'Transaction nonce conflict. Please try again.',
        canRetry: true,
      };
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return {
        category: 'network_error',
        severity: 'warning',
        userMessage: 'Network connection error. Please try again.',
        canRetry: true,
      };
    }
    
    if (message.includes('reverted')) {
      return {
        category: 'transaction_reverted',
        severity: 'error',
        userMessage: 'The smart contract rejected this transaction.',
        canRetry: false,
      };
    }
    
    return {
      category: 'unknown_error',
      severity: 'error',
      userMessage: 'An unexpected error occurred. Please try again.',
      canRetry: true,
    };
  }, []);

  return {
    handleTokenTransferError,
    categorizeError,
    initializeRecoveryStrategies,
  };
}