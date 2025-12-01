'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, ArrowRightIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useRewards, usePlayerRegistration } from '@/hooks/useContract';
import { useMiniPay } from '@/hooks/useMiniPay';
import { useCUSDBalance } from '@/hooks/useCUSDBalance';
import { MiniPayRewards } from '@/components/MiniPayRewards';
import { RewardCard } from '@/components/RewardCard';

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
      if (!isMiniPay) {
        toast.error('Reward claims are only available through MiniPay');
        setIsClaimingRewards(false);
        return;
      }
      
      toast.loading('Processing reward claim via MiniPay...', { duration: 10000 });
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

  // Calculate progress percentage for the progress bar
  const progressPercentage = Math.min(100, (parseFloat(pendingRewards) / 0.17) * 100);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🏆 Your Rewards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track and claim your cUSD rewards earned from trivia games
          </p>
          
          <AnimatePresence>
            {isMiniPay && !miniPayLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Connected via MiniPay
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* MiniPay Rewards Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MiniPayRewards />
        </motion.div>

        {/* Rewards Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rewards Dashboard</h2>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to Next Reward</span>
                <span>{pendingRewards} cUSD / 0.17 cUSD</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <RewardCard
                icon="🎁"
                title="Pending Rewards"
                amount={`${pendingRewards} cUSD`}
                description="Available to claim now"
                color="text-green-500"
              />
              
              <RewardCard
                icon="💳"
                title="Wallet Balance"
                amount={`${parseFloat(balance).toFixed(4)} cUSD`}
                description="Current balance"
                color="text-blue-500"
              />
            </div>

            {/* Claim Button */}
            <div className="mt-2">
              <button
                onClick={handleClaimRewards}
                disabled={!isMiniPay || claimIsLoading || isClaimingRewards || parseFloat(pendingRewards) <= 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
                  !isMiniPay || claimIsLoading || isClaimingRewards || parseFloat(pendingRewards) <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-95'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {claimIsLoading || isClaimingRewards ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : !isMiniPay ? (
                    <span>🔒 Connect MiniPay to Claim</span>
                  ) : parseFloat(pendingRewards) <= 0 ? (
                    <span>No Rewards to Claim</span>
                  ) : (
                    <>
                      <span>Claim {pendingRewards} cUSD</span>
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
              
              {!isMiniPay && (
                <p className="mt-3 text-sm text-center text-amber-600 flex items-center justify-center gap-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  MiniPay is required to claim rewards
                </p>
              )}
            </div>
          </div>
          
          {/* Rewards Info Section */}
          <div className="bg-gray-50 border-t border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 How to Earn More</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RewardCard
                icon="✅"
                title="Correct Answers"
                amount="0.01 cUSD"
                description="Per correct answer"
                color="text-green-500"
              />
              <RewardCard
                icon="🎯"
                title="Perfect Score"
                amount="0.05 cUSD"
                description="Bonus for 10/10 correct"
                color="text-purple-500"
              />
              <RewardCard
                icon="⚡"
                title="Speed Bonus"
                amount="Up to 0.02 cUSD"
                description="Faster answers = More rewards"
                color="text-blue-500"
              />
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Maximum Earnings Per Game</h4>
                  <p className="text-sm text-gray-500">Perfect score + Max speed bonus</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">0.17 cUSD</div>
                  <div className="text-xs text-gray-500">10 × 0.01 + 0.05 + 0.02</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Your Activity</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Last Reward Claimed</h4>
                  <p className="text-sm text-gray-500">
                    {claimIsSuccess ? 'Just now' : 'No recent claims'}
                  </p>
                </div>
              </div>
              {claimIsSuccess && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  +{pendingRewards} cUSD
                </span>
              )}
            </div>
            
            <div className="p-4 text-center text-gray-500 text-sm">
              <p>Complete more trivia games to see your activity history</p>
              <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                Play Now →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}