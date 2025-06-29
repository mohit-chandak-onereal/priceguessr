'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/game-store';
import { HintDisplay } from './hint-display-cards';
import { GuessHistory } from './guess-history';
import { GameOverModal } from './game-over-modal';
import { ItemImage } from './item-image';
import { GameControl } from './game-control';
import { ScoreDisplay } from './score-display';
import { useCategories } from '@/hooks/use-categories';

interface GameBoardProps {
  categoryId: string;
}

export function GameBoard({ categoryId }: GameBoardProps) {
  const router = useRouter();
  const [showGameOver, setShowGameOver] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [shakeEffect, setShakeEffect] = useState(false);
  
  const {
    currentItem,
    gameStatus,
    attemptsRemaining,
    guesses,
    isLoading,
    error,
    startNewGame,
    resetGame,
  } = useGameStore();

  const { categories } = useCategories();
  const category = categories.find(c => c.id === categoryId);

  useEffect(() => {
    // Reset game state and modal when category changes
    setShowGameOver(false);
    setHasInitialized(false); // Reset initialization flag
    startNewGame(categoryId);
    
    // Set initialized after a small delay to ensure state is settled
    const timer = setTimeout(() => {
      setHasInitialized(true);
    }, 100);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
    };
  }, [categoryId, startNewGame]);

  useEffect(() => {
    // Only show modal after initialization and when game actually ends
    if (hasInitialized && (gameStatus === 'won' || gameStatus === 'lost')) {
      setShowGameOver(true);
    }
  }, [gameStatus, hasInitialized]);
  
  // Add shake effect on wrong guess
  useEffect(() => {
    const lastGuess = guesses[guesses.length - 1];
    if (lastGuess && !lastGuess.isWithinRange && gameStatus === 'playing') {
      setShakeEffect(true);
      const isLastAttempt = attemptsRemaining === 0;
      
      // Remove shake class after animation
      setTimeout(() => {
        setShakeEffect(false);
      }, isLastAttempt ? 600 : 500);
    }
  }, [guesses, gameStatus, attemptsRemaining]);

  const handlePlayAgain = () => {
    setShowGameOver(false);
    startNewGame(categoryId);
  };

  const handleBackToCategories = () => {
    resetGame();
    router.push('/play');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            🎲
          </div>
          <div className="text-3xl text-yellow-bright">
            <span className="inline-block">Setting up your showcase</span>
            <span className="inline-flex ml-1">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">
            😵
          </div>
          <div className="text-2xl text-red-bright mb-6">
            <span className="inline-block animate-pulse">Oops! {error}</span>
          </div>
          <button
            onClick={() => startNewGame(categoryId)}
            className="btn-game-show text-white animate-pulse"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Category and Item Header */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-stage-dark rounded-full border-2 border-yellow-bright">
            <span className="text-lg sm:text-xl">{category?.icon}</span>
            <span className="text-sm sm:text-base font-bold text-yellow-bright">{category?.name.toUpperCase()}</span>
          </div>
          {currentItem.metadata.type && (
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-game-show text-white">
                {currentItem.metadata.type}
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 ${
        shakeEffect ? (attemptsRemaining === 0 ? 'shake-hard' : 'shake') : ''
      }`}>
        {/* Left Side - Image and Guess Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">

          {/* Item Image */}
          <div className="aspect-[4/3] w-full">
            <ItemImage 
              imageUrl={currentItem.images[0]} 
              itemName={currentItem.name} 
            />
          </div>

          {/* Game Control - Timer and Input Combined */}
          <div className="mt-4">
            <GameControl />
          </div>

          {/* Hints Section - Below game controls on mobile, same width */}
          <div className="panel-game-show p-4 sm:p-6 lg:hidden">
            <HintDisplay />
          </div>
        </div>

        {/* Right Side - Score, History and Hints */}
        <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6 h-full">
          {/* Score Display */}
          <ScoreDisplay />

          {/* Guess History - Fills remaining space */}
          <div className="panel-game-show p-4 sm:p-6 flex-grow min-h-0">
            <div className="h-full overflow-hidden">
              <GuessHistory />
            </div>
          </div>

          {/* Hints Section - Desktop only, fixed at bottom */}
          <div className="panel-game-show p-4 sm:p-6 hidden lg:block flex-shrink-0">
            <HintDisplay />
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal
          isOpen={showGameOver}
          onClose={() => setShowGameOver(false)}
          onPlayAgain={handlePlayAgain}
          onBackToCategories={handleBackToCategories}
        />
      )}
    </div>
  );
}