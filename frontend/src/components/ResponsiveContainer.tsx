'use client';

import { ReactNode } from 'react';
import { useBreakpoint, useIsMobile } from '@/hooks/useMediaQuery';

/**
 * ResponsiveContainer Props
 */
export interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centerContent?: boolean;
}

/**
 * ResponsiveContainer component with adaptive max-width and padding
 */
export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'lg',
  padding = 'md',
  centerContent = true,
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
  };

  return (
    <div
      className={`
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        ${centerContent ? 'mx-auto' : ''}
        w-full
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * ResponsiveGrid component with adaptive columns
 */
export interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveGrid({
  children,
  className = '',
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
}: ResponsiveGridProps) {
  const colsClasses = `
    grid-cols-${cols.sm || 1}
    md:grid-cols-${cols.md || 2}
    lg:grid-cols-${cols.lg || 3}
    xl:grid-cols-${cols.xl || 4}
  `;

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  };

  return (
    <div className={`grid ${colsClasses} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

/**
 * ResponsiveStack component with adaptive direction
 */
export interface ResponsiveStackProps {
  children: ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal' | 'responsive';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function ResponsiveStack({
  children,
  className = '',
  direction = 'responsive',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
}: ResponsiveStackProps) {
  const directionClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
    responsive: 'flex flex-col md:flex-row',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={`
        ${directionClasses[direction]}
        ${gapClasses[gap]}
        ${alignClasses[align]}
        ${justifyClasses[justify]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * MobileOnly component - renders children only on mobile
 */
export function MobileOnly({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : null;
}

/**
 * DesktopOnly component - renders children only on desktop
 */
export function DesktopOnly({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return !isMobile ? <>{children}</> : null;
}

/**
 * ResponsiveRender component - renders different content based on breakpoint
 */
export interface ResponsiveRenderProps {
  mobile?: ReactNode;
  tablet?: ReactNode;
  desktop?: ReactNode;
}

export function ResponsiveRender({
  mobile,
  tablet,
  desktop,
}: ResponsiveRenderProps) {
  const breakpoint = useBreakpoint();

  if (breakpoint === 'sm' && mobile) return <>{mobile}</>;
  if ((breakpoint === 'md' || breakpoint === 'lg') && tablet) return <>{tablet}</>;
  if ((breakpoint === 'xl' || breakpoint === '2xl') && desktop) return <>{desktop}</>;

  // Fallback
  return <>{desktop || tablet || mobile}</>;
}
