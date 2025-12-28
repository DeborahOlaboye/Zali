// Transaction state management utility

import {
  TransactionState,
  TransactionPhase,
  TransactionStep,
  TransactionLoadingState,
  TransactionOperation,
  TransactionProgressEvent,
} from '@/types/transaction';

/**
 * Create initial transaction state
 */
export function createInitialTransactionState(): TransactionState {
  return {
    isLoading: false,
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: false,
    error: null,
    phase: 'idle',
    step: 'initial',
    progress: 0,
    startedAt: null,
    completedAt: null,
    txHash: null,
    blockNumber: null,
    confirmations: 0,
    estimatedGasPrice: null,
    actualGasPrice: null,
    gasUsed: null,
    transactionFee: null,
    from: null,
    to: null,
    value: null,
    data: null,
    nonce: null,
  };
}

/**
 * Create initial loading state
 */
export function createInitialLoadingState(): TransactionLoadingState {
  return {
    isLoading: false,
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: false,
    error: null,
    phase: 'idle',
    step: 'initial',
    progress: 0,
    startedAt: null,
    completedAt: null,
  };
}

/**
 * Update transaction state to pending
 */
export function updateToPending(state: TransactionState): TransactionState {
  return {
    ...state,
    isLoading: true,
    isPending: true,
    isError: false,
    error: null,
    phase: 'pending',
    step: 'preparing',
    progress: 10,
    startedAt: new Date(),
  };
}

/**
 * Update transaction state to signing
 */
export function updateToSigning(state: TransactionState): TransactionState {
  return {
    ...state,
    step: 'signing',
    progress: 25,
  };
}

/**
 * Update transaction state to submitted with tx hash
 */
export function updateToSubmitted(
  state: TransactionState,
  txHash: string,
  from?: string
): TransactionState {
  return {
    ...state,
    step: 'submitted',
    progress: 50,
    txHash,
    from: from || state.from,
  };
}

/**
 * Update transaction state to mining
 */
export function updateToMining(state: TransactionState): TransactionState {
  return {
    ...state,
    step: 'mining',
    progress: 65,
  };
}

/**
 * Update transaction state to confirming
 */
export function updateToConfirming(state: TransactionState): TransactionState {
  return {
    ...state,
    phase: 'confirming',
    isConfirming: true,
    step: 'confirming',
    progress: 80,
  };
}

/**
 * Update transaction with confirmation data
 */
export function updateWithConfirmation(
  state: TransactionState,
  blockNumber: number,
  confirmations: number
): TransactionState {
  const progress = Math.min(80 + (confirmations * 5), 99);
  return {
    ...state,
    blockNumber,
    confirmations,
    progress,
  };
}

/**
 * Update transaction state to success
 */
export function updateToSuccess(state: TransactionState): TransactionState {
  return {
    ...state,
    isLoading: false,
    isPending: false,
    isConfirming: false,
    isSuccess: true,
    isError: false,
    error: null,
    phase: 'confirmed',
    step: 'completed',
    progress: 100,
    completedAt: new Date(),
  };
}

/**
 * Update transaction state to failed
 */
export function updateToFailed(
  state: TransactionState,
  error: Error
): TransactionState {
  return {
    ...state,
    isLoading: false,
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: true,
    error,
    phase: 'failed',
    step: 'failed',
    progress: 0,
    completedAt: new Date(),
  };
}

/**
 * Reset transaction state
 */
export function resetTransactionState(state: TransactionState): TransactionState {
  return createInitialTransactionState();
}

/**
 * Calculate transaction progress based on phase and step
 */
export function calculateProgress(
  phase: TransactionPhase,
  step: TransactionStep
): number {
  const stepProgression: Record<TransactionStep, number> = {
    initial: 0,
    preparing: 10,
    signing: 25,
    submitted: 50,
    mining: 65,
    confirming: 80,
    completed: 100,
    failed: 0,
  };

  return stepProgression[step] || 0;
}

/**
 * Get transaction phase label
 */
export function getPhaseLabel(phase: TransactionPhase): string {
  const labels: Record<TransactionPhase, string> = {
    idle: 'Idle',
    pending: 'Pending',
    confirming: 'Confirming',
    confirmed: 'Confirmed',
    failed: 'Failed',
  };

  return labels[phase] || 'Unknown';
}

/**
 * Get transaction step label
 */
export function getStepLabel(step: TransactionStep): string {
  const labels: Record<TransactionStep, string> = {
    initial: 'Initial',
    preparing: 'Preparing',
    signing: 'Sign in wallet',
    submitted: 'Submitted',
    mining: 'Processing',
    confirming: 'Confirming',
    completed: 'Completed',
    failed: 'Failed',
  };

  return labels[step] || 'Unknown';
}

/**
 * Get user-friendly message for current transaction state
 */
export function getTransactionMessage(state: TransactionState): string {
  if (state.isError && state.error) {
    return `Transaction failed: ${state.error.message}`;
  }

  const stepMessages: Record<TransactionStep, string> = {
    initial: 'Ready to start',
    preparing: 'Preparing transaction...',
    signing: 'Please sign the transaction in your wallet',
    submitted: 'Transaction submitted to network',
    mining: 'Transaction is being processed by the network',
    confirming: 'Waiting for confirmations...',
    completed: 'Transaction completed successfully',
    failed: 'Transaction failed',
  };

  return stepMessages[state.step] || 'Processing...';
}

/**
 * Check if transaction is finalized (success or error)
 */
export function isTransactionFinalized(state: TransactionState): boolean {
  return state.isSuccess || state.isError;
}

/**
 * Check if transaction is in progress
 */
export function isTransactionInProgress(state: TransactionState): boolean {
  return state.isLoading || state.isPending || state.isConfirming;
}

/**
 * Calculate elapsed time in transaction
 */
export function calculateElapsedTime(state: TransactionState): number {
  if (!state.startedAt) return 0;

  const endTime = state.completedAt || new Date();
  return Math.floor((endTime.getTime() - state.startedAt.getTime()) / 1000);
}

/**
 * Create transaction progress event
 */
export function createProgressEvent(
  state: TransactionState,
  message: string,
  details?: Record<string, any>
): TransactionProgressEvent {
  return {
    phase: state.phase,
    step: state.step,
    progress: state.progress,
    message,
    timestamp: new Date(),
    details,
  };
}

/**
 * Merge transaction states (for batch operations)
 */
export function mergeTransactionStates(
  states: TransactionState[]
): Partial<TransactionState> {
  const allLoading = states.every(s => s.isLoading);
  const anyError = states.some(s => s.isError);
  const allSuccess = states.every(s => s.isSuccess);

  const avgProgress = states.length > 0
    ? Math.floor(states.reduce((sum, s) => sum + s.progress, 0) / states.length)
    : 0;

  return {
    isLoading: allLoading,
    isError: anyError,
    isSuccess: allSuccess && states.length > 0,
    progress: avgProgress,
    error: states.find(s => s.error)?.error || null,
  };
}
