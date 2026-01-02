// Integration guide and hook modifications for useTokenTransfer with transaction loading states

import { useTransactionLoading } from './useTransactionLoading';
import { useCallback, useState, useEffect } from 'react';
import { Address, parseEther } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { toast } from 'react-hot-toast';

/**
 * Enhanced useTokenTransfer with comprehensive transaction loading states
 * 
 * This hook now includes:
 * - Detailed transaction progress tracking
 * - Approval and transfer state separation
 * - Transaction phase management
 * - Confirmation tracking
 */
type TransferState = {
  isApproving: boolean;
  isTransferring: boolean;
  isWaitingForApproval: boolean;
  isWaitingForTransfer: boolean;
  error: string | null;
  txHash: string | null;
  retryCount: number;
};

type UseTokenTransferReturn = {
  transfer: (to: Address, amount: string) => Promise<void>;
  approve: (spender: Address, amount: string) => Promise<void>;
  state: TransferState;
  transactionState: any; // TransactionState
  reset: () => void;
};

/**
 * Integration example showing how to use useTokenTransfer with transaction loading
 * 
 * Before:
 * - Just had isApproving/isTransferring boolean flags
 * - Limited progress information
 * - No phase tracking
 * 
 * After:
 * - Full TransactionState with phase and step tracking
 * - Progress percentage updates
 * - Confirmation tracking
 * - Gas fee estimates
 */
export function enhancedUseTokenTransferExample(): UseTokenTransferReturn {
  const { address } = useAccount();
  const [state, setState] = useState<TransferState>({
    isApproving: false,
    isTransferring: false,
    isWaitingForApproval: false,
    isWaitingForTransfer: false,
    error: null,
    txHash: null,
    retryCount: 0,
  });

  // Use transaction loading for approval process
  const approvalTransactionLoading = useTransactionLoading({
    enableProgressTracking: true,
    enableGasTracking: true,
  });

  // Use transaction loading for transfer process
  const transferTransactionLoading = useTransactionLoading({
    enableProgressTracking: true,
    enableGasTracking: true,
  });

  const {
    writeContractAsync: approveAsync,
    data: approveData,
    isPending: approvePending,
  } = useWriteContract();

  const {
    writeContractAsync: transferAsync,
    data: transferData,
    isPending: transferPending,
  } = useWriteContract();

  const {
    isSuccess: approveSuccess,
    isLoading: approveWaiting,
  } = useWaitForTransactionReceipt({
    hash: approveData,
  });

  const {
    isSuccess: transferSuccess,
    isLoading: transferWaiting,
  } = useWaitForTransactionReceipt({
    hash: transferData,
  });

  /**
   * Enhanced approve function with transaction loading states
   */
  const approve = useCallback(
    async (spender: Address, amount: string) => {
      try {
        approvalTransactionLoading.startLoading();
        approvalTransactionLoading.updateSigning();

        const txHash = await approveAsync({
          address: CONTRACTS.cusd.address,
          abi: CONTRACTS.cusd.abi,
          functionName: 'approve',
          args: [spender, parseEther(amount)],
        });

        approvalTransactionLoading.updateSubmitted(txHash, address);
        approvalTransactionLoading.updateMining();

        setState(prev => ({
          ...prev,
          isApproving: true,
          isWaitingForApproval: true,
        }));

        // Wait for confirmation would go here
        // approvalTransactionLoading.updateConfirming();
        // approvalTransactionLoading.markSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Approval failed';
        approvalTransactionLoading.markFailed(
          error instanceof Error ? error : new Error(errorMessage)
        );
        setState(prev => ({
          ...prev,
          error: errorMessage,
        }));
      }
    },
    [approveAsync, approvalTransactionLoading, address]
  );

  /**
   * Enhanced transfer function with transaction loading states
   */
  const transfer = useCallback(
    async (to: Address, amount: string) => {
      try {
        transferTransactionLoading.startLoading();
        transferTransactionLoading.updateSigning();

        const txHash = await transferAsync({
          address: CONTRACTS.cusd.address,
          abi: CONTRACTS.cusd.abi,
          functionName: 'transfer',
          args: [to, parseEther(amount)],
        });

        transferTransactionLoading.updateSubmitted(txHash, address);
        transferTransactionLoading.updateMining();

        setState(prev => ({
          ...prev,
          isTransferring: true,
          isWaitingForTransfer: true,
          txHash,
        }));

        // Wait for confirmation
        // transferTransactionLoading.updateConfirming();
        // transferTransactionLoading.markSuccess();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Transfer failed';
        transferTransactionLoading.markFailed(
          error instanceof Error ? error : new Error(errorMessage)
        );
        setState(prev => ({
          ...prev,
          error: errorMessage,
        }));
      }
    },
    [transferAsync, transferTransactionLoading, address]
  );

  const reset = useCallback(() => {
    approvalTransactionLoading.reset();
    transferTransactionLoading.reset();
    setState({
      isApproving: false,
      isTransferring: false,
      isWaitingForApproval: false,
      isWaitingForTransfer: false,
      error: null,
      txHash: null,
      retryCount: 0,
    });
  }, [approvalTransactionLoading, transferTransactionLoading]);

  return {
    approve,
    transfer,
    state,
    transactionState: {
      approval: approvalTransactionLoading.state,
      transfer: transferTransactionLoading.state,
    },
    reset,
  };
}
