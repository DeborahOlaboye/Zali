'use client';

import { ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface FormErrorBoundaryProps {
  children: ReactNode;
  formName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

export function FormErrorBoundary({ 
  children, 
  formName,
  onError,
  onReset 
}: FormErrorBoundaryProps) {
  return (
    <ErrorBoundary
      name={`FormErrorBoundary${formName ? ` (${formName})` : ''}`}
      level="component"
      onError={onError}
      fallback={(error, errorInfo, reset) => {
        const handleReset = () => {
          onReset?.();
          reset();
        };

        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Form Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {formName ? `The ${formName} form` : 'This form'} encountered an error and cannot be displayed properly.
                  </p>
                  {error.message && (
                    <p className="mt-1 font-mono text-xs bg-red-100 p-2 rounded">
                      {error.message}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reset Form
                    </button>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="bg-white px-3 py-2 rounded-md text-sm font-medium text-red-800 border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
}