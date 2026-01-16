/**
 * React Hooks for Real-Time Event Data
 *
 * Provides hooks for consuming event streams and data
 * from the indexer service.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContractEvent, EventStatistics } from '@/types/events';
import type { LeaderboardEntry, EventFilter } from '@/services/indexer/EventHandlers';
import type { PlayerData, GlobalStatsData } from '@/services/indexer/EventStorage';
import {
  EventStreamClient,
  ConnectionState,
} from '@/services/indexer/WebSocketServer';

// API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    count: number;
    offset: number;
    limit: number;
  };
}

interface StatsResponse {
  events: {
    total: number;
    byType: Record<string, number>;
    last24h: number;
    lastHour: number;
  };
  game: {
    totalQuestions: number;
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    correctRate: string;
    totalRewardsDistributed: string;
    uniquePlayers: number;
  };
  lastUpdatedAt: number;
}

interface SerializedLeaderboardEntry {
  rank: number;
  address: string;
  score: string;
  correctAnswers: number;
  totalRewards: string;
}

interface SerializedPlayerData {
  address: string;
  score: string;
  correctAnswers: number;
  totalAnswers: number;
  totalRewards: string;
  accuracy: string;
  firstPlayedAt: number;
  lastPlayedAt: number;
}

/**
 * Hook for connecting to the event stream
 */
export function useEventStream(options?: {
  eventTypes?: string[];
  user?: string;
  questionId?: string;
  autoConnect?: boolean;
}) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<EventStreamClient | null>(null);
  const maxEvents = 100;

  // Build URL with query params
  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (options?.eventTypes?.length) {
      params.set('eventTypes', options.eventTypes.join(','));
    }
    if (options?.user) {
      params.set('user', options.user);
    }
    if (options?.questionId) {
      params.set('questionId', options.questionId);
    }
    const queryString = params.toString();
    return `/api/events/stream${queryString ? `?${queryString}` : ''}`;
  }, [options?.eventTypes, options?.user, options?.questionId]);

  const connect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
    }

    const url = buildUrl();
    const client = new EventStreamClient(url);

    client.onStateChange(setConnectionState);

    client.on<ContractEvent>('event', (event) => {
      setEvents((prev) => {
        const updated = [event, ...prev];
        return updated.slice(0, maxEvents);
      });
    });

    client.on<string>('error', (errorMsg) => {
      setError(errorMsg);
    });

    client.connect();
    clientRef.current = client;
  }, [buildUrl]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    if (options?.autoConnect !== false) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, options?.autoConnect]);

  return {
    connectionState,
    events,
    error,
    connect,
    disconnect,
    clearEvents,
    isConnected: connectionState === 'connected',
  };
}

/**
 * Hook for fetching events with filtering
 */
export function useEvents(filter?: EventFilter) {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ count: number; offset: number; limit: number } | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filter?.eventTypes?.length) {
        params.set('eventTypes', filter.eventTypes.join(','));
      }
      if (filter?.fromBlock !== undefined) {
        params.set('fromBlock', filter.fromBlock.toString());
      }
      if (filter?.toBlock !== undefined) {
        params.set('toBlock', filter.toBlock.toString());
      }
      if (filter?.user) {
        params.set('user', filter.user);
      }
      if (filter?.questionId !== undefined) {
        params.set('questionId', filter.questionId.toString());
      }
      if (filter?.limit !== undefined) {
        params.set('limit', filter.limit.toString());
      }
      if (filter?.offset !== undefined) {
        params.set('offset', filter.offset.toString());
      }

      const queryString = params.toString();
      const response = await fetch(`/api/events${queryString ? `?${queryString}` : ''}`);
      const data: ApiResponse<ContractEvent[]> = await response.json();

      if (data.success && data.data) {
        setEvents(data.data);
        setMeta(data.meta || null);
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    meta,
    refetch: fetchEvents,
  };
}

/**
 * Hook for fetching event statistics
 */
export function useEventStats(refreshInterval?: number) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/events/stats');
      const data: ApiResponse<StatsResponse> = await response.json();

      if (data.success && data.data) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    if (refreshInterval) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchStats, refreshInterval]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Hook for fetching leaderboard data
 */
export function useLeaderboard(limit: number = 10, refreshInterval?: number) {
  const [leaderboard, setLeaderboard] = useState<SerializedLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/leaderboard?limit=${limit}`);
      const data: ApiResponse<SerializedLeaderboardEntry[]> = await response.json();

      if (data.success && data.data) {
        setLeaderboard(data.data);
      } else {
        setError(data.error || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();

    if (refreshInterval) {
      const interval = setInterval(fetchLeaderboard, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchLeaderboard, refreshInterval]);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
  };
}

/**
 * Hook for fetching player data
 */
export function usePlayer(address: string | null) {
  const [player, setPlayer] = useState<SerializedPlayerData | null>(null);
  const [recentEvents, setRecentEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayer = useCallback(async () => {
    if (!address) {
      setPlayer(null);
      setRecentEvents([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events/player/${address}`);
      const data: ApiResponse<{
        player: SerializedPlayerData;
        recentEvents: ContractEvent[];
      }> = await response.json();

      if (data.success && data.data) {
        setPlayer(data.data.player);
        setRecentEvents(data.data.recentEvents);
      } else {
        if (response.status === 404) {
          setPlayer(null);
          setRecentEvents([]);
        } else {
          setError(data.error || 'Failed to fetch player');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  return {
    player,
    recentEvents,
    loading,
    error,
    refetch: fetchPlayer,
  };
}

/**
 * Hook for real-time leaderboard with live updates
 */
export function useLiveLeaderboard(limit: number = 10) {
  const { leaderboard, loading, error, refetch } = useLeaderboard(limit, 30000);
  const { events: liveEvents, isConnected } = useEventStream({
    eventTypes: ['AnswerSubmitted', 'ScoreUpdated'],
  });

  // Trigger refetch when new relevant events come in
  useEffect(() => {
    if (liveEvents.length > 0) {
      const latestEvent = liveEvents[0];
      if (
        latestEvent.eventName === 'AnswerSubmitted' ||
        latestEvent.eventName === 'ScoreUpdated'
      ) {
        // Debounce refetch
        const timer = setTimeout(() => {
          refetch();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [liveEvents, refetch]);

  return {
    leaderboard,
    loading,
    error,
    isLive: isConnected,
    refetch,
  };
}

/**
 * Hook for user-specific event stream
 */
export function useUserEventStream(userAddress: string | null) {
  const { connectionState, events, error, connect, disconnect, isConnected } =
    useEventStream({
      user: userAddress || undefined,
      autoConnect: !!userAddress,
    });

  useEffect(() => {
    if (userAddress) {
      connect();
    } else {
      disconnect();
    }
  }, [userAddress, connect, disconnect]);

  return {
    connectionState,
    events,
    error,
    isConnected,
  };
}
