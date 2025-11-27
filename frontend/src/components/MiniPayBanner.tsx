'use client';

import { useMiniPayIntegration } from '@/hooks/useMiniPayIntegration';

export function MiniPayBanner() {
  const { isMiniPay, isConnected } = useMiniPayIntegration();

  if (!isMiniPay) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm md:text-base">
            🚀 <strong>Best Experience:</strong> Open this app in{' '}
            <a 
              href="https://www.opera.com/products/minipay" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-200"
            >
              MiniPay
            </a>{' '}
            for seamless cUSD rewards and cUSD gas payments!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 text-center">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
        <p className="text-sm md:text-base font-medium">
          ✅ Connected to MiniPay • Gas fees paid in cUSD • Instant cUSD rewards
        </p>
      </div>
    </div>
  );
}