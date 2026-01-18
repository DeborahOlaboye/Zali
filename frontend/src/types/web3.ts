import { Address, Hash, TransactionReceipt } from 'viem';

// Wallet connection types
export interface WalletState {
  readonly address: Address | undefined;
  readonly isConnected: boolean;
  readonly isConnecting: boolean;
  readonly isReconnecting: boolean;
  readonly chain: Chain | undefined;
  readonly connector: Connector | undefined;
}

export interface Chain {
  readonly id: number;
  readonly name: string;
  readonly network: string;
  readonly nativeCurrency: {
    readonly name: string;
    readonly symbol: string;
    readonly decimals: number;
  };
  readonly rpcUrls: {
    readonly default: {
      readonly http: readonly string[];
    };
  };
  readonly blockExplorers: {
    readonly default: {
      readonly name: string;
      readonly url: string;
    };
  };
}

export interface Connector {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly icon?: string;
}

// Contract interaction types
export interface ContractConfig {
  readonly address: Address;
  readonly abi: readonly unknown[];
  readonly chainId: number;
}

export interface ContractCall<TArgs extends readonly unknown[] = readonly unknown[]> {
  readonly functionName: string;
  readonly args?: TArgs;
  readonly value?: bigint;
  readonly gas?: bigint;
}

export interface ContractReadResult<TData = unknown> {
  readonly data: TData | undefined;
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly refetch: () => Promise<TData>;
}

export interface ContractWriteResult {
  readonly data: Hash | undefined;
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly write: () => Promise<Hash>;
  readonly writeAsync: () => Promise<Hash>;
}

// Transaction types
export interface TransactionState {
  readonly hash: Hash | undefined;
  readonly receipt: TransactionReceipt | undefined;
  readonly isLoading: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
}

export interface TransactionConfig {
  readonly to: Address;
  readonly value?: bigint;
  readonly data?: `0x${string}`;
  readonly gas?: bigint;
  readonly gasPrice?: bigint;
  readonly maxFeePerGas?: bigint;
  readonly maxPriorityFeePerGas?: bigint;
}

// Token types
export interface TokenInfo {
  readonly address: Address;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly logoURI?: string;
}

export interface TokenBalance {
  readonly token: TokenInfo;
  readonly balance: bigint;
  readonly formatted: string;
  readonly usdValue?: number;
}

export interface TokenTransfer {
  readonly from: Address;
  readonly to: Address;
  readonly amount: bigint;
  readonly token: TokenInfo;
  readonly hash: Hash;
  readonly blockNumber: bigint;
  readonly timestamp: number;
}

// Game contract types
export interface GameSession {
  readonly sessionId: bigint;
  readonly player: Address;
  readonly questionIds: readonly bigint[];
  readonly answers: readonly number[];
  readonly score: number;
  readonly reward: bigint;
  readonly timestamp: bigint;
  readonly isCompleted: boolean;
}

export interface Question {
  readonly id: bigint;
  readonly question: string;
  readonly options: readonly string[];
  readonly correctAnswer: number;
  readonly category: string;
  readonly difficulty: 'easy' | 'medium' | 'hard';
  readonly isActive: boolean;
}

export interface PlayerInfo {
  readonly address: Address;
  readonly username: string;
  readonly totalScore: bigint;
  readonly gamesPlayed: bigint;
  readonly totalRewards: bigint;
  readonly registrationTime: bigint;
  readonly isRegistered: boolean;
}

export interface LeaderboardEntry {
  readonly rank: number;
  readonly player: PlayerInfo;
  readonly weeklyScore: bigint;
  readonly monthlyScore: bigint;
}

// Contract event types
export interface GameStartedEvent {
  readonly player: Address;
  readonly sessionId: bigint;
  readonly requestId: bigint;
}

export interface GameCompletedEvent {
  readonly player: Address;
  readonly sessionId: bigint;
  readonly score: number;
  readonly correctCount: number;
  readonly reward: bigint;
}

export interface PlayerRegisteredEvent {
  readonly player: Address;
  readonly username: string;
}

export interface RewardClaimedEvent {
  readonly player: Address;
  readonly amount: bigint;
}

// Hook return types
export interface UseContractReadHook<TData = unknown> {
  readonly data: TData | undefined;
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isSuccess: boolean;
  readonly refetch: () => Promise<void>;
}

export interface UseContractWriteHook {
  readonly data: Hash | undefined;
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isSuccess: boolean;
  readonly write: (() => void) | undefined;
  readonly writeAsync: (() => Promise<Hash>) | undefined;
}

export interface UseBalanceHook {
  readonly data: {
    readonly decimals: number;
    readonly formatted: string;
    readonly symbol: string;
    readonly value: bigint;
  } | undefined;
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isSuccess: boolean;
  readonly refetch: () => Promise<void>;
}

// Error types
export interface ContractError extends Error {
  readonly code: number;
  readonly data?: unknown;
  readonly reason?: string;
}

export interface TransactionError extends Error {
  readonly code: number;
  readonly hash?: Hash;
  readonly receipt?: TransactionReceipt;
}

export interface WalletError extends Error {
  readonly code: number;
  readonly connector?: Connector;
}

// Utility types
export type ContractFunction<TArgs extends readonly unknown[] = readonly unknown[], TReturn = unknown> = 
  (...args: TArgs) => Promise<TReturn>;

export type EventFilter<TEvent = unknown> = {
  readonly address?: Address | readonly Address[];
  readonly topics?: readonly (Hash | readonly Hash[] | null)[];
  readonly fromBlock?: bigint | 'latest' | 'earliest' | 'pending';
  readonly toBlock?: bigint | 'latest' | 'earliest' | 'pending';
};

export type ContractEventLog<TEvent = unknown> = {
  readonly address: Address;
  readonly topics: readonly Hash[];
  readonly data: `0x${string}`;
  readonly blockNumber: bigint;
  readonly transactionHash: Hash;
  readonly transactionIndex: number;
  readonly blockHash: Hash;
  readonly logIndex: number;
  readonly removed: boolean;
  readonly args: TEvent;
};

// Configuration types
export interface Web3Config {
  readonly chains: readonly Chain[];
  readonly connectors: readonly Connector[];
  readonly publicClient: unknown;
  readonly walletClient: unknown;
}

export interface ContractAddresses {
  readonly [chainId: number]: {
    readonly triviaGame: Address;
    readonly faucet?: Address;
    readonly usdc?: Address;
  };
}

// Type guards
export const isAddress = (value: unknown): value is Address => {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
};

export const isHash = (value: unknown): value is Hash => {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{64}$/.test(value);
};

export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === 'bigint';
};

// Branded types for additional type safety
export type UserId = string & { readonly __brand: 'UserId' };
export type SessionId = bigint & { readonly __brand: 'SessionId' };
export type QuestionId = bigint & { readonly __brand: 'QuestionId' };
export type Score = number & { readonly __brand: 'Score' };

// Factory functions for branded types
export const createUserId = (id: string): UserId => id as UserId;
export const createSessionId = (id: bigint): SessionId => id as SessionId;
export const createQuestionId = (id: bigint): QuestionId => id as QuestionId;
export const createScore = (score: number): Score => score as Score;