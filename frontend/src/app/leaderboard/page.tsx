'use client';

import { useLeaderboard, usePlayerRegistration } from '@/hooks/useContract';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const { address } = useAccount();
  const { leaderboardData } = useLeaderboard(10);
  const { playerInfo } = usePlayerRegistration();

  const addresses = leaderboardData?.[0] as `0x${string}`[] || [];
  const usernames = leaderboardData?.[1] as string[] || [];
  const scores = leaderboardData?.[2] as bigint[] || [];

  const myUsername = playerInfo?.[0] as string || '';
  const myRank = playerInfo?.[7] as bigint || 0n;

  const getRewardPercentage = (index: number): string => {
    const percentages = ['40%', '25%', '15%', '10%', '5%', '3%', '2%', '1.5%', '1%', '0.5%'];
    return percentages[index] || '0%';
  };

  const getMedalEmoji = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
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
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">
            Top 10 Players - Weekly Rewards Distribution
          </p>
        </motion.div>

        {/* My Rank Card (if registered) */}
        {address && myUsername && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm text-purple-100 mb-1">Your Rank</p>
                <h2 className="text-3xl font-bold">{myUsername}</h2>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-100 mb-1">Current Position</p>
                <p className="text-4xl font-bold">
                  {myRank > 0n ? `#${myRank.toString()}` : 'Unranked'}
                </p>
              </div>
              {myRank > 0n && myRank <= 10n && (
                <div className="text-center">
                  <p className="text-sm text-purple-100 mb-1">Weekly Reward Share</p>
                  <p className="text-2xl font-bold">{getRewardPercentage(Number(myRank) - 1)}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <h2 className="text-2xl font-bold">Top 10 Players</h2>
            <p className="text-sm text-purple-100 mt-1">
              Updated in real-time • Weekly rewards distributed to top 10
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Player</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Score</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Reward %</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Address</th>
                </tr>
              </thead>
              <tbody>
                {addresses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      <div className="text-6xl mb-4">🎮</div>
                      <p className="text-lg font-semibold mb-2">No players yet!</p>
                      <p className="text-sm">Be the first to play and claim the top spot!</p>
                    </td>
                  </tr>
                ) : (
                  addresses.map((playerAddress, index) => {
                    const isCurrentUser = address && playerAddress.toLowerCase() === address.toLowerCase();
                    return (
                      <motion.tr
                        key={playerAddress}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          isCurrentUser ? 'bg-purple-50' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getMedalEmoji(index)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {usernames[index]}
                            </span>
                            {isCurrentUser && (
                              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-900">
                            {scores[index]?.toString() || '0'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {getRewardPercentage(index)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-500 font-mono">
                            {playerAddress.slice(0, 6)}...{playerAddress.slice(-4)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Reward Distribution Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Reward Distribution</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { rank: '1st', percentage: '40%', emoji: '🥇' },
              { rank: '2nd', percentage: '25%', emoji: '🥈' },
              { rank: '3rd', percentage: '15%', emoji: '🥉' },
              { rank: '4th', percentage: '10%', emoji: '4️⃣' },
              { rank: '5th', percentage: '5%', emoji: '5️⃣' },
              { rank: '6th', percentage: '3%', emoji: '6️⃣' },
              { rank: '7th', percentage: '2%', emoji: '7️⃣' },
              { rank: '8th', percentage: '1.5%', emoji: '8️⃣' },
              { rank: '9th', percentage: '1%', emoji: '9️⃣' },
              { rank: '10th', percentage: '0.5%', emoji: '🔟' },
            ].map((item, index) => (
              <div
                key={item.rank}
                className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200"
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="text-sm text-gray-600 mb-1">{item.rank} Place</p>
                <p className="text-lg font-bold text-purple-600">{item.percentage}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How Leaderboard Works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Rankings are based on total score across all games</li>
                <li>• Top 10 players receive weekly CELO rewards</li>
                <li>• Rewards are distributed proportionally based on rank</li>
                <li>• Play more games to increase your score and rank</li>
                <li>• Leaderboard updates in real-time after each game</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
