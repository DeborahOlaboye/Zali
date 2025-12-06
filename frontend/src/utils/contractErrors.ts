/**
 * Custom error types for contract interactions
 */

export enum ContractErrorType {
  // Connection errors (1000-1099)
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  CHAIN_NOT_SUPPORTED = 'CHAIN_NOT_SUPPORTED',
  CONTRACT_NOT_DEPLOYED = 'CONTRACT_NOT_DEPLOYED',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  
  // Transaction errors (1100-1199)
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  TRANSACTION_UNDERPRICED = 'TRANSACTION_UNDERPRICED',
  TRANSACTION_REPLACED = 'TRANSACTION_REPLACED',
  
  // Account errors (1200-1299)
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  
  // Contract-specific errors (1300-1399)
  NOT_REGISTERED = 'NOT_REGISTERED',
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  INVALID_SESSION = 'INVALID_SESSION',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  INVALID_ANSWER = 'INVALID_ANSWER',
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Network errors (1400-1499)
  NETWORK_ERROR = 'NETWORK_ERROR',
  NETWORK_SWITCH_REQUIRED = 'NETWORK_SWITCH_REQUIRED',
  
  // General errors (1500-1599)
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  
  // Rate limiting and spam protection (1600-1699)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS'
}

export interface ContractError extends Error {
  code: ContractErrorType;
  details?: Record<string, any>;
  originalError?: any;
}

/**
 * Creates a standardized contract error object with enhanced error handling
 */
export function createContractError(
  type: ContractErrorType,
  message: string,
  details: Record<string, any> = {},
  originalError?: any
): ContractError {
  const error = new Error(message) as ContractError;
  error.code = type;
  
  // Enhance details with timestamp and additional context
  error.details = {
    timestamp: new Date().toISOString(),
    ...details,
    // Preserve original error details if available
    ...(originalError?.details && { originalDetails: originalError.details })
  };
  
  // Preserve the original error stack for debugging
  if (originalError) {
    error.originalError = originalError;
    error.stack = `${error.stack}\n--- Original Error ---\n${originalError.stack || originalError.message || originalError}`;
  }
  
  return error;
}

/**
 * Checks if an error is a user rejection error
 */
export function isUserRejectedError(error: any): boolean {
  return (
    error?.code === 4001 || // EIP-1193 user rejected request
    error?.code === 'ACTION_REJECTED' || // MetaMask
    error?.message?.includes('User rejected') || // Common pattern
    error?.message?.includes('user rejected') || // Common pattern
    error?.message?.includes('denied') // Some wallets use this
  );
}

/**
 * Checks if an error is due to insufficient funds
 */
export function isInsufficientFundsError(error: any): boolean {
  return (
    error?.code === 'INSUFFICIENT_FUNDS' ||
    error?.message?.includes('insufficient funds') ||
    error?.message?.includes('not enough funds') ||
    error?.details?.includes('insufficient funds')
  );
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('network') ||
    error?.message?.includes('Network') ||
    error?.name === 'NetworkError' ||
    !navigator.onLine
  );
}

/**
 * Parses a contract error and returns a user-friendly message with detailed context
 */
export function parseContractError(error: any, context: Record<string, any> = {}): { message: string; code: ContractErrorType; details?: Record<string, any> } {
  console.error('Contract error:', { error, context });

  // Extract error message and code from different error formats
  const errorMessage = error?.message || error?.toString() || 'An unknown error occurred';
  const errorCode = error?.code || ContractErrorType.UNKNOWN_ERROR;
  const errorData = error?.data || error?.error?.data;
  
  // Check for common error patterns
  const message = errorMessage.toLowerCase();
  
  // Handle user rejection
  if (isUserRejectedError(error)) {
    return {
      message: 'Transaction was cancelled',
      code: ContractErrorType.TRANSACTION_REJECTED,
      details: { action: 'User rejected the transaction', context }
    };
  }

  // Handle insufficient funds
  if (isInsufficientFundsError(error)) {
    return {
      message: 'Insufficient funds for transaction',
      code: ContractErrorType.INSUFFICIENT_FUNDS,
      details: { 
        required: error?.error?.data?.required,
        balance: error?.error?.data?.balance,
        context
      }
    };
  }

  // Handle network errors
  if (isNetworkError(error)) {
    return {
      message: 'Network error. Please check your internet connection and try again.',
      code: ContractErrorType.NETWORK_ERROR,
      details: { 
        online: navigator.onLine,
        context
      }
    };
  }

  // Handle transaction underpriced
  if (message.includes('replacement fee too low') || message.includes('transaction underpriced')) {
    return {
      message: 'Transaction fee too low. Please try again with higher gas price.',
      code: ContractErrorType.TRANSACTION_UNDERPRICED,
      details: { context }
    };
  }

  // Handle contract-specific errors
  if (errorData) {
    // Handle common contract revert reasons with more specific messages
    const revertReason = extractRevertReason(errorData);
    if (revertReason) {
      return {
        message: revertReason,
        code: ContractErrorType.TRANSACTION_FAILED,
        details: { 
          revertReason,
          context,
          errorData
        }
      };
    }
  }

  // Handle common error patterns with more specific messages
  if (message.includes('not registered')) {
    return {
      message: 'Account not registered. Please register before playing.',
      code: ContractErrorType.NOT_REGISTERED,
      details: { context, suggestion: 'Register your account to continue' }
    };
  }
  
  if (message.includes('already registered')) {
    return {
      message: 'This wallet is already registered',
      code: ContractErrorType.ALREADY_REGISTERED,
      details: { context, suggestion: 'Try logging in with a different wallet' }
    };
  }
  
  if (message.includes('invalid session') || message.includes('session does not exist')) {
    return {
      message: 'Invalid or expired game session',
      code: ContractErrorType.INVALID_SESSION,
      details: { 
        context, 
        suggestion: 'Start a new game session' 
      }
    };
  }
  
  if (message.includes('session already completed')) {
    return {
      message: 'This game session has already been completed',
      code: ContractErrorType.SESSION_COMPLETED,
      details: { 
        context, 
        suggestion: 'Start a new game to play again' 
      }
    };
  }

  // Default error with more context
  return {
    message: errorMessage || 'An unexpected error occurred',
    code: errorCode,
    details: { 
      context,
      originalError: errorMessage,
      suggestion: 'Please try again or contact support if the issue persists'
    }
  };
}

