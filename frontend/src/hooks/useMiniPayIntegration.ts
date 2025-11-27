import { useEffect, useState, useCallback } from 'react';

interface MiniPayAPI {
  isConnected(): Promise<boolean>;
  connect(): Promise<string[]>;
  getAccounts(): Promise<string[]>;
  sendTransaction(params: {
    to: string;
    value?: string;
    data?: string;
    feeCurrency?: string;
  }): Promise<string>;
  signMessage(message: string): Promise<string>;
}

declare global {
  interface Window {
    ethereum?: any;
    celo?: MiniPayAPI;
  }
}

export function useMiniPayIntegration() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [miniPayAPI, setMiniPayAPI] = useState<MiniPayAPI | null>(null);

  useEffect(() => {
    const detectMiniPay = async () => {
      // Check if running in MiniPay environment
      const userAgent = navigator.userAgent;
      const isMiniPayEnv = userAgent.includes('MiniPay') || 
                          userAgent.includes('Opera Mini') ||
                          !!(window as any).ethereum?.isMiniPay ||
                          !!(window as any).celo;

      setIsMiniPay(isMiniPayEnv);

      if (isMiniPayEnv) {
        // Use MiniPay's native API if available
        if ((window as any).celo) {
          setMiniPayAPI((window as any).celo);
          
          // Check if already connected
          try {
            const accounts = await (window as any).celo.getAccounts();
            if (accounts.length > 0) {
              setIsConnected(true);
              setAccount(accounts[0]);
            }
          } catch (error) {
            console.log('Not connected to MiniPay yet');
          }
        }
      }
    };

    detectMiniPay();
  }, []);

  const connectMiniPay = useCallback(async () => {
    if (!isMiniPay || !miniPayAPI) {
      throw new Error('MiniPay not available');
    }

    try {
      const accounts = await miniPayAPI.connect();
      if (accounts.length > 0) {
        setIsConnected(true);
        setAccount(accounts[0]);
        return accounts[0];
      }
      throw new Error('No accounts returned');
    } catch (error) {
      console.error('Failed to connect to MiniPay:', error);
      throw error;
    }
  }, [isMiniPay, miniPayAPI]);

  const sendMiniPayTransaction = useCallback(async (params: {
    to: string;
    value?: string;
    data?: string;
  }) => {
    if (!isMiniPay || !miniPayAPI || !isConnected) {
      throw new Error('MiniPay not connected');
    }

    try {
      // Use cUSD as fee currency for MiniPay transactions
      const txHash = await miniPayAPI.sendTransaction({
        ...params,
        feeCurrency: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // cUSD address
      });
      
      return txHash;
    } catch (error) {
      console.error('MiniPay transaction failed:', error);
      throw error;
    }
  }, [isMiniPay, miniPayAPI, isConnected]);

  const signMiniPayMessage = useCallback(async (message: string) => {
    if (!isMiniPay || !miniPayAPI || !isConnected) {
      throw new Error('MiniPay not connected');
    }

    try {
      return await miniPayAPI.signMessage(message);
    } catch (error) {
      console.error('MiniPay message signing failed:', error);
      throw error;
    }
  }, [isMiniPay, miniPayAPI, isConnected]);

  return {
    isMiniPay,
    isConnected,
    account,
    connectMiniPay,
    sendMiniPayTransaction,
    signMiniPayMessage,
  };
}