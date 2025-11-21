import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { CONTRACTS, GAME_CONSTANTS } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';
import { useState, useEffect } from 'react';

// ============ TRIVIA GAME V2 HOOKS ============

/**
 * Hook for player registration and username management
 */
export function usePlayerRegistration() {
  const { address } = useAccount();

  // Check if player is registered
  const { data: playerInfo, refetch: refetchPlayerInfo } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPlayerInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Register username
  const {
    writeContract: registerUsername,
    data: registerData,
    isPending: registerIsLoading,
    isError: registerIsError,
    error: registerError,
  } = useWriteContract();

  // Update username (costs 0.01 CELO)
  const {
    writeContract: updateUsername,
    data: updateData,
    isPending: updateIsLoading,
    isError: updateIsError,
  } = useWriteContract();

  const { isSuccess: registerIsSuccess } = useWaitForTransactionReceipt({
    hash: registerData,
  });

  const { isSuccess: updateIsSuccess } = useWaitForTransactionReceipt({
    hash: updateData,
  });

  // Check if registered by checking if username exists (index 0)
  const isRegistered = playerInfo ? !!(playerInfo as any)[0] && (playerInfo as any)[0].length > 0 : false;

  return {
    playerInfo,
    isRegistered,
    registerUsername: (username: string) => registerUsername({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'registerUsername',
      args: [username],
    }),
    registerIsLoading,
    registerIsSuccess,
    registerIsError,
    registerError,
    updateUsername: (username: string) => updateUsername({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'updateUsername',
      args: [username],
      value: parseEther('0.01'),
    }),
    updateIsLoading,
    updateIsSuccess,
    updateIsError,
    refetchPlayerInfo,
  };
}

/**
 * Hook for starting and playing games
 */
export function useGameSession() {
  const { address } = useAccount();

  // Get player's session count
  const { data: sessionCount } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPlayerSessionCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Start a new game
  const {
    writeContract: startGame,
    data: startGameData,
    isPending: startGameIsLoading,
    isError: startGameIsError,
    error: startGameError,
  } = useWriteContract();

  const { isSuccess: startGameIsSuccess } = useWaitForTransactionReceipt({
    hash: startGameData,
  });

  // Submit answers
  const {
    writeContract: submitAnswers,
    data: submitData,
    isPending: submitIsLoading,
    isError: submitIsError,
    error: submitError,
  } = useWriteContract();

  const { isSuccess: submitIsSuccess } = useWaitForTransactionReceipt({
    hash: submitData,
  });

  return {
    sessionCount: sessionCount ? Number(sessionCount) : 0,
    startGame: () => startGame({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'startGame',
    }),
    startGameIsLoading,
    startGameIsSuccess,
    startGameIsError,
    startGameError,
    submitAnswers: (sessionId: bigint, answers: number[]) => submitAnswers({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'submitAnswers',
      args: [sessionId, answers],
    }),
    submitIsLoading,
    submitIsSuccess,
    submitIsError,
    submitError,
  };
}

/**
 * Hook for getting session details
 */
export function useSession(sessionId?: number) {
  const { address } = useAccount();

  const { data: sessionData, refetch: refetchSession } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getSession',
    args: address && sessionId !== undefined ? [address, BigInt(sessionId)] : undefined,
    query: {
      enabled: !!address && sessionId !== undefined,
    },
  });

  return {
    sessionData,
    refetchSession,
  };
}

/**
 * Hook for getting questions
 */
export function useQuestions(questionIds?: bigint[]) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!questionIds || questionIds.length === 0) return;

    const fetchQuestions = async () => {
      setLoading(true);
      // Fetch each question individually
      // This would need to be implemented with multiple contract reads
      setLoading(false);
    };

    fetchQuestions();
  }, [questionIds]);

  return {
    questions,
    loading,
  };
}

/**
 * Hook for rewards management
 */
export function useRewards() {
  const { address } = useAccount();

  // Get pending rewards
  const { data: pendingRewards, refetch: refetchPendingRewards } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get unclaimed sessions
  const { data: unclaimedSessions } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getUnclaimedSessions',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Claim all rewards
  const {
    writeContract: claimRewards,
    data: claimData,
    isPending: claimIsLoading,
    isError: claimIsError,
    error: claimError,
  } = useWriteContract();

  // Claim specific session rewards
  const {
    writeContract: claimSessionRewards,
    data: claimSessionData,
    isPending: claimSessionIsLoading,
  } = useWriteContract();

  const { isSuccess: claimIsSuccess } = useWaitForTransactionReceipt({
    hash: claimData,
  });

  const { isSuccess: claimSessionIsSuccess } = useWaitForTransactionReceipt({
    hash: claimSessionData,
  });

  return {
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : '0',
    unclaimedSessions: unclaimedSessions as bigint[] || [],
    claimRewards: () => claimRewards({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'claimRewards',
    }),
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    claimError,
    claimSessionRewards: (sessionId: bigint) => claimSessionRewards({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'claimSessionRewards',
      args: [sessionId],
    }),
    claimSessionIsLoading,
    claimSessionIsSuccess,
    refetchPendingRewards,
  };
}

/**
 * Hook for leaderboard
 */
export function useLeaderboard(count: number = 10) {
  const { data: leaderboardData, refetch: refetchLeaderboard } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getLeaderboard',
    args: [BigInt(count)],
  });

  return {
    leaderboardData,
    refetchLeaderboard,
  };
}

/**
 * Hook for contract info
 */
export function useContractInfo() {
  // Get total questions
  const { data: questionCount } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getQuestionCount',
  });

  // Get contract balance
  const { data: contractBalance } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getContractBalance',
  });

  return {
    questionCount: questionCount ? Number(questionCount) : 0,
    contractBalance: contractBalance ? formatEther(contractBalance as bigint) : '0',
  };
}

/**
 * Hook for CELO balance
 */
export function useCeloBalance() {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
  });

  return {
    balance: balance?.value ? formatEther(balance.value) : '0',
    formatted: balance?.formatted || '0',
    symbol: balance?.symbol || 'CELO',
    refetchBalance,
  };
}

// ============ LEGACY FAUCET HOOK (Keep for backward compatibility) ============

export function useFaucet() {
  const { address } = useAccount();
  
  const { data: hasClaimed } = useReadContract({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'hasClaimed',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: contractBalance } = useReadContract({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'getContractBalance',
  });

  const { 
    writeContract: claim, 
    data: claimData, 
    isPending: claimIsLoading,
    isError: claimIsError,
  } = useWriteContract();

  const { isSuccess: claimIsSuccess } = useWaitForTransactionReceipt({
    hash: claimData,
  });

  return {
    claim: () => claim({
      address: CONTRACTS.faucet.address,
      abi: CONTRACTS.faucet.abi,
      functionName: 'claim',
    }),
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    hasClaimed: hasClaimed as boolean,
    contractBalance,
    claimAmount: parseEther('10'),
  };
}
