'use client';

import { useEffect, useState } from 'react';

interface TemperatureGaugeProps {
  percentOff: number;
  isVisible: boolean;
}

export function TemperatureGauge({ percentOff, isVisible }: TemperatureGaugeProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Animate the gauge fill
      const timer = setTimeout(() => {
        setAnimatedPercent(percentOff);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercent(0);
    }
  }, [percentOff, isVisible]);

  const getTemperatureLevel = () => {
    if (percentOff >= 50) return { level: 'ice-cold', color: '#60A5FA', label: 'Ice Cold' };
    if (percentOff >= 30) return { level: 'cold', color: '#3B82F6', label: 'Cold' };
    if (percentOff >= 15) return { level: 'warm', color: '#FCD34D', label: 'Warm' };
    if (percentOff >= 5) return { level: 'hot', color: '#FB923C', label: 'Hot' };
    return { level: 'burning', color: '#EF4444', label: 'Burning!' };
  };

  const temp = getTemperatureLevel();
  const fillHeight = Math.min(100, Math.max(5, 100 - animatedPercent * 2)); // Inverted - closer = fuller

  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Temperature Label */}
      <div className="text-sm font-bold" style={{ color: temp.color }}>
        {temp.label}
      </div>

      {/* Thermometer */}
      <div className="relative w-12 h-32 bg-stage-dark rounded-full border-2 border-border overflow-hidden">
        {/* Temperature fill */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
          style={{
            height: `${fillHeight}%`,
            backgroundColor: temp.color,
            boxShadow: `inset 0 0 10px rgba(255,255,255,0.3)`,
          }}
        >
          {/* Animated bubbles for hot temperatures */}
          {percentOff < 15 && (
            <div className="absolute inset-0">
              <div
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  animation: 'bubble 2s infinite',
                  left: '20%',
                  animationDelay: '0s',
                }}
              />
              <div
                className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
                style={{
                  animation: 'bubble 2s infinite',
                  left: '50%',
                  animationDelay: '0.5s',
                }}
              />
              <div
                className="absolute w-2.5 h-2.5 bg-white/25 rounded-full"
                style={{
                  animation: 'bubble 2s infinite',
                  left: '70%',
                  animationDelay: '1s',
                }}
              />
            </div>
          )}
        </div>

        {/* Temperature markers */}
        <div className="absolute inset-0 flex flex-col justify-between py-2">
          {[100, 75, 50, 25, 0].map((mark) => (
            <div
              key={mark}
              className="w-full h-[1px] bg-border/50"
              style={{ opacity: mark === 0 || mark === 100 ? 0 : 1 }}
            />
          ))}
        </div>
      </div>

      {/* Percentage display */}
      <div className="text-xs font-mono font-bold text-muted">
        {percentOff.toFixed(1)}% off
      </div>

      <style jsx>{`
        @keyframes bubble {
          0% {
            bottom: 0;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: 100%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}