// Contract addresses
// Contract ABIs
export const FAUCET_ABI = [
  'function claim() external',
  'function claimAmount() external view returns (uint256)',
  'function owner() external view returns (address)',
  'function withdraw() external',
] as const;

export const TRIVIA_GAME_ABI = [
  'function createGame(string memory _title, uint256 _entryFee, uint256 _maxPlayers, uint256 _startTime, uint256 _endTime) external',
  'function joinGame(uint256 _gameId) external',
  'function submitAnswers(uint256 _gameId, uint8[] calldata _answers) external',
  'function claimPrize(uint256 _gameId) external',
  'function cancelGame(uint256 _gameId) external',
  'function getGame(uint256 _gameId) external view returns (Game memory)',
  'function getPlayerGames(address _player) external view returns (uint256[] memory)',
  'function getActiveGames() external view returns (uint256[])',
  'function getGamePlayers(uint256 _gameId) external view returns (address[] memory)',
  'function getGameWinners(uint256 _gameId) external view returns (address[] memory)',
  'function getGameState(uint256 _gameId) external view returns (uint8)',
  'function getGamePrizePool(uint256 _gameId) external view returns (uint256)',
  'function hasPlayerPlayed(uint256 _gameId, address _player) external view returns (bool)',
] as const;

export const CUSD_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
] as const;

// Contract addresses
export const CONTRACTS = {
  faucet: {
    address: '0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d' as `0x${string}`,
    abi: FAUCET_ABI,
  },
  triviaGame: {
    address: '0xc4AE01295cfAE3DA96b044F1a4284A93837a644C' as `0x${string}`,
    abi: TRIVIA_GAME_ABI,
  },
  triviaGameV2: {
    address: '0xc4AE01295cfAE3DA96b044F1a4284A93837a644C' as `0x${string}`,
    abi: TRIVIA_GAME_ABI,
  },
  cUSD: {
    address: '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`,
    abi: CUSD_ABI,
  },
} as const;

// Game state enum to match the smart contract
export enum GameState {
  Active,
  InProgress,
  Completed,
  Cancelled
}

// Game type to match the smart contract
export interface Game {
  id: bigint;
  title: string;
  entryFee: bigint;
  prizePool: bigint;
  maxPlayers: number;
  startTime: bigint;
  endTime: bigint;
  state: GameState;
  // These arrays are handled separately in the contract
  // and should be fetched using their respective getter functions
}

// Celo Sepolia network configuration
export const CELO_NETWORK = {
  id: 44787,
  name: 'Celo Sepolia',
  network: 'celo-sepolia',
  nativeCurrency: {
    name: 'Celo',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
    public: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://alfajores.celoscan.io',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
      blockCreated: 5882,
    },
  },
} as const;
