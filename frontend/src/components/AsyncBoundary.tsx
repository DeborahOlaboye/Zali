'use client';

import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * AsyncBoundary Props
 */
export interface AsyncBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error) => void;
  onReset?: () => void;
  className?: string;
}

/**
 * AsyncBoundary component that combines Suspense and ErrorBoundary
 */
export function AsyncBoundary({
  children,
  loadingFallback,
  errorFallback,
  onError,
  onReset,
  className,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={errorFallback}
      onError={onError}
      onReset={onReset}
      className={className}
    >
      <Suspense
        fallback={
          loadingFallback || (
            <div className="flex items-center justify-center min-h-[200px]">
              <LoadingSpinner size="lg" />
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * AsyncBoundary with custom skeleton loader
 */
export function AsyncBoundaryWithSkeleton({
  children,
  skeleton,
  errorFallback,
  onError,
  onReset,
  className,
}: AsyncBoundaryProps & { skeleton?: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={errorFallback}
      onError={onError}
      onReset={onReset}
      className={className}
    >
      <Suspense fallback={skeleton || <LoadingSpinner size="lg" />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
