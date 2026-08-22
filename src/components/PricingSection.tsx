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
} from 'lucide-react';
import { SubscriptionPlan, AppLanguage } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { useAuth } from '../context/AuthContext';
import { SubscriptionModal } from './SubscriptionModal';

interface PricingSectionProps {
  lang?: AppLanguage;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ lang = 'ru' }) => {
  const { user, subscriptionStatus } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isKg = lang === 'kg';
  const effectivePlan = subscriptionStatus.effectivePlan;
  const isUserPremium = effectivePlan === 'premium' || user?.subscriptionPlan === 'premium';
  const isUserStandard =
    (effectivePlan === 'standard' || user?.subscriptionPlan === 'standard') && !isUserPremium;

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

      <div className="max-w-5xl mx-auto relative">
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
              ? 'Эки тариф тең 2027-жылдын 1-июнуна чейин иштейт. Өзүңүзгө ылайыктуусун тандап, толук мүмкүнчүлүккө ээ болуңуз!'
              : 'Обе подписки действуют до 1 июня 2027 года. Сравните возможности и выберите подходящий тариф для поступления на бюджет!'}
          </p>

          {/* Premium User VIP status banner */}
          {isUserPremium && (
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

          {/* Standard User Upgrade banner */}
          {isUserStandard && (
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
        </div>

        {/* 2 Main Plans Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* 1. ДОСТУПНАЯ ПОДПИСКА */}
          <div className="relative rounded-3xl bg-[#041a14] border-2 border-emerald-700/70 p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:border-emerald-500 transition-all group">
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
              {isUserPremium ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-5 rounded-2xl bg-white/5 border border-emerald-700/40 text-emerald-300/80 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-default"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isKg ? 'Премиумга кошулган' : 'Включено в Премиум'}</span>
                </button>
              ) : isUserStandard ? (
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
                  <span>{isKg ? 'Жеткиликтүү жазылуу — 2 000 сом' : 'Выбрать Доступную — 2 000 сом'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. ПРЕМИАЛЬНАЯ ПОДПИСКА (VIP Golden Highlighted) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#093527] to-[#041a14] border-2 border-amber-400/90 p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/20 hover:border-amber-300 transition-all group">
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
                    {isUserStandard ? '3 000 сом' : (isKg ? premiumPlan.priceLabelKg : premiumPlan.priceLabel)}
                  </span>
                  {isUserStandard && (
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

                <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2.5 rounded-xl border border-amber-400/30">
                  <FileCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">{isKg ? '+ Үй тапшырмалары:' : '+ Домашнее задание:'}</strong>{' '}
                    {isKg ? 'Ар бир тема боюнча бекемдөөчү тапшырмалар' : 'Практические задания по каждой теме с самопроверкой'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2.5 rounded-xl border border-amber-400/30">
                  <Video className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-amber-300">{isKg ? '+ Видеороликтер:' : '+ Видеоуроки с теорией:'}</strong>{' '}
                    {isKg ? 'Абдраим Турусбековичтин түшүндүрмөсү менен' : 'Авторские уроки лично от преподавателя'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-amber-100 bg-amber-500/10 p-2.5 rounded-xl border border-amber-400/30">
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
              {isUserPremium ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-4 px-5 rounded-2xl bg-amber-400/20 border border-amber-400 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-default"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>{isKg ? 'Сиздин активдүү тарифиңиз (Премиум)' : 'Ваш активный тариф (Премиум)'}</span>
                </button>
              ) : isUserStandard ? (
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
                  <span>{isKg ? 'Премиум тандоо — 5 000 сом' : 'Выбрать Премиум — 5 000 сом'}</span>
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
            className="text-amber-300 font-bold hover:underline flex items-center gap-1"
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
