import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumbs from '../components/Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A breadcrumbs component for showing navigation hierarchy and current page location.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: { type: 'object' },
      description: 'Array of breadcrumb items',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Basic: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Games', href: '/games' },
      { label: 'Trivia Game', href: '/games/trivia' },
    ],
  },
};

export const WithCurrentPage: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Games', href: '/games' },
      { label: 'Trivia Game', href: '/games/trivia' },
      { label: 'Settings', href: '/games/trivia/settings' },
    ],
  },
};

export const DeepNavigation: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Admin', href: '/admin' },
      { label: 'Content', href: '/admin/content' },
      { label: 'Questions', href: '/admin/content/questions' },
      { label: 'Edit Question', href: '/admin/content/questions/edit/123' },
    ],
  },
};

export const ShortPath: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Profile', href: '/dashboard/profile' },
    ],
  },
};