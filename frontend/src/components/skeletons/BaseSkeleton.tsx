import React from 'react';

interface BaseSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  pulse?: boolean;
}

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const BaseSkeleton: React.FC<BaseSkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = 'md',
  pulse = true,
}) => {
  const roundedClass = roundedMap[rounded];
  const pulseClass = pulse ? 'animate-pulse' : '';

  return (
    <div
      className={`bg-gray-300 ${roundedClass} ${pulseClass} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      role="status"
      aria-label="Loading"
    />
  );
};
