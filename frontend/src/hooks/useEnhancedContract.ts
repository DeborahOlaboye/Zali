import { useCallback, useMemo } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { 
  ContractError, 
  ContractErrorType, 
  parseContractError, 
  withContractErrorHandling,
  createErrorHandler,
  withRetry
} from '@/utils/contractErrors';
import { CONTRACTS } from '@/config/contracts';
import { Address } from 'viem';
import { getNetwork } from 'viem/actions';

export interface ContractCallOptions<T = any> {
  /**
   * Callback when the operation succeeds
   */
  onSuccess?: (result: T) => void;
  /**
   * Callback when the operation fails
   */
  onError?: (error: ContractError) => void;
  /**
   * Whether to throw errors or return them
   * @default true
   */
  throwErrors?: boolean;
  /**
   * Whether to show error notifications
   * @default true
   */
  showNotifications?: boolean;
  /**
   * Additional context for error messages
   */
  context?: Record<string, any>;
  /**
   * Custom error messages for specific error codes
   */
  errorMessages?: Record<string, string>;
}

interface EnhancedContractReturn {
  // Core functions
  readContract: <T = any>(
    contractName: keyof typeof CONTRACTS,
    functionName: string,
    args?: any[],
    options?: ContractCallOptions<T>
  ) => Promise<T | undefined>;
  
  writeContract: (
    contractName: keyof typeof CONTRACTS,
    functionName: string,
    args?: any[],
    value?: bigint,
    options?: ContractCallOptions<`0x${string}`>
  ) => Promise<`0x${string}` | undefined>;
  
  createContract: <T = any>(
    contractName: keyof typeof CONTRACTS,
    options?: Partial<ContractCallOptions>
  ) => {
    read: <R = any>(
      functionName: string,
      args?: any[],
      callOptions?: ContractCallOptions<R>
    ) => Promise<R | undefined>;
    
    write: (
      functionName: string,
      args?: any[],
      value?: bigint,
      callOptions?: ContractCallOptions<`0x${string}`>
    ) => Promise<`0x${string}` | undefined>;
  };
  
  // State
  isConnected: boolean;
  isSupportedChain: boolean;
  address: `0x${string}` | undefined;
  chainId: number;
  chain: any; // TODO: Import proper chain type from wagmi
  
  // Helpers
  getContractInfo: (contractName: keyof typeof CONTRACTS) => { address: Address; abi: any };
  
  // Create contract instance with default options
  contract: <T = any>(
    contractName: keyof typeof CONTRACTS,
    options?: Partial<ContractCallOptions>
  ) => ReturnType<EnhancedContractReturn['createContract']>;
}

