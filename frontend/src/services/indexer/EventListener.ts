/**
 * Event Listener Service
 *
 * Listens to smart contract events in real-time using WebSocket connections
 * and processes them for the indexer system.
 */

import { createPublicClient, webSocket, http, parseAbiItem, type Log } from 'viem';
import { base } from 'viem/chains';
import type {
  ContractEvent,
  QuestionAddedEvent,
  AnswerSubmittedEvent,
  RewardDistributedEvent,
  ScoreUpdatedEvent,
  EventCallback,
  EventSubscription,
  SubscriptionOptions,
  IndexerStatus,
  RawEventLog,
} from '@/types/events';

// Contract configuration
const CONTRACT_ADDRESS = '0x7409Cbcb6577164E96A9b474efD4C32B9e17d59d' as const;

// Event signatures
const EVENT_SIGNATURES = {
  QuestionAdded: 'QuestionAdded(uint256,string,uint256)',
  AnswerSubmitted: 'AnswerSubmitted(address,uint256,bool,uint256)',
} as const;

// ABI items for event parsing
const QUESTION_ADDED_ABI = parseAbiItem(
  'event QuestionAdded(uint256 indexed questionId, string questionText, uint256 reward)'
);
const ANSWER_SUBMITTED_ABI = parseAbiItem(
  'event AnswerSubmitted(address indexed user, uint256 questionId, bool isCorrect, uint256 reward)'
);

export class EventListener {
  private client: ReturnType<typeof createPublicClient> | null = null;
  private subscriptions: Map<string, EventSubscription> = new Map();
  private isRunning: boolean = false;
  private lastProcessedBlock: number = 0;
  private eventsProcessed: number = 0;
  private startedAt: number = 0;
  private lastError: string | undefined;
  private lastErrorAt: number | undefined;
  private unwatchFunctions: Array<() => void> = [];
  private userScores: Map<string, bigint> = new Map();

  constructor(
    private readonly rpcUrl?: string,
    private readonly wsUrl?: string
  ) {}

  /**
   * Initialize the event listener with blockchain connection
   */
  async initialize(): Promise<void> {
    try {
      // Use WebSocket if available for real-time updates, otherwise fall back to HTTP
      const transport = this.wsUrl ? webSocket(this.wsUrl) : http(this.rpcUrl);

      this.client = createPublicClient({
        chain: base,
        transport,
      });

      // Get current block number
      const currentBlock = await this.client.getBlockNumber();
      this.lastProcessedBlock = Number(currentBlock);

      console.log('[EventListener] Initialized at block:', this.lastProcessedBlock);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.lastError = `Failed to initialize: ${errorMessage}`;
      this.lastErrorAt = Date.now();
      throw error;
    }
  }

  /**
   * Start listening for events
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[EventListener] Already running');
      return;
    }

    if (!this.client) {
      await this.initialize();
    }

    this.isRunning = true;
    this.startedAt = Date.now();

    // Watch for QuestionAdded events
    const unwatchQuestionAdded = this.client!.watchEvent({
      address: CONTRACT_ADDRESS,
      event: QUESTION_ADDED_ABI,
      onLogs: (logs) => this.handleQuestionAddedLogs(logs),
      onError: (error) => this.handleError('QuestionAdded', error),
    });
    this.unwatchFunctions.push(unwatchQuestionAdded);

    // Watch for AnswerSubmitted events
    const unwatchAnswerSubmitted = this.client!.watchEvent({
      address: CONTRACT_ADDRESS,
      event: ANSWER_SUBMITTED_ABI,
      onLogs: (logs) => this.handleAnswerSubmittedLogs(logs),
      onError: (error) => this.handleError('AnswerSubmitted', error),
    });
    this.unwatchFunctions.push(unwatchAnswerSubmitted);

    console.log('[EventListener] Started watching for events');
  }

  /**
   * Stop listening for events
   */
  stop(): void {
    this.isRunning = false;
    this.unwatchFunctions.forEach((unwatch) => unwatch());
    this.unwatchFunctions = [];
    console.log('[EventListener] Stopped');
  }

