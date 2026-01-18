import { StateCreator } from 'zustand';
import { Achievement, AchievementState } from '@/types/achievement';

const calculateStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;
  const sortedDates = [...dates].sort();
  let streak = 1;
  for (let i = sortedDates.length - 2; i >= 0; i--) {
    const prev = new Date(sortedDates[i]);
    const curr = new Date(sortedDates[i + 1]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const calculateStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort();
  let streak = 1;
  let maxStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }
  return maxStreak;
};

export interface AchievementActions {
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;
  updateGlobalStats: (stats: Partial<AchievementState['globalStats']>) => void;
  checkAchievements: () => void;
  updatePlayDate: () => void;
}

export type AchievementSlice = AchievementState & AchievementActions;

const initialAchievements: Achievement[] = [
  {
    id: 'first-answer',
    title: 'First Answer',
    description: 'Answer your first question',
    icon: '🎯',
    category: 'milestone',
    isUnlocked: false,
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 10 answers correct in a row',
    icon: '🔥',
    category: 'skill',
    target: 10,
    progress: 0,
    isUnlocked: false,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Answer in under 5 seconds',
    icon: '⚡',
    category: 'time',
    isUnlocked: false,
  },
  {
    id: 'trivia-master',
    title: 'Trivia Master',
    description: 'Answer 100 questions total',
    icon: '👑',
    category: 'milestone',
    target: 100,
    progress: 0,
    isUnlocked: false,
  },
  {
    id: 'streak-champion',
    title: 'Streak Champion',
    description: '7-day answer streak',
    icon: '🗓️',
    category: 'streak',
    target: 7,
    progress: 0,
    isUnlocked: false,
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Play before 8am',
    icon: '🌅',
    category: 'time',
    isUnlocked: false,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Play after 10pm',
    icon: '🦉',
    category: 'time',
    isUnlocked: false,
  },
];

export const createAchievementSlice: StateCreator<
  AchievementSlice,
  [['zustand/immer', never], ['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  AchievementSlice
> = (set, get) => ({
  achievements: initialAchievements,
  globalStats: {
    totalAnswers: 0,
    totalCorrectAnswers: 0,
    highestStreak: 0,
    dailyStreak: 0,
    playDates: [],
  },

  unlockAchievement: (id) =>
    set(
      (state) => {
        const achievement = state.achievements.find((a) => a.id === id);
        if (achievement && !achievement.isUnlocked) {
          achievement.isUnlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          achievement.progress = achievement.target;
          
          // Add notification logic here later
          console.log(`Achievement Unlocked: ${achievement.title}`);
        }
      },
      false,
      'achievement/unlockAchievement'
    ),

  updateAchievementProgress: (id, progress) =>
    set(
      (state) => {
        const achievement = state.achievements.find((a) => a.id === id);
        if (achievement && !achievement.isUnlocked) {
          achievement.progress = progress;
          if (achievement.target && progress >= achievement.target) {
            achievement.isUnlocked = true;
            achievement.unlockedAt = new Date().toISOString();
          }
        }
      },
      false,
      'achievement/updateAchievementProgress'
    ),

  updateGlobalStats: (stats) =>
    set(
      (state) => {
        state.globalStats = { ...state.globalStats, ...stats };
      },
      false,
      'achievement/updateGlobalStats'
    ),

  checkAchievements: () => {
    const state = get();
    const gameState = (state as any).playerStats;
    const globalStats = state.globalStats;

    // Sync global stats from game state
    if (gameState) {
      state.updateGlobalStats({
        totalAnswers: gameState.totalQuestions,
        totalCorrectAnswers: gameState.correctAnswers,
        highestStreak: gameState.highestStreak,
      });
    }

    const achievements = state.achievements;

    // First Answer
    if (globalStats.totalAnswers >= 1 && !achievements.find(a => a.id === 'first-answer')?.isUnlocked) {
      state.unlockAchievement('first-answer');
    }

    // Perfect Score
    if (gameState?.highestStreak >= 10 && !achievements.find(a => a.id === 'perfect-score')?.isUnlocked) {
      state.unlockAchievement('perfect-score');
    }

    // Trivia Master
    if (globalStats.totalAnswers >= 100 && !achievements.find(a => a.id === 'trivia-master')?.isUnlocked) {
      state.unlockAchievement('trivia-master');
    }

    // Streak Champion - need to implement daily streak logic
    // For now, placeholder
  },

  updatePlayDate: () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    set(
      (state) => {
        if (!state.globalStats.playDates.includes(today)) {
          state.globalStats.playDates.push(today);
          // Sort and calculate streak
          state.globalStats.playDates.sort();
          state.globalStats.dailyStreak = calculateStreak(state.globalStats.playDates);
        }
      },
      false,
      'achievement/updatePlayDate'
    );
  },
});
