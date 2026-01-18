import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from '../components/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A skeleton loading component that shows placeholder content while data is loading.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'circular', 'rectangular'],
      description: 'Skeleton shape variant',
    },
    width: {
      control: { type: 'text' },
      description: 'Skeleton width (CSS value)',
    },
    height: {
      control: { type: 'text' },
      description: 'Skeleton height (CSS value)',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: '200px',
    height: '16px',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: '40px',
    height: '40px',
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: '300px',
    height: '200px',
  },
};

export const MultipleLines: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton variant="text" width="100%" height="20px" />
      <Skeleton variant="text" width="80%" height="20px" />
      <Skeleton variant="text" width="60%" height="20px" />
    </div>
  ),
};

export const AvatarWithText: Story = {
  render: () => (
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width="48px" height="48px" />
      <div className="space-y-2">
        <Skeleton variant="text" width="150px" height="18px" />
        <Skeleton variant="text" width="100px" height="14px" />
      </div>
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton variant="rectangular" width="100%" height="150px" />
      <Skeleton variant="text" width="80%" height="20px" />
      <Skeleton variant="text" width="60%" height="16px" />
      <div className="flex space-x-2">
        <Skeleton variant="circular" width="32px" height="32px" />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" width="100px" height="14px" />
          <Skeleton variant="text" width="80px" height="12px" />
        </div>
      </div>
    </div>
  ),
};