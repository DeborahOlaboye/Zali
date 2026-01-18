import type { Meta, StoryObj } from '@storybook/react';
import Popover from '../components/Popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A popover component for displaying additional content in a floating container.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Basic: Story = {
  render: () => (
    <Popover
      trigger={<button className="px-4 py-2 bg-blue-500 text-white rounded">Click me</button>}
      content={
        <div className="p-4">
          <h3 className="font-semibold mb-2">Popover Title</h3>
          <p className="text-sm text-gray-600">This is the content of the popover.</p>
        </div>
      }
    />
  ),
};

export const UserInfo: Story = {
  render: () => (
    <Popover
      trigger={
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <span>John Doe</span>
        </div>
      }
      content={
        <div className="p-4 w-64">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-600">john@example.com</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
              Profile Settings
            </button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded">
              Achievements
            </button>
            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600">
              Sign Out
            </button>
          </div>
        </div>
      }
    />
  ),
};

export const HelpTooltip: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <span>How to play</span>
      <Popover
        trigger={<span className="text-blue-500 cursor-help">ⓘ</span>}
        content={
          <div className="p-4 max-w-xs">
            <h3 className="font-semibold mb-2">How to Play</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Answer questions within the time limit</li>
              <li>• Earn points for correct answers</li>
              <li>• Unlock achievements as you progress</li>
              <li>• Compete on the leaderboard</li>
            </ul>
          </div>
        }
      />
    </div>
  ),
};

export const NotificationPopover: Story = {
  render: () => (
    <Popover
      trigger={
        <button className="relative p-2">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
      }
      content={
        <div className="p-4 w-80">
          <h3 className="font-semibold mb-3">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
              <span className="text-lg">🏆</span>
              <div className="flex-1">
                <p className="text-sm font-medium">Achievement Unlocked!</p>
                <p className="text-xs text-gray-600">You earned "Speed Demon"</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
              <span className="text-lg">⭐</span>
              <div className="flex-1">
                <p className="text-sm font-medium">New High Score</p>
                <p className="text-xs text-gray-600">You set a new personal best!</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
              <span className="text-lg">🎯</span>
              <div className="flex-1">
                <p className="text-sm font-medium">Question Approved</p>
                <p className="text-xs text-gray-600">Your submitted question was approved</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-3 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
            View All Notifications
          </button>
        </div>
      }
    />
  ),
};