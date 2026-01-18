import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from '../components/EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An empty state component for when there is no content to display.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Empty state title',
    },
    description: {
      control: { type: 'text' },
      description: 'Empty state description',
    },
    icon: {
      control: { type: 'text' },
      description: 'Icon to display (emoji or icon name)',
    },
    action: {
      control: { type: 'object' },
      description: 'Action button configuration',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoQuestions: Story = {
  args: {
    title: 'No Questions Found',
    description: 'There are no questions available for the selected filters. Try adjusting your search criteria.',
    icon: '🔍',
    action: {
      label: 'Clear Filters',
      onClick: () => console.log('Clear filters clicked'),
    },
  },
};

export const NoAchievements: Story = {
  args: {
    title: 'No Achievements Yet',
    description: 'You haven\'t unlocked any achievements yet. Start playing to earn your first achievement!',
    icon: '🏆',
    action: {
      label: 'Start Playing',
      onClick: () => console.log('Start playing clicked'),
    },
  },
};

export const NoGames: Story = {
  args: {
    title: 'No Games Played',
    description: 'You haven\'t played any games yet. Your game history will appear here once you start playing.',
    icon: '🎮',
    action: {
      label: 'Play First Game',
      onClick: () => console.log('Play first game clicked'),
    },
  },
};

export const NoResults: Story = {
  args: {
    title: 'No Search Results',
    description: 'We couldn\'t find any results matching your search. Try different keywords or check your spelling.',
    icon: '📭',
    action: {
      label: 'Clear Search',
      onClick: () => console.log('Clear search clicked'),
    },
  },
};

export const NoSubmissions: Story = {
  args: {
    title: 'No Pending Submissions',
    description: 'All question submissions have been reviewed. New submissions will appear here for approval.',
    icon: '✅',
  },
};

export const ErrorState: Story = {
  args: {
    title: 'Something Went Wrong',
    description: 'We encountered an error while loading the content. Please try refreshing the page.',
    icon: '⚠️',
    action: {
      label: 'Try Again',
      onClick: () => console.log('Try again clicked'),
    },
  },
};

export const NoData: Story = {
  args: {
    title: 'No Data Available',
    description: 'There is no data to display at the moment.',
    icon: '📊',
  },
};