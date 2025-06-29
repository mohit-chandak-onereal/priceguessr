'use client';

import { useEffect, useState } from 'react';

interface AnimatedPriceProps {
  targetPrice: number;
  duration?: number;
  onComplete?: () => void;
}

export function AnimatedPrice({ targetPrice, duration = 1500, onComplete }: AnimatedPriceProps) {
  const [displayPrice, setDisplayPrice] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const startPrice = 0;
    
    const animatePrice = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);
      
      const currentPrice = Math.floor(startPrice + (targetPrice - startPrice) * easedProgress);
      setDisplayPrice(currentPrice);
      
      if (progress < 1) {
        requestAnimationFrame(animatePrice);
      } else {
        setDisplayPrice(targetPrice);
        setIsComplete(true);
        onComplete?.();
      }
    };
    
    requestAnimationFrame(animatePrice);
  }, [targetPrice, duration, onComplete]);

  return (
    <div className={`
      text-3xl sm:text-4xl md:text-5xl font-bold text-game-show
      ${isComplete ? 'animate-pulse' : ''}
      transition-all duration-300
      break-words
    `}>
      <span className="text-yellow-bright">$</span>
      <span className={isComplete ? 'text-green-bright' : 'text-white'}>
        {displayPrice.toLocaleString()}
      </span>
    </div>
  );
}