/**
 * Event History Component
 *
 * Displays a real-time feed of contract events with filtering
 * and detailed event information.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useEventStream, useEvents } from '@/hooks/useEventStream';
import type { ContractEvent } from '@/types/events';

// Event type labels and colors
const EVENT_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  QuestionAdded: {
    label: 'New Question',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  AnswerSubmitted: {
    label: 'Answer',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  RewardDistributed: {
    label: 'Reward',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  ScoreUpdated: {
    label: 'Score Update',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
};

// Props for EventHistory component
interface EventHistoryProps {
  maxEvents?: number;
  showFilters?: boolean;
  autoScroll?: boolean;
  className?: string;
}

/**
 * Event History Component
 */
export function EventHistory({
  maxEvents = 50,
  showFilters = true,
  autoScroll = true,
  className = '',
}: EventHistoryProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Use real-time stream when live, otherwise fetch historical
  const {
    events: liveEvents,
    connectionState,
    isConnected,
  } = useEventStream({
    eventTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
    autoConnect: isLive,
  });

  const { events: historicalEvents, loading } = useEvents(
    isLive
      ? undefined
      : {
          eventTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
          limit: maxEvents,
        }
  );

  const events = isLive ? liveEvents : historicalEvents;

  // Toggle event type filter
  const toggleEventType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Event History</h2>
          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-xs text-gray-500">
                {isConnected ? 'Live' : connectionState}
              </span>
            </div>

            {/* Live toggle */}
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                isLive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isLive ? 'Live' : 'Historical'}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(EVENT_CONFIG).map(([type, config]) => (
              <button
                key={type}
                onClick={() => toggleEventType(type)}
                className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                  selectedTypes.includes(type) || selectedTypes.length === 0
                    ? `${config.bgColor} ${config.color}`
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Event list */}
      <div
        className="overflow-y-auto max-h-96"
        style={{ scrollBehavior: autoScroll ? 'smooth' : 'auto' }}
      >
        {loading && !isLive ? (
          <div className="p-4 text-center text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No events yet. Events will appear here in real-time.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {events.slice(0, maxEvents).map((event, index) => (
              <EventItem key={`${event.transactionHash}-${event.logIndex}-${index}`} event={event} />
            ))}
          </ul>
        )}
      </div>

      {/* Footer with event count */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          Showing {Math.min(events.length, maxEvents)} of {events.length} events
        </p>
      </div>
    </div>
  );
}

/**
 * Individual Event Item
 */
function EventItem({ event }: { event: ContractEvent }) {
  const config = EVENT_CONFIG[event.eventName] || {
    label: event.eventName,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  };

  const formattedTime = new Date(event.blockTimestamp).toLocaleTimeString();

  return (
    <li className="px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {/* Event type badge */}
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}
          >
            {config.label}
          </span>

          {/* Event details */}
          <div>
            <EventDetails event={event} />
            <p className="mt-1 text-xs text-gray-400">
              Block #{event.blockNumber}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formattedTime}
        </span>
      </div>
    </li>
  );
}

/**
 * Event-specific details renderer
 */
function EventDetails({ event }: { event: ContractEvent }) {
  switch (event.eventName) {
    case 'QuestionAdded': {
      const args = event.args as { questionId: bigint; questionText: string; reward: bigint };
      return (
        <div>
          <p className="text-sm text-gray-900">
            Question #{args.questionId.toString()} added
          </p>
          <p className="text-xs text-gray-500 truncate max-w-xs">
            {args.questionText}
          </p>
          <p className="text-xs text-green-600">
            Reward: {formatUSDC(args.reward)} USDC
          </p>
        </div>
      );
    }

    case 'AnswerSubmitted': {
      const args = event.args as {
        user: string;
        questionId: bigint;
        isCorrect: boolean;
        reward: bigint;
      };
      return (
        <div>
          <p className="text-sm text-gray-900">
            <span className="font-mono text-xs">{shortenAddress(args.user)}</span>
            {' '}answered Question #{args.questionId.toString()}
          </p>
          <p className={`text-xs ${args.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
            {args.isCorrect ? '✓ Correct' : '✗ Incorrect'}
            {args.isCorrect && args.reward > 0n && ` - Earned ${formatUSDC(args.reward)} USDC`}
          </p>
        </div>
      );
    }

    case 'RewardDistributed': {
      const args = event.args as { user: string; questionId: bigint; amount: bigint };
      return (
        <div>
          <p className="text-sm text-gray-900">
            <span className="font-mono text-xs">{shortenAddress(args.user)}</span>
            {' '}received reward
          </p>
          <p className="text-xs text-green-600">
            {formatUSDC(args.amount)} USDC for Question #{args.questionId.toString()}
          </p>
        </div>
      );
    }

    case 'ScoreUpdated': {
      const args = event.args as { user: string; newScore: bigint; previousScore: bigint };
      return (
        <div>
          <p className="text-sm text-gray-900">
            <span className="font-mono text-xs">{shortenAddress(args.user)}</span>
            {' '}score updated
          </p>
          <p className="text-xs text-gray-500">
            {args.previousScore.toString()} → {args.newScore.toString()} points
          </p>
        </div>
      );
    }

    default:
      return (
        <p className="text-sm text-gray-900">
          {event.eventName}
        </p>
      );
  }
}

// Utility functions
function shortenAddress(address: string): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatUSDC(amount: bigint): string {
  const value = Number(amount) / 1e6;
  return value.toFixed(2);
}

export default EventHistory;
