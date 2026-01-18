import type { Meta, StoryObj } from '@storybook/react';
import Leaderboard from '../components/Leaderboard';

// Mock leaderboard data
const mockLeaderboardData = [
  {
    rank: 1,
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    displayName: 'CryptoMaster',
    score: 9850,
    gamesPlayed: 45,
    winRate: 87,
    achievements: 12,
  },
  {
    rank: 2,
    address: '0x8ba1f109551bd432803012645ac136ddd64dba72',
    displayName: 'TriviaKing',
    score: 9420,
    gamesPlayed: 38,
    winRate: 92,
    achievements: 10,
  },
  {
    rank: 3,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    displayName: 'QuizWizard',
    score: 9180,
    gamesPlayed: 52,
    winRate: 78,
    achievements: 15,
  },
  {
    rank: 4,
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    displayName: 'BrainBuster',
    score: 8750,
    gamesPlayed: 41,
    winRate: 85,
    achievements: 8,
  },
  {
    rank: 5,
    address: '0x567890abcdef1234567890abcdef1234567890ab',
    displayName: 'KnowledgeNinja',
    score: 8420,
    gamesPlayed: 35,
    winRate: 91,
    achievements: 9,
  },
];

const meta: Meta<typeof Leaderboard> = {
  title: 'Components/Leaderboard',
  component: Leaderboard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A leaderboard component displaying top players with their scores and statistics.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Leaderboard>;

export const Default: Story = {
  parameters: {
    mockData: {
      leaderboard: mockLeaderboardData,
    },
  },
};

export const Loading: Story = {
  parameters: {
    mockData: {
      leaderboard: [],
      isLoading: true,
    },
  },
};

export const Empty: Story = {
  parameters: {
    mockData: {
      leaderboard: [],
    },
  },
};

export const TopThree: Story = {
  parameters: {
    mockData: {
      leaderboard: mockLeaderboardData.slice(0, 3),
    },
  },
};