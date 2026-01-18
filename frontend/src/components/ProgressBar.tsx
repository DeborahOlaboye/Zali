'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const colorClasses = {
  primary: 'bg-blue-600',
  secondary: 'bg-green-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  progress,
  showPercentage = true,
  color = 'primary',
  size = 'md',
  className = '',
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-600">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}