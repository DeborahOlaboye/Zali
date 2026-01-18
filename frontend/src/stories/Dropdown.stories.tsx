import type { Meta, StoryObj } from '@storybook.react';
import Dropdown from '../components/Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A dropdown component for selecting options from a list.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: { type: 'text' },
      description: 'Dropdown trigger content',
    },
    items: {
      control: { type: 'object' },
      description: 'Array of dropdown items',
    },
    position: {
      control: { type: 'select' },
      options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
      description: 'Dropdown position',
    },
    onItemClick: {
      action: 'itemClicked',
      description: 'Callback fired when an item is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Basic: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-blue-500 text-white rounded">Open Menu</button>,
    items: [
      { id: 'profile', label: 'Profile', icon: '👤' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'logout', label: 'Logout', icon: '🚪' },
    ],
    position: 'bottom-left',
    onItemClick: (item) => console.log('Clicked item:', item),
  },
};

export const WithIcons: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-green-500 text-white rounded">Actions</button>,
    items: [
      { id: 'edit', label: 'Edit', icon: '✏️' },
      { id: 'duplicate', label: 'Duplicate', icon: '📋' },
      { id: 'delete', label: 'Delete', icon: '🗑️', danger: true },
    ],
    position: 'bottom-right',
    onItemClick: (item) => console.log('Clicked item:', item),
  },
};

export const UserMenu: Story = {
  args: {
    trigger: (
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          JD
        </div>
        <span>John Doe</span>
        <span>▼</span>
      </div>
    ),
    items: [
      { id: 'profile', label: 'View Profile' },
      { id: 'achievements', label: 'Achievements' },
      { id: 'settings', label: 'Settings' },
      { id: 'divider', divider: true },
      { id: 'logout', label: 'Sign Out' },
    ],
    position: 'bottom-right',
    onItemClick: (item) => console.log('Clicked item:', item),
  },
};

export const GameOptions: Story = {
  args: {
    trigger: <button className="px-4 py-2 bg-purple-500 text-white rounded">Game Options</button>,
    items: [
      { id: 'new-game', label: 'New Game' },
      { id: 'continue', label: 'Continue' },
      { id: 'leaderboard', label: 'Leaderboard' },
      { id: 'divider', divider: true },
      { id: 'tutorial', label: 'Tutorial' },
    ],
    position: 'bottom-left',
    onItemClick: (item) => console.log('Clicked item:', item),
  },
};