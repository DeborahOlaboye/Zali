# Token Transfer Error Boundaries

This document describes the specialized error boundary system for Web3 token transfers and blockchain transactions.

## Overview

The token transfer error boundary system provides:

- **Specialized error boundaries** for Web3 operations
- **Context-aware error messages** for blockchain errors
- **Recovery strategies** for common Web3 issues
- **User-friendly error UI** with retry functionality
- **Integration with wallet providers** and transaction flows

## Components

### TokenTransferErrorBoundary

Specialized error boundary for token transfer operations with context-aware error handling.

```tsx
import { TokenTransferErrorBoundary } from '@/components/errorBoundaries';

<TokenTransferErrorBoundary
  tokenSymbol="USDC"
  amount="100.50"
  recipientAddress="0x1234...5678"
  onRetry={() => retryTransfer()}
  onError={(error, errorInfo) => logError(error)}
>
  <TransferButton />
</TokenTransferErrorBoundary>
```

**Props:**
- `tokenSymbol`: Token symbol for error messages (e.g., "USDC", "ETH")
- `amount`: Transfer amount to display in error UI
- `recipientAddress`: Recipient address for error context
- `onRetry`: Callback function for retry attempts
- `onError`: Error callback for logging/analytics

**Error Types Handled:**
- Insufficient funds/balance
- Insufficient allowance/approval
- User rejection
- Gas limit errors
- Nonce conflicts
- Network connection issues

### TransactionErrorBoundary

General-purpose error boundary for blockchain transactions with severity-based UI.

```tsx
import { TransactionErrorBoundary } from '@/components/errorBoundaries';

<TransactionErrorBoundary
  transactionType="Swap"
  onRetry={() => retryTransaction()}
  onError={(error, errorInfo) => trackError(error)}
>
  <SwapInterface />
</TransactionErrorBoundary>
```

**Props:**
- `transactionType`: Type of transaction for error messages
- `onRetry`: Callback function for retry attempts
- `onError`: Error callback for logging

**Error Categories:**
- **Error (Red)**: Insufficient funds, reverted transactions
- **Warning (Yellow)**: Gas issues, nonce errors, user rejection
- **Info (Blue)**: Network issues, connection problems

### WalletErrorBoundary

Specialized error boundary for wallet connection and provider issues.

```tsx
import { WalletErrorBoundary } from '@/components/errorBoundaries';

<WalletErrorBoundary
  onReconnect={() => connectWallet()}
  onError={(error, errorInfo) => logWalletError(error)}
>
  <WalletInterface />
</WalletErrorBoundary>
```

**Props:**
- `onReconnect`: Callback function for wallet reconnection
- `onError`: Error callback for logging

**Error Types Handled:**
- No wallet provider detected
- User rejection of connection
- Wrong network/unsupported chain
- Connection already pending
- Unauthorized access

## Hook: useTokenTransferErrorHandler

Custom hook for handling token transfer errors with recovery strategies.

```tsx
import { useTokenTransferErrorHandler } from '@/components/errorBoundaries';

function TokenTransferComponent() {
  const { 
    handleTokenTransferError, 
    categorizeError, 
    initializeRecoveryStrategies 
  } = useTokenTransferErrorHandler();

  useEffect(() => {
    initializeRecoveryStrategies();
  }, [initializeRecoveryStrategies]);

  const handleTransfer = async () => {
    try {
      await transferTokens();
    } catch (error) {
      const recovered = await handleTokenTransferError(error);
      if (!recovered) {
        const { category, severity, userMessage } = categorizeError(error);
        showErrorToUser(userMessage, severity);
      }
    }
  };
}
```

**Methods:**
- `handleTokenTransferError(error)`: Attempts automatic recovery
- `categorizeError(error)`: Categorizes error with user message
- `initializeRecoveryStrategies()`: Sets up recovery strategies

**Recovery Strategies:**
- **InsufficientAllowanceRecovery**: Handles approval flow
- **NetworkCongestionRecovery**: Retries with higher gas
- **NonceErrorRecovery**: Clears nonce cache and retries

## Usage Examples

### Token Faucet with Error Handling

```tsx
import { TokenTransferErrorBoundary } from '@/components/errorBoundaries';

function TokenFaucet() {
  const { claim, isLoading } = useFaucet();

  return (
    <TokenTransferErrorBoundary
      tokenSymbol="cUSD"
      amount="10.0"
      onRetry={() => claim()}
    >
      <button 
        onClick={claim} 
        disabled={isLoading}
        className="claim-button"
      >
        {isLoading ? 'Claiming...' : 'Claim 10 cUSD'}
      </button>
    </TokenTransferErrorBoundary>
  );
}
```

