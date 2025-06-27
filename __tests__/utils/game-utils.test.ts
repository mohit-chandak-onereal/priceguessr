import {
  calculateAccuracy,
  isWinningGuess,
  getGuessFeedback,
  getDirectionalFeedback,
  formatPrice,
  parsePrice,
  generateSessionId,
} from '@/utils/game-utils';

describe('Game Utilities', () => {
  describe('calculateAccuracy', () => {
    it('should calculate accuracy correctly', () => {
      expect(calculateAccuracy(100, 100)).toBe(0); // Exact match
      expect(calculateAccuracy(95, 100)).toBe(5); // 5% off
      expect(calculateAccuracy(105, 100)).toBe(5); // 5% off (over)
      expect(calculateAccuracy(50, 100)).toBe(50); // 50% off
      expect(calculateAccuracy(150, 100)).toBe(50); // 50% off (over)
    });

    it('should handle zero actual price', () => {
      expect(calculateAccuracy(100, 0)).toBe(0);
    });
  });

  describe('isWinningGuess', () => {
    it('should return true for guesses within 5%', () => {
      expect(isWinningGuess(100, 100)).toBe(true); // Exact
      expect(isWinningGuess(95, 100)).toBe(true); // 5% under
      expect(isWinningGuess(105, 100)).toBe(true); // 5% over
      expect(isWinningGuess(96, 100)).toBe(true); // 4% under
      expect(isWinningGuess(104, 100)).toBe(true); // 4% over
    });

    it('should return false for guesses outside 5%', () => {
      expect(isWinningGuess(94, 100)).toBe(false); // 6% under
      expect(isWinningGuess(106, 100)).toBe(false); // 6% over
      expect(isWinningGuess(50, 100)).toBe(false); // 50% under
      expect(isWinningGuess(200, 100)).toBe(false); // 100% over
    });
  });

  describe('getGuessFeedback', () => {
    it('should return correct feedback based on accuracy', () => {
      expect(getGuessFeedback(100, 100)).toBe('hot'); // 0% off
      expect(getGuessFeedback(95, 100)).toBe('hot'); // 5% off
      expect(getGuessFeedback(90, 100)).toBe('hot'); // 10% off
      expect(getGuessFeedback(85, 100)).toBe('warm'); // 15% off
      expect(getGuessFeedback(75, 100)).toBe('warm'); // 25% off
      expect(getGuessFeedback(50, 100)).toBe('cold'); // 50% off
    });
  });

  describe('getDirectionalFeedback', () => {
    it('should return correct direction', () => {
      expect(getDirectionalFeedback(100, 100)).toBe('correct');
      expect(getDirectionalFeedback(95, 100)).toBe('correct'); // Within 5%
      expect(getDirectionalFeedback(105, 100)).toBe('correct'); // Within 5%
      expect(getDirectionalFeedback(50, 100)).toBe('higher');
      expect(getDirectionalFeedback(150, 100)).toBe('lower');
    });
  });

  describe('formatPrice', () => {
    it('should format prices correctly', () => {
      expect(formatPrice(100)).toBe('$100');
      expect(formatPrice(1000)).toBe('$1,000');
      expect(formatPrice(1000000)).toBe('$1,000,000');
      expect(formatPrice(99.99)).toBe('$100'); // Rounds
      expect(formatPrice(99.49)).toBe('$99'); // Rounds down
    });

    it('should handle different currencies', () => {
      expect(formatPrice(100, 'EUR')).toBe('€100');
      expect(formatPrice(100, 'GBP')).toBe('£100');
    });
  });

  describe('parsePrice', () => {
    it('should parse valid price inputs', () => {
      expect(parsePrice('100')).toBe(100);
      expect(parsePrice('$100')).toBe(100);
      expect(parsePrice('1,000')).toBe(1000);
      expect(parsePrice('$1,000')).toBe(1000);
      expect(parsePrice('1000.50')).toBe(1000.5);
      expect(parsePrice('$1,000.50')).toBe(1000.5);
    });

    it('should return null for invalid inputs', () => {
      expect(parsePrice('')).toBe(null);
      expect(parsePrice('abc')).toBe(null);
      expect(parsePrice('$')).toBe(null);
      expect(parsePrice(',')).toBe(null);
    });

    it('should handle edge cases', () => {
      expect(parsePrice('0')).toBe(0);
      expect(parsePrice('.50')).toBe(0.5);
      expect(parsePrice('00100')).toBe(100); // Leading zeros
    });
  });

  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      
      expect(id1).toMatch(/^game_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^game_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should include timestamp', () => {
      const before = Date.now();
      const id = generateSessionId();
      const after = Date.now();
      
      const timestamp = parseInt(id.split('_')[1]);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });
});