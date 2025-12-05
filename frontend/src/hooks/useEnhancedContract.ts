import { useCallback, useMemo } from 'react';
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi';
import { ContractError, ContractErrorType, parseContractError, withContractErrorHandling } from '@/utils/contractErrors';
import { CONTRACTS } from '@/config/contracts';
import { Address } from 'viem';

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

  // Helper to create a contract error
  const createContractError = (
    code: ContractErrorType,
    message: string,
    details?: Record<string, any>,
    originalError?: any
  ): ContractError => {
    const error = new Error(message) as ContractError;
    error.code = code;
    error.details = details;
    error.originalError = originalError;
    return error;
  };

  // Read from contract with enhanced error handling
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
      context = {}
    } = options;

    try {
      if (!publicClient) {
        throw createContractError(
          ContractErrorType.PROVIDER_ERROR,
          'Ethereum provider not available',
          { functionName, contractName, ...context }
        );
      }

      if (!address) {
        throw createContractError(
          ContractErrorType.WALLET_NOT_CONNECTED,
          'Please connect your wallet to continue',
          { functionName, contractName, ...context }
        );
      }

      if (!isSupportedChain) {
        throw createContractError(
          ContractErrorType.CHAIN_NOT_SUPPORTED,
          'Unsupported network. Please switch to a supported network.',
          { functionName, contractName, chainId, ...context }
        );
      }

      const { address: contractAddress, abi } = getContractInfo(contractName);
      
      const result = await withContractErrorHandling<T>(
        () => publicClient.readContract({
          address: contractAddress,
          abi,
          functionName,
          args,
          account: address,
        }),
        { functionName, contractName, ...context }
      );

      onSuccess?.(result);
      return result;
    } catch (error: any) {
      const enhancedError = error instanceof ContractError 
        ? error 
        : parseContractError(error, {
            functionName,
            contractName,
            ...context
          });
      
      onError?.(enhancedError);
      
      if (showNotifications) {
        console.error(`[Contract Read Error] ${functionName}:`, enhancedError);
        // TODO: Integrate with notification system
        // toast.error(enhancedError.message);
      }
      
      if (throwErrors) {
        throw enhancedError;
      }
      
      return undefined;
    }
  }, [address, isSupportedChain, publicClient, getContractInfo, chainId]);

  // Write to contract with enhanced error handling
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
      context = {}
    } = options;

    try {
      if (!publicClient) {
        throw createContractError(
          ContractErrorType.PROVIDER_ERROR,
          'Ethereum provider not available',
          { functionName, contractName, ...context }
        );
      }

      if (!walletClient) {
        throw createContractError(
          ContractErrorType.WALLET_NOT_CONNECTED,
          'Wallet client not available',
          { functionName, contractName, ...context }
        );
      }

      if (!isSupportedChain) {
        throw createContractError(
          ContractErrorType.CHAIN_NOT_SUPPORTED,
          'Unsupported network. Please switch to a supported network.',
          { functionName, contractName, chainId, ...context }
        );
      }

      const { address: contractAddress, abi } = getContractInfo(contractName);
      
      // Simulate the transaction first to catch any potential errors
      const { request } = await withContractErrorHandling(
        () => publicClient.simulateContract({
          account: walletClient.account,
          address: contractAddress,
          abi,
          functionName,
          args,
          value,
        }),
        { functionName, contractName, isSimulation: true, ...context }
      );

      // Execute the transaction
      const hash = await withContractErrorHandling<`0x${string}`>(
        () => walletClient.writeContract({
          ...request,
          account: walletClient.account,
        }),
        { functionName, contractName, ...context }
      ) as `0x${string}`;

      // Wait for transaction receipt
      const receipt = await withContractErrorHandling(
        () => publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
          timeout: 60_000, // 1 minute timeout
        }),
        { functionName, contractName, txHash: hash, ...context }
      );

      if (receipt.status === 'success') {
        onSuccess?.(hash);
        return hash;
      } else {
        throw createContractError(
          ContractErrorType.TRANSACTION_FAILED,
          'Transaction reverted',
          { functionName, contractName, txHash: hash, receipt, ...context }
        );
      }
    } catch (error: any) {
      const enhancedError = error instanceof ContractError 
        ? error 
        : parseContractError(error, {
            functionName,
            contractName,
            ...context
          });
      
      onError?.(enhancedError);
      
      if (showNotifications) {
        console.error(`[Contract Write Error] ${functionName}:`, enhancedError);
        // TODO: Integrate with notification system
        // toast.error(enhancedError.message);
      }
      
      if (throwErrors) {
        throw enhancedError;
      }
      
      return undefined;
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
    };

    return {
      read: async <R = any>(
        functionName: string,
        args: any[] = [],
        callOptions: ContractCallOptions<R> = {}
      ) => readContract<R>(
        contractName,
        functionName,
        args,
        { ...defaultOptions, ...callOptions }
      ),
      
      write: async (
        functionName: string,
        args: any[] = [],
        value: bigint = BigInt(0),
        callOptions: ContractCallOptions<`0x${string}`> = {}
      ) => writeContract(
        contractName,
        functionName,
        args,
        value,
        { ...defaultOptions, ...callOptions }
      ),
    };
  }, [readContract, writeContract]);

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
