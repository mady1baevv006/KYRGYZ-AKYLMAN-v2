import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Gift,
  Crown,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Lock,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';

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
  const { user, subscriptionStatus } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen || !user) {
      setCountdown(5);
      return;
    }

    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const isKg = lang === 'kg';
  const isLocked = countdown > 0;
  const hoursLeft = subscriptionStatus.hoursRemainingInStage;
  const minutesLeft = subscriptionStatus.minutesRemainingInStage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-[#06261d] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/90 text-white my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button with 5-second lock indicator */}
        <button
          onClick={isLocked ? undefined : onClose}
          disabled={isLocked}
          className={`absolute top-4 right-4 p-2.5 rounded-2xl transition-all ${
            isLocked
              ? 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50 flex items-center gap-1 text-xs font-mono'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer'
          }`}
          title={isLocked ? (isKg ? `${countdown} сек күтүңүз` : `Подождите ${countdown} сек`) : undefined}
        >
          {isLocked ? (
            <span className="flex items-center gap-1 font-bold text-amber-300">
              <Lock className="w-3.5 h-3.5" />
              <span>{countdown}s</span>
            </span>
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>

        {/* Gift Header */}
        <div className="text-center space-y-3 pb-5 border-b border-emerald-800/60">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-400/30 mx-auto animate-bounce">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isKg ? 'Катталуу үчүн белек!' : 'Подарок за регистрацию!'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isKg ? 'Сизге 24 сааттык Премиум жазылуу берилди!' : 'Вам начислен 24-часовой Премиум доступ!'}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/85 max-w-md mx-auto leading-relaxed">
            {isKg
              ? 'Платформанын бардык мүмкүнчүлүктөрүн толук колдонуп, ЖРТга ишенимдүү даярданыңыз.'
              : 'Вам открыты все возможности платформы: изучайте теорию, смотрите видеоразборы и решайте задания.'}
          </p>

          {/* Current Live Stage Countdown */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black shadow-sm">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {isKg
                ? `Премиумдун бүтүшүнө калды: ${hoursLeft} саат ${minutesLeft} мүнөт`
                : `До окончания Премиум-доступа осталось: ${hoursLeft} ч. ${minutesLeft} мин.`}
            </span>
          </div>
        </div>

        {/* Unlocked Benefits list */}
        <div className="py-5 space-y-2.5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#041d16] border border-emerald-800/60">
            <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm text-emerald-100 font-medium">
              {isKg ? 'Толук теория жана бардык бөлүмдөрдүн сүрөт-талдоолору' : 'Полная теория и подробные фоторазборы заданий'}
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#041d16] border border-emerald-800/60">
            <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm text-emerald-100 font-medium">
              {isKg ? 'Мугалимдердин видеосабактары жана автордук видеочечмелөөлөрү' : 'Видеоуроки преподавателей и авторские видеоразборы'}
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#041d16] border border-emerald-800/60">
            <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm text-emerald-100 font-medium">
              {isKg ? 'Интерактивдүү үй тапшырмалары жана толук ЖРТ сыноо тесттери' : 'Интерактивные домашние задания и пробные тесты ОРТ'}
            </span>
          </div>
        </div>

        {/* Action Button with 5s countdown lock - Golden button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={isLocked ? undefined : onClose}
            disabled={isLocked}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isLocked
                ? 'bg-amber-950/40 border border-amber-800/60 text-amber-300/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-slate-950 shadow-xl shadow-amber-500/25 cursor-pointer active:scale-95'
            }`}
          >
            {isLocked ? (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin text-amber-400" />
                <span>
                  {isKg
                    ? `Маалыматты окуп чыгыңыз (${countdown} сек)`
                    : `Прочитайте информацию (${countdown} сек)`}
                </span>
              </span>
            ) : (
              <>
                <span>{isKg ? 'Даярданууну баштоо' : 'Начать подготовку'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
