'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import toast from 'react-hot-toast';

export default function QuickPlayPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Get question data
  const { data: questionData, isLoading: questionLoading } = useReadContract({
    address: CONTRACTS.triviaGame.address,
    abi: ['function getQuestion(uint256) external view returns (string memory, string[] memory, uint256, uint256, bool)'],
    functionName: 'getQuestion',
    args: [currentQuestionId],
  });

  // Submit answer
  const { writeContract: submitAnswer, data: submitHash } = useWriteContract();

  const { isLoading: isSubmitting, isSuccess: submitSuccess } = useWaitForTransactionReceipt({
    hash: submitHash,
  });

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    submitAnswer({
      address: CONTRACTS.triviaGame.address,
      abi: ['function submitAnswer(uint256, uint256) external'],
      functionName: 'submitAnswer',
      args: [currentQuestionId, selectedAnswer],
    });
  };

  // Handle transaction success
  useEffect(() => {
    if (submitSuccess && questionData) {
      const [, , correctOption] = questionData as [string, string[], bigint, bigint, boolean];
      const correct = Number(correctOption) === selectedAnswer;
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        toast.success('Correct! +0.1 USDC earned 🎉');
      } else {
        toast.error('Incorrect. Try the next question!');
      }
    }
  }, [submitSuccess, questionData, selectedAnswer]);

  // Next question
  const handleNextQuestion = () => {
    setCurrentQuestionId(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet to play</p>
          <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (questionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">No More Questions</h1>
          <p className="text-gray-600 mb-6">You've answered all available questions!</p>
          <button
            onClick={() => router.push('/play')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Back to Play
          </button>
        </div>
      </div>
    );
  }

  const [questionText, options, , rewardAmount, isActive] = questionData as [string, string[], bigint, bigint, boolean];

  if (!isActive) {
    // Skip to next question if this one is inactive
    useEffect(() => {
      setCurrentQuestionId(prev => prev + 1);
    }, []);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold mb-2">Question {currentQuestionId}</h1>
          <p className="text-gray-600">Reward: {rewardAmount.toString()} USDC</p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-xl font-bold mb-6">{questionText}</h2>

            {!showResult ? (
              <div className="space-y-4">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}

                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null || isSubmitting}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isCorrect ? (
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {isCorrect ? 'You earned 0.1 USDC!' : `The correct answer was ${String.fromCharCode(65 + Number(questionData[2]))}`}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}