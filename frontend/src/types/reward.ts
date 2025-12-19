export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
  claimable: boolean;
}

export interface RewardClaim {
  id: string;
  userId: string;
  rewardId: string;
  amount: number;
  claimedAt: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export interface RewardHistory {
  claimId: string;
  rewardName: string;
  amount: number;
  claimedAt: string;
  status: 'completed' | 'failed';
  transactionHash?: string;
}

export interface RewardEarning {
  id: string;
  userId: string;
  type: 'game' | 'bonus' | 'streak' | 'achievement';
  amount: number;
  description: string;
  earnedAt: string;
  source?: string;
}

export interface RewardBalance {
  totalEarned: number;
  totalClaimed: number;
  pendingRewards: number;
  availableToClaim: number;
}

export interface RewardClaimRequest {
  rewardId: string;
  amount: number;
}

export interface RewardClaimResponse {
  success: boolean;
  claimId?: string;
  txHash?: string;
  amount?: number;
  error?: string;
}

export interface RewardTier {
  id: string;
  name: string;
  minPoints: number;
  maxPoints: number;
  multiplier: number;
  bonusPercentage: number;
}

export interface GameReward {
  id: string;
  gameId: string;
  correctAnswers: number;
  baseReward: number;
  speedBonus: number;
  perfectScoreBonus: number;
  totalReward: number;
  timestamp: string;
}

export interface StreakBonus {
  currentStreak: number;
  maxStreak: number;
  bonusPercentage: number;
  lastEarnedAt: string;
  nextBonusAt?: string;
}

export interface RewardStats {
  totalEarned: number;
  totalClaimed: number;
  averagePerGame: number;
  highestReward: number;
  totalGamesPlayed: number;
  pendingAmount: number;
}
