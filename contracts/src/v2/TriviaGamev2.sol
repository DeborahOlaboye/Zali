// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// -----------------------------------------------------------------------
/// Custom Errors (cheaper + safer than strings)
/// -----------------------------------------------------------------------
error ZeroAddress();
error InvalidGameState();
error GameFull();
error AlreadyJoined();
error InsufficientAllowance();
error InvalidWinnerCount();
error InvalidWinner();
error DuplicateWinner();
error NothingToRefund();

/// -----------------------------------------------------------------------
/// Trivia Game (Secure Version)
/// -----------------------------------------------------------------------
contract TriviaGame is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable cUSD;

    uint256 public constant ENTRY_FEE = 0.1 ether;

    uint256 public constant FIRST_SHARE = 80;
    uint256 public constant SECOND_SHARE = 15;
    uint256 public constant THIRD_SHARE = 5;
    uint256 private constant TOTAL_SHARE = 100;

    enum GameState {
        Open,
        InProgress,
        Completed,
        Cancelled
    }

    struct Game {
        uint256 id;
        string title;
        uint256 prizePool;
        uint256 maxPlayers;
        uint256 startTime;
        uint256 endTime;
        GameState state;
        address[] players;
        address[] winners;
        mapping(address => bool) joined;
    }

    uint256 public gameCounter;
    mapping(uint256 => Game) private games;

    /// -----------------------------------------------------------------------
    /// Events
    /// -----------------------------------------------------------------------
    event GameCreated(uint256 indexed gameId, string title, uint256 maxPlayers);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
    event GameStarted(uint256 indexed gameId);
    event GameCompleted(uint256 indexed gameId, address[] winners);
    event GameCancelled(uint256 indexed gameId);
    event PrizePaid(uint256 indexed gameId, address indexed winner, uint256 amount);
    event RefundIssued(uint256 indexed gameId, address indexed player, uint256 amount);

    /// -----------------------------------------------------------------------
    /// Constructor
    /// -----------------------------------------------------------------------
    constructor(address _cUSD) Ownable(msg.sender) {
        if (_cUSD == address(0)) revert ZeroAddress();
        cUSD = IERC20(_cUSD);
    }

    /// -----------------------------------------------------------------------
    /// Game Creation
    /// -----------------------------------------------------------------------
    function createGame(string calldata title, uint256 maxPlayers) external onlyOwner {
        if (maxPlayers == 0) revert InvalidWinnerCount();

        uint256 gameId = ++gameCounter;
        Game storage g = games[gameId];

        g.id = gameId;
        g.title = title;
        g.maxPlayers = maxPlayers;
        g.state = GameState.Open;

        emit GameCreated(gameId, title, maxPlayers);
    }

    /// -----------------------------------------------------------------------
    /// Join Game
    /// -----------------------------------------------------------------------
    function joinGame(uint256 gameId) external nonReentrant {
        Game storage g = games[gameId];

        if (g.state != GameState.Open) revert InvalidGameState();
        if (g.joined[msg.sender]) revert AlreadyJoined();
        if (g.players.length >= g.maxPlayers) revert GameFull();

        uint256 allowance = cUSD.allowance(msg.sender, address(this));
        if (allowance < ENTRY_FEE) revert InsufficientAllowance();

        cUSD.safeTransferFrom(msg.sender, address(this), ENTRY_FEE);

        g.players.push(msg.sender);
        g.joined[msg.sender] = true;
        g.prizePool += ENTRY_FEE;

        emit PlayerJoined(gameId, msg.sender);
    }

    /// -----------------------------------------------------------------------
    /// Start Game
    /// -----------------------------------------------------------------------
    function startGame(uint256 gameId) external onlyOwner {
        Game storage g = games[gameId];

        if (g.state != GameState.Open) revert InvalidGameState();
        if (g.players.length == 0) revert InvalidWinnerCount();

        g.state = GameState.InProgress;
        g.startTime = block.timestamp;

        emit GameStarted(gameId);
    }

    /// -----------------------------------------------------------------------
    /// Complete Game & Distribute Prizes
    /// -----------------------------------------------------------------------
    function completeGame(
        uint256 gameId,
        address[] calldata winners
    ) external onlyOwner nonReentrant {
        Game storage g = games[gameId];

        if (g.state != GameState.InProgress) revert InvalidGameState();
        if (winners.length == 0 || winners.length > 3) revert InvalidWinnerCount();

        // validate winners
        for (uint256 i = 0; i < winners.length; i++) {
            if (!g.joined[winners[i]]) revert InvalidWinner();
            for (uint256 j = i + 1; j < winners.length; j++) {
                if (winners[i] == winners[j]) revert DuplicateWinner();
            }
        }

        g.state = GameState.Completed;
        g.endTime = block.timestamp;
        g.winners = winners;

        uint256 pool = g.prizePool;

        if (winners.length >= 1) {
            _pay(gameId, winners[0], (pool * FIRST_SHARE) / TOTAL_SHARE);
        }
        if (winners.length >= 2) {
            _pay(gameId, winners[1], (pool * SECOND_SHARE) / TOTAL_SHARE);
        }
        if (winners.length == 3) {
            _pay(gameId, winners[2], (pool * THIRD_SHARE) / TOTAL_SHARE);
        }

        emit GameCompleted(gameId, winners);
    }

    function _pay(uint256 gameId, address to, uint256 amount) internal {
        if (amount == 0) return;
        cUSD.safeTransfer(to, amount);
        emit PrizePaid(gameId, to, amount);
    }

    /// -----------------------------------------------------------------------
    /// Cancel Game & Refund
    /// -----------------------------------------------------------------------
    function cancelGame(uint256 gameId) external onlyOwner nonReentrant {
        Game storage g = games[gameId];

        if (
            g.state != GameState.Open &&
            g.state != GameState.InProgress
        ) revert InvalidGameState();

        if (g.players.length == 0) revert NothingToRefund();

        g.state = GameState.Cancelled;
        g.endTime = block.timestamp;

        for (uint256 i = 0; i < g.players.length; i++) {
            address player = g.players[i];
            cUSD.safeTransfer(player, ENTRY_FEE);
            emit RefundIssued(gameId, player, ENTRY_FEE);
        }

        emit GameCancelled(gameId);
    }

    /// -----------------------------------------------------------------------
    /// View Helpers
    /// -----------------------------------------------------------------------
    function getPlayers(uint256 gameId) external view returns (address[] memory) {
        return games[gameId].players;
    }

    function getWinners(uint256 gameId) external view returns (address[] memory) {
        return games[gameId].winners;
    }

    function hasJoined(uint256 gameId, address player) external view returns (bool) {
        return games[gameId].joined[player];
    }

    function getGameState(uint256 gameId) external view returns (GameState) {
        return games[gameId].state;
    }

    function getPrizePool(uint256 gameId) external view returns (uint256) {
        return games[gameId].prizePool;
    }
}
