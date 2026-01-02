'use client';

import { motion } from 'framer-motion';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'w-1 h-1',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
};

const colorClasses = {
  primary: 'bg-blue-600',
  secondary: 'bg-green-600',
  white: 'bg-white',
  gray: 'bg-gray-600',
};

const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const dotVariants = {
  start: {
    y: '0%',
  },
  end: {
    y: '100%',
  },
};

export function LoadingDots({
  size = 'md',
  color = 'primary',
  className = '',
}: LoadingDotsProps) {
  return (
    <motion.div
      className={`flex space-x-1 ${className}`}
      variants={containerVariants}
      initial="start"
      animate="end"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
          variants={dotVariants}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}