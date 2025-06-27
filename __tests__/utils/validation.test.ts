import {
  validateGuess,
  validateCategory,
  formatPriceInput,
} from '@/utils/validation';

describe('Validation Utilities', () => {
  describe('validateGuess', () => {
    describe('valid inputs', () => {
      it('should validate correct price inputs', () => {
        const result1 = validateGuess('100');
        expect(result1.valid).toBe(true);
        expect(result1.value).toBe(100);
        expect(result1.error).toBeUndefined();

        const result2 = validateGuess('1000.50');
        expect(result2.valid).toBe(true);
        expect(result2.value).toBe(1000.50);

        const result3 = validateGuess('$1,234.56');
        expect(result3.valid).toBe(true);
        expect(result3.value).toBe(1234.56);
      });

      it('should handle edge case valid inputs', () => {
        const result1 = validateGuess('0.01');
        expect(result1.valid).toBe(true);
        expect(result1.value).toBe(0.01);

        const result2 = validateGuess('999999999');
        expect(result2.valid).toBe(true);
        expect(result2.value).toBe(999999999);
      });
    });

    describe('invalid inputs', () => {
      it('should reject empty input', () => {
        const result1 = validateGuess('');
        expect(result1.valid).toBe(false);
        expect(result1.error).toBe('Please enter a price');

        const result2 = validateGuess('   ');
        expect(result2.valid).toBe(false);
        expect(result2.error).toBe('Please enter a price');
      });

      it('should reject non-numeric input', () => {
        const result1 = validateGuess('abc');
        expect(result1.valid).toBe(false);
        expect(result1.error).toBe('Please enter a valid number');

        const result2 = validateGuess('$$$');
        expect(result2.valid).toBe(false);
        expect(result2.error).toBe('Please enter a valid number');
      });

      it('should reject zero or negative prices', () => {
        const result1 = validateGuess('0');
        expect(result1.valid).toBe(false);
        expect(result1.error).toBe('Price must be greater than $0');

        const result2 = validateGuess('-100');
        expect(result2.valid).toBe(false);
        expect(result2.error).toBe('Price must be greater than $0');
      });

      it('should reject unreasonably high prices', () => {
        const result = validateGuess('1000000001');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Price seems too high. Please check your input.');
      });

      it('should reject too many decimal places', () => {
        const result = validateGuess('100.999');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter a valid price (max 2 decimal places)');
      });
    });
  });

  describe('validateCategory', () => {
    it('should validate valid category IDs', () => {
      expect(validateCategory('123')).toBe(true);
      expect(validateCategory('abc-123')).toBe(true);
      expect(validateCategory('category-1')).toBe(true);
    });

    it('should reject invalid category IDs', () => {
      expect(validateCategory(undefined)).toBe(false);
      expect(validateCategory('')).toBe(false);
      expect(validateCategory(null as any)).toBe(false);
      expect(validateCategory(123 as any)).toBe(false);
    });
  });

  describe('formatPriceInput', () => {
    it('should remove non-numeric characters except decimal', () => {
      expect(formatPriceInput('$100')).toBe('100');
      expect(formatPriceInput('1,000')).toBe('1000');
      expect(formatPriceInput('abc123xyz')).toBe('123');
      expect(formatPriceInput('100.50')).toBe('100.50');
    });

    it('should handle multiple decimal points', () => {
      expect(formatPriceInput('100.50.75')).toBe('100.5075');
      expect(formatPriceInput('1.2.3.4')).toBe('1.234');
    });

    it('should limit decimal places to 2', () => {
      expect(formatPriceInput('100.999')).toBe('100.99');
      expect(formatPriceInput('50.12345')).toBe('50.12');
      expect(formatPriceInput('.999')).toBe('.99');
    });

    it('should handle edge cases', () => {
      expect(formatPriceInput('')).toBe('');
      expect(formatPriceInput('.')).toBe('.');
      expect(formatPriceInput('0')).toBe('0');
      expect(formatPriceInput('00100')).toBe('00100');
    });
  });
});