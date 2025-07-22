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
export function getGuessFeedback(guess: number, actual: number): 'burning' | 'hot' | 'warm' | 'cold' | 'ice-cold' {
  const accuracy = calculateAccuracy(guess, actual);
  
  // Now accuracy is 0-100 where 100 is perfect
  if (accuracy >= 95) return 'burning';  // 95%+ accuracy (within 5%)
  if (accuracy >= 85) return 'hot';      // 85-95% accuracy (within 15%)
  if (accuracy >= 70) return 'warm';     // 70-85% accuracy (within 30%)
  if (accuracy >= 50) return 'cold';     // 50-70% accuracy (within 50%)
  return 'ice-cold'; // Less than 50% accuracy
}

/**
 * Get sound pitch based on accuracy (closer = higher pitch)
 */
export function getAccuracyPitch(accuracy: number): number {
  // Map accuracy (0-100) to pitch multiplier (0.5-2.0)
  return 0.5 + (accuracy / 100) * 1.5;
}

/**
 * Get stereo position based on direction (-1 to 1, -1 = left, 1 = right)
 */
export function getDirectionalPan(guess: number, actual: number): number {
  if (isWinningGuess(guess, actual)) return 0; // Center
  return guess < actual ? -0.5 : 0.5; // Left for too low, right for too high
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