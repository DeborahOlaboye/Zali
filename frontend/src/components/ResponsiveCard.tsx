'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * ResponsiveCard Props
 */
export interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
}

/**
 * ResponsiveCard component with adaptive padding and styles
 */
export function ResponsiveCard({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  variant = 'default',
}: ResponsiveCardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outlined: 'bg-transparent border-2 border-gray-300',
    elevated: 'bg-white shadow-lg',
  };

  const Component = hover || onClick ? motion.div : 'div';

  const motionProps =
    hover || onClick
      ? {
          whileHover: { scale: 1.02 },
          whileTap: onClick ? { scale: 0.98 } : undefined,
        }
      : {};

  return (
    <Component
      onClick={onClick}
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        rounded-lg sm:rounded-xl
        transition-shadow duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${hover ? 'hover:shadow-xl' : ''}
        ${className}
      `}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

/**
 * ResponsiveCardHeader component
 */
export interface ResponsiveCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function ResponsiveCardHeader({
  title,
  subtitle,
  action,
  icon,
  className = '',
}: ResponsiveCardHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center space-x-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
}

/**
 * ResponsiveCardBody component
 */
export interface ResponsiveCardBodyProps {
  children: ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveCardBody({
  children,
  className = '',
  spacing = 'md',
}: ResponsiveCardBodyProps) {
  const spacingClasses = {
    none: 'mt-0',
    sm: 'mt-2',
    md: 'mt-4',
    lg: 'mt-6',
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>{children}</div>
  );
}

/**
 * ResponsiveCardFooter component
 */
export interface ResponsiveCardFooterProps {
  children: ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right' | 'between';
}

export function ResponsiveCardFooter({
  children,
  className = '',
  spacing = 'md',
  align = 'right',
}: ResponsiveCardFooterProps) {
  const spacingClasses = {
    none: 'mt-0',
    sm: 'mt-2',
    md: 'mt-4',
    lg: 'mt-6',
  };

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`
        ${spacingClasses[spacing]}
        flex flex-col sm:flex-row
        space-y-2 sm:space-y-0 sm:space-x-3
        ${alignClasses[align]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * ResponsiveCardGrid component
 */
export interface ResponsiveCardGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export function ResponsiveCardGrid({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
}: ResponsiveCardGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  return (
    <div
      className={`
        grid
        grid-cols-${cols.mobile || 1}
        md:grid-cols-${cols.tablet || 2}
        lg:grid-cols-${cols.desktop || 3}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * ResponsiveImageCard component
 */
export interface ResponsiveImageCardProps {
  image: string;
  title: string;
  description?: string;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
  imageHeight?: string;
}

export function ResponsiveImageCard({
  image,
  title,
  description,
  action,
  onClick,
  className = '',
  imageHeight = '12rem',
}: ResponsiveImageCardProps) {
  return (
    <ResponsiveCard
      onClick={onClick}
      hover={!!onClick}
      padding="none"
      className={className}
    >
      {/* Image */}
      <div
        className="w-full bg-gray-200 rounded-t-lg sm:rounded-t-xl overflow-hidden"
        style={{ height: imageHeight }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        {action && <div>{action}</div>}
      </div>
    </ResponsiveCard>
  );
}
