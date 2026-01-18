/**
 * Events Query API
 *
 * Provides REST endpoints for querying indexed contract events.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEventStorage } from '@/services/indexer/EventStorage';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events
 *
 * Query events with optional filtering
 *
 * Query parameters:
 * - eventTypes: comma-separated list of event types
 * - fromBlock: minimum block number
 * - toBlock: maximum block number
 * - user: filter by user address
 * - questionId: filter by question ID
 * - limit: maximum results (default 100)
 * - offset: pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const eventTypesParam = searchParams.get('eventTypes');
    const eventTypes = eventTypesParam ? eventTypesParam.split(',') : undefined;

    const fromBlockParam = searchParams.get('fromBlock');
    const fromBlock = fromBlockParam ? parseInt(fromBlockParam, 10) : undefined;

    const toBlockParam = searchParams.get('toBlock');
    const toBlock = toBlockParam ? parseInt(toBlockParam, 10) : undefined;

    const user = searchParams.get('user') || undefined;

    const questionIdParam = searchParams.get('questionId');
    const questionId = questionIdParam ? BigInt(questionIdParam) : undefined;

    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const offsetParam = searchParams.get('offset');
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    // Get storage instance
    const storage = await getEventStorage();

    // Query events
    const events = await storage.getEvents({
      eventTypes,
      fromBlock,
      toBlock,
      user,
      questionId,
      limit,
      offset,
    });

    // Serialize bigint values for JSON response
    const serializedEvents = events.map((event) => ({
      ...event,
      args: serializeBigInts(event.args),
    }));

    return NextResponse.json({
      success: true,
      data: serializedEvents,
      meta: {
        count: serializedEvents.length,
        offset,
        limit,
      },
    });
  } catch (error) {
    console.error('[API] Events query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Recursively serialize bigint values to strings
 */
function serializeBigInts(obj: unknown): unknown {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInts);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInts(value);
    }
    return result;
  }
  return obj;
}
