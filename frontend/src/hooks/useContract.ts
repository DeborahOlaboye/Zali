import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { CONTRACTS, GAME_CONSTANTS } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getRandomQuestions } from '@/data/questions';
import { useCeloMiniPay } from './useCeloMiniPay';
import { useTokenApproval } from './useTokenApproval';

// ============ TRIVIA GAME V2 HOOKS ============

/**
 * Hook for player registration and username management
 */
export function usePlayerRegistration() {
  const { address } = useAccount();
  const { isMiniPay, sendTransaction } = useCeloMiniPay();

  // Check if player is registered
  const { data: playerInfo, refetch: refetchPlayerInfo } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPlayerInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
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

  // Update username (costs 0.01 cUSD)
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
  const isRegistered = useMemo(() => {
    if (!playerInfo) return false;
    const username = (playerInfo as any)[0];
    const result = !!(username && username.length > 0);
    console.log('Registration check:', { address, playerInfo, username, isRegistered: result });
    return result;
  }, [playerInfo, address]);

  return {
    playerInfo,
    isRegistered,
    registerUsername: async (username: string) => {
      if (isMiniPay && sendTransaction) {
        return sendTransaction({
          to: CONTRACTS.triviaGameV2.address,
          data: CONTRACTS.triviaGameV2.abi.find((f: any) => f.name === 'registerUsername')?.encode([username]),
        });
      }
      return registerUsername({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'registerUsername',
        args: [username],
      });
    },
    registerIsLoading,
    registerIsSuccess,
    registerIsError,
    registerError,
    updateUsername: async (username: string) => {
      if (isMiniPay && sendTransaction) {
        return sendTransaction({
          to: CONTRACTS.triviaGameV2.address,
          data: CONTRACTS.triviaGameV2.abi.find((f: any) => f.name === 'updateUsername')?.encode([username]),
          value: parseEther('0.01'),
        });
      }
      return updateUsername({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'updateUsername',
        args: [username],
        value: parseEther('0.01'),
      });
    },
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
  const { isMiniPay, sendTransaction } = useCeloMiniPay();
  
  // Token approval hook
  const {
    needsApproval,
    hasSufficientApproval,
    isLoading: isApprovalLoading,
    isApproving,
    isWaitingForApproval,
    approve,
    ensureApproval,
    refetchAllowance,
  } = useTokenApproval();

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

  // Memoize the startGame function with approval check
  const memoizedStartGame = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    // Check and ensure approval before starting game
    if (needsApproval) {
      // Approval needed - approve first
      await approve();
      // Wait for approval to be confirmed
      // The caller should wait for approval success before calling startGame again
      throw new Error('Token approval required. Please wait for approval to complete.');
    }

    // If we have sufficient approval, proceed with starting the game
    const result = isMiniPay && sendTransaction ? 
      await sendTransaction({
        to: CONTRACTS.triviaGameV2.address,
        data: CONTRACTS.triviaGameV2.abi.find((f: any) => f.name === 'startGame')?.encode([]),
      }) :
      startGame({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'startGame',
      });
    
    return result;
  }, [startGame, address, needsApproval, approve, isMiniPay, sendTransaction]);

  // Memoize the submitAnswers function
  const memoizedSubmitAnswers = useCallback((sessionId: bigint, answers: number[]) => {
    if (isMiniPay && sendTransaction) {
      return sendTransaction({
        to: CONTRACTS.triviaGameV2.address,
        data: CONTRACTS.triviaGameV2.abi.find((f: any) => f.name === 'submitAnswers')?.encode([sessionId, answers]),
      });
    }
    
    // For regular wagmi, just call the function (it will trigger the transaction)
    submitAnswers({
      address: CONTRACTS.triviaGameV2.address,
      abi: CONTRACTS.triviaGameV2.abi,
      functionName: 'submitAnswers',
      args: [sessionId, answers.map(a => a)],
    });
    

  }, [submitAnswers, isMiniPay, sendTransaction]);

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
    // Token approval states
    needsApproval,
    hasSufficientApproval,
    isApprovalLoading,
    isApproving,
    isWaitingForApproval,
    approve,
    ensureApproval,
    refetchAllowance,
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
 * Hook for faucet operations
 */
