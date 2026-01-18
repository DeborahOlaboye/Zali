'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { useSimpleLeaderboard } from '@/hooks/useContract';
import { LeaderboardSkeleton, StatsCardSkeleton } from '@/components/skeletons';

export default function LeaderboardPage() {
  const { isConnected } = useAccount();
  const { leaderboardData, leaderboardState } = useSimpleLeaderboard();

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
            Top players in Celo Knowledge Quest
          </p>
          <p className="text-sm text-gray-500 mt-2">
            🚧 Leaderboard coming soon with TriviaGameV2 upgrade
          </p>
        </motion.div>

        {/* Placeholder Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <h2 className="text-2xl font-bold">Coming Soon!</h2>
            <p className="text-purple-100">Full leaderboard with rankings and weekly rewards</p>
          </div>

          <div className="p-6 text-center">
            <p className="text-gray-600 mb-4">
              The leaderboard feature will be available after the TriviaGameV2 upgrade, which includes:
            </p>
            <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
              <li>✅ Username registration</li>
              <li>✅ Global rankings</li>
              <li>✅ Weekly prize pools</li>
              <li>✅ Player statistics</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
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
                        <h3 className="font-bold text-gray-900">{player.username}</h3>
                        <p className="text-sm text-gray-600">{player.address.slice(0, 6)}...{player.address.slice(-4)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{player.totalScore}</div>
                      <div className="text-sm text-gray-600">Rank #{player.rank}</div>
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

        {/* Stats */}
        {leaderboardState.isLoading ? (
          <StatsCardSkeleton count={3} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{leaderboardData.length}</div>
              <div className="text-gray-600">Active Players</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{leaderboardData.reduce((sum, p) => sum + p.totalScore, 0)}</div>
              <div className="text-gray-600">Total Score</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Live</div>
              <div className="text-gray-600">On-Chain Data</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}