### DEX Swap with Transaction Error Handling

```tsx
import { TransactionErrorBoundary } from '@/components/errorBoundaries';

function SwapInterface() {
  const { swap, isSwapping } = useSwap();

  return (
    <TransactionErrorBoundary
      transactionType="Swap"
      onRetry={() => swap()}
    >
      <div className="swap-container">
        <TokenInput />
        <SwapButton onClick={swap} disabled={isSwapping} />
      </div>
    </TransactionErrorBoundary>
  );
}
```

### Wallet Connection with Error Handling

```tsx
import { WalletErrorBoundary } from '@/components/errorBoundaries';

function WalletConnector() {
  const { connect, isConnecting } = useWallet();

  return (
    <WalletErrorBoundary onReconnect={() => connect()}>
      <button 
        onClick={connect} 
        disabled={isConnecting}
        className="connect-button"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </WalletErrorBoundary>
  );
}
```

### Nested Error Boundaries for Complex Operations

```tsx
import { 
  WalletErrorBoundary, 
  TransactionErrorBoundary, 
  TokenTransferErrorBoundary 
} from '@/components/errorBoundaries';

function ComplexDeFiInterface() {
  return (
    <WalletErrorBoundary onReconnect={() => reconnectWallet()}>
      <div className="defi-interface">
        <WalletStatus />
        
        <TransactionErrorBoundary 
          transactionType="Approval"
          onRetry={() => approveToken()}
        >
          <ApprovalSection />
        </TransactionErrorBoundary>
        
        <TokenTransferErrorBoundary
          tokenSymbol="USDC"
          onRetry={() => retryTransfer()}
        >
          <TransferSection />
        </TokenTransferErrorBoundary>
      </div>
    </WalletErrorBoundary>
  );
}
```

## Error Message Customization

### Token-Specific Messages

The `TokenTransferErrorBoundary` customizes error messages based on the token symbol:

```tsx
// For USDC transfers
<TokenTransferErrorBoundary tokenSymbol="USDC">
  // Error: "Insufficient USDC balance for this transfer."
</TokenTransferErrorBoundary>

// For ETH transfers  
<TokenTransferErrorBoundary tokenSymbol="ETH">
  // Error: "Insufficient ETH balance for this transfer."
</TokenTransferErrorBoundary>
```

### Transaction-Specific Messages

The `TransactionErrorBoundary` customizes messages based on transaction type:

```tsx
// For staking transactions
<TransactionErrorBoundary transactionType="Staking">
  // Error: "Staking could not be completed. Please try again."
  // Button: "Retry Staking"
</TransactionErrorBoundary>

// For lending transactions
<TransactionErrorBoundary transactionType="Lending">
  // Error: "Lending could not be completed. Please try again."
  // Button: "Retry Lending"
</TransactionErrorBoundary>
```

## Error Recovery Strategies

### Automatic Recovery

The system includes automatic recovery for common issues:

```tsx
// Network congestion - retry with higher gas
if (error.message.includes('gas')) {
  await retryWithHigherGas();
}

// Nonce error - clear cache and retry
if (error.message.includes('nonce')) {
  await clearNonceCache();
  await retryTransaction();
}

// Allowance error - trigger approval flow
if (error.message.includes('allowance')) {
  await triggerApprovalFlow();
}
```

### Custom Recovery Strategies

Add custom recovery strategies for specific use cases:

```tsx
const { addRecoveryStrategy } = useErrorRecovery();

addRecoveryStrategy({
  name: 'CustomTokenRecovery',
  canRecover: (error) => error.message.includes('custom-token-error'),
  recover: async (error) => {
    // Custom recovery logic
    await handleCustomTokenError(error);
    return true;
  },
  maxAttempts: 2,
  delay: 1000,
});
```

## Integration with Existing Systems

### With React Query

```tsx
import { QueryErrorBoundary, TokenTransferErrorBoundary } from '@/components/errorBoundaries';

function TokenDataWithTransfer() {
  return (
    <QueryErrorBoundary>
      <TokenTransferErrorBoundary tokenSymbol="DAI">
        <TokenBalance />
        <TransferForm />
      </TokenTransferErrorBoundary>
    </QueryErrorBoundary>
  );
}
```

### With Form Error Boundaries

