'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { StatsOverview } from '@/components/stats/stats-overview';
import { CategoryStats } from '@/components/stats/category-stats';
import { AchievementsList } from '@/components/stats/achievements-list';
import Link from 'next/link';

export default function StatsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-game-show text-white mb-3 sm:mb-4">
            <span className="star-decoration">YOUR STATISTICS</span>
          </h1>
          <p className="text-base sm:text-xl text-yellow-bright px-4">
            Track your progress and achievements!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <StatsOverview />
        </div>

        {/* Category Performance */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-game-show text-white text-center mb-6">
            CATEGORY PERFORMANCE
          </h2>
          <CategoryStats />
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-game-show text-white text-center mb-6">
            ACHIEVEMENTS
          </h2>
          <AchievementsList />
        </div>

        {/* Back to Play */}
        <div className="text-center mt-12">
          <Link
            href="/play"
            className="btn-game-show text-white"
          >
            CONTINUE PLAYING
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}