/**
 * Player Details API
 *
 * Provides endpoint for retrieving individual player statistics.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEventStorage } from '@/services/indexer/EventStorage';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events/player/[address]
 *
 * Get player details and statistics by address
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate address format
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid address format',
        },
        { status: 400 }
      );
    }

    const storage = await getEventStorage();

    // Get player data
    const player = await storage.getPlayer(address);

    if (!player) {
      return NextResponse.json(
        {
          success: false,
          error: 'Player not found',
        },
        { status: 404 }
      );
    }

    // Get player's recent events
    const recentEvents = await storage.getEvents({
      user: address,
      limit: 20,
    });

    // Serialize bigint values
    const serializedPlayer = {
      address: player.address,
      score: player.score.toString(),
      correctAnswers: player.correctAnswers,
      totalAnswers: player.totalAnswers,
      totalRewards: player.totalRewards.toString(),
      accuracy:
        player.totalAnswers > 0
          ? ((player.correctAnswers / player.totalAnswers) * 100).toFixed(2)
          : '0.00',
      firstPlayedAt: player.firstPlayedAt,
      lastPlayedAt: player.lastPlayedAt,
    };

    const serializedEvents = recentEvents.map((event) => ({
      ...event,
      args: serializeBigInts(event.args),
    }));

    return NextResponse.json({
      success: true,
      data: {
        player: serializedPlayer,
        recentEvents: serializedEvents,
      },
    });
  } catch (error) {
    console.error('[API] Player query error:', error);
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
