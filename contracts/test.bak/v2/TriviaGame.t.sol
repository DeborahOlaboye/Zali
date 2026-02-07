// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/TriviaGame.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock cUSD token for testing
contract MockcUSD is ERC20 {
    constructor() ERC20("cUSD", "cUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract TriviaGameTest is Test {
    TriviaGame game;
    MockcUSD cUSD;

    address owner = address(0x1);
    address player1 = address(0x2);
    address player2 = address(0x3);
    address player3 = address(0x4);
    address player4 = address(0x5);

    function setUp() public {
        vm.startPrank(owner);
        cUSD = new MockcUSD();
        game = new TriviaGame(address(cUSD));
        vm.stopPrank();

        // Mint tokens to players
        cUSD.mint(player1, 100 ether);
        cUSD.mint(player2, 100 ether);
        cUSD.mint(player3, 100 ether);
        cUSD.mint(player4, 100 ether);
    }

    // -----------------------------------------------------------------------
    // Constructor Tests
    // -----------------------------------------------------------------------
    function test_ConstructorWithValidAddress() public view {
        assertEq(address(game.cUSD()), address(cUSD));
    }

    function test_ConstructorWithZeroAddress() public {
        vm.expectRevert(ZeroAddress.selector);
        new TriviaGame(address(0));
    }

    // -----------------------------------------------------------------------
    // Game Creation Tests
    // -----------------------------------------------------------------------
    function test_CreateGameAsOwner() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        assertEq(game.gameCounter(), 1);
        assertEq(game.getGameState(1), TriviaGame.GameState.Open);
    }

    function test_CreateGameWithZeroPlayers() public {
        vm.prank(owner);
        vm.expectRevert(InvalidWinnerCount.selector);
        game.createGame("Game 1", 0);
    }

    function test_CreateGameAsNonOwner() public {
        vm.prank(player1);
        vm.expectRevert();
        game.createGame("Game 1", 4);
    }

    // -----------------------------------------------------------------------
    // Join Game Tests
    // -----------------------------------------------------------------------
    function test_JoinGameSuccessfully() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        assertEq(game.hasJoined(1, player1), true);
        assertEq(game.getPlayers(1).length, 1);
        assertEq(game.getPrizePool(1), 0.1 ether);
    }

    function test_JoinGameWithoutApproval() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        vm.expectRevert(InsufficientAllowance.selector);
        game.joinGame(1);
    }

    function test_JoinGameAlreadyJoined() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.2 ether);
        game.joinGame(1);

        vm.expectRevert(AlreadyJoined.selector);
        game.joinGame(1);
    }

    function test_JoinGameWhenGameFull() public {
        vm.prank(owner);
        game.createGame("Game 1", 2);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player2);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player3);
        cUSD.approve(address(game), 0.1 ether);
        vm.expectRevert(GameFull.selector);
        game.joinGame(1);
    }

    function test_JoinGameNotOpen() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);
        game.startGame(1);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        vm.expectRevert(InvalidGameState.selector);
        game.joinGame(1);
    }

    function test_MultiplePlayersJoin() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        for (uint256 i = 0; i < 3; i++) {
            address player = address(uint160(0x2 + i));
            vm.prank(player);
            cUSD.approve(address(game), 0.1 ether);
            game.joinGame(1);
        }

        assertEq(game.getPlayers(1).length, 3);
        assertEq(game.getPrizePool(1), 0.3 ether);
    }

    // -----------------------------------------------------------------------
    // Start Game Tests
    // -----------------------------------------------------------------------
    function test_StartGameSuccessfully() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        assertEq(uint256(game.getGameState(1)), uint256(TriviaGame.GameState.InProgress));
    }

    function test_StartGameWithoutPlayers() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);
        vm.expectRevert(InvalidWinnerCount.selector);
        game.startGame(1);
    }

    function test_StartGameTwice() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);
        vm.expectRevert(InvalidGameState.selector);
        game.startGame(1);
    }

    // -----------------------------------------------------------------------
    // Complete Game Tests
    // -----------------------------------------------------------------------
    function test_CompleteGameWithOneWinner() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player2);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        address[] memory winners = new address[](1);
        winners[0] = player1;

        uint256 balanceBefore = cUSD.balanceOf(player1);
        vm.prank(owner);
        game.completeGame(1, winners);

        uint256 expectedReward = (0.2 ether * 80) / 100;
        assertEq(cUSD.balanceOf(player1), balanceBefore + expectedReward);
    }

    function test_CompleteGameWithThreeWinners() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player2);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player3);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player4);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        address[] memory winners = new address[](3);
        winners[0] = player1;
        winners[1] = player2;
        winners[2] = player3;

        uint256 pool = 0.4 ether;
        uint256 firstReward = (pool * 80) / 100;
        uint256 secondReward = (pool * 15) / 100;
        uint256 thirdReward = (pool * 5) / 100;

        vm.prank(owner);
        game.completeGame(1, winners);

        assertEq(cUSD.balanceOf(player1), 100 ether - 0.1 ether + firstReward);
        assertEq(cUSD.balanceOf(player2), 100 ether - 0.1 ether + secondReward);
        assertEq(cUSD.balanceOf(player3), 100 ether - 0.1 ether + thirdReward);
    }

    function test_CompleteGameWithInvalidWinnerCount() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        address[] memory winners = new address[](4);
        vm.prank(owner);
        vm.expectRevert(InvalidWinnerCount.selector);
        game.completeGame(1, winners);
    }

    function test_CompleteGameWithNonMember() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        address[] memory winners = new address[](1);
        winners[0] = player4;

        vm.prank(owner);
        vm.expectRevert(InvalidWinner.selector);
        game.completeGame(1, winners);
    }

    function test_CompleteGameWithDuplicateWinner() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        address[] memory winners = new address[](2);
        winners[0] = player1;
        winners[1] = player1;

        vm.prank(owner);
        vm.expectRevert(DuplicateWinner.selector);
        game.completeGame(1, winners);
    }

    // -----------------------------------------------------------------------
    // Cancel Game Tests
    // -----------------------------------------------------------------------
    function test_CancelGameAndRefund() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player2);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        uint256 balanceBefore1 = cUSD.balanceOf(player1);
        uint256 balanceBefore2 = cUSD.balanceOf(player2);

        vm.prank(owner);
        game.cancelGame(1);

        assertEq(cUSD.balanceOf(player1), balanceBefore1 + 0.1 ether);
        assertEq(cUSD.balanceOf(player2), balanceBefore2 + 0.1 ether);
        assertEq(uint256(game.getGameState(1)), uint256(TriviaGame.GameState.Cancelled));
    }

    function test_CancelGameWithNoPlayers() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(owner);
        vm.expectRevert(NothingToRefund.selector);
        game.cancelGame(1);
    }

    function test_CancelCompletedGame() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        address[] memory winners = new address[](1);
        winners[0] = player1;
        game.completeGame(1, winners);

        vm.expectRevert(InvalidGameState.selector);
        game.cancelGame(1);
    }

    // -----------------------------------------------------------------------
    // Reentrancy Tests
    // -----------------------------------------------------------------------
    function test_JoinGameReentrancyProtected() public {
        vm.prank(owner);
        game.createGame("Game 1", 2);

        vm.prank(player1);
        cUSD.approve(address(game), 0.2 ether);
        game.joinGame(1);

        vm.prank(player2);
        cUSD.approve(address(game), 0.2 ether);
        game.joinGame(1);

        assertEq(game.getPlayers(1).length, 2);
    }

    // -----------------------------------------------------------------------
    // View Functions Tests
    // -----------------------------------------------------------------------
    function test_GetPlayers() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(player2);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        address[] memory players = game.getPlayers(1);
        assertEq(players.length, 2);
        assertEq(players[0], player1);
        assertEq(players[1], player2);
    }

    function test_GetWinners() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        vm.prank(player1);
        cUSD.approve(address(game), 0.1 ether);
        game.joinGame(1);

        vm.prank(owner);
        game.startGame(1);

        address[] memory winners = new address[](1);
        winners[0] = player1;
        game.completeGame(1, winners);

        address[] memory returnedWinners = game.getWinners(1);
        assertEq(returnedWinners.length, 1);
        assertEq(returnedWinners[0], player1);
    }

    function test_PrizePoolAccumulation() public {
        vm.prank(owner);
        game.createGame("Game 1", 4);

        for (uint256 i = 0; i < 3; i++) {
            address player = address(uint160(0x2 + i));
            vm.prank(player);
            cUSD.approve(address(game), 0.1 ether);
            game.joinGame(1);
        }

        assertEq(game.getPrizePool(1), 0.3 ether);
    }
}