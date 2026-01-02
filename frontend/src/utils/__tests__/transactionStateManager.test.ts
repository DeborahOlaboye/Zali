import {
  createInitialTransactionState,
  updateToPending,
  updateToSigning,
  updateToSubmitted,
  updateToMining,
  updateToConfirming,
  updateWithConfirmation,
  updateToSuccess,
  updateToFailed,
  calculateProgress,
  getPhaseLabel,
  getStepLabel,
} from '@/utils/transactionStateManager';

describe('transactionStateManager', () => {
  it('creates initial state', () => {
    const s = createInitialTransactionState();
    expect(s.isLoading).toBe(false);
    expect(s.phase).toBe('idle');
    expect(s.progress).toBe(0);
  });

  it('updates to pending and signing', () => {
    let s = createInitialTransactionState();
    s = updateToPending(s);
    expect(s.phase).toBe('pending');
    expect(s.progress).toBeGreaterThan(0);
    s = updateToSigning(s);
    expect(s.step).toBe('signing');
  });

  it('submits and confirms', () => {
    let s = createInitialTransactionState();
    s = updateToSubmitted(s, '0xabc');
    expect(s.txHash).toBe('0xabc');
    s = updateToMining(s);
    expect(s.step).toBe('mining');
    s = updateToConfirming(s);
    expect(s.isConfirming).toBe(true);
    s = updateWithConfirmation(s, 123, 2);
    expect(s.confirmations).toBe(2);
  });

  it('success and failed flows', () => {
    let s = createInitialTransactionState();
    s = updateToSuccess(s);
    expect(s.isSuccess).toBe(true);
    s = createInitialTransactionState();
    s = updateToFailed(s, new Error('fail'));
    expect(s.isError).toBe(true);
  });

  it('calculates progress and labels', () => {
    expect(calculateProgress('pending', 'signing')).toBeGreaterThanOrEqual(0);
    expect(getPhaseLabel('pending')).toContain('Pending');
    expect(getStepLabel('signing')).toContain('Sign');
  });
});
