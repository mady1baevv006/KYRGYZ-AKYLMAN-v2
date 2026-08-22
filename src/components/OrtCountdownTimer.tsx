import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { AppLanguage } from '../types';

interface OrtCountdownTimerProps {
  lang?: AppLanguage;
  className?: string;
}

export const OrtCountdownTimer: React.FC<OrtCountdownTimerProps> = ({
  lang = 'ru',
  className = '',
}) => {
  const isKg = lang === 'kg';

  // Target: May 16, 2027 at 09:00:00 local time (UTC+6 Bishkek)
  const TARGET_DATE = new Date('2027-05-16T09:00:00+06:00').getTime();

  const calculateDaysLeft = (target: number): number => {
    const difference = target - Date.now();
    if (difference <= 0) {
      return 0;
    }
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  const [daysLeft, setDaysLeft] = useState<number>(() => calculateDaysLeft(TARGET_DATE));

  useEffect(() => {
    setDaysLeft(calculateDaysLeft(TARGET_DATE));
    const timer = setInterval(() => {
      setDaysLeft(calculateDaysLeft(TARGET_DATE));
    }, 1000 * 60);

    return () => clearInterval(timer);
  }, [TARGET_DATE]);

  return (
    <div
      className={`relative flex flex-col justify-between items-center rounded-2xl bg-[#05261c] border border-emerald-800/50 p-4 sm:p-5 shadow-lg shadow-black/30 text-center overflow-hidden transition-all group hover:border-emerald-700/80 ${className}`}
    >
      {/* Subtle ambient light glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 pb-2 border-b border-emerald-900/50 w-full">
        <div className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-xs">
          <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-300">
          {isKg ? 'ЖРТга чейин калды:' : 'До ОРТ осталось:'}
        </span>
      </div>

      {/* Center: Single Days Box */}
      <div className="relative z-10 my-auto py-2 w-full">
        <div className="bg-[#031812]/90 border border-emerald-700/60 rounded-xl p-3 sm:p-4 shadow-inner flex flex-col items-center justify-center">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-[0_0_14px_rgba(16,185,129,0.6)]">
            {daysLeft}
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-wider mt-1">
            {isKg ? 'Күн' : 'Дней'}
          </div>
        </div>
      </div>
    </div>
  );
};
