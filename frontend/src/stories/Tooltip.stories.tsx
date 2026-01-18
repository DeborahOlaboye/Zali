import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from '../components/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A tooltip component that displays helpful information on hover or focus.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: { type: 'text' },
      description: 'Tooltip content',
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip position',
    },
    children: {
      control: { type: 'text' },
      description: 'Trigger element',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const BasicTooltip: Story = {
  args: {
    content: 'This is a helpful tooltip message',
    position: 'top',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
  },
};

export const BottomTooltip: Story = {
  args: {
    content: 'Tooltip positioned at the bottom',
    position: 'bottom',
    children: <span className="underline cursor-help">Helpful info</span>,
  },
};

export const LeftTooltip: Story = {
  args: {
    content: 'Tooltip on the left side',
    position: 'left',
    children: <i className="fas fa-info-circle text-blue-500 cursor-help"></i>,
  },
};

export const RightTooltip: Story = {
  args: {
    content: 'Tooltip on the right side',
    position: 'right',
    children: <span className="text-sm text-gray-500 cursor-help">i</span>,
  },
};

export const LongContent: Story = {
  args: {
    content: 'This is a much longer tooltip message that contains more detailed information about the feature or element being described.',
    position: 'top',
    children: <button className="px-4 py-2 bg-green-500 text-white rounded">Detailed Help</button>,
  },
};