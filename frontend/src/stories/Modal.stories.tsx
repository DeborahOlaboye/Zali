import type { Meta, StoryObj } from '@storybook/react';
import Modal from '../components/Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A modal dialog component for displaying content overlays.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'Whether the modal is open',
    },
    title: {
      control: { type: 'text' },
      description: 'Modal title',
    },
    onClose: {
      action: 'closed',
      description: 'Callback fired when modal is closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const BasicModal: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    onClose: () => console.log('Modal closed'),
    children: (
      <div className="p-4">
        <p className="mb-4">Are you sure you want to perform this action?</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Confirm
          </button>
        </div>
      </div>
    ),
  },
};

export const AchievementModal: Story = {
  args: {
    isOpen: true,
    title: '🎉 Achievement Unlocked!',
    onClose: () => console.log('Modal closed'),
    children: (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-bold mb-2">Trivia Master</h3>
        <p className="text-gray-600 mb-4">You've answered 100 questions correctly!</p>
        <button className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Continue Playing
        </button>
      </div>
    ),
  },
};

export const SettingsModal: Story = {
  args: {
    isOpen: true,
    title: 'Game Settings',
    onClose: () => console.log('Modal closed'),
    children: (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span>Sound Effects</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span>Music</span>
          <input type="checkbox" />
        </div>
        <div className="flex items-center justify-between">
          <span>Difficulty</span>
          <select className="border rounded px-2 py-1">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="flex justify-end pt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save Settings
          </button>
        </div>
      </div>
    ),
  },
};

export const ClosedModal: Story = {
  args: {
    isOpen: false,
    title: 'Hidden Modal',
    onClose: () => console.log('Modal closed'),
    children: <div>This content is hidden</div>,
  },
};