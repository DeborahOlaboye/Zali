import { PlayerInfo, GameSession, LeaderboardEntry, RewardInfo, AllowanceInfo } from './contract';
import { User, UserStatistics } from './user';
import { ApiException } from './errors';

export interface UsePlayerRegistrationReturn {
  playerInfo: PlayerInfo | null;
  isRegistered: boolean;
  isFetching: boolean;
  error: Error | null;
  registerUsername: (username: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  refetchPlayerInfo: () => Promise<void>;
  registerIsLoading: boolean;
  registerIsSuccess: boolean;
  updateIsLoading: boolean;
  updateIsSuccess: boolean;
}

export interface UseGameSessionReturn {
  sessionId: bigint | null;
  gameSession: GameSession | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  startGame: () => Promise<void>;
  endGame: (score: number) => Promise<void>;
  submitAnswer: (questionIndex: number, answer: number) => Promise<boolean>;
  startGameIsLoading: boolean;
  startGameIsSuccess: boolean;
  startGameError: Error | null;
  needsApproval: boolean;
  hasSufficientApproval: boolean;
  isApprovalLoading: boolean;
  isApproving: boolean;
  isWaitingForApproval: boolean;
  approve: () => Promise<void>;
  refetchAllowance: () => Promise<void>;
}

export interface UseLeaderboardReturn {
  leaderboardData: LeaderboardEntry[];
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  refetchLeaderboard: () => Promise<void>;
  leaderboardState: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
  };
}

export interface UseRewardsReturn {
  pendingRewards: string;
  totalClaimed: string;
  isLoading: boolean;
  error: Error | null;
  claimRewards: () => Promise<void>;
  claimIsLoading: boolean;
  claimIsSuccess: boolean;
  claimIsError: boolean;
  claimError: Error | null;
  refetchPendingRewards: () => Promise<void>;
}

export interface UseCeloBalanceReturn {
  balance: string;
  isLoading: boolean;
  error: Error | null;
  refetchBalance: () => Promise<void>;
}

export interface UseContractInfoReturn {
  contractBalance: string;
  totalPlayers: bigint;
  totalGamesPlayed: bigint;
  isLoading: boolean;
  error: Error | null;
  refetchContractInfo: () => Promise<void>;
}

export interface UseQuestionsReturn {
  questions: any[];
  questionCount: number;
  isLoading: boolean;
  error: Error | null;
  refetchQuestions: () => Promise<void>;
}

export interface UseTokenApprovalReturn {
  allowance: bigint;
  isLoading: boolean;
  isApproving: boolean;
  error: Error | null;
  approve: (amount: bigint) => Promise<void>;
  refetchAllowance: () => Promise<void>;
  hasApproval: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  isValid: boolean;
  resetForm: (values?: Partial<T>) => void;
}

export interface UseContractReturnState {
  data: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

export interface UseMutationState<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: ApiException | null;
}

export interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (address: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string) => Promise<void>;
  error: Error | null;
}

export interface UseUserStatsReturn {
  stats: UserStatistics | null;
  isLoading: boolean;
  error: Error | null;
  refetchStats: () => Promise<void>;
}

export interface UseNotificationReturn {
  showNotification: (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration?: number
  ) => void;
  clearNotifications: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T | null;
  setValue: (value: T) => void;
  removeValue: () => void;
  isLoading: boolean;
}

export interface UseQueryReturn<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isFetching: boolean;
}
