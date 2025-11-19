import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';

export function useFaucet() {
  const claimAmount = useContractRead({
    address: CONTRACTS.faucet.address as `0x${string}`,
    abi: CONTRACTS.faucet.abi,
    functionName: 'CLAIM_AMOUNT',
  });

  const contractBalance = useContractRead({
    address: CONTRACTS.faucet.address as `0x${string}`,
    abi: CONTRACTS.faucet.abi,
    functionName: 'getContractBalance',
  });

  const { config: claimConfig } = usePrepareContractWrite({
    address: CONTRACTS.faucet.address as `0x${string}`,
    abi: CONTRACTS.faucet.abi,
    functionName: 'claim',
  });

  const claim = useContractWrite(claimConfig);
  const claimTx = useWaitForTransaction({ hash: claim.data?.hash });

  return {
    claimAmount,
    contractBalance,
    claim: claim.write,
    claimIsLoading: claim.isLoading || claimTx.isLoading,
    claimIsSuccess: claimTx.isSuccess,
    claimError: claim.error || claimTx.error,
  };
}

export function useTriviaGame() {
  const createGameConfig = usePrepareContractWrite({
    address: CONTRACTS.triviaGame.address as `0x${string}`,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'createGame',
  });

  const createGame = useContractWrite(createGameConfig.config);
  const createGameTx = useWaitForTransaction({ hash: createGame.data?.hash });

  const joinGameConfig = usePrepareContractWrite({
    address: CONTRACTS.triviaGame.address as `0x${string}`,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'joinGame',
  });

  const joinGame = useContractWrite(joinGameConfig.config);
  const joinGameTx = useWaitForTransaction({ hash: joinGame.data?.hash });

  const completeGameConfig = usePrepareContractWrite({
    address: CONTRACTS.triviaGame.address as `0x${string}`,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'completeGame',
  });

  const completeGame = useContractWrite(completeGameConfig.config);
  const completeGameTx = useWaitForTransaction({ hash: completeGame.data?.hash });

  const cancelGameConfig = usePrepareContractWrite({
    address: CONTRACTS.triviaGame.address as `0x${string}`,
    abi: CONTRACTS.triviaGame.abi,
    functionName: 'cancelGame',
  });

  const cancelGame = useContractWrite(cancelGameConfig.config);
  const cancelGameTx = useWaitForTransaction({ hash: cancelGame.data?.hash });

  return {
    // Create game
    createGame: createGame.write,
    createGameIsLoading: createGame.isLoading || createGameTx.isLoading,
    createGameIsSuccess: createGameTx.isSuccess,
    createGameError: createGame.error || createGameTx.error,
    
    // Join game
    joinGame: joinGame.write,
    joinGameIsLoading: joinGame.isLoading || joinGameTx.isLoading,
    joinGameIsSuccess: joinGameTx.isSuccess,
    joinGameError: joinGame.error || joinGameTx.error,
    
    // Complete game
    completeGame: completeGame.write,
    completeGameIsLoading: completeGame.isLoading || completeGameTx.isLoading,
    completeGameIsSuccess: completeGameTx.isSuccess,
    completeGameError: completeGame.error || completeGameTx.error,
    
    // Cancel game
    cancelGame: cancelGame.write,
    cancelGameIsLoading: cancelGame.isLoading || cancelGameTx.isLoading,
    cancelGameIsSuccess: cancelGameTx.isSuccess,
    cancelGameError: cancelGame.error || cancelGameTx.error,
  };
}

export function useCUSD() {
  const balanceOf = (address: `0x${string}`) => {
    return useContractRead({
      address: CONTRACTS.cUSD.address as `0x${string}`,
      abi: CONTRACTS.cUSD.abi,
      functionName: 'balanceOf',
      args: [address],
    });
  };

  const approveConfig = usePrepareContractWrite({
    address: CONTRACTS.cUSD.address as `0x${string}`,
    abi: CONTRACTS.cUSD.abi,
    functionName: 'approve',
  });

  const approve = useContractWrite(approveConfig.config);
  const approveTx = useWaitForTransaction({ hash: approve.data?.hash });

  return {
    balanceOf,
    approve: approve.write,
    approveIsLoading: approve.isLoading || approveTx.isLoading,
    approveIsSuccess: approveTx.isSuccess,
    approveError: approve.error || approveTx.error,
  };
}
