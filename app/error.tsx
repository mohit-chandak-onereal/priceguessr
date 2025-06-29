'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="panel-game-show max-w-md w-full p-6 text-center">
        <div className="text-6xl mb-4">🎲</div>
        <h2 className="text-2xl font-bold text-game-show text-red-bright mb-2">
          OOPS! TECHNICAL DIFFICULTIES
        </h2>
        <p className="text-muted mb-6">
          We're experiencing some technical issues. Please stand by...
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-game-show text-white px-6 py-2"
          >
            TRY AGAIN
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-stage-dark hover:bg-surface-hover text-white rounded-lg font-bold transition-all border-2 border-border hover:border-yellow-bright"
          >
            GO HOME
          </button>
        </div>
      </div>
    </div>
  );
}