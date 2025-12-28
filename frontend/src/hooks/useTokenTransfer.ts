import { useState, useCallback, useEffect } from 'react';
import { Address, parseEther } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { toast } from 'react-hot-toast';
import { createContractError, ContractErrorType } from '@/utils/contractErrors';
import { useTransactionLoading } from './useTransactionLoading';
import type { UseTransactionLoadingReturn } from '@/types/transaction';

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
  /**
   * Transfer tokens to another address
   * @param to Recipient address
   * @param amount Amount in cUSD (will be converted to wei)
   */
  transfer: (to: Address, amount: string) => Promise<void>;
  
  /**
   * Approve spender to transfer tokens on behalf of the user
   * @param spender Address allowed to spend tokens
   * @param amount Amount in cUSD (will be converted to wei)
   */
  approve: (spender: Address, amount: string) => Promise<void>;
  
  /** Current transfer state */
  state: TransferState;
  approveTx?: UseTransactionLoadingReturn;
  transferTx?: UseTransactionLoadingReturn;
  
  /** Reset the transfer state */
  reset: () => void;
};

// Helper function to parse contract errors with detailed token transfer messages
function parseContractError(error: any): string {
  if (!error) return 'An unknown error occurred during the transaction';
  
  const errorMessage = error.message || error.toString();
  const lowerCaseMessage = errorMessage.toLowerCase();
  
  // User rejection
  if (lowerCaseMessage.includes('user rejected') || 
      lowerCaseMessage.includes('user denied') ||
      error?.code === 4001) {
    return 'Transaction was cancelled by user';
  }
  
  // Network issues
  if (lowerCaseMessage.includes('network') || 
      lowerCaseMessage.includes('ethers') ||
      error?.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your internet connection and try again';
  }
  
  // Gas and transaction issues
  if (lowerCaseMessage.includes('gas') || 
      lowerCaseMessage.includes('transaction underpriced') ||
      lowerCaseMessage.includes('replacement fee too low')) {
    return 'Transaction failed due to gas issues. Please try again with higher gas settings';
  }
  
  // Token specific errors
  if (lowerCaseMessage.includes('insufficient balance') ||
      lowerCaseMessage.includes('exceeds balance') ||
      error?.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient token balance for this transaction';
  }
  
  if (lowerCaseMessage.includes('allowance') || 
      lowerCaseMessage.includes('not enough allowance')) {
    return 'Insufficient token allowance. Please approve the token spending first';
  }
  
  if (lowerCaseMessage.includes('transfer amount exceeds balance')) {
    return 'Transfer amount exceeds your token balance';
  }
  
  if (lowerCaseMessage.includes('transfer to the zero address')) {
    return 'Cannot transfer to zero address';
  }
  
  if (lowerCaseMessage.includes('transfer from the zero address')) {
    return 'Cannot transfer from zero address';
  }
  
  if (lowerCaseMessage.includes('transfer amount exceeds allowance')) {
    return 'Transfer amount exceeds approved allowance';
  }
  
  if (lowerCaseMessage.includes('erc20: transfer amount exceeds allowance')) {
    return 'Insufficient allowance for this transfer. Please approve more tokens';
  }
  
  if (lowerCaseMessage.includes('erc20: transfer amount exceeds balance')) {
    return 'Transfer amount exceeds your token balance';
  }
  
  // Common contract revert reasons
  if (lowerCaseMessage.includes('reverted')) {
    const revertReason = errorMessage.match(/reverted with reason string '(.+?)'/i);
    if (revertReason && revertReason[1]) {
      return `Transaction reverted: ${revertReason[1]}`;
    }
    return 'Transaction was reverted by the contract';
  }
  
  // Fallback error messages based on error code if available
  switch (error?.code) {
    case 'UNPREDICTABLE_GAS_LIMIT':
      return 'Unable to estimate gas for this transaction. The transaction will likely fail.';
    case 'CALL_EXCEPTION':
      return 'Contract call exception. The transaction might have reverted.';
    case 'INVALID_ARGUMENT':
      return 'Invalid transaction parameters provided';
    case 'MISSING_ARGUMENT':
      return 'Missing required transaction parameters';
    case 'UNSUPPORTED_OPERATION':
      return 'This operation is not supported';
    case 'TIMEOUT':
      return 'Transaction timed out. Please try again';
  }
  
  // For very long error messages, show a generic message
  if (errorMessage.length > 200) {
    return 'Transaction failed. Please check your inputs and try again';
  }
  
  // Return the original error message if it's not too long
  return errorMessage;
}

