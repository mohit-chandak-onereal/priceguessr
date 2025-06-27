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
  [key: string]: string | number | undefined;
}

export interface Item {
  id: string;
  category_id: string;
  name: string;
  brand?: string;
  price: number;
  currency: string;
  images: string[];
  metadata: ItemMetadata;
  ai_hints: string[];
  created_at: string;
}

export interface Guess {
  value: number;
  timestamp: string;
  accuracy: number; // Percentage off from actual price
  isWithinRange: boolean; // Within 5%
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

export interface DailyChallenge {
  date: string;
  item_id: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  date: string;
  accuracy: number;
  attempts: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
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