import type { Meta, StoryObj } from '@storybook/react';
import Progress from '../components/Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A progress bar component for showing completion status and loading progress.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Progress value (0-100)',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error'],
      description: 'Progress bar variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Progress bar size',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Whether to show percentage label',
    },
    animated: {
      control: { type: 'boolean' },
      description: 'Whether the progress bar is animated',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 65,
    max: 100,
    variant: 'default',
    size: 'md',
    showLabel: true,
    animated: false,
  },
};

export const Zero: Story = {
  args: {
    value: 0,
    max: 100,
    variant: 'default',
    size: 'md',
    showLabel: true,
    animated: false,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    max: 100,
    variant: 'success',
    size: 'md',
    showLabel: true,
    animated: false,
  },
};

export const Success: Story = {
  args: {
    value: 75,
    max: 100,
    variant: 'success',
    size: 'md',
    showLabel: true,
    animated: false,
  },
};

export const Warning: Story = {
  args: {
    value: 85,
    max: 100,
    variant: 'warning',
    size: 'md',
    showLabel: true,
    animated: false,
  },
};

export const Error: Story = {
  args: {
    value: 25,
    max: 100,
    variant: 'error',
    size: 'md',
    showLabel: true,
    animated: false,
  },
};

export const Small: Story = {
  args: {
    value: 50,
    max: 100,
    variant: 'default',
    size: 'sm',
    showLabel: false,
    animated: false,
  },
};

export const Large: Story = {
  args: {
    value: 50,
    max: 100,
    variant: 'default',
    size: 'lg',
    showLabel: true,
    animated: false,
  },
};

export const Animated: Story = {
  args: {
    value: 60,
    max: 100,
    variant: 'default',
    size: 'md',
    showLabel: true,
    animated: true,
  },
};

export const NoLabel: Story = {
  args: {
    value: 40,
    max: 100,
    variant: 'default',
    size: 'md',
    showLabel: false,
    animated: false,
  },
};