import { useCallback } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { Address } from 'viem';
import { ContractCallOptions } from './useContractErrorHandling';
import { ContractErrorType } from '@/utils/contractErrors';
import { useContractErrorHandling } from './useContractErrorHandling';

/**
 * Hook for enhanced contract read operations
 */
export function useContractRead() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { createContractError, getNetworkInfo } = useContractErrorHandling();

  // Get contract ABI and address with proper type checking
  const getContractInfo = useCallback((contractName: keyof typeof CONTRACTS) => {
    const contract = CONTRACTS[contractName];
    if (!contract) {
      throw new Error(`Contract ${contractName} not found in config`);
    }

    if (!('abi' in contract)) {
      throw new Error(`No ABI found for contract ${contractName}`);
    }

    return {
      address: contract.address as Address,
      abi: contract.abi,
    };
  }, []);

  // Read from contract with enhanced error handling and retry logic
  const readContract = useCallback(async <T = any>(
    contractName: keyof typeof CONTRACTS,
    functionName: string,
    args: any[] = [],
    options: ContractCallOptions<T> = {}
  ): Promise<T | undefined> => {
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
      functionName,
      contractName,
      args,
      ...context
    };

    // Helper to create and handle errors consistently
    const handleError = async (error: any): Promise<never> => {
      const enhancedError = error instanceof Error && 'code' in error
        ? error as any
        : await createContractError(
            ContractErrorType.UNKNOWN_ERROR,
            errorMessages[ContractErrorType.UNKNOWN_ERROR] || 'Failed to read contract',
            errorContext,
            error
          );

      // Log the error for debugging
      console.error(`[Contract Read Error] ${functionName}@${contractName}:`, enhancedError);

      // Notify user if enabled
      if (showNotifications) {
        // TODO: Uncomment and integrate with your notification system
        // toast.error(enhancedError.message, {
        //   errorId: `contract-read-${Date.now()}`,
        //   autoClose: 5000,
        //   ...enhancedError.details
        // });
      }

      // Call the error callback if provided
      onError?.(enhancedError);

      // Either re-throw or return undefined based on throwErrors flag
      if (throwErrors) {
        throw enhancedError;
      }

      throw enhancedError; // This will be caught by the retry logic
    };

    try {
      // Validate environment
      if (!publicClient) {
        throw await createContractError(
          ContractErrorType.PROVIDER_ERROR,
          errorMessages[ContractErrorType.PROVIDER_ERROR] || 'Blockchain provider not available',
          errorContext
        );
      }

      if (!address) {
        throw await createContractError(
          ContractErrorType.WALLET_NOT_CONNECTED,
          errorMessages[ContractErrorType.WALLET_NOT_CONNECTED] || 'Please connect your wallet to continue',
          errorContext
        );
      }

      // Check if the current chain is supported
      const isSupportedChain = Object.values(CONTRACTS).some(contract =>
        'chainId' in contract && contract.chainId === chainId
      );

      if (!isSupportedChain) {
        const networkInfo = await getNetworkInfo();
        throw await createContractError(
          ContractErrorType.CHAIN_NOT_SUPPORTED,
          errorMessages[ContractErrorType.CHAIN_NOT_SUPPORTED] ||
            `Unsupported network. Please switch to a supported network. Current: ${networkInfo.chainName} (${networkInfo.chainId})`,
          { ...errorContext, currentChain: networkInfo }
        );
      }

      const { address: contractAddress, abi } = getContractInfo(contractName);

      // Execute the read operation with retry logic
      const result = await (async () => {
        try {
          return await publicClient.readContract({
            address: contractAddress,
            abi,
            functionName,
            args,
            account: address,
          });
        } catch (error: any) {
          // Handle specific contract errors
          if (error?.shortMessage?.includes('revert')) {
            const revertReason = error.shortMessage.split('\n')[0];
            throw await createContractError(
              ContractErrorType.TRANSACTION_FAILED,
              errorMessages[ContractErrorType.TRANSACTION_FAILED] || `Transaction reverted: ${revertReason}`,
              { ...errorContext, revertReason },
              error
            );
          }
          throw error;
        }
      })();

      // Call success callback if provided
      onSuccess?.(result);

      return result;
    } catch (error: any) {
      return handleError(error);
    }
  }, [address, chainId, publicClient, getContractInfo, createContractError, getNetworkInfo]);

  return {
    readContract,
    getContractInfo,
  };
}