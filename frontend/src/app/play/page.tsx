'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { usePlayerRegistration, useGameSession, useCeloBalance, useContractInfo, useQuestions } from '@/hooks/useContract';
import { GAME_CONSTANTS } from '@/config/contracts';
import VRFFulfillment from '@/components/VRFFulfillment';

export default function PlayPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  
  const { isRegistered, playerInfo, refetchPlayerInfo } = usePlayerRegistration();

  // Refetch player info when page loads to ensure fresh data
  useEffect(() => {
    if (address) {
      refetchPlayerInfo();
    }
  }, [address, refetchPlayerInfo]);
  const { startGame, startGameIsLoading, startGameIsSuccess, startGameError } = useGameSession();
  const { balance } = useCeloBalance();
  const { questionCount } = useQuestions();
  const { contractBalance } = useContractInfo();

  // Redirect to game on successful start
  useEffect(() => {
    if (startGameIsSuccess && isStarting) {
      toast.dismiss();
      toast.success('Game started! Loading questions...');
      setIsStarting(false);
      router.push('/play/game');
    }
  }, [startGameIsSuccess, router, isStarting]);

  // Handle start error
  useEffect(() => {
    if (startGameError && isStarting) {
      toast.dismiss();
      const errorMessage = startGameError?.message || 'Failed to start game';
      toast.error(errorMessage.includes('User rejected') ? 'Transaction cancelled' : 'Failed to start game. Please try again.');
      setIsStarting(false);
    }
  }, [startGameError, isStarting]);

  const handleStartPlaying = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check if registered
    if (!isRegistered) {
      toast.error('Please register a username first');
      router.push('/register');
      return;
    }

    // Check if enough questions
    if (questionCount < GAME_CONSTANTS.QUESTIONS_PER_SESSION) {
      toast.error(`Not enough questions available. Need at least ${GAME_CONSTANTS.QUESTIONS_PER_SESSION}, found ${questionCount}.`);
      return;
    }

    setIsStarting(true);

    try {
      toast.loading('Starting game... Please confirm the transaction', {
        duration: 60000,
      });
      
      startGame();
    } catch (error: any) {
      console.error('Error starting game:', error);
      toast.dismiss();
      toast.error(error?.message || 'Failed to start game');
      setIsStarting(false);
    }
  };

  const username = playerInfo?.[0] as string || '';
  const totalScore = playerInfo?.[1] as bigint || 0n;
  const gamesPlayed = playerInfo?.[2] as bigint || 0n;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Play Trivia
          </h1>
          <p className="text-gray-600 text-lg">
            Test your Celo knowledge and earn CELO rewards!
          </p>
        </div>
        
        {/* User Info (if registered) */}
        {isRegistered && username && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-purple-200"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <h2 className="text-2xl font-bold text-gray-900">{username}</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Score</p>
                  <p className="text-xl font-bold text-purple-600">{totalScore.toString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Games Played</p>
                  <p className="text-xl font-bold text-blue-600">{gamesPlayed.toString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">CELO Balance</p>
                  <p className="text-xl font-bold text-green-600">{balance}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/rewards')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                💰 View & Claim Rewards
              </button>
            </div>
          </motion.div>
        )}

        {/* Registration Required Notice */}
        {isConnected && !isRegistered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 mb-8 text-center"
          >
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to register a username before you can play
            </p>
            <button
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Register Now (FREE)
            </button>
          </motion.div>
        )}
        
        {/* Featured Game Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-2 border-green-200"
        >
          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎮 Free to Play • Earn CELO
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎓 Celo Knowledge Quiz
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Answer questions about Celo, blockchain, and crypto to earn CELO rewards!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">💰 Max Reward</p>
                <p className="text-2xl font-bold text-green-600">
                  {GAME_CONSTANTS.MAX_REWARD_PER_GAME} CELO
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">🎫 Entry Fee</p>
                <p className="text-2xl font-bold text-blue-600">
                  FREE
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">❓ Questions</p>
                <p className="text-2xl font-bold text-purple-600">
                  {GAME_CONSTANTS.QUESTIONS_PER_SESSION}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <p className="text-sm text-gray-600 mb-1">⏱️ Time</p>
                <p className="text-2xl font-bold text-orange-600">
                  {GAME_CONSTANTS.TIME_LIMIT / 60} min
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartPlaying}
                disabled={!isConnected || !isRegistered || startGameIsLoading || isStarting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed min-w-[250px]"
              >
                {!isConnected 
                  ? '🔌 Connect Wallet First'
                  : !isRegistered
                    ? '👤 Register First'
                    : startGameIsLoading || isStarting
                      ? '⏳ Starting Game...'
                      : '🎮 Start Playing (FREE)'
                }
              </button>
            </div>
            
            {isConnected && isRegistered && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-center gap-2 text-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium">
                    💡 Pro Tip: Answer quickly and correctly to maximize your CELO earnings!
                  </p>
                </div>
              </div>
            )}

            {/* Contract Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>Available Questions: <span className="font-semibold text-gray-900">{questionCount}</span></p>
              </div>
              <div>
                <p>Contract Balance: <span className="font-semibold text-gray-900">{contractBalance} CELO</span></p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Rewards Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💰 Earning Potential
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-900 mb-2">Per Correct Answer</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">
                {GAME_CONSTANTS.REWARD_PER_CORRECT} CELO
              </p>
              <p className="text-sm text-gray-600">Earn for each right answer</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Perfect Score Bonus</h3>
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {GAME_CONSTANTS.PERFECT_SCORE_BONUS} CELO
              </p>
              <p className="text-sm text-gray-600">Get all 10 correct!</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Speed Bonus</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                Up to {GAME_CONSTANTS.MAX_SPEED_BONUS} CELO
              </p>
              <p className="text-sm text-gray-600">Answer faster!</p>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            📚 How to Play
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-sm text-gray-600">
                Create your unique username (one-time, FREE)
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Game</h3>
              <p className="text-sm text-gray-600">
                Click start and get 10 random questions
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">Answer</h3>
              <p className="text-sm text-gray-600">
                Answer questions in 5 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">4️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn CELO</h3>
              <p className="text-sm text-gray-600">
                Claim your rewards instantly!
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* VRF Fulfillment Helper */}
      <VRFFulfillment />
    </div>
  );
}
