# Token Approval Flow Documentation

## Overview

The token approval system ensures that users have granted the game contract permission to spend their cUSD tokens before starting a game. This document describes the implementation, usage, and testing of the token approval functionality.

## Architecture

### Components

1. **`useTokenApproval` Hook** (`src/hooks/useTokenApproval.ts`)
   - Manages token approval state and operations
   - Checks current allowance
   - Handles approval transactions
   - Provides loading states for all operations

2. **`useGameSession` Hook** (`src/hooks/useContract.ts`)
   - Integrates token approval checks
   - Ensures approval before starting games
   - Exposes approval states to components

3. **Play Page** (`src/app/play/page.tsx`)
   - Displays approval loading states
   - Handles approval flow in UI
   - Shows appropriate messages to users

## Flow Diagram

```
User clicks "Start Game"
    ↓
Check if approval is needed
    ↓
┌─────────────────┐
│ Needs Approval? │
└─────────────────┘
    │
    ├─ No → Start game directly
    │
    └─ Yes → Request approval
            ↓
        Show "Approving Tokens..." loading state
            ↓
        User confirms in wallet
            ↓
        Wait for transaction confirmation
            ↓
        Show "Approval successful" message
            ↓
        Start game
```

## Usage

### Basic Usage

```typescript
import { useTokenApproval } from '@/hooks/useTokenApproval';

function MyComponent() {
  const {
    needsApproval,
    hasSufficientApproval,
    isLoading,
    isApproving,
    isWaitingForApproval,
    approve,
    allowance,
  } = useTokenApproval();

  const handleApprove = async () => {
    if (needsApproval) {
      try {
        await approve();
        // Approval transaction sent
      } catch (error) {
        console.error('Approval failed:', error);
      }
    }
  };

  return (
    <div>
      {needsApproval && (
        <button onClick={handleApprove} disabled={isLoading}>
          {isApproving ? 'Approving...' : 'Approve Tokens'}
        </button>
      )}
    </div>
  );
}
```

### Integrated with Game Session

```typescript
import { useGameSession } from '@/hooks/useContract';

function PlayPage() {
  const {
    startGame,
    needsApproval,
    isApprovalLoading,
    isApproving,
    approve,
  } = useGameSession();

  const handleStartGame = async () => {
    if (needsApproval) {
      // First approve
      await approve();
      // Wait for approval, then start game
    } else {
      // Start game directly
      await startGame();
    }
  };
}
```

## API Reference

### `useTokenApproval` Hook

#### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `allowance` | `bigint` | Current token allowance |
| `needsApproval` | `boolean` | Whether approval is needed |
| `hasSufficientApproval` | `boolean` | Whether current allowance is sufficient |
| `isLoading` | `boolean` | Combined loading state (allowance check, approval, or waiting) |
| `isApproving` | `boolean` | Whether approval transaction is pending |
| `isWaitingForApproval` | `boolean` | Whether waiting for approval confirmation |
| `isLoadingAllowance` | `boolean` | Whether checking allowance |
| `isSuccess` | `boolean` | Whether approval was successful |
| `error` | `Error \| null` | Error if approval failed |
| `approveIsError` | `boolean` | Whether approval has error |
| `approve` | `function` | Function to approve tokens |
| `ensureApproval` | `function` | Check and approve if needed, then execute callback |
| `refetchAllowance` | `function` | Refetch current allowance |
| `resetApproval` | `function` | Reset approval state |
| `requiredAmount` | `bigint` | Required approval amount (entry fee) |
| `formattedAllowance` | `string` | Formatted allowance for display |
| `formattedRequiredAmount` | `string` | Formatted required amount for display |

#### Methods

##### `approve(amount?: bigint)`

Approves tokens for the game contract.

**Parameters:**
- `amount` (optional): Amount to approve. Defaults to `maxUint256` for unlimited approval.

**Returns:** Promise that resolves when approval transaction is sent.

**Throws:** Error if wallet is not connected.

##### `ensureApproval(callback?: () => void | Promise<void>)`

Checks if approval is needed, approves if necessary, then executes the callback.

**Parameters:**
- `callback` (optional): Function to execute after approval (if needed).

**Returns:** Promise that resolves when approval is complete and callback is executed.

## Loading States

The hook provides granular loading states for better UX:

1. **`isLoadingAllowance`**: Checking current allowance from blockchain
2. **`isApproving`**: Approval transaction is pending user confirmation
3. **`isWaitingForApproval`**: Waiting for approval transaction to be confirmed on blockchain
4. **`isLoading`**: Any of the above states is active

## Error Handling

The hook handles various error scenarios:

- **Wallet not connected**: Throws error when trying to approve without wallet
- **User rejection**: Detects when user rejects transaction in wallet
- **Transaction failure**: Handles failed transactions gracefully
- **Network errors**: Catches and reports network-related errors

## UI Integration

### Loading State Display

```typescript
{isApprovalLoading && (
  <div>
    {isApproving && <p>Approving tokens... Please confirm in your wallet</p>}
    {isWaitingForApproval && <p>Waiting for approval confirmation...</p>}
    {isLoadingAllowance && <p>Checking approval status...</p>}
  </div>
)}
```

### Button States

```typescript
<button
  onClick={handleStartGame}
  disabled={isApprovalLoading || startGameIsLoading}
>
  {isApproving
    ? 'Approving Tokens...'
    : isWaitingForApproval
    ? 'Waiting for Approval...'
    : needsApproval
    ? 'Approve & Start Game'
    : 'Start Game'}
</button>
```

## Testing

### Unit Tests

Tests are located in `src/hooks/__tests__/useTokenApproval.test.ts`.

To run tests:

```bash
npm install --save-dev @testing-library/react @testing-library/react-hooks @testing-library/jest-dom jest jest-environment-jsdom @types/jest
npm test
```

### Test Coverage

The test suite covers:
- Initialization with correct default values
- Detection of approval needs
- Loading states (allowance check, approving, waiting)
- Approval function calls with correct parameters
- Error handling
- Success states

## Best Practices

1. **Always check approval before starting game**: Use `needsApproval` to determine if approval is required.

2. **Show clear loading states**: Use the granular loading states to provide specific feedback to users.

3. **Handle errors gracefully**: Display user-friendly error messages, especially for user rejections.

4. **Refetch allowance after approval**: Call `refetchAllowance()` after approval to get the latest state.

5. **Use `ensureApproval` for automatic flow**: When you want to automatically approve and then execute an action.

## Troubleshooting

### Approval not detected

- Ensure `refetchAllowance()` is called after approval
- Check that the correct contract addresses are configured
- Verify the user's wallet is connected

### Loading state stuck

- Check network connection
- Verify transaction was actually sent
- Try resetting with `resetApproval()`

### MiniPay integration issues

- Ensure `encodeFunctionData` is imported from `viem`
- Verify ABI includes the `approve` function
- Check that contract addresses are correct

## Security Considerations

1. **Unlimited approval**: The default approval uses `maxUint256` for convenience. For production, consider using specific amounts.

2. **Allowance checks**: Always verify allowance before allowing actions that require tokens.

3. **User consent**: Ensure users understand what they're approving and why.

4. **Error messages**: Don't expose sensitive information in error messages.

## Future Improvements

- [ ] Add support for revoking approvals
- [ ] Implement approval amount selection UI
- [ ] Add approval history tracking
- [ ] Support for batch approvals
- [ ] Gas optimization for approval transactions

