import type { Meta, StoryObj } from '@storybook/react';
import RewardAnimation from '../components/RewardAnimation';

const meta: Meta<typeof RewardAnimation> = {
  title: 'Components/RewardAnimation',
  component: RewardAnimation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An animated component that displays rewards and celebrations for achievements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    rewardType: {
      control: { type: 'select' },
      options: ['coins', 'trophy', 'star', 'fire', 'lightning'],
      description: 'Type of reward animation',
    },
    amount: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Amount of reward (for coins)',
    },
    isVisible: {
      control: { type: 'boolean' },
      description: 'Whether the animation is visible',
    },
    onComplete: {
      action: 'animationCompleted',
      description: 'Callback fired when animation completes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RewardAnimation>;

export const Coins: Story = {
  args: {
    rewardType: 'coins',
    amount: 50,
    isVisible: true,
    onComplete: () => console.log('Animation completed'),
  },
};

export const Trophy: Story = {
  args: {
    rewardType: 'trophy',
    isVisible: true,
    onComplete: () => console.log('Animation completed'),
  },
};

export const Star: Story = {
  args: {
    rewardType: 'star',
    isVisible: true,
    onComplete: () => console.log('Animation completed'),
  },
};

export const Fire: Story = {
  args: {
    rewardType: 'fire',
    isVisible: true,
    onComplete: () => console.log('Animation completed'),
  },
};

export const Lightning: Story = {
  args: {
    rewardType: 'lightning',
    isVisible: true,
    onComplete: () => console.log('Animation completed'),
  },
};

export const Hidden: Story = {
  args: {
    rewardType: 'coins',
    amount: 100,
    isVisible: false,
    onComplete: () => console.log('Animation completed'),
  },
};