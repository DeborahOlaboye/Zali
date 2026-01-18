/**
 * Event Handlers
 *
 * Specialized handlers for each event type that process events
 * and trigger appropriate actions in the system.
 */

import type {
  ContractEvent,
  QuestionAddedEvent,
  AnswerSubmittedEvent,
  RewardDistributedEvent,
  ScoreUpdatedEvent,
} from '@/types/events';

// Handler result type
export interface HandlerResult {
  success: boolean;
  eventId: string;
  eventType: string;
  processedAt: number;
  error?: string;
  data?: Record<string, unknown>;
}

// Handler context with dependencies
export interface HandlerContext {
  storage: EventStorage;
  notifier: EventNotifier;
  analytics: EventAnalytics;
}

// Storage interface for event persistence
export interface EventStorage {
  saveEvent(event: ContractEvent): Promise<void>;
  getEvent(eventId: string): Promise<ContractEvent | null>;
  getEvents(filter: EventFilter): Promise<ContractEvent[]>;
  updatePlayerStats(address: string, updates: PlayerStatsUpdate): Promise<void>;
  updateQuestionStats(questionId: bigint, updates: QuestionStatsUpdate): Promise<void>;
  updateGlobalStats(updates: GlobalStatsUpdate): Promise<void>;
}

// Notifier interface for real-time updates
export interface EventNotifier {
  notifyNewQuestion(event: QuestionAddedEvent): void;
  notifyAnswer(event: AnswerSubmittedEvent): void;
  notifyReward(event: RewardDistributedEvent): void;
  notifyScoreUpdate(event: ScoreUpdatedEvent): void;
  notifyLeaderboardUpdate(topPlayers: LeaderboardEntry[]): void;
}

// Analytics interface for tracking
export interface EventAnalytics {
  trackEvent(eventType: string, data: Record<string, unknown>): void;
  incrementCounter(metric: string, value?: number): void;
  recordTiming(metric: string, durationMs: number): void;
}

// Event filter for queries
export interface EventFilter {
  eventTypes?: string[];
  fromBlock?: number;
  toBlock?: number;
  user?: string;
  questionId?: bigint;
  limit?: number;
  offset?: number;
}

// Stats update types
export interface PlayerStatsUpdate {
  correctAnswers?: number;
  totalAnswers?: number;
  totalRewards?: bigint;
  lastPlayedAt?: number;
}

export interface QuestionStatsUpdate {
  totalAnswers?: number;
  correctAnswers?: number;
  totalRewardsDistributed?: bigint;
}

export interface GlobalStatsUpdate {
  totalQuestions?: number;
  totalAnswers?: number;
  totalRewardsDistributed?: bigint;
  uniquePlayers?: number;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  address: string;
  score: bigint;
  correctAnswers: number;
  totalRewards: bigint;
}

/**
 * Base event handler class
 */
abstract class BaseEventHandler<T extends ContractEvent> {
  constructor(protected context: HandlerContext) {}

  /**
   * Process an event
   */
  abstract handle(event: T): Promise<HandlerResult>;

  /**
   * Generate unique event ID
   */
  protected generateEventId(event: ContractEvent): string {
    return `${event.transactionHash}-${event.logIndex}`;
  }

  /**
   * Create success result
   */
  protected success(event: ContractEvent, data?: Record<string, unknown>): HandlerResult {
    return {
      success: true,
      eventId: this.generateEventId(event),
      eventType: event.eventName,
      processedAt: Date.now(),
      data,
    };
  }

  /**
   * Create error result
   */
  protected error(event: ContractEvent, error: string): HandlerResult {
    return {
      success: false,
      eventId: this.generateEventId(event),
      eventType: event.eventName,
      processedAt: Date.now(),
      error,
    };
  }
}

/**
 * Handler for QuestionAdded events
 */
