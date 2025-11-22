'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import toast from 'react-hot-toast';

const MOCK_VRF_ADDRESS = '0x20E8706C5B1e15329Eb7690d79a5E5668DD5525C' as const;

const MOCK_VRF_ABI = [
  {
    "type": "function",
    "name": "fulfillAllPending",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function", 
    "name": "getPendingRequestCount",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  }
] as const;

export default function VRFFulfillment() {
  const [isVisible, setIsVisible] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Check pending VRF requests
  const { data: pendingRequestCount, refetch: refetchPendingCount } = useReadContract({
    address: MOCK_VRF_ADDRESS,
    abi: MOCK_VRF_ABI,
    functionName: 'getPendingRequestCount',
  });

  // Auto-check for pending requests every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchPendingCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchPendingCount]);

  // Update pending count
  useEffect(() => {
    if (pendingRequestCount) {
      const count = Number(pendingRequestCount);
      setPendingCount(count);
      if (count > 0 && !isVisible) {
        setIsVisible(true);
        toast('🎲 VRF requests need fulfillment for your games!', {
          duration: 5000,
          icon: '🎲'
        });
      }
    }
  }, [pendingRequestCount, isVisible]);

  const {
    writeContract: fulfillVRF,
    data: fulfillData,
    isPending: fulfillIsLoading,
    error: fulfillError,
  } = useWriteContract();

  const { isSuccess: fulfillIsSuccess } = useWaitForTransactionReceipt({
    hash: fulfillData,
  });

  const handleFulfillVRF = async () => {
    try {
      toast.loading('Fulfilling VRF requests...', { duration: 30000 });
      
      fulfillVRF({
        address: MOCK_VRF_ADDRESS,
        abi: MOCK_VRF_ABI,
        functionName: 'fulfillAllPending',
      });
    } catch (error: any) {
      console.error('Error fulfilling VRF:', error);
      toast.dismiss();
      toast.error('Failed to fulfill VRF requests');
    }
  };

  // Handle success
  useEffect(() => {
    if (fulfillIsSuccess) {
      toast.dismiss();
      toast.success('VRF requests fulfilled! Your games are now ready.');
      setIsVisible(false);
      refetchPendingCount();
    }
  }, [fulfillIsSuccess, refetchPendingCount]);

  // Handle error
  if (fulfillError) {
    toast.dismiss();
    toast.error('Failed to fulfill VRF requests');
  }

  if (!isVisible && pendingCount === 0) {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 right-4 text-white px-4 py-2 rounded-lg text-sm shadow-lg transition-all ${
          pendingCount > 0 
            ? 'bg-orange-600 hover:bg-orange-700 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        🎲 {pendingCount > 0 ? `${pendingCount} Games Waiting` : 'VRF Helper'}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-200 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">VRF Helper</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {pendingCount > 0 
          ? `You have ${pendingCount} games waiting for questions. Click below to complete them:`
          : 'If your game is stuck after clicking "Start Playing", click below to fulfill VRF requests:'
        }
      </p>
      
      <button
        onClick={handleFulfillVRF}
        disabled={fulfillIsLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-all"
      >
        {fulfillIsLoading ? '⏳ Fulfilling...' : '🎲 Fulfill VRF Requests'}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        This triggers the random question assignment for your game.
      </p>
    </div>
  );
}