export function useEnhancedContract(): EnhancedContractReturn {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // Check if the current chain is supported
  const isSupportedChain = useMemo(() => {
    // Check if any contract has the current chain ID
    return Object.values(CONTRACTS).some(contract => 
      'chainId' in contract && contract.chainId === chainId
    );
  }, [chainId]);

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

  // Get current network information
  const getNetworkInfo = useCallback(async () => {
    try {
      const network = await getNetwork();
      return {
        chainId: network.chain?.id,
        chainName: network.chain?.name,
        isTestnet: network.chain?.testnet ?? false
      };
    } catch (error) {
      console.warn('Failed to get network info:', error);
      return { chainId: chainId, chainName: 'Unknown', isTestnet: false };
    }
  }, [chainId]);

  // Helper to create a contract error with enhanced context
  const createContractError = useCallback(async (
    code: ContractErrorType,
    message: string,
    details: Record<string, any> = {},
    originalError?: any
  ): Promise<ContractError> => {
    const networkInfo = await getNetworkInfo();
    const timestamp = new Date().toISOString();
    
    const enhancedDetails = {
      ...details,
      timestamp,
      network: {
        chainId: networkInfo.chainId,
        chainName: networkInfo.chainName,
        isTestnet: networkInfo.isTestnet,
      },
      // Add wallet info if available
      ...(address && { wallet: { address } }),
      // Add contract info if available
      ...(details.contractName && { 
        contract: {
          name: details.contractName,
          address: CONTRACTS[details.contractName as keyof typeof CONTRACTS]?.address
        }
      })
    };

    const error = new Error(message) as ContractError;
    error.code = code;
    error.details = enhancedDetails;
    
    // Preserve original error information
    if (originalError) {
      error.originalError = originalError;
      // Combine stack traces for better debugging
      error.stack = `${error.stack}\n--- Original Error ---\n${originalError.stack || originalError.message || originalError}`;
      
      // Add additional error details if available
      if (originalError.code) {
        enhancedDetails.originalErrorCode = originalError.code;
      }
      if (originalError.reason) {
        enhancedDetails.originalReason = originalError.reason;
      }
      if (originalError.method) {
        enhancedDetails.originalMethod = originalError.method;
      }
    }
    
    return error;
  }, [address, getNetworkInfo]);

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
      const enhancedError = error instanceof ContractError 
        ? error 
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
      const result = await withRetry<T>(
        () => withContractErrorHandling<T>(
          async () => {
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
                  errorMessages[ContractErrorType.TRANSACTION_FAILED] || 
                    `Transaction reverted: ${revertReason}`,
                  { ...errorContext, revertReason },
                  error
                );
              }
              throw error;
            }
          },
          { 
            ...errorContext,
            contractAddress,
            action: `read_${functionName}`
          }
        ),
        {
          // Don't retry on validation errors or user rejections
          shouldRetry: (error: any) => {
            const nonRetryable = [
              ContractErrorType.INVALID_INPUT,
              ContractErrorType.VALIDATION_ERROR,
              ContractErrorType.TRANSACTION_REJECTED,
              ContractErrorType.INSUFFICIENT_FUNDS
            ];
            return !nonRetryable.includes(error?.code);
          }
        }
      );

      // Call success callback if provided
      onSuccess?.(result);
      
      return result;
    } catch (error: any) {
      return handleError(error);
    }
  }, [address, isSupportedChain, publicClient, getContractInfo, chainId, createContractError, getNetworkInfo]);

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

      const enhancedError = error instanceof ContractError 
        ? error 
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
        // TODO: Uncomment and integrate with your notification system
        // toast.error(enhancedError.message, {
        //   errorId: `contract-write-${txHash || Date.now()}`,
        //   autoClose: 10000, // Longer timeout for write operations
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

      if (!walletClient?.account?.address) {
        throw await createContractError(
          ContractErrorType.WALLET_NOT_CONNECTED,
          errorMessages[ContractErrorType.WALLET_NOT_CONNECTED] || 'Please connect your wallet to continue',
          errorContext
        );
      }

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
      const account = walletClient.account.address;

      // Execute the write operation with retry logic
      const result = await withRetry<`0x${string}`>(
        async () => {
          try {
            // 1. First simulate the transaction to catch any potential errors
            const { request } = await withContractErrorHandling(
              () => publicClient.simulateContract({
                account,
                address: contractAddress,
                abi,
                functionName,
                args,
                value,
              }),
              { 
                ...errorContext,
                isSimulation: true,
                action: `simulate_${functionName}`
              }
            );

            // 2. Execute the transaction
            const hash = await withContractErrorHandling<`0x${string}`>(
              () => walletClient.writeContract({
                ...request,
                account,
              }),
              { 
                ...errorContext,
                action: `write_${functionName}`
              }
            ) as `0x${string}`;

            // 3. Wait for transaction confirmation
            const receipt = await withContractErrorHandling(
              () => publicClient.waitForTransactionReceipt({
                hash,
                confirmations: 1,
                timeout: 120_000, // 2 minute timeout for writes
              }),
              { 
                ...errorContext,
                txHash: hash,
                action: `confirm_${functionName}`
              }
            );

            // 4. Check transaction status
            if (receipt.status === 'success') {
              return hash;
            } else {
              // If transaction failed, extract revert reason if available
              let revertReason = 'Transaction reverted';
              try {
                // Try to get the revert reason from the receipt
                const tx = await publicClient.getTransaction({ hash });
                const code = await publicClient.call({
                  ...tx,
                  blockNumber: receipt.blockNumber,
                });
                if (code.error) {
                  revertReason = code.error.message || revertReason;
                }
              } catch (e) {
                console.warn('Failed to extract revert reason:', e);
              }
              
              throw await createContractError(
                ContractErrorType.TRANSACTION_FAILED,
                errorMessages[ContractErrorType.TRANSACTION_FAILED] || 
                  `Transaction failed: ${revertReason}`,
                { 
                  ...errorContext,
                  txHash: hash,
                  receipt,
                  revertReason
                }
              );
            }
          } catch (error: any) {
            // Handle specific contract errors
            if (error?.shortMessage?.includes('revert')) {
              const revertReason = error.shortMessage.split('\n')[0];
              throw await createContractError(
                ContractErrorType.TRANSACTION_FAILED,
                errorMessages[ContractErrorType.TRANSACTION_FAILED] || 
                  `Transaction reverted: ${revertReason}`,
                { ...errorContext, revertReason },
                error
              );
            }
            throw error;
          }
        },
        {
          // Don't retry on validation errors, user rejections, or insufficient funds
          shouldRetry: (error: any) => {
            const nonRetryable = [
              ContractErrorType.INVALID_INPUT,
              ContractErrorType.VALIDATION_ERROR,
              ContractErrorType.TRANSACTION_REJECTED,
              ContractErrorType.INSUFFICIENT_FUNDS,
              ContractErrorType.INSUFFICIENT_BALANCE
            ];
            return !nonRetryable.includes(error?.code);
          }
        }
      );

      // Call success callback if provided
      onSuccess?.(result);
      
      // Show success notification if enabled
      if (showNotifications) {
        // TODO: Uncomment and integrate with your notification system
        // toast.success('Transaction confirmed!', {
        //   autoClose: 5000,
        //   txHash: result,
        //   ...errorContext
        // });
      }
      
      return result;
    } catch (error: any) {
      return handleError(error, error.txHash);
    }
  }, [address, walletClient, isSupportedChain, publicClient, getContractInfo, chainId]);

  // Create a contract instance with typed methods and default options
  const createContract = useCallback(<T = any>(
    contractName: keyof typeof CONTRACTS,
    options: Partial<ContractCallOptions> = {}
  ) => {
    const defaultOptions: ContractCallOptions = {
      throwErrors: true,
      showNotifications: true,
      ...options,
      // Add default error messages for common contract interactions
      errorMessages: {
        [ContractErrorType.WALLET_NOT_CONNECTED]: 'Please connect your wallet to continue',
        [ContractErrorType.CHAIN_NOT_SUPPORTED]: 'Unsupported network. Please switch to a supported network.',
        [ContractErrorType.INSUFFICIENT_FUNDS]: 'Insufficient funds for transaction',
        [ContractErrorType.TRANSACTION_REJECTED]: 'Transaction was rejected',
        [ContractErrorType.TRANSACTION_FAILED]: 'Transaction failed',
        [ContractErrorType.PROVIDER_ERROR]: 'Blockchain provider error',
        [ContractErrorType.UNKNOWN_ERROR]: 'An unknown error occurred',
        // Allow custom error messages to override defaults
        ...options.errorMessages
      }
    };

    // Create a scoped error handler for this contract
    const handleError = createErrorHandler(`contract:${contractName}`);

    return {
      /**
       * Read from the contract
       * @param functionName Name of the function to call
       * @param args Arguments to pass to the function
       * @param callOptions Additional call options
       */
      read: async <R = any>(
        functionName: string,
        args: any[] = [],
        callOptions: ContractCallOptions<R> = {}
      ): Promise<R | undefined> => {
        try {
          const result = await readContract<R>(
            contractName,
            functionName,
            args,
            { 
              ...defaultOptions, 
              ...callOptions,
              // Merge error messages
              errorMessages: {
                ...defaultOptions.errorMessages,
                ...callOptions.errorMessages
              }
            }
          );
          return result;
        } catch (error) {
          // Handle the error and re-throw if needed
          const { message, code, details } = handleError(error);
          if (defaultOptions.throwErrors !== false) {
            throw createContractError(code, message, details, error);
          }
          return undefined;
        }
      },
      
      /**
       * Write to the contract
       * @param functionName Name of the function to call
       * @param args Arguments to pass to the function
       * @param value Amount of native currency to send with the transaction
       * @param callOptions Additional call options
       */
      write: async (
        functionName: string,
        args: any[] = [],
        value: bigint = BigInt(0),
        callOptions: ContractCallOptions<`0x${string}`> = {}
      ): Promise<`0x${string}` | undefined> => {
        try {
          const result = await writeContract(
            contractName,
            functionName,
            args,
            value,
            { 
              ...defaultOptions, 
              ...callOptions,
              // Merge error messages
              errorMessages: {
                ...defaultOptions.errorMessages,
                ...callOptions.errorMessages
              }
            }
          );
          return result;
        } catch (error) {
          // Handle the error and re-throw if needed
          const { message, code, details } = handleError(error);
          if (defaultOptions.throwErrors !== false) {
            throw createContractError(code, message, details, error);
          }
          return undefined;
        }
      },
      
      /**
       * Get the contract's ABI and address
       */
      get info() {
        return getContractInfo(contractName);
      },
      
      /**
       * Create a typed instance with default arguments
       */
      with: <TArgs extends any[] = any[], TValue extends bigint = bigint>(
        defaults: {
          args?: TArgs;
          value?: TValue;
          options?: Partial<ContractCallOptions>;
        } = {}
      ) => ({
        read: <R = any>(
          functionName: string,
          args: any[] = [],
          callOptions: ContractCallOptions<R> = {}
        ) => this.read<R>(
          functionName,
          [...(defaults.args || []), ...args] as any,
          { ...defaults.options, ...callOptions }
        ),
        
        write: (
          functionName: string,
          args: any[] = [],
          value: bigint = defaults.value || BigInt(0),
          callOptions: ContractCallOptions<`0x${string}`> = {}
        ) => this.write(
          functionName,
          [...(defaults.args || []), ...args] as any,
          value,
          { ...defaults.options, ...callOptions }
        )
      })
    };
  }, [readContract, writeContract, createContractError, getContractInfo]);

  // Create a contract instance with default options (shortcut)
  const contract = useCallback(<T = any>(
    contractName: keyof typeof CONTRACTS,
    options: Partial<ContractCallOptions> = {}
  ) => createContract<T>(contractName, options), [createContract]);

  return {
    // Core functions
    readContract,
    writeContract,
    createContract,
    
    // State
    isConnected: !!isConnected,
    isSupportedChain,
    address: address as `0x${string}` | undefined,
    chainId,
    chain: publicClient?.chain,
    
    // Helpers
    getContractInfo,
    
    // Create contract instance with default options
    contract,
  };
}

// Example usage:
/*
const { createContract } = useEnhancedContract();
const triviaGame = createContract('triviaGameV2');

// Read from contract
try {
  const playerInfo = await triviaGame.read('getPlayerInfo', [address]);
  console.log('Player info:', playerInfo);
} catch (error) {
  console.error('Failed to get player info:', error);
}

// Write to contract
try {
  const txHash = await triviaGame.write('registerUsername', ['myUsername']);
  console.log('Transaction hash:', txHash);
} catch (error) {
  console.error('Failed to register username:', error);
  // Handle specific error types
  if (error.code === 'ALREADY_REGISTERED') {
    // Show user-friendly message
  }
}
*/
