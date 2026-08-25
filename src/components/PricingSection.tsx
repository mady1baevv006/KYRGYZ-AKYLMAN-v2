import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  Flame,
  FileCheck,
  Video,
  Gift,
  GraduationCap,
} from 'lucide-react';
import { SubscriptionPlan, AppLanguage } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import { SubscriptionModal } from './SubscriptionModal';

interface PricingSectionProps {
  lang?: AppLanguage;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang = 'ru' }) => {
  const { user, subscriptionStatus } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isKg = lang === 'kg';
  const isAdmin = Boolean(user?.identifier && user.identifier.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase());

  // Paid users have active subscription until June 1, 2027
  const isPaidUserPremium = (Boolean(user?.isPaid) && (user?.subscriptionPlan === 'premium' || subscriptionStatus.effectivePlan === 'premium')) || isAdmin;
  const isPaidUserStandard = Boolean(user?.isPaid) && user?.subscriptionPlan === 'standard' && !isPaidUserPremium;
  const isTrialUser = Boolean(user) && !user?.isPaid && !isAdmin && subscriptionStatus.trialStage === 'trial_premium';

  const freePlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'free') || SUBSCRIPTION_PLANS[0];
  const standardPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'standard') || SUBSCRIPTION_PLANS[1];
  const premiumPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'premium') || SUBSCRIPTION_PLANS[2];

  const handleOpenPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section id="pricing-section" className="relative z-20 pt-16 sm:pt-24 pb-16 px-3 sm:px-6">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[32rem] pointer-events-none opacity-35">
        <div className="absolute top-1/4 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-amber-500/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{isKg ? 'Тарифтик пландар' : 'Тарифные планы'}</span>
          </div>

          <h2 className="text-2xl min-[400px]:text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isKg ? (
              <>
                ЖРТга даярдануу үчүн{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-400">
                  ыңгайлуу тарифти
                </span>{' '}
                танда
              </>
            ) : (
              <>
                Инвестируй в свой высокий{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-400">
                  балл на ОРТ
                </span>
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-emerald-200/80 max-w-2xl mx-auto leading-relaxed">
            {isKg
              ? 'Тарифтер 2027-жылдын 1-июнуна чейин иштейт. Өзүңүзгө ылайыктуусун тандап, бюджетке өтүүгө даярданыңыз!'
              : 'Подписки действуют до 1 июня 2027 года. Сравните возможности и выберите подходящий тариф для поступления на бюджет!'}
          </p>

          {/* Paid Premium User VIP status banner */}
          {isPaidUserPremium && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-[#072b20] to-[#041a14] border-2 border-amber-400/80 shadow-2xl shadow-amber-500/20 text-left flex items-center gap-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                <Crown className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="font-black text-amber-300 text-sm sm:text-base block">
                  {isKg
                    ? '★ Сизде «Премиалдуу жазылуу» активдүү! (2027-жылдын 1-июнуна чейин)'
                    : '★ У вас активирована «Премиальная подписка» до 1 июня 2027 года'}
                </span>
                <span className="text-emerald-200/85 text-xs leading-relaxed block mt-0.5">
                  {isKg
                    ? 'Сизге бардык теория, сүрөт-талдоолор, үй тапшырмасы, видеосабактар жана ОРТ тесттери толугу менен ачык.'
                    : 'Вам открыт полный доступ ко всей теории, фоторазборам задач, домашним заданиям, видеоурокам и пробным тестам ОРТ.'}
                </span>
              </div>
            </div>
          )}

          {/* Paid Standard User Upgrade banner */}
          {isPaidUserStandard && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#0a3528] to-[#041a14] border-2 border-amber-400/60 flex items-center justify-between gap-4 text-xs sm:text-sm shadow-lg text-left">
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

          {/* Trial User Notice Banner */}
          {isTrialUser && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0a3a2c] to-[#05261d] border border-emerald-500/50 flex items-center gap-3.5 text-xs sm:text-sm text-left shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/40">
                <Gift className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-black text-emerald-300 block">
                  {isKg
                    ? '🎁 Сизге 24 сааттык сыноо VIP-мүмкүнчүлүгү белекке берилди!'
                    : '🎁 Вам подарен 24-часовой пробный VIP-доступ!'}
                </span>
                <span className="text-emerald-100/80 text-xs block mt-0.5 leading-relaxed">
                  {isKg
                    ? 'Платформанын бардык мүмкүнчүлүктөрүн колдонуп көрүңүз. Чексиз мүмкүнчүлүктү сактап калуу үчүн 2027-жылдын 1-июнуна чейинки тарифти тандаңыз.'
                    : 'Оцените все возможности платформы. Чтобы сохранить неограниченный доступ после окончания суток, выберите подходящий тариф до 1 июня 2027 года.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Special Social Support Banner across all 3 columns */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#062c20] via-[#04241a] to-[#083526] border-2 border-emerald-500/50 p-5 sm:p-7 shadow-2xl relative overflow-hidden text-left">
          {/* Subtle background glow & badge */}
          <div className="absolute top-0 right-0 w-80 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isKg ? 'Социалдык колдоо жана жеңилдиктер' : 'Социальная поддержка и льготы'}</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-snug">
                {isKg ? (
                  <>
                    <span className="text-amber-300">«Премиалдуу жазылуу»</span> аярлуу катмардагы окуучуларга толугу менен{' '}
                    <span className="underline decoration-emerald-400 decoration-2 underline-offset-4">акысыз берилет</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-300">«Премиальная подписка»</span> предоставляется полностью{' '}
                    <span className="underline decoration-emerald-400 decoration-2 underline-offset-4">бесплатно</span>
                  </>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {isKg
                  ? 'Биз бир же эки ата-энесинен тең ажыраган окуучуларга (тоголок жана жарым жетимдерге), ден соолугунун мүмкүнчүлүгү чектелген жарандарга (майыптарга), аскердик даярдыктан өткөндөргө / аскер кызматкерлерине, ошондой эле Баткен окуяларына катышкан аскерлердин балдарына Премиум жазылууну белекке беребиз. Документти тастыктоо үчүн мамлекеттик «Түндүк» (Tunduk) тиркемесиндеги маалымкатты же күбөлүктү биздин колдоо кызматына жөнөтүү жетиштүү.'
                  : 'Мы бесплатно дарим «Премиальную подписку» учащимся, потерявшим одного или обоих родителей (круглые сироты и полусироты), лицам с инвалидностью, прошедшим военную подготовку / военнослужащим, а также детям военных — участников Баткенских событий. Для подтверждения и активации доступа достаточно предоставить подтверждающие цифровые документы / справку из государственного портала «Түндүк» (Tunduk) в нашу службу поддержки.'}
              </p>
            </div>

            <div className="shrink-0">
              <a
                href="https://t.me/kyrgyzakylman?text=%D0%A1%D0%B0%D0%BB%D0%B0%D0%BC%D0%B0%D1%82%D1%81%D1%8B%D0%B7%D0%B1%D1%8B!%20%D0%9C%D0%B5%D0%BD%20%D0%A2%D2%AF%D0%BD%D0%B4%D2%AF%D0%BA%20%D0%B0%D1%80%D0%BA%D1%8B%D0%BB%D1%83%D1%83%20%D0%B6%D0%B5%D2%A3%D0%B8%D0%BB%D0%B4%D0%B8%D0%BA%D1%82%D2%AF%D2%AF%20%D0%9F%D1%80%D0%B5%D0%BC%D0%B8%D1%83%D0%BC%20%D0%B6%D0%B0%D0%B7%D1%8B%D0%BB%D1%83%D1%83%20%D0%B0%D0%BB%D1%83%D1%83%20%D2%AF%D1%87%D2%AF%D0%BD%20%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%20%D0%B6%D3%A9%D0%BD%D3%A9%D1%82%D3%A9%D0%B9%D2%AF%D0%BD%20%D0%B4%D0%B5%D0%B3%D0%B5%D0%BD%20%D1%8D%D0%BB%D0%B5%D0%BC."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>{isKg ? 'Документти жөнөтүү (Түндүк)' : 'Отправить документы (Түндүк)'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3 Plans Comparison Grid: Free (Subtle), Standard (Vibrant Emerald), Premium (VIP Gold) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {/* 1. БАЗОВАЯ (Muted & Basic) */}
          <div className="relative rounded-3xl bg-[#031510]/80 border border-slate-700/60 p-6 flex flex-col justify-between shadow-lg opacity-90 hover:opacity-100 transition-all">
            <div className="space-y-4">
              {/* Badge & Title */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700">
                  {isKg ? 'Базалык' : 'Базовая'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {isKg ? freePlan.periodLabelKg : freePlan.periodLabel}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-200">
                  {isKg ? freePlan.nameKg : freePlan.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-300">
                    {isKg ? freePlan.priceLabelKg : freePlan.priceLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {isKg
                    ? 'ЖРТ форматы менен таанышуу жана базалык билимди текшерүү үчүн.'
                    : 'Базовое ознакомление с платформой и расчет баллов по шкале ЦООМО.'}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'Пробный тест:' : 'Пробный тест:'}</strong>{' '}
                    {isKg ? 'ЦООМОнун бардык сынамык тесттери' : 'Все пробные тесты ЦООМО'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'Калькулятор баллов:' : 'Калькулятор баллов:'}</strong>{' '}
                    {isKg ? 'ЦООМО шкаласы боюнча эсептөө' : 'Расчет баллов по шкале ЦООМО'}
                  </span>
                </div>

                {/* Not included in Free */}
                <div className="flex items-start gap-2.5 text-slate-500 opacity-70 pt-1">
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>{isKg ? 'Тексттик теория жана сүрөт-талдоолор' : 'Все текстовые разделы теории и фото-разборы'}</span>
                </div>

                <div className="flex items-start gap-2.5 text-slate-500 opacity-70">
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>{isKg ? 'Үй тапшырмалары жана видеосабактар' : 'Домашние задания и авторские видеоуроки'}</span>
                </div>
              </div>
            </div>

            {/* Free Button */}
            <div className="pt-6">
              <button
                type="button"
                disabled
                className="w-full py-3 px-5 rounded-2xl bg-white/5 border border-slate-700/60 text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-default"
              >
                <Check className="w-4 h-4 text-slate-400" />
                <span>{isKg ? 'Базалык мүмкүнчүлүк' : 'Базовый доступ'}</span>
              </button>
            </div>
          </div>

          {/* 2. ДОСТУПНАЯ ПОДПИСКА (Vibrant Emerald) */}
          <div className="relative rounded-3xl bg-[#041a14] border-2 border-emerald-500/80 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:border-emerald-400 transition-all group">
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
                    ? 'Теорияны окуп, ОРТнын чыныгы мисалдарын сүрөт-талдоолор менен үйрөнүү үчүн.'
                    : 'Все текстовые разделы теории, фото с решениями и расширенная база тестов.'}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="pt-3 border-t border-emerald-800/60 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'Теория:' : 'Теория:'}</strong>{' '}
                    {isKg ? 'Математика, орус жана англис тилдеринин бардык тексттик бөлүмдөрү' : 'Все текстовые разделы Математики, Русского и Английского языка'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'Фото с решениями:' : 'Фото с решениями:'}</strong>{' '}
                    {isKg ? 'Теориялардагы чыныгы ЖРТ мисалдарынын этап-этабы менен талдоосу' : 'Пошаговый разбор примеров из реального ОРТ в теориях'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'Пробный тест:' : 'Пробный тест:'}</strong>{' '}
                    {isKg ? 'Сынамык тесттердин кеңейтилген базасы, анын ичинде ЦООМО' : 'Расширенная база пробных тестов, включая ЦООМО'}
                  </span>
                </div>

                {/* What is NOT included */}
                <div className="flex items-start gap-2.5 text-slate-400 opacity-80 pt-1">
                  <XCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>{isKg ? 'Үй тапшырмалары жана видеосабактар' : 'Домашнее задание и авторские видеоуроки'}</span>
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
                  onClick={() => handleOpenPlan(standardPlan)}
                  className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer active:scale-95 group-hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isKg ? 'Жеткиликтүү — 2 000 сом' : 'Выбрать — 2 000 сом'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. ПРЕМИАЛЬНАЯ ПОДПИСКА (VIP Golden Highlighted) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#093527] to-[#041a14] border-2 border-amber-400/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xl shadow-amber-500/20 hover:border-amber-300 transition-all group">
            {/* Top Right Floating Badge */}
            <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5">
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
                    <strong className="text-white">{isKg ? 'Пробный тест:' : 'Пробный тест:'}</strong>{' '}
                    {isKg ? 'Сынамык тесттердин толук базасы' : 'Полная база пробных тестов'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'Теория:' : 'Теория:'}</strong>{' '}
                    {isKg ? 'Математика, орус жана англис тилдеринин бардык бөлүмдөрү' : 'Все разделы Математики, Русского и Английского языка'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2.5 rounded-xl border border-amber-400/30">
                  <FileCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">{isKg ? '+ Домашнее задание:' : '+ Домашнее задание:'}</strong>{' '}
                    {isKg ? 'Ар бир тема боюнча өзүн-өзү текшерүү менен практикалык тапшырмалар' : 'Практические задания по каждой теме с самопроверкой'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2.5 rounded-xl border border-amber-400/30">
                  <Video className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block">{isKg ? '+ Видеоуроки с теорией:' : '+ Видеоуроки с теорией:'}</strong>
                    <span className="text-xs text-amber-200/90 block mt-0.5">
                      {isKg ? 'Темаларды түшүндүргөн автордук видеосабактар' : 'Авторские видеоуроки с объяснением тем'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2.5 rounded-xl border border-amber-400/30">
                  <Video className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">{isKg ? '+ Видеоразборы примеров:' : '+ Видеоразборы примеров:'}</strong>{' '}
                    {isKg ? 'Татаал тапшырмаларды жана ЖРТнын негизги тузактарын талдоо' : 'Разбор сложных задач и главных ловушек ОРТ'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'ЖОЖдорго тапшыруу:' : 'Поступление в ВУЗы:'}</strong>{' '}
                    {isKg ? 'ЖОЖдорго тапшыруу боюнча автордук колдонмо' : 'Авторское руководство по поступлению в ВУЗы'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">{isKg ? 'Жабык Telegram-канал:' : 'Закрытый Telegram-канал:'}</strong>{' '}
                    {isKg ? 'Сабактар, кеңештер, сунуштар жана тапшыруу колдонмосу' : 'Уроки, советы, рекомендации и руководство по поступлению'}
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
                  onClick={() => handleOpenPlan(premiumPlan)}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer active:scale-95 group-hover:scale-[1.02]"
                >
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>{isKg ? '3 000 сом төлөп, Премиумга өтүү' : 'Доплатить 3 000 сом и перейти на Премиум'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenPlan(premiumPlan)}
                  className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all cursor-pointer active:scale-95 group-hover:scale-[1.02]"
                >
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>{isKg ? 'Премиум — 5 000 сом' : 'Выбрать Премиум — 5 000 сом'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security & Support Guarantee Note */}
        <div className="mt-8 p-4 rounded-2xl bg-[#041a14]/90 border border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/75">
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
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1"
          >
            <span>{isKg ? 'Колдоо кызматы: @kyrgyzakylman' : 'Поддержка в Telegram: @kyrgyzakylman'}</span>
          </a>
        </div>
      </div>

      {/* Checkout / Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        lang={lang}
      />
    </section>
  );
};
