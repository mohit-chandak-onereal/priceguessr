'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/game-store';
import { PriceInput } from './price-input';
import { HintDisplay } from './hint-display';
import { GuessHistory } from './guess-history';
import { GameOverModal } from './game-over-modal';
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
    <div className="max-w-4xl mx-auto">
      {/* Category Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-stage-dark rounded-full border-2 border-yellow-bright mb-4">
          <span className="text-2xl">{category?.icon}</span>
          <span className="text-xl font-bold text-yellow-bright">{category?.name.toUpperCase()}</span>
        </div>
      </div>

      {/* Main Game Panel */}
      <div className="panel-game-show p-8 mb-8">
        {/* Item Name */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-game-show text-white mb-2">
            {currentItem.name}
          </h2>
          <p className="text-xl text-yellow-bright">by {currentItem.brand}</p>
        </div>

        {/* Attempts Remaining */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <span className="text-lg text-muted">Attempts Remaining:</span>
            <div className="flex gap-1">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < attemptsRemaining
                      ? 'bg-green-bright'
                      : 'bg-red-bright'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hints Section */}
        <HintDisplay />

        {/* Price Input */}
        {gameStatus === 'playing' && (
          <div className="mt-8">
            <PriceInput />
          </div>
        )}

        {/* Guess History */}
        <div className="mt-8">
          <GuessHistory />
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