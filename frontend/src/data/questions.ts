/**
 * Trivia Questions Database
 * Educational questions about Celo blockchain and DeFi concepts
 */

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const questions: Question[] = [
  {
    id: 1,
    question: "What is Celo's native stablecoin pegged to the US Dollar?",
    options: ["cUSD", "USDC", "DAI", "USDT"],
    correctAnswer: 0,
    explanation: "cUSD (Celo Dollar) is Celo's native stablecoin pegged to the US Dollar, enabling stable-value transactions on the network.",
    category: "Celo Basics",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "What makes Celo unique among Layer 1 blockchains?",
    options: [
      "Proof of Work consensus",
      "No smart contract support",
      "Mobile-first design with phone number addresses",
      "NFT marketplace focus"
    ],
    correctAnswer: 2,
    explanation: "Celo is designed mobile-first, allowing users to send crypto using phone numbers instead of complex wallet addresses. This makes it accessible to billions of mobile users worldwide.",
    category: "Celo Basics",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "What is MiniPay?",
    options: [
      "A Celo mining tool",
      "A stablecoin wallet with built-in dApp discovery",
      "A gas fee reduction mechanism",
      "A smart contract language"
    ],
    correctAnswer: 1,
    explanation: "MiniPay is a lightweight stablecoin wallet integrated into Opera Mini with a built-in discovery page for dApps, making crypto accessible to millions of users.",
    category: "Celo Ecosystem",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "What can you use to pay gas fees on Celo?",
    options: [
      "Only CELO tokens",
      "Only ETH",
      "Stablecoins like cUSD",
      "Bitcoin"
    ],
    correctAnswer: 2,
    explanation: "Celo allows users to pay gas fees in stablecoins like cUSD, making transactions more predictable and user-friendly compared to volatile native tokens.",
    category: "DeFi Concepts",
    difficulty: "medium"
  },
  {
    id: 5,
    question: "What should you NEVER share with anyone?",
    options: [
      "Your wallet address",
      "Your private key/seed phrase",
      "Transaction hashes",
      "Your cUSD balance"
    ],
    correctAnswer: 1,
    explanation: "Your private key or seed phrase gives complete access to your wallet. Never share it with anyone - legitimate services will NEVER ask for it.",
    category: "Blockchain Security",
    difficulty: "easy"
  },
  {
    id: 6,
    question: "What consensus mechanism does Celo use?",
    options: ["Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"],
    correctAnswer: 1,
    explanation: "Celo uses Proof of Stake consensus, making it more energy-efficient than Proof of Work blockchains.",
    category: "Celo Basics",
    difficulty: "medium"
  },
  {
    id: 7,
    question: "What is the purpose of CELO tokens?",
    options: ["Only for payments", "Governance and staking", "Mining rewards", "NFT creation"],
    correctAnswer: 1,
    explanation: "CELO tokens are used for governance voting and staking to secure the network.",
    category: "Celo Basics",
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Which mobile wallet is optimized for Celo?",
    options: ["MetaMask", "Trust Wallet", "MiniPay", "Coinbase Wallet"],
    correctAnswer: 2,
    explanation: "MiniPay is specifically designed for Celo and integrated into Opera Mini browser.",
    category: "Celo Ecosystem",
    difficulty: "easy"
  },
  {
    id: 9,
    question: "What is a key benefit of using stablecoins for gas fees?",
    options: ["Higher transaction speed", "Predictable costs", "Lower security", "More complexity"],
    correctAnswer: 1,
    explanation: "Using stablecoins for gas fees provides predictable transaction costs, unlike volatile cryptocurrencies.",
    category: "DeFi Concepts",
    difficulty: "easy"
  },
  {
    id: 10,
    question: "What should you do before connecting to a new dApp?",
    options: ["Share your private key", "Verify the URL and reputation", "Send test funds first", "Download random software"],
    correctAnswer: 1,
    explanation: "Always verify the URL and check the dApp's reputation before connecting your wallet to avoid scams.",
    category: "Blockchain Security",
    difficulty: "easy"
  }
];

/**
 * Get a random set of questions
 * @param count Number of questions to return
 * @returns Array of random questions
 */
export function getRandomQuestions(count: number = 10): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
}

// Keep backward compatibility
export const SAMPLE_QUESTIONS = questions;

/**
 * Calculate score based on answers
 * @param answers Array of user's answer indices
 * @param questions Array of questions
 * @returns Score object with correct count and percentage
 */
export function calculateScore(
  answers: number[],
  questions: Question[]
): { correct: number; total: number; percentage: number } {
  let correct = 0;
  
  answers.forEach((answer, index) => {
    if (questions[index] && answer === questions[index].correctAnswer) {
      correct++;
    }
  });
  
  const total = questions.length;
  const percentage = Math.round((correct / total) * 100);
  
  return { correct, total, percentage };
}
