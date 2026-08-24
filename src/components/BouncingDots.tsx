import React from 'react';

interface BouncingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BouncingDots: React.FC<BouncingDotsProps> = ({
  size = 'md',
  className = '',
}) => {
  const dotSizes = {
    sm: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  }[size];

  const shadowSizes = {
    sm: 'w-2.5 h-1 sm:w-3 sm:h-1',
    md: 'w-4 h-1.5 sm:w-5 sm:h-1.5',
    lg: 'w-5 h-2 sm:w-6 sm:h-2',
  }[size];

  const gapSize = {
    sm: 'gap-2',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-5',
  }[size];

  // 5 Dots in custom official emerald gradient colors
  const dots = [
    {
      id: 1,
      bg: 'bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-[0_0_15px_rgba(52,211,153,0.8)]',
      bounceClass: 'animate-wave-bounce-1',
      shadowClass: 'animate-wave-shadow-1',
    },
    {
      id: 2,
      bg: 'bg-gradient-to-tr from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]',
      bounceClass: 'animate-wave-bounce-2',
      shadowClass: 'animate-wave-shadow-2',
    },
    {
      id: 3,
      bg: 'bg-gradient-to-tr from-teal-400 to-emerald-400 shadow-[0_0_15px_rgba(45,212,191,0.8)]',
      bounceClass: 'animate-wave-bounce-3',
      shadowClass: 'animate-wave-shadow-3',
    },
    {
      id: 4,
      bg: 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]',
      bounceClass: 'animate-wave-bounce-4',
      shadowClass: 'animate-wave-shadow-4',
    },
    {
      id: 5,
      bg: 'bg-gradient-to-tr from-teal-300 to-emerald-300 shadow-[0_0_15px_rgba(94,234,212,0.8)]',
      bounceClass: 'animate-wave-bounce-5',
      shadowClass: 'animate-wave-shadow-5',
    },
  ];

  return (
    <div className={`flex items-end justify-center ${gapSize} py-6 ${className}`}>
      {dots.map((dot) => (
        <div key={dot.id} className="flex flex-col items-center">
          {/* Bouncing Dot */}
          <div
            className={`${dotSizes} rounded-full ${dot.bg} ${dot.bounceClass} border border-emerald-200/30`}
          />
          {/* Ground Soft Shadow */}
          <div
            className={`${shadowSizes} bg-emerald-950/80 rounded-full blur-[2px] mt-2 ${dot.shadowClass}`}
          />
        </div>
      ))}
    </div>
  );
};
