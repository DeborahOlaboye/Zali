# Transaction Loading States

This document describes the transaction loading states and how to use the provided hooks and components.

## Overview

We added comprehensive transaction loading utilities to provide clear feedback during transaction lifecycles:

- `useTransactionLoading` hook — tracks a single transaction lifecycle (pending, signing, submitted, mining, confirming, success, failed)
- `useTransactionManager` — lightweight manager for multiple transactions
- `TransactionProgressBar` — visual progress bar for transaction progress
- `TransactionStatusCard` — detailed status card with hash, progress, confirmations and error
- `TransactionLoadingOverlay` — full-screen modal overlay for blocking UX during transactions

## Quick Usage

1. Use the `useTransactionLoading` hook inside your component to manage transaction progress:

```tsx
const tx = useTransactionLoading();

async function handleAction() {
  try {
    tx.reset();
    tx.startLoading();
    const txHash = await sendTransaction(...);
    tx.updateSubmitted(txHash);
    tx.updateMining();
    // when confirmed
    tx.markSuccess();
  } catch (err) {
    tx.markFailed(err instanceof Error ? err : new Error('Transaction failed'));
  }
}
```

2. Display a `TransactionProgressBar` or `TransactionStatusCard` to show progress:

```tsx
<TransactionProgressBar state={tx.state} />
<TransactionStatusCard state={tx.state} />
```

3. Optionally show a blocking overlay during critical transactions:

```tsx
<TransactionLoadingOverlay state={tx.state} onCancel={() => tx.reset()} />
```

## Integration with Wagmi

`useTokenTransfer` and other hooks were updated to call `startLoading()` when initiating transactions and to call `updateSubmitted()`/`markSuccess()`/`markFailed()` when corresponding Wagmi events fire. The hook also still updates the legacy `state` object for backward compatibility.

## Testing

Unit tests were added for:

- `transactionStateManager`
- `useTransactionLoading`
- `TransactionProgressBar`
- `TransactionStatusCard`

Run tests with:

```bash
pnpm --filter frontend test:ci
# or
cd frontend && npm test
```

## Notes

- `useTransactionLoading` uses an internal progress increment to show the user activity while waiting for the chain. It is safe to keep this enabled for UX reasons.
- The utilities are intentionally non-opinionated about UI — components are small and composable.

