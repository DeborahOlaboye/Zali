import type { Meta, StoryObj } from '@storybook/react';
import ProgressBar from '../components/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress bar component with animated progress and optional number display.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Current progress value',
    },
    total: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Total progress value',
    },
    showNumbers: {
      control: 'boolean',
      description: 'Whether to show the current/total numbers',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    current: 3,
    total: 10,
    showNumbers: true,
  },
};

export const Halfway: Story = {
  args: {
    current: 5,
    total: 10,
    showNumbers: true,
  },
};

export const Complete: Story = {
  args: {
    current: 10,
    total: 10,
    showNumbers: true,
  },
};

export const WithoutNumbers: Story = {
  args: {
    current: 7,
    total: 10,
    showNumbers: false,
  },
};

export const SmallProgress: Story = {
  args: {
    current: 1,
    total: 10,
    showNumbers: true,
  },
};