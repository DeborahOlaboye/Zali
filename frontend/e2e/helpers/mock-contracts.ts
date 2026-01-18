import { Page } from '@playwright/test';

export async function mockContractRead(page: Page, functionName: string, result: any) {
  // This is a simplified mock. Real wagmi/viem use complex multi-call or specific RPC calls.
  // We can intercept the RPC requests.
  await page.route('**/sepolia.base.org', async (route) => {
    const postData = route.request().postDataJSON();
    if (postData && Array.isArray(postData)) {
      // Handle batch requests
      const responses = postData.map((req: any) => {
        if (req.method === 'eth_call' && req.params[0].data.includes(functionName)) {
          return {
            jsonrpc: '2.0',
            id: req.id,
            result: typeof result === 'string' ? result : '0x' + result.toString(16),
          };
        }
        return null;
      });
      if (responses.some(r => r !== null)) {
        await route.fulfill({ body: JSON.stringify(responses) });
        return;
      }
    } else if (postData && postData.method === 'eth_call') {
      // Check if this is the call we want to mock
      // This requires knowing the function selector, but for simplicity we'll check function name in a comment or similar
      // or just return the mock result for any eth_call if it's targeted.
      await route.fulfill({
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: postData.id,
          result: typeof result === 'string' ? result : '0x' + result.toString(16),
        }),
      });
      return;
    }
    await route.continue();
  });
}
