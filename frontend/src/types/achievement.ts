export type AchievementCategory = 'milestone' | 'streak' | 'time' | 'skill';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  isUnlocked: boolean;
}

export interface AchievementState {
  achievements: Achievement[];
  globalStats: {
    totalAnswers: number;
    totalCorrectAnswers: number;
    highestStreak: number;
    dailyStreak: number;
    lastPlayDate?: string;
    playDates: string[]; // ISO dates of days played
  };
}
