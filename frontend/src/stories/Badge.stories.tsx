import type { Meta, StoryObj } from '@storybook/react';
import Badge from '../components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A badge component for displaying status, labels, or notifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Badge color variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    children: {
      control: { type: 'text' },
      description: 'Badge content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Primary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'md',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    size: 'md',
    children: 'Warning',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    size: 'md',
    children: 'Error',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
    children: 'Large Badge',
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Badge {...args}>
      <span className="mr-1">★</span>
      Premium
    </Badge>
  ),
  args: {
    variant: 'primary',
    size: 'md',
  },
};