import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Celo Sepolia configuration
const celoSepolia = {
  id: 44787,
  name: 'Celo Sepolia',
  network: 'celo-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    public: { http: ['https://sepolia-forno.celo-testnet.org'] },
    default: { http: ['https://sepolia-forno.celo-testnet.org'] },
  },
  blockExplorers: {
    default: { 
      name: 'CeloScan',
      url: 'https://sepolia.celoscan.io'
    },
  },
  testnet: true,
}

// Celo Mainnet
const celo = {
  id: 42220,
  name: 'Celo',
  network: 'celo',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    public: { http: ['https://forno.celo.org'] },
    default: { http: ['https://forno.celo.org'] },
  },
  blockExplorers: {
    default: { 
      name: 'CeloScan',
      url: 'https://celoscan.io'
    },
  },
  testnet: false,
}

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// 2. Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [celoSepolia, celo],
  projectId,
  ssr: true
})

// 3. Configure the modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [celoSepolia, celo],
  projectId,
  metadata: {
    name: 'Celo Knowledge Quest',
    description: 'Test your Celo knowledge and earn CELO rewards',
    url: 'https://celoquest.app',
    icons: ['https://celoquest.app/icon.png']
  },
  features: {
    analytics: false,
    email: false,
    socials: []
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: true
})

export const config = wagmiAdapter.wagmiConfig

// Helper to prepare transaction with feeCurrency for MiniPay
export function prepareMiniPayTransaction(tx: any) {
  return {
    ...tx,
    feeCurrency: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // cUSD address
    type: 'legacy' as const,
  };
}

// Helper to prepare contract write for MiniPay
export function prepareMiniPayContractWrite(contractCall: any, isMiniPay: boolean) {
  if (!isMiniPay) return contractCall;
  
  return {
    ...contractCall,
    // Add MiniPay-specific transaction properties
    feeCurrency: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    type: 'legacy' as const,
  };
}
