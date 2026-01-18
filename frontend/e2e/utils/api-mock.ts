import { Page } from '@playwright/test';

// API mocking utility for contract and external API calls
export class ApiMock {
  private page: Page;
  private mocks: Map<string, any> = new Map();

  constructor(page: Page) {
    this.page = page;
  }

  async setupContractMocks() {
    // Mock contract read calls
    await this.page.route('**/readContract', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      let response;
      switch (postData.functionName) {
        case 'getPlayerInfo':
          response = this.mockPlayerInfo(postData.args);
          break;
        case 'getLeaderboard':
          response = this.mockLeaderboard(postData.args);
          break;
        case 'getQuestions':
          response = this.mockQuestions(postData.args);
          break;
        case 'balanceOf':
          response = this.mockBalance(postData.args);
          break;
        default:
          response = '0x'; // Default mock response
      }

      await route.fulfill({ json: response });
    });

    // Mock contract write calls
    await this.page.route('**/writeContract', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      // Simulate transaction hash
      const txHash = '0x' + Math.random().toString(16).substr(2, 64);

      await route.fulfill({ json: txHash });
    });

    // Mock transaction receipt
    await this.page.route('**/getTransactionReceipt', async (route) => {
      await route.fulfill({
        json: {
          status: 'success',
          blockNumber: '0x' + Math.floor(Math.random() * 1000000).toString(16),
          gasUsed: '0x' + Math.floor(Math.random() * 100000).toString(16),
        }
      });
    });
  }

  private mockPlayerInfo(args: any[]) {
    const [address] = args;
    return {
      username: 'testuser',
      totalScore: 1500,
      gamesPlayed: 25,
      isRegistered: true,
    };
  }

  private mockLeaderboard(args: any[]) {
    const [limit] = args;
    return Array.from({ length: limit || 10 }, (_, i) => ({
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      username: `player${i + 1}`,
      totalScore: Math.floor(Math.random() * 5000),
      rank: i + 1,
    }));
  }

  private mockQuestions(args: any[]) {
    const [sessionId] = args;
    return [
      {
        id: 1,
        question: 'What is Celo?',
        options: ['A cryptocurrency', 'A blockchain platform', 'A wallet', 'A DeFi protocol'],
        correctAnswer: 1,
        explanation: 'Celo is a blockchain platform focused on mobile-first DeFi.',
        category: 'Celo',
        difficulty: 'easy',
      },
    ];
  }

  private mockBalance(args: any[]) {
    const [address] = args;
    // Return mock balance in wei (1 ETH = 10^18 wei)
    return '0x' + (Math.floor(Math.random() * 10) * 10**18).toString(16);
  }

  async mockExternalAPIs() {
    // Mock any external API calls if needed
    await this.page.route('https://api.coingecko.com/**', async (route) => {
      await route.fulfill({
        json: {
          celo: { usd: 0.5 },
          ethereum: { usd: 2500 },
        }
      });
    });
  }

  async setMockResponse(endpoint: string, response: any) {
    this.mocks.set(endpoint, response);
  }

  async clearMocks() {
    this.mocks.clear();
    await this.page.unroute('**/readContract');
    await this.page.unroute('**/writeContract');
    await this.page.unroute('**/getTransactionReceipt');
    await this.page.unroute('https://api.coingecko.com/**');
  }
}