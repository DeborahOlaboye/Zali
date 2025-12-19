export enum ErrorCode {
  // Client errors
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_INPUT = 'INVALID_INPUT',
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Contract errors
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_ALLOWANCE = 'INSUFFICIENT_ALLOWANCE',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  CONTRACT_CALL_FAILED = 'CONTRACT_CALL_FAILED',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  
  // Validation errors
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  USERNAME_INVALID = 'USERNAME_INVALID',
  PASSWORD_INVALID = 'PASSWORD_INVALID',
  EMAIL_INVALID = 'EMAIL_INVALID',
  
  // Game errors
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  GAME_ALREADY_STARTED = 'GAME_ALREADY_STARTED',
  GAME_SESSION_EXPIRED = 'GAME_SESSION_EXPIRED',
  INVALID_ANSWER = 'INVALID_ANSWER',
  GAME_NOT_REGISTERED = 'GAME_NOT_REGISTERED',
  NOT_ENOUGH_QUESTIONS = 'NOT_ENOUGH_QUESTIONS',
  
  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  REQUEST_FAILED = 'REQUEST_FAILED',
  
  // Wallet errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_SWITCH_FAILED = 'WALLET_SWITCH_FAILED',
  USER_REJECTED_REQUEST = 'USER_REJECTED_REQUEST',
  INVALID_CHAIN = 'INVALID_CHAIN',
}

export interface ErrorDetails {
  code: ErrorCode | string;
  message: string;
  statusCode?: number;
  details?: Record<string, any>;
  context?: string;
  timestamp?: string;
  requestId?: string;
  userMessage?: string;
}

export class ApiException extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly context?: string;

  constructor(
    code: string | ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: Record<string, any>,
    context?: string
  ) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.context = context;
    Object.setPrototypeOf(this, ApiException.prototype);
  }

  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationErrorResponse {
  success: false;
  error: {
    code: ErrorCode | string;
    message: string;
  };
  validationErrors?: ValidationError[];
  requestId?: string;
}

export interface ContractErrorContext {
  functionName?: string;
  contractAddress?: string;
  userAddress?: string;
  txHash?: string;
  blockNumber?: number;
  gasUsed?: bigint;
}

export interface ContractError extends ApiException {
  contractContext?: ContractErrorContext;
}

export const ERROR_MESSAGES: Record<string, string> = {
  [ErrorCode.INVALID_REQUEST]: 'Invalid request. Please check your input.',
  [ErrorCode.INVALID_INPUT]: 'The provided input is invalid.',
  [ErrorCode.AUTHENTICATION_REQUIRED]: 'Authentication is required for this operation.',
  [ErrorCode.AUTHORIZATION_FAILED]: 'You do not have permission to perform this action.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.CONFLICT]: 'The request conflicts with existing data.',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please try again later.',
  [ErrorCode.INSUFFICIENT_BALANCE]: 'Insufficient balance for this transaction.',
  [ErrorCode.INSUFFICIENT_ALLOWANCE]: 'Insufficient token allowance. Please approve first.',
  [ErrorCode.TRANSACTION_FAILED]: 'Transaction failed. Please try again.',
  [ErrorCode.CONTRACT_CALL_FAILED]: 'Contract call failed.',
  [ErrorCode.INVALID_ADDRESS]: 'Invalid wallet address.',
  [ErrorCode.USERNAME_ALREADY_EXISTS]: 'This username is already taken.',
  [ErrorCode.USERNAME_INVALID]: 'Username must be 3-20 characters, alphanumeric.',
  [ErrorCode.PASSWORD_INVALID]: 'Password must be at least 8 characters.',
  [ErrorCode.EMAIL_INVALID]: 'Please enter a valid email address.',
  [ErrorCode.GAME_NOT_FOUND]: 'The requested game session was not found.',
  [ErrorCode.GAME_ALREADY_STARTED]: 'A game session is already in progress.',
  [ErrorCode.GAME_SESSION_EXPIRED]: 'Your game session has expired.',
  [ErrorCode.INVALID_ANSWER]: 'Invalid answer selection.',
  [ErrorCode.GAME_NOT_REGISTERED]: 'Player not registered. Please register first.',
  [ErrorCode.NOT_ENOUGH_QUESTIONS]: 'Not enough questions available to start a game.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred. Please try again.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service is currently unavailable. Please try again later.',
  [ErrorCode.TIMEOUT]: 'Request timeout. Please try again.',
  [ErrorCode.DATABASE_ERROR]: 'Database error. Please try again later.',
  [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ErrorCode.CONNECTION_FAILED]: 'Connection failed. Please try again.',
  [ErrorCode.REQUEST_FAILED]: 'Request failed. Please try again.',
  [ErrorCode.WALLET_NOT_CONNECTED]: 'Please connect your wallet.',
  [ErrorCode.WALLET_SWITCH_FAILED]: 'Failed to switch wallet network.',
  [ErrorCode.USER_REJECTED_REQUEST]: 'User rejected the request.',
  [ErrorCode.INVALID_CHAIN]: 'Invalid blockchain chain. Please switch to the correct network.',
};
