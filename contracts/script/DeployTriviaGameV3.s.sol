// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TriviaGameV2} from "../src/TriviaGameV2.sol";

contract DeployTriviaGameV3Script is Script {
    // Mock VRF Coordinator for Celo Sepolia
    address constant MOCK_VRF_COORDINATOR = 0x20E8706C5B1e15329Eb7690d79a5E5668DD5525C;
    uint64 constant SUBSCRIPTION_ID = 1;
    bytes32 constant KEY_HASH = 0x0000000000000000000000000000000000000000000000000000000000000001;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy TriviaGameV2 with funding
        TriviaGameV2 triviaGame = new TriviaGameV2{value: 1 ether}(
            MOCK_VRF_COORDINATOR,
            SUBSCRIPTION_ID,
            KEY_HASH
        );
        
        console.log("TriviaGameV2 deployed to:", address(triviaGame));
        console.log("Contract funded with 1 CELO for rewards");
        
        vm.stopBroadcast();
    }
}