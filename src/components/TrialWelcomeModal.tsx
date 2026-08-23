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
  const { subscriptionStatus } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen]);

  if (!isOpen) return null;

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
            {isKg ? 'Сизге 1 күн Премиум жазылуу берилди!' : 'Вам начислен 1 день Премиальной подписки!'}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/85 max-w-md mx-auto leading-relaxed">
            {isKg
              ? 'Платформанын бардык мүмкүнчүлүктөрүн толук көрүп чыгуу үчүн сизге атайын сынамык мөөнөтү берилди.'
              : 'Чтобы вы могли оценить все преимущества подготовки, вам открыт максимальный пробный доступ.'}
          </p>

          {/* Current Live Stage Countdown */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-black">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {isKg
                ? `1-этаптын бүтүшүнө калды: ${hoursLeft} саат ${minutesLeft} мүнөт`
                : `До конца 1-го этапа осталось: ${hoursLeft} ч. ${minutesLeft} мин.`}
            </span>
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div className="py-5 space-y-3.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
            {isKg ? 'Сыноо мөөнөтүнүн графиги:' : 'График работы пробного периода:'}
          </h3>

          {/* Stage 1 */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-400/50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  {isKg ? '1-күн (24 саат): Премиум жазылуу' : '1-й день (24 часа): Премиальная подписка'}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {isKg ? 'Азыр активдүү' : 'Активен сейчас'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-snug">
                {isKg
                  ? 'Толук теория, сүрөт-чечмелөөлөр, үй тапшырмасы, теория видеолору жана автордук видеоталдоолор.'
                  : 'Полная теория, фоторешения, домашние задания, видеоуроки с теорией и видеоразборы.'}
              </p>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-2xl bg-[#041a14] border border-emerald-700/60 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  {isKg ? '2-күн (кийинки 24 саат): Доступная подписка' : '2-й день (следующие 24 часа): Доступная подписка'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/70 leading-snug">
                {isKg
                  ? 'Премиум аяктаганда автоматтык түрдө «Жеткиликтүү жазылууга» өтөт (Теория жана сүрөт-талдоолор).'
                  : 'После окончания Премиума автоматически активируется «Доступная подписка» (Теория и фоторазборы).'}
              </p>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-900/60 flex items-start gap-3 opacity-80">
            <div className="w-8 h-8 rounded-xl bg-slate-700 text-slate-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <span className="font-bold text-xs sm:text-sm text-slate-300">
                {isKg ? '3-күн жана андан ары: Акысыз базалык тариф' : '3-й день и далее: Базовый бесплатный тариф'}
              </span>
              <p className="text-xs text-emerald-200/60 leading-snug">
                {isKg
                  ? 'Сыноо мөөнөтү бүткөндөн кийин каалаган убакта туруктуу подписканы сатып алсаңыз болот.'
                  : 'После завершения пробного периода вы сможете оформить постоянную подписку до 2027 года.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button with 5s countdown lock */}
        <div className="pt-3">
          <button
            type="button"
            onClick={isLocked ? undefined : onClose}
            disabled={isLocked}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isLocked
                ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-400/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 text-slate-950 shadow-xl shadow-emerald-500/30 cursor-pointer active:scale-95'
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
