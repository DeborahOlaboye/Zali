/**
 * Event Analytics Component
 *
 * Displays analytics and statistics for contract events
 * including charts, metrics, and trends.
 */

'use client';

import React from 'react';
import { useEventStats, useLeaderboard } from '@/hooks/useEventStream';

// Props for EventAnalytics component
interface EventAnalyticsProps {
  refreshInterval?: number;
  className?: string;
}

/**
 * Event Analytics Dashboard
 */
export function EventAnalytics({
  refreshInterval = 30000,
  className = '',
}: EventAnalyticsProps) {
  const { stats, loading: statsLoading } = useEventStats(refreshInterval);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(5, refreshInterval);

  if (statsLoading && !stats) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Game Analytics</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Questions"
            value={stats?.game.totalQuestions || 0}
            icon="📝"
          />
          <StatCard
            label="Total Answers"
            value={stats?.game.totalAnswers || 0}
            icon="✍️"
          />
          <StatCard
            label="Unique Players"
            value={stats?.game.uniquePlayers || 0}
            icon="👥"
          />
          <StatCard
            label="Correct Rate"
            value={`${stats?.game.correctRate || '0'}%`}
            icon="🎯"
            highlight
          />
        </div>
      </div>

      {/* Rewards and Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rewards Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Rewards</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total Distributed</span>
              <span className="text-xl font-bold text-green-600">
                {formatUSDC(stats?.game.totalRewardsDistributed || '0')} USDC
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Correct Answers</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.game.correctAnswers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Incorrect Answers</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.game.incorrectAnswers || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Event Activity Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Event Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total Events</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.events.total || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Last 24 Hours</span>
              <span className="text-lg font-semibold text-blue-600">
                {stats?.events.last24h || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Last Hour</span>
              <span className="text-lg font-semibold text-blue-600">
                {stats?.events.lastHour || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Events by Type */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Events by Type</h3>
        <div className="space-y-3">
          {Object.entries(stats?.events.byType || {}).map(([type, count]) => (
            <EventTypeBar key={type} type={type} count={count as number} total={stats?.events.total || 1} />
          ))}
          {Object.keys(stats?.events.byType || {}).length === 0 && (
            <p className="text-gray-500 text-sm">No events recorded yet</p>
          )}
        </div>
      </div>

      {/* Top Players */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Top Players</h3>
        {leaderboardLoading && !leaderboard.length ? (
          <div className="animate-pulse space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-500 text-sm">No players yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div
                key={player.address}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      index === 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : index === 1
                        ? 'bg-gray-100 text-gray-700'
                        : index === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="font-mono text-sm text-gray-700">
                    {shortenAddress(player.address)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {player.score} pts
                  </p>
                  <p className="text-xs text-green-600">
                    {formatUSDC(player.totalRewards)} USDC
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Updated */}
      {stats?.lastUpdatedAt && (
        <p className="text-xs text-gray-400 text-center">
          Last updated: {new Date(stats.lastUpdatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-lg ${
        highlight ? 'bg-gradient-to-br from-purple-50 to-blue-50' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p
        className={`text-2xl font-bold ${
          highlight ? 'text-purple-600' : 'text-gray-900'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * Event Type Progress Bar
 */
function EventTypeBar({
  type,
  count,
  total,
}: {
  type: string;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  const colors: Record<string, string> = {
    QuestionAdded: 'bg-blue-500',
    AnswerSubmitted: 'bg-purple-500',
    RewardDistributed: 'bg-green-500',
    ScoreUpdated: 'bg-orange-500',
  };

  const labels: Record<string, string> = {
    QuestionAdded: 'Questions Added',
    AnswerSubmitted: 'Answers Submitted',
    RewardDistributed: 'Rewards Distributed',
    ScoreUpdated: 'Score Updates',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{labels[type] || type}</span>
        <span className="text-sm font-medium text-gray-900">{count}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${colors[type] || 'bg-gray-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Utility functions
function shortenAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUSDC(amount: string): string {
  const value = Number(amount) / 1e6;
  return value.toFixed(2);
}

export default EventAnalytics;
