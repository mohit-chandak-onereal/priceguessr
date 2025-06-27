import { MainLayout } from '@/components/layout/main-layout';
import Link from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-50" />
        
        {/* Content */}
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Test Your Market Knowledge</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted mb-8">
              Can you guess the price within 5%? Like Wordle meets The Price is Right!
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/play"
                className="px-8 py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50"
              >
                Play Now
              </Link>
              <Link
                href="/play/daily"
                className="px-8 py-4 bg-surface hover:bg-surface-hover border border-border rounded-lg font-semibold transition-all"
              >
                Daily Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface rounded-xl p-6 hover:bg-surface-hover transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Guess the Price</h3>
              <p className="text-muted">
                You have 6 attempts to guess the exact price of real-world items within 5% accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface rounded-xl p-6 hover:bg-surface-hover transition-colors">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progressive Hints</h3>
              <p className="text-muted">
                Get smarter hints with each guess - from basic details to specific features and market insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface rounded-xl p-6 hover:bg-surface-hover transition-colors">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compete & Share</h3>
              <p className="text-muted">
                Track your stats, climb the leaderboard, and share your results with friends!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Popular Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Real Estate', emoji: '🏠', color: 'from-blue-500 to-indigo-600' },
              { name: 'Luxury Cars', emoji: '🚗', color: 'from-red-500 to-pink-600' },
              { name: 'Tech Gadgets', emoji: '📱', color: 'from-green-500 to-teal-600' },
              { name: 'Fashion', emoji: '👗', color: 'from-purple-500 to-pink-600' },
              { name: 'Watches', emoji: '⌚', color: 'from-yellow-500 to-orange-600' },
              { name: 'Art & Collectibles', emoji: '🎨', color: 'from-indigo-500 to-purple-600' },
              { name: 'Food & Dining', emoji: '🍽️', color: 'from-orange-500 to-red-600' },
              { name: 'Travel', emoji: '✈️', color: 'from-cyan-500 to-blue-600' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/play?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-4">
                  <span className="text-4xl mb-2">{category.emoji}</span>
                  <span className="font-semibold text-center">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Test Your Skills?
          </h2>
          <p className="text-xl text-muted mb-8">
            Join thousands of players mastering the art of price guessing!
          </p>
          <Link
            href="/play"
            className="inline-block px-8 py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50"
          >
            Start Playing Now
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}