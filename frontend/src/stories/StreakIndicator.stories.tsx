import type { Meta, StoryObj } from '@storybook/react';
import StreakIndicator from '../components/StreakIndicator';

const meta: Meta<typeof StreakIndicator> = {
  title: 'Components/StreakIndicator',
  component: StreakIndicator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component that displays the current answer streak with visual indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentStreak: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'Current consecutive correct answers',
    },
    bestStreak: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Personal best streak',
    },
    isAnimating: {
      control: { type: 'boolean' },
      description: 'Whether to show streak increase animation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreakIndicator>;

export const NoStreak: Story = {
  args: {
    currentStreak: 0,
    bestStreak: 5,
    isAnimating: false,
  },
};

export const SmallStreak: Story = {
  args: {
    currentStreak: 3,
    bestStreak: 8,
    isAnimating: false,
  },
};

export const BigStreak: Story = {
  args: {
    currentStreak: 12,
    bestStreak: 15,
    isAnimating: false,
  },
};

export const NewRecord: Story = {
  args: {
    currentStreak: 16,
    bestStreak: 15,
    isAnimating: true,
  },
};

export const Animating: Story = {
  args: {
    currentStreak: 5,
    bestStreak: 12,
    isAnimating: true,
  },
};