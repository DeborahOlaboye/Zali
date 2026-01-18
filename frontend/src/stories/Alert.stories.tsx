import type { Meta, StoryObj } from '@storybook/react';
import Alert from '../components/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An alert component for displaying important messages and notifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
      description: 'Alert type',
    },
    title: {
      control: { type: 'text' },
      description: 'Alert title',
    },
    message: {
      control: { type: 'text' },
      description: 'Alert message',
    },
    dismissible: {
      control: { type: 'boolean' },
      description: 'Whether the alert can be dismissed',
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Callback fired when alert is dismissed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    type: 'info',
    title: 'Information',
    message: 'This is an informational message.',
    dismissible: false,
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Success!',
    message: 'Your action was completed successfully.',
    dismissible: true,
    onDismiss: () => console.log('Alert dismissed'),
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Warning',
    message: 'Please review this important information.',
    dismissible: true,
    onDismiss: () => console.log('Alert dismissed'),
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Error',
    message: 'Something went wrong. Please try again.',
    dismissible: true,
    onDismiss: () => console.log('Alert dismissed'),
  },
};

export const NoTitle: Story = {
  args: {
    type: 'info',
    message: 'This alert has no title, just a message.',
    dismissible: false,
  },
};

export const LongMessage: Story = {
  args: {
    type: 'warning',
    title: 'Important Notice',
    message: 'This is a longer message that provides more detailed information about the alert. It can span multiple lines and contain more context about what the user should know.',
    dismissible: true,
    onDismiss: () => console.log('Alert dismissed'),
  },
};