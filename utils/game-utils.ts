import { GAME_CONFIG } from '@/types/game';

/**
 * Calculate the percentage difference between guess and actual price
 */
export function calculateAccuracy(guess: number, actual: number): number {
  if (actual === 0) return 0;
  return Math.abs((guess - actual) / actual) * 100;
}

/**
 * Check if the guess is within the winning threshold (default 5%)
 */
export function isWinningGuess(guess: number, actual: number): boolean {
  return calculateAccuracy(guess, actual) <= GAME_CONFIG.ACCURACY_THRESHOLD;
}

/**
 * Get feedback on how close the guess is
 */
export function getGuessFeedback(guess: number, actual: number): 'hot' | 'warm' | 'cold' {
  const accuracy = calculateAccuracy(guess, actual);
  
  if (accuracy <= 10) return 'hot';
  if (accuracy <= 25) return 'warm';
  return 'cold';
}

/**
 * Get directional feedback
 */
export function getDirectionalFeedback(guess: number, actual: number): 'higher' | 'lower' | 'correct' {
  if (isWinningGuess(guess, actual)) return 'correct';
  return guess < actual ? 'higher' : 'lower';
}

/**
 * Format a number as currency
 */
export function formatPrice(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Parse user input into a number, handling currency symbols and commas
 */
export function parsePrice(input: string): number | null {
  // Remove all non-numeric characters except decimal point
  const cleaned = input.replace(/[^0-9.]/g, '');
  
  // Handle empty string
  if (!cleaned) return null;
  
  // Parse to float
  const parsed = parseFloat(cleaned);
  
  // Check if valid number
  return isNaN(parsed) ? null : parsed;
}

/**
 * Generate a unique game session ID
 */
export function generateSessionId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}