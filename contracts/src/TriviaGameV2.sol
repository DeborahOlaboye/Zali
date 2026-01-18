// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

/**
 * @title TriviaGameV2
 * @dev Continuous trivia game with leaderboard, username registration, and Chainlink VRF
 * Rewards paid in native ETH on Base network
 */
contract TriviaGameV2 is Ownable, ReentrancyGuard, VRFConsumerBaseV2 {
    // Custom Errors
    error InvalidVRFCoordinator();
    error TransferFailed();
    error InsufficientBalance();
    error NoRewardsToClaim();
    error NoRewardsToDistribute();
    error TooEarlyForDistribution();
    error NoPlayers();
    
    VRFCoordinatorV2Interface public vrfCoordinator;
    
    // Chainlink VRF Configuration
    uint64 public subscriptionId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 200000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 10; // Request 10 random numbers for 10 questions
    
    // Game Constants
    uint256 public constant QUESTIONS_PER_SESSION = 10;
    uint256 public constant TIME_LIMIT = 300; // 5 minutes
    uint256 public constant POINTS_PER_CORRECT_ANSWER = 10;
    uint256 public constant SPEED_BONUS_MAX = 5; // Max 5 bonus points for speed
    
    // Rewards (in native ETH on Base)
    uint256 public constant REWARD_PER_CORRECT_ANSWER = 0.001 * 10**18; // 0.001 ETH per correct answer
    uint256 public constant PERFECT_SCORE_BONUS = 0.005 * 10**18; // 0.005 ETH bonus for 10/10
    uint256 public constant SPEED_BONUS_REWARD = 0.002 * 10**18; // Up to 0.002 ETH for speed
    
    // Leaderboard & Weekly Rewards
    uint256 public constant LEADERBOARD_SIZE = 100; // Top 100 players
    uint256 public weeklyRewardPool;
    uint256 public lastRewardDistribution;
    uint256 public constant REWARD_INTERVAL = 7 days; // Weekly rewards
    
    struct Question {
        string questionText;
        string[4] options;
        uint8 correctAnswer; // 0-3
        string category;
        bool isActive;
    }
    
    struct Player {
        string username;
        uint256 totalScore;
        uint256 gamesPlayed;
        uint256 correctAnswers;
        uint256 totalQuestions;
        uint256 bestScore; // Best score in a single session
        uint256 lastPlayedTime;
        bool isRegistered;
    }
    
    struct GameSession {
        address player;
        uint256[] questionIds;
        uint8[] answers;
        uint8 correctCount;
        uint256 score; // Includes speed bonus
        uint256 reward; // Claimable reward amount
        uint256 startTime;
        uint256 endTime;
        bool completed;
        bool rewardClaimed;
    }
    
    // Storage
    Question[] public questions;
    mapping(address => Player) public players;
    mapping(string => address) public usernameToAddress;
    mapping(address => GameSession[]) public playerSessions;
    mapping(address => uint256) public pendingRewards; // Unclaimed rewards
    
    // Leaderboard (sorted by total score)
    address[] public leaderboard;
    
    // VRF Request tracking
    mapping(uint256 => address) public vrfRequestToPlayer;
    mapping(uint256 => uint256) public vrfRequestToSessionId;
    
    // Events
    event QuestionAdded(uint256 indexed questionId, string category);
    event PlayerRegistered(address indexed player, string username);
    event UsernameUpdated(address indexed player, string oldUsername, string newUsername);
    event GameStarted(address indexed player, uint256 sessionId, uint256 requestId);
    event QuestionsAssigned(address indexed player, uint256 sessionId, uint256[] questionIds);
    event GameCompleted(address indexed player, uint256 sessionId, uint256 score, uint8 correctCount, uint256 reward);
    event RewardClaimed(address indexed player, uint256 amount);
    event LeaderboardUpdated(address indexed player, uint256 newRank, uint256 totalScore);
    event WeeklyRewardsDistributed(uint256 totalAmount, uint256 timestamp);
    
    constructor(
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash
    ) Ownable(msg.sender) VRFConsumerBaseV2(_vrfCoordinator) payable {
        if (_vrfCoordinator == address(0)) revert InvalidVRFCoordinator();
        
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        lastRewardDistribution = block.timestamp;
    }
    
    // ============ PLAYER REGISTRATION ============
    
    /**
     * @dev Register a username (required before playing)
     */
    function registerUsername(string memory _username) external {
        require(!players[msg.sender].isRegistered, "Already registered");
        require(bytes(_username).length >= 3 && bytes(_username).length <= 20, "Username must be 3-20 characters");
        require(usernameToAddress[_username] == address(0), "Username already taken");
        require(_isValidUsername(_username), "Invalid username format");
        
        players[msg.sender].username = _username;
        players[msg.sender].isRegistered = true;
        usernameToAddress[_username] = msg.sender;
        
        emit PlayerRegistered(msg.sender, _username);
    }
    
    /**
     * @dev Update username (costs 0.001 ETH to prevent spam)
     */
    function updateUsername(string memory _newUsername) external payable nonReentrant {
        require(players[msg.sender].isRegistered, "Not registered");
        require(bytes(_newUsername).length >= 3 && bytes(_newUsername).length <= 20, "Username must be 3-20 characters");
        require(usernameToAddress[_newUsername] == address(0), "Username already taken");
        require(_isValidUsername(_newUsername), "Invalid username format");
        require(msg.value >= 0.001 * 10**18, "Insufficient fee");
        
        string memory oldUsername = players[msg.sender].username;
        delete usernameToAddress[oldUsername];
        
        players[msg.sender].username = _newUsername;
        usernameToAddress[_newUsername] = msg.sender;
        
        weeklyRewardPool += msg.value; // Add fee to weekly reward pool
        
        emit UsernameUpdated(msg.sender, oldUsername, _newUsername);
    }
    
    /**
     * @dev Validate username format (alphanumeric and underscore only)
     */
    function _isValidUsername(string memory _username) internal pure returns (bool) {
        bytes memory b = bytes(_username);
        for (uint i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            if (!(
                (char >= 0x30 && char <= 0x39) || // 0-9
                (char >= 0x41 && char <= 0x5A) || // A-Z
                (char >= 0x61 && char <= 0x7A) || // a-z
                (char == 0x5F)                     // _
            )) {
                return false;
            }
        }
        return true;
    }
    
    // ============ QUESTION MANAGEMENT ============
    
    /**
     * @dev Add a new question (owner only)
     */
    function addQuestion(
        string memory _questionText,
        string[4] memory _options,
        uint8 _correctAnswer,
        string memory _category
    ) external onlyOwner {
        require(_correctAnswer < 4, "Invalid correct answer");
        require(bytes(_questionText).length > 0, "Question text required");
        
        questions.push(Question({
            questionText: _questionText,
            options: _options,
            correctAnswer: _correctAnswer,
            category: _category,
            isActive: true
        }));
        
        emit QuestionAdded(questions.length - 1, _category);
    }
    
    /**
     * @dev Batch add questions (owner only)
     */
    function addQuestions(
        string[] memory _questionTexts,
        string[4][] memory _options,
        uint8[] memory _correctAnswers,
        string[] memory _categories
    ) external onlyOwner {
        require(_questionTexts.length == _options.length, "Length mismatch");
        require(_questionTexts.length == _correctAnswers.length, "Length mismatch");
        require(_questionTexts.length == _categories.length, "Length mismatch");
        
        for (uint256 i = 0; i < _questionTexts.length; i++) {
            require(_correctAnswers[i] < 4, "Invalid correct answer");
            require(bytes(_questionTexts[i]).length > 0, "Question text required");
            
            questions.push(Question({
                questionText: _questionTexts[i],
                options: _options[i],
                correctAnswer: _correctAnswers[i],
                category: _categories[i],
                isActive: true
            }));
            
            emit QuestionAdded(questions.length - 1, _categories[i]);
        }
    }
    
    /**
     * @dev Update existing question (owner only)
     */
    function updateQuestion(
        uint256 _questionId,
        string memory _questionText,
        string[4] memory _options,
        uint8 _correctAnswer,
        string memory _category,
        bool _isActive
    ) external onlyOwner {
        require(_questionId < questions.length, "Invalid question ID");
        require(_correctAnswer < 4, "Invalid correct answer");
        
        Question storage q = questions[_questionId];
        q.questionText = _questionText;
        q.options = _options;
        q.correctAnswer = _correctAnswer;
        q.category = _category;
        q.isActive = _isActive;
    }
    
    // ============ GAMEPLAY ============
    
    /**
     * @dev Start a new game session (FREE - no payment required)
     */
    function startGame() external nonReentrant returns (uint256 sessionId) {
        require(players[msg.sender].isRegistered, "Must register username first");
        require(questions.length >= QUESTIONS_PER_SESSION, "Not enough questions");
        
        // Create new session
        sessionId = playerSessions[msg.sender].length;
        playerSessions[msg.sender].push(GameSession({
            player: msg.sender,
            questionIds: new uint256[](0),
            answers: new uint8[](0),
            correctCount: 0,
            score: 0,
            reward: 0,
            startTime: block.timestamp,
            endTime: 0,
            completed: false,
            rewardClaimed: false
        }));
        
        players[msg.sender].lastPlayedTime = block.timestamp;
        
        // Request random questions from Chainlink VRF
        uint256 requestId = vrfCoordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        
        vrfRequestToPlayer[requestId] = msg.sender;
        vrfRequestToSessionId[requestId] = sessionId;
        
        emit GameStarted(msg.sender, sessionId, requestId);
    }
    
    /**
     * @dev Chainlink VRF callback - assigns random questions to player
     */
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address player = vrfRequestToPlayer[requestId];
        uint256 sessionId = vrfRequestToSessionId[requestId];
        
        require(player != address(0), "Invalid request");
        require(sessionId < playerSessions[player].length, "Invalid session");
        
        GameSession storage session = playerSessions[player][sessionId];
        
        // Select random questions
        uint256[] memory selectedQuestions = new uint256[](QUESTIONS_PER_SESSION);
        uint256 activeQuestionCount = _getActiveQuestionCount();
        
        require(activeQuestionCount >= QUESTIONS_PER_SESSION, "Not enough active questions");
        
        bool[] memory used = new bool[](activeQuestionCount);
        
        for (uint256 i = 0; i < QUESTIONS_PER_SESSION; i++) {
            uint256 randomIndex = randomWords[i] % activeQuestionCount;
            
            // Simple duplicate prevention
            uint256 attempts = 0;
            while (used[randomIndex] && attempts < 20) {
                randomIndex = (randomIndex + 1) % activeQuestionCount;
                attempts++;
            }
            
            used[randomIndex] = true;
            selectedQuestions[i] = _getActiveQuestionAtIndex(randomIndex);
        }
        
        session.questionIds = selectedQuestions;
        session.startTime = block.timestamp; // Reset start time when questions are assigned
        
        emit QuestionsAssigned(player, sessionId, selectedQuestions);
    }
    
    /**
     * @dev Submit answers and complete game
     */
    function submitAnswers(uint256 _sessionId, uint8[] calldata _answers) external nonReentrant {
        require(_sessionId < playerSessions[msg.sender].length, "Invalid session");
        GameSession storage session = playerSessions[msg.sender][_sessionId];
        
        require(!session.completed, "Already completed");
        require(_answers.length == QUESTIONS_PER_SESSION, "Invalid answer count");
        require(session.questionIds.length == QUESTIONS_PER_SESSION, "Questions not assigned yet");
        require(block.timestamp <= session.startTime + TIME_LIMIT, "Time expired");
        
        // Calculate score
        uint8 correctCount = 0;
        for (uint256 i = 0; i < QUESTIONS_PER_SESSION; i++) {
            if (_answers[i] == questions[session.questionIds[i]].correctAnswer) {
                correctCount++;
            }
        }
        
        // Calculate time bonus (faster = more bonus)
        uint256 timeTaken = block.timestamp - session.startTime;
        uint256 speedBonus = _calculateSpeedBonus(timeTaken);
        
        // Total score = (correct answers * points) + speed bonus
        uint256 totalScore = (correctCount * POINTS_PER_CORRECT_ANSWER) + speedBonus;
        
        // Calculate CELO/cUSD reward
        uint256 reward = _calculateReward(correctCount, speedBonus);
        
        // Update session
        session.answers = _answers;
        session.correctCount = correctCount;
        session.score = totalScore;
        session.reward = reward;
        session.endTime = block.timestamp;
        session.completed = true;
        session.rewardClaimed = false;
        
        // Update player stats
        Player storage player = players[msg.sender];
        player.totalScore += totalScore;
        player.gamesPlayed++;
        player.correctAnswers += correctCount;
        player.totalQuestions += QUESTIONS_PER_SESSION;
        
        if (totalScore > player.bestScore) {
            player.bestScore = totalScore;
        }
        
        // Add reward to pending (claimable)
        if (reward > 0) {
            pendingRewards[msg.sender] += reward;
        }
        
        // Update leaderboard
        _updateLeaderboard(msg.sender);
        
        emit GameCompleted(msg.sender, _sessionId, totalScore, correctCount, reward);
    }
    
    /**
     * @dev Calculate speed bonus (faster completion = higher bonus)
     */
    function _calculateSpeedBonus(uint256 _timeTaken) internal pure returns (uint256) {
        if (_timeTaken >= TIME_LIMIT) return 0;
        
        // Linear bonus: 5 points for instant, 0 points at time limit
        uint256 timeRemaining = TIME_LIMIT - _timeTaken;
        return (timeRemaining * SPEED_BONUS_MAX) / TIME_LIMIT;
    }
    
    /**
     * @dev Calculate ETH reward based on performance
     */
    function _calculateReward(uint8 _correctCount, uint256 _speedBonus) internal pure returns (uint256) {
        // Base reward: 0.001 ETH per correct answer
        uint256 baseReward = _correctCount * REWARD_PER_CORRECT_ANSWER;

        // Perfect score bonus: 0.005 ETH for 10/10
        uint256 perfectBonus = 0;
        if (_correctCount == QUESTIONS_PER_SESSION) {
            perfectBonus = PERFECT_SCORE_BONUS;
        }

        // Speed bonus reward: up to 0.002 ETH
        uint256 speedReward = (_speedBonus * SPEED_BONUS_REWARD) / SPEED_BONUS_MAX;

        return baseReward + perfectBonus + speedReward;
    }

    /**
     * @dev Claim all pending rewards (in ETH)
     */
    function claimRewards() external nonReentrant {
        uint256 amount = pendingRewards[msg.sender];
        if (amount == 0) revert NoRewardsToClaim();
        
        pendingRewards[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
        
        emit RewardClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Claim rewards from specific sessions (in ETH)
     */
    function claimSessionRewards(uint256[] calldata _sessionIds) external nonReentrant {
        uint256 totalReward = 0;
        
        for (uint256 i = 0; i < _sessionIds.length; i++) {
            uint256 sessionId = _sessionIds[i];
            require(sessionId < playerSessions[msg.sender].length, "Invalid session");
            
            GameSession storage session = playerSessions[msg.sender][sessionId];
            require(session.completed, "Session not completed");
            require(!session.rewardClaimed, "Reward already claimed");
            
            session.rewardClaimed = true;
            totalReward += session.reward;
        }
        
        if (totalReward == 0) revert NoRewardsToClaim();
        
        // Deduct from pending
        pendingRewards[msg.sender] -= totalReward;
        
        (bool success, ) = payable(msg.sender).call{value: totalReward}("");
        if (!success) revert TransferFailed();
        
        emit RewardClaimed(msg.sender, totalReward);
    }
    
    // ============ LEADERBOARD ============
    
    /**
     * @dev Update leaderboard after game completion
     */
    function _updateLeaderboard(address _player) internal {
        // Remove player from current position if exists
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == _player) {
                // Shift elements
                for (uint256 j = i; j < leaderboard.length - 1; j++) {
                    leaderboard[j] = leaderboard[j + 1];
                }
                leaderboard.pop();
                break;
            }
        }
        
        // Find correct position and insert
        uint256 playerScore = players[_player].totalScore;
        uint256 insertIndex = leaderboard.length;
        
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (playerScore > players[leaderboard[i]].totalScore) {
                insertIndex = i;
                break;
            }
        }
        
        // Insert at position
        leaderboard.push(address(0));
        for (uint256 i = leaderboard.length - 1; i > insertIndex; i--) {
            leaderboard[i] = leaderboard[i - 1];
        }
        leaderboard[insertIndex] = _player;
        
        // Keep only top LEADERBOARD_SIZE
        if (leaderboard.length > LEADERBOARD_SIZE) {
            leaderboard.pop();
        }
        
        emit LeaderboardUpdated(_player, insertIndex + 1, playerScore);
    }
    
    /**
     * @dev Fund the contract with ETH for rewards (owner only)
     */
    function fundRewards() external payable onlyOwner {
        require(msg.value > 0, "Must send ETH");
        weeklyRewardPool += msg.value;
    }
    
    /**
     * @dev Distribute weekly rewards to top players (owner only)
     */
    function distributeRewards() external onlyOwner nonReentrant {
        if (block.timestamp < lastRewardDistribution + REWARD_INTERVAL) revert TooEarlyForDistribution();
        if (weeklyRewardPool == 0) revert NoRewardsToDistribute();
        if (leaderboard.length == 0) revert NoPlayers();
        
        uint256 totalRewards = weeklyRewardPool;
        
        // Top 10 get rewards
        uint256 rewardCount = leaderboard.length < 10 ? leaderboard.length : 10;
        
        // Reward distribution: 40%, 25%, 15%, 10%, 5%, 2.5%, 1%, 0.5%, 0.5%, 0.5%
        uint256[] memory percentages = new uint256[](10);
        percentages[0] = 40;
        percentages[1] = 25;
        percentages[2] = 15;
        percentages[3] = 10;
        percentages[4] = 5;
        percentages[5] = 25; // 2.5%
        percentages[6] = 10; // 1%
        percentages[7] = 5;  // 0.5%
        percentages[8] = 5;  // 0.5%
        percentages[9] = 5;  // 0.5%
        
        for (uint256 i = 0; i < rewardCount; i++) {
            uint256 reward;
            if (i < 5) {
                reward = (totalRewards * percentages[i]) / 100;
            } else {
                reward = (totalRewards * percentages[i]) / 1000;
            }
            
            (bool success, ) = payable(leaderboard[i]).call{value: reward}("");
            if (!success) revert TransferFailed();
        }
        
        weeklyRewardPool = 0;
        lastRewardDistribution = block.timestamp;
        
        emit WeeklyRewardsDistributed(totalRewards, block.timestamp);
    }
    
    /**
     * @dev Get contract balance (for monitoring)
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        if (_amount > address(this).balance) revert InsufficientBalance();
        (bool success, ) = payable(owner()).call{value: _amount}("");
        if (!success) revert TransferFailed();
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {
        weeklyRewardPool += msg.value;
    }
    
    // ============ HELPER FUNCTIONS ============
    
    function _getActiveQuestionCount() internal view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < questions.length; i++) {
            if (questions[i].isActive) count++;
        }
        return count;
    }
    
    function _getActiveQuestionAtIndex(uint256 _index) internal view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < questions.length; i++) {
            if (questions[i].isActive) {
                if (count == _index) return i;
                count++;
            }
        }
        revert("Index out of bounds");
    }
    
    function _getPlayerRank(address _player) internal view returns (uint256) {
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == _player) {
                return i + 1;
            }
        }
        return 0; // Not on leaderboard
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getQuestion(uint256 _questionId) external view returns (
        string memory questionText,
        string[4] memory options,
        string memory category
    ) {
        require(_questionId < questions.length, "Invalid question ID");
        Question storage q = questions[_questionId];
        return (q.questionText, q.options, q.category);
    }
    
    function getPlayerInfo(address _player) external view returns (
        string memory username,
        uint256 totalScore,
        uint256 gamesPlayed,
        uint256 correctAnswers,
        uint256 totalQuestions,
        uint256 bestScore,
        uint256 rank
    ) {
        Player storage p = players[_player];
        uint256 playerRank = _getPlayerRank(_player);
        
        return (
            p.username,
            p.totalScore,
            p.gamesPlayed,
            p.correctAnswers,
            p.totalQuestions,
            p.bestScore,
            playerRank
        );
    }
    
    function getSession(address _player, uint256 _sessionId) external view returns (
        uint256[] memory questionIds,
        uint8[] memory answers,
        uint8 correctCount,
        uint256 score,
        uint256 reward,
        uint256 startTime,
        uint256 endTime,
        bool completed,
        bool rewardClaimed
    ) {
        require(_sessionId < playerSessions[_player].length, "Invalid session");
        GameSession storage session = playerSessions[_player][_sessionId];
        
        return (
            session.questionIds,
            session.answers,
            session.correctCount,
            session.score,
            session.reward,
            session.startTime,
            session.endTime,
            session.completed,
            session.rewardClaimed
        );
    }
    
    function getLeaderboard(uint256 _count) external view returns (
        address[] memory addresses,
        string[] memory usernames,
        uint256[] memory scores
    ) {
        uint256 count = _count > leaderboard.length ? leaderboard.length : _count;
        
        addresses = new address[](count);
        usernames = new string[](count);
        scores = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            addresses[i] = leaderboard[i];
            usernames[i] = players[leaderboard[i]].username;
            scores[i] = players[leaderboard[i]].totalScore;
        }
        
        return (addresses, usernames, scores);
    }
    
    function getQuestionCount() external view returns (uint256) {
        return questions.length;
    }
    
    function isUsernameAvailable(string memory _username) external view returns (bool) {
        return usernameToAddress[_username] == address(0);
    }
    
    function getPlayerSessionCount(address _player) external view returns (uint256) {
        return playerSessions[_player].length;
    }
    
    function getPendingRewards(address _player) external view returns (uint256) {
        return pendingRewards[_player];
    }
    
    function getUnclaimedSessions(address _player) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count unclaimed sessions
        for (uint256 i = 0; i < playerSessions[_player].length; i++) {
            if (playerSessions[_player][i].completed && !playerSessions[_player][i].rewardClaimed) {
                count++;
            }
        }
        
        // Build array of unclaimed session IDs
        uint256[] memory unclaimedIds = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < playerSessions[_player].length; i++) {
            if (playerSessions[_player][i].completed && !playerSessions[_player][i].rewardClaimed) {
                unclaimedIds[index] = i;
                index++;
            }
        }
        
        return unclaimedIds;
    }
}
