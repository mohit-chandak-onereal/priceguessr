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
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-game-show text-white mb-2 sm:mb-4">
                <span className="block">COME ON DOWN!</span>
                <span className="block text-xl sm:text-3xl md:text-5xl mt-1 sm:mt-2 text-yellow-bright">You&apos;re the next contestant on</span>
              </h1>
              <div className="text-4xl sm:text-6xl md:text-8xl font-bold mt-2 sm:mt-4">
                <span className="gradient-text text-outline">PRICEGUESSR</span>
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
                href="/play/daily"
                className="panel-game-show px-6 sm:px-8 py-4 font-bold text-base sm:text-lg hover:transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                <span className="text-yellow-bright">★</span> DAILY SHOWCASE <span className="text-yellow-bright">★</span>
              </Link>
            </div>
            
            <p className="text-sm text-muted mt-6">
              *Virtual prizes only. No actual retail value.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent via-stage-dark/20 to-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 text-game-show text-white">
            FABULOUS SHOWCASES
          </h2>
          <p className="text-center text-base sm:text-xl mb-8 sm:mb-12 text-yellow-bright px-4">Choose your category and play for incredible prizes!</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { name: 'DREAM HOMES', emoji: '🏠', color: 'bg-blue-bright' },
              { name: 'LUXURY CARS', emoji: '🚗', color: 'bg-red-bright' },
              { name: 'TECH TREASURES', emoji: '📱', color: 'bg-green-bright' },
              { name: 'FASHION FINDS', emoji: '👗', color: 'bg-purple-bright' },
              { name: 'TIMEPIECES', emoji: '⌚', color: 'bg-orange-bright' },
              { name: 'RARE COLLECTIBLES', emoji: '🎨', color: 'bg-pink-bright' },
              { name: 'GOURMET DELIGHTS', emoji: '🍽️', color: 'bg-yellow-bright' },
              { name: 'DREAM VACATIONS', emoji: '✈️', color: 'bg-blue-bright' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/play?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative panel-game-show aspect-square hover:transform hover:scale-110 transition-all min-h-[120px] sm:min-h-[140px]"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4">
                  <div className={`w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 ${category.color} rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:animate-bounce`}>
                    <span className="text-2xl sm:text-3xl md:text-4xl">{category.emoji}</span>
                  </div>
                  <span className="font-bold text-center text-xs sm:text-sm md:text-base text-game-show leading-tight">{category.name}</span>
                </div>
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-yellow-bright text-xs sm:text-sm font-bold animate-pulse">NEW!</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-stage-dark to-stage-blue opacity-80" />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(250, 204, 21, 0.3) 0%, transparent 50%)
            `
          }} />
        </div>
        
        {/* Marquee Lights Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-yellow-bright via-orange-bright to-yellow-bright animate-marquee" />
        <div className="absolute bottom-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-yellow-bright via-orange-bright to-yellow-bright animate-marquee" style={{ animationDelay: '-10s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-game-show text-white">
              <span className="block">THE SHOWCASE</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl text-yellow-bright mt-1 sm:mt-2">SHOWDOWN AWAITS!</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted mb-8 sm:mb-10 font-semibold px-4">
              Join thousands of contestants competing for the ultimate prize!
            </p>
            
            {/* Big CTA Button */}
            <div className="relative inline-block">
              <Link
                href="/play"
                className="relative inline-block"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-bright via-orange-bright to-yellow-bright rounded-xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative btn-game-show text-white text-lg sm:text-xl md:text-2xl px-8 sm:px-12 py-4 sm:py-6">
                  <span className="relative z-10">COME ON DOWN!</span>
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <span className="text-yellow-bright text-2xl sm:text-3xl animate-spin-slow inline-block">★</span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-yellow-bright">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-game-show">10K+</div>
                <div className="text-xs sm:text-sm uppercase">Players</div>
              </div>
              <div className="text-xl sm:text-2xl animate-pulse hidden sm:block">★</div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-game-show">50K+</div>
                <div className="text-xs sm:text-sm uppercase">Games</div>
              </div>
              <div className="text-xl sm:text-2xl animate-pulse hidden sm:block">★</div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-game-show">$1M+</div>
                <div className="text-xs sm:text-sm uppercase">Prizes</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}