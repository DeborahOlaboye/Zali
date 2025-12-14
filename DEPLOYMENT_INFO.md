# 🚀 Zali Trivia Game - Base Mainnet Deployment

## Deployment Details

**Deployed:** December 14, 2024
**Network:** Base Mainnet (Chain ID: 8453)
**Contract:** SimpleTriviaGame

### Contract Address
```
0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d
```

### Key Information
- **BaseScan:** https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d
- **USDC Token:** 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- **Deployer:** 0x2c8D82a53f11B0E9B527a111B2f53C5D5E809806

### Initial Questions Deployed
1. What blockchain is Base built on? → Ethereum ✓
2. Who created Base? → Coinbase ✓
3. What type of Layer 2 is Base? → Optimistic Rollup ✓
4. What is the main purpose of Base? → To scale Ethereum and reduce costs ✓
5. Which stablecoin is native to Base? → USDC ✓

### Reward Structure
- Correct Answer: 0.1 USDC (100,000 with 6 decimals)
- Total Initial Rewards Available: 0.5 USDC

## Next Steps

### 1. Fund Contract (URGENT)
Contract needs USDC to pay rewards:
```bash
# Transfer 10 USDC to contract
# Go to: https://app.uniswap.org (on Base network)
# Swap ETH → USDC
# Send to: 0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d
```

### 2. Verify Contract
Get free API key: https://basescan.org/myapikey
```bash
forge verify-contract \
  --chain-id 8453 \
  --etherscan-api-key YOUR_API_KEY \
  0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d \
  src/SimpleTriviaGame.sol:SimpleTriviaGame \
  --constructor-args $(cast abi-encode 'constructor(address)' 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
```

### 3. Update Frontend
Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_SIMPLE_GAME_ADDRESS=0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_NETWORK=base
NEXT_PUBLIC_CHAIN_ID=8453
```

### 4. Add More Questions
Target: 20-50 questions for better engagement

Use the contract's `addQuestion` function via BaseScan:
https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d#writeContract

## Deployment Transaction
See full transaction details in: `broadcast/DeploySimpleMainnet.s.sol/8453/run-latest.json`

## Gas Used
- Total Gas: 2,913,596
- Cost: 0.000012635 ETH (~$0.05)

---

**STATUS: ✅ LIVE ON MAINNET**

**Your activity tracking starts NOW!** 🎯

Every transaction counts toward your Top Base Builders ranking!
