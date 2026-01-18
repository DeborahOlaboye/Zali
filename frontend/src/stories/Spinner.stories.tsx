import type { Meta, StoryObj } from '@storybook/react';
import Spinner from '../components/Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A loading spinner component with different sizes and colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Spinner size',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'white'],
      description: 'Spinner color',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: {
    size: 'sm',
    color: 'primary',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    color: 'primary',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    color: 'primary',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    size: 'md',
    color: 'secondary',
  },
};

export const White: Story = {
  args: {
    size: 'md',
    color: 'white',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const InButton: Story = {
  render: () => (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2">
      <Spinner size="sm" color="white" />
      <span>Loading...</span>
    </button>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="p-6 bg-white border rounded-lg shadow-sm flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-600">Loading content...</p>
      </div>
    </div>
  ),
};