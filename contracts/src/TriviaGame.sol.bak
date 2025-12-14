// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Error codes as constants
library ErrorCodes {
    // General errors (1000-1099)
    uint256 public constant INVALID_TOKEN_ADDRESS = 1000;
    uint256 public constant ZERO_ADDRESS = 1001;
    
    // Game errors (2000-2099)
    uint256 public constant GAME_NOT_OPEN = 2000;
    uint256 public constant GAME_ALREADY_STARTED = 2001;
    uint256 public constant GAME_NOT_IN_PROGRESS = 2002;
    uint256 public constant GAME_ALREADY_JOINED = 2003;
    uint256 public constant GAME_FULL = 2004;
    uint256 public constant INVALID_WINNER_COUNT = 2005;
    
    // Token errors (3000-3099)
    uint256 public constant INSUFFICIENT_ALLOWANCE = 3000;
    uint256 public constant TOKEN_TRANSFER_FAILED = 3001;
    uint256 public constant TOKEN_APPROVAL_FAILED = 3002;
}

// Custom error types with error codes
error AppError(uint256 errorCode, string message);
error AppErrorWithInfo(uint256 errorCode, string message, bytes data);
error TokenTransferFailed(address token, address from, address to, uint256 amount);

/**
 * @title ErrorReporter
 * @dev Provides error reporting functionality with structured error codes and logging
 */
library ErrorReporter {
    event ErrorLogged(
        uint256 indexed errorCode,
        address indexed caller,
        string message,
        bytes data
    );
    
    function logError(
        uint256 errorCode,
        string memory message
    ) internal {
        emit ErrorLogged(errorCode, msg.sender, message, "");
    }
    
    function logErrorWithInfo(
        uint256 errorCode,
        string memory message,
        bytes memory data
    ) internal {
        emit ErrorLogged(errorCode, msg.sender, message, data);
    }
    
    function requireWithError(
        bool condition,
        uint256 errorCode,
        string memory message
    ) internal {
        if (!condition) {
            logError(errorCode, message);
            revert AppError(errorCode, message);
        }
    }
    
    function requireWithErrorAndInfo(
        bool condition,
        uint256 errorCode,
        string memory message,
        bytes memory data
    ) internal {
        if (!condition) {
            logErrorWithInfo(errorCode, message, data);
            revert AppErrorWithInfo(errorCode, message, data);
        }
    }
}

/**
 * @title TriviaGame
 * @dev A smart contract for managing trivia games with cUSD entry fees and rewards
 */
