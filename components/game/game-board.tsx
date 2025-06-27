'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/game-store';
import { PriceInput } from './price-input';
import { HintDisplay } from './hint-display';
import { GuessHistory } from './guess-history';
import { GameOverModal } from './game-over-modal';
import { ItemImage } from './item-image';
import { GameTimer } from './game-timer';
import { mockCategories } from '@/lib/mock-data';

interface GameBoardProps {
  categoryId: string;
}

export function GameBoard({ categoryId }: GameBoardProps) {
  const router = useRouter();
  const [showGameOver, setShowGameOver] = useState(false);
  
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

  const category = mockCategories.find(c => c.id === categoryId);

  useEffect(() => {
    startNewGame(categoryId);
  }, [categoryId, startNewGame]);

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      setShowGameOver(true);
    }
  }, [gameStatus]);

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
        <div className="text-3xl text-yellow-bright animate-pulse">
          Setting up your showcase...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-2xl text-error mb-4">Oops! {error}</div>
        <button
          onClick={() => startNewGame(categoryId)}
          className="btn-game-show text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentItem) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Category Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-stage-dark rounded-full border-2 border-yellow-bright">
          <span className="text-2xl">{category?.icon}</span>
          <span className="text-xl font-bold text-yellow-bright">{category?.name.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Game Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side - Image and Guess Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Item Name */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-game-show text-white mb-2">
              {currentItem.name}
            </h2>
            <p className="text-lg text-yellow-bright">by {currentItem.brand}</p>
          </div>

          {/* Item Image */}
          <div className="aspect-[4/3] w-full">
            <ItemImage name={currentItem.name} category={category?.name || ''} />
          </div>

          {/* Timer */}
          <div className="panel-game-show p-4">
            <GameTimer />
          </div>

          {/* Price Input Section */}
          {gameStatus === 'playing' && (
            <div className="panel-game-show p-6">
              <PriceInput />
            </div>
          )}

          {/* Attempts Remaining */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2">
              <span className="text-sm text-muted">Attempts:</span>
              <div className="flex gap-1">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < attemptsRemaining
                        ? 'bg-green-bright'
                        : 'bg-red-bright'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Hints and History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hints Section */}
          <div className="panel-game-show p-6">
            <HintDisplay />
          </div>

          {/* Guess History */}
          {guesses.length > 0 && (
            <div className="panel-game-show p-6">
              <GuessHistory />
            </div>
          )}
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