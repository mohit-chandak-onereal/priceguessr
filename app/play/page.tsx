'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CategorySelection } from '@/components/game/category-selection';
import { GameBoard } from '@/components/game/game-board';

function PlayContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');

  if (!categoryId) {
    return <CategorySelection />;
  }

  return <GameBoard categoryId={categoryId} />;
}

export default function PlayPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">
              🎮
            </div>
            <div className="text-2xl text-yellow-bright">
              <span className="inline-block">Loading game</span>
              <span className="inline-flex ml-1">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </div>
          </div>
        </div>
      }>
        <PlayContent />
      </Suspense>
    </div>
  );
}