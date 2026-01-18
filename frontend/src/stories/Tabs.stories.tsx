import type { Meta, StoryObj } from '@storybook/react';
import Tabs from '../components/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A tabs component for organizing content into separate tabbed sections.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Basic: Story = {
  args: {
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        content: <div className="p-4">This is the overview tab content. It shows general information about the application.</div>,
      },
      {
        id: 'statistics',
        label: 'Statistics',
        content: <div className="p-4">Statistics tab content goes here. Charts and graphs would be displayed in this section.</div>,
      },
      {
        id: 'settings',
        label: 'Settings',
        content: <div className="p-4">Settings content. User preferences and configuration options would be here.</div>,
      },
    ],
    defaultActiveTab: 'overview',
  },
};

export const ProfileTabs: Story = {
  args: {
    tabs: [
      {
        id: 'profile',
        label: 'Profile',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">User Profile</h3>
            <p>Manage your personal information and preferences.</p>
          </div>
        ),
      },
      {
        id: 'achievements',
        label: 'Achievements',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Your Achievements</h3>
            <p>View all the achievements you've unlocked.</p>
          </div>
        ),
      },
      {
        id: 'history',
        label: 'Game History',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Game History</h3>
            <p>Review your past games and performance.</p>
          </div>
        ),
      },
    ],
    defaultActiveTab: 'profile',
  },
};

export const AdminTabs: Story = {
  args: {
    tabs: [
      {
        id: 'questions',
        label: 'Questions',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Question Management</h3>
            <p>Review, approve, and manage submitted questions.</p>
          </div>
        ),
      },
      {
        id: 'users',
        label: 'Users',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p>Manage user accounts and permissions.</p>
          </div>
        ),
      },
      {
        id: 'analytics',
        label: 'Analytics',
        content: (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
            <p>View detailed analytics and reports.</p>
          </div>
        ),
      },
    ],
    defaultActiveTab: 'questions',
  },
};