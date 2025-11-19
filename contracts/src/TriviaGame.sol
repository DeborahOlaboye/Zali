// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TriviaGame
 * @dev A smart contract for managing trivia games with cUSD entry fees and rewards
 */
contract TriviaGame is Ownable, ReentrancyGuard {
    IERC20 public cUSDToken;
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

    event GameCreated(uint256 indexed gameId, string title, uint256 entryFee, uint256 maxPlayers);
    event PlayerJoined(uint256 indexed gameId, address player);
    event GameStarted(uint256 indexed gameId);
    event GameCompleted(uint256 indexed gameId, address[] winners, uint256[] prizes);
    event GameCancelled(uint256 indexed gameId);
    event PrizeDistributed(uint256 indexed gameId, address winner, uint256 amount);

    /**
     * @dev Constructor sets the cUSD token address
     * @param _cUSDTokenAddress Address of the cUSD token contract
     */
    constructor(address _cUSDTokenAddress) Ownable(msg.sender) {
        require(_cUSDTokenAddress != address(0), "Invalid token address");
        cUSDToken = IERC20(_cUSDTokenAddress);
    }

    /**
     * @dev Creates a new trivia game
     * @param title Title of the game
     * @param maxPlayers Maximum number of players allowed
     */
    function createGame(string memory title, uint256 maxPlayers) external onlyOwner {
        require(maxPlayers > 0, "Max players must be greater than 0");
        
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
     * @dev Allows a player to join a game by paying the entry fee
     * @param gameId ID of the game to join
     */
    function joinGame(uint256 gameId) external nonReentrant {
        Game storage game = games[gameId];
        
        require(game.state == GameState.Open, "Game is not open for joining");
        require(!game.hasPlayed[msg.sender], "Already joined this game");
        require(game.players.length < game.maxPlayers, "Game is full");
        
        // Transfer entry fee from player to contract
        require(
            cUSDToken.transferFrom(msg.sender, address(this), game.entryFee),
            "Token transfer failed"
        );
        
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
}
