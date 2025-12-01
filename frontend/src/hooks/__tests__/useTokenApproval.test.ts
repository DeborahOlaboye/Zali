/**
 * Tests for useTokenApproval hook
 * 
 * To run these tests, install the following dependencies:
 * npm install --save-dev @testing-library/react @testing-library/react-hooks @testing-library/jest-dom jest jest-environment-jsdom @types/jest
 * 
 * Add to package.json scripts:
 * "test": "jest",
 * "test:watch": "jest --watch"
 * 
 * Create jest.config.js:
 * module.exports = {
 *   testEnvironment: 'jsdom',
 *   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
 *   moduleNameMapper: {
 *     '^@/(.*)$': '<rootDir>/src/$1',
 *   },
 * };
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useTokenApproval } from '../useTokenApproval';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useCeloMiniPay } from '../useCeloMiniPay';

// Mock dependencies
jest.mock('wagmi');
jest.mock('../useCeloMiniPay');
jest.mock('@/config/contracts', () => ({
  CONTRACTS: {
    cUSD: {
      address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      abi: [
        {
          name: 'approve',
          type: 'function',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
        {
          name: 'allowance',
          type: 'function',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
          ],
        },
      ],
    },
    triviaGameV2: {
      address: '0x80B56E7ac1841a3b099c13f85c8A092759E2909c',
    },
  },
  GAME_CONSTANTS: {
    ENTRY_FEE: 0.05,
  },
}));

describe('useTokenApproval', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockAllowance = BigInt('1000000000000000000'); // 1 token
  const mockRequiredAmount = BigInt('50000000000000000'); // 0.05 tokens

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAccount as jest.Mock).mockReturnValue({
      address: mockAddress,
    });

    (useCeloMiniPay as jest.Mock).mockReturnValue({
      isMiniPay: false,
      sendTransaction: null,
    });

    (useReadContract as jest.Mock).mockReturnValue({
      data: mockAllowance,
      isLoading: false,
      refetch: jest.fn().mockResolvedValue({ data: mockAllowance }),
    });

    (useWriteContract as jest.Mock).mockReturnValue({
      writeContract: jest.fn(),
      data: null,
      isPending: false,
      isError: false,
      error: null,
      reset: jest.fn(),
    });

    (useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
  });

  describe('initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useTokenApproval());

      expect(result.current.allowance).toBe(mockAllowance);
      expect(result.current.needsApproval).toBe(false);
      expect(result.current.hasSufficientApproval).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should detect when approval is needed', () => {
      (useReadContract as jest.Mock).mockReturnValue({
        data: BigInt('0'),
        isLoading: false,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useTokenApproval());

      expect(result.current.needsApproval).toBe(true);
      expect(result.current.hasSufficientApproval).toBe(false);
    });
  });

  describe('loading states', () => {
    it('should show loading when checking allowance', () => {
      (useReadContract as jest.Mock).mockReturnValue({
        data: null,
        isLoading: true,
        refetch: jest.fn(),
      });

      const { result } = renderHook(() => useTokenApproval());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isLoadingAllowance).toBe(true);
    });

    it('should show loading when approving', () => {
      (useWriteContract as jest.Mock).mockReturnValue({
        writeContract: jest.fn(),
        data: null,
        isPending: true,
        isError: false,
        error: null,
        reset: jest.fn(),
      });

      const { result } = renderHook(() => useTokenApproval());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isApproving).toBe(true);
    });

    it('should show loading when waiting for approval confirmation', () => {
      (useWriteContract as jest.Mock).mockReturnValue({
        writeContract: jest.fn(),
        data: '0x123',
        isPending: false,
        isError: false,
        error: null,
        reset: jest.fn(),
      });

      (useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() => useTokenApproval());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isWaitingForApproval).toBe(true);
    });
  });

  describe('approve function', () => {
    it('should call approve with correct parameters', async () => {
      const mockApprove = jest.fn();
      (useWriteContract as jest.Mock).mockReturnValue({
        writeContract: mockApprove,
        data: null,
        isPending: false,
        isError: false,
        error: null,
        reset: jest.fn(),
      });

      const { result } = renderHook(() => useTokenApproval());

      await result.current.approve();

      expect(mockApprove).toHaveBeenCalledWith({
        address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
        abi: expect.any(Array),
        functionName: 'approve',
        args: ['0x80B56E7ac1841a3b099c13f85c8A092759E2909c', expect.any(BigInt)],
      });
    });

    it('should throw error when wallet is not connected', async () => {
      (useAccount as jest.Mock).mockReturnValue({
        address: null,
      });

      const { result } = renderHook(() => useTokenApproval());

      await expect(result.current.approve()).rejects.toThrow('Wallet not connected');
    });
  });

  describe('error handling', () => {
    it('should handle approval errors', () => {
      const mockError = new Error('Approval failed');
      (useWriteContract as jest.Mock).mockReturnValue({
        writeContract: jest.fn(),
        data: null,
        isPending: false,
        isError: true,
        error: mockError,
        reset: jest.fn(),
      });

      const { result } = renderHook(() => useTokenApproval());

      expect(result.current.error).toBe(mockError);
      expect(result.current.approveIsError).toBe(true);
    });
  });

  describe('success states', () => {
    it('should show success when approval is confirmed', () => {
      (useReadContract as jest.Mock).mockReturnValue({
        data: mockAllowance,
        isLoading: false,
        refetch: jest.fn(),
      });

      (useWriteContract as jest.Mock).mockReturnValue({
        writeContract: jest.fn(),
        data: '0x123',
        isPending: false,
        isError: false,
        error: null,
        reset: jest.fn(),
      });

      (useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      const { result } = renderHook(() => useTokenApproval());

      expect(result.current.isSuccess).toBe(true);
    });
  });
});

