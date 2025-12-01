/**
 * Custom error types for contract interactions
 */

export enum ContractErrorType {
  // Connection errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  CHAIN_NOT_SUPPORTED = 'CHAIN_NOT_SUPPORTED',
  CONTRACT_NOT_DEPLOYED = 'CONTRACT_NOT_DEPLOYED',
  
  // Transaction errors
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',
  
  // Token transfer errors
  INSUFFICIENT_TOKEN_BALANCE = 'INSUFFICIENT_TOKEN_BALANCE',
  INSUFFICIENT_ALLOWANCE = 'INSUFFICIENT_ALLOWANCE',
  TOKEN_TRANSFER_FAILED = 'TOKEN_TRANSFER_FAILED',
  TOKEN_APPROVAL_FAILED = 'TOKEN_APPROVAL_FAILED',
  TOKEN_APPROVAL_REJECTED = 'TOKEN_APPROVAL_REJECTED',
  TOKEN_TRANSFER_REJECTED = 'TOKEN_TRANSFER_REJECTED',
  ZERO_AMOUNT_TRANSFER = 'ZERO_AMOUNT_TRANSFER',
  TRANSFER_TO_ZERO_ADDRESS = 'TRANSFER_TO_ZERO_ADDRESS',
  
  // Contract-specific errors
  NOT_REGISTERED = 'NOT_REGISTERED',
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  INVALID_SESSION = 'INVALID_SESSION',
  SESSION_COMPLETED = 'SESSION_COMPLETED',
  INVALID_ANSWER = 'INVALID_ANSWER',
  
  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface ContractError extends Error {
  code: ContractErrorType;
  details?: Record<string, any>;
  originalError?: any;
}

/**
 * Creates a standardized contract error object
 */
export function createContractError(
  type: ContractErrorType,
  message: string,
  details?: Record<string, any>,
  originalError?: any
): ContractError {
  const error = new Error(message) as ContractError;
  error.code = type;
  error.details = details;
  error.originalError = originalError;
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
 * Checks if an error is related to token transfer
 */
export function isTokenTransferError(error: any): boolean {
  const message = error?.message?.toLowerCase() || '';
  const reason = error?.reason?.toLowerCase() || '';
  const data = error?.data?.message?.toLowerCase() || '';
  
  return (
    message.includes('transfer') ||
    message.includes('erc20') ||
    message.includes('token') ||
    reason.includes('transfer') ||
    reason.includes('erc20') ||
    data.includes('transfer') ||
    error?.code === 'TRANSFER_FAILED' ||
    error?.code === 'TOKEN_TRANSFER_FAILED'
  );
}

/**
 * Checks if an error is related to insufficient token allowance
 */
export function isInsufficientAllowanceError(error: any): boolean {
  const message = error?.message?.toLowerCase() || '';
  const reason = error?.reason?.toLowerCase() || '';
  
  return (
    message.includes('allowance') ||
    message.includes('insufficient allowance') ||
    message.includes('allowance too low') ||
    reason.includes('allowance') ||
    error?.code === 'INSUFFICIENT_ALLOWANCE' ||
    error?.data?.message?.toLowerCase()?.includes('allowance')
  );
}

/**
 * Checks if an error is related to token approval
 */
export function isTokenApprovalError(error: any): boolean {
  const message = error?.message?.toLowerCase() || '';
  const reason = error?.reason?.toLowerCase() || '';
  
  return (
    message.includes('approve') ||
    message.includes('approval') ||
    reason.includes('approve') ||
    reason.includes('approval') ||
    error?.code === 'APPROVAL_FAILED' ||
    error?.code === 'TOKEN_APPROVAL_FAILED'
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
 * Parses a contract error and returns a user-friendly message
 */
export function parseContractError(error: any): { message: string; code: ContractErrorType } {
  console.error('Contract error:', error);

  // Handle user rejection
  if (isUserRejectedError(error)) {
    return {
      message: 'Transaction was rejected',
      code: ContractErrorType.TRANSACTION_REJECTED,
    };
  }

  // Handle insufficient funds
  if (isInsufficientFundsError(error)) {
    return {
      message: 'Insufficient funds for transaction',
      code: ContractErrorType.INSUFFICIENT_FUNDS,
    };
  }

  // Handle token transfer errors (check before generic errors)
  if (isTokenTransferError(error)) {
    const message = error?.message?.toLowerCase() || '';
    const reason = error?.reason?.toLowerCase() || '';
    const errorData = message + ' ' + reason;
    
    // Insufficient token balance
    if (errorData.includes('insufficient balance') || 
        errorData.includes('balance too low') ||
        errorData.includes('exceeds balance') ||
        errorData.includes('transfer amount exceeds balance')) {
      return {
        message: 'Insufficient token balance. Please ensure you have enough cUSD in your wallet.',
        code: ContractErrorType.INSUFFICIENT_TOKEN_BALANCE,
      };
    }
    
    // Insufficient allowance
    if (isInsufficientAllowanceError(error)) {
      return {
        message: 'Token approval required. Please approve the transaction to allow the contract to spend your tokens.',
        code: ContractErrorType.INSUFFICIENT_ALLOWANCE,
      };
    }
    
    // Transfer to zero address
    if (errorData.includes('transfer to zero address') ||
        errorData.includes('transfer to the zero address')) {
      return {
        message: 'Cannot transfer tokens to an invalid address.',
        code: ContractErrorType.TRANSFER_TO_ZERO_ADDRESS,
      };
    }
    
    // Zero amount transfer
    if (errorData.includes('transfer amount is zero') ||
        errorData.includes('amount must be greater than zero')) {
      return {
        message: 'Transfer amount must be greater than zero.',
        code: ContractErrorType.ZERO_AMOUNT_TRANSFER,
      };
    }
    
    // Generic token transfer failure
    return {
      message: 'Token transfer failed. Please check your balance and try again.',
      code: ContractErrorType.TOKEN_TRANSFER_FAILED,
    };
  }
  
  // Handle token approval errors
  if (isTokenApprovalError(error)) {
    if (isUserRejectedError(error)) {
      return {
        message: 'Token approval was cancelled. Please approve the transaction to continue.',
        code: ContractErrorType.TOKEN_APPROVAL_REJECTED,
      };
    }
    
    return {
      message: 'Token approval failed. Please try again or check your wallet connection.',
      code: ContractErrorType.TOKEN_APPROVAL_FAILED,
    };
  }

  // Handle network errors
  if (isNetworkError(error)) {
    return {
      message: 'Network error. Please check your connection',
      code: ContractErrorType.NETWORK_ERROR,
    };
  }

  // Handle contract-specific errors
  if (typeof error?.message === 'string') {
    // Handle common contract revert reasons
    const message = error.message.toLowerCase();
    
    if (message.includes('not registered')) {
      return {
        message: 'Please register before performing this action',
        code: ContractErrorType.NOT_REGISTERED,
      };
    }
    
    if (message.includes('already registered')) {
      return {
        message: 'This address is already registered',
        code: ContractErrorType.ALREADY_REGISTERED,
      };
    }
    
    if (message.includes('invalid session') || message.includes('session does not exist')) {
      return {
        message: 'Invalid game session',
        code: ContractErrorType.INVALID_SESSION,
      };
    }
    
    if (message.includes('session already completed')) {
      return {
        message: 'This game session is already completed',
        code: ContractErrorType.SESSION_COMPLETED,
      };
    }
  }

  // Default error
  return {
    message: error?.message || 'An unknown error occurred',
    code: ContractErrorType.UNKNOWN_ERROR,
  };
}

/**
 * Wraps a contract call with error handling
 */
export async function withContractErrorHandling<T>(
  fn: () => Promise<T>,
  context: string = 'contract interaction'
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const { message, code } = parseContractError(error);
    const contractError = createContractError(
      code,
      `${context} failed: ${message}`,
      { context },
      error
    );
    
    // Log the full error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Contract Error] ${context}:`, {
        error,
        parsed: { message, code },
        contractError,
      });
    }
    
    throw contractError;
  }
}
