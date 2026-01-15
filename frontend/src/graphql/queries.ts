import { gql } from '@apollo/client';

export const GET_LEADERBOARD = gql`
  query GetLeaderboard($first: Int!, $skip: Int) {
    players(
      first: $first
      skip: $skip
      orderBy: totalScore
      orderDirection: desc
    ) {
      id
      address
      totalScore
      correctAnswers
      totalAnswers
      totalRewards
      lastPlayedAt
    }
  }
`;

export const GET_PLAYER_STATS = gql`
  query GetPlayerStats($playerId: ID!) {
    player(id: $playerId) {
      id
      address
      totalScore
      correctAnswers
      totalAnswers
      totalRewards
      firstPlayedAt
      lastPlayedAt
      answers(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        questionId
        isCorrect
        reward
        timestamp
        question {
          questionText
        }
      }
    }
  }
`;

export const GET_RECENT_ANSWERS = gql`
  query GetRecentAnswers($first: Int!) {
    answers(first: $first, orderBy: timestamp, orderDirection: desc) {
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
      transactionHash
    }
  }
`;

export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    globalStats(id: "global") {
      totalPlayers
      totalAnswers
      totalCorrectAnswers
      totalRewardsDistributed
      totalQuestions
    }
  }
`;

export const GET_QUESTION_STATS = gql`
  query GetQuestionStats($first: Int!) {
    questions(first: $first, orderBy: totalAnswers, orderDirection: desc) {
      id
      questionId
      questionText
      totalAnswers
      correctAnswers
      rewardAmount
      createdAt
    }
  }
`;

export const GET_PLAYER_RANK = gql`
  query GetPlayerRank($playerId: ID!, $playerScore: BigInt!) {
    higherRankedPlayers: players(
      where: { totalScore_gt: $playerScore }
    ) {
      id
    }
    player(id: $playerId) {
      id
      totalScore
    }
  }
`;
