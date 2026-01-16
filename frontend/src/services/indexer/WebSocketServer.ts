/**
 * WebSocket Server for Live Updates
 *
 * Provides real-time event streaming to connected clients
 * using Server-Sent Events (SSE) for Next.js compatibility.
 */

import type { ContractEvent } from '@/types/events';

// Connection state
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

// Message types
export type MessageType = 'event' | 'heartbeat' | 'stats' | 'error' | 'welcome';

// WebSocket message structure
export interface WSMessage {
  type: MessageType;
  timestamp: number;
  data?: unknown;
}

// Event message
export interface EventMessage extends WSMessage {
  type: 'event';
  data: ContractEvent;
}

// Stats message
export interface StatsMessage extends WSMessage {
  type: 'stats';
  data: {
    connectedClients: number;
    eventsProcessed: number;
    uptime: number;
  };
}

// Client subscription options
export interface ClientSubscription {
  eventTypes?: string[];
  user?: string;
  questionId?: string;
}

// Client connection
export interface ClientConnection {
  id: string;
  connectedAt: number;
  subscription: ClientSubscription;
  lastMessageAt: number;
}

/**
 * WebSocket-like message broadcaster for SSE
 *
 * Since Next.js App Router doesn't support native WebSockets,
 * we use Server-Sent Events (SSE) for real-time updates.
 */
