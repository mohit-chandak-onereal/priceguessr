import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CategoryStats {
  gamesPlayed: number;
  wins: number;
  totalAccuracy: number;
  totalGuesses: number;
  bestAccuracy: number;
  totalPoints: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface StatsState {
  // Overall stats
  totalGamesPlayed: number;
  totalWins: number;
  totalPoints: number;
  totalGuesses: number;
  totalAccuracy: number;
  totalTimePlayed: number; // in seconds
  
  // Category-specific stats
  categoryStats: Record<string, CategoryStats>;
  
  // Achievements
  achievements: Achievement[];
  
  // Actions
  recordGameResult: (
    categoryId: string,
    won: boolean,
    accuracy: number,
    guesses: number,
    points: number,
    timeTaken: number
  ) => void;
  checkAchievements: () => Achievement[];
  getWinPercentage: () => number;
  getAverageAccuracy: () => number;
  getAverageGuessesPerWin: () => number;
  getCategoryWinRate: (categoryId: string) => number;
  getBestCategory: () => { categoryId: string; winRate: number } | null;
  getWorstCategory: () => { categoryId: string; winRate: number } | null;
}

// Define achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
  },
  {
    id: 'perfect-guess',
    name: 'Bulls Eye',
    description: 'Guess with 100% accuracy',
    icon: '🎯',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Win a game in under 30 seconds',
    icon: '⚡',
  },
  {
    id: 'streak-5',
    name: 'On Fire',
    description: 'Win 5 games in a row',
    icon: '🔥',
  },
  {
    id: 'streak-10',
    name: 'Unstoppable',
    description: 'Win 10 games in a row',
    icon: '💫',
  },
  {
    id: 'category-master',
    name: 'Category Master',
    description: 'Win 10 games in a single category',
    icon: '👑',
  },
  {
    id: 'high-roller',
    name: 'High Roller',
    description: 'Correctly guess an item over $100,000',
    icon: '💎',
  },
  {
    id: 'veteran',
    name: 'Veteran Player',
    description: 'Play 100 games',
    icon: '🎖️',
  },
  {
    id: 'points-10k',
    name: 'Points Collector',
    description: 'Earn 10,000 total points',
    icon: '💰',
  },
  {
    id: 'accuracy-king',
    name: 'Accuracy King',
    description: 'Maintain 90%+ average accuracy over 20 games',
    icon: '👁️',
  },
];

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      // Initial state
      totalGamesPlayed: 0,
      totalWins: 0,
      totalPoints: 0,
      totalGuesses: 0,
      totalAccuracy: 0,
      totalTimePlayed: 0,
      categoryStats: {},
      achievements: ACHIEVEMENTS,

      // Record game result
      recordGameResult: (categoryId, won, accuracy, guesses, points, timeTaken) => {
        const state = get();
        
        // Update overall stats
        const newTotalGames = state.totalGamesPlayed + 1;
        const newTotalWins = state.totalWins + (won ? 1 : 0);
        const newTotalPoints = state.totalPoints + points;
        const newTotalGuesses = state.totalGuesses + guesses;
        const newTotalAccuracy = state.totalAccuracy + accuracy;
        const newTotalTime = state.totalTimePlayed + timeTaken;
        
        // Update category stats
        const currentCategoryStats = state.categoryStats[categoryId] || {
          gamesPlayed: 0,
          wins: 0,
          totalAccuracy: 0,
          totalGuesses: 0,
          bestAccuracy: 0,
          totalPoints: 0,
        };
        
        const updatedCategoryStats = {
          gamesPlayed: currentCategoryStats.gamesPlayed + 1,
          wins: currentCategoryStats.wins + (won ? 1 : 0),
          totalAccuracy: currentCategoryStats.totalAccuracy + accuracy,
          totalGuesses: currentCategoryStats.totalGuesses + guesses,
          bestAccuracy: Math.max(currentCategoryStats.bestAccuracy, accuracy),
          totalPoints: currentCategoryStats.totalPoints + points,
        };
        
        set({
          totalGamesPlayed: newTotalGames,
          totalWins: newTotalWins,
          totalPoints: newTotalPoints,
          totalGuesses: newTotalGuesses,
          totalAccuracy: newTotalAccuracy,
          totalTimePlayed: newTotalTime,
          categoryStats: {
            ...state.categoryStats,
            [categoryId]: updatedCategoryStats,
          },
        });
        
        // Check for new achievements
        get().checkAchievements();
      },

      // Check and unlock achievements
      checkAchievements: () => {
        const state = get();
        const newlyUnlocked: Achievement[] = [];
        
        state.achievements.forEach((achievement) => {
          if (!achievement.unlockedAt) {
            let shouldUnlock = false;
            
            switch (achievement.id) {
              case 'first-win':
                shouldUnlock = state.totalWins >= 1;
                break;
              case 'veteran':
                shouldUnlock = state.totalGamesPlayed >= 100;
                break;
              case 'points-10k':
                shouldUnlock = state.totalPoints >= 10000;
                break;
              case 'accuracy-king':
                shouldUnlock = state.totalGamesPlayed >= 20 && 
                  state.getAverageAccuracy() >= 90;
                break;
              // Add more achievement checks as needed
            }
            
            if (shouldUnlock) {
              achievement.unlockedAt = new Date().toISOString();
              newlyUnlocked.push(achievement);
            }
          }
        });
        
        if (newlyUnlocked.length > 0) {
          set({ achievements: [...state.achievements] });
        }
        
        return newlyUnlocked;
      },

      // Computed getters
      getWinPercentage: () => {
        const state = get();
        if (state.totalGamesPlayed === 0) return 0;
        return (state.totalWins / state.totalGamesPlayed) * 100;
      },

      getAverageAccuracy: () => {
        const state = get();
        if (state.totalWins === 0) return 0;
        return state.totalAccuracy / state.totalWins;
      },

      getAverageGuessesPerWin: () => {
        const state = get();
        if (state.totalWins === 0) return 0;
        // Only count guesses from wins
        let totalWinGuesses = 0;
        Object.values(state.categoryStats).forEach(stats => {
          if (stats.wins > 0) {
            totalWinGuesses += stats.totalGuesses;
          }
        });
        return totalWinGuesses / state.totalWins;
      },

      getCategoryWinRate: (categoryId) => {
        const state = get();
        const stats = state.categoryStats[categoryId];
        if (!stats || stats.gamesPlayed === 0) return 0;
        return (stats.wins / stats.gamesPlayed) * 100;
      },

      getBestCategory: () => {
        const state = get();
        let best: { categoryId: string; winRate: number } | null = null;
        
        Object.entries(state.categoryStats).forEach(([categoryId, stats]) => {
          if (stats.gamesPlayed >= 3) { // Minimum games for consideration
            const winRate = (stats.wins / stats.gamesPlayed) * 100;
            if (!best || winRate > best.winRate) {
              best = { categoryId, winRate };
            }
          }
        });
        
        return best;
      },

      getWorstCategory: () => {
        const state = get();
        let worst: { categoryId: string; winRate: number } | null = null;
        
        Object.entries(state.categoryStats).forEach(([categoryId, stats]) => {
          if (stats.gamesPlayed >= 3) { // Minimum games for consideration
            const winRate = (stats.wins / stats.gamesPlayed) * 100;
            if (!worst || winRate < worst.winRate) {
              worst = { categoryId, winRate };
            }
          }
        });
        
        return worst;
      },
    }),
    {
      name: 'priceguessr-stats',
    }
  )
);