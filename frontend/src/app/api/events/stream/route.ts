/**
 * Event Stream API (Server-Sent Events)
 *
 * Provides real-time event streaming to clients using SSE.
 */

import { NextRequest } from 'next/server';
import { getEventBroadcaster } from '@/services/indexer/WebSocketServer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/events/stream
 *
 * Subscribe to real-time event stream
 *
 * Query parameters:
 * - eventTypes: comma-separated list of event types to subscribe to
 * - user: filter events by user address
 * - questionId: filter events by question ID
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse subscription options
  const eventTypesParam = searchParams.get('eventTypes');
  const eventTypes = eventTypesParam ? eventTypesParam.split(',') : undefined;
  const user = searchParams.get('user') || undefined;
  const questionId = searchParams.get('questionId') || undefined;

  const subscription = { eventTypes, user, questionId };

  // Get broadcaster and create connection
  const broadcaster = getEventBroadcaster();
  const { stream } = broadcaster.createConnection(subscription);

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
