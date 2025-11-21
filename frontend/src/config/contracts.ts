// Contract ABIs
const TRIVIA_GAME_ABI = [
  {
    "type": "function",
    "name": "joinGame",
    "inputs": [{"name": "gameId", "type": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getGameState",
    "inputs": [{"name": "gameId", "type": "uint256"}],
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getGamePrizePool",
    "inputs": [{"name": "gameId", "type": "uint256"}],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayers",
    "inputs": [{"name": "gameId", "type": "uint256"}],
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "games",
    "inputs": [{"name": "", "type": "uint256"}],
    "outputs": [
      {"name": "id", "type": "uint256"},
      {"name": "title", "type": "string"},
      {"name": "entryFee", "type": "uint256"},
      {"name": "prizePool", "type": "uint256"},
      {"name": "maxPlayers", "type": "uint256"},
      {"name": "startTime", "type": "uint256"},
      {"name": "endTime", "type": "uint256"},
      {"name": "state", "type": "uint8"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "PlayerJoined",
    "inputs": [
      {"name": "gameId", "type": "uint256", "indexed": true},
      {"name": "player", "type": "address", "indexed": false}
    ]
  }
] as const;

const FAUCET_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
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
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
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
];

// Contract addresses
export const CONTRACTS = {
  triviaGame: {
    address: (process.env.NEXT_PUBLIC_TRIVIA_GAME_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    abi: TRIVIA_GAME_ABI,
  },
  faucet: {
    address: '0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d' as `0x${string}`,
    abi: FAUCET_ABI,
  },
  cUSD: {
    address: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`,
    abi: [], // Add cUSD ABI if needed
  },
} as const;

// Game state enum
export enum GameState {
  Open = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}
