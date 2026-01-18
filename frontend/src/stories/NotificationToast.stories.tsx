import type { Meta, StoryObj } from '@storybook/react';
import NotificationToast from '../components/NotificationToast';
import { NotificationType } from '../types/notification';

const meta: Meta<typeof NotificationToast> = {
  title: 'Components/NotificationToast',
  component: NotificationToast,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A toast notification component for displaying messages, achievements, and alerts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: Object.values(NotificationType),
      description: 'The type of notification',
    },
    title: {
      control: { type: 'text' },
      description: 'The notification title',
    },
    message: {
      control: { type: 'text' },
      description: 'The notification message',
    },
    isVisible: {
      control: { type: 'boolean' },
      description: 'Whether the toast is visible',
    },
    onClose: {
      action: 'closed',
      description: 'Callback fired when toast is closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationToast>;

export const Success: Story = {
  args: {
    type: NotificationType.SUCCESS,
    title: 'Achievement Unlocked!',
    message: 'You earned the "First Answer" achievement',
    isVisible: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const Error: Story = {
  args: {
    type: NotificationType.ERROR,
    title: 'Connection Failed',
    message: 'Unable to connect to the blockchain network',
    isVisible: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const Warning: Story = {
  args: {
    type: NotificationType.WARNING,
    title: 'Low Balance',
    message: 'Your wallet balance is running low',
    isVisible: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const Info: Story = {
  args: {
    type: NotificationType.INFO,
    title: 'New Feature',
    message: 'Check out the new question categories!',
    isVisible: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const Achievement: Story = {
  args: {
    type: NotificationType.ACHIEVEMENT,
    title: '🎯 Perfect Score!',
    message: 'You got 10 answers correct in a row',
    isVisible: true,
    onClose: () => console.log('Toast closed'),
  },
};

export const Hidden: Story = {
  args: {
    type: NotificationType.SUCCESS,
    title: 'Hidden Toast',
    message: 'This toast is not visible',
    isVisible: false,
    onClose: () => console.log('Toast closed'),
  },
};