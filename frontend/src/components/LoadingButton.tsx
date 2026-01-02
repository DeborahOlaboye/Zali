'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { ButtonProps, ButtonVariant, ButtonSize } from '@/types/components';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-green-600 hover:bg-green-700 text-white',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
  ghost: 'text-blue-600 hover:bg-blue-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
} as const;

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
} as const;

const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-current';

export function LoadingButton({
  isLoading = false,
  loadingText,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  className = '',
  'data-testid': testId,
  ...props
}: LoadingButtonProps) {
  const isDisabled: boolean = disabled || isLoading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`
        relative inline-flex items-center justify-center
        font-medium rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${className}
      `}
      disabled={isDisabled}
      data-testid={testId}
      {...props}}
    >
      {isLoading && (
        <LoadingSpinner
          size="sm"
          color={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'}
          className="mr-2"
        />
      )}
      
      <span className={isLoading ? 'opacity-75' : ''}>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </motion.button>
  );
}