import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, Clock, CheckCircle2, FileEdit, ArrowRight } from 'lucide-react';
import { AppLanguage } from '../types';
import { SECTION_NAMES, SECTION_NAMES_KG } from '../data/constants';

interface ActiveDraftBannerProps {
  lang: AppLanguage;
}

interface DraftInfo {
  key: string;
  variantId: number;
  mode: string;
  targetSectionId?: number;
  customSectionsParam?: string;
  currentSection?: number;
  timeLeft?: number;
  answeredCount: number;
  totalQuestionsCount?: number;
  updatedAt?: string;
}

export const ActiveDraftBanner: React.FC<ActiveDraftBannerProps> = ({ lang }) => {
  const [draft, setDraft] = useState<DraftInfo | null>(null);
  const navigate = useNavigate();

  const loadDraft = () => {
    try {
      // 1. Try explicit last active draft
      const lastActiveRaw = localStorage.getItem('ort_last_active_draft');
      if (lastActiveRaw) {
        const parsed = JSON.parse(lastActiveRaw);
        if (parsed && parsed.answeredCount > 0) {
          setDraft(parsed);
          return;
        }
      }

      // 2. Scan all localStorage keys for drafts
      let mostRecentDraft: DraftInfo | null = null;
      let mostRecentTime = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ort_draft_variant_')) {
          try {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            const parsed = JSON.parse(raw);
            const ansCount = parsed.userAnswers ? Object.keys(parsed.userAnswers).length : (parsed.answeredCount || 0);
            if (ansCount > 0) {
              const itemTime = parsed.updatedAt ? new Date(parsed.updatedAt).getTime() : 1;
              if (itemTime > mostRecentTime) {
                mostRecentTime = itemTime;
                mostRecentDraft = {
                  key,
                  variantId: Number(parsed.variantId) || 1,
                  mode: parsed.mode || 'full',
                  targetSectionId: parsed.targetSectionId,
                  customSectionsParam: parsed.customSectionsParam,
                  currentSection: parsed.currentSection,
                  timeLeft: parsed.timeLeft,
                  answeredCount: ansCount,
                  totalQuestionsCount: parsed.totalQuestionsCount || 150,
                  updatedAt: parsed.updatedAt,
                };
              }
            }
          } catch (e) {
            // ignore corrupt entry
          }
        }
      }

      setDraft(mostRecentDraft);
    } catch (err) {
      console.error('Error checking active draft:', err);
    }
  };

  useEffect(() => {
    loadDraft();
    const handleStorage = () => loadDraft();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!draft || draft.answeredCount === 0) {
    return null;
  }

  const isKg = lang === 'kg';
  const sectionDict = isKg ? SECTION_NAMES_KG : SECTION_NAMES;

  const getModeLabel = () => {
    if (draft.mode === 'section' && draft.targetSectionId) {
      return sectionDict[draft.targetSectionId] || (isKg ? 'Бөлүм боюнча' : 'По секции');
    }
    if (draft.mode === 'custom' && draft.customSectionsParam === '1,2') {
      return isKg ? 'Математика блогу' : 'Блок Математика';
    }
    return isKg ? 'Толук ЖРТ' : 'Полный ОРТ';
  };

  const handleContinue = () => {
    let url = `/test/${draft.variantId}?mode=${draft.mode}`;
    if (draft.targetSectionId) {
      url += `&id=${draft.targetSectionId}`;
    }
    if (draft.customSectionsParam) {
      url += `&sections=${draft.customSectionsParam}`;
    }
    navigate(url);
  };

  const handleDiscard = () => {
    if (window.confirm(isKg ? 'Черновикти чын эле өчүргүңүз келеби?' : 'Вы действительно хотите удалить этот черновик?')) {
      if (draft.key) {
        localStorage.removeItem(draft.key);
      }
      localStorage.removeItem('ort_last_active_draft');
      setDraft(null);
    }
  };

  const formatTime = (seconds?: number) => {
    if (seconds === undefined || seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#072a20] via-[#093527] to-[#06241b] border-2 border-emerald-500/70 p-4 sm:p-6 shadow-xl shadow-emerald-950/40">
        {/* Glow ambient background circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          {/* Left Info: Icon & Draft Details */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <FileEdit className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse text-emerald-300" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isKg ? 'Сакталган черновик' : 'Активный черновик'}
                </span>

                <span className="text-xs sm:text-sm font-black text-white truncate">
                  ЦООМО №{draft.variantId}
                </span>

                <span className="text-[11px] font-bold text-emerald-200/80 bg-white/5 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                  {getModeLabel()}
                </span>
              </div>

              {/* Progress Counters */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs text-emerald-200/80">
                <span className="flex items-center gap-1 font-semibold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isKg ? 'Жооп берилди:' : 'Отвечено:'}{' '}
                    <strong className="text-white font-black">{draft.answeredCount}</strong>
                    {draft.totalQuestionsCount ? ` / ${draft.totalQuestionsCount}` : ''}
                  </span>
                </span>

                {draft.timeLeft !== undefined && draft.timeLeft > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-300">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>
                      {isKg ? 'Калган убакыт:' : 'Осталось:'}{' '}
                      <strong className="text-white font-mono font-bold">{formatTime(draft.timeLeft)}</strong>
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={handleDiscard}
              className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 border border-slate-700/60 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              title={isKg ? 'Черновикти өчүрүү' : 'Сбросить черновик'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isKg ? 'Тазалоо' : 'Сбросить'}</span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="flex-1 md:flex-initial py-2.5 sm:py-3 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{isKg ? 'Тестти улантуу' : 'Продолжить тест'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
