'use client';

import { useState, FormEvent } from 'react';
import { useGameStore } from '@/lib/store/game-store';

export function PriceInput() {
  const [isFocused, setIsFocused] = useState(false);
  const { currentGuess, setCurrentGuess, makeGuess, error } = useGameStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentGuess.trim()) {
      makeGuess();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCurrentGuess(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-game-show text-yellow-bright">
          WHAT&apos;S YOUR GUESS?
        </h3>
      </div>

      <div className="relative">
        {/* Price Display Container */}
        <div className={`
          price-display text-3xl md:text-4xl text-center p-6
          transition-all duration-200
          ${isFocused ? 'border-yellow-bright shadow-lg shadow-yellow-bright/50' : ''}
          ${error ? 'border-red-bright shadow-lg shadow-red-bright/50' : ''}
        `}>
          <span className="text-yellow-bright mr-2">$</span>
          <input
            type="text"
            value={currentGuess}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0.00"
            className="bg-transparent outline-none text-green-bright font-mono inline-block w-auto min-w-[200px]"
            style={{ width: `${Math.max(200, currentGuess.length * 25)}px` }}
            autoFocus
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <span className="text-sm text-red-bright">{error}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-center mt-12">
        <button
          type="submit"
          disabled={!currentGuess.trim()}
          className="btn-game-show text-white text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          MAKE YOUR GUESS!
        </button>
      </div>
    </form>
  );
}