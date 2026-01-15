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

    function test_ConstructorSetsTokenAddress() public view {
        assertEq(address(game.usdcToken()), address(mockUSDC));
    }

    function test_ConstructorSetsOwner() public view {
        assertEq(game.owner(), owner);
    }

    function test_RevertWhen_ConstructorCalledWithZeroAddress() public {
        vm.expectRevert(SimpleTriviaGame.InvalidTokenAddress.selector);
        new SimpleTriviaGame(address(0));
    }

    function test_AddQuestion() public {
        vm.startPrank(owner);

        string[] memory options = new string[](4);
        options[0] = "Option A";
        options[1] = "Option B";
        options[2] = "Option C";
        options[3] = "Option D";

        game.addQuestion("What is 2+2?", options, 2, 10 * 10**6);

        (string memory questionText, string[] memory storedOptions, uint256 correctOption, uint256 rewardAmount, bool isActive) = game.getQuestion(1);

        assertEq(questionText, "What is 2+2?");
        assertEq(storedOptions.length, 4);
        assertEq(storedOptions[0], "Option A");
        assertEq(correctOption, 2);
        assertEq(rewardAmount, 10 * 10**6);
        assertTrue(isActive);

        vm.stopPrank();
    }

    function test_RevertWhen_AddQuestionWithInvalidOptions() public {
        vm.startPrank(owner);

        string[] memory options = new string[](1);
        options[0] = "Only one option";

        vm.expectRevert(SimpleTriviaGame.InvalidOptions.selector);
        game.addQuestion("Invalid question?", options, 0, 10 * 10**6);

        vm.stopPrank();
    }

    function test_RevertWhen_AddQuestionWithInvalidCorrectOption() public {
        vm.startPrank(owner);

        string[] memory options = new string[](3);
        options[0] = "Option A";
        options[1] = "Option B";
        options[2] = "Option C";

        vm.expectRevert(SimpleTriviaGame.InvalidCorrectOption.selector);
        game.addQuestion("Invalid question?", options, 5, 10 * 10**6);

        vm.stopPrank();
    }

    function test_SubmitCorrectAnswer() public {
        vm.startPrank(owner);

        string[] memory options = new string[](3);
        options[0] = "Paris";
        options[1] = "London";
        options[2] = "Berlin";

        game.addQuestion("What is the capital of France?", options, 0, 5 * 10**6);
        vm.stopPrank();

        uint256 initialBalance = mockUSDC.balanceOf(player1);
        uint256 initialScore = game.userScores(player1);

        vm.prank(player1);
        game.submitAnswer(1, 0);

        uint256 finalBalance = mockUSDC.balanceOf(player1);
        uint256 finalScore = game.userScores(player1);

        assertEq(finalBalance - initialBalance, 5 * 10**6);
        assertEq(finalScore - initialScore, 1);
    }

    function test_SubmitIncorrectAnswer() public {
        vm.startPrank(owner);

        string[] memory options = new string[](3);
        options[0] = "Paris";
        options[1] = "London";
        options[2] = "Berlin";

        game.addQuestion("What is the capital of France?", options, 0, 5 * 10**6);
        vm.stopPrank();

        uint256 initialBalance = mockUSDC.balanceOf(player1);
        uint256 initialScore = game.userScores(player1);

        vm.prank(player1);
        game.submitAnswer(1, 1); // Wrong answer

        uint256 finalBalance = mockUSDC.balanceOf(player1);
        uint256 finalScore = game.userScores(player1);

        assertEq(finalBalance, initialBalance); // No reward
        assertEq(finalScore, initialScore); // No score increase
    }
}