export class EventBroadcaster {
  private clients: Map<string, {
    controller: ReadableStreamDefaultController<string>;
    subscription: ClientSubscription;
    connectedAt: number;
  }> = new Map();
  private eventsProcessed: number = 0;
  private startedAt: number = Date.now();
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startHeartbeat();
  }

  /**
   * Start heartbeat to keep connections alive
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) return;

    this.heartbeatInterval = setInterval(() => {
      this.broadcast({
        type: 'heartbeat',
        timestamp: Date.now(),
      });
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Create a new client connection
   */
  createConnection(subscription: ClientSubscription = {}): {
    id: string;
    stream: ReadableStream<string>;
  } {
    const id = crypto.randomUUID();

    const stream = new ReadableStream<string>({
      start: (controller) => {
        this.clients.set(id, {
          controller,
          subscription,
          connectedAt: Date.now(),
        });

        // Send welcome message
        const welcomeMessage: WSMessage = {
          type: 'welcome',
          timestamp: Date.now(),
          data: {
            clientId: id,
            subscription,
          },
        };
        controller.enqueue(`data: ${JSON.stringify(welcomeMessage)}\n\n`);
      },
      cancel: () => {
        this.clients.delete(id);
      },
    });

    return { id, stream };
  }

  /**
   * Close a client connection
   */
  closeConnection(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      try {
        client.controller.close();
      } catch {
        // Controller may already be closed
      }
      this.clients.delete(clientId);
    }
  }

  /**
   * Update client subscription
   */
  updateSubscription(clientId: string, subscription: ClientSubscription): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.subscription = subscription;
    }
  }

  /**
   * Broadcast a message to all clients
   */
  broadcast(message: WSMessage): void {
    const serialized = `data: ${JSON.stringify(message)}\n\n`;

    for (const [clientId, client] of this.clients.entries()) {
      try {
        client.controller.enqueue(serialized);
      } catch {
        // Client disconnected, remove from list
        this.clients.delete(clientId);
      }
    }
  }

  /**
   * Broadcast an event to subscribed clients
   */
  broadcastEvent(event: ContractEvent): void {
    this.eventsProcessed++;

    const message: EventMessage = {
      type: 'event',
      timestamp: Date.now(),
      data: event,
    };

    const serialized = `data: ${JSON.stringify(message, bigIntReplacer)}\n\n`;

    for (const [clientId, client] of this.clients.entries()) {
      // Check if client is subscribed to this event
      if (this.matchesSubscription(event, client.subscription)) {
        try {
          client.controller.enqueue(serialized);
        } catch {
          this.clients.delete(clientId);
        }
      }
    }
  }

  /**
   * Check if event matches client subscription
   */
  private matchesSubscription(
    event: ContractEvent,
    subscription: ClientSubscription
  ): boolean {
    // Check event type filter
    if (
      subscription.eventTypes &&
      subscription.eventTypes.length > 0 &&
      !subscription.eventTypes.includes(event.eventName)
    ) {
      return false;
    }

    // Check user filter
    if (subscription.user) {
      const eventUser = 'user' in event.args
        ? (event.args as { user: string }).user
        : undefined;
      if (!eventUser || eventUser.toLowerCase() !== subscription.user.toLowerCase()) {
        return false;
      }
    }

    // Check questionId filter
    if (subscription.questionId) {
      const eventQuestionId = 'questionId' in event.args
        ? (event.args as { questionId: bigint }).questionId.toString()
        : undefined;
      if (eventQuestionId !== subscription.questionId) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get connection statistics
   */
  getStats(): {
    connectedClients: number;
    eventsProcessed: number;
    uptime: number;
    clientDetails: ClientConnection[];
  } {
    const clientDetails: ClientConnection[] = [];

    for (const [id, client] of this.clients.entries()) {
      clientDetails.push({
        id,
        connectedAt: client.connectedAt,
        subscription: client.subscription,
        lastMessageAt: Date.now(),
      });
    }

    return {
      connectedClients: this.clients.size,
      eventsProcessed: this.eventsProcessed,
      uptime: Date.now() - this.startedAt,
      clientDetails,
    };
  }

  /**
   * Broadcast statistics to all clients
   */
  broadcastStats(): void {
    const stats = this.getStats();
    const message: StatsMessage = {
      type: 'stats',
      timestamp: Date.now(),
      data: {
        connectedClients: stats.connectedClients,
        eventsProcessed: stats.eventsProcessed,
        uptime: stats.uptime,
      },
    };
    this.broadcast(message);
  }

  /**
   * Shutdown the broadcaster
   */
  shutdown(): void {
    this.stopHeartbeat();

    // Close all client connections
    for (const [clientId] of this.clients.entries()) {
      this.closeConnection(clientId);
    }
  }
}

/**
 * JSON replacer for BigInt serialization
 */
function bigIntReplacer(key: string, value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

// Singleton broadcaster instance
let broadcasterInstance: EventBroadcaster | null = null;

/**
 * Get or create the broadcaster instance
 */
export function getEventBroadcaster(): EventBroadcaster {
  if (!broadcasterInstance) {
    broadcasterInstance = new EventBroadcaster();
  }
  return broadcasterInstance;
}

/**
 * Reset the broadcaster instance (for testing)
 */
export function resetEventBroadcaster(): void {
  if (broadcasterInstance) {
    broadcasterInstance.shutdown();
    broadcasterInstance = null;
  }
}

/**
 * Client-side EventSource wrapper for consuming SSE
 */
export class EventStreamClient {
  private eventSource: EventSource | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000;
  private listeners: Map<MessageType, Set<(data: unknown) => void>> = new Map();
  private connectionState: ConnectionState = 'disconnected';
  private stateListeners: Set<(state: ConnectionState) => void> = new Set();

  constructor(private url: string) {}

  /**
   * Connect to the event stream
   */
  connect(): void {
    if (this.eventSource) {
      this.disconnect();
    }

    this.setConnectionState('connecting');

    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      this.reconnectAttempts = 0;
      this.setConnectionState('connected');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('[EventStreamClient] Failed to parse message:', error);
      }
    };

    this.eventSource.onerror = () => {
      this.setConnectionState('error');
      this.handleReconnect();
    };
  }

  /**
   * Disconnect from the event stream
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.setConnectionState('disconnected');
  }

  /**
   * Handle reconnection with exponential backoff
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[EventStreamClient] Max reconnect attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`[EventStreamClient] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (this.connectionState !== 'connected') {
        this.connect();
      }
    }, delay);
  }

  /**
   * Handle incoming message
   */
  private handleMessage(message: WSMessage): void {
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(message.data);
        } catch (error) {
          console.error('[EventStreamClient] Listener error:', error);
        }
      });
    }
  }

  /**
   * Set connection state and notify listeners
   */
  private setConnectionState(state: ConnectionState): void {
    this.connectionState = state;
    this.stateListeners.forEach((listener) => listener(state));
  }

  /**
   * Subscribe to a message type
   */
  on<T>(type: MessageType, callback: (data: T) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback as (data: unknown) => void);

    return () => {
      this.listeners.get(type)?.delete(callback as (data: unknown) => void);
    };
  }

  /**
   * Subscribe to connection state changes
   */
  onStateChange(callback: (state: ConnectionState) => void): () => void {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.connectionState;
  }
}
