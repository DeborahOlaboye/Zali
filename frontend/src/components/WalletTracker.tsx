'use client';

import { useAccount } from 'wagmi';
import { useEffect, useRef } from 'react';
import { trackEvent, identifyUser, ANALYTICS_EVENTS } from '@/lib/analytics';

export default function WalletTracker() {
  const { address, isConnected, connector } = useAccount();
  const prevConnected = useRef(isConnected);

  useEffect(() => {
    if (isConnected && !prevConnected.current && address) {
      identifyUser(address, {
        wallet: address,
        connector: connector?.name,
      });
      trackEvent(ANALYTICS_EVENTS.WALLET_CONNECTED, {
        address: address,
        connector: connector?.name,
      });
    }
    prevConnected.current = isConnected;
  }, [isConnected, address, connector]);

  return null;
}
