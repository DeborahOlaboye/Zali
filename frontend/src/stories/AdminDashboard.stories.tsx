import type { Meta, StoryObj } from '@storybook/react';
import AdminDashboard from '../components/AdminDashboard';
import { Category, Difficulty } from '../types/question';

// Mock data for the dashboard
const mockStats = {
  totalQuestions: 85,
  questionsByCategory: {
    [Category.GEOGRAPHY]: 15,
    [Category.HISTORY]: 12,
    [Category.SCIENCE]: 18,
    [Category.SPORTS]: 10,
    [Category.ENTERTAINMENT]: 16,
    [Category.LITERATURE]: 14,
  },
  questionsByDifficulty: {
    [Difficulty.EASY]: 30,
    [Difficulty.MEDIUM]: 35,
    [Difficulty.HARD]: 20,
  },
  pendingSubmissions: 5,
  recentActivity: [
    {
      id: '1',
      type: 'submission',
      message: 'New question submitted: "What is the largest planet?"',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      type: 'approval',
      message: 'Question approved: "Who wrote Romeo and Juliet?"',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '3',
      type: 'rejection',
      message: 'Question rejected: Duplicate entry',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
  ],
};

const meta: Meta<typeof AdminDashboard> = {
  title: 'Components/AdminDashboard',
  component: AdminDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An administrative dashboard for managing trivia questions, viewing statistics, and handling submissions.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AdminDashboard>;

export const Default: Story = {
  parameters: {
    mockData: {
      stats: mockStats,
    },
  },
};

export const LowActivity: Story = {
  parameters: {
    mockData: {
      stats: {
        ...mockStats,
        totalQuestions: 25,
        pendingSubmissions: 0,
        recentActivity: [],
      },
    },
  },
};

export const HighActivity: Story = {
  parameters: {
    mockData: {
      stats: {
        ...mockStats,
        totalQuestions: 150,
        pendingSubmissions: 23,
        recentActivity: [
          ...mockStats.recentActivity,
          {
            id: '4',
            type: 'submission',
            message: 'New question submitted: "What is quantum entanglement?"',
            timestamp: new Date().toISOString(),
          },
          {
            id: '5',
            type: 'approval',
            message: 'Question approved: "Who discovered penicillin?"',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
          },
        ],
      },
    },
  },
};