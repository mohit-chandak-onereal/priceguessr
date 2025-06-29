'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { useCategories } from '@/hooks/use-categories';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const { categories } = useCategories();
  
  const { entries, isLoading, error } = useLeaderboard({
    category: selectedCategory || undefined,
    timeframe,
    limit: 100,
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="mb-3 sm:mb-4">
            <span className="text-retro-70s text-retro-70s-medium star-decoration">GLOBAL LEADERBOARD</span>
          </h1>
          <p className="text-base sm:text-xl text-yellow-bright px-4">
            See how you rank against the world&apos;s best price guessers!
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-stage-dark border-2 border-yellow-bright rounded-lg text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Timeframe Filter */}
          <div className="flex gap-2">
            {(['all', 'month', 'week', 'today'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-yellow-bright text-stage-dark'
                    : 'bg-stage-dark text-white border-2 border-border hover:border-yellow-bright'
                }`}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="panel-game-show overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce">
                🏆
              </div>
              <div className="text-2xl text-yellow-bright">
                <span className="inline-block">Loading scores</span>
                <span className="inline-flex ml-1">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-xl text-red-bright">Failed to load leaderboard</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-xl text-muted">No scores yet. Be the first!</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stage-dark/50 text-yellow-bright">
                    <th className="px-4 py-3 text-left">Rank</th>
                    <th className="px-4 py-3 text-left">Player</th>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-center">Accuracy</th>
                    <th className="px-4 py-3 text-center">Attempts</th>
                    <th className="px-4 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`border-b border-border/50 hover:bg-stage-dark/30 transition-colors ${
                        index === 0 ? 'bg-yellow-bright/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">#{index + 1}</span>
                          {index === 0 && <span className="text-xl">🏆</span>}
                          {index === 1 && <span className="text-xl">🥈</span>}
                          {index === 2 && <span className="text-xl">🥉</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{entry.username}</div>
                      </td>
                      <td className="px-4 py-3 text-muted">{entry.item_name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-green-bright font-bold">
                          {entry.accuracy.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-white">{entry.attempts}/6</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xl font-bold text-yellow-bright">
                          ${entry.item_price.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back to Play */}
        <div className="text-center mt-8 space-y-4">
          <Link
            href="/play"
            className="btn-game-show text-white inline-block"
          >
            PLAY NOW
          </Link>
          <div>
            <Link
              href="/"
              className="text-muted hover:text-yellow-bright transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}