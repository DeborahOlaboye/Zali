// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SimpleTriviaGame.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock USDC token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract SimpleTriviaGameBulkTest is Test {
    SimpleTriviaGame game;
    MockUSDC usdc;
    address owner;
    address player1;
    address player2;
    address player3;

    function setUp() public {
        owner = address(this);
        player1 = address(0x123);
        player2 = address(0x456);
        player3 = address(0x789);

        usdc = new MockUSDC();
        game = new SimpleTriviaGame(address(usdc));

        // Fund players with USDC
        usdc.transfer(player1, 10000 * 10**6);
        usdc.transfer(player2, 10000 * 10**6);
        usdc.transfer(player3, 10000 * 10**6);

        // Fund contract with USDC for rewards
        usdc.transfer(address(game), 100000 * 10**6);
    }

    /*//////////////////////////////////////////////////////////////
                           BULK ADD QUESTIONS TESTS
    //////////////////////////////////////////////////////////////*/

    function testBulkAddQuestions() public {
        string[] memory questionTexts = new string[](3);
        questionTexts[0] = "What is 2+2?";
        questionTexts[1] = "What is the capital of France?";
        questionTexts[2] = "What color is the sky?";

        string[][] memory optionsArray = new string[][](3);
        optionsArray[0] = new string[](4);
        optionsArray[0][0] = "3";
        optionsArray[0][1] = "4";
        optionsArray[0][2] = "5";
        optionsArray[0][3] = "6";

        optionsArray[1] = new string[](4);
        optionsArray[1][0] = "London";
        optionsArray[1][1] = "Paris";
        optionsArray[1][2] = "Berlin";
        optionsArray[1][3] = "Madrid";

        optionsArray[2] = new string[](4);
        optionsArray[2][0] = "Red";
        optionsArray[2][1] = "Blue";
        optionsArray[2][2] = "Green";
        optionsArray[2][3] = "Yellow";

        uint256[] memory correctOptions = new uint256[](3);
        correctOptions[0] = 1; // 4
        correctOptions[1] = 1; // Paris
        correctOptions[2] = 1; // Blue

        uint256[] memory rewardAmounts = new uint256[](3);
        rewardAmounts[0] = 100 * 10**6; // 100 USDC
        rewardAmounts[1] = 200 * 10**6; // 200 USDC
        rewardAmounts[2] = 150 * 10**6; // 150 USDC

        vm.expectEmit(true, false, false, true);
        emit SimpleTriviaGame.BulkQuestionsAdded(1, 3, 450 * 10**6);

        game.bulkAddQuestions(questionTexts, optionsArray, correctOptions, rewardAmounts);

        assertEq(game.questionId(), 3);
        (string memory q, , uint256 correct, uint256 reward, bool active) = game.getQuestion(1);
        assertEq(q, "What is 2+2?");
        assertEq(correct, 1);
        assertEq(reward, 100 * 10**6);
        assertTrue(active);
    }

    function testBulkAddQuestionsMaximum() public {
        uint256 maxQuestions = game.MAX_BULK_QUESTIONS();
        string[] memory questionTexts = new string[](maxQuestions);
        string[][] memory optionsArray = new string[][](maxQuestions);
        uint256[] memory correctOptions = new uint256[](maxQuestions);
        uint256[] memory rewardAmounts = new uint256[](maxQuestions);

        for (uint256 i = 0; i < maxQuestions; i++) {
            questionTexts[i] = string(abi.encodePacked("Question ", i));
            optionsArray[i] = new string[](2);
            optionsArray[i][0] = "A";
            optionsArray[i][1] = "B";
            correctOptions[i] = 0;
            rewardAmounts[i] = 10 * 10**6;
        }

        game.bulkAddQuestions(questionTexts, optionsArray, correctOptions, rewardAmounts);
        assertEq(game.questionId(), maxQuestions);
    }

    function testBulkAddQuestionsExceedsMaximum() public {
        uint256 maxQuestions = game.MAX_BULK_QUESTIONS();
        string[] memory questionTexts = new string[](maxQuestions + 1);
        string[][] memory optionsArray = new string[][](maxQuestions + 1);
        uint256[] memory correctOptions = new uint256[](maxQuestions + 1);
        uint256[] memory rewardAmounts = new uint256[](maxQuestions + 1);

        vm.expectRevert("Invalid bulk question count");
        game.bulkAddQuestions(questionTexts, optionsArray, correctOptions, rewardAmounts);
    }

    function testBulkAddQuestionsArrayMismatch() public {
        string[] memory questionTexts = new string[](2);
        string[][] memory optionsArray = new string[][](1); // Wrong length
        uint256[] memory correctOptions = new uint256[](2);
        uint256[] memory rewardAmounts = new uint256[](2);

        vm.expectRevert("Array length mismatch");
        game.bulkAddQuestions(questionTexts, optionsArray, correctOptions, rewardAmounts);
    }

    function testBulkAddQuestionsOnlyOwner() public {
        string[] memory questionTexts = new string[](1);
        questionTexts[0] = "Test?";

        string[][] memory optionsArray = new string[][](1);
        optionsArray[0] = new string[](2);
        optionsArray[0][0] = "A";
        optionsArray[0][1] = "B";

        uint256[] memory correctOptions = new uint256[](1);
        correctOptions[0] = 0;

        uint256[] memory rewardAmounts = new uint256[](1);
        rewardAmounts[0] = 100 * 10**6;

        vm.prank(player1);
        vm.expectRevert();
        game.bulkAddQuestions(questionTexts, optionsArray, correctOptions, rewardAmounts);
    }

    /*//////////////////////////////////////////////////////////////
                           BULK SUBMIT ANSWERS TESTS
    //////////////////////////////////////////////////////////////*/

    function testBulkSubmitAnswers() public {
        // First add some questions
        game.addQuestion("Q1", ["A", "B", "C"], 0, 100 * 10**6);
        game.addQuestion("Q2", ["X", "Y", "Z"], 1, 200 * 10**6);
        game.addQuestion("Q3", ["P", "Q", "R"], 2, 150 * 10**6);

        uint256[] memory questionIds = new uint256[](3);
        questionIds[0] = 1;
        questionIds[1] = 2;
        questionIds[2] = 3;

        uint256[] memory selectedOptions = new uint256[](3);
        selectedOptions[0] = 0; // Correct
        selectedOptions[1] = 1; // Correct
        selectedOptions[2] = 0; // Wrong

        vm.prank(player1);
        vm.expectEmit(true, false, false, true);
        emit SimpleTriviaGame.BulkAnswersSubmitted(player1, questionIds, 2, 300 * 10**6);

        game.bulkSubmitAnswers(questionIds, selectedOptions);

        assertEq(game.userScores(player1), 2);
        assertEq(usdc.balanceOf(player1), 10000 * 10**6 + 300 * 10**6); // Initial + rewards
    }

    function testBulkSubmitAnswersMaximum() public {
        // Add maximum questions
        uint256 maxAnswers = game.MAX_BULK_ANSWERS();
        for (uint256 i = 0; i < maxAnswers; i++) {
            game.addQuestion(string(abi.encodePacked("Q", i)), ["A", "B"], 0, 10 * 10**6);
        }

        uint256[] memory questionIds = new uint256[](maxAnswers);
        uint256[] memory selectedOptions = new uint256[](maxAnswers);

        for (uint256 i = 0; i < maxAnswers; i++) {
            questionIds[i] = i + 1;
            selectedOptions[i] = 0; // All correct
        }

        vm.prank(player1);
        game.bulkSubmitAnswers(questionIds, selectedOptions);

        assertEq(game.userScores(player1), maxAnswers);
    }

    function testBulkSubmitAnswersExceedsMaximum() public {
        uint256 maxAnswers = game.MAX_BULK_ANSWERS();
        uint256[] memory questionIds = new uint256[](maxAnswers + 1);
        uint256[] memory selectedOptions = new uint256[](maxAnswers + 1);

        vm.expectRevert("Invalid bulk answer count");
        vm.prank(player1);
        game.bulkSubmitAnswers(questionIds, selectedOptions);
    }

    function testBulkSubmitAnswersInactiveQuestion() public {
        game.addQuestion("Q1", ["A", "B"], 0, 100 * 10**6);
        game.addQuestion("Q2", ["X", "Y"], 1, 200 * 10**6);

        // Deactivate first question
        uint256[] memory deactivateIds = new uint256[](1);
        deactivateIds[0] = 1;
        bool[] memory statuses = new bool[](1);
        statuses[0] = false;
        game.bulkUpdateQuestionStatus(deactivateIds, statuses);

        uint256[] memory questionIds = new uint256[](2);
        questionIds[0] = 1; // Inactive
        questionIds[1] = 2;

        uint256[] memory selectedOptions = new uint256[](2);
        selectedOptions[0] = 0;
        selectedOptions[1] = 1;

        vm.prank(player1);
        vm.expectRevert("Question not active");
        game.bulkSubmitAnswers(questionIds, selectedOptions);
    }

    /*//////////////////////////////////////////////////////////////
                           BULK DISTRIBUTE REWARDS TESTS
    //////////////////////////////////////////////////////////////*/

    function testBulkDistributeRewards() public {
        address[] memory recipients = new address[](3);
        recipients[0] = player1;
        recipients[1] = player2;
        recipients[2] = player3;

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100 * 10**6;
        amounts[1] = 200 * 10**6;
        amounts[2] = 150 * 10**6;

        uint256 totalAmount = 450 * 10**6;

        vm.expectEmit(true, false, false, true);
        emit SimpleTriviaGame.BulkRewardsDistributed(recipients, amounts, totalAmount);

        game.bulkDistributeRewards(recipients, amounts);

        assertEq(usdc.balanceOf(player1), 10000 * 10**6 + 100 * 10**6);
        assertEq(usdc.balanceOf(player2), 10000 * 10**6 + 200 * 10**6);
        assertEq(usdc.balanceOf(player3), 10000 * 10**6 + 150 * 10**6);
    }

    function testBulkDistributeRewardsMaximum() public {
        uint256 maxRewards = game.MAX_BULK_REWARDS();
        address[] memory recipients = new address[](maxRewards);
        uint256[] memory amounts = new uint256[](maxRewards);

        for (uint256 i = 0; i < maxRewards; i++) {
            recipients[i] = address(uint160(i + 1000));
            amounts[i] = 10 * 10**6;
            // Mint USDC to recipients for this test
            usdc.transfer(recipients[i], 1000 * 10**6);
        }

        game.bulkDistributeRewards(recipients, amounts);
    }

    function testBulkDistributeRewardsExceedsMaximum() public {
        uint256 maxRewards = game.MAX_BULK_REWARDS();
        address[] memory recipients = new address[](maxRewards + 1);
        uint256[] memory amounts = new uint256[](maxRewards + 1);

        vm.expectRevert("Invalid bulk reward count");
        game.bulkDistributeRewards(recipients, amounts);
    }

    function testBulkDistributeRewardsOnlyOwner() public {
        address[] memory recipients = new address[](1);
        recipients[0] = player1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100 * 10**6;

        vm.prank(player1);
        vm.expectRevert();
        game.bulkDistributeRewards(recipients, amounts);
    }

    function testBulkDistributeRewardsZeroAmount() public {
        address[] memory recipients = new address[](1);
        recipients[0] = player1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0; // Zero amount

        vm.expectRevert("Zero amount");
        game.bulkDistributeRewards(recipients, amounts);
    }

    /*//////////////////////////////////////////////////////////////
                           BULK UPDATE TESTS
    //////////////////////////////////////////////////////////////*/

    function testBulkUpdateQuestionStatus() public {
        // Add questions
        game.addQuestion("Q1", ["A", "B"], 0, 100 * 10**6);
        game.addQuestion("Q2", ["X", "Y"], 1, 200 * 10**6);
        game.addQuestion("Q3", ["P", "Q"], 0, 150 * 10**6);

        uint256[] memory questionIds = new uint256[](2);
        questionIds[0] = 1;
        questionIds[1] = 3;

        bool[] memory statuses = new bool[](2);
        statuses[0] = false; // Deactivate Q1
        statuses[1] = false; // Deactivate Q3

        game.bulkUpdateQuestionStatus(questionIds, statuses);

        (, , , , bool active1) = game.getQuestion(1);
        (, , , , bool active2) = game.getQuestion(2);
        (, , , , bool active3) = game.getQuestion(3);

        assertFalse(active1);
        assertTrue(active2);  // Should remain active
        assertFalse(active3);
    }

    function testBulkUpdateRewards() public {
        // Add questions
        game.addQuestion("Q1", ["A", "B"], 0, 100 * 10**6);
        game.addQuestion("Q2", ["X", "Y"], 1, 200 * 10**6);

        uint256[] memory questionIds = new uint256[](2);
        questionIds[0] = 1;
        questionIds[1] = 2;

        uint256[] memory newRewards = new uint256[](2);
        newRewards[0] = 300 * 10**6; // Increase Q1 reward
        newRewards[1] = 50 * 10**6;  // Decrease Q2 reward

        game.bulkUpdateRewards(questionIds, newRewards);

        (, , , uint256 reward1, ) = game.getQuestion(1);
        (, , , uint256 reward2, ) = game.getQuestion(2);

        assertEq(reward1, 300 * 10**6);
        assertEq(reward2, 50 * 10**6);
    }

    /*//////////////////////////////////////////////////////////////
                           UTILITY FUNCTION TESTS
    //////////////////////////////////////////////////////////////*/

    function testGetBulkLimits() public {
        (uint256 maxQuestions, uint256 maxAnswers, uint256 maxRewards) = game.getBulkLimits();
        assertEq(maxQuestions, 25);
        assertEq(maxAnswers, 20);
        assertEq(maxRewards, 30);
    }

    function testEstimateBulkGas() public {
        // Test question addition gas estimation
        uint256 questionGas = game.estimateBulkGas(5, 0);
        assertEq(questionGas, 21000 + (85000 * 5)); // 443000

        // Test answer submission gas estimation
        uint256 answerGas = game.estimateBulkGas(8, 1);
        assertEq(answerGas, 21000 + (45000 * 8)); // 381000

        // Test reward distribution gas estimation
        uint256 rewardGas = game.estimateBulkGas(10, 2);
        assertEq(rewardGas, 21000 + (35000 * 10)); // 381000
    }

    function testEstimateBulkGasInvalidType() public {
        vm.expectRevert("Invalid operation type");
        game.estimateBulkGas(5, 99);
    }

    function testEstimateBulkGasExceedsLimits() public {
        vm.expectRevert("Too many questions");
        game.estimateBulkGas(26, 0);

        vm.expectRevert("Too many answers");
        game.estimateBulkGas(21, 1);

        vm.expectRevert("Too many rewards");
        game.estimateBulkGas(31, 2);
    }

    function testBulkGetQuestions() public {
        // Add questions
        game.addQuestion("Q1", ["A", "B", "C"], 0, 100 * 10**6);
        game.addQuestion("Q2", ["X", "Y", "Z"], 1, 200 * 10**6);

        uint256[] memory questionIds = new uint256[](2);
        questionIds[0] = 1;
        questionIds[1] = 2;

        (
            string[] memory texts,
            string[][] memory options,
            uint256[] memory corrects,
            uint256[] memory rewards,
            bool[] memory actives
        ) = game.bulkGetQuestions(questionIds);

        assertEq(texts.length, 2);
        assertEq(texts[0], "Q1");
        assertEq(texts[1], "Q2");
        assertEq(corrects[0], 0);
        assertEq(corrects[1], 1);
        assertEq(rewards[0], 100 * 10**6);
        assertEq(rewards[1], 200 * 10**6);
        assertTrue(actives[0]);
        assertTrue(actives[1]);
    }

    function testBulkGetUserStats() public {
        // Set some scores
        vm.prank(player1);
        game.submitAnswer(1, 0); // Assuming question exists

        vm.prank(player2);
        game.submitAnswer(1, 0);

        address[] memory users = new address[](2);
        users[0] = player1;
        users[1] = player2;

        (uint256[] memory scores, uint256[] memory rewards) = game.bulkGetUserStats(users);

        assertEq(scores.length, 2);
        assertEq(scores[0], 1);
        assertEq(scores[1], 1);
    }

    function testGetQuestionStats() public {
        // Add questions
        game.addQuestion("Q1", ["A", "B"], 0, 100 * 10**6);
        game.addQuestion("Q2", ["X", "Y"], 1, 200 * 10**6);
        game.addQuestion("Q3", ["P", "Q"], 0, 150 * 10**6);

        // Deactivate one question
        uint256[] memory ids = new uint256[](1);
        ids[0] = 2;
        bool[] memory statuses = new bool[](1);
        statuses[0] = false;
        game.bulkUpdateQuestionStatus(ids, statuses);

        (uint256 total, uint256 active, uint256 totalRewards, uint256 avgReward) = game.getQuestionStats();

        assertEq(total, 3);
        assertEq(active, 2); // Q1 and Q3 active
        assertEq(totalRewards, 250 * 10**6); // 100 + 150
        assertEq(avgReward, 83333333); // (250 * 10^6) / 3
    }

    /*//////////////////////////////////////////////////////////////
                           INTEGRATION TESTS
    //////////////////////////////////////////////////////////////*/

    function testBulkOperationsWorkflow() public {
        // 1. Bulk add questions
        string[] memory texts = new string[](3);
        texts[0] = "What is 1+1?"; texts[1] = "Capital of Spain?"; texts[2] = "Color of grass?";

        string[][] memory opts = new string[][](3);
        opts[0] = ["1", "2", "3"]; opts[1] = ["Madrid", "Paris", "London"]; opts[2] = ["Blue", "Green", "Red"];

        uint256[] memory corrects = new uint256[](3);
        corrects[0] = 1; corrects[1] = 0; corrects[2] = 1;

        uint256[] memory rewards = new uint256[](3);
        rewards[0] = 50 * 10**6; rewards[1] = 75 * 10**6; rewards[2] = 60 * 10**6;

        game.bulkAddQuestions(texts, opts, corrects, rewards);

        // 2. Bulk submit answers
        uint256[] memory qIds = new uint256[](3);
        qIds[0] = 1; qIds[1] = 2; qIds[2] = 3;

        uint256[] memory answers = new uint256[](3);
        answers[0] = 1; answers[1] = 0; answers[2] = 1; // All correct

        vm.prank(player1);
        game.bulkSubmitAnswers(qIds, answers);

        assertEq(game.userScores(player1), 3);
        assertEq(usdc.balanceOf(player1), 10000 * 10**6 + 185 * 10**6); // 50 + 75 + 60

        // 3. Bulk distribute additional rewards
        address[] memory recipients = new address[](1);
        recipients[0] = player2;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100 * 10**6;

        game.bulkDistributeRewards(recipients, amounts);

        assertEq(usdc.balanceOf(player2), 10000 * 10**6 + 100 * 10**6);
    }

    function testBulkOperationsGasEfficiency() public {
        // Add questions individually vs bulk
        uint256 gasStart = gasleft();

        game.addQuestion("Q1", ["A", "B"], 0, 10 * 10**6);
        game.addQuestion("Q2", ["C", "D"], 1, 10 * 10**6);
        game.addQuestion("Q3", ["E", "F"], 0, 10 * 10**6);

        uint256 individualGas = gasStart - gasleft();

        // Reset for bulk test
        gasStart = gasleft();

        string[] memory texts = new string[](3);
        texts[0] = "Bulk Q1"; texts[1] = "Bulk Q2"; texts[2] = "Bulk Q3";

        string[][] memory opts = new string[][](3);
        opts[0] = ["A", "B"]; opts[1] = ["C", "D"]; opts[2] = ["E", "F"];

        uint256[] memory corrects = new uint256[](3);
        corrects[0] = 0; corrects[1] = 1; corrects[2] = 0;

        uint256[] memory rewards = new uint256[](3);
        rewards[0] = 10 * 10**6; rewards[1] = 10 * 10**6; rewards[2] = 10 * 10**6;

        game.bulkAddQuestions(texts, opts, corrects, rewards);

        uint256 bulkGas = gasStart - gasleft();

        // Bulk should be more gas efficient for multiple operations
        assertLt(bulkGas, individualGas);
    }

    function testBulkOperationsErrorHandling() public {
        // Test that one invalid operation doesn't prevent validation
        string[] memory texts = new string[](2);
        texts[0] = "Valid question";
        texts[1] = "Another valid";

        string[][] memory opts = new string[][](2);
        opts[0] = ["A", "B"];
        opts[1] = ["C"]; // Invalid - only one option

        uint256[] memory corrects = new uint256[](2);
        corrects[0] = 0;
        corrects[1] = 0;

        uint256[] memory rewards = new uint256[](2);
        rewards[0] = 10 * 10**6;
        rewards[1] = 10 * 10**6;

        vm.expectRevert("Invalid options");
        game.bulkAddQuestions(texts, opts, corrects, rewards);
    }
}
