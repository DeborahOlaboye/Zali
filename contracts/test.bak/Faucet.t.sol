// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Faucet.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock cUSD", "mcUSD") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract FaucetTest is Test {
    Faucet public faucet;
    MockERC20 public mockCUSD;
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    function setUp() public {
        vm.startPrank(owner);
        mockCUSD = new MockERC20();
        faucet = new Faucet(address(mockCUSD));
        
        // Transfer some tokens to the faucet
        uint256 faucetBalance = 100 * 10**18;
        mockCUSD.transfer(address(faucet), faucetBalance);
        vm.stopPrank();
    }

    function test_InitialState() public view {
        assertEq(address(faucet.cUSDToken()), address(mockCUSD));
        assertEq(faucet.CLAIM_AMOUNT(), 10 * 10**18);
    }

    function test_ClaimTokens() public {
        // User1 claims tokens
        vm.startPrank(user1);
        
        // Check initial balance
        uint256 initialBalance = mockCUSD.balanceOf(user1);
        
        // Claim tokens
        faucet.claim();
        
        // Check final balance
        uint256 finalBalance = mockCUSD.balanceOf(user1);
        assertEq(finalBalance - initialBalance, 10 * 10**18);
        
        // Check that user1 is marked as claimed
        assertTrue(faucet.hasClaimed(user1));
        
        // Try to claim again (should fail)
        vm.expectRevert("Already claimed");
        faucet.claim();
    }

    function test_OnlyOwnerCanWithdraw() public {
        // User1 tries to withdraw (should fail)
        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        faucet.withdrawTokens(10 * 10**18);
    }

    function test_WithdrawTokens() public {
        // Owner withdraws tokens
        vm.startPrank(owner);
        
        uint256 initialBalance = mockCUSD.balanceOf(owner);
        uint256 faucetBalance = mockCUSD.balanceOf(address(faucet));
        
        faucet.withdrawTokens(faucetBalance);
        
        uint256 finalBalance = mockCUSD.balanceOf(owner);
        assertEq(finalBalance - initialBalance, faucetBalance);
        assertEq(mockCUSD.balanceOf(address(faucet)), 0);
    }

    function test_GetContractBalance() public view {
        uint256 balance = mockCUSD.balanceOf(address(faucet));
        assertEq(faucet.getContractBalance(), balance);
    }
    
    function test_RevertWhen_InvalidTokenAddress() public {
        vm.expectRevert(Faucet.InvalidTokenAddress.selector);
        new Faucet(address(0));
    }
    
    function test_RevertWhen_AlreadyClaimed() public {
        vm.startPrank(user1);
        faucet.claim();
        
        vm.expectRevert(Faucet.AlreadyClaimed.selector);
        faucet.claim();
        vm.stopPrank();
    }
    
    function test_RevertWhen_InsufficientContractBalance() public {
        // Drain the faucet
        vm.prank(owner);
        faucet.withdrawTokens(mockCUSD.balanceOf(address(faucet)));
        
        // Try to claim
        vm.prank(user1);
        vm.expectRevert(Faucet.InsufficientContractBalance.selector);
        faucet.claim();
    }
    
    function test_RevertWhen_WithdrawInsufficientBalance() public {
        uint256 balance = mockCUSD.balanceOf(address(faucet));
        
        vm.prank(owner);
        vm.expectRevert(Faucet.InsufficientBalance.selector);
        faucet.withdrawTokens(balance + 1);
    }
}
