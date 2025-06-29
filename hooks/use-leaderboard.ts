'use client';

import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  id: string;
  username: string;
  user_id?: string;
  game_session_id?: string;
  accuracy: number;
  attempts: number;
  item_name: string;
  item_price: number;
  created_at: string;
}

interface UseLeaderboardOptions {
  category?: string;
  limit?: number;
  timeframe?: 'today' | 'week' | 'month' | 'all';
}

export function useLeaderboard(options: UseLeaderboardOptions = {}) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.timeframe) params.append('timeframe', options.timeframe);

      const response = await fetch(`/api/leaderboard?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const { data } = await response.json();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [options.category, options.limit, options.timeframe]);

  const submitScore = async (entry: Omit<LeaderboardEntry, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      if (!response.ok) throw new Error('Failed to submit score');

      // Refresh leaderboard
      await fetchLeaderboard();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to submit score');
    }
  };

  return {
    entries,
    isLoading,
    error,
    refresh: fetchLeaderboard,
    submitScore,
  };
}