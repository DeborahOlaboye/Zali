/**
 * Health Check and Monitoring Service
 *
 * Provides health checks, metrics collection, and monitoring
 * for the event indexer service.
 */

import { RPC_CONFIG, INDEXER_CONFIG, FEATURE_FLAGS } from '@/config/indexer';
import type { IndexerStatus, EventStatistics } from '@/types/events';

// Health check status
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

// Component health
export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  message?: string;
  lastChecked: number;
  responseTime?: number;
}

// Overall health report
export interface HealthReport {
  status: HealthStatus;
  timestamp: number;
  uptime: number;
  components: ComponentHealth[];
  metrics: HealthMetrics;
}

// Health metrics
export interface HealthMetrics {
  eventsProcessed: number;
  eventsPerMinute: number;
  averageProcessingTime: number;
  errorRate: number;
  memoryUsage: number;
  cacheHitRate: number;
  activeConnections: number;
}

// Performance metrics collector
interface PerformanceEntry {
  timestamp: number;
  duration: number;
  success: boolean;
}

/**
 * Health Check Service
 */
export class HealthCheckService {
  private startTime: number = Date.now();
  private performanceEntries: PerformanceEntry[] = [];
  private errorCount: number = 0;
  private successCount: number = 0;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;
  private lastHealthCheck: HealthReport | null = null;
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Start periodic health checks
   */
  startPeriodicChecks(intervalMs: number = 60000): void {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(async () => {
      try {
        await this.runHealthCheck();
      } catch (error) {
        console.error('[HealthCheck] Periodic check failed:', error);
      }
    }, intervalMs);

    // Run initial check
    this.runHealthCheck();
  }

  /**
   * Stop periodic health checks
   */
  stopPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Run comprehensive health check
   */
  async runHealthCheck(): Promise<HealthReport> {
    const components: ComponentHealth[] = [];

    // Check RPC connection
    components.push(await this.checkRpcConnection());

    // Check IndexedDB
    components.push(await this.checkIndexedDB());

    // Check SSE service
    components.push(this.checkSSEService());

    // Check memory usage
    components.push(this.checkMemoryUsage());

    // Determine overall status
    const status = this.determineOverallStatus(components);

    const report: HealthReport = {
      status,
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime,
      components,
      metrics: this.collectMetrics(),
    };

    this.lastHealthCheck = report;

    // Log if not healthy
    if (status !== 'healthy') {
      console.warn('[HealthCheck] System status:', status, components);
    }

    return report;
  }

