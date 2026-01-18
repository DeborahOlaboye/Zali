import { Page } from '@playwright/test';

export async function mockWallet(page: Page, address: string = '0x1234567890123456789012345678901234567890') {
  await page.addInitScript((mockAddress) => {
    window.ethereum = {
      isMetaMask: true,
      request: async ({ method, params }: { method: string, params?: any[] }) => {
        if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
          return [mockAddress];
        }
        if (method === 'eth_chainId') {
          return '0x14a34'; // Base Sepolia (84532)
        }
        if (method === 'wallet_switchEthereumChain') {
          return null;
        }
        // Mock other methods as needed
        console.log('Ethereum request:', method, params);
        return null;
      },
      on: (event: string, callback: (...args: any[]) => void) => {
        console.log('Ethereum on:', event);
      },
      removeListener: (event: string, callback: (...args: any[]) => void) => {
        console.log('Ethereum removeListener:', event);
      },
    };
  }, address);
}
