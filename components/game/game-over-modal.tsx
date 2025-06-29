'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGameStore } from '@/lib/store/game-store';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { shareResults, shareOnTwitter, copyToClipboard } from '@/utils/social-share';

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
  const [copied, setCopied] = useState(false);
  const { submitScore } = useLeaderboard();
  
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

          {/* Result */}
          <div className="mb-4">
            {isWin ? (
              <>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-game-show text-green-bright">
                    WINNER!
                  </h2>
                  <span className="text-3xl">🎉</span>
                </div>
                
                {/* All stats in one line with points background */}
                <div className="flex items-center justify-center bg-gradient-to-r from-yellow-bright/20 to-orange-bright/20 rounded-lg px-4 py-3 border-2 border-yellow-bright">
                  <div className="flex items-center gap-4 text-sm sm:text-base">
                    <span>Accuracy: <span className="text-yellow-bright font-bold">{accuracy.toFixed(1)}%</span></span>
                    <span className="text-muted">•</span>
                    <span>Attempts: <span className="text-yellow-bright font-bold">{guesses.length}/6</span></span>
                    <span className="text-muted">•</span>
                    <span className="text-lg sm:text-xl font-bold text-yellow-bright">
                      +{sessionScore.toLocaleString()} pts
                    </span>
                  </div>
                </div>
                
                {/* Additional badges */}
                <div className="flex items-center justify-center gap-2 mt-2">
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

          {/* Item Card - Vertical layout with image on top */}
          <div className="mb-4 bg-stage-dark/50 rounded-lg p-4 border-2 border-border">
            {/* Large Item Image Centered on Top */}
            <div className="flex justify-center mb-4">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-lg bg-black/30 overflow-hidden border-2 border-yellow-bright/50">
                <Image 
                  src={currentItem.images[0]} 
                  alt={currentItem.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 192px, 224px"
                />
              </div>
            </div>
            
            {/* Item Name and Brand in One Line */}
            <div className="text-center mb-3">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-bright">
                {currentItem.name} <span className="text-sm font-normal text-muted">by {currentItem.brand}</span>
              </h3>
            </div>
            
            {/* Price Reveal - Larger without label */}
            <div className="bg-gradient-to-r from-yellow-bright/10 to-orange-bright/10 rounded-lg py-3 px-4 border border-yellow-bright/50">
              {showPrice ? (
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-bold text-game-show text-yellow-bright">
                    ${currentItem.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-bold text-game-show text-white text-center">
                  ???
                </div>
              )}
            </div>
          </div>

          {/* Share Section */}
          {isWin && (
            <div className="mb-4 border-t border-border pt-4">
              <p className="text-sm text-muted mb-3">Share your victory!</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={async () => {
                    const shared = await shareResults({
                      score: sessionScore,
                      accuracy: accuracy,
                      attempts: guesses.length,
                      itemName: currentItem.name,
                      streak: currentStreak,
                    });
                    if (!shared) {
                      const copied = await copyToClipboard(
                        `🎰 PriceGuessr\n\n${Array(guesses.length).fill('🟨').join('')}${Array(6 - guesses.length).fill('⬜').join('')}\n\n✅ Won with ${accuracy.toFixed(1)}% accuracy!\n📊 Score: ${sessionScore.toLocaleString()} points${currentStreak > 1 ? `\n🔥 Streak: ${currentStreak} wins` : ''}\n\nPlay at: ${window.location.origin}`
                      );
                      if (copied) {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-green-bright hover:bg-green-bright/80 text-white rounded-lg font-bold transition-all text-sm"
                >
                  {copied ? 'COPIED!' : 'SHARE'}
                </button>
                <button
                  onClick={() => shareOnTwitter({
                    score: sessionScore,
                    accuracy: accuracy,
                    attempts: guesses.length,
                    itemName: currentItem.name,
                    streak: currentStreak,
                  })}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all text-sm"
                >
                  TWEET
                </button>
              </div>
            </div>
          )}

          {/* Actions - Smaller buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onPlayAgain}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-bright to-orange-bright text-stage-dark font-bold rounded-lg hover:shadow-glow transition-all text-sm"
            >
              PLAY AGAIN
            </button>
            <button
              onClick={onBackToCategories}
              className="px-6 py-2.5 bg-stage-dark hover:bg-surface-hover text-white rounded-lg font-bold transition-all border-2 border-border hover:border-yellow-bright text-sm"
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