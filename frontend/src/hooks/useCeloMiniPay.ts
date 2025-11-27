import { useEffect, useState, useCallback } from 'react';
import { newKit } from '@celo/contractkit';

export function useCeloMiniPay() {
  const [kit, setKit] = useState<any>(null);
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const initMiniPay = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Check if MiniPay
        const isMiniPayEnv = !!(window as any).ethereum?.isMiniPay;
        setIsMiniPay(isMiniPayEnv);

        if (isMiniPayEnv) {
          // Initialize ContractKit for MiniPay
          const celoKit = newKit('https://alfajores-forno.celo-testnet.org', window.ethereum);
          setKit(celoKit);

          // Get accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            celoKit.defaultAccount = accounts[0];
          }
        }
      }
    };

    initMiniPay();
  }, []);

  const sendTransaction = useCallback(async (tx: any) => {
    if (!kit || !isMiniPay) return null;

    try {
      // MiniPay transaction with feeCurrency
      const txWithFee = {
        ...tx,
        feeCurrency: '0x765DE816845861e75A25fCA122bb6898B8B1282a', // cUSD
        gasPrice: '1000000000', // 1 Gwei
      };

      const result = await kit.sendTransaction(txWithFee);
      return result;
    } catch (error) {
      console.error('MiniPay transaction failed:', error);
      throw error;
    }
  }, [kit, isMiniPay]);

  return {
    kit,
    isMiniPay,
    account,
    sendTransaction,
  };
}