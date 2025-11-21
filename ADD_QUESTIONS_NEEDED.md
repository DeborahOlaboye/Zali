# ⚠️ Questions Need to Be Added

## Current Status

**Contract:** `0x910f5dedFb88C85B1E50797CeCeac3182ecb212d`  
**Questions:** 0  
**Required:** 10 minimum  
**Status:** ❌ Cannot start game yet  

---

## 🔍 Problem

The new TriviaGameV2 contract has **0 questions** but needs at least **10 questions** to start a game.

The add questions transaction failed due to **insufficient funds** in the deployer wallet.

---

## 💰 Wallet Status

**Deployer Address:** `0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817`  
**Current Balance:** ~0.074 CELO  
**Needed for 10 questions:** ~0.095 CELO  
**Shortfall:** ~0.021 CELO  

---

## ✅ Solutions

### Option 1: Get More CELO (Recommended)

1. **Get CELO from faucet:**
   - Visit: https://faucet.celo.org/alfajores (for Alfajores)
   - Or: https://celo.org/developers/faucet (for Sepolia)
   - Enter address: `0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817`
   - Request CELO

2. **Then add questions:**
   ```bash
   cd contracts
   TRIVIA_GAME_V2_ADDRESS=0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
   forge script script/Add10Questions.s.sol:Add10Questions \
     --rpc-url https://rpc.ankr.com/celo_sepolia \
     --broadcast \
     --legacy
   ```

### Option 2: Use Different Wallet

If you have another wallet with CELO:

1. **Export private key** from that wallet
2. **Update .env:**
   ```bash
   cd contracts
   # Edit .env file
   PRIVATE_KEY=your_other_wallet_private_key
   ```
3. **Add questions:**
   ```bash
   TRIVIA_GAME_V2_ADDRESS=0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
   forge script script/Add10Questions.s.sol:Add10Questions \
     --rpc-url https://rpc.ankr.com/celo_sepolia \
     --broadcast \
     --legacy
   ```

### Option 3: Add Questions Manually via Frontend

Create an admin page to add questions through the frontend (requires contract owner).

---

## 📝 Quick Add Questions Script

Once you have enough CELO, run:

```bash
cd contracts

# Check current balance
cast balance 0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817 \
  --rpc-url https://rpc.ankr.com/celo_sepolia

# Add 10 questions (minimum)
TRIVIA_GAME_V2_ADDRESS=0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
forge script script/Add10Questions.s.sol:Add10Questions \
  --rpc-url https://rpc.ankr.com/celo_sepolia \
  --broadcast \
  --legacy

# Verify questions were added
cast call 0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
  "getQuestionCount()" \
  --rpc-url https://rpc.ankr.com/celo_sepolia
```

---

## 🎯 What Questions Will Be Added

The script adds 10 essential Celo questions:

1. What is Celo?
2. What is Celo's native stablecoin?
3. What consensus mechanism does Celo use?
4. What is Celo's primary mission?
5. What makes Celo environmentally unique?
6. How does Celo enable wallet recovery?
7. What is Celo's governance token?
8. Is Celo EVM compatible?
9. What is MiniPay?
10. What backs Celo stablecoins?

---

## 🔍 Verify Questions

After adding, verify:

```bash
# Check question count
cast call 0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
  "getQuestionCount()" \
  --rpc-url https://rpc.ankr.com/celo_sepolia

# Should return: 0x000000000000000000000000000000000000000000000000000000000000000a (10 in hex)
```

---

## 📊 Gas Costs

| Action | Gas Cost (approx) |
|--------|------------------|
| Add 1 question | ~0.009 CELO |
| Add 10 questions | ~0.095 CELO |
| Add 20 questions | ~0.165 CELO |

---

## 🆘 Alternative: Use Cast to Add Questions

If you prefer, you can add questions one by one using cast:

```bash
# Add question 1
cast send 0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
  "addQuestion(string,string[4],uint8,string)" \
  "What is Celo?" \
  '["A mobile-first blockchain platform","A cryptocurrency exchange","A digital wallet app","A mining hardware company"]' \
  0 \
  "Basics" \
  --rpc-url https://rpc.ankr.com/celo_sepolia \
  --private-key YOUR_PRIVATE_KEY \
  --legacy

# Repeat for other questions...
```

---

## ✅ Once Questions Are Added

After successfully adding questions:

1. **Verify count:**
   ```bash
   cast call 0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
     "getQuestionCount()" \
     --rpc-url https://rpc.ankr.com/celo_sepolia
   ```

2. **Test start game:**
   - Go to frontend
   - Navigate to `/play`
   - Click "Start Playing (FREE)"
   - Should work! ✅

---

## 📚 Files Created

- ✅ `contracts/script/Add10Questions.s.sol` - Script to add 10 questions
- ✅ `ADD_QUESTIONS_NEEDED.md` - This file

---

## 🎯 Summary

**Problem:** Contract has 0 questions, needs 10 minimum  
**Cause:** Insufficient CELO for gas fees  
**Solution:** Get more CELO and run Add10Questions script  
**Cost:** ~0.095 CELO  

**Steps:**
1. Get CELO from faucet or another wallet
2. Run `Add10Questions.s.sol` script
3. Verify 10 questions added
4. Start playing!

---

## 💡 Quick Fix

**Fastest solution:**

1. Visit Celo faucet: https://faucet.celo.org
2. Request CELO for: `0x1Ff9eA9F062C31cfF19Ade558E34894f07Cf7817`
3. Wait for CELO to arrive
4. Run:
   ```bash
   cd contracts
   TRIVIA_GAME_V2_ADDRESS=0x910f5dedFb88C85B1E50797CeCeac3182ecb212d \
   forge script script/Add10Questions.s.sol:Add10Questions \
     --rpc-url https://rpc.ankr.com/celo_sepolia \
     --broadcast \
     --legacy
   ```
5. Done! ✅

**Then you can start playing the game! 🎮**
