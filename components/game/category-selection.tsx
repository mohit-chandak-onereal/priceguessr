'use client';

import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data';

export function CategorySelection() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-game-show text-white mb-3 sm:mb-6">
          <span className="star-decoration">SELECT YOUR SHOWCASE</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-yellow-bright px-4">
          Choose a category and test your pricing prowess!
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {mockCategories.map((category) => (
          <Link
            key={category.id}
            href={`/play?category=${category.id}`}
            className="group relative"
          >
            <div className="panel-game-show p-5 sm:p-7 h-full hover:transform hover:scale-105 transition-all spotlight min-h-[162px]">
              {/* Spotlight effect */}
              <div className="absolute -top-2 -right-2 w-14 sm:w-18 h-14 sm:h-18 bg-yellow-bright rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{category.icon}</div>
                <h2 className="text-lg sm:text-xl font-bold text-game-show text-yellow-bright mb-2">
                  {category.name.toUpperCase()}
                </h2>
                
                {/* Item count badge */}
                <div className="mt-2 sm:mt-3 px-3 sm:px-3 py-1.5 bg-stage-dark rounded-full border-2 border-yellow-bright">
                  <span className="text-xs sm:text-xs font-bold text-yellow-bright">
                    FEATURED ITEMS
                  </span>
                </div>
              </div>
              
              {/* Hover state star */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-lg sm:text-xl text-yellow-bright opacity-0 group-hover:opacity-100 transition-opacity animate-spin-slow">
                ★
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-block text-muted hover:text-yellow-bright transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}