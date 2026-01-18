import type { Meta, StoryObj } from '@storybook/react';
import Avatar from '../components/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An avatar component for displaying user profile pictures or initials.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: { type: 'text' },
      description: 'Image source URL',
    },
    alt: {
      control: { type: 'text' },
      description: 'Alt text for the image',
    },
    initials: {
      control: { type: 'text' },
      description: 'User initials to display if no image',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Avatar size',
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'away', 'busy'],
      description: 'User status indicator',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=JD',
    alt: 'John Doe',
    size: 'md',
  },
};

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    initials: 'AB',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    initials: 'XYZ',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    initials: 'BIG',
    size: 'xl',
  },
};

export const Online: Story = {
  args: {
    initials: 'JD',
    size: 'md',
    status: 'online',
  },
};

export const Offline: Story = {
  args: {
    initials: 'JD',
    size: 'md',
    status: 'offline',
  },
};

export const Away: Story = {
  args: {
    initials: 'JD',
    size: 'md',
    status: 'away',
  },
};

export const Busy: Story = {
  args: {
    initials: 'JD',
    size: 'md',
    status: 'busy',
  },
};