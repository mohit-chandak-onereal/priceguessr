import { create } from 'zustand';
import { Item, GameSession, Guess, GAME_CONFIG } from '@/types/game';
import { 
  calculateAccuracy, 
  isWinningGuess, 
  generateSessionId,
} from '@/utils/game-utils';
import { validateGuess } from '@/utils/validation';
import { getRandomItem, getAvailableHints } from '@/lib/helpers/game-helpers';

interface GameState {
  // Current game data
  currentItem: Item | null;
  currentSession: GameSession | null;
  
  // Game progress
  guesses: Guess[];
  currentGuess: string;
  hintsRevealed: number;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  attemptsRemaining: number;
  availableHints: ReturnType<typeof getAvailableHints>;
  
  // Actions
  startNewGame: (categoryId?: string) => Promise<void>;
  makeGuess: () => void;
  setCurrentGuess: (value: string) => void;
  revealNextHint: () => void;
  resetGame: () => void;
  clearError: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentItem: null,
  currentSession: null,
  guesses: [],
  currentGuess: '',
  hintsRevealed: 1,
  gameStatus: 'idle',
  isLoading: false,
  error: null,
  attemptsRemaining: GAME_CONFIG.MAX_ATTEMPTS,
  availableHints: [],
  
  // Start a new game
  startNewGame: async (categoryId?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Get a random item
      const item = await getRandomItem(categoryId);
      if (!item) {
        throw new Error('No items available in this category');
      }
      
      // Create new session
      const session: GameSession = {
        id: generateSessionId(),
        item_id: item.id,
        guesses: [],
        attempts: 0,
        won: false,
        created_at: new Date().toISOString(),
      };
      
      set({
        currentItem: item,
        currentSession: session,
        guesses: [],
        currentGuess: '',
        hintsRevealed: 1,
        gameStatus: 'playing',
        attemptsRemaining: GAME_CONFIG.MAX_ATTEMPTS,
        availableHints: getAvailableHints(0),
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start game',
        isLoading: false,
      });
    }
  },
  
  // Make a guess
  makeGuess: () => {
    const state = get();
    if (state.gameStatus !== 'playing' || !state.currentItem) return;
    
    // Validate the guess
    const validation = validateGuess(state.currentGuess);
    if (!validation.valid) {
      set({ error: validation.error });
      return;
    }
    
    const guessValue = validation.value!;
    const actualPrice = state.currentItem.price;
    
    // Calculate accuracy
    const accuracy = calculateAccuracy(guessValue, actualPrice);
    const isCorrect = isWinningGuess(guessValue, actualPrice);
    // const feedback = getGuessFeedback(guessValue, actualPrice);
    // const direction = getDirectionalFeedback(guessValue, actualPrice);
    
    // Create guess object
    const newGuess: Guess = {
      value: guessValue,
      timestamp: new Date().toISOString(),
      accuracy,
      isWithinRange: isCorrect,
    };
    
    const newGuesses = [...state.guesses, newGuess];
    const attempts = newGuesses.length;
    const attemptsRemaining = GAME_CONFIG.MAX_ATTEMPTS - attempts;
    
    // Determine game status
    let gameStatus: GameState['gameStatus'] = 'playing';
    if (isCorrect) {
      gameStatus = 'won';
    } else if (attempts >= GAME_CONFIG.MAX_ATTEMPTS) {
      gameStatus = 'lost';
    }
    
    // Update session
    const updatedSession: GameSession = {
      ...state.currentSession!,
      guesses: newGuesses,
      attempts,
      won: gameStatus === 'won',
      accuracy: gameStatus === 'won' ? accuracy : undefined,
      completed_at: gameStatus !== 'playing' ? new Date().toISOString() : undefined,
    };
    
    set({
      guesses: newGuesses,
      currentSession: updatedSession,
      currentGuess: '',
      gameStatus,
      attemptsRemaining,
      availableHints: getAvailableHints(attempts),
      error: null,
    });
    
    // Auto-reveal next hint if not won
    if (gameStatus === 'playing' && GAME_CONFIG.HINT_UNLOCK_AFTER_GUESS) {
      get().revealNextHint();
    }
  },
  
  // Update current guess input
  setCurrentGuess: (value: string) => {
    set({ currentGuess: value, error: null });
  },
  
  // Reveal the next hint
  revealNextHint: () => {
    const state = get();
    if (state.hintsRevealed < state.guesses.length + 1) {
      set({ hintsRevealed: state.hintsRevealed + 1 });
    }
  },
  
  // Reset the game
  resetGame: () => {
    set({
      currentItem: null,
      currentSession: null,
      guesses: [],
      currentGuess: '',
      hintsRevealed: 1,
      gameStatus: 'idle',
      isLoading: false,
      error: null,
      attemptsRemaining: GAME_CONFIG.MAX_ATTEMPTS,
      availableHints: [],
    });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
}))