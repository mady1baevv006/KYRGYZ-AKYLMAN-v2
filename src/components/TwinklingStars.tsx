import React, { useMemo } from 'react';

interface StarConfig {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  color: string;
  glow: string;
  animDuration: string;
  animDelay: string;
  animType: 'twinkle' | 'pulse' | 'shimmer';
}

export const TwinklingStars: React.FC<{ density?: 'normal' | 'dense'; className?: string }> = ({
  density = 'dense',
  className = '',
}) => {
  const stars = useMemo<StarConfig[]>(() => {
    // Generate a fixed, organic constellation of twinkling stars
    const starList: StarConfig[] = [];
    const count = density === 'dense' ? 85 : 45;

    // Deterministic pseudo-random seed generator
    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      const top = (random() * 98 + 1).toFixed(2) + '%';
      const left = (random() * 98 + 1).toFixed(2) + '%';
      const sizeRand = random();
      
      let size = 1.5;
      if (sizeRand < 0.45) size = 1;
      else if (sizeRand < 0.8) size = 1.5;
      else if (sizeRand < 0.95) size = 2;
      else size = 2.5;

      const isEmerald = random() > 0.75;
      const color = isEmerald ? 'rgba(52, 211, 153, 0.9)' : 'rgba(255, 255, 255, 0.95)';
      const glow = isEmerald
        ? '0 0 8px rgba(52, 211, 153, 0.8), 0 0 16px rgba(16, 185, 129, 0.4)'
        : size >= 2
        ? '0 0 8px rgba(255, 255, 255, 0.9), 0 0 14px rgba(255, 255, 255, 0.5)'
        : '0 0 5px rgba(255, 255, 255, 0.8)';

      const animDuration = (random() * 3 + 1.8).toFixed(2) + 's';
      const animDelay = (random() * 4).toFixed(2) + 's';
      const animTypeChoice = random();
      const animType = animTypeChoice < 0.6 ? 'twinkle' : animTypeChoice < 0.85 ? 'pulse' : 'shimmer';

      starList.push({
        id: i,
        top,
        left,
        size,
        opacity: +(random() * 0.4 + 0.5).toFixed(2),
        color,
        glow,
        animDuration,
        animDelay,
        animType,
      });
    }

    return starList;
  }, [density]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none ${className}`}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: star.glow,
            opacity: star.opacity,
            animationName: 'twinkle',
            animationDuration: star.animDuration,
            animationDelay: star.animDelay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      ))}
    </div>
  );
};
