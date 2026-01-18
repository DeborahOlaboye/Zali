/**
 * Event Storage Layer
 *
 * Provides in-memory storage with IndexedDB persistence for event data.
 * Implements data models for players, questions, and global statistics.
 */

import type {
  ContractEvent,
  QuestionAddedEvent,
  AnswerSubmittedEvent,
  EventStatistics,
  EventFilterOptions,
} from '@/types/events';
import type {
  EventStorage as IEventStorage,
  PlayerStatsUpdate,
  QuestionStatsUpdate,
  GlobalStatsUpdate,
  EventFilter,
  LeaderboardEntry,
} from './EventHandlers';

// Player data model
export interface PlayerData {
  address: string;
  score: bigint;
  correctAnswers: number;
  totalAnswers: number;
  totalRewards: bigint;
  firstPlayedAt: number;
  lastPlayedAt: number;
}

// Question data model
export interface QuestionData {
  questionId: bigint;
  questionText: string;
  reward: bigint;
  totalAnswers: number;
  correctAnswers: number;
  totalRewardsDistributed: bigint;
  addedAt: number;
  blockNumber: number;
}

// Global stats data model
export interface GlobalStatsData {
  totalQuestions: number;
  totalAnswers: number;
  totalCorrectAnswers: number;
  totalRewardsDistributed: bigint;
  uniquePlayers: number;
  lastUpdatedAt: number;
}

// IndexedDB database name and stores
const DB_NAME = 'ZaliEventsIndexer';
const DB_VERSION = 1;

const STORES = {
  EVENTS: 'events',
  PLAYERS: 'players',
  QUESTIONS: 'questions',
  GLOBAL_STATS: 'globalStats',
} as const;

/**
 * Event Storage implementation
 */
export class EventStorageImpl implements IEventStorage {
  private db: IDBDatabase | null = null;
  private isInitialized: boolean = false;

  // In-memory caches for fast access
  private eventsCache: Map<string, ContractEvent> = new Map();
  private playersCache: Map<string, PlayerData> = new Map();
  private questionsCache: Map<string, QuestionData> = new Map();
  private globalStats: GlobalStatsData = {
    totalQuestions: 0,
    totalAnswers: 0,
    totalCorrectAnswers: 0,
    totalRewardsDistributed: 0n,
    uniquePlayers: 0,
    lastUpdatedAt: Date.now(),
  };

  /**
   * Initialize the storage layer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Check if IndexedDB is available
    if (typeof indexedDB === 'undefined') {
      console.log('[EventStorage] IndexedDB not available, using memory only');
      this.isInitialized = true;
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('[EventStorage] Failed to open database:', request.error);
        // Fall back to memory-only mode
        this.isInitialized = true;
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        this.loadFromDatabase().then(resolve).catch(reject);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains(STORES.EVENTS)) {
          const eventsStore = db.createObjectStore(STORES.EVENTS, { keyPath: 'id' });
          eventsStore.createIndex('eventName', 'eventName', { unique: false });
          eventsStore.createIndex('blockNumber', 'blockNumber', { unique: false });
          eventsStore.createIndex('user', 'user', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PLAYERS)) {
          const playersStore = db.createObjectStore(STORES.PLAYERS, { keyPath: 'address' });
          playersStore.createIndex('score', 'score', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.QUESTIONS)) {
          db.createObjectStore(STORES.QUESTIONS, { keyPath: 'questionId' });
        }

        if (!db.objectStoreNames.contains(STORES.GLOBAL_STATS)) {
          db.createObjectStore(STORES.GLOBAL_STATS, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Load data from IndexedDB into memory caches
   */
  private async loadFromDatabase(): Promise<void> {
    if (!this.db) return;

    // Load events
    const events = await this.getAllFromStore<ContractEvent & { id: string }>(STORES.EVENTS);
    for (const event of events) {
      this.eventsCache.set(event.id, event);
    }

    // Load players
    const players = await this.getAllFromStore<PlayerData>(STORES.PLAYERS);
    for (const player of players) {
      this.playersCache.set(player.address.toLowerCase(), player);
    }

    // Load questions
    const questions = await this.getAllFromStore<QuestionData>(STORES.QUESTIONS);
    for (const question of questions) {
      this.questionsCache.set(question.questionId.toString(), question);
    }

    // Load global stats
    const stats = await this.getFromStore<GlobalStatsData & { id: string }>(STORES.GLOBAL_STATS, 'global');
    if (stats) {
      this.globalStats = stats;
    }

    console.log('[EventStorage] Loaded from database:', {
      events: this.eventsCache.size,
      players: this.playersCache.size,
      questions: this.questionsCache.size,
    });
  }

  /**
   * Save an event to storage
   */
  async saveEvent(event: ContractEvent): Promise<void> {
    const id = `${event.transactionHash}-${event.logIndex}`;

    // Check for duplicates
    if (this.eventsCache.has(id)) {
      return;
    }

    // Save to cache
    this.eventsCache.set(id, event);

    // Handle specific event types
    if (event.eventName === 'QuestionAdded') {
      await this.handleQuestionAdded(event as QuestionAddedEvent);
    } else if (event.eventName === 'AnswerSubmitted') {
      await this.handleAnswerSubmitted(event as AnswerSubmittedEvent);
    }

    // Persist to IndexedDB
    if (this.db) {
      await this.putInStore(STORES.EVENTS, { ...event, id });
    }
  }

