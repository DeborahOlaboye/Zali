'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import { useAccount } from 'wagmi';

export default function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { address } = useAccount();
  
  const gameId = params.gameId as string;
  const score = parseInt(searchParams.get('score') || '0');
  const total = parseInt(searchParams.get('total') || '5');

  
  const [rewards, setRewards] = useState(0);
  const [rank, setRank] = useState(0);

  const percentage = Math.round((score / total) * 100);
  const isPerfect = score === total;
  const isWinner = percentage >= 60;

  useEffect(() => {
    if (isWinner) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#3b82f6', '#f59e0b']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }

    if (percentage >= 80) {
      setRewards(0.8);
      setRank(1);
    } else if (percentage >= 60) {
      setRewards(0.15);
      setRank(2);
    }
  }, [isWinner, percentage]);

  const getRankEmoji = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    return '📊';
  };

  const getRankText = () => {
    if (rank === 1) return '1st Place';
    if (rank === 2) return '2nd Place';
    return 'Participant';
  };

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (isPerfect) return '🎉 Perfect Score! You\'re a Celo Expert!';
    if (percentage >= 80) return '🌟 Excellent! You really know your Celo!';
    if (percentage >= 60) return '👍 Good job! Keep learning!';
    return '📚 Keep studying! You\'ll do better next time!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🎮 Game Results
          </h1>
          <p className="text-gray-600">Game #{gameId}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="mb-4"
            >
              <div className={`text-7xl md:text-8xl font-bold ${getScoreColor()}`}>
                {score}/{total}
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-700 mt-2">
                {percentage}%
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl font-semibold text-gray-800 mb-2"
            >
              {getScoreMessage()}
            </motion.p>

            {rank > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="inline-block mt-4"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full shadow-lg">
                  <span className="text-2xl mr-2">{getRankEmoji()}</span>
                  <span className="text-lg font-bold">{getRankText()}</span>
                </div>
              </motion.div>
            )}
          </div>

          {rewards > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6"
            >
              <div className="text-center">
                <p className="text-green-800 font-semibold text-lg mb-2">
                  💰 Congratulations! You earned:
                </p>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {rewards.toFixed(2)} cUSD
                </div>
                <p className="text-sm text-green-700">
                  Rewards will be sent to your wallet!
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Correct</p>
              <p className="text-2xl font-bold text-green-600">{score}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Incorrect</p>
              <p className="text-2xl font-bold text-red-600">{total - score}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Rank</p>
              <p className="text-2xl font-bold text-yellow-600">
                {rank > 0 ? `#${rank}` : '-'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/play/game?gameId=' + (parseInt(gameId) + 1))}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              🎮 Play Again
            </button>
            <button
              onClick={() => router.push('/play')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              🏠 Back to Games
            </button>
          </div>
        </motion.div>



        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600 mb-4">Share your results!</p>
          <button
            onClick={() => {
              const text = `I just scored ${score}/${total} (${percentage}%) on Celo Knowledge Quest! 🎮`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            🐦 Share on Twitter
          </button>
        </motion.div>
      </div>
    </div>
  );
}
