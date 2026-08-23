import React from 'react';
import {
  X,
  Crown,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Video,
  FileCheck,
  Send,
  ShieldCheck,
  Flame,
  Check,
  GraduationCap,
} from 'lucide-react';
import { AppLanguage, SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';

interface TheoryPlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  lang: AppLanguage;
}

export const TheoryPlanSelectionModal: React.FC<TheoryPlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  lang,
}) => {
  const { user, subscriptionStatus } = useAuth();
  if (!isOpen) return null;

  const isKg = lang === 'kg';
  const standardPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'standard') || SUBSCRIPTION_PLANS[1];
  const premiumPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'premium') || SUBSCRIPTION_PLANS[2];
  const isAdmin = Boolean(user?.identifier && user.identifier.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase());

  // Paid users have active subscription until June 1, 2027
  const isPaidUserPremium = (Boolean(user?.isPaid) && (user?.subscriptionPlan === 'premium' || subscriptionStatus.effectivePlan === 'premium')) || isAdmin;
  const isPaidUserStandard = Boolean(user?.isPaid) && user?.subscriptionPlan === 'standard' && !isPaidUserPremium;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#06261d] border border-emerald-700/80 rounded-3xl shadow-2xl shadow-emerald-950/80 text-white my-auto max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Body with interior custom scrollbar */}
        <div className="overflow-y-auto custom-scrollbar p-5 sm:p-8 pr-3 sm:pr-6 space-y-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKg ? 'Жазылууну тандоо' : 'Выбор подписки для Теории'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {isKg ? 'Даярдануу үчүн кайсы подписка сизге туура келет?' : 'Выберите подписку для уверенной сдачи ОРТ'}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-200/75 leading-relaxed">
              {isKg
                ? 'Эки тариф тең 2027-жылдын 1-июнуна чейин иштейт. Өзүңүзгө ылайыктуусун тандап, толук мүмкүнчүлүккө ээ болуңуз!'
                : 'Обе подписки действуют до 1 июня 2027 года. Сравните возможности и выберите подходящий тариф!'}
            </p>
          </div>

          {/* If user has standard plan, show upgrade banner */}
          {isPaidUserStandard && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#0a3528] to-[#041a14] border-2 border-amber-400/60 flex items-center justify-between gap-4 text-xs sm:text-sm shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-amber-300 block">
                    {isKg ? '🔥 Сизде «Жеткиликтүү жазылуу» активдүү!' : '🔥 У вас активна «Доступная подписка»!'}
                  </span>
                  <span className="text-emerald-200/80 text-xs">
                    {isKg
                      ? 'Премиумга өтүү үчүн 5 000 сом эмес, болгону 3 000 сом кошумча төлөйсүз (2 000 сом эсепке алынды).'
                      : 'Для перехода на «Премиальную подписку» нужно просто доплатить 3 000 сом (2 000 сом уже зачтено).'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2 Plans Comparison Grid (with extra top padding so VIP badge does not touch header text) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-6 mt-6">
            {/* 1. ДОСТУПНАЯ ПОДПИСКА */}
            <div className="relative rounded-3xl bg-[#041a14] border-2 border-emerald-700/70 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-emerald-500 transition-all group">
              <div className="space-y-4">
                {/* Badge & Title */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isKg ? 'Жеткиликтүү' : 'Доступная'}</span>
                  </span>
                  <span className="text-xs text-emerald-300/80 font-bold">
                    {isKg ? standardPlan.periodLabelKg : standardPlan.periodLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isKg ? standardPlan.nameKg : standardPlan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-300">
                      {isKg ? standardPlan.priceLabelKg : standardPlan.priceLabel}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/70 mt-1">
                    {isKg
                      ? 'Теорияны окуп, ОРТнын чыныгы мисалдарын сүрөт-талдоолор менен үйрөнүү үчүн эң сонун.'
                      : 'Идеально для изучения всей текстовой теории и пошаговых фото-разборов задач ОРТ.'}
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="pt-3 border-t border-emerald-800/60 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5 text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">{isKg ? 'Бардык теория:' : 'Полная теория:'}</strong>{' '}
                      {isKg ? 'Алгебра жана Геометрия боюнча бардык блоктор' : 'Все разделы и темы Алгебры и Геометрии'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">{isKg ? 'Сүрөт-чечмелөөлөр:' : 'Фото с решениями:'}</strong>{' '}
                      {isKg ? 'Чыныгы ЖРТ мисалдарынын чыгарылыш сүрөттөрү жана талдоосу' : 'Пошаговый разбор заданий реального ОРТ на фото'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">{isKg ? 'Сынамык тесттер:' : 'Пробные тесты:'}</strong>{' '}
                      {isKg ? 'Кеңейтилген база жана упайларды эсептөө' : 'Расширенная база тестов ЦООМО с разбором'}
                    </span>
                  </div>

                  {/* What is NOT included */}
                  <div className="flex items-start gap-2.5 text-slate-400 opacity-80 pt-1">
                    <XCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{isKg ? 'Үй тапшырмалары (тапшырма блогу жок)' : 'Домашние задания по темам'}</span>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-400 opacity-80">
                    <XCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{isKg ? 'Теория жана мисалдардын видеороликтери' : 'Видеоролики с теорией и видеоразборами'}</span>
                  </div>
                </div>
              </div>

              {/* Select Button */}
              <div className="pt-6">
                {isPaidUserPremium ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 px-5 rounded-2xl bg-white/5 border border-emerald-700/40 text-emerald-300/80 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{isKg ? 'Премиумга кошулган' : 'Включено в Премиум'}</span>
                  </button>
                ) : isPaidUserStandard ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{isKg ? 'Сиздин учурдагы тарифиңиз' : 'Ваш текущий тариф'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPlan(standardPlan)}
                    className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer active:scale-95 group-hover:scale-[1.02]"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isKg ? 'Жеткиликтүү жазылуу — 2 000 сом' : 'Выбрать Доступную — 2 000 сом'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2. ПРЕМИАЛЬНАЯ ПОДПИСКА (VIP Highlighted) */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#093527] to-[#041a14] border-2 border-amber-400/80 p-6 sm:p-7 flex flex-col justify-between shadow-2xl shadow-amber-500/15 hover:border-amber-300 transition-all group">
              {/* Top Right Floating Badge */}
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-slate-950" />
                <span>{isKg ? 'Максималдуу натыйжа' : 'VIP • Все включено'}</span>
              </div>

              <div className="space-y-4">
                {/* Badge & Title */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isKg ? 'Премиум' : 'Премиальная'}</span>
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    {isKg ? premiumPlan.periodLabelKg : premiumPlan.periodLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isKg ? premiumPlan.nameKg : premiumPlan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-amber-300">
                      {isPaidUserStandard ? '3 000 сом' : (isKg ? premiumPlan.priceLabelKg : premiumPlan.priceLabel)}
                    </span>
                    {isPaidUserStandard && (
                      <span className="text-sm line-through text-slate-400 font-bold">5 000 сом</span>
                    )}
                  </div>
                  <p className="text-xs text-amber-100/80 mt-1">
                    {isKg
                      ? 'Теория + сүрөттөр + ар бир тема боюнча үй тапшырмасы + автордук видеосабактар жана талдоолор.'
                      : 'Полный комплект: теория, фоторешения, домашнее задание, видеоуроки с теорией и видеоразборами.'}
                  </p>
                </div>

                {/* Feature Checklist */}
                <div className="pt-3 border-t border-amber-500/40 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5 text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">{isKg ? 'Жеткиликтүү жазылуунун баары:' : 'Всё из Доступной подписки:'}</strong>{' '}
                      {isKg ? 'Теория жана сүрөт-чечмелөөлөр' : 'Текстовая теория и фото-решения'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2 rounded-xl border border-amber-400/30">
                    <FileCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-300">{isKg ? '+ Үй тапшырмалары:' : '+ Домашнее задание:'}</strong>{' '}
                      {isKg ? 'Ар бир тема боюнча бекемдөөчү тапшырмалар' : 'Практические задания по каждой теме с самопроверкой'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2 rounded-xl border border-amber-400/30">
                    <Video className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 block">{isKg ? '+ Видеороликтер:' : '+ Видеоуроки с теорией:'}</strong>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs text-amber-200/90">
                          {isKg ? 'Абдраим Турусбековичтин түшүндүрмөсү менен' : 'Авторские уроки с объяснением тем'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2 rounded-xl border border-amber-400/30">
                    <Video className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-300">{isKg ? '+ Видеоталдоолор:' : '+ Видеоразборы примеров:'}</strong>{' '}
                      {isKg ? 'ЖРТнын татаал мисалдарын жана тузактарын чыгаруу' : 'Разбор сложных задач и главных ловушек ОРТ'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">{isKg ? 'Жабык Telegram:' : 'Закрытый Telegram-канал:'}</strong>{' '}
                      {isKg ? 'Сабактар жана ЖОЖдорго тапшыруу колдонмосу' : 'Уроки, рекомендации и руководство по поступлению'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Select Button */}
              <div className="pt-6">
                {isPaidUserPremium ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-4 px-5 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>{isKg ? 'Сиздин активдүү тарифиңиз (Премиум)' : 'Ваш активный тариф (Премиум)'}</span>
                  </button>
                ) : isPaidUserStandard ? (
                  <button
                    type="button"
                    onClick={() => onSelectPlan(premiumPlan)}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer active:scale-95 group-hover:scale-[1.02]"
                  >
                    <Crown className="w-4 h-4 text-slate-950" />
                    <span>{isKg ? '3 000 сом төлөп, Премиумга өтүү' : 'Доплатить 3 000 сом и перейти на Премиум'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPlan(premiumPlan)}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer active:scale-95 group-hover:scale-[1.02]"
                  >
                    <Crown className="w-4 h-4 text-slate-950" />
                    <span>{isKg ? 'Премиум тандоо — 5 000 сом' : 'Выбрать Премиум — 5 000 сом'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Security & Support Guarantee Note */}
          <div className="pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isKg
                  ? 'Төлөмдөр MBANK, Bakai, Компаньон, O!Bank аркылуу коопсуз кабыл алынат'
                  : 'Безопасная оплата через MBANK, Bakai Bank, Компаньон, O!Bank'}
              </span>
            </div>

            <a
              href="https://t.me/kyrgyzakylman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-bold transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isKg ? 'Telegram: @kyrgyzakylman' : 'Telegram: @kyrgyzakylman'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
