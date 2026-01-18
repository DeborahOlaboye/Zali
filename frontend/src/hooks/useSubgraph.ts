import { useQuery } from '@apollo/client';
import {
  GET_LEADERBOARD,
  GET_PLAYER_STATS,
  GET_RECENT_ANSWERS,
  GET_GLOBAL_STATS,
  GET_QUESTION_STATS,
  GET_PLAYER_RANK,
} from '@/graphql/queries';

export interface Player {
  id: string;
  address: string;
  totalScore: string;
  correctAnswers: string;
  totalAnswers: string;
  totalRewards: string;
  lastPlayedAt: string;
}

export interface PlayerStats extends Player {
  firstPlayedAt: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  isCorrect: boolean;
  reward: string;
  timestamp: string;
  question?: {
    questionText: string;
  };
  player?: {
    address: string;
    totalScore: string;
  };
  transactionHash?: string;
}

export interface GlobalStats {
  totalPlayers: string;
  totalAnswers: string;
  totalCorrectAnswers: string;
  totalRewardsDistributed: string;
  totalQuestions: string;
}

export interface QuestionStats {
  id: string;
  questionId: string;
  questionText: string;
  totalAnswers: string;
  correctAnswers: string;
  rewardAmount: string;
  createdAt: string;
}

export function useLeaderboardSubgraph(limit: number = 10, skip: number = 0) {
  const { data, loading, error, refetch } = useQuery(GET_LEADERBOARD, {
    variables: { first: limit, skip },
    pollInterval: 30000, // Poll every 30 seconds
  });

  return {
    players: (data?.players as Player[]) || [],
    loading,
    error,
    refetch,
  };
}

export function usePlayerStats(playerId: string) {
  const { data, loading, error, refetch } = useQuery(GET_PLAYER_STATS, {
    variables: { playerId: playerId.toLowerCase() },
    skip: !playerId,
    pollInterval: 30000,
  });

  return {
    player: data?.player as PlayerStats | null,
    loading,
    error,
    refetch,
  };
}

export function useRecentAnswers(limit: number = 20) {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_ANSWERS, {
    variables: { first: limit },
    pollInterval: 30000,
  });

  return {
    answers: (data?.answers as Answer[]) || [],
    loading,
    error,
    refetch,
  };
}

export function useGlobalStats() {
  const { data, loading, error, refetch } = useQuery(GET_GLOBAL_STATS, {
    pollInterval: 60000, // Poll every 60 seconds
  });

  return {
    stats: data?.globalStats as GlobalStats | null,
    loading,
    error,
    refetch,
  };
}

export function useQuestionStats(limit: number = 10) {
  const { data, loading, error, refetch } = useQuery(GET_QUESTION_STATS, {
    variables: { first: limit },
    pollInterval: 60000,
  });

  return {
    questions: (data?.questions as QuestionStats[]) || [],
    loading,
    error,
    refetch,
  };
}

export function usePlayerRank(playerId: string, playerScore: string) {
  const { data, loading, error } = useQuery(GET_PLAYER_RANK, {
    variables: {
      playerId: playerId.toLowerCase(),
      playerScore,
    },
    skip: !playerId || !playerScore,
  });

  const rank = data?.higherRankedPlayers?.length
    ? data.higherRankedPlayers.length + 1
    : 1;

  return {
    rank,
    loading,
    error,
  };
}
