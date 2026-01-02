import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('wagmi', () => ({
  useAccount: () => ({ address: '0xabc' }),
  useWriteContract: () => ({ writeContract: jest.fn(), data: null, isPending: false, isError: false, error: null, reset: jest.fn() }),
  useWaitForTransactionReceipt: () => ({ isSuccess: false, isError: false, error: null, isLoading: false }),
}));

jest.mock('react-hot-toast', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));

import { useTokenTransfer } from '../useTokenTransfer';

function HookTestComponent() {
  const { state, approveTx, transferTx, approve, transfer, reset } = useTokenTransfer();

  return (
    <div>
      <div data-testid="isApproving">{String(state.isApproving)}</div>
      <div data-testid="hasApproveTx">{String(Boolean(approveTx && approveTx.startLoading))}</div>
      <div data-testid="hasTransferTx">{String(Boolean(transferTx && transferTx.startLoading))}</div>
      <button onClick={() => (approve as any)('0xdef', '1')}>Approve</button>
      <button onClick={() => (transfer as any)('0xdef', '1')}>Transfer</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

describe('useTokenTransfer hook', () => {
  it('returns initial state and transaction hooks', () => {
    render(<HookTestComponent />);

    expect(screen.getByTestId('isApproving').textContent).toBe('false');
    expect(screen.getByTestId('hasApproveTx').textContent).toBe('true');
    expect(screen.getByTestId('hasTransferTx').textContent).toBe('true');
  });
});
