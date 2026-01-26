# SimpleTriviaGame - Developer Quick Reference

## TL;DR

- **Deployed Contract:** SimpleTriviaGame (not TriviaGameV2)
- **No VRF:** No randomness, no Chainlink integration needed
- **No Leaderboard:** No global rankings in current version
- **What Works:** Question management, token rewards, user scores
- **Docs:** See [SIMPLE_TRIVIA_GAME_SPEC.md](contracts/SIMPLE_TRIVIA_GAME_SPEC.md)

---

## Quick Start

### Contract Address
```
0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d (Base Mainnet)
```

### Token (USDC)
```
0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 (Base Mainnet)
```

### Key Functions
```solidity
// Add question (owner only)
addQuestion(
    string _text,
    string[] _options,
    uint256 _correctIndex,
    uint256 _rewardAmount,
    Category _category,
    Difficulty _difficulty
)

// Get question
getQuestion(uint256 questionId) → Question

// Get user score
getUserScore(address user) → uint256

// Deactivate question (owner only)
deactivateQuestion(uint256 questionId)
```

---

## Events

```solidity
// New question added
event QuestionAdded(uint256 indexed questionId, string questionText, uint256 reward)

// Answer submitted
event AnswerSubmitted(address indexed user, uint256 questionId, bool isCorrect, uint256 reward)
```

---

## Integration Checklist

- [ ] Read SIMPLE_TRIVIA_GAME_SPEC.md
- [ ] Review SimpleTriviaGame.sol source
- [ ] Get contract ABI from BaseScan or `contracts/src/`
- [ ] No VRF subscription needed
- [ ] Fund contract with USDC for rewards
- [ ] Build question UI
- [ ] Implement answer submission
- [ ] Listen for AnswerSubmitted events
- [ ] Display user scores

---

## Common Patterns

### Get Active Questions
```typescript
const questions = [];
for (let i = 1; i <= questionCount; i++) {
  const q = await contract.getQuestion(i);
  if (q.isActive) questions.push(q);
}
```

### Submit Answer
```typescript
// Frontend determines if correct
const question = await contract.getQuestion(questionId);
const userAnswer = selectedIndex;
const isCorrect = userAnswer === question.correctOption;

// Emit event for tracking
emit("answer-submitted", {
  questionId,
  userAnswer,
  isCorrect,
  reward: isCorrect ? question.rewardAmount : 0
});

// Update user score
if (isCorrect) {
  updateUserScore(userAddress);
}
```

### Track User Progress
```typescript
const score = await contract.getUserScore(userAddress);
const correctAnswers = score;
const totalQuestions = await contract.questionId();
const percentage = (correctAnswers / totalQuestions) * 100;
```

---

## What's NOT in SimpleTriviaGame

| Feature | V1 | V2 (Planned) |
|---------|----|----|
| Random questions | ❌ | ✅ |
| Leaderboard | ❌ | ✅ |
| Usernames | ❌ | ✅ |
| Game sessions | ❌ | ✅ |
| Speed bonuses | ❌ | ✅ |
| Weekly rewards | ❌ | ✅ |

---

## Roadmap Reference

**Now (2026 Q1):** SimpleTriviaGame v1.0  
**Q2 2026:** TriviaGameV2 with VRF + Leaderboard  
**H2 2026:** Advanced features (NFTs, multiplayer, etc.)

---

## File References

| File | Purpose |
|------|---------|
| [README.md](README.md) | Project overview |
| [ROADMAP.md](ROADMAP.md) | Version roadmap |
| [SIMPLE_TRIVIA_GAME_SPEC.md](contracts/SIMPLE_TRIVIA_GAME_SPEC.md) | API documentation |
| [contracts/src/SimpleTriviaGame.sol](contracts/src/SimpleTriviaGame.sol) | Source code |
| [contracts/test/TriviaGame.t.sol](contracts/test/TriviaGame.t.sol) | Tests |

---

## Support

- Check [SIMPLE_TRIVIA_GAME_SPEC.md](contracts/SIMPLE_TRIVIA_GAME_SPEC.md) for complete API
- View contract on [BaseScan](https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d)
- Open issue for bugs/questions
- See [CONTRACT_VERSION_CLARIFICATION.md](CONTRACT_VERSION_CLARIFICATION.md) for background

---

**Last Updated:** January 26, 2026
