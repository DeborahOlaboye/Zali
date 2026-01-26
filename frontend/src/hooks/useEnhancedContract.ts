import { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { Address, type Chain } from 'viem';
import { useContractErrorHandling } from './useContractErrorHandling';
import { useContractRead } from './useContractRead';
import { useContractWrite } from './useContractWrite';
import { useContractUtils } from './useContractUtils';

export interface ContractCallOptions<T = any> {
  /**
   * Callback when the operation succeeds
   */
  onSuccess?: (result: T) => void;
  /**
   * Callback when the operation fails
   */
  onError?: (error: any) => void;
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
  chain: Chain | undefined;

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

  // Use the modular hooks
  const { createContractError, getNetworkInfo } = useContractErrorHandling();
  const { readContract } = useContractRead();
  const { writeContract } = useContractWrite();
  const { createContract: createContractUtils, batchRead, batchWrite, estimateGas, getContractEvents } = useContractUtils();

  // Check if the current chain is supported
  const isSupportedChain = useMemo(() => {
    // Check if any contract has the current chain ID
    return Object.values(CONTRACTS).some(contract =>
      'chainId' in contract && contract.chainId === chainId
    );
  }, [chainId]);

  // Get contract ABI and address with proper type checking
  const getContractInfo = (contractName: keyof typeof CONTRACTS) => {
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
  };

  // Create a contract instance with typed methods and default options
  const createContract = <T = any>(
    contractName: keyof typeof CONTRACTS,
    options: Partial<ContractCallOptions> = {}
  ) => {
    const defaultOptions: ContractCallOptions = {
      throwErrors: true,
      showNotifications: true,
      ...options,
      // Add default error messages for common contract interactions
      errorMessages: {
        WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
        CHAIN_NOT_SUPPORTED: 'Unsupported network. Please switch to a supported network.',
        INSUFFICIENT_FUNDS: 'Insufficient funds for transaction',
        TRANSACTION_REJECTED: 'Transaction was rejected',
        TRANSACTION_FAILED: 'Transaction failed',
        PROVIDER_ERROR: 'Blockchain provider error',
        UNKNOWN_ERROR: 'An unknown error occurred',
        // Allow custom error messages to override defaults
        ...options.errorMessages
      }
    };

    // Create a scoped error handler for this contract
    const handleError = (error: any) => {
      const message = error?.message || 'An error occurred';
      const code = error?.code || 'UNKNOWN_ERROR';
      const details = error?.details || {};
      return { message, code, details };
    };

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
  };

  // Create a contract instance with default options (shortcut)
  const contract = <T = any>(
    contractName: keyof typeof CONTRACTS,
    options: Partial<ContractCallOptions> = {}
  ) => createContract<T>(contractName, options);

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
    chain: undefined as Chain | undefined

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
