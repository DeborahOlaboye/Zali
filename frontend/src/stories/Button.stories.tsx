import type { Meta, StoryObj } from '@storybook/react';
import Button from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      description: 'Button color variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether to show loading state',
    },
    children: {
      control: { type: 'text' },
      description: 'Button content',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Primary Button',
    onClick: () => console.log('Primary button clicked'),
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: 'Secondary Button',
    onClick: () => console.log('Secondary button clicked'),
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'md',
    children: 'Success Button',
    onClick: () => console.log('Success button clicked'),
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md',
    children: 'Danger Button',
    onClick: () => console.log('Danger button clicked'),
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
    onClick: () => console.log('Small button clicked'),
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
    onClick: () => console.log('Large button clicked'),
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: 'Disabled Button',
    onClick: () => console.log('Disabled button clicked'),
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    loading: true,
    children: 'Loading Button',
    onClick: () => console.log('Loading button clicked'),
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <span className="mr-2">🚀</span>
      Launch
    </Button>
  ),
  args: {
    variant: 'primary',
    size: 'md',
    onClick: () => console.log('Button with icon clicked'),
  },
};