/**
 * Extracts revert reason from error data if available
 */
function extractRevertReason(errorData: any): string | null {
  try {
    // Handle different error data formats
    if (typeof errorData === 'string') {
      // Try to parse JSON string
      try {
        const parsed = JSON.parse(errorData);
        return parsed.message || parsed.error?.message || null;
      } catch {
        // If not JSON, check for common revert patterns
        const revertMatch = errorData.match(/reverted with reason string '([^']*)'/);
        if (revertMatch) return revertMatch[1];
        
        const customErrorMatch = errorData.match(/custom error [a-fA-F0-9]+:([^\n]+)/);
        if (customErrorMatch) return customErrorMatch[1].trim();
      }
    } else if (errorData?.message) {
      return errorData.message;
    } else if (errorData?.error?.message) {
      return errorData.error.message;
    }
  } catch (e) {
    console.error('Error extracting revert reason:', e);
  }
  
  return null;
}

/**
 * Wraps a contract call with comprehensive error handling and logging
 */
export async function withContractErrorHandling<T>(
  fn: () => Promise<T>,
  context: Record<string, any> = { action: 'contract interaction' }
): Promise<T> {
  const startTime = Date.now();
  const contextStr = typeof context === 'string' 
    ? { action: context } 
    : context;
  
  try {
    const result = await fn();
    
    // Log successful operation in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Contract Success] ${contextStr.action}`, {
        ...contextStr,
        duration: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      });
    }
    
    return result;
  } catch (error: any) {
    // Parse the error with context
    const { message, code, details } = parseContractError(error, {
      ...contextStr,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString()
    });
    
    // Create enhanced error object
    const contractError = createContractError(
      code,
      message,
      { 
        ...contextStr,
        ...(details || {}),
        duration: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      },
      error
    );
    
    // Log the error with appropriate level
    const logLevel = code === ContractErrorType.TRANSACTION_REJECTED ? 'warn' : 'error';
    console[logLevel](`[Contract Error] ${code}: ${message}`, {
      context: contextStr,
      error: contractError,
      stack: error.stack,
      originalError: error,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString()
    });
    
    // Re-throw with enhanced error information
    throw contractError;
  }
}

/**
 * Helper function to create a standardized error handler for UI components
 */
export function createErrorHandler(context: string) {
  return (error: any) => {
    const { message, code, details } = parseContractError(error, { context });
    
    // Here you can integrate with your UI notification system
    // For example, using toast notifications:
    // toast.error(message, { 
    //   errorId: `contract-error-${Date.now()}`,
    //   autoClose: 5000,
    //   ...details
    // });
    
    console.error(`[UI Error Handler] ${code}: ${message}`, { 
      context, 
      error, 
      details 
    });
    
    return { message, code, details };
  };
}

/**
 * Creates a retry handler for failed contract calls
 */
export function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const { 
    maxRetries = 3, 
    delayMs = 1000,
    shouldRetry = (error) => {
      // Don't retry user rejections or validation errors
      const nonRetryable = [
        ContractErrorType.TRANSACTION_REJECTED,
        ContractErrorType.VALIDATION_ERROR,
        ContractErrorType.INVALID_INPUT,
        ContractErrorType.NOT_IMPLEMENTED
      ];
      return !nonRetryable.includes(error?.code);
    }
  } = options;
  
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        attempts++;
        
        if (attempts > maxRetries || !shouldRetry(error)) {
          reject(error);
          return;
        }
        
        // Exponential backoff with jitter
        const delay = Math.min(delayMs * Math.pow(2, attempts - 1), 30000);
        const jitter = Math.random() * 1000;
        
        console.warn(`[Retry] Attempt ${attempts}/${maxRetries} failed, retrying in ${Math.round((delay + jitter) / 1000)}s`, {
          error,
          attempt: attempts,
          nextRetryIn: `${delay + jitter}ms`
        });
        
        setTimeout(attempt, delay + jitter);
      }
    };
    
    attempt();
  });
}
