import { renderHook, act } from '@testing-library/react';
import { useGameStore } from '@/lib/store/game-store';
import { mockItems } from '@/lib/mock-data';

// Mock the helpers module
jest.mock('@/lib/helpers/game-helpers', () => ({
  getRandomItem: jest.fn(),
  getAvailableHints: jest.fn(() => []),
}));

import { getRandomItem } from '@/lib/helpers/game-helpers';

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.resetGame();
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => useGameStore());
      
      expect(result.current.currentItem).toBeNull();
      expect(result.current.currentSession).toBeNull();
      expect(result.current.guesses).toEqual([]);
      expect(result.current.currentGuess).toBe('');
      expect(result.current.hintsRevealed).toBe(1);
      expect(result.current.gameStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.attemptsRemaining).toBe(6);
    });
  });

  describe('startNewGame', () => {
    it('should start a new game successfully', async () => {
      const mockItem = mockItems[0];
      (getRandomItem as jest.Mock).mockResolvedValue(mockItem);

      const { result } = renderHook(() => useGameStore());
      
      await act(async () => {
        await result.current.startNewGame();
      });

      expect(result.current.currentItem).toEqual(mockItem);
      expect(result.current.currentSession).toBeDefined();
      expect(result.current.currentSession?.item_id).toBe(mockItem.id);
      expect(result.current.gameStatus).toBe('playing');
      expect(result.current.attemptsRemaining).toBe(6);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle error when no items available', async () => {
      (getRandomItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useGameStore());
      
      await act(async () => {
        await result.current.startNewGame();
      });

      expect(result.current.error).toBe('No items available in this category');
      expect(result.current.currentItem).toBeNull();
      expect(result.current.gameStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should filter by category when provided', async () => {
      const mockItem = mockItems[0];
      (getRandomItem as jest.Mock).mockResolvedValue(mockItem);

      const { result } = renderHook(() => useGameStore());
      
      await act(async () => {
        await result.current.startNewGame('category-1');
      });

      expect(getRandomItem).toHaveBeenCalledWith('category-1');
    });
  });

  describe('makeGuess', () => {
    beforeEach(async () => {
      const mockItem = { ...mockItems[0], price: 100 };
      (getRandomItem as jest.Mock).mockResolvedValue(mockItem);

      const { result } = renderHook(() => useGameStore());
      await act(async () => {
        await result.current.startNewGame();
      });
    });

    it('should handle correct guess', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setCurrentGuess('100');
        result.current.makeGuess();
      });

      expect(result.current.guesses).toHaveLength(1);
      expect(result.current.guesses[0].value).toBe(100);
      expect(result.current.guesses[0].isWithinRange).toBe(true);
      expect(result.current.gameStatus).toBe('won');
      expect(result.current.currentSession?.won).toBe(true);
    });

    it('should handle incorrect guess', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setCurrentGuess('50');
        result.current.makeGuess();
      });

      expect(result.current.guesses).toHaveLength(1);
      expect(result.current.guesses[0].value).toBe(50);
      expect(result.current.guesses[0].isWithinRange).toBe(false);
      expect(result.current.gameStatus).toBe('playing');
      expect(result.current.attemptsRemaining).toBe(5);
    });

    it('should handle game over after 6 attempts', () => {
      const { result } = renderHook(() => useGameStore());
      
      // Make 6 wrong guesses
      for (let i = 1; i <= 6; i++) {
        act(() => {
          result.current.setCurrentGuess('50');
          result.current.makeGuess();
        });
      }

      expect(result.current.guesses).toHaveLength(6);
      expect(result.current.gameStatus).toBe('lost');
      expect(result.current.currentSession?.won).toBe(false);
      expect(result.current.attemptsRemaining).toBe(0);
    });

    it('should validate input before making guess', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.setCurrentGuess('');
        result.current.makeGuess();
      });

      expect(result.current.guesses).toHaveLength(0);
      expect(result.current.error).toBe('Please enter a price');
    });

    it('should not allow guesses when game is not playing', () => {
      const { result } = renderHook(() => useGameStore());
      
      // Win the game first
      act(() => {
        result.current.setCurrentGuess('100');
        result.current.makeGuess();
      });

      expect(result.current.gameStatus).toBe('won');

      // Try to make another guess
      const guessesBefore = result.current.guesses.length;
      act(() => {
        result.current.setCurrentGuess('50');
        result.current.makeGuess();
      });

      expect(result.current.guesses.length).toBe(guessesBefore);
    });
  });

  describe('setCurrentGuess', () => {
    it('should update current guess and clear error', async () => {
      const mockItem = { ...mockItems[0], price: 100 };
      (getRandomItem as jest.Mock).mockResolvedValue(mockItem);
      
      const { result } = renderHook(() => useGameStore());
      
      // Start a game first
      await act(async () => {
        await result.current.startNewGame();
      });
      
      // Set an error first
      act(() => {
        result.current.setCurrentGuess('');
        result.current.makeGuess();
      });
      expect(result.current.error).toBeTruthy();

      // Update guess
      act(() => {
        result.current.setCurrentGuess('100');
      });

      expect(result.current.currentGuess).toBe('100');
      expect(result.current.error).toBeNull();
    });
  });

  describe('revealNextHint', () => {
    beforeEach(async () => {
      const mockItem = mockItems[0];
      (getRandomItem as jest.Mock).mockResolvedValue(mockItem);

      const { result } = renderHook(() => useGameStore());
      await act(async () => {
        await result.current.startNewGame();
      });
    });

    it('should reveal next hint when available', () => {
      const { result } = renderHook(() => useGameStore());
      
      // Make a guess first
      act(() => {
        result.current.setCurrentGuess('50');
        result.current.makeGuess();
      });

      // Since auto-reveal happens after a guess, hints should already be at 2
      expect(result.current.hintsRevealed).toBe(2);
      
      // Manually reveal another hint
      act(() => {
        result.current.revealNextHint();
      });

      // Should still be 2 because we can only reveal hints up to number of guesses + 1
      expect(result.current.hintsRevealed).toBe(2);
    });
  });

  describe('resetGame', () => {
    it('should reset all game state', async () => {
      const mockItem = mockItems[0];
      (getRandomItem as jest.Mock).mockResolvedValue(mockItem);

      const { result } = renderHook(() => useGameStore());
      
      // Start a game and make a guess
      await act(async () => {
        await result.current.startNewGame();
      });
      
      act(() => {
        result.current.setCurrentGuess('50');
        result.current.makeGuess();
      });

      // Reset
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.currentItem).toBeNull();
      expect(result.current.currentSession).toBeNull();
      expect(result.current.guesses).toEqual([]);
      expect(result.current.currentGuess).toBe('');
      expect(result.current.gameStatus).toBe('idle');
    });
  });

  describe('clearError', () => {
    it('should clear error message', async () => {
      const mockItem = { ...mockItems[0], price: 100 };
      (getRandomItem as jest.Mock).mockResolvedValue(mockItem);
      
      const { result } = renderHook(() => useGameStore());
      
      // Start a game first
      await act(async () => {
        await result.current.startNewGame();
      });
      
      // Create an error
      act(() => {
        result.current.setCurrentGuess('');
        result.current.makeGuess();
      });
      expect(result.current.error).toBeTruthy();

      // Clear it
      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });
  });
});