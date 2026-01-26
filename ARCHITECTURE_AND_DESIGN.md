# SimpleTriviaGame Architecture & Design Decisions

## Architecture Overview

### Contract Architecture

```
SimpleTriviaGame
├── State Management
│   ├── IERC20 usdcToken (immutable)
│   ├── uint256 questionId (counter)
│   ├── mapping(uint256 => Question) questions
│   └── mapping(address => uint256) userScores
├── Core Functions
│   ├── addQuestion() [owner-only]
│   ├── deactivateQuestion() [owner-only]
│   ├── getQuestion() [public view]
│   └── getUserScore() [public view]
├── Events
│   ├── QuestionAdded
│   └── AnswerSubmitted
└── Security
    ├── Ownable (access control)
    └── SafeERC20 (safe transfers)
```

## Design Decisions

### 1. Immutable Token Address

**Decision:** Store USDC address as immutable  
**Rationale:** 
- Token cannot accidentally be changed
- Saves gas on every transfer
- Prevents owner from redirecting funds

```solidity
IERC20 public immutable usdcToken;
```

### 2. Simple Mapping-Based Storage

**Decision:** Use mappings instead of arrays  
**Rationale:**
- O(1) access to any question
- No iteration overhead
- Question ID can be validated easily
- No vulnerability to bounds attacks

```solidity
mapping(uint256 => Question) public questions;
```

### 3. Counter-Based Question IDs

**Decision:** Increment counter for each question  
**Rationale:**
- Automatic ID generation
- No collision risk
- Human-readable IDs (1, 2, 3...)
- Easy to track total questions

```solidity
uint256 public questionId; // Auto-increments
```

### 4. Owner-Controlled Content

**Decision:** Only owner can add/deactivate questions  
**Rationale:**
- Prevents spam/abuse
- Maintains quality control
- Simple access pattern
- No complex governance needed

```solidity
modifier onlyOwner() { /* ... */ }
```

### 5. No VRF Randomness in V1

**Decision:** Removed VRF to simplify v1  
**Rationale:**
- Faster deployment
- Lower costs
- Reduced complexity
- Chainlink VRF reserved for v2

### 6. Question Deactivation vs Deletion

**Decision:** Mark questions inactive rather than delete  
**Rationale:**
- Preserves on-chain history
- Users can still view old questions
- No data loss
- Simpler implementation

```solidity
function deactivateQuestion(uint256 questionId) external onlyOwner {
    questions[questionId].isActive = false;
}
```

## Feature Constraints

### Why No Game Sessions
- Simple v1 doesn't need sessions
- Direct per-question rewards simpler
- Sessions added in v2 with VRF

### Why No Leaderboard
- Tracking top players adds complexity
- Would require sorting logic
- Leaderboard in v2 with better UX
- Can be built off-chain from events

### Why No Usernames
- Adds storage complexity
- Not required for basic gameplay
- Usernames in v2 for identity
- Can use wallet address for now

### Why No Speed Bonuses
- Difficult to implement fairly
- Requires precise timing
- Added complexity for minimal benefit
- Bonuses in v2 with game sessions

## Security Decisions

### 1. SafeERC20 Usage

```solidity
using SafeERC20 for IERC20;

// Safe transfer even for non-standard ERC20
usdcToken.safeTransfer(player, rewardAmount);
```

**Benefit:** Handles non-standard ERC20 behaviors

### 2. Input Validation

```solidity
if (_options.length <= 1) revert InvalidOptions();
if (_correctOption >= _options.length) revert InvalidCorrectOption();
```

**Benefit:** Prevents invalid questions

### 3. No Reentrancy Guard Needed

```solidity
// No external calls before state changes
questionId++;
questions[questionId] = Question({...});

// Transfer at end, but no state-dependent external calls
```

**Decision:** Reentrancy guard not needed (no callback during transfer)

### 4. Custom Errors

```solidity
error InvalidTokenAddress();
error InvalidOptions();
error InvalidCorrectOption();
error QuestionNotActive();
error InvalidOption();
error InsufficientBalance();
```

**Benefit:** Gas-efficient error handling + clarity

## Upgrade Strategy

### SimpleTriviaGame v1.0 (Current)
- Basic question/answer
- Token rewards
- User scores
- Lightweight deployment

### Path to v2.0
- Keep v1.0 running
- Deploy v2.0 alongside
- No forced migration
- Users choose version

### v2.0 Enhancements
```
SimpleTriviaGame v1.0 → TriviaGameV2 v2.0
├── Add: Chainlink VRF
├── Add: Leaderboard
├── Add: Username registration
├── Add: Game sessions
├── Add: Speed bonuses
├── Keep: Same USDC token
└── Keep: v1.0 still operational
```

## Scaling Considerations

### Current Constraints
- No pagination for questions (solved by frontend filtering)
- No batch operations (acceptable for owner use case)
- No events indexing (clients listen or use subgraphs)

### Future Improvements
- Subgraph for event indexing
- Off-chain leaderboard service
- Question categories with filtering
- Bulk operations script

## Gas Optimization

### Current Optimizations
1. **Immutable state variables** - Saves storage reads
2. **No loops** - All operations O(1)
3. **Mapping storage** - Direct access patterns
4. **Custom errors** - Smaller error info

### Potential Future Optimizations
1. **Batch operations** - Add multiple questions at once
2. **Merkle proofs** - For question validation
3. **Compressed storage** - Combine small fields

## Testing Strategy

### Unit Tests
- Individual function behavior
- Error conditions
- State changes

### Integration Tests
- Multiple questions
- Score accumulation
- Cross-function interactions

### Mainnet Testing
- Real wallet integration
- USDC transfers
- Gas measurements
- Event emission

## Risk Analysis

### Low Risk ✅
- OpenZeppelin library usage
- Simple, auditable code
- No complex interactions
- Standard ERC20 patterns

### Mitigated Risks
- **Reentrancy:** No external callbacks
- **Overflow:** Solidity 0.8.20 protects
- **Access Control:** Ownable handles
- **Token Safety:** SafeERC20 handles

### Accepted Risks
- **Contract Owner:** Centralized control (acceptable for v1)
- **No Leaderboard:** Known limitation
- **No VRF:** Planned for v2
- **No Session:** Planned for v2

## Documentation & Communication

### For Developers
- API Specification: SIMPLE_TRIVIA_GAME_SPEC.md
- Integration Examples: INTEGRATION_EXAMPLES.md
- Source Code: contracts/src/SimpleTriviaGame.sol
- Tests: contracts/test/TriviaGame.t.sol

### For Users
- Features: README.md
- Roadmap: ROADMAP.md
- FAQ: FAQ.md
- Clarification: CONTRACT_VERSION_CLARIFICATION.md

---

## Conclusion

SimpleTriviaGame is designed as a **production-ready v1.0** that:
- ✅ Works reliably now
- ✅ Enables future features
- ✅ Maintains security
- ✅ Provides clear upgrade path

The architecture prioritizes:
1. **Simplicity:** Easy to understand and audit
2. **Security:** Safe from common vulnerabilities
3. **Scalability:** Can support v2 features
4. **Efficiency:** Gas-optimized operations

---

**Last Updated:** January 26, 2026  
**Architecture Version:** 1.0
