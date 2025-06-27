import {
  getScoreLabel,
  generateShareText,
  calculatePoints,
} from '@/utils/score-utils';
import { SCORE_LABELS } from '@/types/game';

describe('Score Utilities', () => {
  describe('getScoreLabel', () => {
    describe('when player wins', () => {
      it('should return Price Whisperer for perfect accuracy', () => {
        const label = getScoreLabel(true, 3, 100);
        expect(label.label).toBe('Price Whisperer');
        expect(label.emoji).toBe('🎯');
      });

      it('should return Market Ninja for win in 3 or fewer attempts', () => {
        const label1 = getScoreLabel(true, 1, 95);
        const label2 = getScoreLabel(true, 2, 96);
        const label3 = getScoreLabel(true, 3, 97);
        
        expect(label1.label).toBe('Market Ninja');
        expect(label2.label).toBe('Market Ninja');
        expect(label3.label).toBe('Market Ninja');
        expect(label1.emoji).toBe('🥷');
      });

      it('should return Savvy Shopper for win in 4-6 attempts', () => {
        const label4 = getScoreLabel(true, 4, 95);
        const label5 = getScoreLabel(true, 5, 96);
        const label6 = getScoreLabel(true, 6, 97);
        
        expect(label4.label).toBe('Savvy Shopper');
        expect(label5.label).toBe('Savvy Shopper');
        expect(label6.label).toBe('Savvy Shopper');
        expect(label4.emoji).toBe('🛍️');
      });
    });

    describe('when player loses', () => {
      it('should return Getting Warmer for accuracy <= 50%', () => {
        const label1 = getScoreLabel(false, 6, 30);
        const label2 = getScoreLabel(false, 6, 50);
        
        expect(label1.label).toBe('Getting Warmer');
        expect(label2.label).toBe('Getting Warmer');
        expect(label1.emoji).toBe('🔥');
      });

      it('should return Wildly Off for accuracy > 50%', () => {
        const label1 = getScoreLabel(false, 6, 51);
        const label2 = getScoreLabel(false, 6, 100);
        const label3 = getScoreLabel(false, 6, 200);
        
        expect(label1.label).toBe('Wildly Off');
        expect(label2.label).toBe('Wildly Off');
        expect(label3.label).toBe('Wildly Off');
        expect(label1.emoji).toBe('🎪');
      });
    });
  });

  describe('generateShareText', () => {
    it('should generate correct share text for a win', () => {
      const scoreLabel = SCORE_LABELS.find(l => l.label === 'Market Ninja')!;
      const shareText = generateShareText(
        'Rolex Submariner',
        true,
        3,
        4.5,
        scoreLabel
      );

      expect(shareText).toContain('PriceGuessr 🎮');
      expect(shareText).toContain('Rolex Submariner');
      expect(shareText).toContain('Won in 3/6 🥷');
      expect(shareText).toContain('Accuracy: 4.5%');
      expect(shareText).toContain('🟥🟥🟩'); // 2 wrong, 1 correct
      expect(shareText).toContain('⬜⬜⬜'); // 3 unused
      expect(shareText).toContain('https://priceguessr.vercel.app');
    });

    it('should generate correct share text for a loss', () => {
      const scoreLabel = SCORE_LABELS.find(l => l.label === 'Wildly Off')!;
      const shareText = generateShareText(
        'Beach House',
        false,
        6,
        75.2,
        scoreLabel
      );

      expect(shareText).toContain('PriceGuessr 🎮');
      expect(shareText).toContain('Beach House');
      expect(shareText).toContain('Lost 🎪');
      expect(shareText).toContain('Accuracy: 75.2%');
      expect(shareText).toContain('🟥🟥🟥'); // First 3 wrong
      expect(shareText).toContain('🟥🟥🟥'); // Last 3 wrong
    });
  });

  describe('calculatePoints', () => {
    it('should return 0 points for a loss', () => {
      expect(calculatePoints(false, 6, 50)).toBe(0);
      expect(calculatePoints(false, 3, 10)).toBe(0);
    });

    it('should calculate points correctly for wins', () => {
      // Base 1000 + attempt bonus + accuracy bonus
      // Perfect guess in 1 attempt: 1000 + (5*200) + 500 = 2500
      expect(calculatePoints(true, 1, 0)).toBe(2500);
      
      // Win in 3 attempts with 2% accuracy: 1000 + (3*200) + 300 = 1900
      expect(calculatePoints(true, 3, 2)).toBe(1900);
      
      // Win in 6 attempts with 5% accuracy: 1000 + (0*200) + 0 = 1000
      expect(calculatePoints(true, 6, 5)).toBe(1000);
    });

    it('should handle edge cases', () => {
      // Win with exactly 5% accuracy
      expect(calculatePoints(true, 1, 5)).toBe(2000);
      
      // Win with very high accuracy (should not give negative bonus)
      expect(calculatePoints(true, 1, 10)).toBe(2000);
    });
  });
});