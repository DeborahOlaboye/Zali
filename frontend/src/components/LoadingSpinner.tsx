'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  message?: string;
  progress?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'border-blue-600 border-t-transparent',
  secondary: 'border-green-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-600 border-t-transparent',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  message,
  progress,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite">
      <motion.div
        className={`border-2 rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
        aria-hidden="true"
      />
      
      {progress !== undefined && (
        <div className="mt-2 w-32 bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-600 text-center"
          aria-live="polite"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}