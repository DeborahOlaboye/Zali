import { useContractRead, useContractWrite, useWaitForTransaction, useAccount, useBalance } from 'wagmi';
import { CONTRACTS, GameState } from '@/config/contracts';
import { parseEther } from 'viem';
import { useState, useEffect } from 'react';

// Faucet Hook
export function useFaucet() {
  const { address } = useAccount();
  
  // Check if user has claimed
  const { data: hasClaimed } = useContractRead({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'hasClaimed',
    args: address ? [address] : undefined,
    enabled: !!address,
  });

  // Get contract balance
  const { data: contractBalance } = useContractRead({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'getContractBalance',
  });

  // Claim function
  const { 
    write: claim, 
    data: claimData, 
    isLoading: claimIsLoading,
    isError: claimIsError,
  } = useContractWrite({
    address: CONTRACTS.faucet.address,
    abi: CONTRACTS.faucet.abi,
    functionName: 'claim',
  });

  // Wait for transaction
  const { isSuccess: claimIsSuccess } = useWaitForTransaction({
    hash: claimData?.hash,
  });

  return {
    claim,
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    hasClaimed: hasClaimed as boolean,
    contractBalance,
    claimAmount: parseEther('10'), // 10 cUSD
  };
}

// TriviaGame Hook
export function useTriviaGame(gameId?: number) {
  const { address } = useAccount();
  
  // Get game info
  const { data: gameInfo, refetch: refetchGameInfo } = useContractRead({
    address: CONTRACTS.triviaGame.address,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'games',
    args: gameId !== undefined ? [BigInt(gameId)] : undefined,
    enabled: gameId !== undefined,
    watch: true,
  });

  // Get game state
  const { data: gameState } = useContractRead({
    address: CONTRACTS.triviaGame.address,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'getGameState',
    args: gameId !== undefined ? [BigInt(gameId)] : undefined,
    enabled: gameId !== undefined,
  });

  // Get prize pool
  const { data: prizePool } = useContractRead({
    address: CONTRACTS.triviaGame.address,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'getGamePrizePool',
    args: gameId !== undefined ? [BigInt(gameId)] : undefined,
    enabled: gameId !== undefined,
  });

  // Get players
  const { data: players } = useContractRead({
    address: CONTRACTS.triviaGame.address,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'getPlayers',
    args: gameId !== undefined ? [BigInt(gameId)] : undefined,
    enabled: gameId !== undefined,
  });

  // Check if player has joined
  const { data: hasJoined } = useContractRead({
    address: CONTRACTS.triviaGame.address,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'hasPlayerJoined',
    args: gameId !== undefined && address ? [BigInt(gameId), address] : undefined,
    enabled: gameId !== undefined && !!address,
  });

  // Join game function
  const { 
    write: joinGame, 
    data: joinData, 
    isLoading: joinIsLoading,
    isError: joinIsError,
  } = useContractWrite({
    address: CONTRACTS.triviaGame.address,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'joinGame',
  });

  // Wait for join transaction
  const { isSuccess: joinIsSuccess } = useWaitForTransaction({
    hash: joinData?.hash,
  });

  return {
    gameInfo,
    gameState: gameState as GameState,
    prizePool,
    players: players as `0x${string}`[],
    hasJoined: hasJoined as boolean,
    joinGame,
    joinIsLoading,
    joinIsSuccess,
    joinIsError,
    refetchGameInfo,
  };
}

// Auto-faucet hook - checks balance and claims if needed
export function useAutoFaucet() {
  const { address } = useAccount();
  const { claim, claimIsLoading, claimIsSuccess, hasClaimed } = useFaucet();
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    token: CONTRACTS.cUSD.address,
    watch: true,
  });

  const [needsClaim, setNeedsClaim] = useState(false);
  const ENTRY_FEE = parseEther('0.1'); // 0.1 cUSD

  useEffect(() => {
    if (balance && balance.value < ENTRY_FEE && !hasClaimed) {
      setNeedsClaim(true);
    } else {
      setNeedsClaim(false);
    }
  }, [balance, hasClaimed, ENTRY_FEE]);

  const autoClaimIfNeeded = async () => {
    if (needsClaim && !hasClaimed && claim) {
      await claim();
      return true;
    }
    return false;
  };

  return {
    needsClaim,
    hasClaimed,
    balance: balance?.value,
    autoClaimIfNeeded,
    claimIsLoading,
    claimIsSuccess,
  };
}
