'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useGameStore } from '@/lib/store/game-store';
import { getItemImageUrl } from '@/utils/image-utils';

interface ItemImageProps {
  imageUrl: string;
  itemName: string;
  itemId?: string;
  imageIndex?: number;
}

export function ItemImage({ imageUrl, itemName, itemId, imageIndex = 0 }: ItemImageProps) {
  const [imageError, setImageError] = useState(false);
  const { hintsRevealed, gameStatus } = useGameStore();
  
  // Calculate blur amount based on hints revealed
  const getBlurAmount = () => {
    if (gameStatus === 'won' || gameStatus === 'lost') return 0;
    
    switch (hintsRevealed) {
      case 1: return 20;
      case 2: return 15;
      case 3: return 10;
      case 4: return 6;
      case 5: return 3;
      case 6: return 0;
      default: return 20;
    }
  };
  
  const blurAmount = getBlurAmount();
  const isRevealed = blurAmount === 0;
  
  // Use our image API if itemId is provided, otherwise use the direct URL
  const imageSrc = itemId ? getItemImageUrl(itemId, imageIndex) : imageUrl;

  // Fallback for broken images
  if (imageError) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-yellow-bright shadow-2xl bg-stage-dark">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-muted">Image unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border-4 border-yellow-bright shadow-2xl">
      {/* Main image with blur effect */}
      <div className="relative w-full h-full">
        {itemId ? (
          // Use regular img tag for database images (API routes)
          <img
            src={imageSrc}
            alt={itemName}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            style={{ 
              filter: `blur(${blurAmount}px)`,
              transform: isRevealed ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={(e) => {
              console.error('Image load error:', e, 'Source:', imageSrc);
              setImageError(true);
            }}
          />
        ) : (
          // Use Next Image for external URLs
          <Image
            src={imageSrc}
            alt={itemName}
            fill
            className="object-cover transition-all duration-500"
            style={{ 
              filter: `blur(${blurAmount}px)`,
              transform: isRevealed ? 'scale(1.05)' : 'scale(1)',
            }}
            onError={(e) => {
              console.error('Image load error:', e, 'Source:', imageSrc);
              setImageError(true);
            }}
            priority
            unoptimized
          />
        )}
      </div>
      
      {/* Overlay effects */}
      {!isRevealed && (
        <>
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Status text */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
              <p className="text-yellow-bright font-bold text-sm mb-1">
                IMAGE OBSCURED
              </p>
              <p className="text-white/80 text-xs">
                {6 - hintsRevealed} more hints to full reveal
              </p>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < hintsRevealed
                        ? 'bg-yellow-bright'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Win/Loss overlay */}
      {isRevealed && gameStatus !== 'playing' && (
        <div className="absolute top-4 right-4">
          <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
            gameStatus === 'won' 
              ? 'bg-green-bright text-white' 
              : 'bg-red-bright text-white'
          }`}>
            {gameStatus === 'won' ? '✓ REVEALED' : '✗ GAME OVER'}
          </div>
        </div>
      )}
    </div>
  );
}