// Contract addresses
// Contract ABIs
export const FAUCET_ABI = [
  'function claim() external',
  'function claimAmount() external view returns (uint256)',
  'function owner() external view returns (address)',
  'function withdraw() external',
] as const;

export const TRIVIA_GAME_V2_ABI = [
  // Player Registration
  'function registerUsername(string memory _username) external',
  'function updateUsername(string memory _newUsername) external payable',
  'function isUsernameAvailable(string memory _username) external view returns (bool)',

  // Game Functions
  'function startGame() external returns (uint256 sessionId)',
  'function submitAnswers(uint256 _sessionId, uint8[] calldata _answers) external',
  'function claimRewards() external',
  'function claimSessionRewards(uint256[] calldata _sessionIds) external',

  // View Functions
  'function getPlayerInfo(address _player) external view returns (string memory username, uint256 totalScore, uint256 gamesPlayed, uint256 correctAnswers, uint256 totalQuestions, uint256 bestScore, uint256 rank)',
  'function getLeaderboard(uint256 _count) external view returns (address[] memory addresses, string[] memory usernames, uint256[] memory scores)',
  'function getSession(address _player, uint256 _sessionId) external view returns (uint256[] memory questionIds, uint8[] memory answers, uint8 correctCount, uint256 score, uint256 reward, uint256 startTime, uint256 endTime, bool completed, bool rewardClaimed)',
  'function getQuestion(uint256 _questionId) external view returns (string memory questionText, string[4] memory options, string memory category)',
  'function getPendingRewards(address _player) external view returns (uint256)',
  'function getUnclaimedSessions(address _player) external view returns (uint256[] memory)',

  // Question Management (Owner)
  'function addQuestion(string memory _questionText, string[4] memory _options, uint8 _correctAnswer, string memory _category) external',
  'function addQuestions(string[] memory _questionTexts, string[4][] memory _options, uint8[] memory _correctAnswers, string[] memory _categories) external',
  'function updateQuestion(uint256 _questionId, string memory _questionText, string[4] memory _options, uint8 _correctAnswer, string memory _category, bool _isActive) external',

  // Admin Functions
  'function fundRewards() external payable',
  'function distributeRewards() external',
  'function emergencyWithdraw(uint256 _amount) external',

  // Constants and State
  'function QUESTIONS_PER_SESSION() external view returns (uint256)',
  'function TIME_LIMIT() external view returns (uint256)',
  'function LEADERBOARD_SIZE() external view returns (uint256)',
  'function questions(uint256) external view returns (string memory questionText, string[4] memory options, uint8 correctAnswer, string memory category, bool isActive)',
  'function players(address) external view returns (string memory username, uint256 totalScore, uint256 gamesPlayed, uint256 correctAnswers, uint256 totalQuestions, uint256 bestScore, bool isRegistered)',
  'function leaderboard(uint256) external view returns (address)',
  'function weeklyRewardPool() external view returns (uint256)',
  'function getContractBalance() external view returns (uint256)',
  'function getQuestionCount() external view returns (uint256)',
  'function getPlayerSessionCount(address _player) external view returns (uint256)',

  // Events
  'event PlayerRegistered(address indexed player, string username)',
  'event UsernameUpdated(address indexed player, string oldUsername, string newUsername)',
  'event GameStarted(address indexed player, uint256 sessionId, uint256 requestId)',
  'event QuestionsAssigned(address indexed player, uint256 sessionId, uint256[] questionIds)',
  'event GameCompleted(address indexed player, uint256 sessionId, uint256 score, uint8 correctCount, uint256 reward)',
  'event RewardClaimed(address indexed player, uint256 amount)',
  'event LeaderboardUpdated(address indexed player, uint256 newRank, uint256 totalScore)',
  'event WeeklyRewardsDistributed(uint256 totalAmount, uint256 timestamp)',
  'event QuestionAdded(uint256 indexed questionId, string category)',
] as const;

export const USDC_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
] as const;

// Contract addresses - To be deployed on Base
export const CONTRACTS = {
  faucet: {
    address: '0x707ECcbbFa9073F1e5A5675F22473956FE36FC8d' as `0x${string}`, // Update after Base deployment
    abi: FAUCET_ABI,
  },
  triviaGame: {
    address: '0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d' as `0x${string}`, // SimpleTriviaGame (current)
    abi: TRIVIA_GAME_ABI,
  },
  triviaGameV2: {
    address: '0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d' as `0x${string}`, // Update after TriviaGameV2 deployment
    abi: TRIVIA_GAME_V2_ABI,
  },
  USDC: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, // Base Sepolia USDC
    abi: USDC_ABI,
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

// Base Sepolia network configuration
export const BASE_NETWORK = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11' as `0x${string}`,
      blockCreated: 1059647,
    },
  },
} as const;
