# Zali Contract Roadmap

## Current Version: SimpleTriviaGame (v1.0)

**Status:** ✅ Live on Base Mainnet  
**Address:** `0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d`  
**Deployment Date:** December 14, 2024

### Features
- Basic question management (add/deactivate questions)
- Multiple-choice trivia with 2-4 options
- Token-based reward system (USDC)
- User score tracking
- Question categorization (Celo, DeFi, Web3, Crypto, NFTs, DAOs)
- Difficulty levels (Easy, Medium, Hard)
- Faucet contract for testnet USDC distribution

### Security
- OpenZeppelin Ownable for access control
- SafeERC20 for secure token transfers
- Input validation for all user inputs
- Comprehensive test coverage

---

## Future Versions

### Phase 2: TriviaGameV2 (Planned)

**Target:** Q2 2026

#### Proposed Features
- **Chainlink VRF V2 Integration**
  - Random question selection for each game session
  - Provably fair randomness for competitive gameplay

- **Leaderboard System**
  - Top 100 players by total score
  - Real-time rank updates
  - Persistent ranking across seasons

- **Username Registration**
  - Player profiles on-chain
  - Display names on leaderboard
  - Personal game history

- **Game Sessions**
  - Timed game rounds (e.g., 10 questions per session)
  - Session-based scoring
  - Round completion tracking

- **Weekly Reward Distribution**
  - Top 10 players share weekly reward pool
  - Prize distribution structure:
    - 1st: 40%
    - 2nd: 25%
    - 3rd: 15%
    - 4th: 10%
    - 5th: 5%
    - 6th-10th: 2.5% each (1% per player)

- **Enhanced Rewards**
  - Base reward per correct answer
  - Speed bonuses for fast answers
  - Perfect round bonuses (10/10 correct)
  - Streak bonuses

#### Infrastructure Changes
- Additional LINK token allocation for VRF
- VRF subscription setup on Base Mainnet
- Separate deployment script for V2

#### Deployment Strategy
- Deploy alongside SimpleTriviaGame (not replacing)
- Users can choose which version to play
- Data migration tools if needed

---

### Phase 3: Advanced Features (2026 H2)

#### Possible Enhancements
- **Categories & Seasons**
  - Category-specific leaderboards
  - Monthly/seasonal rankings
  - Season-specific rewards

- **NFT Integration**
  - Achievement badges as NFTs
  - Rare collectibles for top players
  - Transferable game rewards

- **Multiplayer Elements**
  - Head-to-head matches
  - Tournament brackets
  - Real-time competitive gameplay

- **Analytics & Insights**
  - Player statistics dashboard
  - Question difficulty analysis
  - Performance trends

- **Community Features**
  - Community-suggested questions
  - Voting on question additions
  - Community governance

---

## Migration Path from SimpleTriviaGame to TriviaGameV2

### For Players
1. No migration needed - SimpleTriviaGame will continue to function
2. Scores in SimpleTriviaGame remain on-chain
3. Option to play TriviaGameV2 for enhanced experience
4. Rewards can be earned from both contracts

### For Developers
1. Two separate contract deployments
2. Both contracts share the same USDC token
3. Independent question management per contract
4. Separate leaderboards (can be unified via frontend)

### Data Continuity
- SimpleTriviaGame scores are permanent
- Option to transfer scores to TriviaGameV2 (if desired)
- Historical data preserved on-chain

---

## Technical Considerations

### SimpleTriviaGame Limitations Addressed in V2
1. **No Randomness** → Chainlink VRF V2
2. **No Player Identity** → Username registration
3. **No Leaderboard** → Full leaderboard system
4. **No Session Management** → Game sessions with timed rounds
5. **Basic Rewards** → Enhanced reward system with bonuses

### Why SimpleTriviaGame is Production-Ready Despite Limited Features
- Core functionality works reliably
- Token transfers are safe and tested
- Owner-controlled question management
- Demonstrates Web3 integration capabilities
- Foundation for future upgrades

---

## Deployment Checklist for TriviaGameV2

- [ ] Chainlink VRF subscription created on Base Mainnet
- [ ] VRF subscription funded with LINK tokens
- [ ] TriviaGameV2 contract deployed and verified
- [ ] Contract added as VRF consumer
- [ ] Questions seeded into contract
- [ ] Frontend updated with new contract ABI/address
- [ ] Game flows updated for session-based gameplay
- [ ] Leaderboard tracking implemented
- [ ] User registration system integrated
- [ ] Testnet deployment and testing completed
- [ ] Audit completed (if applicable)
- [ ] Mainnet launch

---

## Community Feedback & Requests

To request features or suggest improvements:
1. Open an issue on GitHub
2. Label with `enhancement` or `feature-request`
3. Provide detailed description
4. Community voting/discussion
5. Prioritization for roadmap

---

## Version Comparison Matrix

| Feature | SimpleTriviaGame | TriviaGameV2 | TriviaGameV3 |
|---------|-----------------|--------------|--------------|
| Basic Q&A | ✅ | ✅ | ✅ |
| Token Rewards | ✅ | ✅ | ✅ |
| Random Questions | ❌ | ✅ | ✅ |
| Leaderboard | ❌ | ✅ | ✅ |
| User Profiles | ❌ | ✅ | ✅ |
| Game Sessions | ❌ | ✅ | ✅ |
| Speed Bonuses | ❌ | ✅ | ✅ |
| Weekly Rewards | ❌ | ✅ | ✅ |
| Multiplayer | ❌ | ❌ | ✅* |
| NFT Rewards | ❌ | ❌ | ✅* |
| Governance | ❌ | ❌ | ✅* |

*Planned, not confirmed

---

## Support & Questions

For questions about the roadmap:
- Check this document first
- Open an issue for specific inquiries
- Review commit history for development progress
- Follow GitHub releases for announcements

---

Last Updated: January 26, 2026  
Next Review: Q1 2026
