'use client';

import React from 'react';
import { useTransactionLoading } from '@/hooks/useTransactionLoading';
import TransactionProgressBar from '@/components/TransactionProgressBar';
import TransactionStatusCard from '@/components/TransactionStatusCard';
import TransactionLoadingOverlay from '@/components/TransactionLoadingOverlay';

export function TransactionExample() {
  const tx = useTransactionLoading();

  const simulateTx = async () => {
    tx.reset();
    tx.startLoading();

    // simulate progression
    tx.updateSigning();
    setTimeout(() => tx.updateSubmitted('0xdeadbeef'), 300);
    setTimeout(() => tx.updateMining(), 600);
    setTimeout(() => tx.updateConfirming(), 900);
    setTimeout(() => tx.markSuccess(), 1400);
  };

  return (
    <div>
      <h3 className="mb-4">Transaction Example</h3>
      <button onClick={simulateTx} className="px-4 py-2 bg-blue-600 text-white rounded">Simulate Tx</button>

      <div className="mt-4">
        <TransactionProgressBar state={tx.state} />
      </div>

      <div className="mt-4">
        <TransactionStatusCard state={tx.state} />
      </div>

      <TransactionLoadingOverlay state={tx.state} />
    </div>
  );
}

export default TransactionExample;
