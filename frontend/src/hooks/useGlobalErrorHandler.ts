'use client';

import { useCallback, useEffect } from 'react';
import { errorLogger } from '@/utils/errorLogger';
import { analyzeError } from '@/utils/errorAnalyzer';

interface UseGlobalErrorHandlerOptions {
  enableConsoleLogging?: boolean;
  enableRemoteLogging?: boolean;
  onError?: (error: Error, context?: string) => void;
}

export function useGlobalErrorHandler({
  enableConsoleLogging = true,
  enableRemoteLogging = true,
  onError
}: UseGlobalErrorHandlerOptions = {}) {
  
  const handleError = useCallback((error: Error, context?: string) => {
    const analysis = analyzeError(error);
    
    if (enableConsoleLogging) {
      console.error(`Global Error ${context ? `(${context})` : ''}:`, error);
    }
    
    if (enableRemoteLogging) {
      errorLogger.logError(error, { context }, analysis.severity);
    }
    
    onError?.(error, context);
  }, [enableConsoleLogging, enableRemoteLogging, onError]);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      handleError(error, 'unhandledRejection');
    };

    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error || new Error(event.message);
      handleError(error, 'globalError');
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [handleError]);

  return { handleError };
}