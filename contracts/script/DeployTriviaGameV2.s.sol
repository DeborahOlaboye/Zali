// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TriviaGameV2} from "../src/TriviaGameV2.sol";

/**
 * @title DeployTriviaGameV2
 * @dev Deployment script for TriviaGameV2 on Base Mainnet
 * Features: username registration, leaderboard, Chainlink VRF, ETH rewards
 */
contract DeployTriviaGameV2 is Script {
    // Base Mainnet Chainlink VRF V2 Configuration
    address constant VRF_COORDINATOR = 0x271682DEB8C4E0901D1a1550aD2e64D568E69909;
    uint64 constant SUBSCRIPTION_ID = 1234; // Replace with actual subscription ID
    bytes32 constant KEY_HASH = 0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("========================================");
        console.log("DEPLOYING TriviaGameV2 to BASE MAINNET");
        console.log("========================================");
        console.log("Deployer:", deployer);
        console.log("VRF Coordinator:", VRF_COORDINATOR);
        console.log("Subscription ID:", SUBSCRIPTION_ID);
        console.log("Key Hash:", vm.toString(KEY_HASH));
        console.log("Chain ID: 8453 (Base Mainnet)");
        console.log("========================================");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy TriviaGameV2
        TriviaGameV2 game = new TriviaGameV2(
            VRF_COORDINATOR,
            SUBSCRIPTION_ID,
            KEY_HASH
        );

        console.log("\nTriviaGameV2 deployed to:", address(game));

        // Add initial questions to get started
        console.log("\nAdding initial questions...");

        // Question 1: Base blockchain
        string[4] memory options1;
        options1[0] = "Ethereum";
        options1[1] = "Solana";
        options1[2] = "Polygon";
        options1[3] = "Avalanche";
        game.addQuestion(
            "What blockchain is Base built on?",
            options1,
            0, // Ethereum is correct
            "Blockchain"
        );
        console.log("Added Question 1: What blockchain is Base built on?");

        // Question 2: Base founder
        string[4] memory options2;
        options2[0] = "Vitalik Buterin";
        options2[1] = "Brian Armstrong";
        options2[2] = "Jesse Pollak";
        options2[3] = "Sandeep Nailwal";
        game.addQuestion(
            "Who is the founder of Coinbase (Base's parent company)?",
            options2,
            1, // Brian Armstrong is correct
            "Company"
        );
        console.log("Added Question 2: Who is the founder of Coinbase?");

        // Question 3: Base L2
        string[4] memory options3;
        options3[0] = "Optimistic Rollup";
        options3[1] = "ZK Rollup";
        options3[2] = "Plasma";
        options3[3] = "Sidechain";
        game.addQuestion(
            "What type of Layer 2 scaling solution is Base?",
            options3,
            0, // Optimistic Rollup is correct
            "Technology"
        );
        console.log("Added Question 3: What type of L2 is Base?");

        // Question 4: Base gas token
        string[4] memory options4;
        options4[0] = "ETH";
        options4[1] = "MATIC";
        options4[2] = "BNB";
        options4[3] = "AVAX";
        game.addQuestion(
            "What is the native gas token on Base network?",
            options4,
            0, // ETH is correct
            "Cryptocurrency"
        );
        console.log("Added Question 4: What is Base's gas token?");

        // Question 5: Base launch
        string[4] memory options5;
        options5[0] = "2021";
        options5[1] = "2022";
        options5[2] = "2023";
        options5[3] = "2024";
        game.addQuestion(
            "In what year was Base officially launched?",
            options5,
            2, // 2023 is correct
            "History"
        );
        console.log("Added Question 5: When was Base launched?");

        console.log("\n========================================");
        console.log("DEPLOYMENT COMPLETE!");
        console.log("Contract Address:", address(game));
        console.log("Questions Added: 5");
        console.log("========================================");

        // Fund contract with initial ETH for rewards (optional)
        console.log("\nFunding contract with 0.01 ETH for initial rewards...");
        (bool success,) = address(game).call{value: 0.01 ether}("");
        if (success) {
            console.log("Contract funded with 0.01 ETH");
        } else {
            console.log("Failed to fund contract");
        }

        vm.stopBroadcast();
    }
}