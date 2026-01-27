'use client';

import { motion } from 'framer-motion';

/**
 * ProgressBar displays a progress indicator with animated fill
 * 
 * Shows progress from 0-100% with optional percentage label.
 * Supports multiple color variants and sizes for different contexts.
 * 
 * @component
 * @example
 * <ProgressBar progress={65} showPercentage label="Loading" />
 * 
 * @example
 * <ProgressBar progress={80} color="success" size="lg" />
 */
interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  progress: number;
  
  /** Whether to show percentage text. Default: false */
  showPercentage?: boolean;
  
  /** Color variant of the progress bar. Default: 'primary' */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  
  /** Size of the progress bar. Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional CSS classes for the container */
  className?: string;
  
  /** Optional label to display above the progress bar */
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