import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { CONTRACTS, GAME_CONSTANTS } from '@/config/contracts';
import { parseEther, formatEther } from 'viem';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getRandomQuestions } from '@/data/questions';

// Type for loading states
export interface LoadingState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

// ============ SIMPLE TRIVIA GAME HOOKS (Current Deployed Contract) ============

/**
 * Hook for basic trivia game interactions with SimpleTriviaGame
 */
export function useSimpleTriviaGame() {
  const { address } = useAccount();

  // Get user score
  const {
    data: userScore,
    refetch: refetchUserScore,
  } = useReadContract({
    address: CONTRACTS.triviaGame.address,
    abi: [
      'function userScores(address) external view returns (uint256)',
    ],
    functionName: 'userScores',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get question
  const getQuestion = useCallback((questionId: number) => {
    return useReadContract({
      address: CONTRACTS.triviaGame.address,
      abi: [
        'function getQuestion(uint256) external view returns (string memory, string[] memory, uint256, uint256, bool)',
      ],
      functionName: 'getQuestion',
      args: [questionId],
    });
  }, []);

  // Submit answer
  const { writeContract: submitAnswer, isPending: isSubmitting } = useWriteContract();

  const submitTriviaAnswer = useCallback((questionId: number, selectedOption: number) => {
    if (!address) return;

    submitAnswer({
      address: CONTRACTS.triviaGame.address,
      abi: [
        'function submitAnswer(uint256, uint256) external',
      ],
      functionName: 'submitAnswer',
      args: [questionId, selectedOption],
    });
  }, [address, submitAnswer]);

  return {
    userScore: userScore as bigint | undefined,
    refetchUserScore,
    getQuestion,
    submitTriviaAnswer,
    isSubmitting,
  };
}

/**
 * Hook for leaderboard (simplified - just shows scores)
 */
export function useSimpleLeaderboard() {
  // Since SimpleTriviaGame doesn't have a leaderboard, we'll show basic stats
  // This is a placeholder until TriviaGameV2 is deployed
  return {
    leaderboardData: [],
    leaderboardState: { isLoading: false, isError: false },
    refetchLeaderboard: () => {},
  };
}

/**
 * Hook for player registration (simplified - no registration needed)
 */
export function usePlayerRegistration() {
  // SimpleTriviaGame doesn't require registration
  return {
    isRegistered: true, // Always "registered" for SimpleTriviaGame
    registerUsername: () => {},
    registerState: { isLoading: false, isSuccess: true, isError: false, error: null },
    refetchPlayerInfo: () => {},
  };
}
    }
  }, [isFetchingPlayerInfoQuery, isPlayerInfoError, playerInfoQueryError]);

  // Register username
  const [registerState, setRegisterState] = useState<LoadingState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  // Update username state
  const [updateUsernameState, setUpdateUsernameState] = useState<LoadingState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const {
    writeContractAsync: registerUsernameAsync,
    data: registerData,
    isPending: registerIsPending,
    isError: registerIsError,
    error: registerError,
  } = useWriteContract();

  const {
    writeContractAsync: updateUsernameAsync,
    data: updateData,
    isPending: updateIsPending,
    isError: updateIsError,
    error: updateError,
  } = useWriteContract();

  const { 
    isSuccess: registerIsSuccess,
    isError: registerTxError,
    error: registerTxErrorObj,
    isLoading: isRegisterTxLoading 
  } = useWaitForTransactionReceipt({
    hash: registerData,
  });

  const { 
    isSuccess: updateIsSuccess, 
    isError: updateTxError,
    error: updateTxErrorObj,
    isLoading: isUpdateTxLoading 
  } = useWaitForTransactionReceipt({
    hash: updateData,
  });

  // Update register state based on transaction status
  useEffect(() => {
    setRegisterState(prev => ({
      ...prev,
      isLoading: registerIsPending || isRegisterTxLoading,
      isSuccess: registerIsSuccess,
      isError: registerIsError || registerTxError,
      error: registerError || registerTxErrorObj || null,
    }));
  }, [registerIsPending, isRegisterTxLoading, registerIsSuccess, registerIsError, registerTxError, registerError, registerTxErrorObj]);

  // Update username state based on transaction status
  useEffect(() => {
    setUpdateUsernameState(prev => ({
      ...prev,
      isLoading: updateIsPending || isUpdateTxLoading,
      isSuccess: updateIsSuccess,
      isError: updateIsError || updateTxError,
      error: updateError || updateTxErrorObj || null,
    }));
  }, [updateIsPending, isUpdateTxLoading, updateIsSuccess, updateIsError, updateTxError, updateError, updateTxErrorObj]);

  // Check if registered by checking if username exists (index 0)
  const isRegistered = useMemo(() => {
    if (!playerInfo) return false;
    const username = (playerInfo as any)[0];
    const result = !!(username && username.length > 0);
    console.log('Registration check:', { address, playerInfo, username, isRegistered: result });
    return result;
  }, [playerInfo, address]);

  const registerUsername = useCallback(async (username: string) => {
    setRegisterState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await registerUsernameAsync({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'registerUsername',
        args: [username],
      });
      return result;
    } catch (error) {
      setRegisterState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to register username')
      }));
      throw error;
    }
  }, [registerUsernameAsync]);

  const updateUsername = useCallback(async (username: string) => {
    setUpdateUsernameState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await updateUsernameAsync({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'updateUsername',
        args: [username],
        value: parseEther('0.001'),
      });
      return result;
    } catch (error) {
      setUpdateUsernameState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to update username')
      }));
      throw error;
    }
  }, [updateUsernameAsync]);

  return {
    playerInfo,
    isRegistered,
    registerUsername,
    registerState,
    updateUsername,
    updateUsernameState,
    isFetchingPlayerInfo,
    playerInfoError,
    refetchPlayerInfo,
  };
}

