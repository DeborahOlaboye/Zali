# 🚀 QUICKSTART: Deploy to Base Mainnet RIGHT NOW

## Step 1: Get Base ETH (15 minutes)

You need ETH on Base Mainnet for gas fees. Choose ONE method:

### Option A: Bridge from Ethereum (Fastest if you have ETH)
1. Go to https://bridge.base.org
2. Connect your wallet
3. Bridge 0.05 ETH from Ethereum to Base
4. Wait 7 minutes for confirmation
5. ✅ Done!

### Option B: Buy on Coinbase (Easiest)
1. Buy ETH on Coinbase
2. Send to your wallet on Base network
3. ✅ Done!

### Option C: Use a DEX
1. Buy ETH on any exchange
2. Bridge via https://app.uniswap.org (select Base network)
3. ✅ Done!

**Verify you have Base ETH:**
```bash
cast balance YOUR_ADDRESS --rpc-url https://mainnet.base.org
```

---

## Step 2: Set Up Environment (2 minutes)

```bash
cd contracts

# Create .env file
cp .env.example .env

# Edit .env and add:
# 1. Your PRIVATE_KEY (from MetaMask: Settings > Security & Privacy > Show private key)
# 2. Your BASESCAN_API_KEY (get from https://basescan.org/myapikey)

# Example .env:
# PRIVATE_KEY=0xabc123...
# BASESCAN_API_KEY=YourBaseScanAPIKey
```

**⚠️ SECURITY WARNING:** Never commit .env to git!

```bash
# Add .env to .gitignore
echo ".env" >> .gitignore
```

---

## Step 3: Deploy to Mainnet (5 minutes)

### Option A: Deploy SimpleTriviaGame (RECOMMENDED - Fastest)

```bash
# Compile contracts
forge build

# Deploy to Base Mainnet
forge script script/DeploySimpleMainnet.s.sol:DeploySimpleMainnet \
    --rpc-url https://mainnet.base.org \
    --broadcast \
    --verify \
    --etherscan-api-key $BASESCAN_API_KEY \
    -vvvv
```

### Option B: Deploy TriviaGameV2 (More Complex)

```bash
forge script script/DeployMainnet.s.sol:DeployMainnet \
    --rpc-url https://mainnet.base.org \
    --broadcast \
    --verify \
    --etherscan-api-key $BASESCAN_API_KEY \
    -vvvv
```

**Save the contract address from the output!**

---

## Step 4: Verify Contract (2 minutes)

If auto-verify failed, manually verify:

```bash
# For SimpleTriviaGame
forge verify-contract \
    --chain-id 8453 \
    --etherscan-api-key $BASESCAN_API_KEY \
    --watch \
    YOUR_CONTRACT_ADDRESS \
    src/SimpleTriviaGame.sol:SimpleTriviaGame \
    --constructor-args $(cast abi-encode "constructor(address)" 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
```

Check verification at: https://basescan.org/address/YOUR_CONTRACT_ADDRESS

---

## Step 5: Fund the Contract (5 minutes)

Your contract needs USDC to pay rewards.

