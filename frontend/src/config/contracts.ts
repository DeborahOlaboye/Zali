import TriviaGameV2ABI from './TriviaGameV2ABI.json';

// Contract addresses
export const CONTRACTS = {
  triviaGameV2: {
    address: (process.env.NEXT_PUBLIC_TRIVIA_GAME_V2_ADDRESS || '0x80B56E7ac1841a3b099c13f85c8A092759E2909c') as `0x${string}`,
    abi: TriviaGameV2ABI,
  },
  mockVRF: {
    address: (process.env.NEXT_PUBLIC_MOCK_VRF_ADDRESS || '0x499BABaB30D2820EaF1814ce74cbDd50cb2ecCC9') as `0x${string}`,
  },
  faucet: {
    address: (process.env.NEXT_PUBLIC_FAUCET_ADDRESS || '0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d') as `0x${string}`,
    abi: [
      {
        "inputs": [{"internalType": "address", "name": "_token", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token",
        "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
  },
  cUSD: {
    address: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`,
    abi: [
      {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {"name": "_spender", "type": "address"},
          {"name": "_value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {"name": "_owner", "type": "address"},
          {"name": "_spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
      }
    ],
  },
} as const;

// Game constants
export const GAME_CONSTANTS = {
  QUESTIONS_PER_SESSION: 10,
  TIME_LIMIT: 300, // 5 minutes in seconds
  REWARD_PER_CORRECT: 0.01, // CELO
  PERFECT_SCORE_BONUS: 0.05, // CELO
  MAX_SPEED_BONUS: 0.02, // CELO
  MAX_REWARD_PER_GAME: 0.17, // CELO
  LEADERBOARD_SIZE: 100,
} as const;

// Question categories
export const CATEGORIES = [
  'Basics',
  'Stablecoins',
  'Technology',
  'Mission',
  'Features',
  'Ecosystem',
  'Tokens',
  'Development',
  'Blockchain',
  'Crypto',
  'Security',
  'DeFi',
  'Tools',
  'Governance',
  'Staking',
  'Sustainability',
  'Trading',
  'Best Practices',
  'Compliance',
] as const;

export type Category = typeof CATEGORIES[number];
