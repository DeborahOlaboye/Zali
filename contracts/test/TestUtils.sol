// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title TestUtils
 * @dev Common utilities and mock contracts for testing
 */

contract MockERC20Token is ERC20 {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _decimals = decimals_;
        _mint(msg.sender, 1000000 * 10**uint256(decimals_));
    }
    
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}

contract MockFailingERC20 is ERC20 {
    bool private shouldFail;
    
    constructor() ERC20("Failing Token", "FAIL") {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function setShouldFail(bool _fail) public {
        shouldFail = _fail;
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        if (shouldFail) {
            return false;
        }
        return super.transfer(to, amount);
    }
    
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        if (shouldFail) {
            return false;
        }
        return super.transferFrom(from, to, amount);
    }
}

contract TestHelper is Test {
    // Common test constants
    uint256 internal constant DEFAULT_AMOUNT = 100 * 10**18;
    uint256 internal constant DEFAULT_REWARD = 10 * 10**18;
    
    // Helper function to create test addresses
    function createUsers(uint256 count) internal pure returns (address[] memory) {
        address[] memory users = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            users[i] = address(uint160(i + 1));
        }
        return users;
    }
    
    // Helper function to check balance increased by amount
    function checkBalanceIncreasedBy(
        IERC20 token,
        address account,
        uint256 initialBalance,
        uint256 expectedIncrease
    ) internal view {
        uint256 finalBalance = token.balanceOf(account);
        assertEq(finalBalance, initialBalance + expectedIncrease);
    }
    
    // Helper function to check balance decreased by amount
    function checkBalanceDecreasedBy(
        IERC20 token,
        address account,
        uint256 initialBalance,
        uint256 expectedDecrease
    ) internal view {
        uint256 finalBalance = token.balanceOf(account);
        assertEq(finalBalance, initialBalance - expectedDecrease);
    }
    
    // Helper to format amounts with decimals
    function toWei(uint256 amount, uint8 decimals) internal pure returns (uint256) {
        return amount * 10**uint256(decimals);
    }
}
