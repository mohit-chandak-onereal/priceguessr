'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PriceInput } from './price-input';
import { GameTimer } from './game-timer';
import { useGameStore } from '@/lib/store/game-store';
import { soundManager } from '@/utils/sound-manager';

export function GameControl() {
  const [gameStarted, setGameStarted] = useState(false);
  const { gameStatus, startNewGame, currentItem, resetGame } = useGameStore();
  const router = useRouter();
  
  const handleStartGame = () => {
    setGameStarted(true);
    soundManager.play('correct');
  };

  const handlePlayAgain = () => {
    if (currentItem?.category_id) {
      startNewGame(currentItem.category_id);
      setGameStarted(false);
    }
  };

  const handleBackToCategories = () => {
    resetGame();
    router.push('/play');
  };

  // Show play again button when game is over
  if (gameStatus !== 'playing') {
    return (
      <div className="panel-game-show p-6 sm:p-8 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-yellow-bright mb-4">
          {gameStatus === 'won' ? '🎉 WINNER! 🎉' : 'GAME OVER'}
        </h3>
        <p className="text-white/80 mb-6">
          {gameStatus === 'won' 
            ? 'Great job! Want to try another one?' 
            : 'Better luck next time! Ready for another round?'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePlayAgain}
            className="btn-game-show text-white text-lg px-6 py-3 animate-pulse"
          >
            PLAY AGAIN!
          </button>
          <button
            onClick={handleBackToCategories}
            className="px-6 py-3 bg-stage-dark hover:bg-surface-hover text-white rounded-lg font-bold transition-all border-2 border-border hover:border-yellow-bright text-lg"
          >
            NEW CATEGORY
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="panel-game-show p-6 sm:p-8 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-yellow-bright mb-4">
          READY TO GUESS?
        </h3>
        <p className="text-white/80 mb-6">
          You have 6 attempts to guess within 5% of the actual price!
        </p>
        <button
          onClick={handleStartGame}
          className="btn-game-show text-white text-xl px-8 py-4 animate-pulse"
        >
          START NOW!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GameTimer />
      <PriceInput />
    </div>
  );
}