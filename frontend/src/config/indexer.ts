/**
 * Event Indexer Configuration
 *
 * Centralized configuration for the smart contract event indexer.
 */

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Contract Configuration
 */
export const CONTRACT_CONFIG = {
  // SimpleTriviaGame contract address on Base Mainnet
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d',

  // Chain ID for Base Mainnet
  chainId: 8453,

  // Block number when contract was deployed (for historical sync)
  deployedBlock: parseInt(process.env.NEXT_PUBLIC_DEPLOYED_BLOCK || '0', 10),

  // USDC token address on Base
  usdcAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',

  // USDC decimals
  usdcDecimals: 6,
} as const;

/**
 * RPC Configuration
 */
export const RPC_CONFIG = {
  // HTTP RPC URL for Base Mainnet
  httpUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://mainnet.base.org',

  // WebSocket RPC URL for real-time updates
  wsUrl: process.env.NEXT_PUBLIC_WS_RPC_URL || 'wss://base-mainnet.g.alchemy.com/v2/demo',

  // Fallback RPC URLs
  fallbackUrls: [
    'https://base.llamarpc.com',
    'https://1rpc.io/base',
    'https://base.publicnode.com',
  ],

  // Request timeout in milliseconds
  timeout: 30000,

  // Max retry attempts for RPC calls
  maxRetries: 3,
} as const;

/**
 * Indexer Configuration
 */
export const INDEXER_CONFIG = {
  // Number of blocks to process per batch during historical sync
  batchSize: 1000,

  // Polling interval for new blocks (in milliseconds)
  pollingInterval: isDevelopment ? 5000 : 2000,

  // Number of confirmations before considering event final
  confirmations: 1,

  // Enable/disable historical sync on startup
  enableHistoricalSync: isProduction,

  // Maximum events to keep in memory
  maxEventsInMemory: 10000,

  // Event retention period in days
  eventRetentionDays: 30,
} as const;

/**
 * Storage Configuration
 */
export const STORAGE_CONFIG = {
  // IndexedDB database name
  databaseName: 'ZaliEventsIndexer',

  // Database version
  databaseVersion: 1,

  // Enable IndexedDB persistence
  enablePersistence: true,

  // Maximum events to store in IndexedDB
  maxStoredEvents: 50000,

  // Cache TTL in milliseconds
  cacheTTL: 60000,
} as const;

/**
 * SSE (Server-Sent Events) Configuration
 */
export const SSE_CONFIG = {
  // Heartbeat interval in milliseconds
  heartbeatInterval: 30000,

  // Connection timeout in milliseconds
  connectionTimeout: 60000,

  // Max reconnect attempts
  maxReconnectAttempts: 10,

  // Initial reconnect delay in milliseconds
  initialReconnectDelay: 1000,

  // Max reconnect delay in milliseconds
  maxReconnectDelay: 30000,
} as const;

/**
 * Notification Configuration
 */
export const NOTIFICATION_CONFIG = {
  // Enable toast notifications
  enableToast: true,

  // Enable browser notifications
  enableBrowser: false,

  // Enable sound notifications
  enableSound: false,

  // Sound volume (0-1)
  soundVolume: 0.5,

  // Toast duration in milliseconds
  toastDuration: 5000,

  // Max notifications to keep in history
  maxNotifications: 100,
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  // Base URL for API endpoints
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',

  // Default pagination limit
  defaultLimit: 100,

  // Maximum pagination limit
  maxLimit: 1000,

  // API request timeout
  timeout: 10000,

  // Enable request caching
  enableCache: true,

  // Cache duration in milliseconds
  cacheDuration: 30000,
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  // Enable real-time event streaming
  enableRealTimeUpdates: true,

  // Enable historical event sync
  enableHistoricalSync: true,

  // Enable notifications
  enableNotifications: true,

  // Enable analytics dashboard
  enableAnalytics: true,

  // Enable debug logging
  enableDebugLogging: isDevelopment,

  // Enable performance monitoring
  enablePerformanceMonitoring: isProduction,
} as const;

/**
 * Event Types Configuration
 */
export const EVENT_TYPES = {
  QuestionAdded: {
    name: 'QuestionAdded',
    signature: 'QuestionAdded(uint256,string,uint256)',
    description: 'Emitted when a new question is added to the game',
  },
  AnswerSubmitted: {
    name: 'AnswerSubmitted',
    signature: 'AnswerSubmitted(address,uint256,bool,uint256)',
    description: 'Emitted when a player submits an answer',
  },
  RewardDistributed: {
    name: 'RewardDistributed',
    signature: 'derived',
    description: 'Derived event when rewards are distributed',
  },
  ScoreUpdated: {
    name: 'ScoreUpdated',
    signature: 'derived',
    description: 'Derived event when player score changes',
  },
} as const;

/**
 * Get full configuration object
 */
export function getConfig() {
  return {
    contract: CONTRACT_CONFIG,
    rpc: RPC_CONFIG,
    indexer: INDEXER_CONFIG,
    storage: STORAGE_CONFIG,
    sse: SSE_CONFIG,
    notification: NOTIFICATION_CONFIG,
    api: API_CONFIG,
    features: FEATURE_FLAGS,
    events: EVENT_TYPES,
  };
}

/**
 * Validate configuration on startup
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate contract address
  if (!CONTRACT_CONFIG.address || !/^0x[a-fA-F0-9]{40}$/.test(CONTRACT_CONFIG.address)) {
    errors.push('Invalid contract address');
  }

  // Validate RPC URL
  if (!RPC_CONFIG.httpUrl) {
    errors.push('Missing RPC URL');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default getConfig;
