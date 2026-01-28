
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

# 🚀 **Live on Base Mainnet!**

**🎉 DEPLOYED: December 14, 2024**

### Production Contracts

* **SimpleTriviaGame:** [`0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d`](https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d)
* **USDC (Base Mainnet):** [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
* **Network:** Base Mainnet (Chain ID: 8453)
* **Compiler:** Solc v0.8.30
* **Optimization:** 200 runs

### Contract Details

| Property | Value |
|----------|-------|
| **Deployer** | `0x2c8D82a53f11B0E9B527a111B2f53C5D5E809806` |
| **Gas Used** | 2,913,596 |
| **Deploy Cost** | ~$0.05 |
| **Initial Questions** | 5 trivia questions |
| **Reward per Answer** | 0.1 USDC |

### Quick Links

* 🔍 **[View on BaseScan](https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d)**
* 🎮 **Frontend:** (Deploying soon)
* 📹 **Demo Video:** (Coming soon)

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

* Multiple-choice questions with 2-4 options
* Owner-managed question addition
* Configurable reward amounts per question
* Question categories (Celo, DeFi, Web3, Crypto, NFTs, DAOs)
* Difficulty levels (Easy, Medium, Hard)
* Active/Inactive question management

### 🎁 **Reward Distribution**

* **FREE to play** (no entry fee)
* Rewards are configurable per question
* Token-based rewards (USDC on Base mainnet)
* Direct distribution to players
* Owner can manage reward amounts

### 🏆 **User Scoring**

* Track user scores for answered questions
* Owner can manage questions and rewards
* Simple scoring mechanism without complex leaderboards

### 📱 **Built for All Devices**

* Responsive design
* Optimized for both desktop and mobile
* Smooth animations with Framer Motion
* Minimal steps to play

---

# 🏗 **Architecture**

## High-Level Flow

```
Web3 Wallet → Connect → Play Questions → Submit Answers → Earn Rewards
```

## System Diagram

```
+------------------+      +----------------------+
|  Frontend (Next) | <--> | SimpleTriviaGame.sol |
+------------------+      +----------------------+
         |                          |
         |                          v
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
* Token rewards managed by contract

---

# 📦 **Project Structure**

```
Zali/
  ├── contracts/               # Smart contracts (Foundry)
  │    ├── src/
  │    │    ├── Faucet.sol
  │    │    ├── SimpleTriviaGame.sol
  │    │    └── MockVRF*.sol
  │    ├── script/            # Deployment scripts
  │    │    ├── DeploySimpleMainnet.s.sol
  │    │    └── AddQuestions.s.sol
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

### **SimpleTriviaGame** (Main Contract - Currently Deployed)

Manages basic trivia gameplay with question management and user scoring.
Direct token-based rewards without VRF randomness or leaderboard features.

Key features:
- Simple question and answer management
- Token-based reward system
- Owner-controlled question management
- User score tracking
- Category and difficulty organization

Key functions:

```solidity
function addQuestion(
    string memory _questionText,
    string[] memory _options,
    uint256 _correctOption,
    uint256 _rewardAmount,
    Category _category,
    Difficulty _difficulty
) external onlyOwner;

function deactivateQuestion(uint256 _questionId) external onlyOwner;
function getQuestion(uint256 _questionId) external view returns (Question);
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
# Contract Addresses
NEXT_PUBLIC_SIMPLE_TRIVIA_GAME_ADDRESS=0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d
NEXT_PUBLIC_FAUCET_ADDRESS=0x... # Optional - testnet only
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

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

### Step 1: Deploy SimpleTriviaGame

```bash
cd contracts

# Deploy to Base Mainnet
forge script script/DeploySimpTriviaGame.s.sol \
  --rpc-url https://mainnet.base.org \
  --broadcast --verify \
  --etherscan-api-key $BASESCAN_API_KEY

# Or deploy to Base Sepolia (testnet)
forge script script/DeploySimpleTriviaGame.s.sol \
  --rpc-url https://sepolia.base.org \
  --broadcast --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Step 2: Add Questions

```bash
forge script script/AddQuestions.s.sol \
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

### SimpleTriviaGame Events

```solidity
event QuestionAdded(uint256 indexed questionId, string questionText, uint256 reward);
event AnswerSubmitted(address indexed user, uint256 questionId, bool isCorrect, uint256 reward);
```

---

# 🧭 **Gameplay Logic**

### 1. User connects Web3 wallet

Wallet connection via Web3 provider (MetaMask, Coinbase Wallet, etc.)

### 2. User views available questions

Browse questions added by contract owner

### 3. User selects and answers question

Submit answer to the smart contract

### 4. Smart contract verifies answer

Checks if answer is correct against stored data

### 5. User receives reward

If correct, reward tokens transferred to user's wallet

---

# 🎨 **UI/UX Features**

* Responsive design (mobile & desktop)
* Smooth animations with Framer Motion
* Progress tracking
* Real-time balance updates
* Toast notifications for transactions
* Error boundaries for graceful error handling
* Loading states and skeleton screens
* Gradient themes
* Wallet connection modal (AppKit)

---

# 📈 **User Scoring System**

SimpleTriviaGame maintains user scores:

* User scores tracked in contract storage
* Incrementing scores for each correct answer
* Owner controls reward amounts per question
* No automatic leaderboard (can be added in future versions)

---

## 🔒 **Smart Contract Security**

- Access control with `Ownable` (only owner can add questions)
- Input validation for all user-provided data
- Safe ERC20 token transfers using OpenZeppelin's `SafeERC20`
- Error handling for invalid inputs
- Comprehensive test coverage (see contracts/test/)

## 🔐 **Input Sanitization**

The application implements comprehensive input sanitization to prevent XSS and injection attacks. The following measures are in place:

### Sanitization Utilities

- `sanitizeString(input: string)`: Removes HTML/JS tags and escapes special characters
- `sanitizeUsername(username: string)`: Sanitizes usernames with strict character whitelisting
- `sanitizeNumber(input: unknown)`: Safely converts input to a number with proper error handling
- `sanitizeAddress(address: string)`: Validates and sanitizes Ethereum addresses

### Form Handling

The `useSanitizedForm` hook wraps react-hook-form with automatic input sanitization:

```typescript
import { useSanitizedForm } from '@/hooks/useSanitizedForm';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3).max(20),
  // other fields...
});

const form = useSanitizedForm(schema, {
  // optional react-hook-form options
});
```

### Validation

Input validation is handled by Zod schemas with built-in sanitization:

```typescript
import { z } from 'zod';
import { sanitizeUsername } from '@/utils/sanitize';

export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .transform(val => sanitizeUsername(val.trim()));
```

### Testing

All sanitization functions have corresponding unit tests in `src/utils/__tests__/sanitize.test.ts`.

---

# 🛡 **Security Notes**

* **Reentrancy Protection**: All contracts use OpenZeppelin's `ReentrancyGuard`
* **Access Control**: Admin functions protected with `onlyOwner` modifier
* **Input validation**: Alphanumeric + underscore only
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
* **Real USDC rewards**: Instant payouts on-chain
* **No entry fees**: Free to play, earn based on performance
* **Simple & efficient**: Minimal contract footprint
* **Production-ready**: Full error handling, state management, and testing
* **Fully on-chain**: No backend dependencies
* **Modern Web3 stack**: Wagmi, Viem, AppKit for seamless wallet integration
* **Clean architecture**: Well-documented and maintainable code
* **Future upgrade path**: Can be extended with VRF, leaderboards, or other features

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
