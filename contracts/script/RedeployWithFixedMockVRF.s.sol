// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockVRFCoordinatorV2.sol";
import "../src/TriviaGameV2.sol";

contract RedeployWithFixedMockVRF is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("===========================================");
        console.log("Redeploying with Fixed MockVRF...");
        console.log("===========================================");
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);

        // Step 1: Deploy Improved Mock VRF Coordinator
        console.log("Step 1: Deploying Improved MockVRFCoordinatorV2...");
        MockVRFCoordinatorV2 vrfCoordinator = new MockVRFCoordinatorV2();
        console.log("MockVRFCoordinatorV2:", address(vrfCoordinator));
        console.log("");

        // Step 2: Deploy TriviaGameV2 with Improved Mock VRF
        console.log("Step 2: Deploying TriviaGameV2...");
        
        // Mock VRF configuration
        uint64 subscriptionId = 1;
        bytes32 keyHash = bytes32(uint256(1));
        
        TriviaGameV2 triviaGame = new TriviaGameV2{value: 0}(
            address(vrfCoordinator),
            subscriptionId,
            keyHash
        );

        console.log("TriviaGameV2 deployed:", address(triviaGame));
        console.log("");
        console.log("===========================================");
        console.log("DEPLOYMENT COMPLETE!");
        console.log("===========================================");
        console.log("");
        console.log("Contract Addresses:");
        console.log("-------------------");
        console.log("MockVRFCoordinatorV2:", address(vrfCoordinator));
        console.log("TriviaGameV2:", address(triviaGame));
        console.log("");
        console.log("===========================================");
        console.log("NEXT STEPS:");
        console.log("===========================================");
        console.log("1. Update frontend .env.local:");
        console.log("   NEXT_PUBLIC_TRIVIA_GAME_V2_ADDRESS=", address(triviaGame));
        console.log("   NEXT_PUBLIC_MOCK_VRF_ADDRESS=", address(vrfCoordinator));
        console.log("");
        console.log("2. Fund contract with CELO:");
        console.log("   cast send", address(triviaGame), "--value 1ether");
        console.log("");
        console.log("3. Add questions:");
        console.log("   TRIVIA_GAME_V2_ADDRESS=", address(triviaGame));
        console.log("   forge script script/AddQuestions.s.sol --broadcast");
        console.log("");
        console.log("4. Test start game - should work now!");
        console.log("===========================================");

        vm.stopBroadcast();
    }
}
