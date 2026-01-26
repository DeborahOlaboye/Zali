# Contract Testing Best Practices

This document outlines best practices for writing and maintaining contract tests in the Zali project.

## Test Organization

### File Structure
```
contracts/test/
├── Faucet.t.sol          # Faucet contract tests
├── TriviaGame.t.sol      # SimpleTriviaGame contract tests
├── Integration.t.sol     # Cross-contract integration tests
└── TestUtils.sol         # Reusable test utilities and mocks
```

### Naming Conventions

**Test Functions:**
- Use the prefix `test_` for all test functions
- Use descriptive names: `test_ClaimTokens()`, `test_RevertWhen_AlreadyClaimed()`
- For error cases, use `test_RevertWhen_` prefix

**Test Contracts:**
- Suffix contracts with `Test`: `FaucetTest`, `TriviaGameTest`
- Integration tests: `IntegrationTest`

## Test Structure

### Arrange-Act-Assert Pattern

Every test should follow this pattern:

```solidity
function test_FeatureName() public {
    // ARRANGE: Set up initial state
    string[] memory options = new string[](4);
    options[0] = "A";
    options[1] = "B";
    options[2] = "C";
    options[3] = "D";
    
    // ACT: Perform the action being tested
    vm.prank(owner);
    triviaGame.addQuestion("Test", options, 0, 1e18, Category.Celo, Difficulty.Easy);
    
    // ASSERT: Verify results
    assertEq(triviaGame.questionId(), 1);
}
```

### setUp() Function

Each test contract should have a `setUp()` function that:
- Initializes all contracts
- Creates test addresses
- Funds test accounts
- Sets up approvals

```solidity
function setUp() public {
    vm.startPrank(owner);
    mockCUSD = new MockERC20();
    triviaGame = new SimpleTriviaGame(address(mockCUSD));
    mockCUSD.transfer(player1, 100 * 10**18);
    vm.stopPrank();
}
```

## Testing Best Practices

### 1. Test Both Happy Path and Error Cases

```solidity
function test_ClaimTokens() public {
    // Happy path: successful claim
    vm.prank(user1);
    faucet.claim();
    assertEq(mockCUSD.balanceOf(user1), 10 * 10**18);
}

function test_RevertWhen_AlreadyClaimed() public {
    // Error case: prevent double-claiming
    vm.startPrank(user1);
    faucet.claim();
    vm.expectRevert(Faucet.AlreadyClaimed.selector);
    faucet.claim();
    vm.stopPrank();
}
```

### 2. Use Prank for Account Impersonation

```solidity
// Single transaction as different address
vm.prank(player1);
triviaGame.addScore(points);

// Multiple transactions as different address
vm.startPrank(owner);
triviaGame.addQuestion(...);
triviaGame.deactivateQuestion(1);
vm.stopPrank();
```

### 3. Test State Changes

```solidity
function test_StateChange() public {
    uint256 initialBalance = token.balanceOf(user);
    
    // Perform action
    vm.prank(owner);
    faucet.claim();
    
    // Verify state changed
    uint256 finalBalance = token.balanceOf(user);
    assertEq(finalBalance, initialBalance + claimAmount);
}
```

### 4. Test Access Control

```solidity
function test_OnlyOwnerCanWithdraw() public {
    vm.prank(nonOwner);
    vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", nonOwner));
    faucet.withdrawTokens(amount);
}
```

### 5. Test Edge Cases

```solidity
function test_ClaimWithExactBalance() public {
    // Edge case: contract has exactly enough tokens
    vm.prank(user1);
    faucet.claim();
    assertEq(mockCUSD.balanceOf(address(faucet)), 0);
}

function test_MinimalRewardAmounts() public {
    // Edge case: very small reward (1 wei)
    vm.prank(owner);
    triviaGame.addQuestion("Q", options, 0, 1, Category.Celo, Difficulty.Easy);
    assertEq(triviaGame.questionId(), 1);
}
```

## Error Testing

### Using expectRevert

```solidity
// Test with error selector
vm.expectRevert(CustomError.selector);
someFunction();

// Test with encoded error signature
vm.expectRevert(abi.encodeWithSignature("RevertMessage()"));
someFunction();

// Test with custom error and parameters
vm.expectRevert(abi.encodeWithSignature("CustomError(uint256)", value));
someFunction();
```

### Common Error Patterns

```solidity
// Custom error
function test_RevertWhen_InvalidInput() public {
    vm.expectRevert(SimpleTriviaGame.InvalidOptions.selector);
    triviaGame.addQuestion(...);
}

// OpenZeppelin error
function test_RevertWhen_Unauthorized() public {
    vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user));
    someFunction();
}
```

## Mock Contracts

Use TestUtils.sol for common mock implementations:

```solidity
import "./TestUtils.sol";

contract MyTest is TestHelper {
    MockERC20Token public token;
    
    function setUp() public {
        token = new MockERC20Token("Test", "TST", 18);
        token.mint(user, 100e18);
    }
}
```

## Assertions

### Common Assertions

```solidity
// Equality
assertEq(value, expected);
assertNotEq(value, unexpected);

// Boolean
assertTrue(condition);
assertFalse(condition);

// Greater/Less Than
assertGt(value, threshold);
assertGte(value, threshold);
assertLt(value, threshold);
assertLte(value, threshold);

// Address
assertEq(address(contract), expected);
```

## Test Coverage Goals

Aim for the following coverage levels:

- **Statements:** >90%
- **Branches:** >85%
- **Functions:** >95%
- **Lines:** >90%

Run coverage analysis:
```bash
forge coverage
```

## Performance Considerations

### Gas Optimization Testing

Use forge's gas reporting features:

```bash
forge test --gas-report
```

### Slow Tests

- Minimize state changes between tests
- Avoid unnecessary loops in tests
- Use proper setUp() to reuse state

## Debugging Failed Tests

### Verbose Output

```bash
# Standard verbose
forge test -v

# Very verbose (shows logs)
forge test -vv

# Very very verbose (shows all details)
forge test -vvv
```

### Debugging Tools

```solidity
// Use console.log for debugging
import "forge-std/console.sol";

function test_Debug() public {
    console.log("User balance:", token.balanceOf(user));
    console.log("User address:", user);
}
```

## Continuous Integration

Tests run automatically on:
- Every push to main/develop branches
- Every pull request
- When contracts are modified

See `.github/workflows/contract-tests.yml` for CI configuration.

## Common Mistakes to Avoid

1. **Forgetting vm.stopPrank():** Always stop prank context
   ```solidity
   vm.startPrank(user);
   function();
   vm.stopPrank(); // Don't forget!
   ```

2. **Not resetting state between tests:** Use setUp() instead
   ```solidity
   // Bad: modifying state in test
   faucet = new Faucet(...); // Don't do this
   
   // Good: use setUp()
   function setUp() public {
       faucet = new Faucet(...);
   }
   ```

3. **Testing implementation instead of interface:** Test contract behavior, not internals
   ```solidity
   // Bad: testing internal function
   triviaGame.internalFunction();
   
   // Good: test public interface
   triviaGame.addQuestion(...);
   ```

4. **Ignoring error messages:** Always verify the correct error is thrown
   ```solidity
   // Bad: any revert is acceptable
   vm.expectRevert();
   function();
   
   // Good: specific error verification
   vm.expectRevert(CustomError.selector);
   function();
   ```

## Resources

- [Foundry Testing Guide](https://book.getfoundry.sh/forge/tests)
- [Solidity Testing Best Practices](https://docs.soliditylang.org/en/latest/)
- [OpenZeppelin Test Helpers](https://docs.openzeppelin.com/test-helpers/)
