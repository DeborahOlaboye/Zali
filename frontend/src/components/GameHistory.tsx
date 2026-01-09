'use client';

import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type GameSession = {
  id: string;
  date: Date;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  reward: number;
  duration: number; // in seconds
  status: 'completed' | 'partial' | 'abandoned';
};

type GameHistoryProps = {
  sessions: GameSession[];
  isLoading?: boolean;
  currentUserAddress?: string;
};

export function GameHistory({ sessions, isLoading = false, currentUserAddress }: GameHistoryProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: GameSession['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <CheckCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'abandoned':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: GameSession['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
          Your Game History
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {sessions.length} {sessions.length === 1 ? 'game' : 'games'} played
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="p-6 text-center">
          <div className="text-4xl mb-3">🎮</div>
          <p className="text-gray-500">No games played yet</p>
          <p className="text-sm text-gray-400 mt-1">Start your first trivia game!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              className="p-4 hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(session.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.correctAnswers}/{session.totalQuestions} correct
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(session.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {session.reward.toFixed(4)} ETH
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDuration(session.duration)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(session.status)}`}>
                    {session.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
