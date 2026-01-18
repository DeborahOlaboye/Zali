import type { Meta, StoryObj } from '@storybook/react';
import Stepper from '../components/Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A stepper component for displaying progress through a sequence of steps.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Basic: Story = {
  args: {
    steps: [
      { id: 'step1', title: 'Step 1', description: 'First step' },
      { id: 'step2', title: 'Step 2', description: 'Second step' },
      { id: 'step3', title: 'Step 3', description: 'Third step' },
    ],
    currentStep: 0,
  },
};

export const InProgress: Story = {
  args: {
    steps: [
      { id: 'connect', title: 'Connect Wallet', description: 'Connect your Web3 wallet' },
      { id: 'select', title: 'Select Game', description: 'Choose your game mode' },
      { id: 'play', title: 'Play Game', description: 'Answer questions and earn points' },
      { id: 'results', title: 'View Results', description: 'See your score and achievements' },
    ],
    currentStep: 1,
  },
};

export const Completed: Story = {
  args: {
    steps: [
      { id: 'setup', title: 'Setup', description: 'Initial configuration' },
      { id: 'processing', title: 'Processing', description: 'Data processing in progress' },
      { id: 'complete', title: 'Complete', description: 'Process finished successfully' },
    ],
    currentStep: 2,
  },
};

export const QuestionSubmission: Story = {
  args: {
    steps: [
      { id: 'details', title: 'Question Details', description: 'Enter question and answers' },
      { id: 'category', title: 'Category & Difficulty', description: 'Select category and difficulty level' },
      { id: 'review', title: 'Review & Submit', description: 'Review and submit your question' },
    ],
    currentStep: 0,
  },
};

export const Vertical: Story = {
  args: {
    steps: [
      { id: 'step1', title: 'Personal Info', description: 'Enter your personal information' },
      { id: 'step2', title: 'Account Setup', description: 'Configure your account settings' },
      { id: 'step3', title: 'Verification', description: 'Verify your email address' },
      { id: 'step4', title: 'Complete', description: 'Setup is complete' },
    ],
    currentStep: 2,
    orientation: 'vertical',
  },
  parameters: {
    layout: 'fullscreen',
  },
};