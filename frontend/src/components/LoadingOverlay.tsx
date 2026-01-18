'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  backdrop?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingOverlay({
  isVisible,
  message,
  progress,
  backdrop = true,
  size = 'lg',
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            backdrop ? 'bg-black bg-opacity-50' : ''
          }`}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-8 shadow-xl max-w-sm mx-4"
          >
            <LoadingSpinner
              size={size}
              color="primary"
              message={message}
              progress={progress}
              className="py-4"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}