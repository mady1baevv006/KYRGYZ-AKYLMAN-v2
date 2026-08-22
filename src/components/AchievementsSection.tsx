import React, { useState } from 'react';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { UserProfile, UserTestRecord } from '../context/AuthContext';
import { ACHIEVEMENTS_LIST } from '../data/achievements';
import { AppLanguage } from '../types';

interface AchievementsSectionProps {
  user: UserProfile;
  history: UserTestRecord[];
  lang?: AppLanguage;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  user,
  history,
  lang = 'ru',
}) => {
  const isKg = lang === 'kg';
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const evaluatedAchievements = ACHIEVEMENTS_LIST.map((ach) => {
    const progress = ach.getProgress(user, history);
    const percent = Math.min(100, Math.round((progress.current / ach.maxProgress) * 100));
    return {
      ...ach,
      current: progress.current,
      isUnlocked: progress.isUnlocked,
      percent,
    };
  });

  const unlockedCount = evaluatedAchievements.filter((a) => a.isUnlocked).length;
  const totalCount = evaluatedAchievements.length;
  const overallPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = evaluatedAchievements.filter((a) => {
    if (filter === 'unlocked') return a.isUnlocked;
    if (filter === 'locked') return !a.isUnlocked;
    return true;
  });

  return (
    <div className="relative rounded-3xl bg-[#06261d] border border-emerald-800/60 p-5 sm:p-7 shadow-xl shadow-black/40 overflow-hidden space-y-5">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title & Global Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1.5">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>{isKg ? 'Жетишкендиктер' : 'Награды и достижения'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{isKg ? 'Сиздин сыйлыктар' : 'Твои награды'}</span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-xl border border-emerald-800/60">
              {unlockedCount} / {totalCount}
            </span>
          </h2>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full sm:w-44 bg-[#041a14] border border-emerald-800/60 rounded-2xl p-2.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="text-emerald-200/80">{isKg ? 'Прогресс:' : 'Прогресс:'}</span>
            <span className="text-emerald-300 font-black">{overallPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-emerald-950 overflow-hidden border border-emerald-800/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
              : 'text-emerald-300/80 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60'
          }`}
        >
          {isKg ? 'Бардыгы' : 'Все'} ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unlocked')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'unlocked'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
              : 'text-emerald-300/80 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60'
          }`}
        >
          {isKg ? 'Ачылгандар' : 'Полученные'} ({unlockedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('locked')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'locked'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
              : 'text-emerald-300/80 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60'
          }`}
        >
          {isKg ? 'Аткарылууда' : 'В процессе'} ({totalCount - unlockedCount})
        </button>
      </div>

      {/* Achievements Cards Grid (1 column on compact, 2 columns on tablet/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredAchievements.map((ach) => {
          const isUnlocked = ach.isUnlocked;

          return (
            <div
              key={ach.id}
              className={`relative flex flex-col justify-between rounded-2xl p-3.5 transition-all duration-200 border ${
                isUnlocked
                  ? 'bg-gradient-to-b from-[#07362a] to-[#042017] border-emerald-500/70 shadow-lg shadow-emerald-950/60'
                  : 'bg-[#041d16]/70 border-emerald-900/50 opacity-70 hover:opacity-90'
              }`}
            >
              <div>
                {/* Top Icon & Unlocked Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-md border shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-950 border-emerald-400/60 shadow-emerald-500/20 scale-105'
                        : 'bg-slate-900/80 border-slate-700/60 grayscale'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/60 px-2 py-0.5 rounded-lg shadow-xs">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{isKg ? 'Ачылды' : 'Получено'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-900/80 border border-slate-800 px-2 py-0.5 rounded-lg">
                      <Lock className="w-3 h-3 shrink-0" />
                      <span>{ach.percent}%</span>
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className={`text-xs sm:text-sm font-black tracking-tight leading-snug ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                  {isKg ? ach.titleKg : ach.titleRu}
                </h3>
                <p className="text-[11px] text-emerald-200/70 leading-relaxed mt-1 line-clamp-2">
                  {isKg ? ach.descKg : ach.descRu}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-3 pt-2 border-t border-emerald-900/50 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-emerald-300/80">
                  <span>{isKg ? 'Прогресс' : 'Прогресс'}</span>
                  <span>{ach.current} / {ach.maxProgress}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-emerald-950 overflow-hidden border border-emerald-900/40">
                  <div
                    className="h-full rounded-full transition-all duration-300 ${
                      isUnlocked ? 'bg-gradient-to-r from-emerald-400 to-teal-300' : 'bg-emerald-700/60'
                    }"
                    style={{ width: `${ach.percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
