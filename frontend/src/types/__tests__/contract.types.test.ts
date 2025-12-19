import {
  PlayerInfo,
  GameSession,
  LeaderboardEntry,
  RewardInfo,
  ContractBalance,
  AllowanceInfo,
  TransactionResult,
} from '../contract';

describe('Contract Types', () => {
  describe('PlayerInfo', () => {
    it('should create a valid PlayerInfo object', () => {
      const playerInfo: PlayerInfo = {
        username: 'testuser',
        totalScore: 1000n,
        gamesPlayed: 5n,
        correctAnswers: 40n,
        totalQuestions: 50n,
        bestScore: 250n,
        lastGameId: 5n,
        rank: 10n,
      };

      expect(playerInfo.username).toBe('testuser');
      expect(playerInfo.totalScore).toBe(1000n);
      expect(playerInfo.rank).toBe(10n);
    });
  });

  describe('GameSession', () => {
    it('should create a valid GameSession object', () => {
      const session: GameSession = {
        sessionId: 1n,
        playerAddress: '0x1234567890123456789012345678901234567890',
        startTime: 1000000n,
        endTime: 1005000n,
        score: 100n,
        correctAnswers: 8,
        totalQuestions: 10,
        isCompleted: true,
        questionIds: [1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n],
      };

      expect(session.score).toBe(100n);
      expect(session.correctAnswers).toBe(8);
      expect(session.isCompleted).toBe(true);
      expect(session.questionIds.length).toBe(10);
    });
  });

  describe('LeaderboardEntry', () => {
    it('should create a valid LeaderboardEntry object', () => {
      const entry: LeaderboardEntry = {
        address: '0x1234567890123456789012345678901234567890',
        username: 'topplayer',
        totalScore: 5000,
        rank: 1,
        gamesPlayed: 50,
        lastGameTime: 1000000n,
      };

      expect(entry.rank).toBe(1);
      expect(entry.totalScore).toBe(5000);
      expect(entry.username).toBe('topplayer');
    });
  });

  describe('RewardInfo', () => {
    it('should create a valid RewardInfo object', () => {
      const reward: RewardInfo = {
        pendingRewards: 500n,
        totalClaimed: 1000n,
        nextClaimTime: 2000000n,
        rewardRate: 10n,
      };

      expect(reward.pendingRewards).toBe(500n);
      expect(reward.totalClaimed).toBe(1000n);
    });
  });

  describe('ContractBalance', () => {
    it('should create a valid ContractBalance object', () => {
      const balance: ContractBalance = {
        balance: 5000000000000000000n,
        formattedBalance: '5.0',
        contractBalance: 10000000000000000000n,
      };

      expect(balance.formattedBalance).toBe('5.0');
      expect(balance.contractBalance).toEqual(10000000000000000000n);
    });
  });

  describe('TransactionResult', () => {
    it('should create a successful transaction result', () => {
      const result: TransactionResult = {
        hash: '0xabc123',
        from: '0x1234567890123456789012345678901234567890',
        to: '0x0987654321098765432109876543210987654321',
        blockNumber: 12345,
        gasUsed: 100000n,
        status: 'success',
      };

      expect(result.status).toBe('success');
      expect(result.hash).toBe('0xabc123');
    });

    it('should create a failed transaction result', () => {
      const result: TransactionResult = {
        hash: '0xabc123',
        from: '0x1234567890123456789012345678901234567890',
        status: 'failed',
        error: 'Revert: Insufficient balance',
      };

      expect(result.status).toBe('failed');
      expect(result.error).toContain('Insufficient balance');
    });
  });

  describe('AllowanceInfo', () => {
    it('should create an AllowanceInfo object', () => {
      const allowance: AllowanceInfo = {
        allowance: 1000n,
        approved: true,
        requiredAmount: 500n,
      };

      expect(allowance.approved).toBe(true);
      expect(allowance.allowance).toBe(1000n);
      expect(allowance.requiredAmount).toBe(500n);
    });
  });
});
