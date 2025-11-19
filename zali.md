Below is a **complete, production-grade build instructions file** (`build_instructions.md`) you can hand to any AI agent or developer to generate your **entire CeloTrivia project** end-to-end.

The instructions include:

* Full folder structure
* Smart contract requirements
* Frontend requirements
* API logic
* UX rules
* Deployment expectations
* Coding standards
* A full checklist

This is ready to copy → paste into an AI task.

---

# 📘 **build_instructions.md**

## **CeloTrivia — Full Project Build Instructions**

*A complete technical specification for generating the entire codebase.*

---

# 🧩 **1. Project Overview**

Build a **mobile-first, tokenized trivia webapp** for the **Celo MiniPay Hackathon**.
The app must run smoothly inside MiniPay and allow:

* Wallet connection
* One-time faucet claim (10 test cUSD)
* Entry-fee trivia rounds (0.1 cUSD)
* Automatic payouts to winners
* Clean UI optimized for mobile

Tech stack:

* **Frontend:** Next.js 14 / React / Composer Kit
* **Smart Contracts:** Solidity
* **Blockchain:** Celo Alfajores Testnet
* **Backend (optional):** Next.js API routes
* **DB:** JSON, SQLite, or Supabase (your choice)

---

# 🗂 **2. Folder Structure**

Create this structure exactly:

```
celo-trivia/
  ├── contracts/
  │    ├── Faucet.sol
  │    ├── TriviaGame.sol
  │    └── interfaces/
  ├── scripts/
  │    ├── deploy_faucet.js
  │    ├── deploy_trivia.js
  │    └── utils/
  ├── frontend/
  │    ├── app/
  │    │    ├── page.tsx
  │    │    ├── lobby/
  │    │    │    └── page.tsx
  │    │    ├── play/
  │    │    │    └── page.tsx
  │    │    ├── results/
  │    │    │    └── page.tsx
  │    │    └── api/
  │    │         ├── questions/route.ts
  │    │         ├── session/route.ts
  │    │         └── payout/route.ts
  │    ├── components/
  │    ├── lib/
  │    ├── styles/
  │    └── README.md
  ├── database/
  │    └── questions.json
  ├── hardhat.config.js
  ├── README.md
  ├── .env.example
  └── build_instructions.md
```

---

# 🔐 **3. Smart Contracts Requirements**

## **3.1 Faucet.sol**

Purpose: allow users to claim **10 test cUSD once**.

### Mandatory Features:

* Store cUSD ERC20 address
* `mapping(address => bool) hasClaimed`
* `CLAIM_AMOUNT = 10e18`
* Function: `claim()`
* Prevent double-claims
* Transfer cUSD from contract to user
* `refill()` function (owner-only)

### Events:

```
Claimed(address indexed user, uint256 amount);
Refilled(uint256 amount);
```

---

## **3.2 TriviaGame.sol**

Purpose: manage trivia rounds, entry fees, prize pool, and payouts.

### Requirements:

* Store cUSD token address
* `ENTRY_FEE = 0.1e18`
* Function: `joinRound(uint256 roundId)`
* Track round → players mapping
* Hold prize pool
* Function: `payoutWinners(roundId, winners[])`
* Only backend or owner can trigger payouts

### Events:

```
RoundCreated(uint256 indexed roundId);
PlayerJoined(uint256 indexed roundId, address indexed player);
WinnersPaid(uint256 indexed roundId, address[] winners, uint256[] rewards);
```

### Notes:

* No questions stored on-chain
* All game logic happens off-chain
* Contract only manages money

---

# 🖥 **4. Frontend Requirements (Next.js)**

## **4.1 Flow**

### **1. Landing Page**

* Connect MiniPay button
* Show balance
* If balance < entry fee → show Faucet claim card

### **2. Faucet Claim**

* Button → `contract.write.claim()`
* After transaction → refresh balance

### **3. Lobby**

