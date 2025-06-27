import { ScoreLabel, SCORE_LABELS } from '@/types/game';

/**
 * Determine the score label based on game performance
 */
export function getScoreLabel(
  won: boolean,
  attempts: number,
  accuracy: number
): ScoreLabel {
  // If lost, determine based on how far off they were
  if (!won) {
    if (accuracy <= 50) {
      return SCORE_LABELS.find(label => label.label === 'Getting Warmer')!;
    }
    return SCORE_LABELS.find(label => label.label === 'Wildly Off')!;
  }
  
  // If won, check for perfect accuracy first
  if (accuracy >= 99 && accuracy <= 101) {
    return SCORE_LABELS.find(label => label.label === 'Price Whisperer')!;
  }
  
  // Then check attempts for other winning labels
  if (attempts <= 3) {
    return SCORE_LABELS.find(label => label.label === 'Market Ninja')!;
  }
  
  // Default winning label
  return SCORE_LABELS.find(label => label.label === 'Savvy Shopper')!;
}

/**
 * Generate a shareable result string (like Wordle)
 */
export function generateShareText(
  itemName: string,
  won: boolean,
  attempts: number,
  accuracy: number,
  scoreLabel: ScoreLabel
): string {
  const squares = generateGuessSquares(attempts, won);
  const status = won ? `Won in ${attempts}/6` : 'Lost';
  
  return `PriceGuessr 🎮\n${itemName}\n${status} ${scoreLabel.emoji}\nAccuracy: ${accuracy.toFixed(1)}%\n\n${squares}\n\nhttps://priceguessr.vercel.app`;
}

/**
 * Generate visual squares showing guess progression
 */
function generateGuessSquares(attempts: number, won: boolean): string {
  const maxAttempts = 6;
  let squares = '';
  
  for (let i = 1; i <= maxAttempts; i++) {
    if (i < attempts) {
      squares += '🟥'; // Wrong guess
    } else if (i === attempts && won) {
      squares += '🟩'; // Winning guess
    } else if (i === attempts && !won) {
      squares += '🟥'; // Final wrong guess
    } else {
      squares += '⬜'; // Unused attempt
    }
    
    if (i % 3 === 0 && i < maxAttempts) {
      squares += '\n'; // New line every 3 squares
    }
  }
  
  return squares;
}

/**
 * Calculate points based on performance (for future leaderboard)
 */
export function calculatePoints(
  won: boolean,
  attempts: number,
  accuracy: number
): number {
  if (!won) return 0;
  
  // Base points for winning
  let points = 1000;
  
  // Bonus for fewer attempts (200 points per attempt saved)
  points += (6 - attempts) * 200;
  
  // Bonus for accuracy (up to 500 points for perfect guess)
  const accuracyBonus = Math.max(0, 500 - (accuracy * 100));
  points += Math.floor(accuracyBonus);
  
  return points;
}