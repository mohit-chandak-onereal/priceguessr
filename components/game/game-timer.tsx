'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store/game-store';
import { soundManager } from '@/utils/sound-manager';

interface GameTimerProps {
  enabled?: boolean;
}

export function GameTimer({ enabled = true }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [showCountdown, setShowCountdown] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const { recordMissedTurn, gameStatus, attemptsRemaining } = useGameStore();
  
  useEffect(() => {
    if (gameStatus !== 'playing' || !enabled) {
      setTimeLeft(15);
      setHasTimedOut(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // Let the effect handle the timeout
        }
        
        // Play tick sound for last 5 seconds
        if (prev <= 6) {
          soundManager.play('tick');
        }
        
        // Show countdown overlay for last 3 seconds
        if (prev <= 4 && prev > 1) {
          setShowCountdown(true);
        } else {
          setShowCountdown(false);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, enabled]);

  // Handle timeout in a separate effect
  useEffect(() => {
    if (timeLeft === 0 && gameStatus === 'playing' && enabled && attemptsRemaining > 0 && !hasTimedOut) {
      // Set flag to prevent multiple timeouts
      setHasTimedOut(true);
      // Record the missed turn
      recordMissedTurn();
      // Reset timer after a small delay to ensure state updates
      setTimeout(() => {
        setTimeLeft(15);
        setShowCountdown(false);
        setHasTimedOut(false); // Reset flag for next turn
      }, 100);
    }
  }, [timeLeft, gameStatus, enabled, attemptsRemaining, hasTimedOut, recordMissedTurn]);

  // Reset timer when a new turn starts (excluding initial state)
  const guessCount = useGameStore((state) => state.guesses.length);
  const [prevGuessCount, setPrevGuessCount] = useState(0);
  
  useEffect(() => {
    // Only reset if this is a real guess (not a timed out turn)
    if (guessCount > prevGuessCount && timeLeft > 0) {
      setTimeLeft(15);
      setShowCountdown(false);
      setHasTimedOut(false); // Reset timeout flag
    }
    setPrevGuessCount(guessCount);
  }, [guessCount, prevGuessCount, timeLeft]);

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
    <>
      {/* Countdown Overlay */}
      {showCountdown && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div
            className="text-[200px] font-bold text-red-bright animate-pulse"
            style={{
              animation: 'countdownPulse 1s ease-out',
              textShadow: '0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.5)',
            }}
          >
            {timeLeft}
          </div>
        </div>
      )}
      
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-yellow-bright">TIME REMAINING</span>
          <span 
            className={`text-2xl font-bold font-mono ${timeLeft <= 5 ? 'text-red-bright' : 'text-white'}`}
            style={timeLeft <= 5 ? {
              animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              textShadow: `0 0 20px ${getColor()}, 0 0 40px ${getColor()}`
            } : {}}
          >
            0:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
      
        {/* Timer bar */}
        <div className="relative w-full h-8 bg-stage-dark rounded-full overflow-hidden border-2 border-border">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="h-full w-full" 
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                animation: timeLeft <= 5 ? 'stripeMove 0.5s linear infinite' : 'stripeMove 2s linear infinite',
              }} 
            />
          </div>
          
          {/* Progress bar with glow effect */}
          <div
            className="absolute top-0 left-0 h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: getColor(),
              boxShadow: timeLeft <= 5 ? `0 0 20px ${getColor()}, inset 0 0 10px rgba(255,255,255,0.3)` : 'none',
              filter: timeLeft <= 3 ? 'brightness(1.3)' : 'brightness(1)',
            }}
          >
            {/* Pulse effect on the edge */}
            {timeLeft <= 5 && (
              <div 
                className="absolute right-0 top-0 bottom-0 w-2 bg-white/50"
                style={{
                  animation: 'edgePulse 0.5s ease-in-out infinite',
                  filter: 'blur(4px)',
                }}
              />
            )}
          </div>
        
          {/* Timer icon with shake effect */}
          <div 
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white/70"
            style={timeLeft <= 3 ? {
              animation: 'iconShake 0.5s ease-in-out infinite',
            } : {}}
          >
            ⏱️
          </div>
          
          {/* Danger zone indicator */}
          {timeLeft <= 5 && (
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="h-full w-full border-2 border-red-bright/50 rounded-full"
                style={{
                  animation: 'dangerPulse 1s ease-in-out infinite',
                }}
              />
            </div>
          )}
        </div>
        
        <style jsx>{`
          @keyframes countdownPulse {
            0% { 
              transform: scale(0.5); 
              opacity: 0;
            }
            50% { 
              transform: scale(1); 
              opacity: 1;
            }
            100% { 
              transform: scale(1.5); 
              opacity: 0;
            }
          }
          
          @keyframes stripeMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(20px); }
          }
          
          @keyframes edgePulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          
          @keyframes iconShake {
            0%, 100% { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
            25% { transform: translateX(-50%) translateY(-50%) rotate(-5deg); }
            75% { transform: translateX(-50%) translateY(-50%) rotate(5deg); }
          }
          
          @keyframes dangerPulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    </>
  );
}