# Error Handling for Token Transfers

## Overview

This document describes the improved error handling system for token transfers and approvals in the application. The system provides user-friendly, actionable error messages that help users understand what went wrong and how to fix it.

## Error Types

### Token Transfer Errors

The system recognizes and handles the following token transfer errors:

#### `INSUFFICIENT_TOKEN_BALANCE`
- **Message**: "Insufficient token balance. Please ensure you have enough cUSD in your wallet."
- **Cause**: User doesn't have enough tokens to complete the transfer
- **Solution**: User needs to add more cUSD tokens to their wallet

#### `INSUFFICIENT_ALLOWANCE`
- **Message**: "Token approval required. Please approve the transaction to allow the contract to spend your tokens."
- **Cause**: Contract doesn't have permission to spend user's tokens
- **Solution**: User needs to approve the contract (handled automatically in the flow)

#### `TOKEN_TRANSFER_FAILED`
- **Message**: "Token transfer failed. Please check your balance and try again."
- **Cause**: Generic transfer failure (could be network, gas, or contract issue)
- **Solution**: Check balance, network connection, and try again

#### `ZERO_AMOUNT_TRANSFER`
- **Message**: "Transfer amount must be greater than zero."
- **Cause**: Attempted to transfer zero tokens
- **Solution**: Ensure transfer amount is greater than zero

#### `TRANSFER_TO_ZERO_ADDRESS`
- **Message**: "Cannot transfer tokens to an invalid address."
- **Cause**: Attempted to transfer to zero address
- **Solution**: Use a valid recipient address

### Token Approval Errors

#### `TOKEN_APPROVAL_REJECTED`
- **Message**: "Token approval was cancelled. Please approve the transaction to continue."
- **Cause**: User rejected the approval transaction
- **Solution**: User needs to approve the transaction when prompted

#### `TOKEN_APPROVAL_FAILED`
- **Message**: "Token approval failed. Please try again or check your wallet connection."
- **Cause**: Approval transaction failed (network, gas, or other issue)
- **Solution**: Check wallet connection and try again

## Error Detection

The system uses several helper functions to detect specific error types:

### `isTokenTransferError(error)`
Detects if an error is related to token transfers by checking:
- Error message contains "transfer", "erc20", or "token"
- Error reason contains transfer-related keywords
- Error code indicates transfer failure

### `isInsufficientAllowanceError(error)`
Detects insufficient allowance errors by checking:
- Error message contains "allowance"
- Error message contains "insufficient allowance" or "allowance too low"
- Error code is `INSUFFICIENT_ALLOWANCE`

### `isTokenApprovalError(error)`
Detects token approval errors by checking:
- Error message contains "approve" or "approval"
- Error reason contains approval-related keywords
- Error code indicates approval failure

## Error Parsing

The `parseContractError` function automatically:
1. Detects the error type
2. Extracts relevant information
3. Returns a user-friendly message
4. Provides an error code for programmatic handling

### Example Usage

```typescript
import { parseContractError } from '@/utils/contractErrors';

try {
  await transferTokens(amount);
} catch (error) {
  const { message, code } = parseContractError(error);
  // message: "Insufficient token balance. Please ensure you have enough cUSD in your wallet."
  // code: ContractErrorType.INSUFFICIENT_TOKEN_BALANCE
  toast.error(message);
}
```

## Integration Points

### useTokenApproval Hook

The hook automatically parses and enhances errors:

```typescript
const { approve, error } = useTokenApproval();

try {
  await approve();
} catch (error) {
  // Error is already parsed with user-friendly message
  console.error(error.message); // "Token approval was cancelled..."
}
```

### Play Page

The play page provides specific error messages based on error type:

```typescript
if (error?.code === 'INSUFFICIENT_ALLOWANCE') {
  toast.error('Token approval required. Please approve the transaction...');
} else if (error?.code === 'INSUFFICIENT_TOKEN_BALANCE') {
  toast.error('Insufficient cUSD balance. Please add more tokens...');
}
```

### Rewards Page

The rewards page handles transfer errors for reward claims:

```typescript
if (error?.code === 'TOKEN_TRANSFER_FAILED') {
  toast.error('Token transfer failed. The contract may not have enough funds...');
}
```

## Best Practices

1. **Always use parseContractError**: Don't display raw error messages to users
2. **Provide actionable messages**: Tell users what they can do to fix the issue
3. **Handle specific error codes**: Use error codes for conditional logic
4. **Log original errors**: Keep original errors for debugging while showing friendly messages
5. **Test error scenarios**: Ensure all error paths are tested

## Testing

Error handling is tested in `src/utils/__tests__/contractErrors.test.ts`:

- Token transfer error detection
- Insufficient allowance detection
- Token approval error detection
- Error message parsing
- User-friendly message generation

## Error Message Guidelines

1. **Be specific**: Tell users exactly what went wrong
2. **Be actionable**: Provide guidance on how to fix the issue
3. **Be friendly**: Use conversational, non-technical language
4. **Be concise**: Keep messages short and to the point
5. **Include context**: Mention relevant details (e.g., "cUSD" instead of just "tokens")

## Future Improvements

- [ ] Add error recovery suggestions
- [ ] Implement retry mechanisms for transient errors
- [ ] Add error analytics to track common issues
- [ ] Create error code reference documentation
- [ ] Add i18n support for error messages

