import type { Meta, StoryObj } from '@storybook/react';
import TransactionStatus from '../components/TransactionStatus';
import { TransactionState } from '../types/transaction';

const meta: Meta<typeof TransactionStatus> = {
  title: 'Components/TransactionStatus',
  component: TransactionStatus,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A component that displays the status and progress of blockchain transactions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: Object.values(TransactionState),
      description: 'The current state of the transaction',
    },
    message: {
      control: { type: 'text' },
      description: 'Status message to display',
    },
    txHash: {
      control: { type: 'text' },
      description: 'Transaction hash for blockchain explorer link',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionStatus>;

export const Pending: Story = {
  args: {
    state: TransactionState.PENDING,
    message: 'Submitting your answer...',
  },
};

export const Mining: Story = {
  args: {
    state: TransactionState.MINING,
    message: 'Transaction is being mined...',
    txHash: '0x8ba1f109551bd432803012645ac136ddd64dba72',
  },
};

export const Success: Story = {
  args: {
    state: TransactionState.SUCCESS,
    message: 'Answer submitted successfully!',
    txHash: '0x8ba1f109551bd432803012645ac136ddd64dba72',
  },
};

export const Failed: Story = {
  args: {
    state: TransactionState.FAILED,
    message: 'Transaction failed. Please try again.',
    txHash: '0x8ba1f109551bd432803012645ac136ddd64dba72',
  },
};

export const Confirming: Story = {
  args: {
    state: TransactionState.CONFIRMING,
    message: 'Waiting for confirmation...',
    txHash: '0x8ba1f109551bd432803012645ac136ddd64dba72',
  },
};