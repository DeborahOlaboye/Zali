import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { formatEther } from 'viem';
import { useState, useEffect, useCallback } from 'react';

// Type for loading states
export interface LoadingState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook for rewards queries
 */
export function useRewardsQueries() {
  const { address } = useAccount();

  const [rewardsState, setRewardsState] = useState<LoadingState>({
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  });

  // Get pending rewards
  const {
    data: pendingRewards,
    refetch: refetchPendingRewards,
    isFetching: isFetchingPendingRewards,
    isError: isPendingRewardsError,
    error: pendingRewardsError,
  } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  });

  // Update rewards loading state
  useEffect(() => {
    setRewardsState(prev => ({
      ...prev,
      isLoading: isFetchingPendingRewards,
      isError: isPendingRewardsError,
      error: pendingRewardsError || null,
    }));
  }, [isFetchingPendingRewards, isPendingRewardsError, pendingRewardsError]);

  return {
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : '0',
    rewardsState,
    refetchPendingRewards,
  };
}

/**
 * Hook for rewards mutations
 */
export function useRewardsMutations() {
  const { address } = useAccount();

  // Claim all rewards with MiniPay support
  const [claimState, setClaimState] = useState<LoadingState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const [claimSessionState, setClaimSessionState] = useState<LoadingState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const {
    writeContractAsync: claimRewardsAsync,
    data: claimData,
    isPending: claimIsPending,
    isError: claimIsError,
    error: claimError,
  } = useWriteContract();

  const {
    isSuccess: claimIsSuccess,
    isError: claimTxError,
    error: claimTxErrorObj,
    isLoading: isClaimTxLoading
  } = useWaitForTransactionReceipt({
    hash: claimData,
  });

  // Claim specific session rewards
  const {
    writeContractAsync: claimSessionRewardsAsync,
    data: claimSessionData,
    isPending: claimSessionIsPending,
    isError: claimSessionIsError,
    error: claimSessionError,
  } = useWriteContract();

  const {
    isSuccess: claimSessionIsSuccess,
    isError: claimSessionTxError,
    error: claimSessionTxErrorObj,
    isLoading: isClaimSessionTxLoading
  } = useWaitForTransactionReceipt({
    hash: claimSessionData,
  });

  // Update claim state
  useEffect(() => {
    setClaimState(prev => ({
      ...prev,
      isLoading: claimIsPending || isClaimTxLoading,
      isSuccess: claimIsSuccess,
      isError: claimIsError || claimTxError,
      error: claimError || claimTxErrorObj || null,
    }));
  }, [
    claimIsPending,
    isClaimTxLoading,
    claimIsSuccess,
    claimIsError,
    claimTxError,
    claimError,
    claimTxErrorObj
  ]);

  // Update claim session state
  useEffect(() => {
    setClaimSessionState(prev => ({
      ...prev,
      isLoading: claimSessionIsPending || isClaimSessionTxLoading,
      isSuccess: claimSessionIsSuccess,
      isError: claimSessionIsError || claimSessionTxError,
      error: claimSessionError || claimSessionTxErrorObj || null,
    }));
  }, [
    claimSessionIsPending,
    isClaimSessionTxLoading,
    claimSessionIsSuccess,
    claimSessionIsError,
    claimSessionTxError,
    claimSessionError,
    claimSessionTxErrorObj
  ]);

  const claimRewards = useCallback(async () => {
    setClaimState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await claimRewardsAsync({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'claimRewards',
      });

      return result;
    } catch (error) {
      setClaimState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to claim rewards')
      }));
      throw error;
    }
  }, [claimRewardsAsync]);

  const claimSessionRewards = useCallback(async (sessionIds: bigint[]) => {
    setClaimSessionState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await claimSessionRewardsAsync({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'claimSessionRewards',
        args: [sessionIds],
      });

      return result;
    } catch (error) {
      setClaimSessionState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to claim session rewards')
      }));
      throw error;
    }
  }, [claimSessionRewardsAsync]);

  return {
    claimRewards,
    claimState,
    claimSessionRewards,
    claimSessionState,
  };
}

/**
 * Combined rewards hook for convenience
 */
export function useRewards() {
  const queries = useRewardsQueries();
  const mutations = useRewardsMutations();

  return {
    ...queries,
    ...mutations,
    unclaimedSessions: [], // TODO: Implement unclaimed sessions logic
  };
}