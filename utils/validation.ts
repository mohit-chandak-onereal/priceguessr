import { parsePrice } from './game-utils';

export interface ValidationResult {
  valid: boolean;
  value?: number;
  error?: string;
}

/**
 * Validate a price guess input
 */
export function validateGuess(input: string): ValidationResult {
  // Check for empty input
  if (!input || !input.trim()) {
    return {
      valid: false,
      error: 'Please enter a price',
    };
  }
  
  // Try to parse the price
  const parsed = parsePrice(input);
  
  if (parsed === null) {
    return {
      valid: false,
      error: 'Please enter a valid number',
    };
  }
  
  // Check if the original input had a negative sign
  if (input.trim().startsWith('-')) {
    return {
      valid: false,
      error: 'Price must be greater than $0',
    };
  }
  
  // Check for scientific notation
  if (input.toLowerCase().includes('e')) {
    return {
      valid: false,
      error: 'Please enter a standard number format',
    };
  }
  
  // Check for negative or zero
  if (parsed <= 0) {
    return {
      valid: false,
      error: 'Price must be greater than $0',
    };
  }
  
  // Check for unreasonably high prices
  if (parsed > 1_000_000_000) {
    return {
      valid: false,
      error: 'Price seems too high. Please check your input.',
    };
  }
  
  // Check for too many decimal places (cents)
  const decimalPlaces = (input.split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return {
      valid: false,
      error: 'Please enter a valid price (max 2 decimal places)',
    };
  }
  
  return {
    valid: true,
    value: parsed,
  };
}

/**
 * Validate category selection
 */
export function validateCategory(categoryId: string | undefined): boolean {
  return typeof categoryId === 'string' && categoryId.length > 0;
}

/**
 * Format input as user types (for display purposes)
 */
export function formatPriceInput(input: string): string {
  // Remove all non-numeric characters except decimal
  const cleaned = input.replace(/[^0-9.]/g, '');
  
  // Prevent multiple decimal points
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit decimal places to 2
  if (parts.length === 2 && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return cleaned;
}