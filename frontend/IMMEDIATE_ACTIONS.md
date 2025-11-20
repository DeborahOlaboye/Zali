# 🚨 IMMEDIATE ACTIONS - Start Here!

## Critical Path to Working Demo (3-4 Days)

### DAY 1: Smart Contracts (CRITICAL!)

#### Morning (4 hours)
- [ ] Set up Hardhat project
- [ ] Write TriviaGame.sol contract
- [ ] Write basic tests
- [ ] Deploy to Celo Sepolia testnet

#### Afternoon (4 hours)
- [ ] Verify contract on block explorer
- [ ] Create sample game with 5 questions
- [ ] Fund contract with test cUSD
- [ ] Test contract functions manually

**End of Day 1:** You should have a working smart contract on testnet!

---

### DAY 2: Gameplay Implementation (CRITICAL!)

#### Morning (4 hours)
- [ ] Create `/play/game/page.tsx` - Gameplay page
- [ ] Add 5 hardcoded questions
- [ ] Implement multiple choice UI
- [ ] Add timer (30 seconds)
- [ ] Add progress bar (Question X/5)

#### Afternoon (4 hours)
- [ ] Connect gameplay to smart contract
- [ ] Implement `joinGame()` function
- [ ] Implement `submitAnswers()` function
- [ ] Add loading states
- [ ] Test complete flow

**End of Day 2:** Users can actually play a game!

---

### DAY 3: Results & Mobile (IMPORTANT!)

#### Morning (3 hours)
- [ ] Create `/results/[gameId]/page.tsx`
- [ ] Show score and ranking
- [ ] Display rewards earned
- [ ] Add confetti animation (canvas-confetti)
- [ ] Add "Play Again" button

#### Afternoon (5 hours)
- [ ] Fix mobile navigation (hamburger menu)
- [ ] Simplify home page (Play Now CTA)
- [ ] Simplify play page (one featured game)
- [ ] Add auto-faucet integration
- [ ] Test on actual mobile device

**End of Day 3:** Complete working flow, mobile-friendly!

---

### DAY 4: Polish & Documentation (MUST HAVE!)

#### Morning (3 hours)
- [ ] Add error handling everywhere
- [ ] Add toast notifications
- [ ] Improve loading states
- [ ] Add live stats (prize pool, players)
- [ ] Final testing

#### Afternoon (5 hours)
- [ ] Update README with setup guide
- [ ] Add smart contract addresses
- [ ] Record 4-minute demo video
- [ ] Take screenshots
- [ ] Prepare submission materials

**End of Day 4:** Ready to submit!

---

## Quick Commands

### Setup Smart Contracts
```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Install OpenZeppelin
npm install @openzeppelin/contracts

# Compile contracts
npx hardhat compile

# Deploy to Celo Sepolia
npx hardhat run scripts/deploy.js --network celoSepolia

# Verify contract
npx hardhat verify --network celoSepolia DEPLOYED_ADDRESS "0x765DE816845861e75A25fCA122bb6898B8B1282a"
```

### Test Locally
```bash
# Start local node
npx hardhat node

# Deploy to local
npx hardhat run scripts/deploy.js --network localhost

# Run tests
npx hardhat test
```

### Frontend Development
```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Test production build
npm run start
```

---

## Files to Create/Modify

### New Files (Create These)
```
contracts/
  └── TriviaGame.sol          ← Smart contract
  
scripts/
  └── deploy.js               ← Deployment script
  
test/
  └── TriviaGame.test.js      ← Contract tests
  
src/app/
  ├── play/
  │   └── game/
  │       └── page.tsx        ← Gameplay page
  └── results/
      └── [gameId]/
          └── page.tsx        ← Results page
          
hardhat.config.js             ← Hardhat configuration
```

### Files to Modify
```
src/app/page.tsx              ← Simplify home page
src/app/play/page.tsx         ← Simplify to one game
src/components/Navbar.tsx     ← Add mobile menu
src/config/contracts.ts       ← Add TriviaGame contract
.env.local                    ← Add contract addresses
README.md                     ← Update documentation
```

---

## Environment Variables Needed

Create `.env.local`:
```bash
# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Smart Contract Addresses (after deployment)
NEXT_PUBLIC_TRIVIA_GAME_ADDRESS=0x...
NEXT_PUBLIC_FAUCET_ADDRESS=0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d
NEXT_PUBLIC_CUSD_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a

# Network
NEXT_PUBLIC_CHAIN_ID=11142220
```

---

