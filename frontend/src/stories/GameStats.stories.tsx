import type { Meta, StoryObj } from '@storybook/react';
import GameStats from '../components/GameStats';

// Mock game statistics data
const mockStats = {
  gamesPlayed: 42,
  totalQuestionsAnswered: 420,
  correctAnswers: 315,
  incorrectAnswers: 105,
  averageScore: 75,
  bestStreak: 12,
  currentStreak: 5,
  totalTimePlayed: 12600, // seconds
  averageTimePerQuestion: 30, // seconds
  favoriteCategory: 'Science',
  achievementsUnlocked: 8,
  totalAchievements: 15,
  winRate: 75,
  recentScores: [85, 92, 78, 88, 95, 67, 91],
};

const meta: Meta<typeof GameStats> = {
  title: 'Components/GameStats',
  component: GameStats,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component displaying comprehensive game statistics and performance metrics.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GameStats>;

export const Default: Story = {
  parameters: {
    mockData: {
      stats: mockStats,
    },
  },
};

export const BeginnerPlayer: Story = {
  parameters: {
    mockData: {
      stats: {
        ...mockStats,
        gamesPlayed: 5,
        totalQuestionsAnswered: 50,
        correctAnswers: 30,
        incorrectAnswers: 20,
        averageScore: 60,
        bestStreak: 3,
        currentStreak: 1,
        achievementsUnlocked: 2,
        winRate: 60,
        recentScores: [55, 65, 58, 72, 45],
      },
    },
  },
};

export const ExpertPlayer: Story = {
  parameters: {
    mockData: {
      stats: {
        ...mockStats,
        gamesPlayed: 150,
        totalQuestionsAnswered: 1500,
        correctAnswers: 1350,
        incorrectAnswers: 150,
        averageScore: 90,
        bestStreak: 25,
        currentStreak: 18,
        achievementsUnlocked: 15,
        winRate: 90,
        recentScores: [95, 98, 92, 97, 94, 96, 99],
      },
    },
  },
};

export const PerfectGame: Story = {
  parameters: {
    mockData: {
      stats: {
        ...mockStats,
        gamesPlayed: 1,
        totalQuestionsAnswered: 10,
        correctAnswers: 10,
        incorrectAnswers: 0,
        averageScore: 100,
        bestStreak: 10,
        currentStreak: 10,
        winRate: 100,
        recentScores: [100],
      },
    },
  },
};