'use client';

import { ReactNode } from 'react';

/**
 * ResponsiveText Props
 */
export interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  responsive?: boolean;
}

/**
 * ResponsiveText component with adaptive font sizes
 */
export function ResponsiveText({
  children,
  className = '',
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  color,
  responsive = true,
}: ResponsiveTextProps) {
  const sizeClasses = responsive
    ? {
        xs: 'text-xs',
        sm: 'text-xs sm:text-sm',
        base: 'text-sm sm:text-base',
        lg: 'text-base sm:text-lg',
        xl: 'text-lg sm:text-xl',
        '2xl': 'text-xl sm:text-2xl',
        '3xl': 'text-2xl sm:text-3xl md:text-4xl',
        '4xl': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
      }
    : {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
      };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  return (
    <Component
      className={`
        ${sizeClasses[size]}
        ${weightClasses[weight]}
        ${alignClasses[align]}
        ${color || ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

/**
 * ResponsiveHeading component
 */
export interface ResponsiveHeadingProps {
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  align?: 'left' | 'center' | 'right';
  gradient?: boolean;
}

export function ResponsiveHeading({
  children,
  level,
  className = '',
  align = 'left',
  gradient = false,
}: ResponsiveHeadingProps) {
  const Component = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  const sizeClasses = {
    1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
    2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    4: 'text-lg sm:text-xl md:text-2xl',
    5: 'text-base sm:text-lg md:text-xl',
    6: 'text-sm sm:text-base md:text-lg',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const gradientClass = gradient
    ? 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
    : '';

  return (
    <Component
      className={`
        font-bold
        ${sizeClasses[level]}
        ${alignClasses[align]}
        ${gradientClass}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

/**
 * TruncatedText component with responsive truncation
 */
export interface TruncatedTextProps {
  children: string;
  className?: string;
  lines?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  showMore?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export function TruncatedText({
  children,
  className = '',
  lines = { mobile: 2, tablet: 3, desktop: 4 },
  showMore = false,
  onToggle,
}: TruncatedTextProps) {
  const lineClampClasses = `
    line-clamp-${lines.mobile || 2}
    md:line-clamp-${lines.tablet || 3}
    lg:line-clamp-${lines.desktop || 4}
  `;

  return (
    <div className={className}>
      <p className={showMore ? '' : lineClampClasses}>{children}</p>
      {onToggle && (
        <button
          onClick={() => onToggle(!showMore)}
          className="text-blue-600 hover:text-blue-700 text-sm mt-1"
        >
          {showMore ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
