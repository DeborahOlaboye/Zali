import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celoSepolia, celo } from '@reown/appkit/networks'

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd'

// 2. Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [celoSepolia, celo],
  projectId,
  ssr: true
})

// 3. Configure the modal
if (typeof window !== 'undefined') {
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
      analytics: false
    }
  })
}

export const config = wagmiAdapter.wagmiConfig


