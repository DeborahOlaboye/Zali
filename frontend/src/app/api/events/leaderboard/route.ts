/**
 * Leaderboard API
 *
 * Provides endpoint for retrieving the game leaderboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEventStorage } from '@/services/indexer/EventStorage';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events/leaderboard
 *
 * Get leaderboard with top players
 *
 * Query parameters:
 * - limit: maximum results (default 10, max 100)
 * - offset: pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limitParam = searchParams.get('limit');
    let limit = limitParam ? parseInt(limitParam, 10) : 10;
    limit = Math.min(Math.max(limit, 1), 100); // Clamp between 1 and 100

    const offsetParam = searchParams.get('offset');
    const offset = offsetParam ? Math.max(parseInt(offsetParam, 10), 0) : 0;

    const storage = await getEventStorage();

    // Get leaderboard
    const leaderboard = await storage.getLeaderboard(limit, offset);

    // Serialize bigint values
    const serializedLeaderboard = leaderboard.map((entry) => ({
      rank: entry.rank,
      address: entry.address,
      score: entry.score.toString(),
      correctAnswers: entry.correctAnswers,
      totalRewards: entry.totalRewards.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedLeaderboard,
      meta: {
        count: serializedLeaderboard.length,
        offset,
        limit,
      },
    });
  } catch (error) {
    console.error('[API] Leaderboard query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
