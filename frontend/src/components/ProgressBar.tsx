'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  showNumbers?: boolean;
}

export default function ProgressBar({
  current,
  total,
  showNumbers = true
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        {/* Progress Info */}
        {showNumbers && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Progress
            </span>
            <span className="text-lg font-bold text-green-600">
              {current} / {total}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-3">
          {Array.from({ length: total }, (_, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber < current;
            const isCurrent = stepNumber === current;
            
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${isCompleted ? 'bg-green-600 text-white' : ''}
                  ${isCurrent ? 'bg-green-500 text-white ring-4 ring-green-200' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Percentage Display */}
        <div className="text-center mt-3">
          <span className="text-sm text-gray-500">
            {Math.round(percentage)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}
