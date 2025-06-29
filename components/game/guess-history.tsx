'use client';

import { useGameStore } from '@/lib/store/game-store';

function getHintMessage(percentOff: number, index: number): string {
  const messages = {
    farOff: [
      "Way off!",
      "Not even close!",
      "Miles away!",
      "Keep trying!",
      "Far from it!"
    ],
    stillOff: [
      "Getting warmer",
      "Still searching",
      "Keep going",
      "Not quite there",
      "Getting closer"
    ],
    close: [
      "Almost there!",
      "So close!",
      "Nearly got it!",
      "Just a bit more!",
      "You're burning up!"
    ]
  };
  
  let messageArray;
  if (percentOff >= 40) {
    messageArray = messages.farOff;
  } else if (percentOff >= 25) {
    messageArray = messages.stillOff;
  } else if (percentOff >= 10) {
    messageArray = messages.close;
  } else {
    return "Soo close!";
  }
  
  return messageArray[index % messageArray.length];
}

export function GuessHistory() {
  const { guesses, currentItem } = useGameStore();

  if (!currentItem) return null;

  const actualPrice = currentItem.price;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-center text-yellow-bright text-game-show mb-3 flex-shrink-0">
        YOUR GUESSES
      </h3>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2">
        {/* Always show 6 slots */}
        {Array.from({ length: 6 }, (_, index) => {
          const guess = guesses[index];
          
          if (!guess) {
            // Show placeholder for unused slots
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border-2 border-border/30 bg-stage-dark/10 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-stage-dark/50 text-muted border-2 border-border/50">
                    {index + 1}
                  </div>
                  <div className="text-lg text-muted/50">
                    Not Used
                  </div>
                </div>
              </div>
            );
          }
          
          const difference = guess.value - actualPrice;
          const isHigher = difference > 0;
          const percentOff = Math.abs((difference / actualPrice) * 100);

          return (
            <div
              key={index}
              className={`
                flex items-center justify-between p-3 rounded-lg border-2 text-sm transition-all
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

                {/* Price or Missed Turn */}
                <div className="text-xl font-mono font-bold text-white">
                  {guess.isMissedTurn ? 'Missed Turn' : `$${guess.value.toLocaleString()}`}
                </div>
              </div>

              {/* Feedback */}
              <div className="text-right">
                {guess.isMissedTurn ? (
                  <div className="flex items-center gap-2">
                    <span className="text-muted font-bold">⏱️ Time Out</span>
                  </div>
                ) : guess.isWithinRange ? (
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
                        {isHigher ? '↑' : '↓'} {getHintMessage(percentOff, index)}
                      </span>
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