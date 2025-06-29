'use client';

import { useGameStore } from '@/lib/store/game-store';
import { GAME_CONFIG } from '@/types/game';

export function HintDisplay() {
  const { currentItem, guesses, hintsRevealed } = useGameStore();

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
            <p key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: {value}
            </p>
          ))}
        </div>
      ),
    });
  }
  
  // Add individual hints if they exist
  if (currentItem.hint_1) {
    hints.push({
      level: hints.length + 1,
      title: 'CLUE #1',
      content: <p className="italic">&quot;{currentItem.hint_1}&quot;</p>,
    });
  }
  
  if (currentItem.hint_2) {
    hints.push({
      level: hints.length + 1,
      title: 'CLUE #2',
      content: <p className="italic">&quot;{currentItem.hint_2}&quot;</p>,
    });
  }
  
  if (currentItem.hint_3) {
    hints.push({
      level: hints.length + 1,
      title: 'CLUE #3',
      content: <p className="italic">&quot;{currentItem.hint_3}&quot;</p>,
    });
  }
  
  if (currentItem.hint_4) {
    hints.push({
      level: hints.length + 1,
      title: 'CLUE #4',
      content: <p className="italic">&quot;{currentItem.hint_4}&quot;</p>,
    });
  }
  
  if (currentItem.hint_5) {
    hints.push({
      level: hints.length + 1,
      title: 'FINAL CLUE',
      content: <p className="italic">&quot;{currentItem.hint_5}&quot;</p>,
    });
  }
  
  // If we don't have enough hints, add a price range hint
  if (hints.length < 6) {
    hints.push({
      level: hints.length + 1,
      title: 'PRICE RANGE',
      content: (
        <p>
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

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-center text-yellow-bright text-game-show mb-3">
        HINTS & CLUES
      </h3>

      <div className="grid gap-2">
        {hints.map((hint, index) => {
          const isUnlocked = index < hintsRevealed;
          const isAvailable = index <= guesses.length;

          return (
            <div
              key={hint.level}
              className={`
                relative p-3 rounded-lg border-2 transition-all duration-300 text-sm
                ${
                  isUnlocked
                    ? 'bg-stage-dark/50 border-yellow-bright'
                    : isAvailable
                    ? 'bg-stage-dark/20 border-border hover:border-yellow-bright/50 cursor-not-allowed'
                    : 'bg-stage-dark/10 border-border/30 opacity-50'
                }
              `}
            >
              {/* Hint Number Badge */}
              <div
                className={`
                  absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold border-2
                  ${
                    isUnlocked
                      ? 'bg-yellow-bright text-stage-dark border-yellow-bright'
                      : 'bg-stage-dark text-muted border-border'
                  }
                `}
              >
                {hint.level}
              </div>

              {/* Content */}
              {isUnlocked ? (
                <div>
                  <h4 className="text-sm font-bold text-yellow-bright mb-2">
                    {hint.title}
                  </h4>
                  <div className="text-white">{hint.content}</div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <span className="text-muted">
                    {isAvailable
                      ? `Hint ${hint.level} - Locked`
                      : `Unlocks after ${index} ${
                          index === 1 ? 'guess' : 'guesses'
                        }`}
                  </span>
                </div>
              )}

              {/* Lock Icon */}
              {!isUnlocked && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl text-muted">
                  🔒
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progressive Hint Info */}
      {guesses.length < GAME_CONFIG.MAX_ATTEMPTS && (
        <p className="text-center text-sm text-muted mt-4">
          Make a guess to unlock the next hint!
        </p>
      )}
    </div>
  );
}