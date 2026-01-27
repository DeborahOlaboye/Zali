'use client';

import { motion } from 'framer-motion';

/**
 * LoadingSpinner displays an animated rotating spinner for async operations
 * 
 * Used to provide visual feedback during loading states with optional progress tracking
 * and status messages. Supports multiple sizes and color variants.
 * 
 * @component
 * @example
 * // Basic spinner
 * <LoadingSpinner />
 * 
 * @example
 * // Large spinner with message
 * <LoadingSpinner size="lg" message="Loading game..." />
 * 
 * @example
 * // With progress tracking
 * <LoadingSpinner progress={65} message="65% complete" />
 */
interface LoadingSpinnerProps {
  /** Size of the spinner: 'sm' (16px) | 'md' (24px) | 'lg' (32px) | 'xl' (48px). Default: 'md' */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Color variant of the spinner. Default: 'primary' (blue) */
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  
  /** Optional loading message displayed below the spinner */
  message?: string;
  
  /** Progress percentage (0-100) - displays a progress bar below spinner when provided */
  progress?: number;
  
  /** Additional CSS classes to apply to the container */
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
  // Spinner animation - continuous rotation
  // Uses 'linear' easing for smooth continuous rotation
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