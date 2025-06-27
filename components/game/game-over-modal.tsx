'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/lib/store/game-store';
import { AnimatedPrice } from './animated-price';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { mockCategories } from '@/lib/mock-data';

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
  
  const finalGuess = guesses[guesses.length - 1];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Delay price reveal for dramatic effect
      setTimeout(() => setShowPrice(true), 500);
      
      // Submit score to leaderboard if won
      if (gameStatus === 'won' && !scoreSubmitted && playerName && currentItem) {
        const category = mockCategories.find(c => 
          c.id === currentItem.category_id
        );
        
        if (category) {
          submitScore({
            player_name: playerName,
            score: sessionScore,
            accuracy: finalGuess?.accuracy || 0,
            attempts: guesses.length,
            category_name: category.name,
            item_name: currentItem.name,
          }).then(() => {
            setScoreSubmitted(true);
          }).catch(console.error);
        }
      }
    } else {
      document.body.style.overflow = 'unset';
      setShowPrice(false);
      setScoreSubmitted(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, gameStatus, scoreSubmitted, playerName, currentItem, sessionScore, guesses.length, submitScore]);

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
      <div className="relative max-w-lg w-full animate-in zoom-in-95 duration-300 mx-4">
        <div className="panel-game-show p-6 sm:p-8 text-center max-h-[90vh] overflow-y-auto">
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
                <h2 className="text-3xl sm:text-5xl font-bold text-game-show text-green-bright mb-3 sm:mb-4">
                  WINNER!
                </h2>
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎉</div>
                <p className="text-lg sm:text-xl text-yellow-bright mb-2">
                  Congratulations! You guessed it!
                </p>
                <p className="text-base sm:text-lg text-muted">
                  Accuracy: {accuracy.toFixed(2)}% • Attempts: {guesses.length}/6
                </p>
                
                {/* Score Display */}
                <div className="mt-4 p-4 bg-stage-dark/50 rounded-lg">
                  <p className="text-sm text-muted mb-1">SCORE EARNED</p>
                  <p className="text-3xl font-bold text-yellow-bright">
                    +{sessionScore.toLocaleString()} pts
                  </p>
                  {currentScore >= highScore && (
                    <p className="text-sm text-green-bright font-bold mt-1 animate-pulse">
                      NEW HIGH SCORE!
                    </p>
                  )}
                </div>
                
                {/* Streak Display */}
                {currentStreak > 1 && (
                  <div className="mt-2">
                    <p className="text-lg text-orange-bright font-bold">
                      🔥 {currentStreak} Game Streak!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-5xl font-bold text-game-show text-red-bright mb-3 sm:mb-4">
                  GAME OVER
                </h2>
                <p className="text-lg sm:text-xl text-yellow-bright mb-2">
                  Better luck next time!
                </p>
                {currentStreak > 0 && (
                  <p className="text-base sm:text-lg text-muted">
                    Streak Lost: {currentStreak} 😢
                  </p>
                )}
              </>
            )}
          </div>

          {/* Actual Price Reveal */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-stage-dark rounded-lg border-2 border-yellow-bright">
            <p className="text-base sm:text-lg text-muted mb-2">The actual retail price was:</p>
            {showPrice ? (
              <AnimatedPrice targetPrice={currentItem.price} />
            ) : (
              <div className="text-5xl font-bold text-game-show text-white">
                ???
              </div>
            )}
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