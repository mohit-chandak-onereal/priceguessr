'use client';

import { useState } from 'react';
import { PriceInput } from './price-input';
import { GameTimer } from './game-timer';
import { useGameStore } from '@/lib/store/game-store';
import { soundManager } from '@/utils/sound-manager';

export function GameControl() {
  const [gameStarted, setGameStarted] = useState(false);
  const { gameStatus } = useGameStore();
  
  const handleStartGame = () => {
    setGameStarted(true);
    soundManager.play('correct');
  };

  if (gameStatus !== 'playing') {
    return null;
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
      {/* Timer */}
      <GameTimer />
      
      {/* Price Input */}
      <PriceInput />
    </div>
  );
}