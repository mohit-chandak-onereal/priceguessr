'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGameStore } from '@/lib/store/game-store';
import { AnimatedPrice } from './animated-price';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { useCategories } from '@/hooks/use-categories';

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
  const { gameStatus, currentItem, guesses, sessionScore, currentScore, highScore, currentStreak, playerName } = useGameStore();
  const [showPrice, setShowPrice] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const { submitScore } = useLeaderboard();
  const { categories } = useCategories();
  
  const finalGuess = guesses[guesses.length - 1];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Delay price reveal for dramatic effect
      setTimeout(() => setShowPrice(true), 500);
      
      // Submit score to leaderboard if won
      if (gameStatus === 'won' && !scoreSubmitted && playerName && currentItem) {
        submitScore({
          username: playerName,
          accuracy: finalGuess?.accuracy || 0,
          attempts: guesses.length,
          item_name: currentItem.name,
          item_price: currentItem.price,
        }).then(() => {
          setScoreSubmitted(true);
        }).catch(console.error);
      }
    } else {
      document.body.style.overflow = 'unset';
      setShowPrice(false);
      setScoreSubmitted(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, gameStatus, scoreSubmitted, playerName, currentItem, sessionScore, guesses.length, submitScore, finalGuess?.accuracy]);

  // Separate ESC key handler
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !currentItem) return null;

  const isWin = gameStatus === 'won';
  const accuracy = finalGuess?.accuracy || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-md w-full animate-in zoom-in-95 duration-300 mx-4">
        <div className="panel-game-show p-4 sm:p-6 text-center max-h-[90vh] overflow-y-auto">
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

          {/* Result - More Compact */}
          <div className="mb-4">
            {isWin ? (
              <>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-game-show text-green-bright">
                    WINNER!
                  </h2>
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm sm:text-base text-muted mb-3">
                  <span>Accuracy: <span className="text-yellow-bright font-bold">{accuracy.toFixed(1)}%</span></span>
                  <span>•</span>
                  <span>Attempts: <span className="text-yellow-bright font-bold">{guesses.length}/6</span></span>
                </div>
                
                {/* Score Display - Inline */}
                <div className="flex items-center justify-center gap-2 bg-stage-dark/50 rounded-lg px-4 py-2">
                  <span className="text-base sm:text-lg font-bold text-yellow-bright">
                    +{sessionScore.toLocaleString()} pts
                  </span>
                  {currentScore >= highScore && (
                    <span className="text-xs text-green-bright font-bold animate-pulse">
                      NEW HIGH SCORE!
                    </span>
                  )}
                  {currentStreak > 1 && (
                    <span className="text-xs text-orange-bright font-bold">
                      🔥 {currentStreak} STREAK
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-game-show text-red-bright mb-2">
                  GAME OVER
                </h2>
                <p className="text-base sm:text-lg text-yellow-bright">
                  Better luck next time!
                </p>
                {currentStreak > 0 && (
                  <p className="text-sm text-muted">
                    Streak Lost: {currentStreak} 😢
                  </p>
                )}
              </>
            )}
          </div>

          {/* Item Reveal - Compact */}
          <div className="mb-4 space-y-3">
            {/* Item Info Row */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-left">
                <h3 className="text-base sm:text-lg font-bold text-yellow-bright line-clamp-1">
                  {currentItem.name}
                </h3>
                <p className="text-sm text-muted">by {currentItem.brand}</p>
              </div>
              
              {/* Small Item Image */}
              <div className="relative w-20 h-20 rounded-lg bg-stage-dark/50 overflow-hidden flex-shrink-0">
                <Image 
                  src={currentItem.images[0]} 
                  alt={currentItem.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            
            {/* Price Reveal - Compact */}
            <div className="p-3 bg-stage-dark rounded-lg border-2 border-yellow-bright overflow-hidden">
              <p className="text-sm text-muted mb-1">Actual price:</p>
              {showPrice ? (
                <div className="overflow-x-auto">
                  <AnimatedPrice targetPrice={currentItem.price} />
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-bold text-game-show text-white">
                  ???
                </div>
              )}
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
          
          {/* Stats Link */}
          <div className="mt-6 text-center">
            <Link
              href="/stats"
              className="text-muted hover:text-yellow-bright transition-colors text-sm"
            >
              View Detailed Statistics →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}