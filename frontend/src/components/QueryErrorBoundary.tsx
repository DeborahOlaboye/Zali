'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary';

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function QueryErrorBoundary({ 
  children, 
  fallback,
  onError 
}: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          name="QueryErrorBoundary"
          level="section"
          onError={onError}
          fallback={(error, errorInfo, resetError) => {
            if (fallback) {
              return fallback(error, () => {
                reset();
                resetError();
              });
            }

            return (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-800">
                    Data Loading Error
                  </h3>
                </div>
                <p className="text-red-700 mt-2">
                  Failed to load data. Please check your connection and try again.
                </p>
                <button
                  onClick={() => {
                    reset();
                    resetError();
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}