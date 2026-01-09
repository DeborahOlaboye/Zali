// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleTriviaGame is Ownable {
    using SafeERC20 for IERC20;
    
    // Custom Errors
    error InvalidTokenAddress();
    error InvalidOptions();
    error InvalidCorrectOption();
    error QuestionNotActive();
    error InvalidOption();
    error InsufficientBalance();
    IERC20 public immutable usdcToken;
    uint256 public questionId;
    
    struct Question {
        string questionText;
        string[] options;
        uint256 correctOption;
        uint256 rewardAmount;
        bool isActive;
    }
    
    mapping(uint256 => Question) public questions;
    mapping(address => uint256) public userScores;

    // Bulk operations constants
    uint256 public constant MAX_BULK_QUESTIONS = 25;
    uint256 public constant MAX_BULK_ANSWERS = 20;
    uint256 public constant MAX_BULK_REWARDS = 30;

    event QuestionAdded(uint256 indexed questionId, string questionText, uint256 reward);
    event AnswerSubmitted(address indexed user, uint256 questionId, bool isCorrect, uint256 reward);
    event BulkQuestionsAdded(uint256 startId, uint256 count, uint256 totalReward);
    event BulkAnswersSubmitted(address indexed user, uint256[] questionIds, uint256 correctCount, uint256 totalReward);
    event BulkRewardsDistributed(address[] recipients, uint256[] amounts, uint256 totalDistributed);
    
    constructor(address _usdcToken) Ownable(msg.sender) {
        if (_usdcToken == address(0)) revert InvalidTokenAddress();
        usdcToken = IERC20(_usdcToken);
    }
    
    function addQuestion(
        string memory _questionText,
        string[] memory _options,
        uint256 _correctOption,
        uint256 _rewardAmount
    ) external onlyOwner {
        if (_options.length <= 1) revert InvalidOptions();
        if (_correctOption >= _options.length) revert InvalidCorrectOption();
        
        questionId++;
        questions[questionId] = Question({
            questionText: _questionText,
            options: _options,
            correctOption: _correctOption,
            rewardAmount: _rewardAmount,
            isActive: true
        });
        
        emit QuestionAdded(questionId, _questionText, _rewardAmount);
    }
    
    function submitAnswer(uint256 _questionId, uint256 _selectedOption) external {
        Question storage question = questions[_questionId];
        if (!question.isActive) revert QuestionNotActive();
        if (_selectedOption >= question.options.length) revert InvalidOption();
        
        bool isCorrect = (_selectedOption == question.correctOption);
        
        if (isCorrect) {
            userScores[msg.sender]++;
            if (question.rewardAmount > 0) {
                usdcToken.safeTransfer(msg.sender, question.rewardAmount);
            }
        }
        
        emit AnswerSubmitted(msg.sender, _questionId, isCorrect, isCorrect ? question.rewardAmount : 0);
    }
    
    function withdrawTokens(uint256 _amount) external onlyOwner {
        if (usdcToken.balanceOf(address(this)) < _amount) revert InsufficientBalance();
        usdcToken.safeTransfer(msg.sender, _amount);
    }
    
    function getQuestion(uint256 _questionId) external view returns (
        string memory questionText,
        string[] memory options,
        uint256 correctOption,
        uint256 rewardAmount,
        bool isActive
    ) {
        Question storage q = questions[_questionId];
        return (q.questionText, q.options, q.correctOption, q.rewardAmount, q.isActive);
    }

    /*//////////////////////////////////////////////////////////////
                           BULK OPERATIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Add multiple questions in a single transaction
    /// @param questionTexts Array of question texts
    /// @param optionsArray Array of answer options for each question
    /// @param correctOptions Array of correct option indices
    /// @param rewardAmounts Array of reward amounts in USDC
    function bulkAddQuestions(
        string[] calldata questionTexts,
        string[][] calldata optionsArray,
        uint256[] calldata correctOptions,
        uint256[] calldata rewardAmounts
    ) external onlyOwner {
        uint256 count = questionTexts.length;
        require(count > 0 && count <= MAX_BULK_QUESTIONS, "Invalid bulk question count");
        require(
            optionsArray.length == count &&
            correctOptions.length == count &&
            rewardAmounts.length == count,
            "Array length mismatch"
        );

        uint256 startId = questionId + 1;
        uint256 totalReward = 0;

        for (uint256 i = 0; i < count; i++) {
            require(optionsArray[i].length > 1, "Invalid options");
            require(correctOptions[i] < optionsArray[i].length, "Invalid correct option");

            questionId++;
            questions[questionId] = Question({
                questionText: questionTexts[i],
                options: optionsArray[i],
                correctOption: correctOptions[i],
                rewardAmount: rewardAmounts[i],
                isActive: true
            });

            totalReward += rewardAmounts[i];

            emit QuestionAdded(questionId, questionTexts[i], rewardAmounts[i]);
        }

        emit BulkQuestionsAdded(startId, count, totalReward);
    }

    /// @notice Submit answers to multiple questions in batch
    /// @param questionIds Array of question IDs to answer
    /// @param selectedOptions Array of selected option indices
    function bulkSubmitAnswers(
        uint256[] calldata questionIds,
        uint256[] calldata selectedOptions
    ) external {
        uint256 count = questionIds.length;
        require(count > 0 && count <= MAX_BULK_ANSWERS, "Invalid bulk answer count");
        require(selectedOptions.length == count, "Array length mismatch");

        uint256 correctCount = 0;
        uint256 totalReward = 0;

        for (uint256 i = 0; i < count; i++) {
            Question storage question = questions[questionIds[i]];
            require(question.isActive, "Question not active");
            require(selectedOptions[i] < question.options.length, "Invalid option");

            bool isCorrect = (selectedOptions[i] == question.correctOption);

            if (isCorrect) {
                correctCount++;
                userScores[msg.sender]++;
                if (question.rewardAmount > 0) {
                    totalReward += question.rewardAmount;
                }
            }

            emit AnswerSubmitted(msg.sender, questionIds[i], isCorrect, isCorrect ? question.rewardAmount : 0);
        }

        // Transfer total rewards if any
        if (totalReward > 0) {
            usdcToken.safeTransfer(msg.sender, totalReward);
        }

        emit BulkAnswersSubmitted(msg.sender, questionIds, correctCount, totalReward);
    }

    /// @notice Distribute rewards to multiple players (admin only)
    /// @param recipients Array of recipient addresses
    /// @param amounts Array of reward amounts in USDC
    function bulkDistributeRewards(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        uint256 count = recipients.length;
        require(count > 0 && count <= MAX_BULK_REWARDS, "Invalid bulk reward count");
        require(amounts.length == count, "Array length mismatch");

        uint256 totalDistributed = 0;

        for (uint256 i = 0; i < count; i++) {
            require(amounts[i] > 0, "Zero amount");
            usdcToken.safeTransfer(recipients[i], amounts[i]);
            totalDistributed += amounts[i];
        }

        emit BulkRewardsDistributed(recipients, amounts, totalDistributed);
    }

    /// @notice Bulk update question status (activate/deactivate)
    /// @param questionIds Array of question IDs to update
    /// @param isActiveArray Array of new active statuses
    function bulkUpdateQuestionStatus(
        uint256[] calldata questionIds,
        bool[] calldata isActiveArray
    ) external onlyOwner {
        uint256 count = questionIds.length;
        require(count > 0 && count <= MAX_BULK_QUESTIONS, "Invalid bulk update count");
        require(isActiveArray.length == count, "Array length mismatch");

        for (uint256 i = 0; i < count; i++) {
            require(questionIds[i] > 0 && questionIds[i] <= questionId, "Invalid question ID");
            questions[questionIds[i]].isActive = isActiveArray[i];
        }
    }

    /// @notice Bulk update question rewards
    /// @param questionIds Array of question IDs to update
    /// @param newRewards Array of new reward amounts
    function bulkUpdateRewards(
        uint256[] calldata questionIds,
        uint256[] calldata newRewards
    ) external onlyOwner {
        uint256 count = questionIds.length;
        require(count > 0 && count <= MAX_BULK_QUESTIONS, "Invalid bulk update count");
        require(newRewards.length == count, "Array length mismatch");

        for (uint256 i = 0; i < count; i++) {
            require(questionIds[i] > 0 && questionIds[i] <= questionId, "Invalid question ID");
            questions[questionIds[i]].rewardAmount = newRewards[i];
        }
    }

    /// @notice Get bulk operation limits
    function getBulkLimits() external pure returns (
        uint256 maxBulkQuestions,
        uint256 maxBulkAnswers,
        uint256 maxBulkRewards
    ) {
        return (MAX_BULK_QUESTIONS, MAX_BULK_ANSWERS, MAX_BULK_REWARDS);
    }

    /// @notice Estimate gas for bulk operations
    /// @param operationCount Number of operations
    /// @param operationType 0=add questions, 1=submit answers, 2=distribute rewards
    function estimateBulkGas(uint256 operationCount, uint256 operationType) external pure returns (uint256) {
        require(operationCount > 0, "Invalid count");

        uint256 baseGas = 21000;
        uint256 gasPerOperation;

        if (operationType == 0) {
            // Add questions (complex storage operations)
            gasPerOperation = operationCount <= MAX_BULK_QUESTIONS ? 85000 : 100000;
            require(operationCount <= MAX_BULK_QUESTIONS, "Too many questions");
        } else if (operationType == 1) {
            // Submit answers (validation + transfers)
            gasPerOperation = 45000;
            require(operationCount <= MAX_BULK_ANSWERS, "Too many answers");
        } else if (operationType == 2) {
            // Distribute rewards (transfers only)
            gasPerOperation = 35000;
            require(operationCount <= MAX_BULK_REWARDS, "Too many rewards");
        } else {
            revert("Invalid operation type");
        }

        return baseGas + (gasPerOperation * operationCount);
    }

    /// @notice Get multiple questions in batch
    /// @param questionIds Array of question IDs to retrieve
    function bulkGetQuestions(uint256[] calldata questionIds) external view returns (
        string[] memory questionTexts,
        string[][] memory optionsArrays,
        uint256[] memory correctOptions,
        uint256[] memory rewardAmounts,
        bool[] memory isActiveArray
    ) {
        uint256 count = questionIds.length;
        require(count > 0 && count <= MAX_BULK_QUESTIONS, "Invalid bulk query count");

        questionTexts = new string[](count);
        optionsArrays = new string[][](count);
        correctOptions = new uint256[](count);
        rewardAmounts = new uint256[](count);
        isActiveArray = new bool[](count);

        for (uint256 i = 0; i < count; i++) {
            Question storage q = questions[questionIds[i]];
            questionTexts[i] = q.questionText;
            optionsArrays[i] = q.options;
            correctOptions[i] = q.correctOption;
            rewardAmounts[i] = q.rewardAmount;
            isActiveArray[i] = q.isActive;
        }
    }

    /// @notice Get user statistics for multiple users
    /// @param users Array of user addresses
    function bulkGetUserStats(address[] calldata users) external view returns (
        uint256[] memory scores,
        uint256[] memory totalRewards
    ) {
        uint256 count = users.length;
        require(count > 0 && count <= 50, "Invalid bulk stats count");

        scores = new uint256[](count);
        totalRewards = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            scores[i] = userScores[users[i]];
            // Note: In a real implementation, you'd track total rewards earned per user
            totalRewards[i] = 0; // Placeholder
        }
    }

    /// @notice Get question statistics
    function getQuestionStats() external view returns (
        uint256 totalQuestions,
        uint256 activeQuestions,
        uint256 totalRewards,
        uint256 averageReward
    ) {
        totalQuestions = questionId;
        uint256 activeCount = 0;
        uint256 totalRewardAmount = 0;

        for (uint256 i = 1; i <= questionId; i++) {
            if (questions[i].isActive) {
                activeCount++;
                totalRewardAmount += questions[i].rewardAmount;
            }
        }

        activeQuestions = activeCount;
        totalRewards = totalRewardAmount;
        averageReward = totalQuestions > 0 ? totalRewardAmount / totalQuestions : 0;
    }
}
