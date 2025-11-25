'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '@/components/QuestionCard';
import Timer from '@/components/Timer';
import ProgressBar from '@/components/ProgressBar';
import { calculateScore } from '@/data/questions';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { useGameSession, useGameQuestions } from '@/hooks/useContract';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const QUESTION_TIME_LIMIT = 30; // seconds per question

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  
  const gameId = searchParams.get('gameId') || '1';
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeSpent, setTimeSpent] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Use game questions hook to get 10 questions
  const { questions, isLoading: isLoadingQuestions } = useGameQuestions();
  
  const { submitAnswers, submitIsLoading, submitIsSuccess, getLatestSession } = useGameSession();

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      router.push('/play');
    }
  }, [isConnected, router]);

  // Start game
  useEffect(() => {
    if (isConnected && !gameStarted) {
      setGameStarted(true);
      setQuestionStartTime(Date.now());
      toast.success('Game started! Good luck! 🎮');
    }
  }, [isConnected, gameStarted]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    // Calculate time spent on this question
    const timeForQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Save answer and time
    setAnswers([...answers, answerIndex]);
    setTimeSpent([...timeSpent, timeForQuestion]);

    // Move to next question or finish
    if (isLastQuestion) {
      finishGame([...answers, answerIndex], [...timeSpent, timeForQuestion]);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestionStartTime(Date.now());
      }, 500);
    }
  };

  const handleTimeUp = () => {
    toast.error('Time\'s up! Moving to next question...');
    
    // Auto-submit with -1 (no answer)
    const timeForQuestion = QUESTION_TIME_LIMIT;
    setAnswers([...answers, -1]);
    setTimeSpent([...timeSpent, timeForQuestion]);

    if (isLastQuestion) {
      finishGame([...answers, -1], [...timeSpent, timeForQuestion]);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestionStartTime(Date.now());
      }, 1000);
    }
  };

  const finishGame = async (finalAnswers: number[], finalTimeSpent: number[]) => {
    setIsLoading(true);
    
    try {
      // Calculate score
      const score = calculateScore(finalAnswers, questions);
      
      if (address) {
        try {
          // Get the latest session ID
          const sessionId = getLatestSession();
          console.log('Latest session ID:', sessionId);
          
          if (sessionId !== null) {
            // Submit answers to smart contract
            console.log('Submitting answers:', finalAnswers);
            await submitAnswers(BigInt(sessionId), finalAnswers);
            toast.success('Answers submitted to blockchain!');
          } else {
            console.log('No session ID found, skipping contract submission');
          }
        } catch (error) {
          console.error('Error submitting to contract:', error);
          toast.error('Failed to submit to blockchain, but game completed locally');
        }
      }
      
      // Mark that user has played (for rewards)
      if (typeof window !== 'undefined') {
        localStorage.setItem('hasPlayedGame', 'true');
      }
      
      toast.success(`Game complete! You scored ${score.correct}/${score.total}!`);
      
      // Navigate to results page
      setTimeout(() => {
        router.push(`/results/${gameId}?score=${score.correct}&total=${score.total}&answers=${finalAnswers.join(',')}`);
      }, 1000);
      
    } catch (error) {
      console.error('Error finishing game:', error);
      toast.error('Failed to submit game results');
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  if (isLoading || isLoadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            {isLoadingQuestions ? 'Loading questions...' : 'Processing...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🎓 Celo Knowledge Quest
          </h1>
          <p className="text-gray-600">
            Answer all questions correctly to win cUSD rewards!
          </p>
        </motion.div>

        {/* Progress Bar */}
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
        />

        {/* Timer */}
        <Timer
          duration={QUESTION_TIME_LIMIT}
          onTimeUp={handleTimeUp}
          key={currentQuestionIndex} // Reset timer for each question
        />

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestionIndex}
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        </AnimatePresence>

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-md p-4 md:p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Game ID</p>
              <p className="text-lg font-bold text-gray-900">#{gameId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Questions</p>
              <p className="text-lg font-bold text-gray-900">{questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Answered</p>
              <p className="text-lg font-bold text-green-600">{answers.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Remaining</p>
              <p className="text-lg font-bold text-blue-600">
                {questions.length - answers.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">💡 Pro Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Answer quickly to maximize your score</li>
                <li>• Read each question carefully</li>
                <li>• Learn from the explanations after the game</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
