'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SoundToggle } from '@/components/ui/sound-toggle';
import { useAuth } from '@/contexts/auth-context';
import { AuthModal } from '@/components/ui/auth-modal';

export function Header() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full glass overflow-visible">
      <div className="container mx-auto px-4 py-2">
        <nav className="flex items-center justify-between min-h-[4rem]">
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
            <span className="text-retro-70s text-retro-70s-small">
              <span className="star-decoration">PriceGuessr</span>
            </span>
          </Link>


          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Sound Toggle */}
            <SoundToggle />
            
            {/* User info / Auth buttons */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-white/80">
                  Welcome, <span className="font-medium text-yellow-400">{user.display_name}</span>
                </span>
                <button
                  onClick={logout}
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="btn-game-show text-white text-sm px-4 py-1"
                >
                  Sign In
                </button>
              </div>
            )}
            
            {/* Play Now Button */}
            <Link 
              href="/play" 
              className="hidden md:block btn-game-show text-white"
            >
              Play Now!
            </Link>

            {/* Mobile Menu Button - Always visible */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-lg",
                "block",
                "hover:bg-surface-hover",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
    
    {/* Mobile Menu Dropdown - Always visible when open */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
        <div className="fixed inset-0 bg-black/50" />
        <div 
          className="fixed right-0 top-16 w-64 bg-stage-dark border-l-2 border-yellow-bright shadow-2xl"
          style={{ height: 'calc(100vh - 4rem)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-4">
            <Link 
              href="/play" 
              className="block px-4 py-2 text-white hover:bg-yellow-bright/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Play
            </Link>
            <Link 
              href="/stats" 
              className="block px-4 py-2 text-white hover:bg-yellow-bright/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stats
            </Link>
            <Link 
              href="/leaderboard" 
              className="block px-4 py-2 text-white hover:bg-yellow-bright/20 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <button 
              onClick={() => {
                const modal = document.getElementById('how-to-play-modal');
                if (modal) modal.classList.remove('hidden');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-white hover:bg-yellow-bright/20 rounded-lg transition-colors"
            >
              How to Play
            </button>
            
            <hr className="border-yellow-bright/30" />
            
            {/* Auth section in mobile menu */}
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-white/80">
                  Welcome, <span className="font-medium text-yellow-bright">{user.display_name}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-white/60 hover:text-white hover:bg-yellow-bright/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAuthClick('login')}
                className="block w-full px-4 py-2 bg-yellow-bright text-stage-dark font-bold rounded-lg hover:bg-yellow-bright/80 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    
    {/* Auth Modal */}
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      mode={authMode}
    />
    </>
  );
}