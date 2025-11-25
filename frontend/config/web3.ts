import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celoSepolia, celo } from '@reown/appkit/networks'

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
  }
})

export const config = wagmiAdapter.wagmiConfig

// Helper to prepare transaction with feeCurrency for MiniPay
export function prepareMiniPayTransaction(tx: any) {
  return {
    ...tx,
    // MiniPay requires feeCurrency for cUSD gas payments
    feeCurrency: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // cUSD address
    // Use legacy transaction type (not EIP-1559)
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
