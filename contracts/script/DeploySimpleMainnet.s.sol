// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SimpleTriviaGame} from "../src/SimpleTriviaGame.sol";

/**
 * @title DeploySimpleMainnet
 * @dev Quick deployment script for SimpleTriviaGame on Base Mainnet
 * This is the FASTEST way to get on mainnet and start generating fees
 */
contract DeploySimpleMainnet is Script {
    // Base Mainnet USDC address
    address constant USDC_MAINNET = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("========================================");
        console.log("DEPLOYING SimpleTriviaGame to BASE MAINNET");
        console.log("========================================");
        console.log("Deployer:", deployer);
        console.log("USDC Address:", USDC_MAINNET);
        console.log("Chain ID: 8453 (Base Mainnet)");
        console.log("========================================");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy SimpleTriviaGame
        SimpleTriviaGame game = new SimpleTriviaGame(USDC_MAINNET);
        console.log("\nSimpleTriviaGame deployed to:", address(game));

        // Add initial questions to get started quickly
        console.log("\nAdding initial questions...");

        string[] memory options1 = new string[](4);
        options1[0] = "Ethereum";
        options1[1] = "Solana";
        options1[2] = "Polygon";
        options1[3] = "Avalanche";
        game.addQuestion(
            "What blockchain is Base built on?",
            options1,
            0, // Ethereum is correct
            100000 // 0.1 USDC reward (6 decimals)
        );
        console.log("Added Question 1: What blockchain is Base built on?");

        string[] memory options2 = new string[](4);
        options2[0] = "Vitalik Buterin";
        options2[1] = "Coinbase";
        options2[2] = "Brian Armstrong";
        options2[3] = "Jesse Pollak";
        game.addQuestion(
            "Who created Base?",
            options2,
            1, // Coinbase is correct
            100000
        );
        console.log("Added Question 2: Who created Base?");

        string[] memory options3 = new string[](4);
        options3[0] = "Proof of Work";
        options3[1] = "Proof of Stake";
        options3[2] = "Optimistic Rollup";
        options3[3] = "ZK Rollup";
        game.addQuestion(
            "What type of Layer 2 is Base?",
            options3,
            2, // Optimistic Rollup is correct
            100000
        );
        console.log("Added Question 3: What type of Layer 2 is Base?");

        string[] memory options4 = new string[](4);
        options4[0] = "To increase fees";
        options4[1] = "To make Ethereum slower";
        options4[2] = "To scale Ethereum and reduce costs";
        options4[3] = "To create a new blockchain";
        game.addQuestion(
            "What is the main purpose of Base?",
            options4,
            2, // To scale Ethereum is correct
            100000
        );
        console.log("Added Question 4: What is the main purpose of Base?");

        string[] memory options5 = new string[](4);
        options5[0] = "USDC";
        options5[1] = "USDT";
        options5[2] = "DAI";
        options5[3] = "All of the above";
        game.addQuestion(
            "Which stablecoin is native to Base?",
            options5,
            0, // USDC is correct (technically they all work, but USDC is most integrated)
            100000
        );
        console.log("Added Question 5: Which stablecoin is native to Base?");

        vm.stopBroadcast();

        console.log("\n========================================");
        console.log("DEPLOYMENT SUCCESSFUL!");
        console.log("========================================");
        console.log("\nContract Address:", address(game));
        console.log("\nIMPORTANT NEXT STEPS:");
        console.log("\n1. VERIFY ON BASESCAN:");
        console.log("   forge verify-contract \\");
        console.log("     --chain-id 8453 \\");
        console.log("     --etherscan-api-key $BASESCAN_API_KEY \\");
        console.log("     --watch \\");
        console.log("     ", address(game), "\\");
        console.log("     src/SimpleTriviaGame.sol:SimpleTriviaGame \\");
        console.log("     --constructor-args $(cast abi-encode 'constructor(address)' ", USDC_MAINNET, ")");

        console.log("\n2. FUND THE CONTRACT:");
        console.log("   Transfer USDC to contract for rewards:");
        console.log("   Contract needs: 0.5 USDC minimum (500000 with 6 decimals)");
        console.log("   Recommended: 5-10 USDC for initial prize pool");

        console.log("\n3. UPDATE FRONTEND:");
        console.log("   Add to frontend/.env.local:");
        console.log("   NEXT_PUBLIC_SIMPLE_GAME_ADDRESS=", address(game));
        console.log("   NEXT_PUBLIC_NETWORK=base");
        console.log("   NEXT_PUBLIC_CHAIN_ID=8453");

        console.log("\n4. TEST IT:");
        console.log("   Visit: https://basescan.org/address/", address(game));
        console.log("   Try answering a question from the frontend");

        console.log("\n5. ADD MORE QUESTIONS:");
        console.log("   Use the addQuestion function to add 20-50 questions");
        console.log("   More questions = more engagement = more fees!");

        console.log("\n========================================");
        console.log("Time to DOMINATE the leaderboard!");
        console.log("========================================\n");
    }
}
