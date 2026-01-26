// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SimpleTriviaGame.sol";
import "../src/Faucet.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock cUSD", "mcUSD") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract IntegrationTest is Test {
    SimpleTriviaGame public triviaGame;
    Faucet public faucet;
    MockERC20 public mockCUSD;
    
    address public owner = address(0x1);
    address public player1 = address(0x2);
    address public player2 = address(0x3);
    
    function setUp() public {
        vm.startPrank(owner);
        mockCUSD = new MockERC20();
        
        // Deploy both contracts
        triviaGame = new SimpleTriviaGame(address(mockCUSD));
        faucet = new Faucet(address(mockCUSD));
        
        // Fund faucet
        mockCUSD.transfer(address(faucet), 1000 * 10**18);
        
        vm.stopPrank();
        
        // Players approve triviaGame
        vm.startPrank(player1);
        mockCUSD.approve(address(triviaGame), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(player2);
        mockCUSD.approve(address(triviaGame), type(uint256).max);
        vm.stopPrank();
    }
    
    function test_PlayerUseFaucetThenPlayTrivia() public {
        // Initial balances
        uint256 initialBalance1 = mockCUSD.balanceOf(player1);
        uint256 initialBalance2 = mockCUSD.balanceOf(player2);
        
        // Players claim from faucet
        vm.prank(player1);
        faucet.claim();
        
        vm.prank(player2);
        faucet.claim();
        
        // Verify balances increased
        assertEq(mockCUSD.balanceOf(player1), initialBalance1 + 10 * 10**18);
        assertEq(mockCUSD.balanceOf(player2), initialBalance2 + 10 * 10**18);
        
        // Now they have tokens to play trivia
        assertGt(mockCUSD.balanceOf(player1), 0);
        assertGt(mockCUSD.balanceOf(player2), 0);
    }
    
    function test_MultiplePlayersAndQuestions() public {
        // Create multiple questions
        string[] memory options = new string[](4);
        options[0] = "A";
        options[1] = "B";
        options[2] = "C";
        options[3] = "D";
        
        vm.startPrank(owner);
        
        for (uint256 i = 0; i < 5; i++) {
            triviaGame.addQuestion(
                string(abi.encodePacked("Question ", vm.toString(i + 1))),
                options,
                i % 4,
                (i + 1) * 10**17,
                SimpleTriviaGame.Category.Celo,
                SimpleTriviaGame.Difficulty.Easy
            );
        }
        
        vm.stopPrank();
        
        assertEq(triviaGame.questionId(), 5);
    }
    
    function test_FaucetAndTriviaGameIndependent() public {
        // Faucet operations don't affect trivia game
        vm.prank(player1);
        faucet.claim();
        
        // TriviaGame should still work normally
        string[] memory options = new string[](2);
        options[0] = "Yes";
        options[1] = "No";
        
        vm.prank(owner);
        triviaGame.addQuestion(
            "Test",
            options,
            0,
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
        
        assertEq(triviaGame.questionId(), 1);
    }
    
    function test_ContractOwnershipSeparation() public {
        // Both contracts should have owner set
        assertEq(faucet.owner(), owner);
        assertEq(triviaGame.owner(), owner);
        
        // But they're separate contracts
        assertNotEq(address(faucet), address(triviaGame));
    }
}
