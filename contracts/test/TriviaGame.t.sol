// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SimpleTriviaGame.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock cUSD", "mcUSD") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract TriviaGameTest is Test {
    SimpleTriviaGame public triviaGame;
    MockERC20 public mockCUSD;
    
    address public owner = address(0x1);
    address public player1 = address(0x2);
    address public player2 = address(0x3);
    address public player3 = address(0x4);
    
    function setUp() public {
        vm.startPrank(owner);
        mockCUSD = new MockERC20();
        triviaGame = new SimpleTriviaGame(address(mockCUSD));
        
        // Fund players with cUSD
        uint256 playerFunds = 100 * 10**18;
        mockCUSD.transfer(player1, playerFunds);
        mockCUSD.transfer(player2, playerFunds);
        mockCUSD.transfer(player3, playerFunds);
        vm.stopPrank();
        
        // Approve the game contract to spend players' tokens
        vm.startPrank(player1);
        mockCUSD.approve(address(triviaGame), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(player2);
        mockCUSD.approve(address(triviaGame), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(player3);
        mockCUSD.approve(address(triviaGame), type(uint256).max);
        vm.stopPrank();
    }
    
    function test_AddQuestion() public {
        string[] memory options = new string[](4);
        options[0] = "Option A";
        options[1] = "Option B";
        options[2] = "Option C";
        options[3] = "Option D";
        
        vm.prank(owner);
        triviaGame.addQuestion(
            "What is Celo?",
            options,
            1,
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
        
        assertEq(triviaGame.questionId(), 1);
    }
    
    function test_RevertWhen_InvalidOptions() public {
        string[] memory options = new string[](1);
        options[0] = "Only one option";
        
        vm.prank(owner);
        vm.expectRevert(SimpleTriviaGame.InvalidOptions.selector);
        triviaGame.addQuestion(
            "Test Question",
            options,
            0,
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
    }
    
    function test_RevertWhen_InvalidCorrectOption() public {
        string[] memory options = new string[](4);
        options[0] = "Option A";
        options[1] = "Option B";
        options[2] = "Option C";
        options[3] = "Option D";
        
        vm.prank(owner);
        vm.expectRevert(SimpleTriviaGame.InvalidCorrectOption.selector);
        triviaGame.addQuestion(
            "Test Question",
            options,
            5, // Invalid index
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
    }
    
    function test_DeactivateQuestion() public {
        string[] memory options = new string[](4);
        options[0] = "Option A";
        options[1] = "Option B";
        options[2] = "Option C";
        options[3] = "Option D";
        
        vm.startPrank(owner);
        triviaGame.addQuestion(
            "Test Question",
            options,
            0,
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
        
        triviaGame.deactivateQuestion(1);
        vm.stopPrank();
    }
    
    function test_UserScoresTracking() public {
        // Initial score should be 0
        assertEq(triviaGame.userScores(player1), 0);
    }
    
    function test_ContractOwnershipAndPermissions() public {
        // Verify owner can add questions
        string[] memory options = new string[](4);
        options[0] = "A";
        options[1] = "B";
        options[2] = "C";
        options[3] = "D";
        
        vm.prank(owner);
        triviaGame.addQuestion(
            "Owner Test",
            options,
            0,
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
        
        assertEq(triviaGame.questionId(), 1);
    }

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock cUSD", "mcUSD") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