## Hardhat Configuration

Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    celoSepolia: {
      url: "https://rpc.ankr.com/celo_sepolia",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11142220,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 42220,
    },
  },
  etherscan: {
    apiKey: {
      celoSepolia: process.env.CELOSCAN_API_KEY || "api-key",
    },
    customChains: [
      {
        network: "celoSepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.celoscan.io/api",
          browserURL: "https://sepolia.celoscan.io",
        },
      },
    ],
  },
};
```

---

## Sample Questions for Game

```javascript
const SAMPLE_QUESTIONS = [
  {
    question: "What is Celo's native stablecoin?",
    options: ["cUSD", "USDC", "DAI", "USDT"],
    correctAnswer: 0,
  },
  {
    question: "What makes Celo mobile-first?",
    options: [
      "Smaller block size",
      "Faster transactions",
      "Phone number mapping to addresses",
      "Lower gas fees",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is MiniPay?",
    options: [
      "A payment processor",
      "A mobile wallet for Celo",
      "A stablecoin",
      "A DeFi protocol",
    ],
    correctAnswer: 1,
  },
  {
    question: "What consensus mechanism does Celo use?",
    options: [
      "Proof of Work",
      "Proof of Stake",
      "Proof of Authority",
      "Delegated Proof of Stake",
    ],
    correctAnswer: 1,
  },
  {
    question: "What can you use to pay gas fees on Celo?",
    options: [
      "Only CELO",
      "Only ETH",
      "Stablecoins like cUSD",
      "Bitcoin",
    ],
    correctAnswer: 2,
  },
];
```

---

## Testing Checklist

### Before Submitting
- [ ] Wallet connection works
- [ ] Auto-faucet gives cUSD
- [ ] Can join game
- [ ] Can answer questions
- [ ] Answers submit to blockchain
- [ ] Rewards distribute correctly
- [ ] Results page shows correctly
- [ ] Mobile navigation works
- [ ] Tested on actual mobile device
- [ ] Demo video recorded
- [ ] README updated
- [ ] All links work

---

## Demo Video Outline (4 minutes)

### 0:00-0:30 - Introduction
- Show problem: Learning blockchain is boring
- Show solution: Fun trivia game with rewards
- Show landing page

### 0:30-1:30 - Wallet & Setup
- Connect MiniPay wallet
- Show auto-faucet giving cUSD
- Navigate to game

### 1:30-2:30 - Gameplay
- Join game (show entry fee)
- Answer 5 questions
- Show timer and progress
- Submit answers

### 2:30-3:30 - Results & Rewards
- Show score and ranking
- Show rewards distributed
- Show confetti animation
- Show leaderboard

### 3:30-4:00 - Technical & Close
- Show smart contract on explorer
- Mention tech stack
- Show GitHub repo
- Thank you

---

## Success Criteria

### Minimum (Must Have)
- ✅ Smart contract deployed and verified
- ✅ Can play one complete game
- ✅ Rewards distribute automatically
- ✅ Works on mobile
- ✅ Demo video recorded

### Good (Should Have)
- ✅ All minimum features
- ✅ Auto-faucet integration
- ✅ Polished UI/UX
- ✅ Clear documentation
- ✅ Error handling

### Excellent (Nice to Have)
- ✅ All good features
- ✅ Prediction market
- ✅ Leaderboard
- ✅ Deployed to mainnet
- ✅ Multiple games

---

## Resources

### Celo Documentation
- https://docs.celo.org
- https://docs.celo.org/build-on-celo/build-on-minipay

### Smart Contract Examples
- https://github.com/celo-org/celo-composer
- https://docs.openzeppelin.com/contracts

### Testing Tools
- Celo Sepolia Faucet: https://faucet.celo.org
- Celo Sepolia Explorer: https://sepolia.celoscan.io
- MiniPay Testnet: Available in app stores

---

## Need Help?

### Common Issues

**Issue:** Contract deployment fails
**Solution:** Check you have CELO for gas fees on Sepolia

**Issue:** Transaction reverts
**Solution:** Check cUSD approval before joining game

**Issue:** Mobile navigation not showing
**Solution:** Implement hamburger menu (see HACKATHON_STRATEGY.md)

**Issue:** Rewards not distributing
**Solution:** Check contract has enough cUSD balance

---

## 🎯 Focus Areas

1. **Day 1:** Get smart contract working
2. **Day 2:** Get gameplay working
3. **Day 3:** Get mobile working
4. **Day 4:** Get documentation done

**Don't get distracted by:**
- Perfect animations
- Multiple game modes
- User profiles
- Complex features

**Keep it simple and working!**

---

**Ready? Let's build! 🚀**

Start with Day 1, Morning tasks. Good luck!
