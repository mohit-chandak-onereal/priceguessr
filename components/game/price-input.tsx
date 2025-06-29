'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useGameStore } from '@/lib/store/game-store';

export function PriceInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const { currentGuess, setCurrentGuess, makeGuess, error, attemptsRemaining, guesses } = useGameStore();
  
  // Sync display value with current guess on mount and when guess changes
  useEffect(() => {
    if (currentGuess) {
      const parts = currentGuess.split('.');
      const formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  }, [currentGuess]);
  
  // Shake on error
  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentGuess.trim()) {
      makeGuess();
    } else {
      // Shake if empty
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove commas for processing
    value = value.replace(/,/g, '');
    
    // Remove all non-numeric characters except decimal
    value = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to reasonable price length (billions - for art pieces worth $850M+)
    if (parts[0].length > 12) {
      return;
    }
    
    // Update both the raw value and display value
    setCurrentGuess(value);
    
    // Format with commas for display
    if (value) {
      const formatted = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '');
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  };

  return (
    <div className="relative">
      {/* Attempts counter in top corner */}
      <div
        className={`
          absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center
          text-sm font-bold border-2 z-20
          ${
            attemptsRemaining > 3
              ? 'bg-green-bright text-white border-green-bright'
              : attemptsRemaining > 1
              ? 'bg-yellow-bright text-stage-dark border-yellow-bright'
              : 'bg-red-bright text-white border-red-bright animate-pulse'
          }
        `}
      >
        {guesses.length}/6
      </div>

      <form onSubmit={handleSubmit} className="relative panel-game-show p-4">
        <div className="flex items-center gap-4">
          {/* Label */}
          <h3 className="text-lg font-bold text-game-show text-yellow-bright whitespace-nowrap">
            GUESS
          </h3>

          {/* Price Input */}
          <div className={`
            price-display text-xl md:text-2xl flex-1 px-4 py-2
            transition-all duration-200 flex items-center
            ${isFocused ? 'border-yellow-bright shadow-lg shadow-yellow-bright/50' : ''}
            ${error ? 'border-red-bright shadow-lg shadow-red-bright/50' : ''}
            ${shake ? 'shake-input' : ''}
          `}>
            <span className="text-yellow-bright mr-2">$</span>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9,]*\.?[0-9]*"
              value={displayValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="0"
              className="bg-transparent outline-none text-green-bright font-mono flex-1"
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!currentGuess.trim()}
            className="btn-game-show text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            SUBMIT
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center mt-2">
            <span className="text-xs text-red-bright">{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}