contract TriviaGame is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using ErrorReporter for uint256;
    
    IERC20 public immutable cUSDToken;
    uint256 public constant ENTRY_FEE = 0.1 * 10**18; // 0.1 cUSD (18 decimals)
    uint256 public constant WINNER_SHARE = 80; // 80% of the pool to the winner
    uint256 public constant SECOND_PLACE_SHARE = 15; // 15% to second place
    uint256 public constant THIRD_PLACE_SHARE = 5; // 5% to third place

    enum GameState { Open, InProgress, Completed, Cancelled }

    struct Game {
        uint256 id;
        string title;
        uint256 entryFee;
        uint256 prizePool;
        uint256 maxPlayers;
        uint256 startTime;
        uint256 endTime;
        GameState state;
        address[] players;
        address[] winners;
        mapping(address => bool) hasPlayed;
    }

    uint256 public gameCounter;
    mapping(uint256 => Game) public games;

    // Game events
    event GameCreated(uint256 indexed gameId, string title, uint256 entryFee, uint256 maxPlayers);
    event PlayerJoined(uint256 indexed gameId, address player);
    event GameStarted(uint256 indexed gameId);
    event GameCompleted(uint256 indexed gameId, address[] winners, uint256[] prizes);
    event GameCancelled(uint256 indexed gameId);
    event PrizeDistributed(uint256 indexed gameId, address winner, uint256 amount);
    
    // Token events
    event TokenApprovalChecked(address indexed token, address indexed spender, uint256 amount);
    event TokenTransferChecked(address indexed token, address indexed from, address indexed to, uint256 amount);
    
    // Error events (from ErrorReporter)
    event ErrorLogged(uint256 indexed errorCode, address indexed caller, string message, bytes data);

    /**
     * @dev Constructor sets the cUSD token address
     * @param _cUSDTokenAddress Address of the cUSD token contract
     */
    constructor(address _cUSDTokenAddress) Ownable(msg.sender) {
        ErrorReporter.requireWithError(
            _cUSDTokenAddress != address(0),
            ErrorCodes.INVALID_TOKEN_ADDRESS,
            "Invalid token address: zero address"
        );
        cUSDToken = IERC20(_cUSDTokenAddress);
    }

    /**
     * @dev Creates a new trivia game
     * @param title Title of the game
     * @param maxPlayers Maximum number of players allowed
     */
    function createGame(string memory title, uint256 maxPlayers) external onlyOwner {
        ErrorReporter.requireWithError(
            maxPlayers > 0,
            ErrorCodes.INVALID_WINNER_COUNT,
            "Max players must be greater than 0"
        );
        
        uint256 gameId = ++gameCounter;
        Game storage game = games[gameId];
        
        game.id = gameId;
        game.title = title;
        game.entryFee = ENTRY_FEE;
        game.maxPlayers = maxPlayers;
        game.state = GameState.Open;
        
        emit GameCreated(gameId, title, ENTRY_FEE, maxPlayers);
    }

    /**
     * @notice Checks if a player has approved enough tokens for the game entry fee
     * @param player Address of the player to check
     * @param amount Amount of tokens to check allowance for
     * @return bool True if player has approved enough tokens
     */
    function hasApprovedTokens(address player, uint256 amount) public view returns (bool) {
        uint256 allowance = cUSDToken.allowance(player, address(this));
        return allowance >= amount;
    }

    /**
     * @dev Internal function to safely transfer tokens with proper error handling
     */
    function _safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 amount
    ) internal {
        uint256 balanceBefore = token.balanceOf(to);
        
        try token.safeTransferFrom(from, to, amount) {
            uint256 balanceAfter = token.balanceOf(to);
            
            if (balanceAfter <= balanceBefore) {
                ErrorReporter.logErrorWithInfo(
                    ErrorCodes.TOKEN_TRANSFER_FAILED,
                    "Token transfer failed: balance did not increase",
                    abi.encode(
                        address(token),
                        from,
                        to,
                        amount,
                        balanceBefore,
                        balanceAfter
                    )
                );
                revert TokenTransferFailed(address(token), from, to, amount);
            }
            
            emit TokenTransferChecked(address(token), from, to, amount);
        } catch Error(string memory reason) {
            ErrorReporter.logErrorWithInfo(
                ErrorCodes.TOKEN_TRANSFER_FAILED,
                string(abi.encodePacked("Token transfer failed: ", reason)),
                abi.encode(address(token), from, to, amount)
            );
            revert TokenTransferFailed(address(token), from, to, amount);
        } catch (bytes memory) {
            ErrorReporter.logErrorWithInfo(
                ErrorCodes.TOKEN_TRANSFER_FAILED,
                "Token transfer failed with no reason",
                abi.encode(address(token), from, to, amount)
            );
            revert TokenTransferFailed(address(token), from, to, amount);
        }
    }

    /**
     * @dev Allows a player to join a game by paying the entry fee
     * @param gameId ID of the game to join
     */
    function joinGame(uint256 gameId) external nonReentrant {
        Game storage game = games[gameId];
        
        // Check game state
        ErrorReporter.requireWithError(
            game.state == GameState.Open,
            ErrorCodes.GAME_NOT_OPEN,
            "Game is not open for joining"
        );
        
        // Check if player already joined
        ErrorReporter.requireWithError(
            !game.hasPlayed[msg.sender],
            ErrorCodes.GAME_ALREADY_JOINED,
            "Already joined this game"
        );
        
        // Check if game is full
        ErrorReporter.requireWithError(
            game.players.length < game.maxPlayers,
            ErrorCodes.GAME_FULL,
            "Game is full"
        );
        
        // Check token approval with detailed error info
        uint256 allowance = cUSDToken.allowance(msg.sender, address(this));
        ErrorReporter.requireWithErrorAndInfo(
            allowance >= game.entryFee,
            ErrorCodes.INSUFFICIENT_ALLOWANCE,
            "Insufficient token allowance",
            abi.encode(
                msg.sender,
                address(cUSDToken),
                game.entryFee,
                allowance
            )
        );
        
        // Transfer entry fee from player to contract
        _safeTransferFrom(cUSDToken, msg.sender, address(this), game.entryFee);
        
        // Update game state
        game.players.push(msg.sender);
        game.hasPlayed[msg.sender] = true;
        game.prizePool += game.entryFee;
        
        emit PlayerJoined(gameId, msg.sender);
    }

    /**
     * @dev Starts the game (only callable by owner)
     * @param gameId ID of the game to start
     */
    function startGame(uint256 gameId) external onlyOwner {
        Game storage game = games[gameId];
        
        require(game.state == GameState.Open, "Game not in Open state");
        require(game.players.length > 0, "No players in the game");
        
        game.state = GameState.InProgress;
        game.startTime = block.timestamp;
        
        emit GameStarted(gameId);
    }

    /**
     * @dev Completes the game and distributes prizes (only callable by owner)
     * @param gameId ID of the game to complete
     * @param winners Array of winners (1st, 2nd, 3rd place)
     */
    function completeGame(uint256 gameId, address[] calldata winners) external onlyOwner {
        Game storage game = games[gameId];
        
        require(game.state == GameState.InProgress, "Game not in progress");
        require(winners.length > 0 && winners.length <= 3, "Invalid number of winners");
        
        game.state = GameState.Completed;
        game.endTime = block.timestamp;
        game.winners = winners;
        
        // Distribute prizes
        uint256[] memory prizes = new uint256[](winners.length);
        
        if (winners.length >= 1) {
            uint256 firstPrize = (game.prizePool * WINNER_SHARE) / 100;
            prizes[0] = firstPrize;
            cUSDToken.transfer(winners[0], firstPrize);
            emit PrizeDistributed(gameId, winners[0], firstPrize);
            
            if (winners.length >= 2) {
                uint256 secondPrize = (game.prizePool * SECOND_PLACE_SHARE) / 100;
                prizes[1] = secondPrize;
                cUSDToken.transfer(winners[1], secondPrize);
                emit PrizeDistributed(gameId, winners[1], secondPrize);
                
                if (winners.length >= 3) {
                    uint256 thirdPrize = (game.prizePool * THIRD_PLACE_SHARE) / 100;
                    prizes[2] = thirdPrize;
                    cUSDToken.transfer(winners[2], thirdPrize);
                    emit PrizeDistributed(gameId, winners[2], thirdPrize);
                }
            }
        }
        
        emit GameCompleted(gameId, winners, prizes);
    }

    /**
     * @dev Cancels a game and refunds all players (only callable by owner)
     * @param gameId ID of the game to cancel
     */
    function cancelGame(uint256 gameId) external onlyOwner {
        Game storage game = games[gameId];
        
        require(game.state == GameState.Open || game.state == GameState.InProgress, "Invalid game state");
        
        // Refund all players
        for (uint256 i = 0; i < game.players.length; i++) {
            address player = game.players[i];
            cUSDToken.transfer(player, game.entryFee);
        }
        
        game.state = GameState.Cancelled;
        game.endTime = block.timestamp;
        
        emit GameCancelled(gameId);
    }

    /**
     * @dev Gets the list of players in a game
     * @param gameId ID of the game
     * @return Array of player addresses
     */
    function getPlayers(uint256 gameId) external view returns (address[] memory) {
        return games[gameId].players;
    }

    /**
     * @dev Gets the list of winners in a game
     * @param gameId ID of the game
     * @return Array of winner addresses
     */
    function getWinners(uint256 gameId) external view returns (address[] memory) {
        return games[gameId].winners;
    }

    /**
     * @dev Checks if a player has joined a specific game
     * @param gameId ID of the game
     * @param player Address of the player
     * @return True if the player has joined, false otherwise
     */
    function hasPlayerJoined(uint256 gameId, address player) external view returns (bool) {
        return games[gameId].hasPlayed[player];
    }

    /**
     * @dev Get game state
     * @param gameId ID of the game
     * @return Current state of the game
     */
    function getGameState(uint256 gameId) external view returns (GameState) {
        return games[gameId].state;
    }

    /**
     * @dev Get game prize pool
     * @param gameId ID of the game
     * @return Current prize pool amount
     */
    function getGamePrizePool(uint256 gameId) external view returns (uint256) {
        return games[gameId].prizePool;
    }

    /**
     * @dev Get game entry fee
     * @param gameId ID of the game
     * @return Entry fee for the game
     */
    function getGameEntryFee(uint256 gameId) external view returns (uint256) {
        return games[gameId].entryFee;
    }

    /**
     * @dev Get game max players
     * @param gameId ID of the game
     * @return Maximum number of players allowed
     */
    function getGameMaxPlayers(uint256 gameId) external view returns (uint256) {
        return games[gameId].maxPlayers;
    }

    /**
     * @dev Get game ID
     * @param gameId ID of the game
     * @return The game ID
     */
    function getGameId(uint256 gameId) external view returns (uint256) {
        return games[gameId].id;
    }
}
