export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  created_at: string;
}

export interface ItemMetadata {
  year?: number;
  material?: string;
  location?: string;
  size?: string;
  brand?: string;
  model?: string;
  condition?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface Item {
  id: string;
  category_id: string;
  name: string;
  brand?: string;
  price: number;
  currency: string;
  images: string[]; // Fallback URLs from public domain
  item_image_id?: string; // Direct reference to item_images table
  metadata: ItemMetadata;
  description?: string; // Made optional as it can be null in DB
  hint_1?: string;
  hint_2?: string;
  hint_3?: string;
  hint_4?: string;
  hint_5?: string;
  created_at: string;
}

export interface Guess {
  value: number;
  timestamp: string;
  accuracy: number; // Percentage off from actual price
  isWithinRange: boolean; // Within 5%
  isMissedTurn?: boolean; // True when timer runs out without guess
}

export interface GameSession {
  id: string;
  user_id?: string;
  item_id: string;
  guesses: Guess[];
  attempts: number;
  won: boolean;
  accuracy?: number; // Final accuracy if won
  completed_at?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  game_session_id: string;
  category_id?: string;
  accuracy: number;
  attempts: number;
  points: number;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  display_name?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon?: string;
  condition_type: 'accuracy' | 'speed' | 'streak' | 'category' | 'item_value' | 'wins' | 'category_wins' | 'item_value_wins' | 'attempts';
  condition_value: Record<string, any>;
  points: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  achievement?: Achievement;
  unlocked_at: string;
  game_session_id?: string;
}

export interface UserStats {
  user_id: string;
  total_games: number;
  games_won: number;
  total_points: number;
  total_accuracy: number;
  best_accuracy: number;
  current_streak: number;
  best_streak: number;
  last_played_at?: string;
  category_stats: Record<string, any>;
}

export interface GameStats {
  total_games: number;
  games_won: number;
  win_rate: number;
  average_accuracy: number;
  average_attempts: number;
  current_streak: number;
  best_streak: number;
  categories_played: Record<string, number>;
}

export type HintLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HintData {
  level: HintLevel;
  type: 'image' | 'text' | 'metadata';
  content: string;
  revealed: boolean;
}

export interface ScoreLabel {
  label: string;
  emoji: string;
  minAccuracy: number;
  maxAccuracy: number;
  maxAttempts?: number;
}

export const SCORE_LABELS: ScoreLabel[] = [
  { label: 'Price Whisperer', emoji: '🎯', minAccuracy: 99, maxAccuracy: 100 },
  { label: 'Market Ninja', emoji: '🥷', minAccuracy: 95, maxAccuracy: 100, maxAttempts: 3 },
  { label: 'Savvy Shopper', emoji: '🛍️', minAccuracy: 95, maxAccuracy: 100, maxAttempts: 6 },
  { label: 'Getting Warmer', emoji: '🔥', minAccuracy: 50, maxAccuracy: 95 },
  { label: 'Wildly Off', emoji: '🎪', minAccuracy: 0, maxAccuracy: 50 },
];

export const GAME_CONFIG = {
  MAX_ATTEMPTS: 6,
  ACCURACY_THRESHOLD: 5, // 5% for a win
  HINT_UNLOCK_AFTER_GUESS: true,
  CURRENCY_SYMBOL: '$',
  DEFAULT_CURRENCY: 'USD',
} as const;