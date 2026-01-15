'use client';

import { motion } from 'framer-motion';
import { useLeaderboardSubgraph, useGlobalStats } from '@/hooks/useSubgraph';
import { LeaderboardSkeleton, StatsCardSkeleton } from '@/components/skeletons';
import { formatUnits } from 'viem';

export default function LeaderboardPageSubgraph() {
  const { players, loading, error, refetch } = useLeaderboardSubgraph(10);
  const { stats, loading: statsLoading } = useGlobalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            Top players in Zali Trivia Game
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ⚡ Powered by The Graph - Lightning fast queries
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Error loading leaderboard. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <h2 className="text-2xl font-bold">Top Players</h2>
            <p className="text-purple-100">Compete for the highest scores!</p>
          </div>

          <div className="p-6">
            {loading ? (
              <LeaderboardSkeleton count={5} />
            ) : players.length > 0 ? (
              <div className="space-y-4">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                      index === 0 ? 'bg-yellow-50 border-yellow-200' :
                      index === 1 ? 'bg-gray-50 border-gray-200' :
                      index === 2 ? 'bg-orange-50 border-orange-200' :
                      'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">
                          {player.address.slice(0, 6)}...{player.address.slice(-4)}
                        </h3>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span>{player.correctAnswers} correct</span>
                          <span>{player.totalAnswers} total</span>
                          <span>
                            {formatUnits(BigInt(player.totalRewards), 6)} USDC
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {player.totalScore}
                      </div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Players Yet</h3>
                <p className="text-gray-600 mb-6">Be the first to play and claim the top spot!</p>
                <button
                  onClick={() => window.location.href = '/play'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Start Playing
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Global Stats */}
        {statsLoading ? (
          <StatsCardSkeleton count={5} />
        ) : stats ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.totalPlayers}
              </div>
              <div className="text-gray-600 text-sm">Active Players</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalAnswers}
              </div>
              <div className="text-gray-600 text-sm">Total Answers</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.totalCorrectAnswers}
              </div>
              <div className="text-gray-600 text-sm">Correct Answers</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {formatUnits(BigInt(stats.totalRewardsDistributed), 6)}
              </div>
              <div className="text-gray-600 text-sm">USDC Distributed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {stats.totalQuestions}
              </div>
              <div className="text-gray-600 text-sm">Total Questions</div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
