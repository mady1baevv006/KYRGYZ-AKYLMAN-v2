import React from 'react';
import {
  Gift,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface TrialWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

export const TrialWelcomeModal: React.FC<TrialWelcomeModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
}) => {
  // Lock background scrolling when modal is active
  useBodyScrollLock(isOpen);

  const { user, subscriptionStatus } = useAuth();

  if (!isOpen || !user) return null;

  const isKg = lang === 'kg';
  const hoursLeft = subscriptionStatus.hoursRemainingInStage;
  const minutesLeft = subscriptionStatus.minutesRemainingInStage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#06291e] via-[#041e16] to-[#02130e] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/90 text-white text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Bouncing Gift Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-200 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-400/40 mx-auto mb-5 animate-bounce">
          <Gift className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950 stroke-[2.2]" />
        </div>

        {/* 2. "Gift for registration" text */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{isKg ? 'Катталуу үчүн белек!' : 'Подарок за регистрацию!'}</span>
        </div>

        {/* 3. "24-hour Premium access" text */}
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-4">
          {isKg ? '24 сааттык Премиум мүмкүнчүлүк' : '24-часовой Премиум доступ'}
        </h2>

        {/* 4. Timer */}
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400/15 border border-amber-400/50 text-amber-300 text-sm font-black shadow-inner mb-6">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>
            {isKg
              ? `Калган убакыт: ${hoursLeft} саат ${minutesLeft} мүнөт`
              : `Осталось: ${hoursLeft} ч. ${minutesLeft} мин.`}
          </span>
        </div>

        {/* 5. "Start preparation" button */}
        <div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer active:scale-95"
          >
            <span>{isKg ? 'Даярданууну баштоо' : 'Начать подготовку'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
