import type { Meta, StoryObj } from '@storybook/react';
import Countdown from '../components/Countdown';

const meta: Meta<typeof Countdown> = {
  title: 'Components/Countdown',
  component: Countdown,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A countdown component that displays remaining time with various formats.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    targetDate: {
      control: { type: 'date' },
      description: 'Target date for countdown',
    },
    format: {
      control: { type: 'select' },
      options: ['full', 'compact', 'minimal'],
      description: 'Countdown display format',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Countdown size',
    },
    showLabels: {
      control: { type: 'boolean' },
      description: 'Whether to show time unit labels',
    },
    onComplete: {
      action: 'countdownComplete',
      description: 'Callback fired when countdown reaches zero',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Countdown>;

export const FullFormat: Story = {
  args: {
    targetDate: new Date(Date.now() + 86400000), // 24 hours from now
    format: 'full',
    size: 'md',
    showLabels: true,
    onComplete: () => console.log('Countdown completed'),
  },
};

export const CompactFormat: Story = {
  args: {
    targetDate: new Date(Date.now() + 3600000), // 1 hour from now
    format: 'compact',
    size: 'md',
    showLabels: true,
    onComplete: () => console.log('Countdown completed'),
  },
};

export const MinimalFormat: Story = {
  args: {
    targetDate: new Date(Date.now() + 300000), // 5 minutes from now
    format: 'minimal',
    size: 'md',
    showLabels: false,
    onComplete: () => console.log('Countdown completed'),
  },
};

export const SmallSize: Story = {
  args: {
    targetDate: new Date(Date.now() + 60000), // 1 minute from now
    format: 'full',
    size: 'sm',
    showLabels: true,
    onComplete: () => console.log('Countdown completed'),
  },
};

export const LargeSize: Story = {
  args: {
    targetDate: new Date(Date.now() + 180000), // 3 minutes from now
    format: 'compact',
    size: 'lg',
    showLabels: true,
    onComplete: () => console.log('Countdown completed'),
  },
};

export const GameTimer: Story = {
  args: {
    targetDate: new Date(Date.now() + 30000), // 30 seconds from now
    format: 'minimal',
    size: 'lg',
    showLabels: false,
    onComplete: () => console.log('Game time up!'),
  },
};

export const EventCountdown: Story = {
  args: {
    targetDate: new Date(Date.now() + 604800000), // 1 week from now
    format: 'full',
    size: 'md',
    showLabels: true,
    onComplete: () => console.log('Event started!'),
  },
};