// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TriviaGame.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TriviaGameTest is Test {
    TriviaGame public triviaGame;
    MockERC20 public mockCUSD;
    
    address public owner = address(0x1);
    address public player1 = address(0x2);
    address public player2 = address(0x3);
    address public player3 = address(0x4);
    
    function setUp() public {
        vm.startPrank(owner);
        mockCUSD = new MockERC20();
        triviaGame = new TriviaGame(address(mockCUSD));
        
        // Create a game
        triviaGame.createGame("Test Game", 3);
        
        // Fund players with cUSD
        uint256 playerFunds = 10 * 10**18; // 10 cUSD each
        mockCUSD.transfer(player1, playerFunds);
        mockCUSD.transfer(player2, playerFunds);
        mockCUSD.transfer(player3, playerFunds);
        
        // Approve the game contract to spend players' tokens
        vm.stopPrank();
        
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
    
    function test_CreateGame() public view {
        // Game 1 was created in setUp
        assertEq(triviaGame.getGameId(1), 1);
        assertEq(triviaGame.getGameEntryFee(1), 0.1 * 10**18);
        assertEq(triviaGame.getGamePrizePool(1), 0);
        assertEq(triviaGame.getGameMaxPlayers(1), 3);
        assertEq(uint256(triviaGame.getGameState(1)), 0); // GameState.Open
    }
    
    function test_JoinGame() public {
        // Player1 joins game 1
        vm.startPrank(player1);
        triviaGame.joinGame(1);
        
        // Check that player1 is in the game
        address[] memory players = triviaGame.getPlayers(1);
        assertEq(players.length, 1);
        assertEq(players[0], player1);
        
        // Check that player1's balance decreased by the entry fee
        assertEq(mockCUSD.balanceOf(player1), (10 * 10**18) - (0.1 * 10**18));
        
        // Check that the prize pool increased
        assertEq(triviaGame.getGamePrizePool(1), 0.1 * 10**18);
    }
    
    function test_StartAndCompleteGame() public {
        // Players join the game
        vm.startPrank(player1);
        triviaGame.joinGame(1);
        vm.stopPrank();
        
        vm.startPrank(player2);
        triviaGame.joinGame(1);
        vm.stopPrank();
        
        vm.startPrank(player3);
        triviaGame.joinGame(1);
        vm.stopPrank();
        
        // Start the game (as owner)
        vm.startPrank(owner);
        triviaGame.startGame(1);
        
        // Complete the game with winners
        address[] memory winners = new address[](3);
        winners[0] = player1; // 1st place
        winners[1] = player2; // 2nd place
        winners[2] = player3; // 3rd place
        
        triviaGame.completeGame(1, winners);
        
        // Check game state
        assertEq(uint256(triviaGame.getGameState(1)), 2); // GameState.Completed
        
        // Check winners
        address[] memory gameWinners = triviaGame.getWinners(1);
        assertEq(gameWinners.length, 3);
        assertEq(gameWinners[0], player1);
        assertEq(gameWinners[1], player2);
        assertEq(gameWinners[2], player3);
        
        // Check prize distribution (80% to 1st, 15% to 2nd, 5% to 3rd)
        uint256 totalPrize = 3 * 0.1 * 10**18; // 3 players * 0.1 cUSD each
        uint256 firstPrize = (totalPrize * 80) / 100;
        uint256 secondPrize = (totalPrize * 15) / 100;
        uint256 thirdPrize = (totalPrize * 5) / 100;
        
        // Check player balances
        assertEq(mockCUSD.balanceOf(player1), (10 * 10**18) - (0.1 * 10**18) + firstPrize);
        assertEq(mockCUSD.balanceOf(player2), (10 * 10**18) - (0.1 * 10**18) + secondPrize);
        assertEq(mockCUSD.balanceOf(player3), (10 * 10**18) - (0.1 * 10**18) + thirdPrize);
    }
    
    function test_CancelGame() public {
        // Get initial balance before joining
        uint256 initialBalance = mockCUSD.balanceOf(player1);
        
        // Player1 joins the game
        vm.startPrank(player1);
        triviaGame.joinGame(1);
        vm.stopPrank();
        
        // Cancel the game (as owner)
        vm.prank(owner);
        triviaGame.cancelGame(1);
        
        // Check that player1 got their entry fee back
        uint256 finalBalance = mockCUSD.balanceOf(player1);
        assertEq(finalBalance, initialBalance);
        
        // Check game state
        assertEq(uint256(triviaGame.getGameState(1)), 3); // GameState.Cancelled
    }
}

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock cUSD", "mcUSD") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
