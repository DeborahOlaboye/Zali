'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TimerProps } from '@/types/components';

/**
 * Timer displays a countdown timer with visual progress indication
 * 
 * Shows remaining time and changes color as time runs out (green → yellow → red).
 * Supports pause/resume functionality and completion callback.
 * 
 * @component
 * @example
 * <Timer duration={30} onTimeUp={handleTimeUp} />
 * 
 * @example
 * <Timer 
 *   duration={60} 
 *   onTimeUp={() => submitAnswer()} 
 *   isPaused={isPaused}
 *   autoStart={true}
 * />
 */
interface ExtendedTimerProps extends TimerProps {
  /** Whether the timer is paused. Default: false */
  isPaused?: boolean;
  
  /** Whether to auto-start the timer. Default: true */
  autoStart?: boolean;
}

type TimerColor = 'bg-green-500' | 'bg-yellow-500' | 'bg-red-500';
type TextColor = 'text-green-600' | 'text-yellow-600' | 'text-red-600';

export default function Timer({
  duration,
  onTimeUp,
  isPaused = false,
  autoStart = true,
  className = '',
  'data-testid': testId
}: ExtendedTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isActive, setIsActive] = useState<boolean>(autoStart);

  useEffect(() => {
    setTimeLeft(duration);
    setIsActive(autoStart);
  }, [duration, autoStart]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, onTimeUp]);

  const percentage: number = (timeLeft / duration) * 100;
  
  const getColor = useCallback((): TimerColor => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  }, [percentage]);

  const getTextColor = useCallback((): TextColor => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  }, [percentage]);

  const formatTime = useCallback((seconds: number): string => {
    const mins: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`} data-testid={testId}>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        {/* Timer Display */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${getTextColor()}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-600">
              Time Remaining
            </span>
          </div>
          
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className={`text-3xl md:text-4xl font-bold ${getTextColor()}`}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full transition-all duration-1000 ease-linear ${getColor()}`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            style={{ width: `${percentage}%` }}
          />
          
          {/* Pulse animation when time is low */}
          {percentage <= 25 && (
            <motion.div
              className="absolute inset-0 bg-red-400 opacity-30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Warning Message */}
        {percentage <= 25 && timeLeft > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-red-600 font-medium mt-2"
          >
            ⚠️ Hurry up! Time is running out!
          </motion.p>
        )}

        {/* Time's Up Message */}
        {timeLeft === 0 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-sm text-red-600 font-bold mt-2"
          >
            ⏰ Time's up!
          </motion.p>
        )}
      </div>
    </div>
  );
}
