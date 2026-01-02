'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { useFaucet } from '@/hooks/useContract';
import { LoadingButton, useLoading } from '@/components/loading';

export default function FaucetPage() {
  const { address } = useAccount();
  const { setLoading, clearLoading } = useLoading({ component: 'faucet-page' });
  const { 
    claim, 
    claimIsLoading, 
    claimIsSuccess, 
    claimAmount, 
    contractBalance 
  } = useFaucet();
  
  const { data: cUSDBalance } = useBalance({
    address: address as `0x${string}`,
    token: CONTRACTS.cUSD.address as `0x${string}`,
    watch: true,
  });

  const [isClaimed, setIsClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (claimIsSuccess) {
      setIsClaimed(true);
      const timer = setTimeout(() => setIsClaimed(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [claimIsSuccess]);

  const handleClaim = async () => {
    setError(null);
    setLoading(true, 'Claiming cUSD tokens...', 25);
    
    try {
      setLoading(true, 'Processing transaction...', 50);
      await claim?.();
      setLoading(true, 'Transaction successful!', 100);
      clearLoading();
    } catch (err: any) {
      clearLoading();
      setError(err.message || 'Failed to claim cUSD');
    }
  };

  const formatAmount = (amount: bigint | undefined) => {
    if (!amount) return '0';
    // Convert from wei to cUSD (18 decimals)
    return (Number(amount) / 1e18).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Celo Faucet</h1>
          <p className="text-gray-400 mb-8">Get test cUSD to start playing Celo Trivia</p>
          
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Your cUSD Balance</span>
                <span>{formatAmount(cUSDBalance?.value)} cUSD</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (Number(cUSDBalance?.value || 0) / 1e18) * 10)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Claim Amount:</span>
                <span className="font-medium">
                  {claimAmount.data ? formatAmount(claimAmount.data) : '0'} cUSD
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Faucet Balance:</span>
                <span>{contractBalance.data ? formatAmount(contractBalance.data) : '0'} cUSD</span>
              </div>
            </div>
            
            <LoadingButton
              onClick={handleClaim}
              disabled={!address || isClaimed}
              isLoading={claimIsLoading}
              loadingText="Claiming..."
              variant="secondary"
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {!address 
                ? 'Connect Wallet to Claim' 
                : isClaimed 
                  ? 'Claimed!'
                  : 'Claim cUSD'}
            </LoadingButton>
            
            {error && (
              <div className="mt-4 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {isClaimed && (
              <div className="mt-4 text-green-400 text-sm">
                Success! Your cUSD will be in your wallet shortly.
              </div>
            )}
          </div>
          
          <div className="mt-12 text-left max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">How to get cUSD</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Make sure your wallet is connected to the Celo Sepolia testnet.</li>
              <li>Click the "Claim cUSD" button to receive test tokens.</li>
              <li>You can claim once per wallet address.</li>
              <li>Use these tokens to enter trivia games and win more!</li>
            </ol>
            
            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h3 className="font-medium text-blue-400 mb-2">Need more help?</h3>
              <p className="text-sm text-blue-300">
                If you're having trouble getting cUSD, join our community for assistance.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
