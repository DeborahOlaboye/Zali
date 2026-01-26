# Contract Testing Contribution Guide

Contributing tests to the Zali project helps ensure contract reliability and maintainability.

## Getting Started

1. **Set up your environment:**
   ```bash
   cd /path/to/zali
   cd contracts
   forge build
   ```

2. **Run existing tests to ensure setup is correct:**
   ```bash
   forge test
   ```

3. **Familiarize yourself with:**
   - Test structure: `contracts/test/`
   - Best practices: `contracts/TEST_BEST_PRACTICES.md`
   - Troubleshooting: `contracts/TROUBLESHOOTING.md`

## Adding New Tests

### Step 1: Identify What Needs Testing

Before writing tests, consider:
- What is the feature/function you're testing?
- What are the happy path scenarios?
- What error cases should be prevented?
- What edge cases exist?

### Step 2: Choose the Right Test File

- **Unit Tests:** Add to existing `*.t.sol` files for the contract
  - New Faucet tests → `test/Faucet.t.sol`
  - New TriviaGame tests → `test/TriviaGame.t.sol`

- **Integration Tests:** Add to `test/Integration.t.sol` for cross-contract scenarios

- **New Contract:** Create a new `ContractName.t.sol` file

### Step 3: Write Your Tests

Follow this template:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ContractName.sol";
import "./TestUtils.sol";

contract ContractNameTest is Test {
    ContractName public contract_;
    address public owner;
    address public user1;
    
    function setUp() public {
        owner = address(0x1);
        user1 = address(0x2);
        
        vm.startPrank(owner);
        contract_ = new ContractName(/* args */);
        vm.stopPrank();
    }
    
    function test_HappyPath() public {
        // Arrange
        // Act
        // Assert
    }
    
    function test_RevertWhen_ErrorCondition() public {
        vm.expectRevert(ContractName.CustomError.selector);
        // perform action that should revert
    }
}
```

### Step 4: Testing Checklist

Before submitting:

- [ ] Tests compile without errors: `forge build`
- [ ] All tests pass: `forge test`
- [ ] Tests have meaningful names starting with `test_`
- [ ] Both happy path and error cases are tested
- [ ] Edge cases are considered
- [ ] Code follows existing style and conventions
- [ ] Tests use proper `setUp()` for initialization
- [ ] No hardcoded magic numbers (use constants instead)
- [ ] Comments explain non-obvious test logic
- [ ] Gas usage is reasonable: `forge test --gas-report`

## Test Writing Patterns

### Pattern 1: Testing State Changes

```solidity
function test_StateChangesCorrectly() public {
    // Capture initial state
    uint256 initialBalance = token.balanceOf(user);
    
    // Perform action
    vm.prank(user);
    contract_.performAction();
    
    // Verify state changed correctly
    uint256 finalBalance = token.balanceOf(user);
    assertEq(finalBalance, initialBalance + expectedChange);
}
```

### Pattern 2: Testing Error Handling

```solidity
function test_RevertWhen_InvalidInput() public {
    string[] memory options = new string[](1); // Too few options
    
    vm.expectRevert(SimpleTriviaGame.InvalidOptions.selector);
    vm.prank(owner);
    triviaGame.addQuestion(
        "Question",
        options,
        0,
        1e18,
        SimpleTriviaGame.Category.Celo,
        SimpleTriviaGame.Difficulty.Easy
    );
}
```

### Pattern 3: Testing Access Control

```solidity
function test_OnlyOwnerCanPerformAction() public {
    vm.prank(nonOwner);
    vm.expectRevert(
        abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", nonOwner)
    );
    contract_.onlyOwnerFunction();
}
```

### Pattern 4: Testing Multiple Scenarios

```solidity
function test_MultiplePlayers() public {
    // Player 1 action
    vm.startPrank(player1);
    contract_.stake(amount1);
    vm.stopPrank();
    
    // Player 2 action
    vm.startPrank(player2);
    contract_.stake(amount2);
    vm.stopPrank();
    
    // Verify both players' states
    assertEq(contract_.getStake(player1), amount1);
    assertEq(contract_.getStake(player2), amount2);
}
```

## Common Test Additions

### Testing New Functions

When a new function is added to a contract:

1. Create a `test_FunctionName()` for the happy path
2. Create `test_RevertWhen_*()` tests for each error condition
3. Create `test_FunctionName_*()` tests for edge cases

### Testing Modified Functions

When a function is modified:

1. Update existing tests if behavior changed
2. Add new tests for new functionality
3. Remove tests for removed functionality
4. Run full test suite: `forge test -v`

### Testing New Error Conditions

When error handling is added:

```solidity
error NewError(uint256 value);

