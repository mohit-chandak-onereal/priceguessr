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
          <div className="text-2xl text-yellow-bright animate-pulse">Loading game...</div>
        </div>
      }>
        <PlayContent />
      </Suspense>
    </div>
  );
}