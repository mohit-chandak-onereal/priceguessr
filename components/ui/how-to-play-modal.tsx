'use client';

export function HowToPlayModal() {
  const closeModal = () => {
    const modal = document.getElementById('how-to-play-modal');
    if (modal) modal.classList.add('hidden');
  };

  return (
    <div 
      id="how-to-play-modal" 
      className="fixed inset-0 z-50 hidden"
      onClick={closeModal}
    >
      <div className="flex items-center justify-center p-4 min-h-screen">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Modal */}
        <div 
          className="relative max-w-2xl w-full animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="panel-game-show p-6 sm:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-game-show text-white">
                HOW TO PLAY
              </h2>
              <button
                onClick={closeModal}
                className="text-2xl text-white hover:text-yellow-bright transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 text-white">
              <div>
                <h3 className="text-xl font-bold text-yellow-bright mb-2">🎯 Objective</h3>
                <p>Guess the actual retail price of items within 5% accuracy to win!</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-bright mb-2">🎮 How to Play</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Choose a category from the selection screen</li>
                  <li>Look at the blurred item image and make your first guess</li>
                  <li>Enter a price and hit SUBMIT or press Enter</li>
                  <li>After each wrong guess, the image becomes clearer</li>
                  <li>You have 6 attempts to guess within 5% of the actual price</li>
                  <li>Beat the 15-second timer on each guess!</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-bright mb-2">💡 Tips</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Start with round numbers to gauge if you&apos;re too high or low</li>
                  <li>Pay attention to the brand and item details</li>
                  <li>The image reveals more with each guess - use it wisely!</li>
                  <li>Quick guesses earn bonus points</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-bright mb-2">🏆 Scoring</h3>
                <ul className="space-y-2">
                  <li><span className="text-green-bright font-bold">Perfect (100%):</span> 1000 points</li>
                  <li><span className="text-green-bright font-bold">Win in 1-2 tries:</span> 800+ points</li>
                  <li><span className="text-yellow-bright font-bold">Win in 3-4 tries:</span> 600+ points</li>
                  <li><span className="text-orange-bright font-bold">Win in 5-6 tries:</span> 400+ points</li>
                  <li><span className="text-red-bright font-bold">Time bonus:</span> Up to 200 extra points</li>
                </ul>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={closeModal}
                  className="btn-game-show text-white px-8"
                >
                  LET&apos;S PLAY!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}