'use client';

import { useStatsStore } from '@/lib/store/stats-store';

export function StatsOverview() {
  const {
    totalGamesPlayed,
    totalWins,
    totalPoints,
    getWinPercentage,
    getAverageAccuracy,
    getAverageGuessesPerWin,
  } = useStatsStore();

  const stats = [
    {
      label: 'Games Played',
      value: totalGamesPlayed.toString(),
      color: 'text-blue-bright',
      icon: '🎮',
    },
    {
      label: 'Total Wins',
      value: totalWins.toString(),
      color: 'text-green-bright',
      icon: '🏆',
    },
    {
      label: 'Win Rate',
      value: `${getWinPercentage().toFixed(1)}%`,
      color: 'text-yellow-bright',
      icon: '📊',
    },
    {
      label: 'Total Points',
      value: totalPoints.toLocaleString(),
      color: 'text-orange-bright',
      icon: '💰',
    },
    {
      label: 'Avg Accuracy',
      value: totalWins > 0 ? `${getAverageAccuracy().toFixed(1)}%` : 'N/A',
      color: 'text-purple-bright',
      icon: '🎯',
    },
    {
      label: 'Avg Guesses',
      value: totalWins > 0 ? getAverageGuessesPerWin().toFixed(1) : 'N/A',
      color: 'text-pink-bright',
      icon: '🔢',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="panel-game-show p-6 text-center hover:transform hover:scale-105 transition-all"
        >
          <div className="text-4xl mb-2">{stat.icon}</div>
          <div className={`text-3xl font-bold font-mono mb-2 ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-sm text-muted uppercase">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}