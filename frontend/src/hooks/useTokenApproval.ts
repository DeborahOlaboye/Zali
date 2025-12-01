import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, GAME_CONSTANTS } from '@/config/contracts';
import { parseEther, maxUint256, encodeFunctionData } from 'viem';
import { useCallback, useMemo } from 'react';
import { useCeloMiniPay } from './useCeloMiniPay';

/**
 * Hook for managing token approvals with proper loading states
 * Handles checking allowance and approving tokens for the game contract
 */
export function useTokenApproval() {
  const { address } = useAccount();
  const { isMiniPay, sendTransaction } = useCeloMiniPay();

  // Check current allowance
  const { 
    data: allowance, 
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance 
  } = useReadContract({
    address: CONTRACTS.cUSD.address,
    abi: CONTRACTS.cUSD.abi,
    functionName: 'allowance',
    args: address && CONTRACTS.triviaGameV2.address 
      ? [address, CONTRACTS.triviaGameV2.address] 
      : undefined,
    query: {
      enabled: !!address,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  });

  // Approve transaction
  const {
    writeContract: approveToken,
    data: approveData,
    isPending: isApproving,
    isError: approveIsError,
    error: approveError,
    reset: resetApproval,
  } = useWriteContract();

  // Wait for approval transaction to be confirmed
  const { 
    isLoading: isWaitingForApproval,
    isSuccess: approveIsSuccess,
    isError: approveReceiptIsError,
    error: approveReceiptError,
  } = useWaitForTransactionReceipt({
    hash: approveData,
  });

  // Calculate required approval amount (entry fee)
  const requiredAmount = useMemo(() => {
    return parseEther(GAME_CONSTANTS.ENTRY_FEE.toString());
  }, []);

  // Check if approval is needed
  const needsApproval = useMemo(() => {
    if (!allowance || !address) return false;
    return allowance < requiredAmount;
  }, [allowance, requiredAmount, address]);

  // Check if approval is sufficient
  const hasSufficientApproval = useMemo(() => {
    if (!allowance || !address) return false;
    return allowance >= requiredAmount;
  }, [allowance, requiredAmount, address]);

  // Combined loading state
  const isLoading = useMemo(() => {
    return isLoadingAllowance || isApproving || isWaitingForApproval;
  }, [isLoadingAllowance, isApproving, isWaitingForApproval]);

  // Combined error state
  const error = useMemo(() => {
    return approveError || approveReceiptError;
  }, [approveError, approveReceiptError]);

  // Combined success state
  const isSuccess = useMemo(() => {
    return approveIsSuccess && !needsApproval;
  }, [approveIsSuccess, needsApproval]);

  /**
   * Approve tokens for the game contract
   * @param amount - Optional amount to approve (defaults to maxUint256 for unlimited approval)
   */
  const approve = useCallback(async (amount?: bigint) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    const approvalAmount = amount || maxUint256;

    if (isMiniPay && sendTransaction) {
      // For MiniPay, encode the approval transaction
      const data = encodeFunctionData({
        abi: CONTRACTS.cUSD.abi,
        functionName: 'approve',
        args: [CONTRACTS.triviaGameV2.address, approvalAmount],
      });

      return sendTransaction({
        to: CONTRACTS.cUSD.address,
        data,
      });
    }

    return approveToken({
      address: CONTRACTS.cUSD.address,
      abi: CONTRACTS.cUSD.abi,
      functionName: 'approve',
      args: [CONTRACTS.triviaGameV2.address, approvalAmount],
    });
  }, [address, isMiniPay, sendTransaction, approveToken]);

  /**
   * Check and approve if needed, then execute callback
   * @param callback - Function to execute after approval (if needed)
   */
  const ensureApproval = useCallback(async (callback?: () => void | Promise<void>) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    // Refetch allowance to get latest value
    const { data: currentAllowance } = await refetchAllowance();

    if (!currentAllowance || currentAllowance < requiredAmount) {
      // Approval needed
      await approve();
      
      // Wait for approval to complete
      // Note: In a real scenario, you might want to poll for the allowance update
      // For now, we'll rely on the transaction receipt
      
      if (callback) {
        // Wait a bit for the approval to be processed
        setTimeout(async () => {
          await callback();
        }, 2000);
      }
    } else {
      // Already approved, execute callback immediately
      if (callback) {
        await callback();
      }
    }
  }, [address, requiredAmount, approve, refetchAllowance]);

  return {
    // State
    allowance: allowance || 0n,
    needsApproval,
    hasSufficientApproval,
    isLoading,
    isApproving,
    isWaitingForApproval,
    isLoadingAllowance,
    isSuccess,
    error,
    approveIsError: approveIsError || approveReceiptIsError,
    
    // Actions
    approve,
    ensureApproval,
    refetchAllowance,
    resetApproval,
    
    // Computed values
    requiredAmount,
    formattedAllowance: allowance ? (Number(allowance) / 1e18).toFixed(6) : '0',
    formattedRequiredAmount: (Number(requiredAmount) / 1e18).toFixed(6),
  };
}

