// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TriviaGameV2.sol";

contract Add10Questions is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address triviaGameAddress = vm.envAddress("TRIVIA_GAME_V2_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);

        TriviaGameV2 triviaGame = TriviaGameV2(payable(triviaGameAddress));

        console.log("Current questions:", triviaGame.getQuestionCount());
        console.log("Adding 10 essential questions...");

        // Question 1
        triviaGame.addQuestion(
            "What is Celo?",
            ["A mobile-first blockchain platform", "A cryptocurrency exchange", "A digital wallet app", "A mining hardware company"],
            0, "Basics"
        );

        // Question 2
        triviaGame.addQuestion(
            "What is Celo's native stablecoin pegged to the US Dollar?",
            ["USDT", "USDC", "cUSD", "DAI"],
            2, "Stablecoins"
        );

        // Question 3
        triviaGame.addQuestion(
            "What consensus mechanism does Celo use?",
            ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"],
            1, "Technology"
        );

        // Question 4
        triviaGame.addQuestion(
            "What is Celo's primary mission?",
            ["To create the fastest blockchain", "To build financial tools accessible to anyone with a mobile phone", "To replace all traditional banks", "To mine Bitcoin more efficiently"],
            1, "Mission"
        );

        // Question 5
        triviaGame.addQuestion(
            "What makes Celo unique in terms of environmental impact?",
            ["It uses solar power", "It is carbon negative", "It doesn't use electricity", "It plants trees"],
            1, "Sustainability"
        );

        // Question 6
        triviaGame.addQuestion(
            "How does Celo enable easy wallet recovery?",
            ["Email verification", "Phone number mapping to wallet addresses", "Fingerprint scanning", "Face recognition"],
            1, "Features"
        );

        // Question 7
        triviaGame.addQuestion(
            "What is Celo's governance token called?",
            ["CELO", "CEL", "CGOV", "CUSD"],
            0, "Tokens"
        );

        // Question 8
        triviaGame.addQuestion(
            "Is Celo compatible with Ethereum smart contracts?",
            ["No, completely different", "Yes, it's EVM compatible", "Only partially compatible", "It uses a different programming language"],
            1, "Technology"
        );

        // Question 9
        triviaGame.addQuestion(
            "What is MiniPay?",
            ["A Celo mining pool", "A mobile wallet built on Celo", "A payment gateway", "A stablecoin"],
            1, "Ecosystem"
        );

        // Question 10
        triviaGame.addQuestion(
            "What backs Celo stablecoins?",
            ["US Dollar reserves in banks", "Gold reserves", "A diversified crypto reserve", "Nothing, they are algorithmic"],
            2, "Stablecoins"
        );

        console.log("Added 10 questions successfully!");
        console.log("Total questions now:", triviaGame.getQuestionCount());

        vm.stopBroadcast();
    }
}
