import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';

export function useFaucet() {
  const claimAmount = useReadContract({
    address: CONTRACTS.faucet.address as `0x${string}`,
    abi: CONTRACTS.faucet.abi,
    functionName: 'claimAmount', // Fixed function name
  });

  const contractBalance = useReadContract({
    address: CONTRACTS.faucet.address as `0x${string}`,
    abi: CONTRACTS.faucet.abi,
    functionName: 'getContractBalance',
  });

  const { 
    writeContract: claim, 
    isPending: isClaimPending, 
    error: claimError,
    data: claimHash 
  } = useWriteContract();

  const { 
    isLoading: isClaimConfirming, 
    isSuccess: isClaimConfirmed 
  } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const handleClaim = () => {
    claim({
      address: CONTRACTS.faucet.address as `0x${string}`,
      abi: CONTRACTS.faucet.abi,
      functionName: 'claim',
    });
  };

  return {
    claimAmount,
    contractBalance,
    claim: handleClaim,
    claimIsLoading: isClaimPending || isClaimConfirming,
    claimIsSuccess: isClaimConfirmed,
    claimError,
  };
}