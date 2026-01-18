import type { Meta, StoryObj } from '@storybook/react';
import AchievementShowcase from '../components/AchievementShowcase';
import { Achievement } from '../types/achievement';

// Mock store for Storybook
const mockAchievements: Achievement[] = [
  {
    id: 'first-answer',
    title: 'First Answer',
    description: 'Answer your first question',
    icon: '🎯',
    category: 'milestone',
    isUnlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 10 answers correct in a row',
    icon: '🔥',
    category: 'skill',
    target: 10,
    progress: 7,
    isUnlocked: false,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Answer in under 5 seconds',
    icon: '⚡',
    category: 'time',
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'trivia-master',
    title: 'Trivia Master',
    description: 'Answer 100 questions total',
    icon: '👑',
    category: 'milestone',
    target: 100,
    progress: 45,
    isUnlocked: false,
  },
  {
    id: 'streak-champion',
    title: 'Streak Champion',
    description: '7-day answer streak',
    icon: '🗓️',
    category: 'streak',
    target: 7,
    progress: 3,
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
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Mock the store hook
const MockStoreProvider = ({ children }: { children: React.ReactNode }) => {
  // This would normally be handled by Zustand, but for Storybook we'll use context or direct props
  return <div>{children}</div>;
};

const meta: Meta<typeof AchievementShowcase> = {
  title: 'Components/AchievementShowcase',
  component: AchievementShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A showcase component for displaying user achievements with progress tracking.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
          <Story />
        </div>
      </MockStoreProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AchievementShowcase>;

export const Default: Story = {
  parameters: {
    mockData: {
      achievements: mockAchievements,
    },
  },
};

export const AllUnlocked: Story = {
  parameters: {
    mockData: {
      achievements: mockAchievements.map(a => ({ ...a, isUnlocked: true, unlockedAt: new Date().toISOString() })),
    },
  },
};

export const NoProgress: Story = {
  parameters: {
    mockData: {
      achievements: mockAchievements.map(a => ({ ...a, isUnlocked: false, progress: 0 })),
    },
  },
};