```tsx
import { FormErrorBoundary, TransactionErrorBoundary } from '@/components/errorBoundaries';

function TransferForm() {
  return (
    <FormErrorBoundary formName="Transfer">
      <TransactionErrorBoundary transactionType="Transfer">
        <form onSubmit={handleTransfer}>
          <AmountInput />
          <RecipientInput />
          <SubmitButton />
        </form>
      </TransactionErrorBoundary>
    </FormErrorBoundary>
  );
}
```

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenTransferErrorBoundary } from '@/components/errorBoundaries';

const ThrowInsufficientFundsError = () => {
  throw new Error('Insufficient funds');
};

test('should display insufficient funds error', () => {
  render(
    <TokenTransferErrorBoundary tokenSymbol="USDC">
      <ThrowInsufficientFundsError />
    </TokenTransferErrorBoundary>
  );

  expect(screen.getByText('Transfer Failed')).toBeInTheDocument();
  expect(screen.getByText(/Insufficient USDC balance/)).toBeInTheDocument();
});
```

### Integration Tests

```tsx
test('should retry transfer on button click', async () => {
  const onRetry = jest.fn();

  render(
    <TokenTransferErrorBoundary onRetry={onRetry}>
      <ThrowNetworkError />
    </TokenTransferErrorBoundary>
  );

  const retryButton = screen.getByText('Retry Transfer');
  fireEvent.click(retryButton);

  expect(onRetry).toHaveBeenCalled();
});
```

## Best Practices

### 1. Use Appropriate Error Boundaries

- **TokenTransferErrorBoundary**: For token transfers and approvals
- **TransactionErrorBoundary**: For general blockchain transactions
- **WalletErrorBoundary**: For wallet connection issues

### 2. Provide Context Information

```tsx
// Good - Provides context for better error messages
<TokenTransferErrorBoundary
  tokenSymbol="USDC"
  amount="100.50"
  recipientAddress="0x1234...5678"
>
  <TransferButton />
</TokenTransferErrorBoundary>

// Bad - Generic error messages
<TokenTransferErrorBoundary>
  <TransferButton />
</TokenTransferErrorBoundary>
```

### 3. Implement Retry Logic

```tsx
// Good - Provides retry functionality
<TokenTransferErrorBoundary
  onRetry={() => {
    resetForm();
    retryTransfer();
  }}
>
  <TransferForm />
</TokenTransferErrorBoundary>
```

### 4. Handle User Rejections Gracefully

```tsx
// User rejections should not show retry button for transfers
// but should allow "Try Again" for wallet connections
```

### 5. Log Errors for Monitoring

```tsx
<TokenTransferErrorBoundary
  onError={(error, errorInfo) => {
    // Log to monitoring service
    analytics.track('token_transfer_error', {
      error: error.message,
      tokenSymbol,
      amount,
      component: errorInfo.componentStack,
    });
  }}
>
  <TransferInterface />
</TokenTransferErrorBoundary>
```

## Performance Considerations

### 1. Minimize Error Boundary Nesting

```tsx
// Good - Strategic placement
<WalletErrorBoundary>
  <TokenTransferErrorBoundary>
    <TransferInterface />
  </TokenTransferErrorBoundary>
</WalletErrorBoundary>

// Avoid - Excessive nesting
<ErrorBoundary>
  <TransactionErrorBoundary>
    <TokenTransferErrorBoundary>
      <WalletErrorBoundary>
        <Component />
      </WalletErrorBoundary>
    </TokenTransferErrorBoundary>
  </TransactionErrorBoundary>
</ErrorBoundary>
```

### 2. Debounce Error Recovery

```tsx
const debouncedRecovery = debounce(async (error) => {
  await attemptRecovery(error);
}, 1000);
```

### 3. Cache Recovery Strategies

```tsx
// Initialize recovery strategies once
useEffect(() => {
  initializeRecoveryStrategies();
}, []);
```

## Troubleshooting

### Common Issues

1. **Error boundaries not catching Web3 errors**
   - Ensure errors are thrown during render or in useEffect
   - Use try-catch for async operations in event handlers

2. **Recovery strategies not working**
   - Check if error messages match recovery conditions
   - Verify recovery strategy registration

3. **Wallet errors not handled properly**
   - Ensure WalletErrorBoundary wraps wallet connection UI
   - Check for proper error propagation

### Debug Mode

Enable detailed logging for Web3 errors:

```tsx
<TokenTransferErrorBoundary
  onError={(error, errorInfo) => {
    if (process.env.NODE_ENV === 'development') {
      console.group('Token Transfer Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  }}
>
  <TransferComponent />
</TokenTransferErrorBoundary>
```