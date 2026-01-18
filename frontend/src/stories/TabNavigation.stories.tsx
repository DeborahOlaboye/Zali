import type { Meta, StoryObj } from '@storybook/react';
import TabNavigation from '../components/TabNavigation';

const meta: Meta<typeof TabNavigation> = {
  title: 'Components/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A tab navigation component for switching between different content sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      control: { type: 'object' },
      description: 'Array of tab objects with id and label',
    },
    activeTab: {
      control: { type: 'text' },
      description: 'ID of the currently active tab',
    },
    onTabChange: {
      action: 'tabChanged',
      description: 'Callback fired when active tab changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TabNavigation>;

export const BasicTabs: Story = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'statistics', label: 'Statistics' },
      { id: 'achievements', label: 'Achievements' },
    ],
    activeTab: 'overview',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
  },
};

export const StatisticsActive: Story = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'statistics', label: 'Statistics' },
      { id: 'achievements', label: 'Achievements' },
    ],
    activeTab: 'statistics',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
  },
};

export const AchievementsActive: Story = {
  args: {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'statistics', label: 'Statistics' },
      { id: 'achievements', label: 'Achievements' },
    ],
    activeTab: 'achievements',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: 'home', label: 'Home' },
      { id: 'play', label: 'Play Game' },
      { id: 'leaderboard', label: 'Leaderboard' },
      { id: 'achievements', label: 'Achievements' },
      { id: 'settings', label: 'Settings' },
      { id: 'help', label: 'Help' },
    ],
    activeTab: 'play',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
  },
};