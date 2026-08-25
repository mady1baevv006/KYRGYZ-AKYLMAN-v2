import React from 'react';
import {
  Crown,
  Zap,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AppLanguage, SubscriptionPlan } from '../types';
import { useAuth } from '../context/AuthContext';

interface TrialNoticeBannerProps {
  lang?: AppLanguage;
  onOpenUpgradeModal?: (plan?: SubscriptionPlan) => void;
  onOpenTrialDetails?: () => void;
}

export const TrialNoticeBanner: React.FC<TrialNoticeBannerProps> = ({
  lang = 'ru',
  onOpenUpgradeModal,
  onOpenTrialDetails,
}) => {
  const { user, subscriptionStatus, extendTrial } = useAuth();
  if (!user || subscriptionStatus.isPaid) return null;

  const isKg = lang === 'kg';
  const stage = subscriptionStatus.trialStage;
  const hours = subscriptionStatus.hoursRemainingInStage;
  const minutes = subscriptionStatus.minutesRemainingInStage;

  if (stage === 'trial_premium') {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#072b20] to-[#041a14] border-2 border-amber-400/70 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
            <Crown className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-white">
                {isKg ? '24 сааттык Премиум жазылуу белеги активдүү!' : 'Подарок 24-часового Премиум-доступа активен!'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-black">
                <Clock className="w-3 h-3" />
                {isKg ? `Калды: ${hours}с ${minutes}м` : `Осталось: ${hours}ч ${minutes}м`}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-2xl">
              {isKg
                ? 'Сизге 24 саатка бардык теория, сүрөт-талдоолор, видеосабактар жана үй тапшырмалары ачык. 24 сааттан соң акысыз режимге өтөт.'
                : 'Вам на 24 часа открыты вся теория, фоторазборы, видеоуроки и домашние задания. Через 24 часа доступ перейдет на базовый бесплатный тариф.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          {onOpenTrialDetails && (
            <button
              type="button"
              onClick={onOpenTrialDetails}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-700/60 text-xs font-bold text-emerald-200 hover:text-white transition-all cursor-pointer"
            >
              {isKg ? 'Шарттар' : 'Условия'}
            </button>
          )}
          {onOpenUpgradeModal && (
            <button
              type="button"
              onClick={() => onOpenUpgradeModal()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer flex-1 md:flex-initial"
            >
              <span>{isKg ? 'Туруктуу сатып алуу' : 'Оформить навсегда'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Expired
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#041a14] border border-amber-500/40 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 min-w-0">
          <span className="text-xs sm:text-sm font-black text-white block">
            {isKg ? 'Сыноо мөөнөтү аяктады' : 'Пробный период завершен'}
          </span>
          <p className="text-xs text-emerald-200/70 leading-relaxed max-w-2xl">
            {isKg
              ? 'Теорияны, сүрөт-чечмелөөлөрдү, видеосабактарды жана үй тапшырмаларын толук пайдалануу үчүн жазылууну тандаңыз же сыноо мөөнөтүн узартыңыз.'
              : 'Чтобы продолжить изучение теории, фоторазборов, видеоуроков и домашних заданий, оформите «Доступную» или «Премиальную» подписку.'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
        {!user.hasExtendedTrial && (
          <button
            type="button"
            onClick={() => extendTrial()}
            className="px-3.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 flex-1 sm:flex-initial"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isKg
                ? 'Бардыгын көрүп жетишпей калдым, дагы 24 саат бериңиз'
                : 'Я не успел всё посмотреть, дайте еще 24 часа'}
            </span>
          </button>
        )}

        {onOpenUpgradeModal && (
          <button
            type="button"
            onClick={() => onOpenUpgradeModal()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0 flex-1 sm:flex-initial"
          >
            <span>{isKg ? 'Подписка тандоо' : 'Выбрать подписку'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
