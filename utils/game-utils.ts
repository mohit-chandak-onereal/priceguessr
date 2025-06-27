import { GAME_CONFIG } from '@/types/game';

/**
 * Calculate the accuracy percentage (how close the guess is, not how far off)
 */
export function calculateAccuracy(guess: number, actual: number): number {
  if (actual === 0) return 0;
  const percentageOff = Math.abs((guess - actual) / actual) * 100;
  // Return accuracy as percentage (100% = perfect, 0% = very far off)
  return Math.max(0, 100 - percentageOff);
}

/**
 * Check if the guess is within the winning threshold (default 5%)
 */
export function isWinningGuess(guess: number, actual: number): boolean {
  // Now accuracy is a percentage where 100% is perfect, so we need 95% or higher to win
  return calculateAccuracy(guess, actual) >= (100 - GAME_CONFIG.ACCURACY_THRESHOLD);
}

/**
 * Get feedback on how close the guess is
 */
export function getGuessFeedback(guess: number, actual: number): 'hot' | 'warm' | 'cold' {
  const accuracy = calculateAccuracy(guess, actual);
  
  // Now accuracy is 0-100 where 100 is perfect
  if (accuracy >= 90) return 'hot';  // 90%+ accuracy
  if (accuracy >= 75) return 'warm'; // 75-90% accuracy
  return 'cold'; // Less than 75% accuracy
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