export function useFaucet() {
  const { address } = useAccount();
  const { isMiniPay, sendTransaction } = useCeloMiniPay();

  // Check claim amount
  const { data: claimAmount } = useReadContract({
    address: CONTRACTS.faucet?.address,
    abi: CONTRACTS.faucet?.abi,
    functionName: 'claimAmount',
  });

  // Check contract balance
  const { data: contractBalance } = useBalance({
    address: CONTRACTS.faucet?.address as `0x${string}`,
    token: CONTRACTS.cUSD?.address as `0x${string}`,
  });

  // Claim function
  const {
    writeContract: claimFaucet,
    data: claimData,
    isPending: claimIsLoading,
    isError: claimIsError,
    error: claimError,
  } = useWriteContract();

  const { isSuccess: claimIsSuccess } = useWaitForTransactionReceipt({
    hash: claimData,
  });

  const claim = useCallback(async () => {
    if (isMiniPay && sendTransaction) {
      return sendTransaction({
        to: CONTRACTS.faucet?.address,
        data: CONTRACTS.faucet?.abi.find((f: any) => f.name === 'claim')?.encode([]),
      });
    }
    return claimFaucet({
      address: CONTRACTS.faucet?.address,
      abi: CONTRACTS.faucet?.abi,
      functionName: 'claim',
    });
  }, [isMiniPay, sendTransaction, claimFaucet]);

  return {
    claim,
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    claimError,
    claimAmount: { data: claimAmount },
    contractBalance: { data: contractBalance?.value },
  };
}

/**
 * Hook for getting session questions from the contract
 */
export function useGameQuestions(sessionId?: number) {
  const { address } = useAccount();
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get session data which should contain question IDs
  const { data: sessionData } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getSession',
    args: address && sessionId !== undefined ? [address, BigInt(sessionId)] : undefined,
    query: {
      enabled: !!address && sessionId !== undefined,
    },
  });
  
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!sessionData) {
        // Fallback to hardcoded questions if no session data
        const fallbackQuestions = [
          { question: "What is Celo?", options: ["A mobile-first blockchain platform", "A cryptocurrency exchange", "A digital wallet app", "A mining hardware company"], correctAnswer: 0, difficulty: "easy", category: "Basics" },
          { question: "What is cUSD?", options: ["Celo Dollar stablecoin", "Canadian Dollar", "Crypto USD token", "Central USD"], correctAnswer: 0, difficulty: "easy", category: "Basics" },
          { question: "What consensus mechanism does Celo use?", options: ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"], correctAnswer: 1, difficulty: "medium", category: "Technical" },
          { question: "What is MiniPay?", options: ["A payment processor", "A mobile wallet for Celo", "A cryptocurrency exchange", "A DeFi protocol"], correctAnswer: 1, difficulty: "easy", category: "Ecosystem" },
          { question: "What is the native token of Celo?", options: ["CELO", "CUSD", "CEL", "CLO"], correctAnswer: 0, difficulty: "easy", category: "Basics" },
          { question: "What makes Celo mobile-first?", options: ["Phone number addresses", "Low fees", "Fast transactions", "All of the above"], correctAnswer: 3, difficulty: "medium", category: "Features" },
          { question: "What is Valora?", options: ["A DeFi protocol", "A Celo mobile wallet", "A stablecoin", "A consensus algorithm"], correctAnswer: 1, difficulty: "easy", category: "Ecosystem" },
          { question: "What is the Celo Reserve?", options: ["A mining pool", "A staking mechanism", "Collateral backing stablecoins", "A governance token"], correctAnswer: 2, difficulty: "hard", category: "Technical" },
          { question: "What programming language are Celo smart contracts written in?", options: ["JavaScript", "Python", "Solidity", "Rust"], correctAnswer: 2, difficulty: "medium", category: "Technical" },
          { question: "What is the purpose of CELO tokens?", options: ["Only for payments", "Governance and staking", "Mining rewards", "Exchange fees"], correctAnswer: 1, difficulty: "medium", category: "Tokenomics" }
        ];
        setQuestions(fallbackQuestions);
        setIsLoading(false);
        return;
      }
      
      // Extract question IDs from session data (contract should provide this)
      // Session data structure: [questionIds, isCompleted, score, timestamp]
      const questionIds = (sessionData as any)[0] as bigint[];
      
      if (questionIds && questionIds.length > 0) {
        // Fetch each question from the contract
        const fetchedQuestions = [];
        for (const questionId of questionIds) {
          try {
            // This would fetch individual questions from contract
            // For now, use fallback since we need the contract to be properly set up
            const questionIndex = Number(questionId) % 10;
            const fallbackQuestions = [
              { question: "What is Celo?", options: ["A mobile-first blockchain platform", "A cryptocurrency exchange", "A digital wallet app", "A mining hardware company"], correctAnswer: 0, difficulty: "easy", category: "Basics" },
              { question: "What is cUSD?", options: ["Celo Dollar stablecoin", "Canadian Dollar", "Crypto USD token", "Central USD"], correctAnswer: 0, difficulty: "easy", category: "Basics" },
              { question: "What consensus mechanism does Celo use?", options: ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"], correctAnswer: 1, difficulty: "medium", category: "Technical" },
              { question: "What is MiniPay?", options: ["A payment processor", "A mobile wallet for Celo", "A cryptocurrency exchange", "A DeFi protocol"], correctAnswer: 1, difficulty: "easy", category: "Ecosystem" },
              { question: "What is the native token of Celo?", options: ["CELO", "CUSD", "CEL", "CLO"], correctAnswer: 0, difficulty: "easy", category: "Basics" },
              { question: "What makes Celo mobile-first?", options: ["Phone number addresses", "Low fees", "Fast transactions", "All of the above"], correctAnswer: 3, difficulty: "medium", category: "Features" },
              { question: "What is Valora?", options: ["A DeFi protocol", "A Celo mobile wallet", "A stablecoin", "A consensus algorithm"], correctAnswer: 1, difficulty: "easy", category: "Ecosystem" },
              { question: "What is the Celo Reserve?", options: ["A mining pool", "A staking mechanism", "Collateral backing stablecoins", "A governance token"], correctAnswer: 2, difficulty: "hard", category: "Technical" },
              { question: "What programming language are Celo smart contracts written in?", options: ["JavaScript", "Python", "Solidity", "Rust"], correctAnswer: 2, difficulty: "medium", category: "Technical" },
              { question: "What is the purpose of CELO tokens?", options: ["Only for payments", "Governance and staking", "Mining rewards", "Exchange fees"], correctAnswer: 1, difficulty: "medium", category: "Tokenomics" }
            ];
            fetchedQuestions.push(fallbackQuestions[questionIndex]);
          } catch (error) {
            console.error('Error fetching question:', error);
          }
        }
        setQuestions(fetchedQuestions);
      }
      
      setIsLoading(false);
    };
    
    fetchQuestions();
  }, [sessionData]);

  return {
    questions,
    isLoading,
  };
}