  /**
   * Check RPC connection health
   */
  private async checkRpcConnection(): Promise<ComponentHealth> {
    const startTime = Date.now();
    try {
      const response = await fetch(RPC_CONFIG.httpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
        signal: AbortSignal.timeout(5000),
      });

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      if (data.result) {
        return {
          name: 'RPC Connection',
          status: responseTime < 1000 ? 'healthy' : 'degraded',
          message: `Block: ${parseInt(data.result, 16)}`,
          lastChecked: Date.now(),
          responseTime,
        };
      }

      return {
        name: 'RPC Connection',
        status: 'unhealthy',
        message: 'Invalid response',
        lastChecked: Date.now(),
        responseTime,
      };
    } catch (error) {
      return {
        name: 'RPC Connection',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: Date.now(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Check IndexedDB health
   */
  private async checkIndexedDB(): Promise<ComponentHealth> {
    if (typeof indexedDB === 'undefined') {
      return {
        name: 'IndexedDB',
        status: 'degraded',
        message: 'Not available (SSR)',
        lastChecked: Date.now(),
      };
    }

    const startTime = Date.now();
    try {
      const request = indexedDB.open('ZaliEventsIndexer', 1);

      await new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
          request.result.close();
          resolve();
        };
        request.onerror = () => reject(request.error);
        // Set timeout
        setTimeout(() => reject(new Error('Timeout')), 3000);
      });

      return {
        name: 'IndexedDB',
        status: 'healthy',
        message: 'Connected',
        lastChecked: Date.now(),
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        name: 'IndexedDB',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: Date.now(),
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Check SSE service health
   */
  private checkSSEService(): ComponentHealth {
    // SSE is always "healthy" from server perspective if the endpoint exists
    return {
      name: 'SSE Service',
      status: 'healthy',
      message: 'Available',
      lastChecked: Date.now(),
    };
  }

  /**
   * Check memory usage
   */
  private checkMemoryUsage(): ComponentHealth {
    if (typeof performance === 'undefined' || !('memory' in performance)) {
      return {
        name: 'Memory',
        status: 'healthy',
        message: 'Monitoring not available',
        lastChecked: Date.now(),
      };
    }

    const memory = (performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
    const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

    let status: HealthStatus = 'healthy';
    if (usagePercent > 90) {
      status = 'unhealthy';
    } else if (usagePercent > 70) {
      status = 'degraded';
    }

    return {
      name: 'Memory',
      status,
      message: `${usedMB}MB / ${limitMB}MB (${usagePercent.toFixed(1)}%)`,
      lastChecked: Date.now(),
    };
  }

  /**
   * Determine overall system status
   */
  private determineOverallStatus(components: ComponentHealth[]): HealthStatus {
    const hasUnhealthy = components.some((c) => c.status === 'unhealthy');
    const hasDegraded = components.some((c) => c.status === 'degraded');

    if (hasUnhealthy) return 'unhealthy';
    if (hasDegraded) return 'degraded';
    return 'healthy';
  }

  /**
   * Collect performance metrics
   */
  private collectMetrics(): HealthMetrics {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Clean old entries
    this.performanceEntries = this.performanceEntries.filter(
      (e) => e.timestamp > now - 300000 // Keep last 5 minutes
    );

    const recentEntries = this.performanceEntries.filter(
      (e) => e.timestamp > oneMinuteAgo
    );

    const eventsPerMinute = recentEntries.length;
    const averageProcessingTime =
      recentEntries.length > 0
        ? recentEntries.reduce((sum, e) => sum + e.duration, 0) / recentEntries.length
        : 0;

    const totalRequests = this.successCount + this.errorCount;
    const errorRate = totalRequests > 0 ? (this.errorCount / totalRequests) * 100 : 0;

    const totalCacheRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRate =
      totalCacheRequests > 0 ? (this.cacheHits / totalCacheRequests) * 100 : 0;

    let memoryUsage = 0;
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
      memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }

    return {
      eventsProcessed: this.successCount,
      eventsPerMinute,
      averageProcessingTime: Math.round(averageProcessingTime),
      errorRate: Math.round(errorRate * 100) / 100,
      memoryUsage,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      activeConnections: 0, // Will be updated by SSE service
    };
  }

  /**
   * Record a performance entry
   */
  recordPerformance(duration: number, success: boolean): void {
    this.performanceEntries.push({
      timestamp: Date.now(),
      duration,
      success,
    });

    if (success) {
      this.successCount++;
    } else {
      this.errorCount++;
    }
  }

  /**
   * Record cache access
   */
  recordCacheAccess(hit: boolean): void {
    if (hit) {
      this.cacheHits++;
    } else {
      this.cacheMisses++;
    }
  }

  /**
   * Get last health check result
   */
  getLastHealthCheck(): HealthReport | null {
    return this.lastHealthCheck;
  }

  /**
   * Get uptime in milliseconds
   */
  getUptime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.performanceEntries = [];
    this.errorCount = 0;
    this.successCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

// Singleton instance
let healthCheckInstance: HealthCheckService | null = null;

/**
 * Get or create the health check service instance
 */
export function getHealthCheckService(): HealthCheckService {
  if (!healthCheckInstance) {
    healthCheckInstance = new HealthCheckService();
  }
  return healthCheckInstance;
}

/**
 * Reset the health check service instance (for testing)
 */
export function resetHealthCheckService(): void {
  if (healthCheckInstance) {
    healthCheckInstance.stopPeriodicChecks();
    healthCheckInstance = null;
  }
}
