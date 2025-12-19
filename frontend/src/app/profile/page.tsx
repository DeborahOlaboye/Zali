'use client';

import { useState, useEffect } from 'react';
import { usePlayerRegistration, useRewards, useCeloBalance } from '@/hooks/useContract';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sanitizeUsername } from '@/utils/sanitize';
import { PlayerInfoSkeleton, StatsCardSkeleton } from '@/components/skeletons';

export default function ProfilePage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { playerInfo, isRegistered, updateUsername, updateIsLoading } = usePlayerRegistration();
  const { pendingRewards } = useRewards();
  const { balance } = useCeloBalance();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600">
            Please connect your wallet to view your profile
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
            No Profile Yet
          </h1>
          <p className="text-gray-600 mb-6">
            Register a username to create your profile
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
  const correctAnswers = playerInfo?.[3] as bigint || 0n;
  const totalQuestions = playerInfo?.[4] as bigint || 0n;
  const bestScore = playerInfo?.[5] as bigint || 0n;
  const rank = playerInfo?.[7] as bigint || 0n;

  const accuracy = totalQuestions > 0n 
    ? (Number(correctAnswers) / Number(totalQuestions) * 100).toFixed(1)
    : '0';

  const avgScore = gamesPlayed > 0n
    ? (Number(totalScore) / Number(gamesPlayed)).toFixed(1)
    : '0';

  const handleUpdateUsername = async () => {
    const sanitizedUsername = sanitizeUsername(newUsername);
    
    if (!sanitizedUsername || sanitizedUsername.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    try {
      const loadingToast = toast.loading('Updating username... (costs 0.01 CELO)', {
        duration: 60000,
      });
      
      await updateUsername(sanitizedUsername);
      
      toast.dismiss(loadingToast);
      toast.success('Username updated successfully!');
      setIsEditing(false);
      setNewUsername('');
    } catch (error: any) {
      console.error('Error updating username:', error);
      toast.dismiss();
      toast.error(error?.message || 'Failed to update username');
    }
  };

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
            Player Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Your trivia game statistics and achievements
          </p>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-6xl mb-4">👤</div>
              {!isEditing ? (
                <>
                  <h2 className="text-4xl font-bold mb-2">{username}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-purple-100 hover:text-white underline"
                  >
                    Change username (0.01 CELO)
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="New username"
                    className="px-4 py-2 rounded-lg text-gray-900 w-full max-w-xs"
                    maxLength={20}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateUsername}
                      disabled={updateIsLoading}
                      className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 disabled:bg-gray-300"
                    >
                      {updateIsLoading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewUsername('');
                      }}
                      className="bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-sm text-purple-100 mb-1">Rank</p>
                <p className="text-3xl font-bold">
                  {rank > 0n ? `#${rank.toString()}` : 'Unranked'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-100 mb-1">Total Score</p>
                <p className="text-3xl font-bold">{totalScore.toString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {!username ? (
          <StatsCardSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">CELO Balance</h3>
                <div className="text-3xl">💎</div>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-1">{balance}</p>
              <p className="text-sm text-gray-600">Current wallet balance</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Pending Rewards</h3>
                <div className="text-3xl">🎁</div>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-1">{pendingRewards}</p>
              <p className="text-sm text-gray-600">Ready to claim</p>
              <button
                onClick={() => router.push('/rewards')}
                className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                Claim Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Accuracy</h3>
                <div className="text-3xl">🎯</div>
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-1">{accuracy}%</p>
              <p className="text-sm text-gray-600">
                {correctAnswers.toString()}/{totalQuestions.toString()} correct
              </p>
            </motion.div>
          </div>
        )}

        {/* Detailed Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Games Played</p>
              <p className="text-3xl font-bold text-purple-600">{gamesPlayed.toString()}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Best Score</p>
              <p className="text-3xl font-bold text-blue-600">{bestScore.toString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Avg Score</p>
              <p className="text-3xl font-bold text-green-600">{avgScore}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total Questions</p>
              <p className="text-3xl font-bold text-orange-600">{totalQuestions.toString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Wallet Address</span>
              <span className="text-gray-900 font-mono text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Username</span>
              <span className="text-gray-900 font-semibold">{username}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Leaderboard Rank</span>
              <span className="text-gray-900 font-semibold">
                {rank > 0n ? `#${rank.toString()}` : 'Unranked'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => router.push('/play')}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🎮 Play Game
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🏆 View Leaderboard
          </button>
          <button
            onClick={() => router.push('/rewards')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            💰 Claim Rewards
          </button>
        </motion.div>
      </div>
    </div>
  );
}
