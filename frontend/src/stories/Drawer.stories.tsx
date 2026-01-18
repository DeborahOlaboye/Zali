import type { Meta, StoryObj } from '@storybook/react';
import Drawer from '../components/Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A drawer component that slides in from the side to display additional content.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightDrawer: Story = {
  args: {
    isOpen: true,
    position: 'right',
    title: 'Settings',
    onClose: () => console.log('Drawer closed'),
    children: (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select className="w-full px-3 py-2 border rounded">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Sound Effects</label>
          <input type="checkbox" defaultChecked />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Notifications</label>
          <input type="checkbox" defaultChecked />
        </div>
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save Settings
        </button>
      </div>
    ),
  },
};

export const LeftDrawer: Story = {
  args: {
    isOpen: true,
    position: 'left',
    title: 'Navigation',
    onClose: () => console.log('Drawer closed'),
    children: (
      <nav className="space-y-2">
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded">Home</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded">Play Game</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded">Leaderboard</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded">Achievements</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded">Profile</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-100 rounded">Settings</a>
      </nav>
    ),
  },
};

export const BottomDrawer: Story = {
  args: {
    isOpen: true,
    position: 'bottom',
    title: 'Quick Actions',
    onClose: () => console.log('Drawer closed'),
    children: (
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          <div className="text-2xl mb-2">🎮</div>
          <div className="font-medium">New Game</div>
        </button>
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-medium">Achievements</div>
        </button>
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium">Statistics</div>
        </button>
        <button className="p-4 border rounded-lg hover:bg-gray-50">
          <div className="text-2xl mb-2">⚙️</div>
          <div className="font-medium">Settings</div>
        </button>
      </div>
    ),
  },
};

export const AchievementDrawer: Story = {
  args: {
    isOpen: true,
    position: 'right',
    title: 'Achievement Unlocked!',
    onClose: () => console.log('Drawer closed'),
    children: (
      <div className="text-center py-8">
        <div className="text-8xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-2">Trivia Master</h2>
        <p className="text-gray-600 mb-6">You've answered 100 questions correctly!</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Reward</h3>
          <p className="text-yellow-700">+500 points, +1 achievement badge</p>
        </div>
        <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold">
          Continue Playing
        </button>
      </div>
    ),
  },
};

export const ClosedDrawer: Story = {
  args: {
    isOpen: false,
    position: 'right',
    title: 'Closed Drawer',
    onClose: () => console.log('Drawer closed'),
    children: <div>This content is hidden</div>,
  },
};