// In test:
function test_RevertWhen_NewErrorCondition() public {
    vm.expectRevert(abi.encodeWithSignature("NewError(uint256)", expectedValue));
    // perform action
}
```

## Code Style

### Naming Conventions

```solidity
// Test functions
function test_FeatureName() public { }
function test_RevertWhen_ErrorCase() public { }

// Mock contracts
contract MockERC20 { }
contract FakePriceFeed { }

// Addresses
address owner = address(0x1);
address user1 = address(0x2);
address user2 = address(0x3);
```

### Constants and Variables

```solidity
// Use descriptive names
uint256 internal constant CLAIM_AMOUNT = 10 * 10**18;
uint256 internal constant INITIAL_BALANCE = 100 * 10**18;

// In tests
uint256 expectedReward = 1 * 10**18;
uint256 initialBalance = contract_.balanceOf(user);
```

## Commit Message Guidelines

When committing new tests, use clear messages:

```
Add tests for [feature/function name]
Add edge case tests for [scenario]
Fix [contract name] test [issue description]
Expand [test file] with additional scenarios
```

Example:
```
Add comprehensive tests for question deactivation
Fix Faucet claim revert test assertions
Expand Integration tests with multi-player scenarios
```

## Pull Request Checklist

Before opening a PR with tests:

- [ ] All tests pass locally: `forge test`
- [ ] No compilation warnings: `forge build`
- [ ] Coverage is adequate: `forge coverage`
- [ ] Tests follow project conventions
- [ ] Commit messages are clear
- [ ] Documentation is updated if needed
- [ ] Tests are focused and don't have unrelated changes

## Debugging Your Tests

If tests fail:

1. **Run with verbose output:**
   ```bash
   forge test --match-function test_FailingTest -vvv
   ```

2. **Add console output:**
   ```solidity
   import "forge-std/console.sol";
   console.log("Value:", value);
   ```

3. **Isolate the issue:**
   ```bash
   forge test --match-path "*/test/YourTest.t.sol" -v
   ```

4. **Check gas usage:**
   ```bash
   forge test --gas-report
   ```

## Getting Help

- **Review existing tests:** Look at `Faucet.t.sol`, `TriviaGame.t.sol`
- **Read best practices:** See `TEST_BEST_PRACTICES.md`
- **Check troubleshooting:** See `TROUBLESHOOTING.md`
- **Foundry documentation:** https://book.getfoundry.sh/
- **Ask in project discussions** or open an issue

## Tips for Effective Tests

1. **One assertion per test is ideal:** If testing multiple things, split into multiple tests
2. **Use meaningful names:** `test_ClaimFailsWhenBalanceInsufficient()` > `test_Claim2()`
3. **Test the interface, not implementation:** Don't test internal functions
4. **Mock external dependencies:** Use mock contracts for ERC20, oracles, etc.
5. **Consider gas efficiency:** Very expensive operations might fail in tests
6. **Document complex logic:** Add comments explaining non-obvious test setups
7. **Use consistent patterns:** Follow the style of existing tests

## Examples

### Example 1: Simple Function Test

```solidity
function test_TransferTokens() public {
    uint256 amount = 10 * 10**18;
    uint256 initialBalance = token.balanceOf(user);
    
    vm.prank(owner);
    token.transfer(user, amount);
    
    assertEq(token.balanceOf(user), initialBalance + amount);
}
```

### Example 2: Error Case Test

```solidity
function test_RevertWhen_TransferExceedsBalance() public {
    uint256 amount = token.balanceOf(user) + 1;
    
    vm.prank(user);
    vm.expectRevert();
    token.transfer(owner, amount);
}
```

### Example 3: Complex Scenario Test

```solidity
function test_MultipleClaimsAndWithdrawals() public {
    // Multiple users claim
    vm.prank(user1);
    faucet.claim();
    
    vm.prank(user2);
    faucet.claim();
    
    // Owner withdraws remaining
    vm.prank(owner);
    uint256 remaining = token.balanceOf(address(faucet));
    faucet.withdrawTokens(remaining);
    
    // Verify final states
    assertEq(token.balanceOf(user1), 10 * 10**18);
    assertEq(token.balanceOf(user2), 10 * 10**18);
    assertEq(token.balanceOf(address(faucet)), 0);
}
```

## Thank You!

Thank you for contributing tests to Zali! Good tests make better contracts.
