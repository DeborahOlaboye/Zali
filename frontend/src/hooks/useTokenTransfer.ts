import { useState, useCallback, useEffect } from 'react';
import { Address, parseEther } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { toast } from 'react-hot-toast';
import { createContractError, ContractErrorType } from '@/utils/contractErrors';

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
  
  /** Reset the transfer state */
  reset: () => void;
};

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
      console.error('Approve error:', error);
      const message = error?.message || 'Failed to approve token transfer';
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
      console.error('Transfer error:', error);
      const message = error?.message || 'Failed to transfer tokens';
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
      const message = approveError?.message || 'Failed to approve token transfer';
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
      const message = transferError?.message || 'Failed to transfer tokens';
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
    reset,
  };
}
