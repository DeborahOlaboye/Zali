import React from 'react';
import { render } from '@testing-library/react';
import TransactionProgressBar from '@/components/TransactionProgressBar';
import { createInitialTransactionState, updateToPending, updateToSigning, updateToSubmitted } from '@/utils/transactionStateManager';

describe('TransactionProgressBar', () => {
  it('renders with initial state', () => {
    const state = createInitialTransactionState();
    const { getByText } = render(<TransactionProgressBar state={state} /> as any);
    expect(getByText(/Idle|Ready/)).toBeTruthy();
  });

  it('shows progress for submitted state', () => {
    let s = createInitialTransactionState();
    s = updateToPending(s);
    s = updateToSigning(s);
    s = updateToSubmitted(s, '0xabc');
    const { getByText } = render(<TransactionProgressBar state={s} /> as any);
    expect(getByText(/Submitted|Processing/)).toBeTruthy();
  });
});
