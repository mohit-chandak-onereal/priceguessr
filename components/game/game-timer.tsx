'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store/game-store';
import { soundManager } from '@/utils/sound-manager';

export function GameTimer() {
  const [timeLeft, setTimeLeft] = useState(15);
  const { makeGuess, currentGuess, gameStatus } = useGameStore();
  
  useEffect(() => {
    if (gameStatus !== 'playing') {
      setTimeLeft(15);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - submit whatever is in the input
          if (currentGuess.trim()) {
            makeGuess();
          }
          return 15; // Reset for next round
        }
        
        // Play tick sound for last 5 seconds
        if (prev <= 6) {
          soundManager.play('tick');
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, makeGuess, currentGuess]);

  // Reset timer when a guess is made
  const guessCount = useGameStore((state) => state.guesses.length);
  useEffect(() => {
    if (guessCount > 0) {
      setTimeLeft(15);
    }
  }, [guessCount]);

  if (gameStatus !== 'playing') return null;

  // Calculate progress percentage
  const progress = (timeLeft / 15) * 100;
  
  // Calculate color based on time left
  const getColor = () => {
    if (timeLeft > 10) return 'rgb(34 197 94)'; // green-bright
    if (timeLeft > 5) return 'rgb(250 204 21)'; // yellow-bright
    return 'rgb(239 68 68)'; // red-bright
  };

  return (
    <div className={`w-full ${timeLeft <= 3 ? 'timer-warning' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-yellow-bright">TIME REMAINING</span>
        <span className={`text-2xl font-bold font-mono ${timeLeft <= 5 ? 'text-red-bright animate-pulse' : 'text-white'}`}>
          0:{timeLeft.toString().padStart(2, '0')}
        </span>
      </div>
      
      {/* Timer bar */}
      <div className="relative w-full h-8 bg-stage-dark rounded-full overflow-hidden border-2 border-border">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }} />
        </div>
        
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: getColor(),
            boxShadow: `0 0 20px ${getColor()}`,
          }}
        >
          {/* Animated glow effect */}
          <div className="absolute inset-0 animate-pulse opacity-50" style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`
          }} />
        </div>
        
        {/* Timer icon */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/70">
          ⏱️
        </div>
      </div>
      
      {timeLeft <= 5 && (
        <p className="text-center text-sm text-red-bright font-bold mt-2 animate-pulse">
          HURRY UP!
        </p>
      )}
    </div>
  );
}