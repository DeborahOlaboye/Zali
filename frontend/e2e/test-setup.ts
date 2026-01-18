import { test as base, expect } from '@playwright/test';
import { WalletMock } from './utils/wallet-mock';

// Extend the base test with wallet mocking capabilities
export const test = base.extend<{
  walletMock: WalletMock;
}>({
  walletMock: async ({ page }, use) => {
    const walletMock = new WalletMock(page);
    await walletMock.setup();
    await use(walletMock);
    await walletMock.teardown();
  },
});

export { expect };