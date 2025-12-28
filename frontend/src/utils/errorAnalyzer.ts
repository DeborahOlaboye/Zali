// Error severity detection and categorization

import { ErrorSeverity } from '@/types/errorBoundary';

export interface ErrorAnalysis {
  severity: ErrorSeverity;
  category: string;
  isDevelopment: boolean;
  isUserError: boolean;
  isNetworkError: boolean;
  isContractError: boolean;
  suggestedAction?: string;
}

/**
 * Analyze error and determine severity level
 */
export function analyzeError(error: Error | null, _errorInfo?: React.ErrorInfo): ErrorAnalysis {
  if (!error) {
    return {
      severity: 'info',
      category: 'unknown',
      isDevelopment: false,
      isUserError: false,
      isNetworkError: false,
      isContractError: false,
    };
  }

  const message = error.message.toLowerCase();
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check error types
  const isNetworkError = message.includes('network') || 
                        message.includes('fetch') || 
                        message.includes('timeout') ||
                        message.includes('connection');
  
  const isContractError = message.includes('contract') || 
                         message.includes('transaction') || 
                         message.includes('revert') ||
                         message.includes('call revert');
  
  const isUserError = message.includes('wallet') || 
                     message.includes('permission') || 
                     message.includes('rejected') ||
                     message.includes('user denied');

  // Determine severity
  let severity: ErrorSeverity = 'warning';

  if (isContractError) {
    severity = 'critical';
  } else if (isNetworkError) {
    severity = 'warning';
  } else if (isUserError) {
    severity = 'info';
  } else if (isDevelopment) {
    severity = 'critical';
  }

  // Suggest action
  let suggestedAction: string | undefined;
  
  if (isNetworkError) {
    suggestedAction = 'Check your internet connection and try again';
  } else if (isContractError) {
    suggestedAction = 'Verify your wallet connection and transaction details';
  } else if (isUserError) {
    suggestedAction = 'Please approve the action in your wallet';
  }

  return {
    severity,
    category: getErrorCategory(error),
    isDevelopment,
    isUserError,
    isNetworkError,
    isContractError,
    suggestedAction,
  };
}

/**
 * Categorize error based on type or message
 */
export function getErrorCategory(error: Error): string {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  if (message.includes('wallet') || name.includes('wallet')) {
    return 'wallet';
  }
  if (message.includes('network') || name.includes('network')) {
    return 'network';
  }
  if (message.includes('contract') || message.includes('call revert')) {
    return 'contract';
  }
  if (message.includes('permission') || message.includes('denied')) {
    return 'permission';
  }
  if (message.includes('timeout')) {
    return 'timeout';
  }
  if (message.includes('balance') || message.includes('insufficient')) {
    return 'balance';
  }
  if (name === 'typeerror') {
    return 'type';
  }
  if (name === 'referenceerror') {
    return 'reference';
  }
  if (name === 'syntaxerror') {
    return 'syntax';
  }
  
  return 'unknown';
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: Error): boolean {
  const category = getErrorCategory(error);
  const unrecoverableCategories = ['syntax', 'reference', 'type'];
  
  return !unrecoverableCategories.includes(category);
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: Error | null): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  const analysis = analyzeError(error);

  switch (analysis.category) {
    case 'wallet':
      return 'There was an issue with your wallet. Please reconnect and try again.';
    case 'network':
      return 'Network error. Please check your connection and try again.';
    case 'contract':
      return 'Transaction failed. Please check the details and try again.';
    case 'permission':
      return 'Permission denied. Please approve the action in your wallet.';
    case 'timeout':
      return 'Request timed out. Please try again.';
    case 'balance':
      return 'Insufficient balance. Please check your account balance.';
    case 'type':
      return 'An unexpected error occurred. Please refresh the page.';
    case 'reference':
      return 'An unexpected error occurred. Please refresh the page.';
    case 'syntax':
      return 'An unexpected error occurred. Please refresh the page.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}
