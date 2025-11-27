'use client';

import { useState, useEffect } from 'react';
import { useMiniPayIntegration } from '@/hooks/useMiniPayIntegration';
import { useRewards } from '@/hooks/useContract';
import { CONTRACTS } from '@/config/contracts';
import { toast } from 'react-hot-toast';

export function MiniPayRewards() {
  const { isMiniPay, isConnected, connectMiniPay, sendMiniPayTransaction } = useMiniPayIntegration();
  const { pendingRewards, claimIsLoading, refetchPendingRewards } = useRewards();
  const [isClaimingRewards, setIsClaimingRewards] = useState(false);

  const handleClaimRewards = async () => {
    if (!isMiniPay) {
      toast.error('This feature is only available in MiniPay');
      return;
    }

    if (!isConnected) {
      try {
        await connectMiniPay();
      } catch (error) {
        toast.error('Failed to connect to MiniPay');
        return;
      }
    }

    setIsClaimingRewards(true);
    try {
      // Encode the claimRewards function call
      const claimRewardsData = '0x372500ab'; // claimRewards() function selector
      
      const txHash = await sendMiniPayTransaction({
        to: CONTRACTS.triviaGameV2.address,
        data: claimRewardsData,
      });

      toast.success(`Rewards claimed! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Refresh rewards after successful claim
      setTimeout(() => {
        refetchPendingRewards();
      }, 3000);
      
    } catch (error: any) {
      console.error('Failed to claim rewards:', error);
      toast.error(error.message || 'Failed to claim rewards');
    } finally {
      setIsClaimingRewards(false);
    }
  };

  if (!isMiniPay) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="text-yellow-600 mr-3">⚠️</div>
          <div>
            <h3 className="text-yellow-800 font-medium">MiniPay Required</h3>
            <p className="text-yellow-700 text-sm">
              Open this app in MiniPay to claim your cUSD rewards seamlessly!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">🎁 MiniPay Rewards</h3>
          <p className="text-green-100 text-sm mb-2">
            Claim your cUSD rewards with zero gas fees!
          </p>
          <div className="text-2xl font-bold">
            {pendingRewards} cUSD
          </div>
        </div>
        
        <button
          onClick={handleClaimRewards}
          disabled={isClaimingRewards || claimIsLoading || parseFloat(pendingRewards) === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            isClaimingRewards || claimIsLoading || parseFloat(pendingRewards) === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-white text-green-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
          }`}
        >
          {isClaimingRewards || claimIsLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Claiming...
            </div>
          ) : parseFloat(pendingRewards) === 0 ? (
            'No Rewards'
          ) : (
            'Claim Now'
          )}
        </button>
      </div>
      
      {isConnected && (
        <div className="mt-4 text-xs text-green-100">
          ✅ Connected to MiniPay • Gas fees paid in cUSD
        </div>
      )}
    </div>
  );
}