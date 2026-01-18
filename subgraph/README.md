# Zali Trivia Game Subgraph

This subgraph indexes on-chain events from the SimpleTriviaGame contract deployed on Base Mainnet, providing fast and efficient queries for leaderboard data, player statistics, and game analytics.

## Overview

The subgraph tracks:
- **Players**: Individual player statistics including scores, answers, and rewards
- **Questions**: Question metadata and answer statistics
- **Answers**: Individual answer records with timestamps and correctness
- **Global Stats**: Overall game statistics

## Contract Details

- **Network**: Base Mainnet
- **Contract Address**: `0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d`
- **Start Block**: 23000000

## Entities

### Player
- `id`: Player's Ethereum address
- `address`: Player's address as bytes
- `totalScore`: Total number of correct answers
- `correctAnswers`: Count of correct answers
- `totalAnswers`: Total number of answers submitted
- `totalRewards`: Total USDC rewards earned
- `firstPlayedAt`: Timestamp of first answer
- `lastPlayedAt`: Timestamp of most recent answer
- `answers`: List of all answers submitted by player

### Question
- `id`: Question ID
- `questionId`: On-chain question ID
- `questionText`: The question text
- `rewardAmount`: Reward amount in USDC
- `createdAt`: Creation timestamp
- `createdAtBlock`: Block number when created
- `totalAnswers`: Total times this question was answered
- `correctAnswers`: Total correct answers for this question

### Answer
- `id`: Unique answer ID (txHash-logIndex)
- `player`: Reference to player
- `question`: Reference to question
- `isCorrect`: Whether answer was correct
- `reward`: Reward amount received
- `timestamp`: Answer submission timestamp
- `blockNumber`: Block number
- `transactionHash`: Transaction hash

### GlobalStats
- `id`: Always "global"
- `totalPlayers`: Total unique players
- `totalAnswers`: Total answers submitted
- `totalCorrectAnswers`: Total correct answers
- `totalRewardsDistributed`: Total USDC distributed
- `totalQuestions`: Total questions added

## Setup

### Prerequisites
- Node.js >= 16
- The Graph CLI

### Installation

```bash
# Install dependencies
npm install

# Install The Graph CLI globally (if not already installed)
npm install -g @graphprotocol/graph-cli
```

### Build

```bash
# Generate types from schema
npm run codegen

# Build the subgraph
npm run build
```

## Deployment

### Deploy to The Graph Studio

1. Create a subgraph on [The Graph Studio](https://thegraph.com/studio/)
2. Get your deploy key
3. Authenticate:

```bash
graph auth --studio <DEPLOY_KEY>
```

4. Deploy:

```bash
npm run deploy
```

### Local Development

```bash
# Start local graph node (in separate terminal)
# Follow: https://github.com/graphprotocol/graph-node

# Create local subgraph
npm run create-local

# Deploy to local node
npm run deploy-local
```

## Example Queries

### Get Top 10 Players by Score

```graphql
{
  players(first: 10, orderBy: totalScore, orderDirection: desc) {
    id
    address
    totalScore
    correctAnswers
    totalAnswers
    totalRewards
    lastPlayedAt
  }
}
```

### Get Player Statistics

```graphql
{
  player(id: "0x...") {
    address
    totalScore
    correctAnswers
    totalAnswers
    totalRewards
    firstPlayedAt
    lastPlayedAt
    answers(first: 10, orderBy: timestamp, orderDirection: desc) {
      questionId
      isCorrect
      reward
      timestamp
    }
  }
}
```

### Get Recent Answers

```graphql
{
  answers(first: 20, orderBy: timestamp, orderDirection: desc) {
    id
    player {
      address
      totalScore
    }
    question {
      questionText
    }
    isCorrect
    reward
    timestamp
  }
}
```

### Get Global Statistics

```graphql
{
  globalStats(id: "global") {
    totalPlayers
    totalAnswers
    totalCorrectAnswers
    totalRewardsDistributed
    totalQuestions
  }
}
```

### Get Question Statistics

```graphql
{
  questions(first: 10, orderBy: totalAnswers, orderDirection: desc) {
    questionId
    questionText
    totalAnswers
    correctAnswers
    rewardAmount
  }
}
```

## Integration with Frontend

After deployment, you'll receive a subgraph URL. Use this in your frontend with Apollo Client or urql:

```typescript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/<SUBGRAPH_ID>/zali-trivia/v1.0.0',
  cache: new InMemoryCache(),
});

// Query leaderboard
const { data } = await client.query({
  query: gql`
    query GetLeaderboard {
      players(first: 10, orderBy: totalScore, orderDirection: desc) {
        address
        totalScore
        correctAnswers
        totalRewards
      }
    }
  `,
});
```

## Performance Benefits

Compared to direct blockchain queries:
- **Faster Queries**: Pre-indexed data returns in milliseconds
- **Complex Filtering**: Sort, filter, and paginate easily
- **Historical Data**: Access complete historical records
- **Reduced RPC Calls**: No need for multiple eth_call requests
- **Real-time Updates**: Data updates within seconds of on-chain events

## Events Indexed

- `QuestionAdded(uint256 indexed questionId, string questionText, uint256 reward)`
- `AnswerSubmitted(address indexed user, uint256 questionId, bool isCorrect, uint256 reward)`

## Testing

```bash
npm run test
```

## License

MIT
