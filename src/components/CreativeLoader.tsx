import React from 'react';

interface CreativeLoaderProps {
  text?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen' | 'page';
  showQuotes?: boolean;
}

export const CreativeLoader: React.FC<CreativeLoaderProps> = ({
  size = 'fullscreen',
}) => {
  if (size === 'fullscreen' || size === 'page') {
    const isFixed = size === 'fullscreen';
    return (
      <div
        className={`${
          isFixed ? 'fixed inset-0 z-[100]' : 'min-h-[70vh] w-full'
        } flex items-center justify-center bg-[#031510]/95 backdrop-blur-xl select-none animate-in fade-in duration-300 overflow-hidden`}
      >
        {/* Soft background ambient glow */}
        <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse pointer-events-none" />

        {/* Concentric Animated Circles Only */}
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
          {/* Outermost Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-40 [animation-duration:3s]" />

          {/* Outer Dashed Orbit Ring (Slow Clockwise) */}
          <div className="absolute inset-1 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin-slow" />

          {/* Secondary Smooth Ring with Gradient Borders (Reverse) */}
          <div className="absolute inset-4 rounded-full border-2 border-t-emerald-400 border-r-teal-300 border-b-transparent border-l-transparent animate-spin-reverse shadow-[0_0_15px_rgba(52,211,153,0.3)]" />

          {/* Middle Dotted Ring (Clockwise) */}
          <div className="absolute inset-7 rounded-full border-2 border-dotted border-teal-400/50 animate-spin [animation-duration:4s]" />

          {/* Inner Accent Ring with Glowing Edge (Reverse Slow) */}
          <div className="absolute inset-10 rounded-full border-2 border-b-emerald-300 border-l-teal-400 border-t-transparent border-r-transparent animate-spin-reverse-slow shadow-[0_0_12px_rgba(45,212,191,0.5)]" />

          {/* Center Glowing Core Circle with Pulse */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-[0_0_25px_rgba(52,211,153,0.9)] animate-pulse" />

          {/* Orbiting Satellite Dot */}
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:2.5s]">
            <div className="w-3 h-3 rounded-full bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,0.9)] absolute -top-1.5 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Small / Box version (circles only)
  const boxDimension = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';

  return (
    <div className="py-8 px-6 flex items-center justify-center select-none relative">
      <div className={`relative flex items-center justify-center ${boxDimension}`}>
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-spin-slow" />
        <div className="absolute inset-2 rounded-full border-2 border-t-emerald-400 border-r-transparent border-b-teal-300 border-l-transparent animate-spin-reverse" />
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse" />
      </div>
    </div>
  );
};


