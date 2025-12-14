# Base Mainnet Deployment Plan

## URGENT: Deploy to Base Mainnet (Not Sepolia!)

**Critical Issue:** You're currently on Base Sepolia (testnet). The competition tracks activity on **Base Mainnet only**.

## Immediate Deployment Steps

### 1. Update Configuration for Base Mainnet

Add to `.env`:
```bash
# Base Mainnet
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_CHAIN_ID=8453
PRIVATE_KEY=your_private_key_here

# BaseScan API for verification
BASESCAN_API_KEY=your_basescan_api_key
```

### 2. Get Base ETH for Gas
You need ~0.05 ETH on Base Mainnet for deployments:
- Bridge from Ethereum: https://bridge.base.org
- Buy directly on Base via Coinbase

### 3. Deploy Core Contracts

Priority order:
1. **TriviaGameV2** - Your main revenue generator
2. **Faucet** (modified for mainnet - small amounts only)
3. **PredictionMarket** - Extra fee generator

### 4. Deploy Script for Base Mainnet

Create `scripts/deployMainnet.s.sol`:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/TriviaGameV2.sol";
import "../src/Faucet.sol";

contract DeployMainnet is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TriviaGameV2 with USDC on Base
        address usdcBase = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        TriviaGameV2 triviaGame = new TriviaGameV2(usdcBase);
        console.log("TriviaGameV2 deployed to:", address(triviaGame));

        // Create initial games to start generating fees
        triviaGame.createGame("Base Basics Quiz", 5); // 5 max players
        triviaGame.createGame("DeFi Fundamentals", 10);
        triviaGame.createGame("NFT Knowledge", 8);

        vm.stopBroadcast();
    }
}
```

### 5. Deploy Commands

```bash
# Compile first
forge build

# Deploy to Base Mainnet
forge script scripts/deployMainnet.s.sol:DeployMainnet \
    --rpc-url $BASE_MAINNET_RPC \
    --broadcast \
    --verify \
    --etherscan-api-key $BASESCAN_API_KEY \
    -vvvv

# Verify contracts
forge verify-contract \
    --chain-id 8453 \
    --etherscan-api-key $BASESCAN_API_KEY \
    --watch \
    <CONTRACT_ADDRESS> \
    src/TriviaGameV2.sol:TriviaGameV2
```

## Fee Generation Strategy

### Make Your Contracts Generate Fees

**Current Problem:** Your contracts don't generate enough transaction volume.

**Solution:** Implement these fee-generating mechanics:

1. **Entry Fees** (you have this)
   - Keep it low: 0.0001 ETH or $0.10 in USDC
   - Make it appealing to play

2. **Creator Fee** (ADD THIS)
   ```solidity
   uint256 public constant PLATFORM_FEE = 5; // 5% of prize pool

   function distributeRewards(uint256 gameId, address[] memory winners) {
       uint256 platformCut = (prizePool * PLATFORM_FEE) / 100;
       uint256 remainingPrize = prizePool - platformCut;
       // distribute remainingPrize to winners
   }
   ```

3. **Volume Multiplier**
   - Deploy multiple game instances
   - Each game generates separate fees
   - More games = more transactions = higher ranking

## Deployment Checklist

- [ ] Get 0.05 ETH on Base Mainnet
- [ ] Update hardhat/foundry config for Base Mainnet
- [ ] Add USDC token address for Base (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- [ ] Deploy TriviaGameV2 to mainnet
- [ ] Verify on BaseScan
- [ ] Create 5-10 different game instances
- [ ] Update frontend to point to mainnet contracts
- [ ] Test live with real transactions
- [ ] Monitor fees generated at https://basescan.org

## Post-Deployment

### Seed Initial Games
Create engaging games with low barriers to entry:
```javascript
// Create multiple games
await triviaGame.createGame("Base Basics - Easy", 10);
await triviaGame.createGame("Base Builders Trivia", 15);
await triviaGame.createGame("Crypto 101", 20);
await triviaGame.createGame("DeFi Deep Dive", 8);
await triviaGame.createGame("NFT Master", 12);
```

### Drive User Activity
- Share on Base Discord: https://discord.gg/buildonbase
- Post on Farcaster (Base's social platform)
- Share on Twitter with #BasedBuilders #BuildOnBase
- Join Base community calls

## Monitoring

Track your fee generation:
```bash
# Check contract balance
cast balance <YOUR_CONTRACT_ADDRESS> --rpc-url https://mainnet.base.org

# Check transaction count
curl "https://api.basescan.org/api?module=account&action=txlist&address=<YOUR_CONTRACT>&sort=desc&apikey=<API_KEY>"
```

## Expected Impact

**Current:** 5.15% activity (testnet doesn't count)
**After mainnet deployment:** ~15-25% activity (real transactions counted)
**After user acquisition:** 40-60% activity (if you get 50+ users/day)

**Target for Top 10:** Need ~70-85% activity level

---

**CRITICAL:** Deploy to mainnet within 48 hours. Every day counts in a monthly competition!
