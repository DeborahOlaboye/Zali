# Frequently Asked Questions (FAQ)

## About SimpleTriviaGame

### Q: What is SimpleTriviaGame?
**A:** SimpleTriviaGame is a smart contract deployed on Base Mainnet that manages trivia questions and distributes token rewards (USDC) to users who answer correctly.

### Q: Where is it deployed?
**A:** 
- **Address:** `0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d`
- **Network:** Base Mainnet (Chain ID: 8453)
- **Token:** USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

### Q: Who can add questions?
**A:** Only the contract owner can add, modify, or deactivate questions.

### Q: How do I earn rewards?
**A:** Answer trivia questions correctly on-chain. Rewards (USDC) are sent automatically to your wallet.

### Q: Are rewards guaranteed?
**A:** Yes, if you answer correctly, the reward USDC is transferred to your wallet. The amount depends on what the owner set for that question.

---

## Features & Limitations

### Q: Does SimpleTriviaGame have a leaderboard?
**A:** No, not in the current version (v1.0). A leaderboard will be added in TriviaGameV2 (planned for Q2 2026).

### Q: Can I register a username?
**A:** No, not in SimpleTriviaGame v1.0. Username registration is planned for TriviaGameV2.

### Q: Does it use Chainlink VRF?
**A:** No, SimpleTriviaGame does not use Chainlink VRF. Questions are not randomly selected per session. TriviaGameV2 will include VRF for random question selection.

### Q: Can I play game sessions with 10 questions?
**A:** Not in SimpleTriviaGame v1.0. Game sessions will be added in TriviaGameV2.

### Q: Are there speed bonuses?
**A:** No, SimpleTriviaGame doesn't track question answering speed. Bonuses are planned for TriviaGameV2.

### Q: Is there weekly reward distribution?
**A:** No, SimpleTriviaGame has direct rewards per question. Weekly pools are planned for TriviaGameV2.

---

## Version Questions

### Q: Why isn't TriviaGameV2 deployed instead of SimpleTriviaGame?
**A:** SimpleTriviaGame was deliberately deployed as a minimal, production-ready version. It demonstrates Web3 integration, manages questions reliably, and distributes rewards safely. TriviaGameV2 with advanced features is planned for later.

### Q: Will SimpleTriviaGame be replaced?
**A:** No, when TriviaGameV2 launches, both contracts will coexist. SimpleTriviaGame will continue to work.

### Q: Can I migrate my score to TriviaGameV2?
**A:** That's still being decided. Your scores on SimpleTriviaGame will remain on-chain permanently either way.

### Q: When is TriviaGameV2 coming?
**A:** Planned for Q2 2026. See [ROADMAP.md](ROADMAP.md) for details.

### Q: What features are confirmed for V2?
**A:** Confirmed:
- Chainlink VRF for random questions
- Leaderboard system
- Username registration
- Game sessions

See [ROADMAP.md](ROADMAP.md) for full details.

---

## Technical Questions

### Q: Do I need to approve USDC for the contract?
**A:** No, the contract owner funds the contract with USDC. Players don't need to approve anything.

### Q: Is the contract audited?
**A:** SimpleTriviaGame uses standard OpenZeppelin patterns. Full audit details available upon request.

### Q: Can I see the contract code?
**A:** Yes, it's verified on BaseScan: https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d

### Q: How much gas does it cost to answer a question?
**A:** Gas costs vary based on network conditions, but expect 100k-200k gas.

### Q: What if the contract runs out of USDC?
**A:** Questions will fail to pay rewards if the contract balance is insufficient. The owner should monitor and refund as needed.

### Q: Can I check my score on-chain?
**A:** Yes, call `contract.getUserScore(yourAddress)` to see your total correct answers.

### Q: How do I verify my answer was recorded?
**A:** Listen for the `AnswerSubmitted` event on the contract or check your transaction hash on BaseScan.

---

## Integration Questions

### Q: How do I integrate SimpleTriviaGame into my frontend?
**A:** See [INTEGRATION_EXAMPLES.md](INTEGRATION_EXAMPLES.md) for TypeScript, React, and Vue code examples.

### Q: What tools should I use?
**A:** We recommend:
- **Wagmi** - React hooks for Ethereum
- **Viem** - Ethereum utilities
- **ethers.js** - Alternative to Wagmi
- **web3.js** - Traditional Web3 library

### Q: Is there an ABI I can use?
**A:** Yes, get it from:
- BaseScan contract page (Read/Write tabs)
- `contracts/src/SimpleTriviaGame.sol` in source
- Generate with `forge inspect contracts/src/SimpleTriviaGame.sol:SimpleTriviaGame abi`

### Q: How do I know if an answer is correct?
**A:** The frontend determines if the selected index matches the stored `correctOption`. The contract doesn't validate answers - the frontend UI does.

### Q: Can I build a custom interface for SimpleTriviaGame?
**A:** Absolutely! The contract is fully open source and you can build any interface you want.

---

## User Questions

### Q: How many times can I answer the same question?
**A:** As many times as you want. Each correct answer updates your score and sends rewards.

