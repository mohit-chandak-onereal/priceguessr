import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        {/* Marquee Lights Border */}
        <div className="absolute inset-0 marquee-lights opacity-30" />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main Title */}
            <div className="mb-8 relative">
              <h1 className="text-5xl md:text-7xl font-bold text-game-show text-white mb-4">
                <span className="block">COME ON DOWN!</span>
                <span className="block text-3xl md:text-5xl mt-2 text-yellow-bright">You&apos;re the next contestant on</span>
              </h1>
              <div className="text-6xl md:text-8xl font-bold mt-4">
                <span className="gradient-text text-outline">PRICEGUESSR</span>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 font-semibold">
              Can you guess the actual retail price? Win fabulous prizes!*
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/play"
                className="btn-game-show text-white relative"
              >
                <span className="relative z-10">PLAY NOW!</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-bright to-orange-bright rounded-lg blur opacity-75 animate-pulse"></div>
              </Link>
              <Link
                href="/play/daily"
                className="panel-game-show px-8 py-4 font-bold text-lg hover:transform hover:scale-105 transition-all"
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

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-game-show text-white">
            <span className="star-decoration">HOW TO PLAY</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="panel-game-show p-8 hover:transform hover:scale-105 transition-all spotlight">
              <div className="text-6xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-yellow-bright text-game-show">GUESS RIGHT!</h3>
              <p className="text-center text-lg">
                You get 6 chances to guess within 5% of the actual retail price!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="panel-game-show p-8 hover:transform hover:scale-105 transition-all spotlight">
              <div className="text-6xl mb-4 text-center">💡</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-green-bright text-game-show">GET HINTS!</h3>
              <p className="text-center text-lg">
                Each guess reveals more clues about the fabulous item!
              </p>
            </div>

            {/* Feature 3 */}
            <div className="panel-game-show p-8 hover:transform hover:scale-105 transition-all spotlight">
              <div className="text-6xl mb-4 text-center">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-center text-orange-bright text-game-show">WIN BIG!</h3>
              <p className="text-center text-lg">
                Beat your friends and climb to the top of the leaderboard!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gradient-to-b from-transparent via-stage-dark/20 to-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-game-show text-white">
            FABULOUS SHOWCASES
          </h2>
          <p className="text-center text-xl mb-12 text-yellow-bright">Choose your category and play for incredible prizes!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                className="group relative panel-game-show aspect-square hover:transform hover:scale-110 transition-all"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className={`w-20 h-20 ${category.color} rounded-full flex items-center justify-center mb-3 group-hover:animate-bounce`}>
                    <span className="text-4xl">{category.emoji}</span>
                  </div>
                  <span className="font-bold text-center text-sm md:text-base text-game-show">{category.name}</span>
                </div>
                <div className="absolute top-2 right-2 text-yellow-bright text-sm font-bold animate-pulse">NEW!</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
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
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-bright via-orange-bright to-yellow-bright animate-marquee" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-bright via-orange-bright to-yellow-bright animate-marquee" style={{ animationDelay: '-10s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-game-show text-white">
              <span className="block">THE SHOWCASE</span>
              <span className="block text-3xl md:text-4xl text-yellow-bright mt-2">SHOWDOWN AWAITS!</span>
            </h2>
            <p className="text-xl md:text-2xl text-muted mb-10 font-semibold">
              Join thousands of contestants competing for the ultimate prize!
            </p>
            
            {/* Big CTA Button */}
            <div className="relative inline-block">
              <Link
                href="/play"
                className="relative inline-block"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-bright via-orange-bright to-yellow-bright rounded-xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative btn-game-show text-white text-xl md:text-2xl px-12 py-6">
                  <span className="relative z-10">COME ON DOWN!</span>
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <span className="text-yellow-bright text-3xl animate-spin-slow inline-block">★</span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-yellow-bright">
              <div className="text-center">
                <div className="text-3xl font-bold text-game-show">10,000+</div>
                <div className="text-sm uppercase">Players</div>
              </div>
              <div className="text-2xl animate-pulse">★</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-game-show">50,000+</div>
                <div className="text-sm uppercase">Games Played</div>
              </div>
              <div className="text-2xl animate-pulse">★</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-game-show">$1M+</div>
                <div className="text-sm uppercase">Virtual Prizes</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}