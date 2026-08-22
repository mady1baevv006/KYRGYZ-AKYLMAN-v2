import React from 'react';
import { Sparkles, BookOpen, Compass, Calculator } from 'lucide-react';

interface CreativeLoaderProps {
  text?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export const CreativeLoader: React.FC<CreativeLoaderProps> = ({
  text = 'Жүктөлүүдө...',
  subtext = 'ОРТ материалдары даярдалууда',
  size = 'fullscreen',
}) => {
  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#041a14] text-white p-4 select-none">
        {/* Glowing Orbs */}
        <div className="absolute w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute w-60 h-60 rounded-full bg-teal-500/15 blur-2xl pointer-events-none" />

        {/* Orbit Rings & Mathematical Core */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          {/* Outer Rotating Dotted Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40 animate-[spin_10s_linear_infinite]" />
          {/* Middle Counter-Rotating Pulse Ring */}
          <div className="absolute inset-2 rounded-full border border-teal-400/50 animate-[spin_6s_linear_infinite_reverse]" />
          {/* Inner Glowing Ring */}
          <div className="absolute inset-4 rounded-full border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/30 animate-pulse" />

          {/* Floating Mathematical Particles */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-mono font-black text-emerald-300 animate-bounce">
            π
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-xs font-mono font-black text-teal-300 animate-pulse">
            ∑
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono font-black text-emerald-400 animate-bounce">
            √x
          </div>
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-xs font-mono font-black text-teal-200 animate-pulse">
            Δ
          </div>

          {/* Central Logo Symbol */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/40">
            <BookOpen className="w-8 h-8 text-slate-950 animate-pulse" />
          </div>
        </div>

        {/* Text & Stage Indicator */}
        <div className="text-center space-y-2 relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>{text}</span>
          </div>

          {subtext && (
            <p className="text-xs sm:text-sm text-emerald-200/70 font-medium animate-pulse">
              {subtext}
            </p>
          )}

          {/* Animated Emerald Progress Bar */}
          <div className="w-48 h-1.5 bg-emerald-950/80 rounded-full mx-auto overflow-hidden border border-emerald-800/60 mt-3">
            <div className="w-full h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 rounded-full animate-[shimmer_1.5s_infinite_linear] origin-left" />
          </div>
        </div>
      </div>
    );
  }

  // Inline / Document Box Loader (used for switching tabs or loading documents)
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center rounded-3xl bg-[#041a14]/90 border border-emerald-800/60 text-center text-white my-4 relative overflow-hidden">
      <div className="absolute w-40 h-40 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative w-20 h-20 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border border-dashed border-emerald-400/40 animate-[spin_8s_linear_infinite]" />
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Calculator className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      <h4 className="text-sm font-black text-white">{text}</h4>
      {subtext && <p className="text-xs text-emerald-200/60 mt-1">{subtext}</p>}
    </div>
  );
};
