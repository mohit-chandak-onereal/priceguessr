import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-20">
        {/* Marquee Lights Border */}
        <div className="absolute inset-0 marquee-lights opacity-30" />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Title */}
            <div className="mb-6 sm:mb-8 relative">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-game-show text-white mb-2 sm:mb-4">
                <span className="block">COME ON DOWN!</span>
                <span className="block text-base sm:text-xl md:text-3xl mt-1 sm:mt-2 text-yellow-bright">You&apos;re the next contestant on</span>
              </h1>
              <div className="mt-2 sm:mt-4">
                <span className="text-retro-70s text-retro-70s-large">PRICEGUESSR</span>
              </div>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-10 font-semibold px-4">
              Can you guess the actual retail price? Win fabulous prizes!*
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <Link
                href="/play"
                className="btn-game-show text-white relative w-full sm:w-auto min-w-[200px]"
              >
                <span className="relative z-10">PLAY NOW!</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-bright to-orange-bright rounded-lg blur opacity-75 animate-pulse"></div>
              </Link>
              <Link
                href="/leaderboard"
                className="panel-game-show px-6 sm:px-8 py-4 font-bold text-base sm:text-lg hover:transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                <span className="text-yellow-bright">🏆</span> LEADERBOARD <span className="text-yellow-bright">🏆</span>
              </Link>
            </div>
            
            <p className="text-sm text-muted mt-6">
              *Virtual prizes only. No actual retail value.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section with Gradient */}
      <section className="py-16 sm:py-20 md:py-24 relative">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-stage-blue via-stage-blue/95 to-stage-dark/90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-yellow-bright">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-game-show">10K+</div>
              <div className="text-sm uppercase tracking-wider">Players</div>
            </div>
            <div className="text-2xl animate-pulse hidden sm:block">★</div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-game-show">50K+</div>
              <div className="text-sm uppercase tracking-wider">Games</div>
            </div>
            <div className="text-2xl animate-pulse hidden sm:block">★</div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-game-show">100</div>
              <div className="text-sm uppercase tracking-wider">Real Items</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}