'use client';

import { useGameStore } from '@/lib/store/game-store';

export function GuessHistory() {
  const { guesses, currentItem } = useGameStore();

  if (!currentItem || guesses.length === 0) return null;

  const actualPrice = currentItem.price;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-center text-yellow-bright text-game-show">
        YOUR GUESSES
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {guesses.map((guess, index) => {
          const difference = guess.value - actualPrice;
          const isHigher = difference > 0;
          const percentOff = Math.abs((difference / actualPrice) * 100);

          return (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 text-sm
                ${
                  guess.isWithinRange
                    ? 'bg-green-bright/20 border-green-bright'
                    : 'bg-stage-dark/50 border-border'
                }
              `}
            >
              {/* Guess Number */}
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-bold
                    ${
                      guess.isWithinRange
                        ? 'bg-green-bright text-white'
                        : 'bg-stage-dark text-yellow-bright border-2 border-yellow-bright'
                    }
                  `}
                >
                  {index + 1}
                </div>

                {/* Price */}
                <div className="text-xl font-mono font-bold text-white">
                  ${guess.value.toLocaleString()}
                </div>
              </div>

              {/* Feedback */}
              <div className="text-right">
                {guess.isWithinRange ? (
                  <div className="flex items-center gap-2">
                    <span className="text-green-bright font-bold">WINNER!</span>
                    <span className="text-2xl">🎉</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          text-lg font-bold
                          ${isHigher ? 'text-red-bright' : 'text-blue-bright'}
                        `}
                      >
                        {isHigher ? '↑ TOO HIGH' : '↓ TOO LOW'}
                      </span>
                    </div>
                    <div className="text-sm text-muted">
                      {percentOff.toFixed(1)}% off
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}