  /**
   * Handle QuestionAdded event logs
   */
  private handleQuestionAddedLogs(logs: Log[]): void {
    for (const log of logs) {
      try {
        const event = this.parseQuestionAddedEvent(log);
        this.notifySubscribers(event);
        this.eventsProcessed++;
        this.updateLastProcessedBlock(Number(log.blockNumber));
      } catch (error) {
        this.handleError('QuestionAdded parsing', error);
      }
    }
  }

  /**
   * Handle AnswerSubmitted event logs
   */
  private handleAnswerSubmittedLogs(logs: Log[]): void {
    for (const log of logs) {
      try {
        const answerEvent = this.parseAnswerSubmittedEvent(log);
        this.notifySubscribers(answerEvent);
        this.eventsProcessed++;

        // Generate derived events
        if (answerEvent.args.isCorrect) {
          // Generate RewardDistributed event if reward > 0
          if (answerEvent.args.reward > 0n) {
            const rewardEvent = this.createRewardDistributedEvent(answerEvent);
            this.notifySubscribers(rewardEvent);
          }

          // Generate ScoreUpdated event
          const scoreEvent = this.createScoreUpdatedEvent(answerEvent);
          this.notifySubscribers(scoreEvent);
        }

        this.updateLastProcessedBlock(Number(log.blockNumber));
      } catch (error) {
        this.handleError('AnswerSubmitted parsing', error);
      }
    }
  }

  /**
   * Parse QuestionAdded event from log
   */
  private parseQuestionAddedEvent(log: Log): QuestionAddedEvent {
    const args = log.args as unknown as {
      questionId: bigint;
      questionText: string;
      reward: bigint;
    };

    return {
      blockNumber: Number(log.blockNumber),
      blockTimestamp: Date.now(), // Will be updated from block data
      transactionHash: log.transactionHash || '',
      logIndex: log.logIndex || 0,
      eventName: 'QuestionAdded',
      args: {
        questionId: args.questionId,
        questionText: args.questionText,
        reward: args.reward,
      },
    };
  }

  /**
   * Parse AnswerSubmitted event from log
   */
  private parseAnswerSubmittedEvent(log: Log): AnswerSubmittedEvent {
    const args = log.args as unknown as {
      user: string;
      questionId: bigint;
      isCorrect: boolean;
      reward: bigint;
    };

    return {
      blockNumber: Number(log.blockNumber),
      blockTimestamp: Date.now(),
      transactionHash: log.transactionHash || '',
      logIndex: log.logIndex || 0,
      eventName: 'AnswerSubmitted',
      args: {
        user: args.user,
        questionId: args.questionId,
        isCorrect: args.isCorrect,
        reward: args.reward,
      },
    };
  }

  /**
   * Create RewardDistributed derived event
   */
  private createRewardDistributedEvent(
    answerEvent: AnswerSubmittedEvent
  ): RewardDistributedEvent {
    return {
      blockNumber: answerEvent.blockNumber,
      blockTimestamp: answerEvent.blockTimestamp,
      transactionHash: answerEvent.transactionHash,
      logIndex: answerEvent.logIndex,
      eventName: 'RewardDistributed',
      args: {
        user: answerEvent.args.user,
        questionId: answerEvent.args.questionId,
        amount: answerEvent.args.reward,
      },
    };
  }

  /**
   * Create ScoreUpdated derived event
   */
  private createScoreUpdatedEvent(answerEvent: AnswerSubmittedEvent): ScoreUpdatedEvent {
    const user = answerEvent.args.user.toLowerCase();
    const previousScore = this.userScores.get(user) || 0n;
    const newScore = previousScore + 1n;
    this.userScores.set(user, newScore);

    return {
      blockNumber: answerEvent.blockNumber,
      blockTimestamp: answerEvent.blockTimestamp,
      transactionHash: answerEvent.transactionHash,
      logIndex: answerEvent.logIndex,
      eventName: 'ScoreUpdated',
      args: {
        user: answerEvent.args.user,
        newScore,
        previousScore,
      },
    };
  }

