import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, sepolia } from 'wagmi/chains';
import { CELO_NETWORK } from './contracts';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [CELO_NETWORK, mainnet, sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Celo Trivia',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with your WalletConnect project ID
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
