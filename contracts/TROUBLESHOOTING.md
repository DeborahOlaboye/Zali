# Contract Testing Troubleshooting Guide

## Common Issues and Solutions

### 1. "Foundry not found" Error

**Problem:** When running `forge test`, you get command not found.

**Solution:**
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash

# Add to PATH (if not automatic)
export PATH="$PATH:$HOME/.foundry/bin"

# Verify installation
forge --version
```

---

### 2. Import Errors

**Problem:** `Error: Import not found: @openzeppelin/contracts/...`

**Solution:** Check `foundry.toml` has correct remappings:

```toml
[profile.default]
remappings = [
    "@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
    "@chainlink/contracts/=lib/chainlink-brownie-contracts/contracts/"
]
```

Then rebuild submodules:
```bash
git submodule update --init --recursive
```

---

### 3. Compilation Failures

**Problem:** `Error: Failed to compile contracts`

**Solution:**
```bash
# Clear build cache
rm -rf contracts/out contracts/cache

# Run build to see detailed errors
cd contracts
forge build -vvv

# Check Solidity version compatibility
# Ensure pragmas match (^0.8.20)
```

---

### 4. Tests Not Found

**Problem:** Running `forge test` shows "no tests found"

**Solution:**
```bash
# Verify test files exist
ls contracts/test/*.t.sol

# Verify test function names start with test_
grep "function test_" contracts/test/*.t.sol

# Check foundry.toml has test configuration
cat foundry.toml | grep -A2 "\[profile.default\]"
```

---

### 5. Test Execution Hangs

**Problem:** A test seems to hang indefinitely.

**Solution:**
- Check for infinite loops in contract code
- Verify no blocking external calls
- Use timeout: `forge test --timeout 1000`
- Add debug logs with `console.log()`:

```solidity
import "forge-std/console.sol";

function test_Debug() public {
    console.log("Checkpoint 1");
    doSomething();
    console.log("Checkpoint 2");
}
```

---

### 6. Memory/Stack Overflow

**Problem:** "Stack overflow" or "out of memory" errors.

**Solution:**
- Simplify test scenarios
- Reduce array sizes in tests
- Check for circular dependencies
- Use smaller uint values if possible

---

### 7. Assertion Failures

**Problem:** `AssertionError: a == b not satisfied [a] [b]`

**Solution:**
```bash
# Run with verbose output to see values
forge test -vv

# Run specific failing test
forge test --match-function test_FailingTest -vvv

# Add console.log before assertions
console.log("Expected:", expected);
console.log("Actual:", actual);
assertEq(actual, expected);
```

---

### 8. Prank/Cheat Code Issues

**Problem:** Prank doesn't seem to work correctly.

**Solution:**
```solidity
// Wrong: forgetting stopPrank
vm.startPrank(user);
function1();
function2(); // Also executed as user!

// Correct: explicit stopPrank
vm.startPrank(user);
function1();
vm.stopPrank();
function2(); // Executed as original caller

// Better: use single transaction prank
vm.prank(user);
function1();
function2(); // Executed as original caller
```

---

### 9. Gas Limit Exceeded

**Problem:** "gas limit exceeded" in tests.

**Solution:**
```bash
# Check current gas limit
forge test --gas-report

# Run with higher gas limit
forge test --gas 10000000

# Optimize contract to use less gas
# Check for storage writes in loops
# Use events instead of storage when possible
```

---

### 10. Revert Message Not Matching

**Problem:** `expectRevert` fails because the error doesn't match.

**Solution:**
```solidity
// Check exact error signature
vm.expectRevert(Faucet.InvalidTokenAddress.selector);
new Faucet(address(0));

// For Ownable errors, use exact encoding
vm.expectRevert(
    abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user)
);
function();

// Debug: see actual error
try {
    function();
    fail("Should revert");
} catch Error(string memory reason) {
    console.log("Error:", reason);
} catch (bytes memory lowLevelData) {
    console.logBytes(lowLevelData);
}
```

---

### 11. Missing Custom Error

**Problem:** `Error: Undeclared identifier 'CustomError'`

**Solution:**
- Ensure custom error is defined in the contract
- Make sure it's imported if in a different file
- Use correct error selector syntax

```solidity
// In contract:
error InvalidTokenAddress();

// In test:
vm.expectRevert(Faucet.InvalidTokenAddress.selector);
```

---

### 12. Duplicate Test Names

**Problem:** Multiple functions with the same `test_` name.

**Solution:**
```bash
# Find duplicates
grep "function test_" contracts/test/*.t.sol | sort | uniq -d

# Rename to make unique:
test_ClaimTokens() -> test_ClaimTokens_Success()
test_ClaimTokens() -> test_ClaimTokens_Failure()
```

---

### 13. Fork Tests Failing

**Problem:** Tests fail when using `vm.createFork()`.

**Solution:**
```bash
# Ensure RPC endpoints are configured in foundry.toml
[rpc_endpoints]
base_mainnet = "https://mainnet.base.org"

# Use the correct RPC in test
uint256 fork = vm.createFork("base_mainnet");
vm.selectFork(fork);
```

---

### 14. Coverage Report Issues

**Problem:** Coverage report shows 0% or crashes.

**Solution:**
```bash
# Clear cache
rm -rf contracts/cache

# Run coverage
cd contracts
forge coverage

# For specific file
forge coverage --match-path "*/test/Faucet.t.sol"

# If still fails, update Foundry
foundryup
```

---

### 15. File Permission Issues

**Problem:** "Permission denied" when running `test.sh`

**Solution:**
```bash
# Make script executable
chmod +x test.sh

# Then run
./test.sh

# Or use bash directly
bash test.sh
```

---

## Diagnostic Commands

### Check Foundry Installation
```bash
forge --version
cast --version
anvil --version
```

### Verify Contract Compilation
```bash
cd contracts
forge build --sizes
```

### Run with Maximum Verbosity
```bash
forge test -vvvv
```

### Check Test Discovery
```bash
forge test --list
```

### View Gas Report
```bash
forge test --gas-report
```

### Run Specific Test
```bash
forge test --match-path "*/test/Faucet.t.sol" -v
```

### Run Specific Function
```bash
forge test --match-function test_ClaimTokens -vv
```

---

## Getting Help

1. **Check Foundry Docs:** https://book.getfoundry.sh/
2. **Review Test Best Practices:** See `TEST_BEST_PRACTICES.md`
3. **Check Test Examples:** Review existing tests in `contracts/test/`
4. **Enable Verbose Logging:** Use `-vvv` flags
5. **Check GitHub Issues:** Look for similar issues in repository

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `forge test` | Run all tests |
| `forge test -v` | Run with verbose output |
| `forge test -vv` | Show logs |
| `forge test -vvv` | Show all details |
| `forge test --gas-report` | Show gas usage |
| `forge build` | Compile contracts |
| `forge build --sizes` | Show contract sizes |
| `forge coverage` | Generate coverage report |
| `forge test --list` | List all tests |

---

## Performance Tips

1. **Parallel Test Execution:** Foundry runs tests in parallel by default
2. **Cache Management:** Keep cache clean: `rm -rf cache/`
3. **Selective Testing:** Use `--match` to run specific tests
4. **Gas Optimization:** Monitor gas usage with `--gas-report`

---

## When All Else Fails

```bash
# Nuclear option: Clean everything
cd contracts
rm -rf cache/ out/
git submodule update --init --recursive
forge clean
forge install

# Reinstall Foundry
foundryup

# Run tests again
forge test -vvv
```
