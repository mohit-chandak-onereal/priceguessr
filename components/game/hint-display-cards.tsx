'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store/game-store';
import { GAME_CONFIG } from '@/types/game';

export function HintDisplay() {
  const { currentItem, guesses, hintsRevealed } = useGameStore();
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  // Auto-advance to latest unlocked hint when a new one is revealed
  useEffect(() => {
    if (hintsRevealed > 0) {
      setCurrentHintIndex(hintsRevealed - 1);
    }
  }, [hintsRevealed]);

  if (!currentItem) return null;

  // Build hints array dynamically based on available data
  const hints = [];
  
  // Always show basic info as first hint
  if (currentItem.basic_info && Object.keys(currentItem.basic_info).length > 0) {
    hints.push({
      level: 1,
      title: 'BASIC INFO',
      content: (
        <div className="space-y-1">
          {Object.entries(currentItem.basic_info).map(([key, value]) => (
            <div key={key} className="flex justify-between gap-2">
              <span className="text-muted text-xs uppercase">
                {key.replace(/_/g, ' ')}:
              </span>
              <span className="text-white text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      ),
    });
  }
  
  // Add individual hints if they exist
  const hintTexts = [
    { text: currentItem.hint_1, title: 'CLUE #1' },
    { text: currentItem.hint_2, title: 'CLUE #2' },
    { text: currentItem.hint_3, title: 'CLUE #3' },
    { text: currentItem.hint_4, title: 'CLUE #4' },
    { text: currentItem.hint_5, title: 'FINAL CLUE' },
  ];

  hintTexts.forEach(({ text, title }) => {
    if (text) {
      hints.push({
        level: hints.length + 1,
        title,
        content: <p className="text-sm leading-relaxed">&quot;{text}&quot;</p>,
      });
    }
  });
  
  // If we don't have enough hints, add a price range hint
  if (hints.length < 6) {
    hints.push({
      level: hints.length + 1,
      title: 'PRICE RANGE',
      content: (
        <p className="text-sm">
          Currency: {currentItem.currency} - Think{' '}
          {currentItem.price > 1000000
            ? 'millions'
            : currentItem.price > 10000
            ? 'tens of thousands'
            : currentItem.price > 1000
            ? 'thousands'
            : 'hundreds'}
          !
        </p>
      ),
    });
  }

  const canGoPrevious = currentHintIndex > 0;
  const canGoNext = currentHintIndex < hints.length - 1;
  const currentHint = hints[currentHintIndex];
  const isCurrentHintUnlocked = currentHintIndex < hintsRevealed;
  const isCurrentHintAvailable = currentHintIndex <= guesses.length;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-center text-yellow-bright text-game-show">
        HINTS & CLUES
      </h3>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-1.5 mb-3">
        {hints.map((_, index) => {
          const isUnlocked = index < hintsRevealed;
          return (
            <button
              key={index}
              onClick={() => isUnlocked && setCurrentHintIndex(index)}
              disabled={!isUnlocked}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentHintIndex 
                  ? 'w-6 bg-yellow-bright' 
                  : isUnlocked 
                    ? 'bg-yellow-bright/50 hover:bg-yellow-bright/70 cursor-pointer' 
                    : 'bg-border cursor-not-allowed'
                }
              `}
              aria-label={`Go to hint ${index + 1}`}
            />
          );
        })}
      </div>

      {/* Card Container */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => setCurrentHintIndex(currentHintIndex - 1)}
          disabled={!canGoPrevious}
          className={`
            absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1/2
            w-8 h-8 rounded-full flex items-center justify-center
            transition-all shadow-lg
            ${canGoPrevious
              ? 'bg-yellow-bright text-stage-dark hover:bg-yellow-bright/80'
              : 'bg-border/50 text-muted cursor-not-allowed opacity-50'
            }
          `}
          aria-label="Previous hint"
        >
          ‹
        </button>

        <button
          onClick={() => setCurrentHintIndex(currentHintIndex + 1)}
          disabled={!canGoNext}
          className={`
            absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1/2
            w-8 h-8 rounded-full flex items-center justify-center
            transition-all shadow-lg
            ${canGoNext
              ? 'bg-yellow-bright text-stage-dark hover:bg-yellow-bright/80'
              : 'bg-border/50 text-muted cursor-not-allowed opacity-50'
            }
          `}
          aria-label="Next hint"
        >
          ›
        </button>

        {/* Hint Card */}
        <div
          className={`
            relative p-4 rounded-lg border-2 transition-all duration-300 min-h-[120px]
            ${
              isCurrentHintUnlocked
                ? 'bg-stage-dark/50 border-yellow-bright'
                : isCurrentHintAvailable
                ? 'bg-stage-dark/20 border-border'
                : 'bg-stage-dark/10 border-border/30 opacity-50'
            }
          `}
        >
          {/* Hint Number Badge */}
          <div
            className={`
              absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center
              text-sm font-bold border-2
              ${
                isCurrentHintUnlocked
                  ? 'bg-yellow-bright text-stage-dark border-yellow-bright'
                  : 'bg-stage-dark text-muted border-border'
              }
            `}
          >
            {currentHint.level}
          </div>

          {/* Content */}
          {isCurrentHintUnlocked ? (
            <div>
              <h4 className="text-sm font-bold text-yellow-bright mb-2">
                {currentHint.title}
              </h4>
              <div className="text-white">{currentHint.content}</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[80px] text-center">
              <div className="text-3xl mb-2">🔒</div>
              <span className="text-muted text-sm">
                {isCurrentHintAvailable
                  ? `Hint ${currentHint.level} - Locked`
                  : `Unlocks after ${currentHintIndex} ${
                      currentHintIndex === 1 ? 'guess' : 'guesses'
                    }`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Info */}
      <div className="text-center text-xs text-muted">
        {hintsRevealed} of {hints.length} hints unlocked
        {guesses.length < GAME_CONFIG.MAX_ATTEMPTS && hintsRevealed < hints.length && (
          <span className="block mt-1">Make a guess to unlock more!</span>
        )}
      </div>
    </div>
  );
}