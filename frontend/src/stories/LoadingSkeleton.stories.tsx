import type { Meta, StoryObj } from '@storybook/react';
import LoadingSkeleton from '../components/LoadingSkeleton';

const meta: Meta<typeof LoadingSkeleton> = {
  title: 'Components/LoadingSkeleton',
  component: LoadingSkeleton,
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
      options: ['text', 'circular', 'rectangular', 'card'],
      description: 'The shape variant of the skeleton',
    },
    width: {
      control: { type: 'text' },
      description: 'Width of the skeleton (CSS value)',
    },
    height: {
      control: { type: 'text' },
      description: 'Height of the skeleton (CSS value)',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSkeleton>;

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

export const Card: Story = {
  args: {
    variant: 'card',
    width: '300px',
    height: '150px',
  },
};

export const MultipleLines: Story = {
  render: () => (
    <div className="space-y-2">
      <LoadingSkeleton variant="text" width="100%" height="20px" />
      <LoadingSkeleton variant="text" width="80%" height="20px" />
      <LoadingSkeleton variant="text" width="60%" height="20px" />
    </div>
  ),
};

export const AvatarWithText: Story = {
  render: () => (
    <div className="flex items-center space-x-3">
      <LoadingSkeleton variant="circular" width="48px" height="48px" />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" width="150px" height="18px" />
        <LoadingSkeleton variant="text" width="100px" height="14px" />
      </div>
    </div>
  ),
};