export function useTokenTransfer(): UseTokenTransferReturn {
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
  
  const MAX_RETRIES = 3;

  // Wagmi write hooks
  const { 
    writeContract: writeApprove, 
    data: approveData, 
    isPending: isApprovePending,
    isError: isApproveError,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const { 
    writeContract: writeTransfer, 
    data: transferData, 
    isPending: isTransferPending,
    isError: isTransferError,
    error: transferError,
    reset: resetTransfer,
  } = useWriteContract();

  // Wait for transaction receipts
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveData,
  });

  const { isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({
    hash: transferData,
  });

  // Transaction loading hooks for more detailed states
  const approveTx = useTransactionLoading({ enableProgressTracking: true });
  const transferTx = useTransactionLoading({ enableProgressTracking: true });

  // Reset state
  const reset = useCallback(() => {
    setState({
      isApproving: false,
      isTransferring: false,
      isWaitingForApproval: false,
      isWaitingForTransfer: false,
      error: null,
      txHash: null,
      retryCount: 0,
    });
    resetApprove();
    resetTransfer();
    approveTx.reset();
    transferTx.reset();
  }, [resetApprove, resetTransfer]);

  // Handle approval transaction
  const approve = useCallback(async (spender: Address, amount: string) => {
    if (!address) {
      const error = await createContractError(
        ContractErrorType.WALLET_NOT_CONNECTED,
        'Wallet not connected',
        { action: 'approve' }
      );
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }

    try {
      // start transaction loading
      approveTx && (approveTx as any).state && approveTx.reset();
      approveTx.startLoading?.();
      const amountWei = parseEther(amount);
      
      setState({
        isApproving: true,
        isWaitingForApproval: true,
        isTransferring: false,
        isWaitingForTransfer: false,
        error: null,
        txHash: null,
      });

      writeApprove({
        address: CONTRACTS.cUSD.address,
        abi: CONTRACTS.cUSD.abi,
        functionName: 'approve',
        args: [spender, amountWei],
      });
    } catch (error: any) {
      // mark failed in tx hook
      approveTx.markFailed?.(error instanceof Error ? error : new Error('Approve failed'));
      console.error('Approve error:', error);
      const message = parseContractError(error);
      const newRetryCount = state.retryCount + 1;
      
      setState(prev => ({
        ...prev,
        isApproving: false,
        isWaitingForApproval: false,
        error: message,
        retryCount: newRetryCount,
      }));
      
      if (newRetryCount < MAX_RETRIES) {
        toast.error(`${message}. Retry ${newRetryCount}/${MAX_RETRIES}`);
      } else {
        toast.error(`${message}. Max retries reached.`);
      }
      
      throw error;
    }
  }, [address, writeApprove]);
  // Handle transfer transaction
  const transfer = useCallback(async (to: Address, amount: string) => {
    if (!address) {
      const error = await createContractError(
        ContractErrorType.WALLET_NOT_CONNECTED,
        'Wallet not connected',
        { action: 'transfer' }
      );
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }

    try {
      // start transaction loading
      transferTx && (transferTx as any).state && transferTx.reset();
      transferTx.startLoading?.();
      const amountWei = parseEther(amount);
      
      setState({
        isTransferring: true,
        isWaitingForTransfer: true,
        isApproving: false,
        isWaitingForApproval: false,
        error: null,
        txHash: null,
      });

      writeTransfer({
        address: CONTRACTS.cUSD.address,
        abi: CONTRACTS.cUSD.abi,
        functionName: 'transfer',
        args: [to, amountWei],
      });

    } catch (error: any) {
      // mark failed in tx hook
      transferTx.markFailed?.(error instanceof Error ? error : new Error('Transfer failed'));
      console.error('Transfer error:', error);
      const message = parseContractError(error);
      const newRetryCount = state.retryCount + 1;
      
      setState(prev => ({
        ...prev,
        isTransferring: false,
        isWaitingForTransfer: false,
        error: message,
        retryCount: newRetryCount,
      }));
      
      if (newRetryCount < MAX_RETRIES) {
        toast.error(`${message}. Retry ${newRetryCount}/${MAX_RETRIES}`);
      } else {
        toast.error(`${message}. Max retries reached.`);
      }
      
      throw error;
    }
  }, [address, writeTransfer]);

  // Handle approval transaction status changes
  useEffect(() => {
    if (isApproveError) {
      const message = parseContractError(approveError);
      // mark failed in tx hook
      approveTx.markFailed?.(approveError instanceof Error ? approveError : new Error(message));
      setState(prev => ({
        ...prev,
        isApproving: false,
        isWaitingForApproval: false,
        error: message,
      }));
      toast.error(message);
    }
  }, [isApproveError, approveError]);

  // Handle transfer transaction status changes
  useEffect(() => {
    if (isTransferError) {
      const message = parseContractError(transferError);
      // mark failed in tx hook
      transferTx.markFailed?.(transferError instanceof Error ? transferError : new Error(message));
      setState(prev => ({
        ...prev,
        isTransferring: false,
        isWaitingForTransfer: false,
        error: message,
      }));
      toast.error(message);
    }
  }, [isTransferError, transferError]);

  // Handle successful approval
  useEffect(() => {
    if (isApproveSuccess) {
      // update tx hook with submitted hash and mark success
      if (approveData) {
        approveTx.updateSubmitted?.(approveData as any, address as any);
      }
      approveTx.markSuccess?.();
setState(prev => ({
        ...prev,
        isApproving: false,
        isWaitingForApproval: false,
        txHash: approveData || null,
      }));
      toast.success('Token transfer approved successfully');
    }
  }, [isApproveSuccess, approveData]);

  // Handle successful transfer
  useEffect(() => {
    if (isTransferSuccess) {
      // update tx hook with submitted hash and mark success
      if (transferData) {
        transferTx.updateSubmitted?.(transferData as any, address as any);
      }
      transferTx.markSuccess?.();
setState(prev => ({
        ...prev,
        isTransferring: false,
        isWaitingForTransfer: false,
        txHash: transferData || null,
      }));
      toast.success('Tokens transferred successfully');
    }
  }, [isTransferSuccess, transferData]);

  return {
    transfer,
    approve,
    state,
    approveTx,
    transferTx,
    reset,
  };
}
