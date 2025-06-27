import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen retro-bg relative overflow-hidden">
      {/* Sunburst Background */}
      <div className="absolute inset-0 sunburst opacity-20" />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="text-center">
            {/* Small Title */}
            <div className="mb-4">
              <span className="text-retro-rust text-2xl sm:text-3xl md:text-4xl retro-text font-bold">
                The Ultimate
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl retro-text font-black mb-6">
              <span className="retro-title retro-shadow">PRICEGUESSR</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-retro-blue text-xl sm:text-2xl md:text-3xl retro-text mb-12">
              Can You Guess The Price?
            </p>
          </div>
        </div>
        
        {/* Wave Pattern Divider */}
        <div className="h-24 wavy-pattern relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-retro-cream/0 to-retro-cream" />
        </div>
        
        {/* Game Features */}
        <div className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🎯</div>
                <h3 className="text-2xl retro-text text-retro-rust font-bold">Test Your Skills</h3>
                <p className="text-retro-blue">
                  From grocery items to luxury goods
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-6xl">🏆</div>
                <h3 className="text-2xl retro-text text-retro-rust font-bold">Compete & Win</h3>
                <p className="text-retro-blue">
                  Climb the global leaderboard
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-6xl">⏱️</div>
                <h3 className="text-2xl retro-text text-retro-rust font-bold">Beat The Clock</h3>
                <p className="text-retro-blue">
                  15 seconds per guess, 6 attempts
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="container mx-auto px-4 mb-16">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <Link href="/play" className="group relative">
              <div className="absolute inset-0 bg-retro-yellow blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <button className="retro-button relative text-xl sm:text-2xl">
                Start Playing!
              </button>
            </Link>
            
            <Link href="/leaderboard" className="group">
              <button className="relative bg-retro-teal text-retro-cream border-4 border-retro-blue rounded-full px-8 py-4 font-black text-lg sm:text-xl retro-text shadow-[4px_4px_0px_rgb(var(--retro-blue))] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgb(var(--retro-blue))] transition-all">
                Leaderboard
              </button>
            </Link>
          </div>
        </div>
        
        {/* Bottom Pattern */}
        <div className="relative">
          <svg className="w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1200,60 1200,60 L1200,120 L0,120 Z" 
                  fill="rgb(var(--retro-orange))" opacity="0.4"/>
            <path d="M0,90 C200,60 400,120 600,90 C800,60 1000,120 1200,90 L1200,120 L0,120 Z" 
                  fill="rgb(var(--retro-rust))" opacity="0.6"/>
          </svg>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-retro-rust py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-retro-cream retro-text">10K+</div>
                <div className="text-retro-yellow retro-text text-sm">Players</div>
              </div>
              <div className="text-retro-yellow text-4xl">✦</div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-retro-cream retro-text">50K+</div>
                <div className="text-retro-yellow retro-text text-sm">Games Played</div>
              </div>
              <div className="text-retro-yellow text-4xl">✦</div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-retro-cream retro-text">100</div>
                <div className="text-retro-yellow retro-text text-sm">Real Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}