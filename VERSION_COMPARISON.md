# SimpleTriviaGame vs TriviaGameV2: Feature Comparison

## Overview

This document provides a detailed comparison between SimpleTriviaGame (v1.0, currently deployed) and TriviaGameV2 (v2.0, planned for Q2 2026).

---

## Feature Matrix

### Core Functionality

| Feature | SimpleTriviaGame v1.0 | TriviaGameV2 v2.0 |
|---------|----------------------|-------------------|
| Question Management | ✅ Owner-add questions | ✅ Owner-managed |
| Multiple Choice | ✅ 2-4 options | ✅ 2-4 options |
| Token Rewards | ✅ Direct per question | ✅ Direct + bonuses |
| User Score Tracking | ✅ Total correct answers | ✅ Session scores + total |
| Question Categories | ✅ 6 categories | ✅ 6 categories |
| Difficulty Levels | ✅ Easy/Medium/Hard | ✅ Easy/Medium/Hard |
| Question Deactivation | ✅ Owner can deactivate | ✅ Owner can deactivate |
| Error Handling | ✅ Custom errors | ✅ Enhanced error handling |

### Advanced Features

| Feature | SimpleTriviaGame v1.0 | TriviaGameV2 v2.0 |
|---------|----------------------|-------------------|
| **Randomness** | ❌ No VRF | ✅ Chainlink VRF V2 |
| **Game Sessions** | ❌ Per-question play | ✅ 10 questions/session |
| **Leaderboard** | ❌ No ranking system | ✅ Top 100 players |
| **Username Registration** | ❌ Wallet address only | ✅ Custom usernames |
| **Player Profiles** | ❌ No profiles | ✅ Full profiles |
| **Speed Bonuses** | ❌ No time tracking | ✅ Reward for speed |
| **Perfect Round Bonus** | ❌ No bonus | ✅ 10/10 bonus |
| **Streak Bonuses** | ❌ No tracking | ✅ Consecutive wins |
| **Weekly Rewards** | ❌ No pools | ✅ Top 10 pool |
| **Season System** | ❌ No seasons | ✅ Monthly seasons |

### Infrastructure

| Aspect | SimpleTriviaGame v1.0 | TriviaGameV2 v2.0 |
|--------|----------------------|-------------------|
| **Blockchain** | Base Mainnet | Base Mainnet |
| **Token** | USDC | USDC (same) |
| **VRF** | ❌ Not used | ✅ Chainlink VRF |
| **LINK Tokens** | ❌ Not needed | ✅ Required |
| **Subgraph** | ❌ Not indexed | ✅ Indexed |
| **Off-chain Compute** | ❌ None | ✅ Optional |
| **Scalability** | On-chain only | Hybrid |

---

## Deployment Details

### SimpleTriviaGame v1.0

```solidity
// Deployment
contract SimpleTriviaGame is Ownable {
    IERC20 public immutable usdcToken;
    uint256 public questionId;
    mapping(uint256 => Question) public questions;
    mapping(address => uint256) public userScores;
}

// Constructor
constructor(address _usdcToken) Ownable(msg.sender)

// Key State
- 1 IERC20 state variable (immutable)
- 1 uint256 counter
- 2 mappings
- Total: ~3KB storage structure
```

### TriviaGameV2 v2.0 (Planned)

```solidity
// Planned Expansion
contract TriviaGameV2 is Ownable {
    // All SimpleTriviaGame features, plus:
    
    IVRFCoordinatorV2 vrfCoordinator;
    uint64 vrfSubscriptionId;
    
    mapping(uint256 => GameSession) gameSessions;
    mapping(address => Username) usernames;
    mapping(address => PlayerProfile) profiles;
    mapping(uint256 => LeaderboardRank) leaderboard;
    
    // + more state for sessions, rankings, etc.
}

// Estimated storage: ~10KB+
```

---

## Gameplay Flow Comparison

### SimpleTriviaGame v1.0

```
1. Connect wallet
2. View available questions
3. Select question
4. Choose answer
5. Check if correct
6. Receive reward (if correct)
7. Repeat from step 2
```

### TriviaGameV2 v2.0

```
1. Connect wallet
2. Register username (first time)
3. View leaderboard (optional)
4. Start game session
5. VRF selects 10 random questions
6. Answer 10 questions (timed)
7. Game completes
8. Receive base + bonus rewards
9. Leaderboard updates
10. View improved rank
11. Next week compete for weekly rewards
```

---

## Cost Comparison

### SimpleTriviaGame v1.0 Costs

**Per Answer:**
- ~120,000 gas (read question + check answer + transfer USDC)
- Cost: ~$0.01-0.02 USD (depending on gas price)
- Reward: Variable (1-100+ USDC possible)

**Deployment:**
- One-time: ~2.9M gas (~$0.05)

### TriviaGameV2 v2.0 Estimated Costs

**Per Game Session:**
- VRF Request: ~200,000 gas
- Answer Submission: ~15,000 gas × 10 = 150,000 gas
- Leaderboard Update: ~50,000 gas
- Total: ~400,000 gas per session
- Cost: ~$0.05-0.10 USD per game

**Deployment:**
- Main contract: ~3M gas (~$0.05)
- VRF setup: ~100,000 gas (~$0.01)
- Total: ~$0.06

