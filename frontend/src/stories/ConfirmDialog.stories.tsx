import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from '../components/ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A confirmation dialog component for user actions that require confirmation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Basic: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action? This cannot be undone.',
    confirmText: 'Yes, continue',
    cancelText: 'Cancel',
    onConfirm: () => console.log('Action confirmed'),
    onCancel: () => console.log('Action cancelled'),
  },
};

export const DeleteQuestion: Story = {
  args: {
    isOpen: true,
    title: 'Delete Question',
    message: 'Are you sure you want to delete this question? This action cannot be undone and will permanently remove the question from the database.',
    confirmText: 'Delete Question',
    cancelText: 'Keep Question',
    variant: 'danger',
    onConfirm: () => console.log('Question deleted'),
    onCancel: () => console.log('Delete cancelled'),
  },
};

export const ResetProgress: Story = {
  args: {
    isOpen: true,
    title: 'Reset Progress',
    message: 'This will reset all your game progress, including achievements and statistics. Are you sure you want to continue?',
    confirmText: 'Reset Progress',
    cancelText: 'Keep Progress',
    variant: 'warning',
    onConfirm: () => console.log('Progress reset'),
    onCancel: () => console.log('Reset cancelled'),
  },
};

export const SubmitQuestion: Story = {
  args: {
    isOpen: true,
    title: 'Submit Question',
    message: 'Your question will be reviewed by moderators before being added to the game. This may take up to 24 hours.',
    confirmText: 'Submit for Review',
    cancelText: 'Edit Question',
    variant: 'info',
    onConfirm: () => console.log('Question submitted'),
    onCancel: () => console.log('Submission cancelled'),
  },
};

export const SignOut: Story = {
  args: {
    isOpen: true,
    title: 'Sign Out',
    message: 'Are you sure you want to sign out? You will need to reconnect your wallet to play again.',
    confirmText: 'Sign Out',
    cancelText: 'Stay Signed In',
    onConfirm: () => console.log('User signed out'),
    onCancel: () => console.log('Sign out cancelled'),
  },
};

export const ClearData: Story = {
  args: {
    isOpen: true,
    title: 'Clear All Data',
    message: 'This will permanently delete all your local game data, including settings and cached questions. Are you absolutely sure?',
    confirmText: 'Clear All Data',
    cancelText: 'Keep Data',
    variant: 'danger',
    onConfirm: () => console.log('Data cleared'),
    onCancel: () => console.log('Clear cancelled'),
  },
};