// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Faucet} from "../src/Faucet.sol";
import {TriviaGame} from "../src/TriviaGame.sol";

contract DeployScript is Script {
    // Celo Sepolia cUSD token address
    address constant CUSD_TOKEN = 0x765DE816845861e75A25fCA122bb6898B8B1282a;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Faucet contract
        Faucet faucet = new Faucet(CUSD_TOKEN);
        console.log("Faucet deployed to:", address(faucet));
        
        // Deploy TriviaGame contract
        TriviaGame triviaGame = new TriviaGame(CUSD_TOKEN);
        console.log("TriviaGame deployed to:", address(triviaGame));
        
        vm.stopBroadcast();
    }
}
