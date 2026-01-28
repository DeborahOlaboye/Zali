// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleTriviaGame
 * @dev Gas-optimized trivia game with reward distribution
 */
contract SimpleTriviaGameV2 is Ownable {
    using SafeERC20 for IERC20;

    error InvalidTokenAddress();
    error InvalidOptions();
    error InvalidCorrectOption();
    error QuestionNotActive();
    error InvalidOption();
    error InsufficientBalance();
    error Unauthorized();

    struct Question {
        string questionText;
        string[] options;
        uint8 correctOption;
        uint256 rewardAmount;
        bool isActive;
    }

    struct QuestionData {
        string questionText;
        string[] options;
        uint256 rewardAmount;
    }

    IERC20 public immutable usdcToken;
    uint256 public questionCounter;

    mapping(uint256 => Question) public questions;
    mapping(address => uint256) public userScores;
    mapping(uint256 => mapping(address => bool)) public hasAnswered;

    event QuestionAdded(uint256 indexed questionId, string questionText, uint256 reward);
    event AnswerSubmitted(address indexed user, uint256 indexed questionId, bool isCorrect, uint256 reward);
    event QuestionDeactivated(uint256 indexed questionId);

    constructor(address _usdcToken) Ownable(msg.sender) {
        if (_usdcToken == address(0)) revert InvalidTokenAddress();
        usdcToken = IERC20(_usdcToken);
    }

    function addQuestion(
        string calldata questionText,
        string[] calldata options,
        uint8 correctOption,
        uint256 rewardAmount
    ) external onlyOwner returns (uint256) {
        if (options.length < 2 || options.length > 255) revert InvalidOptions();
        if (correctOption >= options.length) revert InvalidCorrectOption();

        uint256 qId = ++questionCounter;
        questions[qId] = Question({
            questionText: questionText,
            options: options,
            correctOption: correctOption,
            rewardAmount: rewardAmount,
            isActive: true
        });

        emit QuestionAdded(qId, questionText, rewardAmount);
        return qId;
    }

    function submitAnswer(uint256 questionId, uint8 selectedOption) external {
        Question storage question = questions[questionId];
        
        if (!question.isActive) revert QuestionNotActive();
        if (selectedOption >= question.options.length) revert InvalidOption();
        if (hasAnswered[questionId][msg.sender]) revert Unauthorized();

        hasAnswered[questionId][msg.sender] = true;
        bool isCorrect = selectedOption == question.correctOption;

        if (isCorrect) {
            userScores[msg.sender]++;
            if (question.rewardAmount > 0) {
                usdcToken.safeTransfer(msg.sender, question.rewardAmount);
            }
            emit AnswerSubmitted(msg.sender, questionId, true, question.rewardAmount);
        } else {
            emit AnswerSubmitted(msg.sender, questionId, false, 0);
        }
    }

    function deactivateQuestion(uint256 questionId) external onlyOwner {
        if (questions[questionId].isActive) {
            questions[questionId].isActive = false;
            emit QuestionDeactivated(questionId);
        }
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        if (balance < amount) revert InsufficientBalance();
        usdcToken.safeTransfer(msg.sender, amount);
    }

    function getQuestion(uint256 questionId) external view returns (QuestionData memory) {
        Question storage q = questions[questionId];
        return QuestionData({
            questionText: q.questionText,
            options: q.options,
            rewardAmount: q.rewardAmount
        });
    }

    function isQuestionActive(uint256 questionId) external view returns (bool) {
        return questions[questionId].isActive;
    }

    function hasUserAnswered(uint256 questionId, address user) external view returns (bool) {
        return hasAnswered[questionId][user];
    }

    function getUserScore(address user) external view returns (uint256) {
        return userScores[user];
    }
}