export class QuestionAddedHandler extends BaseEventHandler<QuestionAddedEvent> {
  async handle(event: QuestionAddedEvent): Promise<HandlerResult> {
    try {
      // Save the event
      await this.context.storage.saveEvent(event);

      // Update global stats
      await this.context.storage.updateGlobalStats({
        totalQuestions: 1,
      });

      // Notify subscribers
      this.context.notifier.notifyNewQuestion(event);

      // Track analytics
      this.context.analytics.trackEvent('question_added', {
        questionId: event.args.questionId.toString(),
        reward: event.args.reward.toString(),
        blockNumber: event.blockNumber,
      });

      this.context.analytics.incrementCounter('questions_added');

      return this.success(event, {
        questionId: event.args.questionId.toString(),
        questionText: event.args.questionText,
        reward: event.args.reward.toString(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return this.error(event, errorMessage);
    }
  }
}

/**
 * Handler for AnswerSubmitted events
 */
export class AnswerSubmittedHandler extends BaseEventHandler<AnswerSubmittedEvent> {
  async handle(event: AnswerSubmittedEvent): Promise<HandlerResult> {
    try {
      // Save the event
      await this.context.storage.saveEvent(event);

      // Update player stats
      const playerUpdate: PlayerStatsUpdate = {
        totalAnswers: 1,
        lastPlayedAt: event.blockTimestamp,
      };

      if (event.args.isCorrect) {
        playerUpdate.correctAnswers = 1;
        if (event.args.reward > 0n) {
          playerUpdate.totalRewards = event.args.reward;
        }
      }

      await this.context.storage.updatePlayerStats(event.args.user, playerUpdate);

      // Update question stats
      const questionUpdate: QuestionStatsUpdate = {
        totalAnswers: 1,
      };

      if (event.args.isCorrect) {
        questionUpdate.correctAnswers = 1;
        if (event.args.reward > 0n) {
          questionUpdate.totalRewardsDistributed = event.args.reward;
        }
      }

      await this.context.storage.updateQuestionStats(event.args.questionId, questionUpdate);

      // Update global stats
      const globalUpdate: GlobalStatsUpdate = {
        totalAnswers: 1,
      };

      if (event.args.isCorrect && event.args.reward > 0n) {
        globalUpdate.totalRewardsDistributed = event.args.reward;
      }

      await this.context.storage.updateGlobalStats(globalUpdate);

      // Notify subscribers
      this.context.notifier.notifyAnswer(event);

      // Track analytics
      this.context.analytics.trackEvent('answer_submitted', {
        user: event.args.user,
        questionId: event.args.questionId.toString(),
        isCorrect: event.args.isCorrect,
        reward: event.args.reward.toString(),
        blockNumber: event.blockNumber,
      });

      this.context.analytics.incrementCounter('answers_submitted');
      if (event.args.isCorrect) {
        this.context.analytics.incrementCounter('correct_answers');
      }

      return this.success(event, {
        user: event.args.user,
        questionId: event.args.questionId.toString(),
        isCorrect: event.args.isCorrect,
        reward: event.args.reward.toString(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return this.error(event, errorMessage);
    }
  }
}

/**
 * Handler for RewardDistributed events
 */
export class RewardDistributedHandler extends BaseEventHandler<RewardDistributedEvent> {
  async handle(event: RewardDistributedEvent): Promise<HandlerResult> {
    try {
      // Save the event
      await this.context.storage.saveEvent(event);

      // Notify subscribers
      this.context.notifier.notifyReward(event);

      // Track analytics
      this.context.analytics.trackEvent('reward_distributed', {
        user: event.args.user,
        questionId: event.args.questionId.toString(),
        amount: event.args.amount.toString(),
        blockNumber: event.blockNumber,
      });

      this.context.analytics.incrementCounter('rewards_distributed');

      return this.success(event, {
        user: event.args.user,
        questionId: event.args.questionId.toString(),
        amount: event.args.amount.toString(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return this.error(event, errorMessage);
    }
  }
}

/**
 * Handler for ScoreUpdated events
 */
export class ScoreUpdatedHandler extends BaseEventHandler<ScoreUpdatedEvent> {
  async handle(event: ScoreUpdatedEvent): Promise<HandlerResult> {
    try {
      // Save the event
      await this.context.storage.saveEvent(event);

      // Notify subscribers
      this.context.notifier.notifyScoreUpdate(event);

      // Track analytics
      this.context.analytics.trackEvent('score_updated', {
        user: event.args.user,
        newScore: event.args.newScore.toString(),
        previousScore: event.args.previousScore.toString(),
        blockNumber: event.blockNumber,
      });

      return this.success(event, {
        user: event.args.user,
        newScore: event.args.newScore.toString(),
        previousScore: event.args.previousScore.toString(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return this.error(event, errorMessage);
    }
  }
}

/**
 * Event handler registry and dispatcher
 */
export class EventHandlerDispatcher {
  private handlers: Map<string, BaseEventHandler<ContractEvent>> = new Map();

  constructor(context: HandlerContext) {
    // Register all handlers
    this.handlers.set('QuestionAdded', new QuestionAddedHandler(context) as BaseEventHandler<ContractEvent>);
    this.handlers.set('AnswerSubmitted', new AnswerSubmittedHandler(context) as BaseEventHandler<ContractEvent>);
    this.handlers.set('RewardDistributed', new RewardDistributedHandler(context) as BaseEventHandler<ContractEvent>);
    this.handlers.set('ScoreUpdated', new ScoreUpdatedHandler(context) as BaseEventHandler<ContractEvent>);
  }

  /**
   * Dispatch an event to its handler
   */
  async dispatch(event: ContractEvent): Promise<HandlerResult> {
    const handler = this.handlers.get(event.eventName);

    if (!handler) {
      return {
        success: false,
        eventId: `${event.transactionHash}-${event.logIndex}`,
        eventType: event.eventName,
        processedAt: Date.now(),
        error: `No handler registered for event type: ${event.eventName}`,
      };
    }

    return handler.handle(event);
  }

  /**
   * Dispatch multiple events in order
   */
  async dispatchBatch(events: ContractEvent[]): Promise<HandlerResult[]> {
    const results: HandlerResult[] = [];

    for (const event of events) {
      const result = await this.dispatch(event);
      results.push(result);
    }

    return results;
  }
}
