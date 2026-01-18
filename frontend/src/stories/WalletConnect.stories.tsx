import type { Meta, StoryObj } from '@storybook/react';
import WalletConnect from '../components/WalletConnect';

// Mock wallet connection functions
const mockConnect = async (walletType: string) => {
  console.log(`Connecting to ${walletType}...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { address: '0x1234567890abcdef1234567890abcdef12345678' };
};

const mockDisconnect = async () => {
  console.log('Disconnecting wallet...');
  await new Promise(resolve => setTimeout(resolve, 500));
};

const meta: Meta<typeof WalletConnect> = {
  title: 'Components/WalletConnect',
  component: WalletConnect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A wallet connection component that allows users to connect various Web3 wallets.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WalletConnect>;

export const Disconnected: Story = {
  parameters: {
    mockData: {
      isConnected: false,
      address: null,
      balance: null,
      connect: mockConnect,
      disconnect: mockDisconnect,
    },
  },
};

export const Connected: Story = {
  parameters: {
    mockData: {
      isConnected: true,
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      balance: '1.234',
      connect: mockConnect,
      disconnect: mockDisconnect,
    },
  },
};

export const Connecting: Story = {
  parameters: {
    mockData: {
      isConnected: false,
      address: null,
      balance: null,
      isConnecting: true,
      connect: mockConnect,
      disconnect: mockDisconnect,
    },
  },
};

export const LowBalance: Story = {
  parameters: {
    mockData: {
      isConnected: true,
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      balance: '0.023',
      connect: mockConnect,
      disconnect: mockDisconnect,
    },
  },
};