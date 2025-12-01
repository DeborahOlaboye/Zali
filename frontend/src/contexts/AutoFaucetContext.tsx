import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { useAutoFaucet } from '@/hooks/useAutoFaucet';
import { FaucetPrompt } from '@/components/FaucetPrompt';

interface AutoFaucetContextType {
  checkBalance: (balance: number | undefined) => boolean;
  triggerAutoClaim: () => void;
}

const AutoFaucetContext = createContext<AutoFaucetContextType | undefined>(undefined);

export function AutoFaucetProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}`,
    token: CONTRACTS.cUSD.address as `0x${string}`,
  });

  // Set up polling to check balance periodically
  useEffect(() => {
    if (!address) return;
    
    const interval = setInterval(() => {
      refetchBalance();
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [address, refetchBalance]);

  const {
    showFaucetPrompt,
    isAutoClaiming,
    hasClaimed,
    checkBalance,
    triggerAutoClaim,
    cancelAutoClaim,
  } = useAutoFaucet();

  // Check balance when it changes
  useEffect(() => {
    if (balance !== undefined) {
      const balanceInCUSD = Number(balance.formatted);
      if (!checkBalance(balanceInCUSD) && address) {
        triggerAutoClaim();
      }
    }
  }, [balance, address, checkBalance, triggerAutoClaim]);

  return (
    <AutoFaucetContext.Provider value={{ checkBalance, triggerAutoClaim }}>
      {children}
      <FaucetPrompt
        isVisible={showFaucetPrompt}
        isClaiming={isAutoClaiming}
        hasClaimed={hasClaimed}
        onCancel={cancelAutoClaim}
      />
    </AutoFaucetContext.Provider>
  );
}

export function useAutoFaucetContext() {
  const context = useContext(AutoFaucetContext);
  if (context === undefined) {
    throw new Error('useAutoFaucetContext must be used within an AutoFaucetProvider');
  }
  return context;
}
