import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useFaucet } from './useContract';
import { toast } from 'react-hot-toast';

const MIN_BALANCE = 0.1; // Minimum balance in cUSD before showing faucet prompt
const AUTO_CLAIM_DELAY = 5000; // 5 seconds delay before auto-claiming

export function useAutoFaucet() {
  const { address } = useAccount();
  const { claim, claimIsLoading, claimIsSuccess } = useFaucet();
  const [showFaucetPrompt, setShowFaucetPrompt] = useState(false);
  const [isAutoClaiming, setIsAutoClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  // Check if user has sufficient balance
  const checkBalance = (balance: number | undefined) => {
    if (balance === undefined) return false;
    return balance >= MIN_BALANCE;
  };

  // Auto-claim function with delay
  const triggerAutoClaim = useCallback(() => {
    if (isAutoClaiming || !address) return;
    
    // Don't show prompt if already claimed recently
    if (localStorage.getItem('hasClaimedFaucet') === 'true') return;
    
    setShowFaucetPrompt(true);
    setIsAutoClaiming(true);
    
    // Show prompt for a moment before auto-claiming
    const timer = setTimeout(async () => {
      try {
        const tx = await claim?.();
        if (tx) {
          setHasClaimed(true);
          localStorage.setItem('hasClaimedFaucet', 'true');
          toast.success('cUSD has been added to your wallet!');
          // Hide the prompt after successful claim
          setTimeout(() => setShowFaucetPrompt(false), 3000);
        }
      } catch (error: any) {
        console.error('Auto-claim failed:', error);
        toast.error(error?.message || 'Failed to claim cUSD. Please try again.');
      } finally {
        setIsAutoClaiming(false);
      }
    }, AUTO_CLAIM_DELAY);

    return () => clearTimeout(timer);
  }, [isAutoClaiming, address, claim]);

  // Reset state when wallet disconnects or connects
  useEffect(() => {
    if (!address) {
      setShowFaucetPrompt(false);
      setIsAutoClaiming(false);
      setHasClaimed(false);
    } else {
      // Reset the claim status if it's a new wallet
      const lastClaimedWallet = localStorage.getItem('lastClaimedWallet');
      if (lastClaimedWallet !== address) {
        localStorage.removeItem('hasClaimedFaucet');
        localStorage.setItem('lastClaimedWallet', address);
      }
    }
  }, [address]);

  // Handle claim success
  useEffect(() => {
    if (claimIsSuccess) {
      setHasClaimed(true);
      const timer = setTimeout(() => {
        setShowFaucetPrompt(false);
        setHasClaimed(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [claimIsSuccess]);

  return {
    showFaucetPrompt,
    isAutoClaiming,
    hasClaimed,
    checkBalance,
    triggerAutoClaim,
    cancelAutoClaim: () => {
      setShowFaucetPrompt(false);
      setIsAutoClaiming(false);
    }
  };
}