  /**
   * Subscribe to events
   */
  subscribe(
    callback: EventCallback,
    options: SubscriptionOptions = {}
  ): EventSubscription {
    const id = crypto.randomUUID();
    const subscription: EventSubscription = {
      id,
      options,
      callback,
      unsubscribe: () => this.unsubscribe(id),
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Notify all relevant subscribers of an event
   */
  private notifySubscribers(event: ContractEvent): void {
    for (const subscription of this.subscriptions.values()) {
      if (this.matchesFilter(event, subscription.options)) {
        try {
          subscription.callback(event);
        } catch (error) {
          console.error('[EventListener] Subscriber error:', error);
        }
      }
    }
  }

  /**
   * Check if event matches subscription filter
   */
  private matchesFilter(event: ContractEvent, options: SubscriptionOptions): boolean {
    // Check event type filter
    if (options.eventTypes && !options.eventTypes.includes(event.eventName)) {
      return false;
    }

    // Check user filter
    if (options.user) {
      const eventUser = 'user' in event.args ? event.args.user : undefined;
      if (eventUser && eventUser.toLowerCase() !== options.user.toLowerCase()) {
        return false;
      }
    }

    // Check questionId filter
    if (options.questionId !== undefined) {
      const eventQuestionId = 'questionId' in event.args ? event.args.questionId : undefined;
      if (eventQuestionId !== undefined && eventQuestionId !== options.questionId) {
        return false;
      }
    }

    return true;
  }

  /**
   * Update last processed block
   */
  private updateLastProcessedBlock(blockNumber: number): void {
    if (blockNumber > this.lastProcessedBlock) {
      this.lastProcessedBlock = blockNumber;
    }
  }

  /**
   * Handle errors
   */
  private handleError(context: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this.lastError = `[${context}] ${errorMessage}`;
    this.lastErrorAt = Date.now();
    console.error(`[EventListener] Error in ${context}:`, error);
  }

  /**
   * Get current indexer status
   */
  async getStatus(): Promise<IndexerStatus> {
    let currentBlock = this.lastProcessedBlock;
    if (this.client) {
      try {
        currentBlock = Number(await this.client.getBlockNumber());
      } catch {
        // Use last known block if query fails
      }
    }

    return {
      isRunning: this.isRunning,
      lastProcessedBlock: this.lastProcessedBlock,
      currentBlock,
      eventsProcessed: this.eventsProcessed,
      lastError: this.lastError,
      lastErrorAt: this.lastErrorAt,
      startedAt: this.startedAt,
      uptime: this.isRunning ? Date.now() - this.startedAt : 0,
    };
  }

  /**
   * Fetch historical events from a block range
   */
  async fetchHistoricalEvents(fromBlock: bigint, toBlock: bigint): Promise<ContractEvent[]> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    const events: ContractEvent[] = [];

    // Fetch QuestionAdded events
    const questionAddedLogs = await this.client.getLogs({
      address: CONTRACT_ADDRESS,
      event: QUESTION_ADDED_ABI,
      fromBlock,
      toBlock,
    });

    for (const log of questionAddedLogs) {
      events.push(this.parseQuestionAddedEvent(log));
    }

    // Fetch AnswerSubmitted events
    const answerSubmittedLogs = await this.client.getLogs({
      address: CONTRACT_ADDRESS,
      event: ANSWER_SUBMITTED_ABI,
      fromBlock,
      toBlock,
    });

    for (const log of answerSubmittedLogs) {
      events.push(this.parseAnswerSubmittedEvent(log));
    }

    // Sort by block number and log index
    events.sort((a, b) => {
      if (a.blockNumber !== b.blockNumber) {
        return a.blockNumber - b.blockNumber;
      }
      return a.logIndex - b.logIndex;
    });

    return events;
  }
}

// Singleton instance
let eventListenerInstance: EventListener | null = null;

/**
 * Get or create the event listener instance
 */
export function getEventListener(rpcUrl?: string, wsUrl?: string): EventListener {
  if (!eventListenerInstance) {
    eventListenerInstance = new EventListener(rpcUrl, wsUrl);
  }
  return eventListenerInstance;
}

/**
 * Reset the event listener instance (for testing)
 */
export function resetEventListener(): void {
  if (eventListenerInstance) {
    eventListenerInstance.stop();
    eventListenerInstance = null;
  }
}
