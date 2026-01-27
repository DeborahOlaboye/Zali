'use client';

import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * LoadingCard displays a centered card with loading indicator and optional messages
 * 
 * Provides a complete loading experience with spinner, title, message, and progress.
 * Often used as a full-screen or modal loading state.
 * 
 * @component
 * @example
 * <LoadingCard title="Processing" message="Please wait..." />
 * 
 * @example
 * <LoadingCard 
 *   title="Uploading" 
 *   message="Your file is being uploaded" 
 *   progress={45}
 * />
 */
interface LoadingCardProps {
  /** Title text displayed above the spinner */
  title?: string;
  
  /** Message text displayed below the title */
  message?: string;
  
  /** Progress percentage (0-100) to display a progress bar */
  progress?: number;
  
  /** Whether to show the loading spinner. Default: true */
  showSpinner?: boolean;
  
  /** Additional CSS classes to apply to the card container */
  className?: string;
  
  /** Child elements to render inside the card */
  children?: React.ReactNode;
}

export function LoadingCard({
  title,
  message,
  progress,
  showSpinner = true,
  className = '',
  children,
}: LoadingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {showSpinner && (
          <LoadingSpinner
            size="lg"
            color="primary"
            className="mb-4"
          />
        )}
        
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
        )}
        
        {message && (
          <p className="text-gray-600 mb-4">
            {message}
          </p>
        )}
        
        {progress !== undefined && (
          <div className="w-full max-w-xs mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
        
        {children}
      </div>
    </motion.div>
  );
}