* “Play Trivia” button
* Show entry fee
* Show current prize pool
* Clicking → triggers entry fee payment

### **4. Game Page**

* Fetch 5 random questions from API
* Display:

  * question text
  * 4 options
  * timer
* Store answers locally
* Submit answers to `/api/session`

### **5. Results Page**

* Show:

  * Score
  * Rewards
  * Transaction link (payout)
* Button: "Play Again"

---

# 🌐 **5. API Requirements (Next.js API Routes)**

## **5.1 `/api/questions`**

* Return 5 random questions from `questions.json`

### Response:

```
{
  questions: [
    { id, text, choices[], correct }
  ]
}
```

---

## **5.2 `/api/session`**

Purpose: record game results and determine winners.

### Steps:

1. Receive answers + wallet address
2. Compute score
3. Save to DB
4. Determine if player is top 1 or top 3
5. If round ends → call `/api/payout`

### Response:

```
{ score, roundId, isWinner }
```

---

## **5.3 `/api/payout`**

Backend calls smart contract to pay winners.

Input:

```
{ roundId }
```

Logic:

1. Gather round results
2. Select winners
3. Compute reward distribution
4. Call `TriviaGame.payoutWinners()`

---

# 📦 **6. Database Requirements**

Use `questions.json` for trivia:

```
[
  {
    "id": 1,
    "text": "Who created Celo?",
    "choices": ["A", "B", "C", "D"],
    "correct": 0
  },
  ...
]
```

---

# 🎨 **7. UI/UX Requirements**

### General Rules:

* Mobile-first
* Font size >= 16px
* Big tap targets
* Sticky footer navigation
* Smooth animations
* Loading skeletons
* Clear MiniPay popups

### Colors:

* Celo brand palette (green/yellow)

### Components to include:

* Card
* Button
* Progress bar
* Timer circle

---

# 🚀 **8. Deployment Instructions**

## **8.1 Contracts**

* Deploy to Celo Alfajores testnet
* Use Hardhat deployment scripts
* Save contract addresses in `/frontend/lib/contracts.ts`

## **8.2 Frontend**

Deploy to **Vercel**.

Environment variables needed:

```
NEXT_PUBLIC_CUSD_ADDRESS=
NEXT_PUBLIC_FAUCET_ADDRESS=
NEXT_PUBLIC_TRIVIA_ADDRESS=
NEXT_PUBLIC_CHAIN_ID=44787
```

---

# 🧪 **9. Testing Requirements**

## Smart Contract Tests:

* User can claim faucet only once
* Faucet reverts on second attempt
* Users can join round
* Entry fees accumulate correctly
* Only owner can call payouts
* Payouts distribute correctly
* Round resets after completion

## Frontend Tests:

* Connect wallet
* Faucet claiming
* Entry fee deduction
* Game renders questions
* Timer works
* Results calculated correctly

---

# 📋 **10. Build Checklist**

### **Smart Contracts**

* [ ] Faucet.sol created
* [ ] TriviaGame.sol created
* [ ] Deployment scripts created
* [ ] Contract addresses exported
* [ ] Functions tested

### **Frontend**

* [ ] Connect MiniPay integration
* [ ] Faucet claim UI
* [ ] Lobby screen
* [ ] Play screen
* [ ] Results screen
* [ ] Contract ABI integration
* [ ] Mobile optimization

### **Backend**

* [ ] questions.json created
* [ ] `/api/questions` endpoint
* [ ] `/api/session` endpoint
* [ ] `/api/payout` endpoint
* [ ] Leaderboard optional

### **DevOps**

* [ ] Hardhat configured for Celo
* [ ] Contracts deployed
* [ ] Vercel deployment
* [ ] .env set properly

### **Polish**

* [ ] Animations added
* [ ] Loading skeletons
* [ ] Error handling
* [ ] Toast notifications
* [ ] 4-minute demo video recorded

---
