'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/game-store';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  onBackToCategories: () => void;
}

export function GameOverModal({
  isOpen,
  onClose,
  onPlayAgain,
  onBackToCategories,
}: GameOverModalProps) {
  const { gameStatus, currentItem, guesses } = useGameStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentItem) return null;

  const isWin = gameStatus === 'won';
  const finalGuess = guesses[guesses.length - 1];
  const accuracy = finalGuess?.accuracy || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-lg w-full animate-in zoom-in-95 duration-300">
        <div className="panel-game-show p-8 text-center">
          {/* Stars decoration */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="text-4xl text-yellow-bright animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                ★
              </div>
            ))}
          </div>

          {/* Result */}
          <div className="mb-6">
            {isWin ? (
              <>
                <h2 className="text-5xl font-bold text-game-show text-green-bright mb-4">
                  WINNER!
                </h2>
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-xl text-yellow-bright mb-2">
                  Congratulations! You guessed it!
                </p>
                <p className="text-lg text-muted">
                  Accuracy: {accuracy.toFixed(2)}% • Attempts: {guesses.length}/6
                </p>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-bold text-game-show text-red-bright mb-4">
                  GAME OVER
                </h2>
                <p className="text-xl text-yellow-bright mb-2">
                  Better luck next time!
                </p>
              </>
            )}
          </div>

          {/* Actual Price Reveal */}
          <div className="mb-8 p-6 bg-stage-dark rounded-lg border-2 border-yellow-bright">
            <p className="text-lg text-muted mb-2">The actual retail price was:</p>
            <div className="text-5xl font-bold text-game-show text-green-bright">
              ${currentItem.price.toLocaleString()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onPlayAgain}
              className="btn-game-show text-white"
            >
              PLAY AGAIN
            </button>
            <button
              onClick={onBackToCategories}
              className="px-8 py-4 bg-stage-dark hover:bg-surface-hover text-white rounded-lg font-bold transition-all border-2 border-border hover:border-yellow-bright"
            >
              NEW CATEGORY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}