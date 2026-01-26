# Contract Testing Guide

This document describes how to run and maintain the contract test suite.

## Overview

The test suite includes tests for:
- **Faucet Contract** (`src/Faucet.sol`) - Token distribution tests
- **SimpleTriviaGame Contract** (`src/SimpleTriviaGame.sol`) - Trivia game logic tests

## Prerequisites

Ensure you have [Foundry](https://book.getfoundry.sh/) installed. If not, install it:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Running Tests

### Run All Tests

```bash
cd contracts
forge test
```

### Run Tests with Verbose Output

```bash
forge test -v
```

### Run Tests with Very Verbose Output (shows console.log statements)

```bash
forge test -vv
```

### Run Specific Test File

```bash
# Test Faucet contract
forge test --match-path "*/test/Faucet.t.sol"

# Test SimpleTriviaGame contract
forge test --match-path "*/test/TriviaGame.t.sol"
```

### Run Specific Test Function

```bash
forge test --match-contract FaucetTest --match-function test_ClaimTokens -v
```

## Test Structure

### Test Files Location

- `contracts/test/` - Active test directory
  - `Faucet.t.sol` - Faucet contract tests
  - `TriviaGame.t.sol` - SimpleTriviaGame contract tests

### Test Coverage

#### Faucet Tests
- Initial state verification
- Token claiming functionality
- Claim restrictions (one-time per address)
- Owner-only withdrawal functionality
- Contract balance tracking
- Error handling for invalid tokens
- Error handling for insufficient balances

#### SimpleTriviaGame Tests
- Question creation and management
- Input validation (options, correct answer index)
- Question activation/deactivation
- User score tracking
- Owner permissions and access control

## Continuous Integration

Tests should be run on every pull request to ensure contract integrity. The test suite validates:

1. **Functionality**: All contract features work as expected
2. **Error Handling**: Proper error messages and reverts
3. **State Management**: Correct state transitions and updates
4. **Access Control**: Owner and permission-based restrictions

## Adding New Tests

When adding new tests:

1. Create test functions following the naming convention: `test_FeatureDescription()`
2. Use descriptive assertion messages
3. Test both happy path and error cases
4. Use `vm.prank()` and `vm.startPrank()`/`vm.stopPrank()` for impersonation
5. Follow Foundry best practices

## Test Maintenance

- Keep tests synchronized with contract changes
- Remove or update tests when contract interfaces change
- Add tests for new features immediately
- Review test coverage regularly

## Troubleshooting

### Import Errors
Ensure remappings in `foundry.toml` are correct:
```toml
remappings = [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/"
]
```

### Contract Compilation Issues
Run `forge build` to identify compilation errors before running tests.

### Test Failures
Use verbose flags to see detailed output:
```bash
forge test -vvv
```

## Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Foundry Testing Guide](https://book.getfoundry.sh/forge/tests)
- [Solidity Testing Best Practices](https://docs.soliditylang.org/en/latest/security-considerations.html)
