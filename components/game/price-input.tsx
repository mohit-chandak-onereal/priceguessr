'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useGameStore } from '@/lib/store/game-store';

export function PriceInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [shake, setShake] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const { currentGuess, setCurrentGuess, makeGuess, error } = useGameStore();
  
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
    
    // Limit to reasonable price length (millions)
    if (parts[0].length > 7) {
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
            className="bg-transparent outline-none text-green-bright font-mono inline-block w-auto min-w-[150px] max-w-[300px]"
            style={{ width: `${Math.max(150, Math.min(300, displayValue.length * 18))}px` }}
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