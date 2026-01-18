import type { Meta, StoryObj } from '@storybook/react';
import { RewardCard } from '../components/RewardCard';

const meta: Meta<typeof RewardCard> = {
  title: 'Components/RewardCard',
  component: RewardCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reward card component for displaying different types of rewards with icons and actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the reward card',
    },
    amount: {
      control: 'text',
      description: 'Amount or value displayed',
    },
    description: {
      control: 'text',
      description: 'Description of the reward',
    },
    color: {
      control: 'text',
      description: 'CSS classes for the icon color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RewardCard>;

export const Default: Story = {
  args: {
    icon: <span className="text-3xl">🎁</span>,
    title: 'Daily Reward',
    amount: '0.05 cUSD',
    description: 'Complete your daily trivia challenge',
    color: 'text-blue-600',
  },
};

export const WithAction: Story = {
  args: {
    icon: <span className="text-3xl">🏆</span>,
    title: 'Achievement Bonus',
    amount: '0.10 cUSD',
    description: 'Unlock a new achievement',
    color: 'text-yellow-600',
    action: (
      <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
        Claim Now
      </button>
    ),
  },
};

export const StreakReward: Story = {
  args: {
    icon: <span className="text-3xl">🔥</span>,
    title: 'Streak Bonus',
    amount: '0.15 cUSD',
    description: '7-day answer streak maintained',
    color: 'text-red-600',
  },
};

export const ReferralReward: Story = {
  args: {
    icon: <span className="text-3xl">👥</span>,
    title: 'Referral Bonus',
    amount: '0.20 cUSD',
    description: 'Friend joined using your link',
    color: 'text-green-600',
  },
};

export const SpecialReward: Story = {
  args: {
    icon: <span className="text-3xl">⭐</span>,
    title: 'Special Event',
    amount: '0.50 cUSD',
    description: 'Participate in special event',
    color: 'text-purple-600',
    action: (
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
        Join Event
      </button>
    ),
  },
};