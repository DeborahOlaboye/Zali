/**
 * Event Indexer Service Index
 *
 * Central export point for all indexer services.
 */

// Event Listener
export { EventListener, getEventListener, resetEventListener } from './EventListener';

// Event Handlers
export {
  EventHandlerDispatcher,
  QuestionAddedHandler,
  AnswerSubmittedHandler,
  RewardDistributedHandler,
  ScoreUpdatedHandler,
} from './EventHandlers';
export type {
  HandlerResult,
  HandlerContext,
  EventStorage,
  EventNotifier,
  EventAnalytics,
  EventFilter,
  PlayerStatsUpdate,
  QuestionStatsUpdate,
  GlobalStatsUpdate,
  LeaderboardEntry,
} from './EventHandlers';

// Event Storage
export {
  EventStorageImpl,
  getEventStorage,
  resetEventStorage,
} from './EventStorage';
export type {
  PlayerData,
  QuestionData,
  GlobalStatsData,
} from './EventStorage';

// WebSocket / SSE Server
export {
  EventBroadcaster,
  EventStreamClient,
  getEventBroadcaster,
  resetEventBroadcaster,
} from './WebSocketServer';
export type {
  ConnectionState,
  MessageType,
  WSMessage,
  EventMessage,
  StatsMessage,
  ClientSubscription,
  ClientConnection,
} from './WebSocketServer';

// Notification Service
export {
  NotificationService,
  getNotificationService,
  resetNotificationService,
} from './NotificationService';
export type {
  NotificationType,
  Notification,
  NotificationPreferences,
  NotificationListener,
} from './NotificationService';

// Retry Manager
export {
  withRetry,
  calculateBackoffDelay,
  sleep,
  isRetryableError,
  CircuitBreaker,
  ResilientExecutor,
  ErrorAggregator,
  CircuitState,
} from './RetryManager';
export type {
  RetryOptions,
  CircuitBreakerOptions,
} from './RetryManager';

// Health Check
export {
  HealthCheckService,
  getHealthCheckService,
  resetHealthCheckService,
} from './HealthCheck';
export type {
  HealthStatus,
  ComponentHealth,
  HealthReport,
  HealthMetrics,
} from './HealthCheck';

/**
 * Initialize the event indexer system
 */
export async function initializeIndexer(options?: {
  rpcUrl?: string;
  wsUrl?: string;
  enableHistoricalSync?: boolean;
  enableNotifications?: boolean;
}) {
  const {
    rpcUrl,
    wsUrl,
    enableHistoricalSync = false,
    enableNotifications = true,
  } = options || {};

  // Initialize storage
  const storage = await getEventStorage();

  // Initialize event listener
  const listener = getEventListener(rpcUrl, wsUrl);
  await listener.initialize();

  // Initialize notification service
  const notifier = enableNotifications ? getNotificationService() : null;

  // Initialize broadcaster
  const broadcaster = getEventBroadcaster();

  // Initialize health check
  const healthCheck = getHealthCheckService();
  healthCheck.startPeriodicChecks(60000);

  // Connect listener to broadcaster
  listener.subscribe((event) => {
    broadcaster.broadcastEvent(event);
    if (notifier) {
      switch (event.eventName) {
        case 'QuestionAdded':
          notifier.notifyNewQuestion(event as import('@/types/events').QuestionAddedEvent);
          break;
        case 'AnswerSubmitted':
          notifier.notifyAnswer(event as import('@/types/events').AnswerSubmittedEvent);
          break;
        case 'RewardDistributed':
          notifier.notifyReward(event as import('@/types/events').RewardDistributedEvent);
          break;
        case 'ScoreUpdated':
          notifier.notifyScoreUpdate(event as import('@/types/events').ScoreUpdatedEvent);
          break;
      }
    }
  });

  // Start listening
  await listener.start();

  // Historical sync if enabled
  if (enableHistoricalSync) {
    console.log('[Indexer] Historical sync not yet implemented');
  }

  console.log('[Indexer] Initialized successfully');

  return {
    storage,
    listener,
    notifier,
    broadcaster,
    healthCheck,
    stop: () => {
      listener.stop();
      healthCheck.stopPeriodicChecks();
      broadcaster.shutdown();
    },
  };
}

/**
 * Shutdown the indexer system
 */
export function shutdownIndexer() {
  resetEventListener();
  resetEventStorage();
  resetEventBroadcaster();
  resetNotificationService();
  resetHealthCheckService();
  console.log('[Indexer] Shutdown complete');
}
