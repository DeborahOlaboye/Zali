'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useMediaQuery';

/**
 * ResponsiveButton Props
 */
export interface ResponsiveButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  responsive?: boolean;
}

/**
 * ResponsiveButton component with adaptive sizing
 */
export function ResponsiveButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  responsive = true,
  className = '',
  disabled,
  ...props
}: ResponsiveButtonProps) {
  const isMobile = useIsMobile();

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline:
      'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
    ghost:
      'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  const sizeClasses = responsive
    ? {
        sm: 'px-3 py-1.5 md:px-4 md:py-2 text-sm',
        md: 'px-4 py-2 md:px-6 md:py-3 text-sm md:text-base',
        lg: 'px-6 py-3 md:px-8 md:py-4 text-base md:text-lg',
      }
    : {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        font-medium rounded-lg
        transition-colors duration-200
        inline-flex items-center justify-center
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className={`animate-spin -ml-1 mr-2 ${iconSizeClasses[size]}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={`${iconSizeClasses[size]} mr-2`}>{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={`${iconSizeClasses[size]} ml-2`}>{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
}

/**
 * ResponsiveIconButton component
 */
export interface ResponsiveIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabelOnMobile?: boolean;
}

export function ResponsiveIconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  showLabelOnMobile = false,
  className = '',
  ...props
}: ResponsiveIconButtonProps) {
  const isMobile = useIsMobile();

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800',
    outline:
      'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  const sizeClasses = {
    sm: 'p-1.5 md:p-2',
    md: 'p-2 md:p-2.5',
    lg: 'p-2.5 md:p-3',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const showLabel = isMobile ? showLabelOnMobile : true;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${variantClasses[variant]}
        ${showLabel ? 'px-3 md:px-4 py-2' : sizeClasses[size]}
        rounded-lg
        transition-colors duration-200
        inline-flex items-center justify-center
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      <span className={iconSizeClasses[size]}>{icon}</span>
      {showLabel && <span className="ml-2 text-sm font-medium">{label}</span>}
    </motion.button>
  );
}

/**
 * ResponsiveButtonGroup component
 */
export interface ResponsiveButtonGroupProps {
  children: ReactNode;
  className?: string;
  stack?: boolean;
  spacing?: 'sm' | 'md' | 'lg';
}

export function ResponsiveButtonGroup({
  children,
  className = '',
  stack = false,
  spacing = 'md',
}: ResponsiveButtonGroupProps) {
  const spacingClasses = {
    sm: stack ? 'space-y-2' : 'space-x-2',
    md: stack ? 'space-y-3' : 'space-x-3',
    lg: stack ? 'space-y-4' : 'space-x-4',
  };

  return (
    <div
      className={`
        flex
        ${stack ? 'flex-col' : 'flex-row flex-wrap'}
        ${spacingClasses[spacing]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * ResponsiveFloatingActionButton component
 */
export interface ResponsiveFABProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary' | 'danger';
}

export function ResponsiveFAB({
  icon,
  label,
  position = 'bottom-right',
  variant = 'primary',
  className = '',
  ...props
}: ResponsiveFABProps) {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4 md:bottom-6 md:right-6',
    'bottom-left': 'bottom-4 left-4 md:bottom-6 md:left-6',
    'top-right': 'top-4 right-4 md:top-6 md:right-6',
    'top-left': 'top-4 left-4 md:top-6 md:left-6',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        fixed ${positionClasses[position]}
        ${variantClasses[variant]}
        w-14 h-14 md:w-16 md:h-16
        rounded-full shadow-lg
        flex items-center justify-center
        transition-colors duration-200
        z-50
        ${className}
      `}
      aria-label={label}
      {...props}
    >
      <span className="w-6 h-6 md:w-7 md:h-7">{icon}</span>
    </motion.button>
  );
}
