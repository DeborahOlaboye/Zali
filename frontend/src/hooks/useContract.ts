import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { CONTRACTS, GAME_CONSTANTS } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getRandomQuestions } from '@/data/questions';

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

  // Memoize the startGame function to prevent recreation on every render
  const memoizedStartGame = useCallback(() => {
    return startGame({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'startGame',
    });
  }, [startGame]);

  // Memoize the submitAnswers function
  const memoizedSubmitAnswers = useCallback((sessionId: bigint, answers: number[]) => {
    return submitAnswers({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'submitAnswers',
      args: [sessionId, answers.map(a => a)],
    });
  }, [submitAnswers]);

  // Get latest session for current user
  const getLatestSession = useCallback(() => {
    if (!address || sessionCount === 0) return null;
    return Number(sessionCount) - 1; // Latest session ID
  }, [address, sessionCount]);

  return {
    sessionCount: sessionCount ? Number(sessionCount) : 0,
    startGame: memoizedStartGame,
    startGameIsLoading,
    startGameIsSuccess,
    startGameIsError,
    startGameError,
    submitAnswers: memoizedSubmitAnswers,
    submitIsLoading,
    submitIsSuccess,
    submitIsError,
    submitError,
    getLatestSession,
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
 * Hook for getting questions from the smart contract
 */
export function useQuestions() {
  // Get the total number of questions
  const { data: questionCount, isLoading: isLoadingCount } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getQuestionCount',
  });

  return {
    questionCount: questionCount ? Number(questionCount) : 0,
    isLoading: isLoadingCount,
  };
}

/**
 * Hook for getting a specific question from the contract
 */
export function useContractQuestion(questionId: number) {
  const { data: questionData, isLoading } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getQuestion',
    args: [BigInt(questionId)],
    query: {
      enabled: questionId >= 0,
    },
  });

  const question = useMemo(() => {
    if (!questionData) return null;
    
    const [questionText, options, category] = questionData as [string, string[], string];
    
    return {
      id: questionId,
      question: questionText,
      options: options,
      category: category,
      // Note: correctAnswer is not returned for security
    };
  }, [questionData, questionId]);

  return {
    question,
    isLoading,
  };
}

/**
 * Hook for getting random questions for a game session
 */
export function useGameQuestions(sessionQuestionIds?: number[]) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // If we have session question IDs from contract, fetch those specific questions
  useEffect(() => {
    if (sessionQuestionIds && sessionQuestionIds.length > 0) {
      // TODO: Fetch specific questions from contract
      // For now, use mock questions
      const mockQuestions = getRandomQuestions(10);
      setQuestions(mockQuestions);
      setIsLoading(false);
    } else {
      // Use mock questions as fallback
      const mockQuestions = getRandomQuestions(10);
      setQuestions(mockQuestions);
      setIsLoading(false);
    }
  }, [sessionQuestionIds]);

  return {
    questions,
    isLoading,
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

  // Debug: Log the raw pending rewards data
  useEffect(() => {
    console.log('Raw pendingRewards from contract:', pendingRewards);
  }, [pendingRewards]);

  // Claim all rewards with MiniPay support
  const {
    writeContract: claimRewards,
    data: claimData,
    isPending: claimIsLoading,
    isError: claimIsError,
    error: claimError,
  } = useWriteContract();

  const { isSuccess: claimIsSuccess } = useWaitForTransactionReceipt({
    hash: claimData,
  });

  // Claim specific session rewards
  const {
    writeContract: claimSessionRewards,
    data: claimSessionData,
    isPending: claimSessionIsLoading,
  } = useWriteContract();

  const { isSuccess: claimSessionIsSuccess } = useWaitForTransactionReceipt({
    hash: claimSessionData,
  });

  // Check if user has played recently (temporary solution)
  const hasPlayedRecently = typeof window !== 'undefined' && localStorage.getItem('hasPlayedGame') === 'true';
  const mockRewards = hasPlayedRecently ? '0.15' : '0';
  
  return {
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : mockRewards,
    unclaimedSessions: [],
    claimRewards: () => {
      const tx = {
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'claimRewards',
      };
      return claimRewards(tx);
    },
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    claimError,
    claimSessionRewards: (sessionIds: bigint[]) => {
      const tx = {
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'claimSessionRewards',
        args: [sessionIds],
      };
      return claimSessionRewards(tx);
    },
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

  // Transform the data into a more usable format
  const transformedData = useMemo(() => {
    if (!leaderboardData) {
      console.log('No leaderboard data from contract');
      return [];
    }
    
    console.log('Raw leaderboard data:', leaderboardData);
    
    const [addresses, usernames, scores] = leaderboardData as [string[], string[], bigint[]];
    
    return addresses.map((address, index) => ({
      address,
      username: usernames[index] || `Player ${index + 1}`,
      totalScore: Number(scores[index]),
      rank: index + 1,
    }));
  }, [leaderboardData]);

  // Add mock data if no contract data
  const finalData = transformedData.length > 0 ? transformedData : [
    { address: address || '0x1234...5678', username: 'You', totalScore: 850, rank: 1 },
  ].filter(p => address); // Only show if user is connected
  
  return {
    leaderboardData: finalData,
    refetchLeaderboard,
  };
}

/**
 * Hook for contract info
 */
export function useContractInfo() {
  // Get contract balance
  const { data: contractBalance } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getContractBalance',
  });

  return {
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
