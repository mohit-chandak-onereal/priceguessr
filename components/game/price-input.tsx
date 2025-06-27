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
      <div className="text-center mb-3">
        <h3 className="text-xl font-bold text-game-show text-yellow-bright">
          ENTER YOUR GUESS
        </h3>
      </div>

      <div className="relative">
        {/* Price Display Container */}
        <div className={`
          price-display text-2xl md:text-3xl text-center p-4
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
            className="bg-transparent outline-none text-green-bright font-mono inline-block w-auto min-w-[150px]"
            style={{ width: `${Math.max(150, currentGuess.length * 20)}px` }}
            autoFocus
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="text-xs text-red-bright">{error}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button
          type="submit"
          disabled={!currentGuess.trim()}
          className="btn-game-show text-white text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          SUBMIT GUESS
        </button>
      </div>
    </form>
  );
}