### Get USDC on Base:
1. Go to https://app.uniswap.org
2. Connect wallet (make sure you're on Base network)
3. Swap 0.01 ETH → USDC (will get ~$40 USDC)
4. Approve spending
5. Complete swap

### Transfer USDC to Contract:

**IMPORTANT:** Use the USDC contract address: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

```bash
# Transfer 10 USDC to your game contract
cast send 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 \
    "transfer(address,uint256)" \
    YOUR_GAME_CONTRACT_ADDRESS \
    10000000 \
    --rpc-url https://mainnet.base.org \
    --private-key $PRIVATE_KEY

# Verify contract has USDC
cast call 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 \
    "balanceOf(address)(uint256)" \
    YOUR_GAME_CONTRACT_ADDRESS \
    --rpc-url https://mainnet.base.org
```

---

## Step 6: Update Frontend (5 minutes)

```bash
cd ../frontend

# Create/edit .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SIMPLE_GAME_ADDRESS=YOUR_CONTRACT_ADDRESS
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
NEXT_PUBLIC_NETWORK=base
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
EOF

# Test locally
npm run dev
```

Visit http://localhost:3000 and test!

---

## Step 7: Make Repo Public (1 minute)

**CRITICAL FOR GITHUB TRACKING:**

1. Go to: https://github.com/YOUR_USERNAME/Zali/settings
2. Scroll to "Danger Zone"
3. Click "Change repository visibility"
4. Select "Make public"
5. Type repository name to confirm
6. ✅ Done!

---

## Step 8: Connect GitHub to Talent (2 minutes)

1. Go to https://www.tal.com/profile
2. Find "GitHub" section
3. Click "Connect"
4. Authorize Talent app
5. Verify it shows "Connected ✓"

---

## Step 9: First Commit & Push (2 minutes)

```bash
# Add deployment files
git add .
git commit -m "feat: deploy SimpleTriviaGame to Base Mainnet

- Add mainnet deployment scripts
- Configure Base Mainnet in foundry.toml
- Deploy SimpleTriviaGame with 5 initial questions
- Contract address: YOUR_CONTRACT_ADDRESS
- Verified on BaseScan: https://basescan.org/address/YOUR_CONTRACT_ADDRESS"

git push origin main
```

This counts as your first contribution! 🎉

---

## Step 10: Test Your Game (5 minutes)

1. Visit your deployed contract on BaseScan:
   https://basescan.org/address/YOUR_CONTRACT_ADDRESS

2. Go to "Read Contract"
   - Check `questions(1)` to see first question
   - Verify `usdcToken()` shows correct USDC address

3. Go to "Write Contract"
   - Connect your wallet
   - Call `submitAnswer(1, 0)` to answer question 1
   - If correct, you get USDC reward!

4. Test frontend:
   - Make sure it connects to Base Mainnet
   - Answer questions
   - Check USDC balance increases

---

## ✅ SUCCESS CHECKLIST

After completing all steps, you should have:

- [ ] SimpleTriviaGame deployed to Base Mainnet
- [ ] Contract verified on BaseScan
- [ ] Contract funded with 10 USDC
- [ ] 5 questions added to game
- [ ] Frontend updated to use mainnet
- [ ] Repo made public
- [ ] GitHub connected to Talent
- [ ] First commit pushed
- [ ] Successfully answered a question and got reward

---

## 📊 Check Your Progress

**Immediately after deployment:**
- Talent Activity: Should start tracking
- Contract page: https://basescan.org/address/YOUR_CONTRACT
- GitHub contributions: +1

**Within 24 hours:**
- Talent ranking should update
- Activity score should increase from 5.15% to 15-20%

---

## 🚨 Troubleshooting

### "Insufficient funds for gas"
- You need more ETH on Base
- Bridge more ETH using https://bridge.base.org

### "Transfer failed"
- Contract might not have USDC balance
- Fund contract with USDC (Step 5)

### "Transaction reverted"
- Wrong network? Make sure you're on Base (Chain ID: 8453)
- Wrong question ID? Questions start at ID 1, not 0
- Already answered? Each address can only answer once

### "Contract not verified"
- Run manual verification (Step 4)
- Check BaseScan API key is correct
- Wait 1-2 minutes and try again

### "Frontend not connecting"
- Clear browser cache
- Check .env.local has correct values
- Verify MetaMask is on Base network
- Try different wallet

---

## 🎯 NEXT STEPS (Priority Order)

### Today:
1. ✅ Deploy contract (DONE if you followed this guide)
2. [ ] Add 20 more questions (use `addQuestion` function)
3. [ ] Make 5-8 git commits documenting your work
4. [ ] Post on Twitter: "Just deployed my trivia game on @base! 🎮"

### Tomorrow:
1. [ ] Start building Farcaster Frame (see BASE_MINI_APP_STRATEGY.md)
2. [ ] Share game in Base Discord
3. [ ] Continue daily commits (10-15/day)

### This Week:
1. [ ] Get first 50 users
2. [ ] Deploy prediction market contract
3. [ ] Launch on Farcaster
4. [ ] Build marketing momentum

---

## 💰 Fee Generation Tips

To maximize fees and climb rankings:

1. **More Questions = More Plays**
   - Add 50-100 questions
   - Diverse categories (DeFi, NFTs, Base, crypto history)

2. **Lower Barriers**
   - Small rewards (0.01-0.1 USDC)
   - Easy questions for beginners
   - Clear instructions

3. **Marketing**
   - Share on Twitter daily
   - Post in Base Discord
   - Farcaster frames (huge multiplier!)

4. **Multiple Contracts**
   - Deploy variations (easy mode, hard mode, daily challenge)
   - Each generates separate fees
   - More contracts = higher ranking

---

## ⏱️ Time Investment Tracking

**Today:** 45 minutes total
- Setup: 15 min
- Deploy: 10 min
- Fund & test: 15 min
- GitHub setup: 5 min

**This Week:** 12-14 hours/day for top 10

---

**🎉 Congratulations! You're now LIVE on Base Mainnet!**

**Your activity should start counting within the next sync cycle (usually within 24 hours).**

**Keep pushing commits, get users, and watch your ranking climb! 🚀**