/**
 * Hook for starting and playing games
 */
export function useGameSession() {
  const { address } = useAccount();
  const [isFetchingSession, setIsFetchingSession] = useState(false);
  const [sessionError, setSessionError] = useState<Error | null>(null);
  const [submitState, setSubmitState] = useState<LoadingState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });
  const [startGameState, setStartGameState] = useState<LoadingState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  // Get player's session count
  const { 
    data: sessionCount, 
    refetch: refetchSessionCount,
    isFetching: isFetchingSessionCount,
    isError: isSessionCountError,
    error: sessionCountError
  } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getPlayerSessionCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get latest session ID
  const { 
    data: latestSessionId, 
    refetch: refetchLatestSession,
    isFetching: isFetchingLatestSession,
    isError: isLatestSessionError,
    error: latestSessionError
  } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getLatestSessionId',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Start a new game
  const {
    writeContractAsync: startGameAsync,
    data: startGameData,
    isPending: startGameIsPending,
    isError: startGameIsError,
    error: startGameError,
  } = useWriteContract();

  // Submit answers
  const {
    writeContractAsync: submitAnswersAsync,
    data: submitAnswersData,
    isPending: submitIsPending,
    isError: submitIsError,
    error: submitError,
  } = useWriteContract();

  // Track transaction status for start game
  const { 
    isSuccess: startGameIsSuccess, 
    isError: startGameTxError, 
    error: startGameTxErrorObj,
    isLoading: isStartGameTxLoading 
  } = useWaitForTransactionReceipt({
    hash: startGameData,
  });

  // Track transaction status for submit answers
  const { 
    isSuccess: submitIsSuccess, 
    isError: submitTxError, 
    error: submitTxErrorObj,
    isLoading: isSubmitTxLoading 
  } = useWaitForTransactionReceipt({
    hash: submitAnswersData,
  });

  // Update session loading state
  useEffect(() => {
    setIsFetchingSession(isFetchingSessionCount || isFetchingLatestSession);
    if (isSessionCountError || isLatestSessionError) {
      setSessionError(sessionCountError || latestSessionError || new Error('Failed to fetch session data'));
    } else if (sessionCountError === null && latestSessionError === null) {
      setSessionError(null);
    }
  }, [
    isFetchingSessionCount, 
    isFetchingLatestSession, 
    isSessionCountError, 
    isLatestSessionError, 
    sessionCountError, 
    latestSessionError
  ]);

  // Update start game state
  useEffect(() => {
    setStartGameState(prev => ({
      ...prev,
      isLoading: startGameIsPending || isStartGameTxLoading,
      isSuccess: startGameIsSuccess,
      isError: startGameIsError || startGameTxError,
      error: startGameError || startGameTxErrorObj || null,
    }));
  }, [
    startGameIsPending, 
    isStartGameTxLoading, 
    startGameIsSuccess, 
    startGameIsError, 
    startGameTxError, 
    startGameError, 
    startGameTxErrorObj
  ]);

  // Update submit answers state
  useEffect(() => {
    setSubmitState(prev => ({
      ...prev,
      isLoading: submitIsPending || isSubmitTxLoading,
      isSuccess: submitIsSuccess,
      isError: submitIsError || submitTxError,
      error: submitError || submitTxErrorObj || null,
    }));
  }, [
    submitIsPending, 
    isSubmitTxLoading, 
    submitIsSuccess, 
    submitIsError, 
    submitTxError, 
    submitError, 
    submitTxErrorObj
  ]);

  // Start a new game
  const startGame = useCallback(async () => {
    if (!address) throw new Error('No address connected');
    
    setStartGameState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      // Get random questions (mocked for now, should be replaced with actual question selection logic)
      const questions = getRandomQuestions(5);
      const questionIds = questions.map(q => q.id);
      
      const result = await startGameAsync({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'startGame',
        args: [questionIds],
      });
      
      // Refetch latest session after successful start
      if (result) {
        await refetchLatestSession();
      }
      
      return result;
    } catch (error) {
      setStartGameState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to start game')
      }));
      throw error;
    }
  }, [address, startGameAsync, refetchLatestSession]);

  const submitAnswers = useCallback(async (sessionId: number, answers: number[], timeSpent: number[]) => {
    if (!address) throw new Error('No address connected');
    if (answers.length !== timeSpent.length) {
      throw new Error('Answers and timeSpent arrays must have the same length');
    }
    
    setSubmitState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await submitAnswersAsync({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'submitAnswers',
        args: [sessionId, answers, timeSpent],
      });
      return result;
    } catch (error) {
      setSubmitState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to submit answers')
      }));
      throw error;
    }
  }, [address, submitAnswersAsync]);

  const getLatestSession = useCallback(() => {
    if (!latestSessionId) return 0;
    return Number(latestSessionId);
  }, [latestSessionId]);

  const getSessionCount = useCallback(() => {
    if (!sessionCount) return 0;
    return Number(sessionCount);
  }, [sessionCount]);

  return {
    // Start a new game session
    startGame,
    startGameState,
    
    // Submit answers
    submitAnswers,
    submitState,
    
    // Get latest session ID
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
  const [faucetState, setFaucetState] = useState<LoadingState>({
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  });

  // Check claim amount
  const { 
    data: claimAmount, 
    isFetching: isFetchingClaimAmount,
    isError: isClaimAmountError,
    error: claimAmountError,
    refetch: refetchClaimAmount 
  } = useReadContract({
    address: CONTRACTS.faucet?.address,
    abi: CONTRACTS.faucet?.abi,
    functionName: 'claimAmount',
  });

  // Check contract balance
  const { 
    data: contractBalance, 
    isFetching: isFetchingContractBalance,
    isError: isContractBalanceError,
    error: contractBalanceError,
    refetch: refetchContractBalance 
  } = useBalance({
    address: CONTRACTS.faucet?.address as `0x${string}`,
    token: CONTRACTS.USDC?.address as `0x${string}`,
  });

  // Claim function
  const {
    writeContractAsync: claimFaucetAsync,
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

  // Update faucet state based on data fetching status
  useEffect(() => {
    setFaucetState(prev => ({
      ...prev,
      isLoading: isFetchingClaimAmount || isFetchingContractBalance,
      isError: isClaimAmountError || isContractBalanceError,
      error: claimAmountError || contractBalanceError || null,
    }));
  }, [
    isFetchingClaimAmount, 
    isFetchingContractBalance, 
    isClaimAmountError, 
    isContractBalanceError, 
    claimAmountError, 
    contractBalanceError
  ]);

  // Update claim state
  useEffect(() => {
    setFaucetState(prev => ({
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

  const claim = useCallback(async () => {
    setFaucetState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await claimFaucetAsync({
        address: CONTRACTS.faucet?.address,
        abi: CONTRACTS.faucet?.abi,
        functionName: 'claim',
      });
      return result;
    } catch (error) {
      setFaucetState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to claim from faucet')
      }));
      throw error;
    }
  }, [claimFaucetAsync]);

  return {
    claim,
    claimState: faucetState,
    claimAmount: { 
      data: claimAmount,
      isLoading: isFetchingClaimAmount,
      error: isClaimAmountError ? claimAmountError : null,
      refetch: refetchClaimAmount 
    },
    contractBalance: { 
      data: contractBalance?.value,
      isLoading: isFetchingContractBalance,
      error: isContractBalanceError ? contractBalanceError : null,
      refetch: refetchContractBalance 
    },
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

  // Update rewards loading state
  useEffect(() => {
    setRewardsState(prev => ({
      ...prev,
      isLoading: isFetchingPendingRewards,
      isError: isPendingRewardsError,
      error: pendingRewardsError || null,
    }));
  }, [isFetchingPendingRewards, isPendingRewardsError, pendingRewardsError]);

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
      
      // Refetch pending rewards after successful claim
      if (result) {
        await refetchPendingRewards();
      }
      
      return result;
    } catch (error) {
      setClaimState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to claim rewards')
      }));
      throw error;
    }
  }, [claimRewardsAsync, refetchPendingRewards]);

  const claimSessionRewards = useCallback(async (sessionIds: bigint[]) => {
    setClaimSessionState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await claimSessionRewardsAsync({
        address: CONTRACTS.triviaGameV2.address,
        abi: CONTRACTS.triviaGameV2.abi,
        functionName: 'claimSessionRewards',
        args: [sessionIds],
      });
      
      // Refetch pending rewards after successful claim
      if (result) {
        await refetchPendingRewards();
      }
      
      return result;
    } catch (error) {
      setClaimSessionState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to claim session rewards')
      }));
      throw error;
    }
  }, [claimSessionRewardsAsync, refetchPendingRewards]);

  return {
    pendingRewards: pendingRewards ? formatEther(pendingRewards as bigint) : '0',
    unclaimedSessions: [],
    rewardsState,
    claimRewards,
    claimState,
    claimSessionRewards,
    claimSessionState,
    refetchPendingRewards,
  };
}

