import { useAccount, useBalance } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { formatEther } from 'viem';

export function useCUSDBalance() {
  const { address } = useAccount();

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
    token: CONTRACTS.cUSD.address,
    watch: true,
  });

  return {
    balance: balance?.value ? formatEther(balance.value) : '0',
    formatted: balance?.formatted || '0',
    symbol: 'cUSD',
    refetchBalance,
    raw: balance?.value,
  };
}