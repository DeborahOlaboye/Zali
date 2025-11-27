'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRewards, usePlayerRegistration } from '@/hooks/useContract';
import { useMiniPay } from '@/hooks/useMiniPay';
import { useCUSDBalance } from '@/hooks/useCUSDBalance';
import { MiniPayRewards } from '@/components/MiniPayRewards';

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const { isMiniPay, isLoading: miniPayLoading } = useMiniPay();
  const { balance, refetchBalance } = useCUSDBalance();
  const { isRegistered } = usePlayerRegistration();
  
  const {
    pendingRewards,
    claimRewards,
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    claimError,
    refetchPendingRewards,
  } = useRewards();

  const [isClaimingRewards, setIsClaimingRewards] = useState(false);

  // Handle successful claim
  useEffect(() => {
    if (claimIsSuccess && isClaimingRewards) {
      toast.success('🎉 Rewards claimed successfully!');
      setIsClaimingRewards(false);
      refetchPendingRewards();
      refetchBalance();
    }
  }, [claimIsSuccess, isClaimingRewards, refetchPendingRewards, refetchBalance]);

  // Handle claim error
  useEffect(() => {
    if (claimIsError && isClaimingRewards) {
      toast.error(claimError?.message || 'Failed to claim rewards');
      setIsClaimingRewards(false);
    }
  }, [claimIsError, claimError, isClaimingRewards]);

  const handleClaimRewards = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!isRegistered) {
      toast.error('Please register a username first');
      return;
    }

    if (parseFloat(pendingRewards) <= 0) {
      toast.error('No rewards to claim');
      return;
    }

    setIsClaimingRewards(true);
    
    try {
      if (isMiniPay) {
        toast.loading('Processing reward claim via MiniPay...', { duration: 10000 });
      } else {
        toast.loading('Please confirm the transaction in your wallet...', { duration: 10000 });
      }
      
      await claimRewards();
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      toast.dismiss();
      toast.error(error?.message || 'Failed to claim rewards');
      setIsClaimingRewards(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600">
            Please connect your wallet to view and claim rewards
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            💰 Your Rewards
          </h1>
          <p className="text-gray-600 text-lg">
            Claim your earned CELO rewards from trivia games
          </p>
          
          {isMiniPay && !miniPayLoading && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Connected via MiniPay
            </div>
          )}
        </motion.div>

        {/* MiniPay Rewards Component */}
        <MiniPayRewards />

        {/* Rewards Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pending Rewards */}
            <div className="text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pending Rewards
              </h2>
              <div className="text-4xl font-bold text-green-600 mb-4">
                {pendingRewards} cUSD
              </div>
              <p className="text-gray-600 text-sm">
                Earned from trivia games
              </p>
            </div>

            {/* Current Balance */}
            <div className="text-center">
              <div className="text-6xl mb-4">💳</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Wallet Balance
              </h2>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {parseFloat(balance).toFixed(4)} cUSD
              </div>
              <p className="text-gray-600 text-sm">
                Current wallet balance
              </p>
            </div>
          </div>

          {/* Claim Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleClaimRewards}
              disabled={claimIsLoading || isClaimingRewards || parseFloat(pendingRewards) <= 0}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform ${
                claimIsLoading || isClaimingRewards || parseFloat(pendingRewards) <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {claimIsLoading || isClaimingRewards ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isMiniPay ? 'Processing via MiniPay...' : 'Claiming Rewards...'}
                </span>
              ) : parseFloat(pendingRewards) <= 0 ? (
                'No Rewards to Claim'
              ) : (
                `Claim ${pendingRewards} cUSD`
              )}
            </button>
          </div>

          {/* MiniPay Info */}
          {isMiniPay && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 text-blue-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">
                  💡 MiniPay Tip: Rewards are paid in cUSD and gas fees are automatically paid in cUSD
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* How Rewards Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🎯 How Rewards Work
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-semibold text-gray-900 mb-2">Per Correct Answer</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">0.01 cUSD</p>
              <p className="text-sm text-gray-600">Earn for each right answer</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Perfect Score</h3>
              <p className="text-2xl font-bold text-purple-600 mb-1">0.05 cUSD</p>
              <p className="text-sm text-gray-600">Bonus for 10/10 correct</p>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Speed Bonus</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">Up to 0.02 cUSD</p>
              <p className="text-sm text-gray-600">Answer faster for more!</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
            <h3 className="font-bold text-gray-900 mb-3 text-center">💰 Maximum Earnings Per Game</h3>
            <div className="text-center">
              <span className="text-3xl font-bold text-green-600">0.17 cUSD</span>
              <p className="text-sm text-gray-600 mt-1">
                (10 correct × 0.01) + (perfect bonus 0.05) + (max speed bonus 0.02)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}