'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PriceInput } from './price-input';
import { GameTimer } from './game-timer';
import { useGameStore } from '@/lib/store/game-store';
import { soundManager } from '@/utils/sound-manager';
import { motion, AnimatePresence } from 'framer-motion';

export function GameControl() {
  const [gameStarted, setGameStarted] = useState(false);
  const { gameStatus, startNewGame, currentItem, resetGame } = useGameStore();
  const router = useRouter();
  
  const handleStartGame = () => {
    setGameStarted(true);
    soundManager.play('correct');
  };

  // Sparkle effect component
  const SparkleEffect = () => (
    <>
      <motion.div
        className="absolute -top-8 -left-8 text-4xl"
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5], rotate: [0, 180, 360] }}
        transition={{ duration: 0.6 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute -top-8 -right-8 text-4xl"
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5], rotate: [0, -180, -360] }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        🌟
      </motion.div>
      <motion.div
        className="absolute -bottom-8 -left-8 text-4xl"
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5], rotate: [0, 180, 360] }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute -bottom-8 -right-8 text-4xl"
        initial={{ opacity: 0, scale: 0, rotate: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5], rotate: [0, -180, -360] }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        💫
      </motion.div>
    </>
  );

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
      <div className="panel-game-show p-6 sm:p-8 text-center" style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div>
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
      </div>
    );
  }

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="ready"
            initial={{ rotateY: 0 }}
            exit={{ rotateY: -90, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformStyle: 'preserve-3d', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            className="panel-game-show p-6 sm:p-8 text-center relative"
          >
            <div>
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
          </motion.div>
      ) : (
        <motion.div
          key="playing"
          initial={{ rotateY: 90, scale: 0.8 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d', minHeight: '280px' }}
          className="panel-game-show p-6 sm:p-8 relative overflow-visible"
        >
          {gameStarted && <SparkleEffect />}
          <div className="space-y-4 overflow-visible">
            <GameTimer />
            <PriceInput />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}