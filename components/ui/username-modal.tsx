'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store/game-store';

export function UsernameModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { setPlayerName } = useGameStore();

  useEffect(() => {
    // Check if user already has a username
    const savedUsername = localStorage.getItem('priceguessr_username');
    if (!savedUsername) {
      setIsOpen(true);
    } else {
      setPlayerName(savedUsername);
    }
  }, [setPlayerName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username - must be exactly 3 letters
    const upperUsername = username.toUpperCase().trim();
    if (upperUsername.length !== 3) {
      setError('Must be exactly 3 letters');
      return;
    }
    if (!/^[A-Z]{3}$/.test(upperUsername)) {
      setError('Only letters allowed (A-Z)');
      return;
    }

    // Save username
    localStorage.setItem('priceguessr_username', upperUsername);
    setPlayerName(upperUsername);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Modal */}
      <div className="relative max-w-md w-full animate-in zoom-in-95 duration-300">
        <div className="panel-game-show p-6 sm:p-8">
          {/* Stars decoration */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="text-3xl text-yellow-bright animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                ★
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-game-show text-white mb-2">
              WELCOME CONTESTANT!
            </h2>
            <p className="text-base sm:text-lg text-yellow-bright mb-6">
              Enter your 3-letter initials
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                    setUsername(value);
                    setError('');
                  }}
                  placeholder="ABC"
                  className="w-full px-4 py-3 bg-stage-dark border-2 border-yellow-bright rounded-lg text-white text-center text-3xl font-bold tracking-widest focus:outline-none focus:border-white"
                  autoFocus
                  maxLength={3}
                />
                {error && (
                  <p className="text-sm text-red-bright mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-game-show text-white w-full"
                disabled={!username.trim()}
              >
                START PLAYING!
              </button>
            </form>

            <p className="text-xs text-muted mt-4">
              Classic arcade style - 3 letters only!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}