// Transaction loading and progress state types

/**
 * Represents the different phases of a transaction lifecycle
 */
export type TransactionPhase = 
  | 'idle'
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed';

/**
 * Represents the different steps in a transaction process
 */
export type TransactionStep =
  | 'initial'
  | 'preparing'
  | 'signing'
  | 'submitted'
  | 'mining'
  | 'confirming'
  | 'completed'
  | 'failed';

/**
 * Core transaction loading state
 */
export interface TransactionLoadingState {
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  phase: TransactionPhase;
  step: TransactionStep;
  progress: number; // 0-100
  startedAt: Date | null;
  completedAt: Date | null;
}

/**
 * Complete transaction state with all metadata
 */
export interface TransactionState extends TransactionLoadingState {
  txHash: string | null;
  blockNumber: number | null;
  confirmations: number;
  estimatedGasPrice: string | null;
  actualGasPrice: string | null;
  gasUsed: string | null;
  transactionFee: string | null;
  from: string | null;
  to: string | null;
  value: string | null;
  data: string | null;
  nonce: number | null;
}

/**
 * Transaction operation types
 */
export type TransactionOperationType =
  | 'transfer'
  | 'approval'
  | 'swap'
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'play'
  | 'register'
  | 'update'
  | 'custom';

/**
 * Transaction operation state
 */
export interface TransactionOperation {
  id: string;
  type: TransactionOperationType;
  description: string;
  state: TransactionState;
  metadata?: Record<string, any>;
  retryCount: number;
  maxRetries: number;
}

/**
 * Multiple transactions tracking
 */
export interface TransactionBatch {
  id: string;
  operations: TransactionOperation[];
  totalOperations: number;
  completedOperations: number;
  failedOperations: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  progress: number;
}

/**
 * Loading state for async transaction functions
 */
export interface TransactionFunctionLoadingState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash: string | null;
}

/**
 * Hook return type for transaction loading
 */
export interface UseTransactionLoadingReturn {
  state: TransactionState;
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  progress: number;
  phase: TransactionPhase;
  step: TransactionStep;
  txHash: string | null;
  reset: () => void;
}

/**
 * Configuration for transaction loading behavior
 */
export interface TransactionLoadingConfig {
  enableProgressTracking?: boolean;
  enableGasTracking?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  estimatedDuration?: number;
  showProgressBar?: boolean;
  updateInterval?: number;
}

/**
 * Transaction progress event
 */
export interface TransactionProgressEvent {
  phase: TransactionPhase;
  step: TransactionStep;
  progress: number;
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
}

/**
 * Transaction history entry
 */
export interface TransactionHistoryEntry {
  id: string;
  hash: string;
  type: TransactionOperationType;
  description: string;
  from: string;
  to: string | null;
  value: string;
  state: TransactionState;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}