---

## User Experience Comparison

### SimpleTriviaGame v1.0 UX

**Pros:**
- ✅ Play individual questions anytime
- ✅ Quick feedback (instant rewards)
- ✅ No setup required
- ✅ Can quit anytime
- ✅ Direct question access

**Cons:**
- ❌ No global competition
- ❌ No leaderboard
- ❌ Random player behavior (not curated)
- ❌ No session structure
- ❌ No time pressure

### TriviaGameV2 v2.0 UX

**Pros:**
- ✅ Competitive leaderboard
- ✅ Random fair selection
- ✅ Session structure (goal-oriented)
- ✅ Weekly competitions
- ✅ Bonus rewards
- ✅ Player profiles
- ✅ Community rankings

**Cons:**
- ❌ VRF wait time
- ❌ Timed questions
- ❌ Session commitment
- ❌ Higher gas costs
- ❌ More complex UI

---

## Integration Complexity

### SimpleTriviaGame v1.0

**Frontend Integration:** Easy
- Load questions (simple loop)
- Display options
- Submit answer on click
- Show reward
- Events: ~2 to listen to

**Backend Integration:** None needed
- Everything on-chain
- No off-chain indexing required

**Typical Integration Time:** 2-3 days

### TriviaGameV2 v2.0

**Frontend Integration:** Complex
- Wallet connection (same)
- Username registration flow
- Game session setup
- 10-question round timer
- Real-time leaderboard
- VRF wait handling
- Bonus calculation UI

**Backend Integration:** Recommended
- Subgraph for efficient querying
- Leaderboard API
- Player profile caching
- Season management

**Typical Integration Time:** 2-3 weeks

---

## Security Comparison

### SimpleTriviaGame v1.0

**Security Model:**
- Owner-controlled (centralized)
- No VRF dependencies
- Minimal external calls
- One contract to audit

**Attack Surface:**
- Owner key compromise (main risk)
- USDC transfer vulnerabilities (mitigated with SafeERC20)
- Invalid inputs (mitigated with validation)

### TriviaGameV2 v2.0

**Security Model:**
- Owner-controlled (centralized)
- VRF dependency (Chainlink-managed)
- More external calls
- Multiple smart contracts

**Attack Surface:**
- Owner key compromise
- VRF coordinator issues
- Leaderboard manipulation (needs careful ranking)
- Username spoofing (needs validation)
- Session state attacks

---

## Migration Path

### For Users

**From V1 to V2:**
- No forced migration
- Continue playing V1 if preferred
- Optional V2 participation
- Scores kept separate initially
- Possible score transfer in future

### For Developers

**Coexistence Strategy:**
```
Version Management:
├── SimpleTriviaGame v1.0 (active, no changes)
├── TriviaGameV2 v2.0 (new, separate deployment)
└── Shared
    ├── USDC token (same)
    └── Base network (same)
```

**Frontend Handling:**
```typescript
const v1Contract = useContract(V1_ADDRESS);
const v2Contract = useContract(V2_ADDRESS);

// Users choose which to play
const selectedVersion = userChoice; // v1 or v2
```

---

## Roadmap Timeline

### Q1 2026: Planning & Design
- [x] Issue #134 resolution (SimpleTriviaGame clarification)
- [ ] TriviaGameV2 architecture finalized
- [ ] VRF integration design
- [ ] Leaderboard algorithm design

### Q2 2026: Development & Testing
- [ ] Develop TriviaGameV2
- [ ] Integration testing
- [ ] Testnet deployment
- [ ] User testing

### Q3 2026: Mainnet Deployment
- [ ] Deploy TriviaGameV2 to Base
- [ ] Enable gradual rollout
- [ ] Monitor for issues
- [ ] Community feedback

### Q4 2026+: Evolution
- [ ] Possible Season System
- [ ] Advanced features
- [ ] Community governance
- [ ] Further optimization

---

## Choosing Your Version

### Use SimpleTriviaGame v1.0 If You Want:
- ✅ Simple, quick gameplay
- ✅ Play any question anytime
- ✅ Instant feedback
- ✅ No time pressure
- ✅ Lower gas costs

### Use TriviaGameV2 v2.0 If You Want:
- ✅ Competitive leaderboard
- ✅ Fair randomness (VRF)
- ✅ Bonus rewards
- ✅ Community interaction
- ✅ Seasonal gameplay
- ✅ Username identity

---

## FAQ: V1 vs V2

### Q: Why not deploy V2 immediately?
**A:** SimpleTriviaGame is production-ready now. V2 adds features but also complexity. Phased approach is safer.

### Q: Can I earn from both?
**A:** Yes! Both contracts will remain active. Earn from either or both.

### Q: Will V1 stop working?
**A:** No, SimpleTriviaGame will continue indefinitely. V2 is additive, not replacement.

### Q: Do I need to migrate?
**A:** No. Stay on V1 if you prefer, or try V2 when it launches.

### Q: Will V1 get updates?
**A:** Only critical security patches. All features go into V2.

### Q: Which should I integrate first?
**A:** V1 for quick integration, V2 when ready for advanced features.

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** Complete

See [ROADMAP.md](ROADMAP.md) for complete roadmap details.
