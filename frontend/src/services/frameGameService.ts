/**
 * Frame Game Service
 * Handles game logic for Farcaster Frames
 */

import { GameState, PlayerFrameData } from '@/types/frame';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS;

export class FrameGameService {
  /**
   * Get a random question for the frame
   */
  async getRandomQuestion(): Promise<GameState> {
    try {
      // In production, fetch from contract or database
      // For now, return a sample question
      const sampleQuestions = [
        {
          questionId: 1,
          questionText: 'What is the native token of the Celo blockchain?',
          options: ['CELO', 'ETH', 'BTC', 'USDC'],
          correctOption: 0,
          reward: '0.1',
        },
        {
          questionId: 2,
          questionText: 'Which network is Zali deployed on?',
          options: ['Ethereum', 'Polygon', 'Base', 'Optimism'],
          correctOption: 2,
          reward: '0.1',
        },
        {
          questionId: 3,
          questionText: 'What is DeFi?',
          options: [
            'Decentralized Finance',
            'Digital Finance',
            'Direct Finance',
            'Distributed Finance',
          ],
          correctOption: 0,
          reward: '0.1',
        },
      ];

      const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
      return {
        ...sampleQuestions[randomIndex],
        answered: false,
      };
    } catch (error) {
      console.error('Error fetching question:', error);
      throw new Error('Failed to fetch question');
    }
  }

  /**
   * Submit answer and check if correct
   */
  async submitAnswer(
    fid: number,
    questionId: number,
    answer: number
  ): Promise<{ isCorrect: boolean; reward?: string }> {
    try {
      // In production, submit to smart contract
      // For now, check against sample data
      const question = await this.getRandomQuestion();

      const isCorrect = answer === question.correctOption;

      // If correct, track for rewards
      if (isCorrect) {
        await this.trackCorrectAnswer(fid, questionId, question.reward);
      }

      return {
        isCorrect,
        reward: isCorrect ? question.reward : undefined,
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw new Error('Failed to submit answer');
    }
  }

  /**
   * Get player data for frame
   */
  async getPlayerData(fid: number): Promise<PlayerFrameData> {
    try {
      // In production, fetch from subgraph or database
      // For now, return sample data
      return {
        fid,
        totalScore: 45,
        correctAnswers: 45,
        totalAnswers: 60,
        totalRewards: '4.5',
        rank: 8,
        currentStreak: 5,
      };
    } catch (error) {
      console.error('Error fetching player data:', error);
      throw new Error('Failed to fetch player data');
    }
  }

  /**
   * Get leaderboard data for frame
   */
  async getLeaderboard(limit: number = 5) {
    try {
      // In production, fetch from subgraph
      // For now, return sample data
      return {
        players: [
          { rank: 1, address: '0x1234...5678', score: 150, rewards: '15.0' },
          { rank: 2, address: '0xabcd...efgh', score: 125, rewards: '12.5' },
          { rank: 3, address: '0x9876...4321', score: 100, rewards: '10.0' },
          { rank: 4, address: '0x5555...6666', score: 85, rewards: '8.5' },
          { rank: 5, address: '0x7777...8888', score: 70, rewards: '7.0' },
        ].slice(0, limit),
        totalPlayers: 250,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }

  /**
   * Track correct answer for analytics
   */
  private async trackCorrectAnswer(
    fid: number,
    questionId: number,
    reward: string
  ) {
    try {
      // In production, store in database and update analytics
      console.log('Correct answer tracked:', { fid, questionId, reward });

      // Example: await database.trackAnswer({ fid, questionId, correct: true, reward });
    } catch (error) {
      console.error('Error tracking answer:', error);
    }
  }

  /**
   * Link Farcaster FID to wallet address
   */
  async linkFidToAddress(fid: number, address: string) {
    try {
      // In production, store mapping in database
      console.log('FID linked to address:', { fid, address });

      // Example: await database.storeFidMapping({ fid, address });
    } catch (error) {
      console.error('Error linking FID:', error);
      throw new Error('Failed to link FID to address');
    }
  }

  /**
   * Get wallet address for FID
   */
  async getAddressForFid(fid: number): Promise<string | null> {
    try {
      // In production, fetch from database
      // For now, return null (not linked)
      return null;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  }
}

// Export singleton instance
export const frameGameService = new FrameGameService();
