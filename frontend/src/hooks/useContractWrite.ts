import { useCallback } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { ContractCallOptions } from './useContractErrorHandling';
import { ContractErrorType } from '@/utils/contractErrors';
import { useContractErrorHandling } from './useContractErrorHandling';

/**
 * Hook for enhanced contract write operations
 */
export function useContractWrite() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
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
      address: contract.address as `0x${string}`,
      abi: contract.abi,
    };
  }, []);

  // Write to contract with enhanced error handling and transaction monitoring
  const writeContract = useCallback(async (
    contractName: keyof typeof CONTRACTS,
    functionName: string,
    args: any[] = [],
    value: bigint = BigInt(0),
    options: ContractCallOptions<`0x${string}`> = {}
  ): Promise<`0x${string}` | undefined> => {
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
      value: value.toString(),
      ...context
    };

    // Helper to create and handle errors consistently
    const handleError = async (error: any, txHash?: string): Promise<never> => {
      // If we have a transaction hash, include it in the error context
      if (txHash) {
        errorContext.txHash = txHash;
      }

      const enhancedError = error instanceof Error && 'code' in error
        ? error as any
        : await createContractError(
            ContractErrorType.UNKNOWN_ERROR,
            errorMessages[ContractErrorType.UNKNOWN_ERROR] || 'Failed to execute contract write',
            errorContext,
            error
          );

      // Log the error for debugging
      console.error(
        `[Contract Write Error] ${functionName}@${contractName}${txHash ? ` (tx: ${txHash})` : ''}:`,
        enhancedError
      );

      // Notify user if enabled
      if (showNotifications) {
        // Notification system integration pending
        // toast.error(enhancedError.message, {
        //   errorId: `contract-write-${txHash || Date.now()}`,
        //   autoClose: 10000, // Longer timeout for write operations
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
      if (!walletClient) {
        throw await createContractError(
          ContractErrorType.PROVIDER_ERROR,
          errorMessages[ContractErrorType.PROVIDER_ERROR] || 'Wallet client not available',
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

      // Execute the write operation with enhanced error handling
      const hash = await (async () => {
        try {
          const hash = await walletClient.writeContract({
            address: contractAddress,
            abi,
            functionName,
            args,
            value,
            account: address,
          });

          // Wait for transaction confirmation
          const receipt = await publicClient?.waitForTransactionReceipt({ hash });

          if (!receipt) {
            throw await createContractError(
              ContractErrorType.TRANSACTION_FAILED,
              errorMessages[ContractErrorType.TRANSACTION_FAILED] || 'Transaction receipt not found',
              { ...errorContext, txHash: hash }
            );
          }

          // Check if transaction was successful
          if (receipt.status === 'reverted') {
            let revertReason = 'Transaction reverted';
            try {
              // Try to get revert reason from the transaction
              const code = await publicClient?.getTransaction({ hash });
              if (code?.input) {
                // This is a simplified revert reason extraction
                // In a real implementation, you'd decode the revert reason properly
                revertReason = 'Transaction reverted by contract';
              }
            } catch (e) {
              console.warn('Failed to extract revert reason:', e);
            }

            throw await createContractError(
              ContractErrorType.TRANSACTION_FAILED,
              errorMessages[ContractErrorType.TRANSACTION_FAILED] || `Transaction failed: ${revertReason}`,
              {
                ...errorContext,
                txHash: hash,
                receipt,
                revertReason
              }
            );
          }

          return hash;
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
      onSuccess?.(hash);

      // Show success notification if enabled
      if (showNotifications) {
        // Notification system integration pending
        // toast.success('Transaction confirmed!', {
        //   autoClose: 5000,
        //   txHash: hash,
        //   ...errorContext
        // });
      }

      return hash;
    } catch (error: any) {
      return handleError(error, error.txHash);
    }
  }, [address, walletClient, chainId, publicClient, getContractInfo, createContractError, getNetworkInfo]);

  return {
    writeContract,
    getContractInfo,
  };
}