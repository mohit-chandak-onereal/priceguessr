'use client';

import { useGameStore } from '@/lib/store/game-store';

export function ScoreDisplay() {
  const { currentScore, highScore, currentStreak, bestStreak } = useGameStore();

  return (
    <div className="panel-game-show p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
        {/* Current Score */}
        <div>
          <div className="text-xs text-muted uppercase mb-1">Score</div>
          <div className="text-xl sm:text-2xl font-bold text-yellow-bright font-mono">
            {currentScore.toLocaleString()}
          </div>
        </div>

        {/* High Score */}
        <div>
          <div className="text-xs text-muted uppercase mb-1">High Score</div>
          <div className="text-xl sm:text-2xl font-bold text-green-bright font-mono">
            {highScore.toLocaleString()}
          </div>
        </div>

        {/* Current Streak */}
        <div>
          <div className="text-xs text-muted uppercase mb-1">Streak</div>
          <div className="text-lg sm:text-xl font-bold text-orange-bright flex items-center justify-center gap-1">
            <span>{currentStreak}</span>
            {currentStreak > 0 && <span className="text-sm">🔥</span>}
          </div>
        </div>

        {/* Best Streak */}
        <div>
          <div className="text-xs text-muted uppercase mb-1">Best</div>
          <div className="text-lg sm:text-xl font-bold text-purple-bright flex items-center justify-center gap-1">
            <span>{bestStreak}</span>
            {bestStreak >= 5 && <span className="text-sm">⭐</span>}
          </div>
        </div>
      </div>

      {/* Streak encouragement */}
      {currentStreak >= 3 && currentStreak < bestStreak && (
        <div className="mt-3 text-center">
          <p className="text-xs text-yellow-bright animate-pulse">
            {bestStreak - currentStreak} more to beat your best!
          </p>
        </div>
      )}
      
      {currentStreak >= bestStreak && currentStreak > 0 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-green-bright font-bold animate-pulse">
            NEW BEST STREAK! 🎉
          </p>
        </div>
      )}
    </div>
  );
}