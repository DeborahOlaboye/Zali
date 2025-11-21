'use client';

import { useEffect } from 'react';
import { useRewards, useCeloBalance, usePlayerRegistration } from '@/hooks/useContract';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RewardsPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { isRegistered, playerInfo } = usePlayerRegistration();
  const { 
    pendingRewards, 
    unclaimedSessions, 
    claimRewards, 
    claimIsLoading, 
    claimIsSuccess,
    claimIsError,
    claimError,
    refetchPendingRewards,
  } = useRewards();
  const { balance, refetchBalance } = useCeloBalance();

  // Handle claim success
  useEffect(() => {
    if (claimIsSuccess) {
      toast.success('Rewards claimed successfully! 🎉');
      refetchPendingRewards();
      refetchBalance();
    }
  }, [claimIsSuccess, refetchPendingRewards, refetchBalance]);

  // Handle claim error
  useEffect(() => {
    if (claimIsError && claimError) {
      toast.error(claimError.message || 'Failed to claim rewards');
    }
  }, [claimIsError, claimError]);

  const handleClaimRewards = async () => {
    if (Number(pendingRewards) === 0) {
      toast.error('No rewards to claim');
      return;
    }

    try {
      toast.loading('Claiming rewards... Please confirm the transaction', {
        duration: 60000,
      });
      claimRewards();
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      toast.dismiss();
      toast.error(error?.message || 'Failed to claim rewards');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600">
            Please connect your wallet to view your rewards
          </p>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Registration Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need to register before you can earn rewards
          </p>
          <button
            onClick={() => router.push('/register')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Register Now
          </button>
        </div>
      </div>
    );
  }

  const username = playerInfo?.[0] as string || '';
  const totalScore = playerInfo?.[1] as bigint || 0n;
  const gamesPlayed = playerInfo?.[2] as bigint || 0n;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Rewards
          </h1>
          <p className="text-gray-600 text-lg">
            Claim your earned CELO rewards
          </p>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">Player</p>
            <h2 className="text-2xl font-bold text-gray-900">{username}</h2>
          </div>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">CELO Balance</h2>
              <div className="text-3xl">💎</div>
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">{balance} CELO</p>
            <p className="text-sm text-gray-600">Your current wallet balance</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-2xl shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pending Rewards</h2>
              <div className="text-3xl">🎁</div>
            </div>
            <p className="text-4xl font-bold mb-2">{pendingRewards} CELO</p>
            <p className="text-sm text-green-100">Ready to claim</p>
          </motion.div>
        </div>

        {/* Claim Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-2xl shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Claim Your Rewards</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Unclaimed Games:</span>
              <span className="font-bold text-gray-900">{unclaimedSessions.length}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total Pending:</span>
              <span className="font-bold text-green-600 text-xl">{pendingRewards} CELO</span>
            </div>
          </div>

          <button
            onClick={handleClaimRewards}
            disabled={claimIsLoading || Number(pendingRewards) === 0}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {claimIsLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Claiming...
              </span>
            ) : Number(pendingRewards) === 0 ? (
              'No Rewards to Claim'
            ) : (
              `Claim ${pendingRewards} CELO`
            )}
          </button>

          {claimIsSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center"
            >
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-green-800 font-semibold">
                Rewards claimed successfully!
              </p>
              <p className="text-green-600 text-sm mt-1">
                CELO has been sent to your wallet
              </p>
            </motion.div>
          )}

          {Number(pendingRewards) === 0 && (
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800">
                No pending rewards. Play more games to earn CELO!
              </p>
              <button
                onClick={() => router.push('/play')}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Play Now
              </button>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Score</p>
              <p className="text-2xl font-bold text-purple-600">{totalScore.toString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Games Played</p>
              <p className="text-2xl font-bold text-blue-600">{gamesPlayed.toString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Unclaimed</p>
              <p className="text-2xl font-bold text-green-600">{unclaimedSessions.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How Rewards Work</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Earn 0.01 CELO for each correct answer</li>
                <li>• Get 0.05 CELO bonus for perfect score (10/10)</li>
                <li>• Earn up to 0.02 CELO speed bonus for fast answers</li>
                <li>• Maximum 0.17 CELO per game</li>
                <li>• Claim rewards anytime - they never expire!</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