/**
 * Hook for rewards management - MiniPay only
 */
export function useRewards() {
  const { address } = useAccount();
  const { isMiniPay, sendTransaction } = useCeloMiniPay();

  // Get pending rewards
  const { data: pendingRewards, refetch: refetchPendingRewards } = useReadContract({
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

  // Debug: Log the raw pending rewards data
  useEffect(() => {
    console.log('Raw pendingRewards from contract:', pendingRewards);
    console.log('Checking rewards for address:', address);
  }, [pendingRewards, address]);

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

  return {
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : '0',
    unclaimedSessions: [],
    claimRewards: async () => {
      if (!isMiniPay) {
        throw new Error('Reward claims are only available through MiniPay');
      }
      if (!sendTransaction) {
        throw new Error('MiniPay not connected');
      }
      return sendTransaction({
        to: CONTRACTS.triviaGameV2.address,
        data: CONTRACTS.triviaGameV2.abi.find((f: any) => f.name === 'claimRewards')?.encode([]),
      });
    },
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    claimError,
    claimSessionRewards: async (sessionIds: bigint[]) => {
      if (!isMiniPay) {
        throw new Error('Reward claims are only available through MiniPay');
      }
      if (!sendTransaction) {
        throw new Error('MiniPay not connected');
      }
      return sendTransaction({
        to: CONTRACTS.triviaGameV2.address,
        data: CONTRACTS.triviaGameV2.abi.find((f: any) => f.name === 'claimSessionRewards')?.encode([sessionIds]),
      });
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
    query: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
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

  return {
    leaderboardData: transformedData,
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


