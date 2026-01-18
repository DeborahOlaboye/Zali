import type { Meta, StoryObj } from '@storybook/react';
import Chip from '../components/Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A chip component for displaying small pieces of information with optional actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Chip label',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error'],
      description: 'Chip color variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Chip size',
    },
    removable: {
      control: { type: 'boolean' },
      description: 'Whether the chip can be removed',
    },
    onRemove: {
      action: 'removed',
      description: 'Callback fired when chip is removed',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when chip is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  args: {
    label: 'Default Chip',
    variant: 'default',
    size: 'md',
    removable: false,
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary Chip',
    variant: 'primary',
    size: 'md',
    removable: false,
  },
};

export const Success: Story = {
  args: {
    label: 'Success Chip',
    variant: 'success',
    size: 'md',
    removable: false,
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning Chip',
    variant: 'warning',
    size: 'md',
    removable: false,
  },
};

export const Error: Story = {
  args: {
    label: 'Error Chip',
    variant: 'error',
    size: 'md',
    removable: false,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Chip',
    variant: 'primary',
    size: 'sm',
    removable: false,
  },
};

export const Large: Story = {
  args: {
    label: 'Large Chip',
    variant: 'secondary',
    size: 'lg',
    removable: false,
  },
};

export const Removable: Story = {
  args: {
    label: 'Removable Chip',
    variant: 'primary',
    size: 'md',
    removable: true,
    onRemove: () => console.log('Chip removed'),
  },
};

export const Clickable: Story = {
  args: {
    label: 'Clickable Chip',
    variant: 'secondary',
    size: 'md',
    removable: false,
    onClick: () => console.log('Chip clicked'),
  },
};

export const CategoryChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Geography" variant="primary" size="md" />
      <Chip label="History" variant="secondary" size="md" />
      <Chip label="Science" variant="success" size="md" />
      <Chip label="Sports" variant="warning" size="md" />
      <Chip label="Entertainment" variant="error" size="md" />
      <Chip label="Literature" variant="default" size="md" />
    </div>
  ),
};

export const FilterChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip label="Easy" variant="success" size="sm" removable={true} onRemove={() => console.log('Easy filter removed')} />
      <Chip label="Medium" variant="warning" size="sm" removable={true} onRemove={() => console.log('Medium filter removed')} />
      <Chip label="Hard" variant="error" size="sm" removable={true} onRemove={() => console.log('Hard filter removed')} />
    </div>
  ),
};