import { Item, HintData, HintLevel } from '@/types/game';
import { getRandomMockItem } from '@/lib/mock-data';

/**
 * Get a random item for the game
 * Uses mock data for now, will use database later
 */
export async function getRandomItem(categoryId?: string): Promise<Item | null> {
  // For now, use mock data
  return getRandomMockItem(categoryId);
  
  // TODO: Replace with database call
  // return await getRandomItemFromDB(categoryId);
}

/**
 * Get available hints based on the current attempt number
 */
export function getAvailableHints(attempts: number): HintData[] {
  const hints: HintData[] = [
    {
      level: 1 as HintLevel,
      type: 'image',
      content: 'blurred_photo',
      revealed: true, // Always show first hint
    },
    {
      level: 2 as HintLevel,
      type: 'image',
      content: 'alternate_angle',
      revealed: attempts >= 2,
    },
    {
      level: 3 as HintLevel,
      type: 'metadata',
      content: 'basic_info',
      revealed: attempts >= 3,
    },
    {
      level: 4 as HintLevel,
      type: 'text',
      content: 'ai_clue',
      revealed: attempts >= 4,
    },
    {
      level: 5 as HintLevel,
      type: 'image',
      content: 'detailed_photo',
      revealed: attempts >= 5,
    },
    {
      level: 6 as HintLevel,
      type: 'text',
      content: 'direct_hint',
      revealed: attempts >= 6,
    },
  ];
  
  return hints;
}

/**
 * Get the current hint level based on attempts
 */
export function getCurrentHintLevel(attempts: number): HintLevel {
  return Math.min(attempts, 6) as HintLevel;
}

/**
 * Format hint content for display
 */
export function formatHintContent(hint: HintData, item: Item): string {
  switch (hint.content) {
    case 'basic_info':
      return `Location: ${item.metadata.location || 'Unknown'} • Year: ${item.metadata.year || 'Unknown'}`;
    
    case 'ai_clue':
      // Return the AI hint at the appropriate index
      return item.ai_hints[0] || 'No additional hints available';
    
    case 'direct_hint':
      // Give a very direct hint about the price range
      const price = item.price;
      const lowerBound = Math.floor(price * 0.8);
      const upperBound = Math.ceil(price * 1.2);
      return `The price is between ${formatPriceRange(lowerBound)} and ${formatPriceRange(upperBound)}`;
    
    default:
      return '';
  }
}

/**
 * Format price range for hints
 */
function formatPriceRange(value: number): string {
  if (value < 1000) {
    return `$${value}`;
  } else if (value < 1_000_000) {
    return `$${Math.floor(value / 1000)}K`;
  } else {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
}