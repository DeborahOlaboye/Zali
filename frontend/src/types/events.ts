/**
 * Smart Contract Event Types for Zali Trivia Game
 *
 * This module defines TypeScript types for all contract events
 * that the indexer will listen to and process.
 */

// Base event interface
export interface BaseEvent {
  blockNumber: number;
  blockTimestamp: number;
  transactionHash: string;
  logIndex: number;
  eventName: string;
}

// QuestionAdded event
export interface QuestionAddedEvent extends BaseEvent {
  eventName: 'QuestionAdded';
  args: {
    questionId: bigint;
    questionText: string;
    reward: bigint;
  };
}

// AnswerSubmitted event
export interface AnswerSubmittedEvent extends BaseEvent {
  eventName: 'AnswerSubmitted';
  args: {
    user: string;
    questionId: bigint;
    isCorrect: boolean;
    reward: bigint;
  };
}

// RewardDistributed event (derived from AnswerSubmitted when reward > 0)
export interface RewardDistributedEvent extends BaseEvent {
  eventName: 'RewardDistributed';
  args: {
    user: string;
    questionId: bigint;
    amount: bigint;
  };
}

// ScoreUpdated event (derived from successful answers)
export interface ScoreUpdatedEvent extends BaseEvent {
  eventName: 'ScoreUpdated';
  args: {
    user: string;
    newScore: bigint;
    previousScore: bigint;
  };
}

// Union type for all events
export type ContractEvent =
  | QuestionAddedEvent
  | AnswerSubmittedEvent
  | RewardDistributedEvent
  | ScoreUpdatedEvent;

// Event filter options
export interface EventFilterOptions {
  fromBlock?: number;
  toBlock?: number | 'latest';
  eventTypes?: Array<ContractEvent['eventName']>;
  user?: string;
  questionId?: bigint;
}

// Indexed event data for storage
export interface IndexedEvent {
  id: string;
  event: ContractEvent;
  indexed: boolean;
  processedAt: number;
}

// Event subscription callback
export type EventCallback<T extends ContractEvent = ContractEvent> = (event: T) => void;

// Subscription options
export interface SubscriptionOptions {
  eventTypes?: Array<ContractEvent['eventName']>;
  user?: string;
  questionId?: bigint;
}

// Subscription handle
export interface EventSubscription {
  id: string;
  options: SubscriptionOptions;
  callback: EventCallback;
  unsubscribe: () => void;
}

// Event batch for processing
export interface EventBatch {
  events: ContractEvent[];
  startBlock: number;
  endBlock: number;
  processedAt: number;
}

// Indexer status
export interface IndexerStatus {
  isRunning: boolean;
  lastProcessedBlock: number;
  currentBlock: number;
  eventsProcessed: number;
  lastError?: string;
  lastErrorAt?: number;
  startedAt: number;
  uptime: number;
}

// Event statistics
export interface EventStatistics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsLast24h: number;
  eventsLastHour: number;
  uniqueUsers: number;
  totalRewardsDistributed: bigint;
  questionsAdded: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

// Raw event log from blockchain
export interface RawEventLog {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
}

// Parsed event with metadata
export interface ParsedEvent<T extends ContractEvent = ContractEvent> {
  raw: RawEventLog;
  parsed: T;
  signature: string;
}
