import { Page } from '@playwright/test';

export class WalletMock {
  private page: Page;
  private mockWalletAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  private mockChainId = 44787; // Celo Alfajores testnet

  constructor(page: Page) {
    this.page = page;
  }

  async setup() {
    // Mock wallet connection
    await this.page.addInitScript(() => {
      // Mock wagmi hooks
      window.ethereum = {
        isMetaMask: true,
        request: async (args: { method: string; params?: any[] }) => {
          switch (args.method) {
            case 'eth_requestAccounts':
              return [this.mockWalletAddress];
            case 'eth_chainId':
              return `0x${this.mockChainId.toString(16)}`;
            case 'wallet_switchEthereumChain':
              return null;
            default:
              return null;
          }
        },
        on: () => {},
        removeListener: () => {},
      };

      // Mock AppKit if it exists
      if (window.AppKit) {
        window.AppKit.open = () => Promise.resolve();
        window.AppKit.close = () => Promise.resolve();
      }
    });

    // Mock localStorage for wallet state
    await this.page.addInitScript(() => {
      localStorage.setItem('wagmi.wallet', 'metaMask');
      localStorage.setItem('wagmi.connected', 'true');
      localStorage.setItem('wagmi.recentConnectorId', 'metaMask');
    });
  }

  async teardown() {
    // Clean up any mock state
    await this.page.evaluate(() => {
      localStorage.removeItem('wagmi.wallet');
      localStorage.removeItem('wagmi.connected');
      localStorage.removeItem('wagmi.recentConnectorId');
    });
  }

  async connectWallet() {
    // Simulate wallet connection
    await this.page.evaluate(() => {
      // Trigger wallet connection event
      window.dispatchEvent(new Event('connect'));
    });
  }

  async disconnectWallet() {
    // Simulate wallet disconnection
    await this.page.evaluate(() => {
      window.dispatchEvent(new Event('disconnect'));
    });
  }

  async switchNetwork(chainId: number) {
    // Simulate network switch
    await this.page.evaluate((chainId) => {
      // Update mock chain ID
      if (window.ethereum) {
        window.ethereum.chainId = `0x${chainId.toString(16)}`;
      }
    }, chainId);
  }

  getMockAddress() {
    return this.mockWalletAddress;
  }

  getMockChainId() {
    return this.mockChainId;
  }
}