  /**
   * Handle QuestionAdded event
   */
  private async handleQuestionAdded(event: QuestionAddedEvent): Promise<void> {
    const questionId = event.args.questionId.toString();

    if (!this.questionsCache.has(questionId)) {
      const questionData: QuestionData = {
        questionId: event.args.questionId,
        questionText: event.args.questionText,
        reward: event.args.reward,
        totalAnswers: 0,
        correctAnswers: 0,
        totalRewardsDistributed: 0n,
        addedAt: event.blockTimestamp,
        blockNumber: event.blockNumber,
      };

      this.questionsCache.set(questionId, questionData);

      if (this.db) {
        await this.putInStore(STORES.QUESTIONS, questionData);
      }
    }
  }

  /**
   * Handle AnswerSubmitted event
   */
  private async handleAnswerSubmitted(event: AnswerSubmittedEvent): Promise<void> {
    const address = event.args.user.toLowerCase();

    // Get or create player
    let player = this.playersCache.get(address);
    if (!player) {
      player = {
        address: event.args.user,
        score: 0n,
        correctAnswers: 0,
        totalAnswers: 0,
        totalRewards: 0n,
        firstPlayedAt: event.blockTimestamp,
        lastPlayedAt: event.blockTimestamp,
      };
      this.globalStats.uniquePlayers++;
    }

    // Update player stats
    player.totalAnswers++;
    player.lastPlayedAt = event.blockTimestamp;

    if (event.args.isCorrect) {
      player.correctAnswers++;
      player.score++;
      if (event.args.reward > 0n) {
        player.totalRewards += event.args.reward;
      }
    }

    this.playersCache.set(address, player);

    if (this.db) {
      await this.putInStore(STORES.PLAYERS, player);
    }
  }

  /**
   * Get an event by ID
   */
  async getEvent(eventId: string): Promise<ContractEvent | null> {
    return this.eventsCache.get(eventId) || null;
  }

  /**
   * Get events with filtering
   */
  async getEvents(filter: EventFilter): Promise<ContractEvent[]> {
    let events = Array.from(this.eventsCache.values());

    // Apply filters
    if (filter.eventTypes && filter.eventTypes.length > 0) {
      events = events.filter((e) => filter.eventTypes!.includes(e.eventName));
    }

    if (filter.fromBlock !== undefined) {
      events = events.filter((e) => e.blockNumber >= filter.fromBlock!);
    }

    if (filter.toBlock !== undefined) {
      events = events.filter((e) => e.blockNumber <= filter.toBlock!);
    }

    if (filter.user) {
      const userLower = filter.user.toLowerCase();
      events = events.filter((e) => {
        const eventUser = 'user' in e.args ? (e.args as { user: string }).user : undefined;
        return eventUser && eventUser.toLowerCase() === userLower;
      });
    }

    if (filter.questionId !== undefined) {
      events = events.filter((e) => {
        const eventQuestionId = 'questionId' in e.args ? (e.args as { questionId: bigint }).questionId : undefined;
        return eventQuestionId !== undefined && eventQuestionId === filter.questionId;
      });
    }

    // Sort by block number descending (newest first)
    events.sort((a, b) => b.blockNumber - a.blockNumber);

    // Apply pagination
    const offset = filter.offset || 0;
    const limit = filter.limit || 100;
    events = events.slice(offset, offset + limit);

    return events;
  }

  /**
   * Update player stats
   */
  async updatePlayerStats(address: string, updates: PlayerStatsUpdate): Promise<void> {
    const addressLower = address.toLowerCase();
    let player = this.playersCache.get(addressLower);

    if (!player) {
      player = {
        address,
        score: 0n,
        correctAnswers: 0,
        totalAnswers: 0,
        totalRewards: 0n,
        firstPlayedAt: Date.now(),
        lastPlayedAt: Date.now(),
      };
      this.globalStats.uniquePlayers++;
    }

    if (updates.correctAnswers !== undefined) {
      player.correctAnswers += updates.correctAnswers;
      player.score += BigInt(updates.correctAnswers);
    }

    if (updates.totalAnswers !== undefined) {
      player.totalAnswers += updates.totalAnswers;
    }

    if (updates.totalRewards !== undefined) {
      player.totalRewards += updates.totalRewards;
    }

    if (updates.lastPlayedAt !== undefined) {
      player.lastPlayedAt = updates.lastPlayedAt;
    }

    this.playersCache.set(addressLower, player);

    if (this.db) {
      await this.putInStore(STORES.PLAYERS, player);
    }
  }

