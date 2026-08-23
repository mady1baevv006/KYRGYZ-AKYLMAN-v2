import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Calculator, Award, Zap } from 'lucide-react';

interface CreativeLoaderProps {
  text?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen' | 'page';
  showQuotes?: boolean;
}

const ORT_MOTIVATIONAL_QUOTES = [
  '🎯 Максат: 210+ балл жана Алтын сертификат',
  '⚡ Логика жана тактык — ОРТда жогорку баллдын ачкычы',
  '📚 Ар бир суроону кунт коюп окуп, тузактардан сак бол',
  '💎 Кыргыз Акылман — сенин ишенимдүү өнөктөшүң',
  '🏆 Математика — бардык так илимдердин башаты',
];

export const CreativeLoader: React.FC<CreativeLoaderProps> = ({
  text = 'Жүктөлүүдө...',
  subtext,
  size = 'fullscreen',
  showQuotes = true,
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    if (!showQuotes) return;
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % ORT_MOTIVATIONAL_QUOTES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [showQuotes]);

  if (size === 'fullscreen' || size === 'page') {
    const isFixed = size === 'fullscreen';
    return (
      <div
        className={`${
          isFixed ? 'fixed inset-0 z-[100]' : 'min-h-[70vh] w-full'
        } flex flex-col items-center justify-center bg-[#031510]/95 backdrop-blur-xl text-white p-4 select-none animate-in fade-in duration-300 overflow-hidden`}
      >
        {/* Glowing Dynamic Orbs & Mesh */}
        <div className="absolute w-96 h-96 rounded-full bg-emerald-500/15 blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute w-80 h-80 rounded-full bg-teal-400/10 blur-[80px] pointer-events-none -translate-y-12" />
        <div className="absolute w-64 h-64 rounded-full bg-emerald-600/10 blur-[70px] pointer-events-none translate-y-16" />

        {/* Orbit Rings & Mathematical Core */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
          {/* Outer Dashed Spinning Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40 animate-[spin_12s_linear_infinite]" />
          
          {/* Outer Orbit Glowing Particles */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/60 text-[11px] font-mono font-black text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse">
            π
          </div>
          <div className="absolute top-1/2 -right-4 -translate-y-1/2 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-teal-500/60 text-[11px] font-mono font-black text-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.5)]">
            ∑
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-400/60 text-[11px] font-mono font-black text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)] animate-pulse">
            √x
          </div>
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-teal-400/60 text-[11px] font-mono font-black text-teal-200 shadow-[0_0_12px_rgba(45,212,191,0.5)]">
            ∫
          </div>

          {/* Middle Counter-Rotating Pulse Ring */}
          <div className="absolute inset-3 rounded-full border border-teal-400/50 animate-[spin_7s_linear_infinite_reverse]" />
          
          {/* Inner Glowing Ring */}
          <div className="absolute inset-6 rounded-full border-2 border-emerald-400/70 shadow-lg shadow-emerald-500/40 animate-pulse" />

          {/* Inner Corner Diamonds */}
          <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400/80 animate-ping">✦</div>
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-teal-400/80 animate-ping">✦</div>

          {/* Central Logo Symbol */}
          <div className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-[#06261d] via-[#093527] to-[#0d4a37] border-2 border-emerald-400/80 flex items-center justify-center text-emerald-300 shadow-2xl shadow-emerald-500/50 transform hover:scale-105 transition-transform">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 animate-pulse" />
            <BookOpen className="w-10 h-10 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
        </div>

        {/* Text & Stage Indicator */}
        <div className="text-center space-y-3 relative z-10 max-w-md px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-emerald-950/80">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{text}</span>
          </div>

          {subtext && (
            <p className="text-xs sm:text-sm text-emerald-200/80 font-medium">
              {subtext}
            </p>
          )}

          {/* Animated Cycling Quote */}
          {showQuotes && (
            <div className="min-h-[2.5rem] flex items-center justify-center">
              <p className="text-xs sm:text-sm text-emerald-300/90 font-semibold italic bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-800/60 transition-all duration-300 animate-in fade-in">
                {ORT_MOTIVATIONAL_QUOTES[quoteIdx]}
              </p>
            </div>
          )}

          {/* Animated Emerald Progress Bar */}
          <div className="w-52 sm:w-64 h-1.5 bg-[#020e0a] rounded-full mx-auto overflow-hidden border border-emerald-800/70 mt-2 shadow-inner">
            <div className="w-full h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-400 rounded-full animate-[shimmer_1.5s_infinite_linear] origin-left shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
        </div>
      </div>
    );
  }

  // Inline / Document Box Loader (used for switching tabs or loading documents)
  return (
    <div className="py-10 px-6 flex flex-col items-center justify-center rounded-3xl bg-[#041a14]/90 border border-emerald-800/60 text-center text-white my-4 relative overflow-hidden">
      <div className="absolute w-40 h-40 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative w-16 h-16 flex items-center justify-center mb-3">
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

