/**
 * Health Check API Endpoint
 *
 * Provides health status and metrics for the event indexer.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHealthCheckService } from '@/services/indexer/HealthCheck';
import { getEventBroadcaster } from '@/services/indexer/WebSocketServer';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events/health
 *
 * Get indexer health status and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const healthService = getHealthCheckService();
    const broadcaster = getEventBroadcaster();

    // Run health check
    const report = await healthService.runHealthCheck();

    // Add SSE connection stats
    const sseStats = broadcaster.getStats();
    report.metrics.activeConnections = sseStats.connectedClients;

    // Return appropriate status code based on health
    const statusCode =
      report.status === 'healthy'
        ? 200
        : report.status === 'degraded'
        ? 200
        : 503;

    return NextResponse.json(
      {
        success: true,
        data: {
          status: report.status,
          timestamp: report.timestamp,
          uptime: report.uptime,
          uptimeFormatted: formatUptime(report.uptime),
          components: report.components,
          metrics: report.metrics,
          sse: {
            connectedClients: sseStats.connectedClients,
            eventsProcessed: sseStats.eventsProcessed,
            uptime: sseStats.uptime,
          },
        },
      },
      { status: statusCode }
    );
  } catch (error) {
    console.error('[API] Health check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
        status: 'unhealthy',
      },
      { status: 503 }
    );
  }
}

/**
 * Format uptime in human-readable format
 */
function formatUptime(uptimeMs: number): string {
  const seconds = Math.floor(uptimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
