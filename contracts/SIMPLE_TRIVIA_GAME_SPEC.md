# SimpleTriviaGame Contract Specification

## Overview

SimpleTriviaGame is a lightweight, production-ready smart contract for managing on-chain trivia questions and distributing token rewards to users who answer correctly.

**Status:** Live on Base Mainnet  
**Contract Address:** `0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d`  
**Network:** Base (Chain ID: 8453)  
**Token:** USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

---

## Contract Architecture

### Contract File
- **Location:** `contracts/src/SimpleTriviaGame.sol`
- **Language:** Solidity 0.8.20
- **Dependencies:** OpenZeppelin Contracts

### Key Components

#### Enums
```solidity
enum Difficulty { Easy, Medium, Hard }
enum Category { Celo, DeFi, Web3, GeneralCrypto, NFTs, DAOs }
```

#### Structs
```solidity
struct Question {
    string questionText;
    string[] options;
    uint256 correctOption;
    uint256 rewardAmount;
    bool isActive;
    Category category;
    Difficulty difficulty;
}
```

#### State Variables
```solidity
IERC20 public immutable usdcToken;      // USDC token contract
uint256 public questionId;               // Tracks number of questions
mapping(uint256 => Question) public questions;  // Question storage
mapping(address => uint256) public userScores;  // User score tracking
```

---

## Core Functions

### Constructor

```solidity
constructor(address _usdcToken) Ownable(msg.sender)
```

**Purpose:** Initialize the contract with USDC token address  
**Requirements:**
- `_usdcToken` must not be zero address
- Called once during deployment

**Reverts:**
- `InvalidTokenAddress()` if token address is 0x0

---

### Owner Functions

#### addQuestion

```solidity
function addQuestion(
    string memory _questionText,
    string[] memory _options,
    uint256 _correctOption,
    uint256 _rewardAmount,
    Category _category,
    Difficulty _difficulty
) external onlyOwner
```

**Purpose:** Add a new trivia question  
**Requirements:**
- Only owner can call
- Options must have 2-4 choices
- Correct option index must be valid
- Question text must not be empty

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `_questionText` | string | Question text (e.g., "What is Celo?") |
| `_options` | string[] | Array of answer options (2-4 items) |
| `_correctOption` | uint256 | Index of correct answer (0-based) |
| `_rewardAmount` | uint256 | Reward in USDC wei for correct answer |
| `_category` | Category | Question category enum |
| `_difficulty` | Difficulty | Difficulty level enum |

**Reverts:**
- `InvalidOptions()` if less than 2 or more than 4 options
- `InvalidCorrectOption()` if index >= options.length

**Emits:**
```solidity
event QuestionAdded(
    uint256 indexed questionId,
    string questionText,
    uint256 reward
)
```

**Example:**
```solidity
triviaGame.addQuestion(
    "What is Celo?",
    ["A Layer 2", "A stablecoin", "A mobile network", "A DAO"],
    2,  // "A mobile network" is correct
    10 * 10**6,  // 10 USDC reward
    Category.Celo,
    Difficulty.Easy
);
```

---

#### deactivateQuestion

```solidity
function deactivateQuestion(uint256 _questionId) external onlyOwner
```

**Purpose:** Deactivate a question (no longer available)  
**Requirements:**
- Only owner can call
- Question must exist

**Parameters:**
- `_questionId`: ID of question to deactivate

**Effect:**
- Sets `questions[_questionId].isActive = false`
- Question no longer appears in active question lists

---

### View Functions

#### getQuestion

```solidity
function getQuestion(uint256 _questionId) 
    external view returns (Question memory)
```

**Purpose:** Retrieve full question details  
**Returns:** Complete Question struct

---

#### isQuestionActive

```solidity
function isQuestionActive(uint256 _questionId) 
    external view returns (bool)
```

**Purpose:** Check if question is active  
**Returns:** Boolean indicating active status

---

#### getUserScore

```solidity
function getUserScore(address _user) 
    external view returns (uint256)
```

**Purpose:** Get a user's total score  
**Parameters:**
- `_user`: User wallet address

**Returns:** Total score (number of correct answers)

---

### Events

#### QuestionAdded

```solidity
event QuestionAdded(
    uint256 indexed questionId,
    string questionText,
    uint256 reward
)
```

Emitted when a new question is added.

#### AnswerSubmitted

```solidity
event AnswerSubmitted(
    address indexed user,
    uint256 questionId,
    bool isCorrect,
    uint256 reward
)
```

Emitted when user submits an answer.

---

## Custom Errors

```solidity
error InvalidTokenAddress();           // Token address is 0x0
error InvalidOptions();                // Wrong number of options (not 2-4)
error InvalidCorrectOption();          // Correct option index out of bounds
error QuestionNotActive();             // Question is deactivated
error InvalidOption();                 // User selected invalid option
error InsufficientBalance();           // Contract lacks tokens for reward
```

