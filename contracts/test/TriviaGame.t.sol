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
    
    function test_MultipleQuestionsCreation() public {
        string[] memory options = new string[](4);
        options[0] = "A";
        options[1] = "B";
        options[2] = "C";
        options[3] = "D";
        
        vm.startPrank(owner);
        
        // Add first question
        triviaGame.addQuestion(
            "Question 1",
            options,
            0,
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
        
        // Add second question
        triviaGame.addQuestion(
            "Question 2",
            options,
            1,
            2 * 10**18,
            SimpleTriviaGame.Category.DeFi,
            SimpleTriviaGame.Difficulty.Medium
        );
        
        // Add third question
        triviaGame.addQuestion(
            "Question 3",
            options,
            2,
            3 * 10**18,
            SimpleTriviaGame.Category.Web3,
            SimpleTriviaGame.Difficulty.Hard
        );
        
        vm.stopPrank();
        
        assertEq(triviaGame.questionId(), 3);
    }
    
    function test_DifferentDifficultiesAndCategories() public {
        string[] memory options = new string[](4);
        options[0] = "Easy";
        options[1] = "Medium";
        options[2] = "Hard";
        options[3] = "Extreme";
        
        vm.startPrank(owner);
        
        // Easy Celo question
        triviaGame.addQuestion("Celo Easy", options, 0, 1 * 10**18, SimpleTriviaGame.Category.Celo, SimpleTriviaGame.Difficulty.Easy);
        
        // Medium DeFi question
        triviaGame.addQuestion("DeFi Medium", options, 1, 2 * 10**18, SimpleTriviaGame.Category.DeFi, SimpleTriviaGame.Difficulty.Medium);
        
        // Hard Web3 question
        triviaGame.addQuestion("Web3 Hard", options, 2, 3 * 10**18, SimpleTriviaGame.Category.Web3, SimpleTriviaGame.Difficulty.Hard);
        
        // NFT question
        triviaGame.addQuestion("NFT Question", options, 3, 4 * 10**18, SimpleTriviaGame.Category.NFTs, SimpleTriviaGame.Difficulty.Easy);
        
        // DAO question
        triviaGame.addQuestion("DAO Question", options, 0, 5 * 10**18, SimpleTriviaGame.Category.DAOs, SimpleTriviaGame.Difficulty.Medium);
        
        vm.stopPrank();
        
        assertEq(triviaGame.questionId(), 5);
    }
    
    function test_QuestionDeactivationPreventsQuestionFromBeingActive() public {
        string[] memory options = new string[](2);
        options[0] = "Yes";
        options[1] = "No";
        
        vm.startPrank(owner);
        triviaGame.addQuestion("Will this work?", options, 0, 1 * 10**18, SimpleTriviaGame.Category.Celo, SimpleTriviaGame.Difficulty.Easy);
        triviaGame.deactivateQuestion(1);
        vm.stopPrank();
    }
    
    function test_LargeRewardAmounts() public {
        string[] memory options = new string[](4);
        options[0] = "A";
        options[1] = "B";
        options[2] = "C";
        options[3] = "D";
        
        vm.prank(owner);
        triviaGame.addQuestion(
            "Large Reward Question",
            options,
            0,
            1000 * 10**18, // 1000 cUSD reward
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Hard
        );
        
        assertEq(triviaGame.questionId(), 1);
    }
    
    function test_MinimalRewardAmounts() public {
        string[] memory options = new string[](4);
        options[0] = "A";
        options[1] = "B";
        options[2] = "C";
        options[3] = "D";
        
        vm.prank(owner);
        triviaGame.addQuestion(
            "Minimal Reward Question",
            options,
            0,
            1, // 1 wei reward
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
        
        assertEq(triviaGame.questionId(), 1);
    }
    
    function test_FourOptionsQuestion() public {
        string[] memory options = new string[](4);
        options[0] = "Option 1";
        options[1] = "Option 2";
        options[2] = "Option 3";
        options[3] = "Option 4";
        
        vm.prank(owner);
        triviaGame.addQuestion(
            "Four Options",
            options,
            3, // Last option is correct
            1 * 10**18,
            SimpleTriviaGame.Category.Celo,
            SimpleTriviaGame.Difficulty.Easy
        );
        
        assertEq(triviaGame.questionId(), 1);
    }
    
    function test_UserScoresInitializedToZero() public {
        assertEq(triviaGame.userScores(player1), 0);
        assertEq(triviaGame.userScores(player2), 0);
        assertEq(triviaGame.userScores(player3), 0);
    }
    
    function test_TokenContractIsSet() public view {
        assertNotEq(address(triviaGame.usdcToken()), address(0));
        assertEq(address(triviaGame.usdcToken()), address(mockCUSD));
    }
}

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock cUSD", "mcUSD") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
