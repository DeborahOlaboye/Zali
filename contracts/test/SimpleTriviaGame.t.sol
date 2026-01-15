// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SimpleTriviaGame.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC (6 decimals)
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract SimpleTriviaGameTest is Test {
    SimpleTriviaGame public game;
    MockERC20 public mockUSDC;
    address public owner = address(0x1);
    address public player1 = address(0x2);
    address public player2 = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        mockUSDC = new MockERC20();
        game = new SimpleTriviaGame(address(mockUSDC));

        // Fund the game contract with rewards
        mockUSDC.transfer(address(game), 10000 * 10**6); // 10,000 USDC
        vm.stopPrank();
    }
}
