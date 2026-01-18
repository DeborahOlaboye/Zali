import { faker } from '@faker-js/faker';

// Test data factory for generating consistent test data
export class TestDataFactory {
  static generateUsername(): string {
    return faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  static generateWalletAddress(): string {
    return faker.finance.ethereumAddress();
  }

  static generateQuestion(): {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  } {
    const categories = ['Celo', 'DeFi', 'Web3', 'GeneralCrypto', 'NFTs', 'DAOs'];
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

    return {
      question: faker.lorem.sentence() + '?',
      options: [
        faker.lorem.words(3),
        faker.lorem.words(3),
        faker.lorem.words(3),
        faker.lorem.words(3),
      ],
      correctAnswer: faker.number.int({ min: 0, max: 3 }),
      explanation: faker.lorem.sentence(),
      category: faker.helpers.arrayElement(categories),
      difficulty: faker.helpers.arrayElement(difficulties),
    };
  }

  static generateLeaderboardEntry(rank: number = 1): {
    address: string;
    username: string;
    totalScore: number;
    rank: number;
  } {
    return {
      address: this.generateWalletAddress(),
      username: this.generateUsername(),
      totalScore: faker.number.int({ min: 0, max: 10000 }),
      rank,
    };
  }

  static generateLeaderboard(count: number = 10): Array<{
    address: string;
    username: string;
    totalScore: number;
    rank: number;
  }> {
    return Array.from({ length: count }, (_, index) =>
      this.generateLeaderboardEntry(index + 1)
    );
  }

  static generateGameSession(): {
    sessionId: string;
    questions: any[];
    currentQuestion: number;
    score: number;
    timeRemaining: number;
  } {
    return {
      sessionId: faker.string.uuid(),
      questions: Array.from({ length: 5 }, () => this.generateQuestion()),
      currentQuestion: 0,
      score: 0,
      timeRemaining: 30,
    };
  }

  static generateUserProfile(): {
    address: string;
    username: string;
    totalScore: number;
    gamesPlayed: number;
    winRate: number;
    registrationDate: Date;
  } {
    return {
      address: this.generateWalletAddress(),
      username: this.generateUsername(),
      totalScore: faker.number.int({ min: 0, max: 5000 }),
      gamesPlayed: faker.number.int({ min: 0, max: 100 }),
      winRate: faker.number.float({ min: 0, max: 1 }),
      registrationDate: faker.date.recent(),
    };
  }
}