### Q: Are my answers tracked?
**A:** User scores are tracked via the `userScores` mapping. Individual answer history can be tracked by listening to `AnswerSubmitted` events.

### Q: Can I see other players' scores?
**A:** Not on-chain in SimpleTriviaGame. No global leaderboard exists. This is coming in TriviaGameV2.

### Q: What if I select the wrong answer?
**A:** You don't receive any reward, but your score doesn't decrease. You can try again with another question.

### Q: Is there a time limit to answer?
**A:** No time limit in SimpleTriviaGame. You can take as long as you want to answer each question.

### Q: Can I play on mobile?
**A:** Yes, as long as you have a Web3 wallet app with access to Base network.

### Q: What wallets are supported?
**A:** Any wallet that supports Base network, including:
- MetaMask
- Coinbase Wallet
- Ledger
- Trezor
- WalletConnect-compatible wallets

---

## Rewards Questions

### Q: Are rewards in ETH or USDC?
**A:** Rewards are in USDC, a stable coin pegged to USD.

### Q: How much can I earn per question?
**A:** Depends on what the owner sets. Different questions can have different reward amounts.

### Q: What's the maximum I can earn?
**A:** No fixed maximum. The contract owner controls reward amounts.

### Q: When do I get paid?
**A:** Immediately after answering correctly. The transaction confirms and USDC is in your wallet.

### Q: Can I withdraw my earned USDC?
**A:** Yes, your wallet receives USDC directly. You can transfer it anywhere.

### Q: What if the contract doesn't have enough USDC?
**A:** The transaction will fail. The owner needs to fund the contract.

---

## Security Questions

### Q: Is SimpleTriviaGame safe?
**A:** Yes. It uses OpenZeppelin Ownable for access control and SafeERC20 for token transfers. It's been deployed and tested on mainnet.

### Q: Can I lose my USDC?
**A:** No, rewards only increase your USDC balance. There's no way to lose funds by playing.

### Q: What if I find a vulnerability?
**A:** Please report it responsibly to the team via GitHub issues or email.

### Q: Is the frontend safe?
**A:** We recommend reviewing the frontend code and deploying it yourself. Verify contract addresses before interacting.

### Q: Can the owner steal my rewards?
**A:** No, once USDC is transferred to your wallet, the owner cannot take it back.

---

## Documentation Questions

### Q: Where's the API documentation?
**A:** See [SIMPLE_TRIVIA_GAME_SPEC.md](contracts/SIMPLE_TRIVIA_GAME_SPEC.md) for complete API docs.

### Q: Is there a quick reference?
**A:** Yes, see [DEVELOPER_QUICK_REFERENCE.md](DEVELOPER_QUICK_REFERENCE.md).

### Q: Where do I find integration examples?
**A:** See [INTEGRATION_EXAMPLES.md](INTEGRATION_EXAMPLES.md) for code samples.

### Q: What about the roadmap?
**A:** See [ROADMAP.md](ROADMAP.md) for feature roadmap and timeline.

### Q: Is there a migration guide?
**A:** See [CONTRACT_VERSION_CLARIFICATION.md](CONTRACT_VERSION_CLARIFICATION.md) for version details.

---

## Contributing Questions

### Q: Can I suggest features?
**A:** Yes! Open a GitHub issue labeled `enhancement` or `feature-request`.

### Q: Can I contribute code?
**A:** Yes! Fork the repo, make changes, and submit a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Q: Can I help with TriviaGameV2?
**A:** Absolutely! Comment on the roadmap issue or open a discussion.

### Q: Are there bounties for bug reports?
**A:** Check GitHub issues for bounty-tagged items.

---

## Troubleshooting

### Q: I can't connect my wallet.
**A:** 
1. Ensure you're on Base Mainnet (Chain ID: 8453)
2. Try different wallets
3. Clear browser cache
4. Check wallet extension is enabled

### Q: My transaction failed.
**A:**
1. Check BaseScan for error details
2. Ensure sufficient gas (100k-200k)
3. Verify contract has USDC balance
4. Try again with higher gas price

### Q: I'm not seeing rewards.
**A:**
1. Confirm transaction succeeded on BaseScan
2. Check contract address is correct
3. Refresh wallet to update balance
4. Check USDC token in your wallet

### Q: The contract says "question not active".
**A:** The question was deactivated by the owner. Try a different question ID.

### Q: No events are showing up.
**A:** Events are emitted on-chain. You need to listen from your frontend or check BaseScan.

---

## Getting Help

### Resources
1. **Documentation:** README.md, ROADMAP.md, specs
2. **Code Examples:** INTEGRATION_EXAMPLES.md
3. **Quick Reference:** DEVELOPER_QUICK_REFERENCE.md
4. **Contract Source:** contracts/src/SimpleTriviaGame.sol
5. **BaseScan:** https://basescan.org/address/0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d

### Contact
1. Open a GitHub issue
2. Submit a discussion
3. Check existing issues for answers
4. Review documentation thoroughly

---

**Last Updated:** January 26, 2026  
**FAQ Version:** 1.0

## Still Have Questions?

- Check the docs directory for detailed guides
- Review contract source code
- Open an issue on GitHub
- Follow the project for updates
