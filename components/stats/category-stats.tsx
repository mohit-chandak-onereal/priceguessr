'use client';

import { useStatsStore } from '@/lib/store/stats-store';
import { mockCategories } from '@/lib/mock-data';

export function CategoryStats() {
  const { categoryStats, getCategoryWinRate, getBestCategory, getWorstCategory } = useStatsStore();
  
  const bestCategory = getBestCategory();
  const worstCategory = getWorstCategory();

  return (
    <div className="space-y-6">
      {/* Best & Worst Categories */}
      {(bestCategory || worstCategory) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {bestCategory && (
            <div className="panel-game-show p-6 text-center bg-green-bright/10 border-green-bright">
              <h3 className="text-lg font-bold text-green-bright mb-2">BEST CATEGORY</h3>
              <div className="text-2xl mb-1">
                {mockCategories.find(c => c.id === bestCategory.categoryId)?.icon}
              </div>
              <div className="text-xl font-bold text-white">
                {mockCategories.find(c => c.id === bestCategory.categoryId)?.name}
              </div>
              <div className="text-lg text-green-bright">
                {bestCategory.winRate.toFixed(1)}% Win Rate
              </div>
            </div>
          )}
          
          {worstCategory && (
            <div className="panel-game-show p-6 text-center bg-red-bright/10 border-red-bright">
              <h3 className="text-lg font-bold text-red-bright mb-2">NEEDS WORK</h3>
              <div className="text-2xl mb-1">
                {mockCategories.find(c => c.id === worstCategory.categoryId)?.icon}
              </div>
              <div className="text-xl font-bold text-white">
                {mockCategories.find(c => c.id === worstCategory.categoryId)?.name}
              </div>
              <div className="text-lg text-red-bright">
                {worstCategory.winRate.toFixed(1)}% Win Rate
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCategories.map((category) => {
          const stats = categoryStats[category.id];
          const winRate = getCategoryWinRate(category.id);
          
          if (!stats) {
            return (
              <div
                key={category.id}
                className="panel-game-show p-6 opacity-50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                </div>
                <p className="text-center text-muted">No games played yet</p>
              </div>
            );
          }
          
          return (
            <div
              key={category.id}
              className="panel-game-show p-6 hover:transform hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Games:</span>
                  <span className="font-bold text-white">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Wins:</span>
                  <span className="font-bold text-green-bright">{stats.wins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Win Rate:</span>
                  <span className={`font-bold ${winRate >= 50 ? 'text-green-bright' : 'text-red-bright'}`}>
                    {winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Best Accuracy:</span>
                  <span className="font-bold text-yellow-bright">
                    {stats.bestAccuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Points:</span>
                  <span className="font-bold text-orange-bright">
                    {stats.totalPoints.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Win rate bar */}
              <div className="mt-4">
                <div className="h-2 bg-stage-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      winRate >= 50 ? 'bg-green-bright' : 'bg-red-bright'
                    }`}
                    style={{ width: `${winRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}