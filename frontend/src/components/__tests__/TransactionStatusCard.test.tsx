import React from 'react';
import { render } from '@testing-library/react';
import TransactionStatusCard from '@/components/TransactionStatusCard';
import { createInitialTransactionState, updateToPending, updateToSuccess, updateToFailed } from '@/utils/transactionStateManager';

describe('TransactionStatusCard', () => {
  it('renders success state', () => {
    let s = createInitialTransactionState();
    s = updateToPending(s);
    s = updateToSuccess(s);
    const { getByText } = render(<TransactionStatusCard state={s} /> as any);
    expect(getByText(/completed|success/i)).toBeTruthy();
  });

  it('renders failed state and shows error message', () => {
    let s = createInitialTransactionState();
    s = updateToFailed(s, new Error('fail'));
    const { getByText } = render(<TransactionStatusCard state={s} /> as any);
    expect(getByText(/Transaction failed/i)).toBeTruthy();
    expect(getByText(/fail/)).toBeTruthy();
  });
});
