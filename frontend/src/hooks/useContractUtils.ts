import { useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { ContractCallOptions } from './useContractErrorHandling';
import { useContractErrorHandling } from './useContractErrorHandling';
import { useContractRead } from './useContractRead';
import { useContractWrite } from './useContractWrite';

/**
 * Hook for enhanced contract utilities
 */
export function useContractUtils() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { createContractError, getNetworkInfo } = useContractErrorHandling();
  const { readContract } = useContractRead();
  const { writeContract } = useContractWrite();

  // Create a contract instance with enhanced capabilities
  const createContract = useCallback((
    contractName: keyof typeof CONTRACTS,
    options: ContractCallOptions<`0x${string}`> = {}
  ) => {
    const {
      onSuccess,
      onError,
      throwErrors = true,
      showNotifications = true,
      context = {},
      errorMessages = {}
    } = options;

    // Create a context object with all relevant information
    const errorContext = {
      contractName,
      ...context
    };

    // Helper to create and handle errors consistently
    const handleError = async (error: any): Promise<never> => {
      const enhancedError = error instanceof Error && 'code' in error
        ? error as any
        : await createContractError(
            'UNKNOWN_ERROR' as any,
            errorMessages['UNKNOWN_ERROR' as any] || 'Failed to create contract instance',
            errorContext,
            error
          );

      // Log the error for debugging
      console.error(`[Contract Utils Error] createContract@${contractName}:`, enhancedError);

      // Notify user if enabled
      if (showNotifications) {
        // Notification system integration pending
        // toast.error(enhancedError.message, {
        //   errorId: `contract-utils-${Date.now()}`,
        //   autoClose: 5000,
        //   ...enhancedError.details
        // });
      }

      // Call the error callback if provided
      onError?.(enhancedError);

      if (throwErrors) {
        throw enhancedError;
      }

      throw enhancedError;
    };

    try {
      // Validate environment
      if (!address) {
        throw createContractError(
          'WALLET_NOT_CONNECTED' as any,
          errorMessages['WALLET_NOT_CONNECTED' as any] || 'Please connect your wallet to continue',
          errorContext
        );
      }

      // Check if the current chain is supported
      const isSupportedChain = Object.values(CONTRACTS).some(contract =>
        'chainId' in contract && contract.chainId === chainId
      );

      if (!isSupportedChain) {
        const networkInfo = getNetworkInfo();
        throw createContractError(
          'CHAIN_NOT_SUPPORTED' as any,
          errorMessages['CHAIN_NOT_SUPPORTED' as any] ||
            `Unsupported network. Please switch to a supported network. Current: ${networkInfo.chainName} (${networkInfo.chainId})`,
          { ...errorContext, currentChain: networkInfo }
        );
      }

      // Return enhanced contract instance
      return {
        // Read operations
        read: async (functionName: string, args: any[] = []) => {
          return readContract(contractName, functionName, args, {
            ...options,
            context: { ...errorContext, operation: 'read', functionName, args }
          });
        },

        // Write operations
        write: async (functionName: string, args: any[] = [], value: bigint = BigInt(0)) => {
          return writeContract(contractName, functionName, args, value, {
            ...options,
            context: { ...errorContext, operation: 'write', functionName, args, value: value.toString() }
          });
        },

        // Utility methods
        getAddress: () => {
          const contract = CONTRACTS[contractName];
          if (!contract) {
            throw new Error(`Contract ${contractName} not found in config`);
          }
          return contract.address as `0x${string}`;
        },

        getAbi: () => {
          const contract = CONTRACTS[contractName];
          if (!contract || !('abi' in contract)) {
            throw new Error(`No ABI found for contract ${contractName}`);
          }
          return contract.abi;
        },

        // Contract info
        name: contractName,
        chainId,
        userAddress: address,
      };
    } catch (error: any) {
      return handleError(error);
    }
  }, [address, chainId, readContract, writeContract, createContractError, getNetworkInfo]);

  // Batch read operations for efficiency
  const batchRead = useCallback(async (
    operations: Array<{
      contractName: keyof typeof CONTRACTS;
      functionName: string;
      args?: any[];
      options?: ContractCallOptions<any>;
    }>
  ) => {
    const results = await Promise.allSettled(
      operations.map(({ contractName, functionName, args = [], options = {} }) =>
        readContract(contractName, functionName, args, {
          ...options,
          context: { operation: 'batchRead', contractName, functionName, args, ...options.context }
        })
      )
    );

    return results.map((result, index) => {
      const operation = operations[index];
      if (result.status === 'fulfilled') {
        return { success: true, data: result.value, operation };
      } else {
        return { success: false, error: result.reason, operation };
      }
    });
  }, [readContract]);

  // Batch write operations (sequential to avoid nonce issues)
  const batchWrite = useCallback(async (
    operations: Array<{
      contractName: keyof typeof CONTRACTS;
      functionName: string;
      args?: any[];
      value?: bigint;
      options?: ContractCallOptions<`0x${string}`>;
    }>
  ) => {
    const results = [];

    for (const { contractName, functionName, args = [], value = BigInt(0), options = {} } of operations) {
      try {
        const txHash = await writeContract(contractName, functionName, args, value, {
          ...options,
          context: { operation: 'batchWrite', contractName, functionName, args, value: value.toString(), ...options.context }
        });
        results.push({ success: true, txHash, operation: { contractName, functionName, args, value } });
      } catch (error) {
        results.push({ success: false, error, operation: { contractName, functionName, args, value } });
        // Stop on first error to prevent further issues
        break;
      }
    }

    return results;
  }, [writeContract]);

  // Estimate gas for a contract call
  const estimateGas = useCallback(async (
    contractName: keyof typeof CONTRACTS,
    functionName: string,
    args: any[] = [],
    value: bigint = BigInt(0)
  ) => {
    try {
      const contract = CONTRACTS[contractName];
      if (!contract || !('abi' in contract)) {
        throw new Error(`Contract ${contractName} not found or missing ABI`);
      }

      // This would require a public client to estimate gas
      // Implementation depends on your wagmi setup
      // For now, return a placeholder
      return BigInt(21000); // Basic transaction gas
    } catch (error) {
      console.error(`Failed to estimate gas for ${functionName}@${contractName}:`, error);
      throw error;
    }
  }, []);

  // Get contract events
  const getContractEvents = useCallback(async (
    contractName: keyof typeof CONTRACTS,
    eventName: string,
    fromBlock?: bigint,
    toBlock?: bigint,
    args?: any
  ) => {
    try {
      const contract = CONTRACTS[contractName];
      if (!contract || !('abi' in contract)) {
        throw new Error(`Contract ${contractName} not found or missing ABI`);
      }

      // This would require a public client to get logs
      // Implementation depends on your wagmi setup
      // For now, return empty array
      return [];
    } catch (error) {
      console.error(`Failed to get events for ${eventName}@${contractName}:`, error);
      throw error;
    }
  }, []);

  return {
    createContract,
    batchRead,
    batchWrite,
    estimateGas,
    getContractEvents,
  };
}