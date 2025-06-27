import { create } from 'zustand';
import { Item, GameSession, Guess, GAME_CONFIG } from '@/types/game';
import { 
  calculateAccuracy, 
  isWinningGuess, 
  generateSessionId,
} from '@/utils/game-utils';
import { validateGuess } from '@/utils/validation';
import { getRandomItem, getAvailableHints } from '@/lib/helpers/game-helpers';
import { soundManager } from '@/utils/sound-manager';
import { useStatsStore } from './stats-store';
import { triggerWinConfetti, triggerPerfectConfetti, triggerFastWinConfetti, triggerHighScoreConfetti } from '@/utils/confetti';

interface GameState {
  // Current game data
  currentItem: Item | null;
  currentSession: GameSession | null;
  gameStartTime: number | null;
  
  // Game progress
  guesses: Guess[];
  currentGuess: string;
  hintsRevealed: number;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  
  // Score and streaks
  currentScore: number;
  sessionScore: number; // Score earned in current game
  highScore: number;
  currentStreak: number;
  bestStreak: number;
  
  // Player
  playerName: string | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  attemptsRemaining: number;
  availableHints: ReturnType<typeof getAvailableHints>;
  
  // Actions
  startNewGame: (categoryId?: string) => Promise<void>;
  makeGuess: () => void;
  recordMissedTurn: () => void;
  setCurrentGuess: (value: string) => void;
  revealNextHint: () => void;
  resetGame: () => void;
  clearError: () => void;
  setPlayerName: (name: string) => void;
}

// Score calculation helper - New scoring system
const calculateScore = (percentOff: number): number => {
  // Only score if within winning threshold (5%)
  if (percentOff > 5) return 0;
  
  // Linear scale from 200-1000 points within 0-5% range
  // 0% off = 1000 points
  // 5% off = 200 points
  const score = 1000 - ((percentOff / 5) * 800);
  
  return Math.round(score);
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentItem: null,
  currentSession: null,
  gameStartTime: null,
  guesses: [],
  currentGuess: '',
  hintsRevealed: 1,
  gameStatus: 'idle',
  currentScore: 0,
  sessionScore: 0,
  highScore: typeof window !== 'undefined' ? Number(localStorage.getItem('highScore') || 0) : 0,
  currentStreak: 0,
  bestStreak: typeof window !== 'undefined' ? Number(localStorage.getItem('bestStreak') || 0) : 0,
  playerName: null,
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
        sessionScore: 0, // Reset session score for new game
        gameStartTime: Date.now(), // Track game start time
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
    
    // Determine game status and calculate score
    let gameStatus: GameState['gameStatus'] = 'playing';
    let scoreEarned = 0;
    let newStreak = state.currentStreak;
    
    if (isCorrect) {
      gameStatus = 'won';
      // Calculate score using new system (accuracy is the percentage off)
      scoreEarned = calculateScore(accuracy);
      newStreak = state.currentStreak + 1;
      soundManager.play('correct');
      
      // Trigger appropriate confetti
      setTimeout(() => {
        if (accuracy === 100) {
          triggerPerfectConfetti();
        } else if (attempts <= 2) {
          triggerFastWinConfetti();
        } else {
          triggerWinConfetti();
        }
      }, 500); // Slight delay for better effect
    } else if (attempts >= GAME_CONFIG.MAX_ATTEMPTS) {
      gameStatus = 'lost';
      newStreak = 0; // Reset streak on loss
      soundManager.play('gameOver');
    } else {
      // Wrong guess but game continues
      soundManager.play('wrong');
    }
    
    // Update high scores
    const newScore = state.currentScore + scoreEarned;
    const newHighScore = Math.max(state.highScore, newScore);
    const newBestStreak = Math.max(state.bestStreak, newStreak);
    
    // Save to localStorage
    if (newHighScore > state.highScore) {
      localStorage.setItem('highScore', newHighScore.toString());
      if (gameStatus === 'won') {
        soundManager.play('newHighScore');
        setTimeout(() => {
          triggerHighScoreConfetti();
        }, 1000); // After regular confetti
      }
    }
    if (newBestStreak > state.bestStreak) {
      localStorage.setItem('bestStreak', newBestStreak.toString());
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
      currentScore: newScore,
      sessionScore: scoreEarned,
      highScore: newHighScore,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
    });
    
    // Auto-reveal next hint if not won
    if (gameStatus === 'playing' && GAME_CONFIG.HINT_UNLOCK_AFTER_GUESS) {
      get().revealNextHint();
    }
    
    // Record statistics if game ended
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const timeTaken = state.gameStartTime ? Math.floor((Date.now() - state.gameStartTime) / 1000) : 0;
      const categoryId = state.currentItem.category_id;
      
      useStatsStore.getState().recordGameResult(
        categoryId,
        gameStatus === 'won',
        gameStatus === 'won' ? accuracy : 0,
        attempts,
        scoreEarned,
        timeTaken
      );
      
      // Check if this was a high-value item (for achievement)
      if (gameStatus === 'won' && state.currentItem.price > 100000) {
        // This will be checked in the achievements system
      }
    }
  },
  
  // Update current guess input
  setCurrentGuess: (value: string) => {
    set({ currentGuess: value, error: null });
  },
  
  // Handle missed turn (when timer runs out)
  recordMissedTurn: () => {
    const state = get();
    if (state.gameStatus !== 'playing' || !state.currentItem) return;
    
    // Create a missed turn guess
    const missedGuess: Guess = {
      value: 0,
      timestamp: new Date().toISOString(),
      accuracy: 100, // 100% off
      isWithinRange: false,
      isMissedTurn: true,
    };
    
    const newGuesses = [...state.guesses, missedGuess];
    const attempts = newGuesses.length;
    const attemptsRemaining = GAME_CONFIG.MAX_ATTEMPTS - attempts;
    
    // Check if game is over
    let gameStatus: GameState['gameStatus'] = 'playing';
    if (attempts >= GAME_CONFIG.MAX_ATTEMPTS) {
      gameStatus = 'lost';
      soundManager.play('gameOver');
    }
    
    set({
      guesses: newGuesses,
      attemptsRemaining,
      gameStatus,
      currentGuess: '',
      error: null,
    });
    
    // Reveal next hint if game continues
    if (gameStatus === 'playing') {
      get().revealNextHint();
    }
    
    // Record statistics if game ended
    if (gameStatus === 'lost') {
      const timeTaken = state.gameStartTime ? Math.floor((Date.now() - state.gameStartTime) / 1000) : 0;
      const categoryId = state.currentItem.category_id;
      
      useStatsStore.getState().recordGameResult(
        categoryId,
        false,
        0,
        attempts,
        0,
        timeTaken
      );
    }
  },
  
  // Reveal the next hint
  revealNextHint: () => {
    const state = get();
    if (state.hintsRevealed < state.guesses.length + 1) {
      set({ hintsRevealed: state.hintsRevealed + 1 });
      soundManager.play('reveal');
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
      currentScore: 0, // Reset current score but keep high score and streaks
      sessionScore: 0, // Reset session score
      gameStartTime: null, // Reset game start time
    });
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
  
  // Set player name
  setPlayerName: (name: string) => {
    set({ playerName: name });
  },
}))