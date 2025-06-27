'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SoundToggle } from '@/components/ui/sound-toggle';

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-bright to-yellow-bright rounded-lg flex items-center justify-center transform rotate-3 shadow-lg">
                <span className="text-white font-bold text-2xl transform -rotate-3">$</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-bright rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold text-game-show text-white">
              <span className="star-decoration">PriceGuessr</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/play" 
              className="text-muted hover:text-foreground transition-colors"
            >
              Play
            </Link>
            <Link 
              href="/leaderboard" 
              className="text-muted hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
            <Link 
              href="/about" 
              className="text-muted hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Sound Toggle */}
            <SoundToggle />
            
            {/* Play Now Button */}
            <Link 
              href="/play" 
              className="hidden md:block btn-game-show text-white"
            >
              Play Now!
            </Link>

            {/* Mobile Menu Button */}
            <button
              className={cn(
                "md:hidden p-2 rounded-lg",
                "hover:bg-surface-hover",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}