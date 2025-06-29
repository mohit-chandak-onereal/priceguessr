export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: AchievementStats) => boolean;
  progress?: (stats: AchievementStats) => number; // 0-100
}

export interface AchievementStats {
  totalGamesPlayed: number;
  totalGamesWon: number;
  perfectGuesses: number; // 100% accuracy
  fastWins: number; // Won in 1-2 attempts
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
  highScore: number;
  categoriesPlayed: Set<string>;
  itemsGuessed: Set<string>;
  totalAttempts: number;
  averageAccuracy: number;
}

export const achievements: Achievement[] = [
  // Beginner achievements
  {
    id: 'first-win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🎯',
    condition: (stats) => stats.totalGamesWon >= 1,
  },
  {
    id: 'perfect-guess',
    name: 'Bulls Eye',
    description: 'Guess the exact price',
    icon: '🎯',
    condition: (stats) => stats.perfectGuesses >= 1,
  },
  {
    id: 'quick-win',
    name: 'Lightning Fast',
    description: 'Win in 2 attempts or less',
    icon: '⚡',
    condition: (stats) => stats.fastWins >= 1,
  },
  
  // Streak achievements
  {
    id: 'streak-3',
    name: 'On Fire',
    description: 'Win 3 games in a row',
    icon: '🔥',
    condition: (stats) => stats.bestStreak >= 3,
    progress: (stats) => (stats.currentStreak / 3) * 100,
  },
  {
    id: 'streak-5',
    name: 'Unstoppable',
    description: 'Win 5 games in a row',
    icon: '🔥',
    condition: (stats) => stats.bestStreak >= 5,
    progress: (stats) => (stats.currentStreak / 5) * 100,
  },
  {
    id: 'streak-10',
    name: 'Price Prophet',
    description: 'Win 10 games in a row',
    icon: '👑',
    condition: (stats) => stats.bestStreak >= 10,
    progress: (stats) => (stats.currentStreak / 10) * 100,
  },
  
  // Games played achievements
  {
    id: 'games-10',
    name: 'Regular Player',
    description: 'Play 10 games',
    icon: '🎮',
    condition: (stats) => stats.totalGamesPlayed >= 10,
    progress: (stats) => (stats.totalGamesPlayed / 10) * 100,
  },
  {
    id: 'games-50',
    name: 'Dedicated Guesser',
    description: 'Play 50 games',
    icon: '🎮',
    condition: (stats) => stats.totalGamesPlayed >= 50,
    progress: (stats) => (stats.totalGamesPlayed / 50) * 100,
  },
  {
    id: 'games-100',
    name: 'Price Master',
    description: 'Play 100 games',
    icon: '🏆',
    condition: (stats) => stats.totalGamesPlayed >= 100,
    progress: (stats) => (stats.totalGamesPlayed / 100) * 100,
  },
  
  // Score achievements
  {
    id: 'score-1000',
    name: 'Thousand Club',
    description: 'Score 1,000 points in a single game',
    icon: '💰',
    condition: (stats) => stats.highScore >= 1000,
  },
  {
    id: 'score-5000',
    name: 'High Roller',
    description: 'Score 5,000 points in a single game',
    icon: '💎',
    condition: (stats) => stats.highScore >= 5000,
  },
  {
    id: 'total-score-10000',
    name: 'Point Collector',
    description: 'Earn 10,000 total points',
    icon: '🏆',
    condition: (stats) => stats.totalScore >= 10000,
    progress: (stats) => (stats.totalScore / 10000) * 100,
  },
  
  // Category achievements
  {
    id: 'category-explorer',
    name: 'Category Explorer',
    description: 'Play in 5 different categories',
    icon: '🌟',
    condition: (stats) => stats.categoriesPlayed.size >= 5,
    progress: (stats) => (stats.categoriesPlayed.size / 5) * 100,
  },
  {
    id: 'category-master',
    name: 'Category Master',
    description: 'Play in all categories',
    icon: '👑',
    condition: (stats) => stats.categoriesPlayed.size >= 10,
    progress: (stats) => (stats.categoriesPlayed.size / 10) * 100,
  },
  
  // Special achievements
  {
    id: 'accuracy-expert',
    name: 'Accuracy Expert',
    description: 'Maintain 90%+ average accuracy over 10 games',
    icon: '🎯',
    condition: (stats) => stats.totalGamesWon >= 10 && stats.averageAccuracy >= 90,
  },
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Win on your 6th and final attempt',
    icon: '💪',
    condition: (stats) => false, // This needs to be tracked separately
  },
  {
    id: 'variety-player',
    name: 'Variety Player',
    description: 'Guess 20 different items correctly',
    icon: '🎨',
    condition: (stats) => stats.itemsGuessed.size >= 20,
    progress: (stats) => (stats.itemsGuessed.size / 20) * 100,
  },
];

export function getUnlockedAchievements(stats: AchievementStats): Achievement[] {
  return achievements.filter(achievement => achievement.condition(stats));
}

export function getAchievementProgress(achievement: Achievement, stats: AchievementStats): number {
  if (achievement.progress) {
    return Math.min(100, achievement.progress(stats));
  }
  return achievement.condition(stats) ? 100 : 0;
}

export function getNextAchievements(stats: AchievementStats, limit = 3): Achievement[] {
  return achievements
    .filter(achievement => !achievement.condition(stats))
    .sort((a, b) => {
      const progressA = getAchievementProgress(a, stats);
      const progressB = getAchievementProgress(b, stats);
      return progressB - progressA; // Highest progress first
    })
    .slice(0, limit);
}