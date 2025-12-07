
# **Zali – Web3 Trivia Game**

A Web3 trivia game built on Base network.
Players can play trivia rounds, answer questions, and earn real ETH rewards on-chain.

---

## 📱 **Overview**

Zali is a fun, lightweight Web3 game designed to showcase:

* **Seamless Web3 wallet integration**
* **Fast L2 transactions on Base**
* **Real ETH rewards**
* **Smooth gameplay experience**
* **Secure, simple blockchain architecture**

Players can:

1. Connect their Web3 wallet (MetaMask, Coinbase Wallet, etc.)
2. Register a username
3. Play **free trivia rounds** (no entry fee)
4. Answer timed trivia questions
5. Earn ETH rewards paid automatically via smart contracts

No staking. No long setup. Just **connect → play → earn**.

---

# 🚀 **Live Demo**

* **Frontend:** [https://yourapp.vercel.app](https://yourapp.vercel.app)
* **Base Mainnet Contract:**
  * **SimpleTriviaGame:** [`0xE26164De790dDC4F2aDdce1D3084Ce945Fb4c513`](https://basescan.org/address/0xE26164De790dDC4F2aDdce1D3084Ce945Fb4c513#code)
  * **USDC Address (Payment Token):** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
  * **Compiler Version:** `v0.8.30`
  * **Optimization:** Enabled (200 runs)
* **Verification:** [View on Basescan](https://basescan.org/address/0xE26164De790dDC4F2aDdce1D3084Ce945Fb4c513#code)
* **Demo Video:** (Coming Soon)

---

# 🧠 **Features**

### 🌐 **Wallet Integration**

* Works with **any Web3 wallet** (MetaMask, Coinbase Wallet, WalletConnect)
* Instant balance updates
* Fast and cheap Base L2 transactions

### 💰 **Optional USDC Faucet**

* Each player can receive **10 USDC** once (testnet only)
* Enforced by smart contract
* Secure against multiple claims

### 🕹 **Trivia Gameplay**

* 10 random questions per game session
* Multiple-choice questions
* 5-minute time limit
* Responsive UI with smooth animations
* Questions selected via Chainlink VRF for fairness

### 🎁 **Reward Distribution**

* **FREE to play** (no entry fee)
* Earn **0.001 ETH per correct answer**
* Earn **0.005 ETH bonus** for perfect score (10/10)
* Earn up to **0.002 ETH speed bonus** for fast answers
* **Max reward per game: 0.017 ETH**
* Rewards distributed automatically via smart contract

### 🏆 **Leaderboard**

* Track top 100 players by total score
* Username registration system
* Weekly reward distribution for top 10 players
* Real-time rank updates

### 📱 **Built for All Devices**

* Responsive design
* Optimized for both desktop and mobile
* Smooth animations with Framer Motion
* Minimal steps to play

---

# 🏗 **Architecture**

## High-Level Flow

```
Web3 Wallet → Register Username → Start Game → Answer Questions → Submit Answers → Claim ETH Rewards
```

## System Diagram

```
+------------------+      +----------------------+     +----------------------+
|  Frontend (Next) | <--> | TriviaGameV2.sol     | <-> | Chainlink VRF V2     |
+------------------+      +----------------------+     +----------------------+
         |                          |
         |                          |
         v                          v
+------------------+      +------------------+
|  Faucet.sol      |      | USDC Token       |
|  (Optional)      |      | (Base Mainnet)   |
+------------------+      +------------------+
```

---

# 🧩 **Tech Stack**

### **Smart Contracts**

* Solidity 0.8.20
* Foundry (Forge)
* OpenZeppelin Contracts
* Chainlink VRF V2
* Base Mainnet
* USDC (ERC20)

### **Frontend**

* Next.js 14 (App Router)
* React 18
* TypeScript
* Wagmi v2 (React Hooks for Ethereum)
* Viem (Ethereum utilities)
* Reown AppKit (WalletConnect v2)
* TailwindCSS
* Framer Motion
* React Hot Toast

### **Backend**

* On-chain only (no traditional backend)
* Questions stored in smart contract
* Chainlink VRF for randomness

---

# 📦 **Project Structure**

```
Zali/
  ├── contracts/               # Smart contracts (Foundry)
  │    ├── src/
  │    │    ├── Faucet.sol
  │    │    ├── TriviaGame.sol
  │    │    ├── TriviaGameV2.sol
  │    │    └── MockVRF*.sol
  │    ├── script/            # Deployment scripts
  │    │    ├── Deploy.s.sol
  │    │    ├── DeployTriviaGameV2.s.sol
  │    │    └── Add*Questions.s.sol
  │    ├── test/              # Contract tests
  │    └── foundry.toml       # Foundry config
  ├── frontend/
  │    ├── src/
  │    │    ├── app/          # Next.js pages
  │    │    ├── components/   # React components
  │    │    ├── hooks/        # Custom hooks
  │    │    ├── config/       # Contract ABIs & addresses
  │    │    ├── store/        # Zustand state management
  │    │    └── contexts/     # React contexts
  │    ├── config/            # Web3 configuration
  │    └── package.json
  ├── BASE_MIGRATION_GUIDE.md
  └── README.md
```

---

# 🔐 **Smart Contracts**

### **TriviaGameV2.sol** (Main Contract)

Manages the complete trivia game with leaderboard, VRF randomness, and ETH rewards.

Key features:
- Username registration system
- Chainlink VRF V2 for random question selection
- On-chain question storage
- Automatic ETH reward distribution
- Leaderboard tracking (top 100 players)
- Weekly reward pools for top players
- Speed bonus calculations

Key functions:

```solidity
function registerUsername(string memory _username) external;
function startGame() external returns (uint256 sessionId);
function submitAnswers(uint256 _sessionId, uint8[] calldata _answers) external;
function claimRewards() external;
function getLeaderboard(uint256 _count) external view returns (...);
function addQuestion(...) external onlyOwner;
```

### **Faucet.sol** (Optional - Testnet Only)

Provides a one-time 10 USDC claim per user for testing.

Key functions:

```solidity
function claim() external;
function withdrawTokens(uint256 amount) external onlyOwner;
```

---

# 🔧 **Setup & Installation**

## 1️⃣ Clone the Repo

```bash
git clone https://github.com/yourname/zali.git
cd Zali
```

## 2️⃣ Install Dependencies

### Smart Contracts (Foundry)

```bash
cd contracts
forge install
```

### Frontend

```bash
cd frontend
npm install
```

---

# ⚙ **Environment Variables**

Create a `.env.local` file in `/frontend`:

```bash
# Contract Addresses (update after deployment)
NEXT_PUBLIC_TRIVIA_GAME_V2_ADDRESS=0x...
NEXT_PUBLIC_FAUCET_ADDRESS=0x... # Optional - testnet only
NEXT_PUBLIC_MOCK_VRF_ADDRESS=0x... # Optional - for testing

# Network Configuration
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Deployer Private Key (for deployment only)
PRIVATE_KEY=your_private_key_here
```

### Network Details:
- **Base Mainnet**: Chain ID `8453`
- **Base Sepolia (Testnet)**: Chain ID `84532`

---

# 🧪 **Testing Smart Contracts**

Run Foundry tests:

```bash
cd contracts
forge test
forge test -vvv # Verbose output
```

---

# 🚀 **Deploy Contracts**

### Step 1: Set Up Chainlink VRF Subscription

1. Visit https://vrf.chain.link
2. Create a subscription on Base Mainnet
3. Fund with LINK tokens
4. Copy subscription ID
5. Update `contracts/script/DeployTriviaGameV2.s.sol` with your subscription ID

### Step 2: Deploy TriviaGameV2

```bash
cd contracts

# Deploy to Base Mainnet
forge script script/DeployTriviaGameV2.s.sol:DeployTriviaGameV2 \
  --rpc-url https://mainnet.base.org \
  --broadcast --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Or deploy to Base Sepolia (testnet)
forge script script/DeployTriviaGameV2.s.sol:DeployTriviaGameV2 \
  --rpc-url https://sepolia.base.org \
  --broadcast --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Step 3: Add Contract as VRF Consumer

Go to https://vrf.chain.link and add your deployed contract address as a consumer.

### Step 4: Fund Contract with ETH

```bash
cast send YOUR_CONTRACT_ADDRESS --value 0.5ether \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY
```

### Step 5: Add Questions

```bash
forge script script/AddBasicQuestions.s.sol \
  --rpc-url https://mainnet.base.org \
  --broadcast
```

Copy contract addresses → `/frontend/src/config/contracts.ts`.

---

# 🖥 **Run Frontend Locally**

```bash
npm run dev
```

View at:

```
http://localhost:3000
```

---

# 🌐 **Deploy Frontend**

Deploy using **Vercel**:

```bash
vercel --prod
```

Add environment variables on Vercel.

---

# 📄 **Smart Contract Events**

The contracts emit events for tracking game progress:

### TriviaGameV2 Events

```solidity
event PlayerRegistered(address indexed player, string username);
event GameStarted(address indexed player, uint256 sessionId, uint256 requestId);
event QuestionsAssigned(address indexed player, uint256 sessionId, uint256[] questionIds);
event GameCompleted(address indexed player, uint256 sessionId, uint256 score, uint8 correctCount, uint256 reward);
event RewardClaimed(address indexed player, uint256 amount);
event LeaderboardUpdated(address indexed player, uint256 newRank, uint256 totalScore);
```

---

# 🧭 **Gameplay Logic**

### 1. User connects Web3 wallet

ETH balance fetched in real time.

### 2. User registers username

One-time registration, stored on-chain.

### 3. User starts game

Transaction triggers Chainlink VRF request for random questions.

### 4. VRF assigns random questions

Chainlink VRF callback selects 10 random questions from contract storage.

### 5. User plays trivia

10 multiple-choice questions with 5-minute time limit.

### 6. User submits answers

Smart contract calculates:
- Correct answer count
- Speed bonus (faster = more bonus)
- Total score
- ETH reward amount

### 7. Leaderboard updates

Player's rank updates automatically based on total score.

### 8. User claims rewards

ETH rewards transferred instantly to player's wallet.

### 9. Weekly rewards (optional)

Top 10 players share weekly reward pool.

---

# 🎨 **UI/UX Features**

* Responsive design (mobile & desktop)
* Smooth animations with Framer Motion
* Question timer with visual countdown
* Progress tracking
* Real-time balance updates
* Toast notifications for transactions
* Error boundaries for graceful error handling
* Loading states and skeleton screens
* Gradient themes
* Interactive leaderboard
* Wallet connection modal (AppKit)

---

# 📈 **Leaderboard System**

On-chain leaderboard tracking:

* **Top 100 players** by total score
* Player username
* Total score (includes correct answers + speed bonuses)
* Games played
* Best score in a single session
* Accuracy percentage
* Real-time rank updates

Weekly rewards:
* Top 10 players share weekly reward pool
* Distribution: 40%, 25%, 15%, 10%, 5%, 2.5%, 1%, 0.5%, 0.5%, 0.5%

---

# 🛡 **Security Notes**

* **Reentrancy Protection**: All contracts use OpenZeppelin's `ReentrancyGuard`
* **Access Control**: Admin functions protected with `onlyOwner` modifier
* **Safe Token Transfers**: Using OpenZeppelin's `SafeERC20` for USDC operations
* **Chainlink VRF**: Provably fair randomness for question selection
* **One-time faucet claims**: Enforced by mapping
* **Username validation**: Alphanumeric + underscore only
* **Time limits**: 5-minute timeout per game session
* **Gas optimization**: Efficient storage patterns and loops
* **No price manipulation**: Rewards are fixed in ETH, not dependent on oracle prices

---

# 🎥 **Demo Video Instructions**

Your demo video should include:

1. Opening the webapp in browser
2. Connecting Web3 wallet (MetaMask/Coinbase Wallet)
3. Registering username
4. Starting a game session
5. Showing Chainlink VRF question assignment
6. Playing trivia (answering questions)
7. Submitting answers and viewing score
8. Claiming ETH rewards
9. Viewing leaderboard position
10. Showing transaction on BaseScan
11. Explaining the architecture and Base integration

---

# 🏆 **Why This Project Stands Out**

* **Built on Base**: Fast, cheap L2 transactions
* **Chainlink VRF Integration**: Provably fair randomness
* **Real ETH rewards**: Instant payouts on-chain
* **No entry fees**: Free to play, earn based on performance
* **Comprehensive leaderboard**: Competitive gameplay with weekly rewards
* **Production-ready**: Full error handling, state management, and testing
* **Fully on-chain**: No backend dependencies
* **Modern Web3 stack**: Wagmi, Viem, AppKit for seamless wallet integration
* **Clean architecture**: Well-documented and maintainable code

---

# 🤝 **Contributing**

Feel free to fork, open issues, or submit pull requests.

---

# 📜 **License**

MIT License © 2025

---

## 🔗 **Important Links**

- **Base Mainnet Explorer**: https://basescan.org
- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **Base Documentation**: https://docs.base.org
- **Chainlink VRF (Base)**: https://docs.chain.link/vrf/v2/subscription/supported-networks#base-mainnet
- **USDC on Base**: https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
- **Get testnet ETH**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

---

## 🆘 **Support & Contact**

For issues, questions, or contributions:
- Open an issue on GitHub
- Check `BASE_MIGRATION_GUIDE.md` for deployment help
- Review contract documentation in `/contracts/src/`

---