  /**
   * Update question stats
   */
  async updateQuestionStats(questionId: bigint, updates: QuestionStatsUpdate): Promise<void> {
    const questionIdStr = questionId.toString();
    const question = this.questionsCache.get(questionIdStr);

    if (!question) {
      console.warn(`[EventStorage] Question ${questionIdStr} not found for stats update`);
      return;
    }

    if (updates.totalAnswers !== undefined) {
      question.totalAnswers += updates.totalAnswers;
    }

    if (updates.correctAnswers !== undefined) {
      question.correctAnswers += updates.correctAnswers;
    }

    if (updates.totalRewardsDistributed !== undefined) {
      question.totalRewardsDistributed += updates.totalRewardsDistributed;
    }

    this.questionsCache.set(questionIdStr, question);

    if (this.db) {
      await this.putInStore(STORES.QUESTIONS, question);
    }
  }

  /**
   * Update global stats
   */
  async updateGlobalStats(updates: GlobalStatsUpdate): Promise<void> {
    if (updates.totalQuestions !== undefined) {
      this.globalStats.totalQuestions += updates.totalQuestions;
    }

    if (updates.totalAnswers !== undefined) {
      this.globalStats.totalAnswers += updates.totalAnswers;
      this.globalStats.totalCorrectAnswers += updates.totalAnswers; // Assuming only correct answers call this
    }

    if (updates.totalRewardsDistributed !== undefined) {
      this.globalStats.totalRewardsDistributed += updates.totalRewardsDistributed;
    }

    if (updates.uniquePlayers !== undefined) {
      this.globalStats.uniquePlayers = updates.uniquePlayers;
    }

    this.globalStats.lastUpdatedAt = Date.now();

    if (this.db) {
      await this.putInStore(STORES.GLOBAL_STATS, { ...this.globalStats, id: 'global' });
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10, offset: number = 0): Promise<LeaderboardEntry[]> {
    const players = Array.from(this.playersCache.values());

    // Sort by score descending
    players.sort((a, b) => {
      if (b.score > a.score) return 1;
      if (b.score < a.score) return -1;
      return 0;
    });

    // Apply pagination
    const paginatedPlayers = players.slice(offset, offset + limit);

    // Map to leaderboard entries
    return paginatedPlayers.map((player, index) => ({
      rank: offset + index + 1,
      address: player.address,
      score: player.score,
      correctAnswers: player.correctAnswers,
      totalRewards: player.totalRewards,
    }));
  }

  /**
   * Get player by address
   */
  async getPlayer(address: string): Promise<PlayerData | null> {
    return this.playersCache.get(address.toLowerCase()) || null;
  }

  /**
   * Get question by ID
   */
  async getQuestion(questionId: bigint): Promise<QuestionData | null> {
    return this.questionsCache.get(questionId.toString()) || null;
  }

  /**
   * Get global stats
   */
  async getGlobalStats(): Promise<GlobalStatsData> {
    return { ...this.globalStats };
  }

  /**
   * Get event statistics
   */
  async getEventStatistics(): Promise<EventStatistics> {
    const events = Array.from(this.eventsCache.values());
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneHourAgo = now - 60 * 60 * 1000;

    const eventsByType: Record<string, number> = {};
    let eventsLast24h = 0;
    let eventsLastHour = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    for (const event of events) {
      // Count by type
      eventsByType[event.eventName] = (eventsByType[event.eventName] || 0) + 1;

      // Count recent events
      if (event.blockTimestamp >= oneDayAgo) {
        eventsLast24h++;
        if (event.blockTimestamp >= oneHourAgo) {
          eventsLastHour++;
        }
      }

      // Count answer results
      if (event.eventName === 'AnswerSubmitted') {
        const answerEvent = event as AnswerSubmittedEvent;
        if (answerEvent.args.isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    }

    return {
      totalEvents: events.length,
      eventsByType,
      eventsLast24h,
      eventsLastHour,
      uniqueUsers: this.globalStats.uniquePlayers,
      totalRewardsDistributed: this.globalStats.totalRewardsDistributed,
      questionsAdded: this.globalStats.totalQuestions,
      correctAnswers,
      incorrectAnswers,
    };
  }

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    this.eventsCache.clear();
    this.playersCache.clear();
    this.questionsCache.clear();
    this.globalStats = {
      totalQuestions: 0,
      totalAnswers: 0,
      totalCorrectAnswers: 0,
      totalRewardsDistributed: 0n,
      uniquePlayers: 0,
      lastUpdatedAt: Date.now(),
    };

    if (this.db) {
      const transaction = this.db.transaction(Object.values(STORES), 'readwrite');
      for (const storeName of Object.values(STORES)) {
        transaction.objectStore(storeName).clear();
      }
    }
  }

  // IndexedDB helper methods

  private async getFromStore<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllFromStore<T>(storeName: string): Promise<T[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async putInStore<T>(storeName: string, data: T): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
let storageInstance: EventStorageImpl | null = null;

/**
 * Get or create the storage instance
 */
export async function getEventStorage(): Promise<EventStorageImpl> {
  if (!storageInstance) {
    storageInstance = new EventStorageImpl();
    await storageInstance.initialize();
  }
  return storageInstance;
}

/**
 * Reset the storage instance (for testing)
 */
export function resetEventStorage(): void {
  storageInstance = null;
}
