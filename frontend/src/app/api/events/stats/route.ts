/**
 * Event Statistics API
 *
 * Provides endpoint for retrieving event and global statistics.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEventStorage } from '@/services/indexer/EventStorage';

export const dynamic = 'force-dynamic';

/**
 * GET /api/events/stats
 *
 * Get event statistics and global game stats
 */
export async function GET(request: NextRequest) {
  try {
    const storage = await getEventStorage();

    // Get event statistics
    const eventStats = await storage.getEventStatistics();

    // Get global game stats
    const globalStats = await storage.getGlobalStats();

    // Serialize bigint values
    const response = {
      success: true,
      data: {
        events: {
          total: eventStats.totalEvents,
          byType: eventStats.eventsByType,
          last24h: eventStats.eventsLast24h,
          lastHour: eventStats.eventsLastHour,
        },
        game: {
          totalQuestions: globalStats.totalQuestions,
          totalAnswers: globalStats.totalAnswers,
          correctAnswers: eventStats.correctAnswers,
          incorrectAnswers: eventStats.incorrectAnswers,
          correctRate:
            eventStats.correctAnswers + eventStats.incorrectAnswers > 0
              ? (
                  (eventStats.correctAnswers /
                    (eventStats.correctAnswers + eventStats.incorrectAnswers)) *
                  100
                ).toFixed(2)
              : '0.00',
          totalRewardsDistributed: globalStats.totalRewardsDistributed.toString(),
          uniquePlayers: globalStats.uniquePlayers,
        },
        lastUpdatedAt: globalStats.lastUpdatedAt,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[API] Stats query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
