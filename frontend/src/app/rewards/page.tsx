'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowPathIcon, 
  CheckCircleIcon, 
  GiftIcon, 
  TrophyIcon, 
  ClockIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useRewards, usePlayerRegistration, useLeaderboard } from '@/hooks/useContract';
import { useMiniPay } from '@/hooks/useMiniPay';
import { useCUSDBalance } from '@/hooks/useCUSDBalance';
import { MiniPayRewards } from '@/components/MiniPayRewards';
import { RewardCard } from '@/components/RewardCard';
import { RewardItem } from '@/components/RewardItem';
import { Leaderboard } from '@/components/Leaderboard';
import { PointsHistory } from '@/components/PointsHistory';

// Mock data for rewards (replace with actual data from your contract)
const AVAILABLE_REWARDS = [
  {
    id: 1,
    name: 'Starter Pack',
    description: 'Get a boost to start your journey',
    pointsRequired: 100,
    isClaimed: false,
  },
  {
    id: 2,
    name: 'Power Player',
    description: 'Unlock exclusive games and features',
    pointsRequired: 500,
    isClaimed: false,
  },
  {
    id: 3,
    name: 'Elite Status',
    description: 'Access to premium content and early features',
    pointsRequired: 1000,
    isClaimed: false,
  },
  {
    id: 4,
    name: 'Crypto Whiz',
    description: 'Special NFT badge for top players',
    pointsRequired: 5000,
    isClaimed: false,
  },
];

// Mock points history (replace with actual data from your contract)
const MOCK_POINTS_HISTORY = [
  {
    id: '1',
    type: 'game',
    points: 50,
    description: 'Completed Trivia Challenge #42',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: 'completed',
  },
  {
    id: '2',
    type: 'bonus',
    points: 10,
    description: 'Daily Login Bonus',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: 'completed',
  },
  {
    id: '3',
    type: 'reward',
    points: -100,
    description: 'Redeemed Starter Pack',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: 'completed',
  },
];

// Calculate level based on points
const calculateLevel = (points: number) => {
  return Math.floor(points / 100) + 1; // 100 points per level
};

// Calculate progress to next level
const calculateProgress = (points: number) => {
  const currentLevelPoints = Math.floor(points / 100) * 100;
  return ((points - currentLevelPoints) / 100) * 100;
};

export default function RewardsPage() {
  const { address, isConnected } = useAccount();
  const { isMiniPay, isLoading: miniPayLoading } = useMiniPay();
  const { balance, refetchBalance } = useCUSDBalance();
  const { isRegistered, playerInfo } = usePlayerRegistration();
  
  const {
    pendingRewards,
    claimRewards,
    claimIsLoading,
    claimIsSuccess,
    claimIsError,
    claimError,
    refetchPendingRewards,
  } = useRewards();

  // Get leaderboard data
  const { leaderboardData, refetchLeaderboard } = useLeaderboard(10);
  
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState<number | null>(null);
  const [rewards, setRewards] = useState(AVAILABLE_REWARDS);
  const [activeTab, setActiveTab] = useState<'rewards' | 'leaderboard' | 'history'>('rewards');

  // Calculate points and level
  const points = parseInt(pendingRewards || '0', 10);
  const level = calculateLevel(points);
  const progress = calculateProgress(points);
  const pointsToNextLevel = (level * 100) - points;

  // Handle successful claim
  useEffect(() => {
    if (claimIsSuccess && isClaimingRewards) {
      toast.success('🎉 Rewards claimed successfully!');
      setIsClaimingRewards(false);
      refetchPendingRewards();
      refetchBalance();
      refetchLeaderboard();
    }
  }, [claimIsSuccess, isClaimingRewards, refetchPendingRewards, refetchBalance, refetchLeaderboard]);

  // Handle claim error
  useEffect(() => {
    if (claimIsError && isClaimingRewards) {
      toast.error(claimError?.message || 'Failed to claim rewards');
      setIsClaimingRewards(false);
    }
  }, [claimIsError, claimError, isClaimingRewards]);

  // Handle reward redemption
  const handleRedeemReward = async (rewardId: number) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    if (points < reward.pointsRequired) {
      toast.error('Not enough points to redeem this reward');
      return;
    }
    
    try {
      setIsRedeeming(rewardId);
      
      // Simulate API call to redeem reward
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update rewards to mark as claimed
      setRewards(prev => 
        prev.map(r => 
          r.id === rewardId ? { ...r, isClaimed: true } : r
        )
      );
      
      toast.success(`🎉 Successfully redeemed ${reward.name}!`);
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      toast.error('Failed to redeem reward. Please try again.');
    } finally {
      setIsRedeeming(null);
    }
  };

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
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {playerInfo && playerInfo[0] ? playerInfo[0] : 'Player'}
                  </h3>
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