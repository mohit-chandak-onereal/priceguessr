'use client';

import { useStatsStore } from '@/lib/store/stats-store';

export function AchievementsList() {
  const { achievements } = useStatsStore();
  
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="panel-game-show p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-yellow-bright">
            ACHIEVEMENT PROGRESS
          </h3>
          <span className="text-2xl font-bold text-white">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        <div className="h-4 bg-stage-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-bright to-orange-bright transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        {unlockedCount === totalCount && (
          <p className="text-center text-green-bright font-bold mt-4 animate-pulse">
            🎉 ALL ACHIEVEMENTS UNLOCKED! 🎉
          </p>
        )}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          
          return (
            <div
              key={achievement.id}
              className={`
                panel-game-show p-6 transition-all
                ${isUnlocked 
                  ? 'hover:transform hover:scale-105' 
                  : 'opacity-50 grayscale'
                }
              `}
            >
              <div className="text-center">
                <div className={`text-5xl mb-3 ${!isUnlocked && 'filter blur-sm'}`}>
                  {achievement.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${
                  isUnlocked ? 'text-yellow-bright' : 'text-muted'
                }`}>
                  {achievement.name}
                </h3>
                <p className="text-sm text-muted mb-3">
                  {achievement.description}
                </p>
                {isUnlocked && (
                  <div className="text-xs text-green-bright">
                    ✓ Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
                {!isUnlocked && (
                  <div className="text-xs text-muted/50">
                    🔒 Locked
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}