---

## Integration Guide

### For Frontend Developers

#### 1. Reading Questions

```typescript
// Get question by ID
const question = await contract.getQuestion(1);

// Check if active
const isActive = await contract.isQuestionActive(1);

// Get user score
const score = await contract.getUserScore(userAddress);
```

#### 2. Approving USDC (if needed)

```typescript
// Users don't need to approve - owner funds the contract
// But contract needs USDC balance for rewards
```

#### 3. Tracking Events

```typescript
// Listen for new questions
contract.on("QuestionAdded", (questionId, text, reward) => {
  console.log(`New question: ${text}`);
});

// Listen for answers
contract.on("AnswerSubmitted", (user, questionId, isCorrect, reward) => {
  console.log(`${user} answered question ${questionId}: ${isCorrect}`);
});
```

### For Backend/Indexing

#### Relevant Events to Index
1. `QuestionAdded` - New questions added
2. `AnswerSubmitted` - User answers recorded

#### Data Points to Track
- Total questions created
- User answer history
- Reward distribution
- Active vs inactive questions

---

## Security Considerations

### Access Control
- **Owner-only functions:** `addQuestion()`, `deactivateQuestion()`
- **Public functions:** `getQuestion()`, `getUserScore()`, `isQuestionActive()`
- Uses OpenZeppelin's `Ownable` for owner management

### Input Validation
- Options count validated (2-4)
- Correct option index validated
- Token address validated on construction

### Token Safety
- Uses SafeERC20 for token operations
- Rewards transferred safely
- No reentrancy issues (no state changes after transfers)

### Gas Optimization
- Immutable token address
- Efficient mapping storage
- No unnecessary loops

---

## Deployment Parameters

### Constructor Arguments
1. **USDC Address:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (Base Mainnet)

### Initial Setup
1. Deploy contract
2. Add questions using `addQuestion()`
3. Fund contract with USDC for rewards
4. Integrate with frontend

### Contract Funding

```solidity
// Owner must transfer USDC to contract for rewards
usdc.transfer(contractAddress, fundAmount);
```

---

## Testing

Tests located in `contracts/test/TriviaGame.t.sol`:

```bash
# Run all tests
cd contracts && forge test

# Run specific test
forge test --match-function test_AddQuestion -v

# View coverage
forge coverage
```

### Test Cases Included
- Question addition and validation
- Option count validation
- Correct answer index validation
- Question deactivation
- User score tracking
- Error handling

---

## Upgrade Path

### Current Limitations
- No random question selection (no Chainlink VRF)
- No leaderboard system
- No user profiles/usernames
- No game sessions
- No session-based scoring

### Future Versions
See [ROADMAP.md](../ROADMAP.md) for planned TriviaGameV2 with:
- Chainlink VRF integration
- Leaderboard system
- User profiles
- Game sessions
- Speed bonuses

---

## Deployment Verification

### On BaseScan
View the deployed contract:
https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d

### Verify Contract Code
- Contract verified on BaseScan
- Source code publicly available
- Compiler: solc v0.8.30
- Optimization: 200 runs

---

## Common Integration Patterns

### Pattern 1: Display All Questions

```typescript
const questions = [];
for (let i = 1; i <= totalQuestions; i++) {
  try {
    const q = await contract.getQuestion(i);
    if (q.isActive) {
      questions.push({ id: i, ...q });
    }
  } catch (e) {
    // Question doesn't exist
  }
}
```

### Pattern 2: Check Answer

```typescript
const question = await contract.getQuestion(questionId);
const userAnswer = selectedOptions; // e.g., [0, 1, 2] for first 3
const isCorrect = userAnswer === question.correctOption;

if (isCorrect) {
  // Reward user with question.rewardAmount
}
```

### Pattern 3: Track User Progress

```typescript
const score = await contract.getUserScore(userAddress);
const percentage = (score / totalQuestions) * 100;
console.log(`User answered ${percentage}% correctly`);
```

---

## Glossary

| Term | Definition |
|------|-----------|
| **Question ID** | Unique identifier for each question (1-indexed) |
| **Active** | Question is available for users to answer |
| **Correct Option** | 0-based index of the correct answer |
| **Reward Amount** | USDC in wei (6 decimals) awarded for correct answer |
| **Category** | Question type (Celo, DeFi, Web3, etc.) |
| **Difficulty** | Easy, Medium, or Hard |
| **User Score** | Count of questions user answered correctly |

---

## Support

For questions about SimpleTriviaGame:
1. Check this specification
2. Review contract source in `contracts/src/SimpleTriviaGame.sol`
3. Look at tests in `contracts/test/`
4. Open GitHub issue for bugs/features

---

**Last Updated:** January 26, 2026  
**Specification Version:** 1.0
