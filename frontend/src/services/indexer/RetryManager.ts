/**
 * Retry Manager
 *
 * Provides robust retry logic with exponential backoff,
 * circuit breaker pattern, and comprehensive error handling.
 */

// Retry configuration options
export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFactor: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, error: Error, nextDelayMs: number) => void;
}

// Default retry options
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 5,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
};

// Circuit breaker states
export enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Failing, reject all requests
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

// Circuit breaker configuration
export interface CircuitBreakerOptions {
  failureThreshold: number;
  successThreshold: number;
  openDurationMs: number;
  onStateChange?: (oldState: CircuitState, newState: CircuitState) => void;
}

// Default circuit breaker options
const DEFAULT_CIRCUIT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  successThreshold: 2,
  openDurationMs: 60000,
};

/**
 * Calculate delay with exponential backoff and jitter
 */
export function calculateBackoffDelay(
  attempt: number,
  options: RetryOptions
): number {
  const exponentialDelay = options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, options.maxDelayMs);

  // Add jitter to prevent thundering herd
  const jitter = cappedDelay * options.jitterFactor * (Math.random() * 2 - 1);
  return Math.max(0, cappedDelay + jitter);
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: Error, retryableErrors?: string[]): boolean {
  // Default retryable error patterns
  const defaultPatterns = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'ENOTFOUND',
    'rate limit',
    'timeout',
    'network',
    'socket hang up',
    '429',
    '500',
    '502',
    '503',
    '504',
  ];

  const patterns = retryableErrors || defaultPatterns;
  const errorMessage = error.message.toLowerCase();

  return patterns.some((pattern) => errorMessage.includes(pattern.toLowerCase()));
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt >= opts.maxRetries) {
        throw lastError;
      }

      if (!isRetryableError(lastError, opts.retryableErrors)) {
        throw lastError;
      }

      const delay = calculateBackoffDelay(attempt, opts);

      if (opts.onRetry) {
        opts.onRetry(attempt + 1, lastError, delay);
      }

      await sleep(delay);
    }
  }

  throw lastError || new Error('Retry failed with unknown error');
}

/**
 * Circuit Breaker implementation
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private options: CircuitBreakerOptions;

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = { ...DEFAULT_CIRCUIT_OPTIONS, ...options };
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    // Check if we should transition from OPEN to HALF_OPEN
    if (this.state === CircuitState.OPEN) {
      const timeSinceFailure = Date.now() - this.lastFailureTime;
      if (timeSinceFailure >= this.options.openDurationMs) {
        this.transitionTo(CircuitState.HALF_OPEN);
      }
    }
    return this.state;
  }

  /**
   * Check if circuit allows requests
   */
  isAllowed(): boolean {
    const state = this.getState();
    return state === CircuitState.CLOSED || state === CircuitState.HALF_OPEN;
  }

  /**
   * Record a successful operation
   */
  recordSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.options.successThreshold) {
        this.transitionTo(CircuitState.CLOSED);
      }
    }
  }

  /**
   * Record a failed operation
   */
  recordFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    this.successCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionTo(CircuitState.OPEN);
    } else if (
      this.state === CircuitState.CLOSED &&
      this.failureCount >= this.options.failureThreshold
    ) {
      this.transitionTo(CircuitState.OPEN);
    }
  }

  /**
   * Reset the circuit breaker
   */
  reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.transitionTo(CircuitState.CLOSED);
  }

  /**
   * Transition to a new state
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    if (oldState !== newState) {
      this.state = newState;
      if (this.options.onStateChange) {
        this.options.onStateChange(oldState, newState);
      }
    }
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.isAllowed()) {
      throw new Error(`Circuit breaker is ${this.state}`);
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Get circuit breaker statistics
   */
  getStats(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
    lastFailureTime: number;
  } {
    return {
      state: this.getState(),
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

/**
 * Combined retry with circuit breaker
 */
export class ResilientExecutor {
  private circuitBreaker: CircuitBreaker;
  private retryOptions: RetryOptions;

  constructor(
    retryOptions: Partial<RetryOptions> = {},
    circuitOptions: Partial<CircuitBreakerOptions> = {}
  ) {
    this.retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
    this.circuitBreaker = new CircuitBreaker(circuitOptions);
  }

  /**
   * Execute with retry and circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return this.circuitBreaker.execute(() =>
      withRetry(fn, this.retryOptions)
    );
  }

  /**
   * Get executor status
   */
  getStatus(): {
    circuitState: CircuitState;
    circuitStats: ReturnType<CircuitBreaker['getStats']>;
  } {
    return {
      circuitState: this.circuitBreaker.getState(),
      circuitStats: this.circuitBreaker.getStats(),
    };
  }

  /**
   * Reset the executor
   */
  reset(): void {
    this.circuitBreaker.reset();
  }
}

/**
 * Error aggregator for tracking error patterns
 */
export class ErrorAggregator {
  private errors: Array<{
    timestamp: number;
    message: string;
    context?: string;
  }> = [];
  private maxErrors: number;
  private windowMs: number;

  constructor(maxErrors: number = 100, windowMs: number = 3600000) {
    this.maxErrors = maxErrors;
    this.windowMs = windowMs;
  }

  /**
   * Record an error
   */
  record(error: Error, context?: string): void {
    const now = Date.now();

    // Clean old errors
    this.errors = this.errors.filter(
      (e) => now - e.timestamp < this.windowMs
    );

    // Add new error
    this.errors.push({
      timestamp: now,
      message: error.message,
      context,
    });

    // Trim if exceeds max
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
  }

  /**
   * Get error count in time window
   */
  getCount(windowMs?: number): number {
    const now = Date.now();
    const window = windowMs || this.windowMs;
    return this.errors.filter((e) => now - e.timestamp < window).length;
  }

  /**
   * Get error rate per minute
   */
  getRate(): number {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentErrors = this.errors.filter(
      (e) => e.timestamp >= oneMinuteAgo
    );
    return recentErrors.length;
  }

  /**
   * Get most common error messages
   */
  getTopErrors(limit: number = 5): Array<{ message: string; count: number }> {
    const counts = new Map<string, number>();

    for (const error of this.errors) {
      const count = counts.get(error.message) || 0;
      counts.set(error.message, count + 1);
    }

    return Array.from(counts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Clear all errors
   */
  clear(): void {
    this.errors = [];
  }
}