/**
 * Hook for leaderboard
 */
export function useLeaderboard(count: number = 10) {
  const [leaderboardState, setLeaderboardState] = useState<LoadingState>({
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const { 
    data: leaderboardData, 
    refetch: refetchLeaderboard,
    isFetching: isFetchingLeaderboard,
    isError: isLeaderboardError,
    error: leaderboardError,
  } = useReadContract({
    address: CONTRACTS.triviaGameV2.address,
    abi: CONTRACTS.triviaGameV2.abi,
    functionName: 'getLeaderboard',
    args: [BigInt(count)],
    query: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  });

  // Update leaderboard state
  useEffect(() => {
    setLeaderboardState(prev => ({
      ...prev,
      isLoading: isFetchingLeaderboard,
      isError: isLeaderboardError,
      error: leaderboardError || null,
      isSuccess: !isFetchingLeaderboard && !isLeaderboardError && !!leaderboardData,
    }));
  }, [isFetchingLeaderboard, isLeaderboardError, leaderboardError, leaderboardData]);

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

  const refetch = useCallback(async () => {
    setLeaderboardState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
    try {
      const result = await refetchLeaderboard();
      setLeaderboardState(prev => ({
        ...prev,
        isLoading: false,
        isSuccess: true,
        isError: result.isError,
        error: result.error || null,
      }));
      return result;
    } catch (error) {
      setLeaderboardState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to fetch leaderboard'),
      }));
      throw error;
    }
  }, [refetchLeaderboard]);

  return {
    leaderboardData: transformedData,
    leaderboardState,
    refetchLeaderboard: refetch,
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
 * Hook for ETH balance on Base
 */
export function useEthBalance() {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
  });

  return {
    balance: balance?.value ? formatEther(balance.value) : '0',
    formatted: balance?.formatted || '0',
    symbol: balance?.symbol || 'ETH',
    refetchBalance,
  };
}


