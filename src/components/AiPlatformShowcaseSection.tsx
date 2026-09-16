import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  Award,
  Layers,
  Users,
} from 'lucide-react';
import { AppLanguage } from '../types';

interface AiPlatformShowcaseSectionProps {
  lang: AppLanguage;
  onNavigateToCourses?: () => void;
}

// Custom 8-bit Pixel Dinosaur SVG mascot
const PixelDinosaurSvg: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg
    viewBox="0 0 44 48"
    fill="currentColor"
    className={className}
    shapeRendering="crispEdges"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head & Snout */}
    <rect x="22" y="2" width="18" height="4" />
    <rect x="20" y="6" width="22" height="4" />
    <rect x="20" y="10" width="22" height="4" />
    <rect x="20" y="14" width="22" height="4" />
    {/* Eye cutout */}
    <rect x="24" y="6" width="3" height="3" fill="#041a14" />
    {/* Nostril & Teeth */}
    <rect x="36" y="14" width="3" height="2" fill="#041a14" />
    {/* Neck & Jaw */}
    <rect x="20" y="18" width="14" height="4" />
    <rect x="18" y="22" width="16" height="4" />
    {/* Body */}
    <rect x="12" y="26" width="22" height="4" />
    <rect x="8" y="30" width="26" height="4" />
    <rect x="6" y="34" width="28" height="4" />
    {/* Tiny Arm */}
    <rect x="34" y="30" width="4" height="2" />
    <rect x="36" y="32" width="2" height="3" />
    {/* Tail */}
    <rect x="2" y="30" width="6" height="3" />
    <rect x="0" y="28" width="4" height="3" />
    {/* Left Leg */}
    <rect x="14" y="38" width="4" height="6" />
    <rect x="14" y="44" width="6" height="3" />
    {/* Right Leg */}
    <rect x="24" y="38" width="4" height="6" />
    <rect x="24" y="44" width="6" height="3" />
  </svg>
);

// Traditional Kyrgyz Tunduk / Geometric Ornament SVG
const KyrgyzOrnamentSvg: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Tunduk Circle */}
    <circle cx="32" cy="32" r="28" strokeDasharray="4 2" />
    {/* Inner Sun Circle */}
    <circle cx="32" cy="32" r="14" />
    {/* Traditional Horn Curved Cross */}
    <path d="M32 4 C32 18, 18 32, 4 32" strokeLinecap="round" />
    <path d="M32 4 C32 18, 46 32, 60 32" strokeLinecap="round" />
    <path d="M32 64 C32 46, 18 32, 4 32" strokeLinecap="round" />
    <path d="M32 64 C32 46, 46 32, 60 32" strokeLinecap="round" />
    {/* Center diamond */}
    <polygon points="32,26 38,32 32,38 26,32" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

// Accurate Bishkek Time Formatter
const getBishkekTime = (): string => {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Asia/Bishkek',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '19:00';
  }
};

export const AiPlatformShowcaseSection: React.FC<AiPlatformShowcaseSectionProps> = ({
  lang,
  onNavigateToCourses,
}) => {
  const isKg = lang === 'kg';
  const phoneRef = useRef<HTMLDivElement>(null);

  // Live Bishkek Clock
  const [bishkekTime, setBishkekTime] = useState<string>(() => getBishkekTime());

  // Battery starts at 100% and drains every 5 seconds only when viewing phone
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isLookingAtPhone, setIsLookingAtPhone] = useState<boolean>(false);

  // Update Bishkek Time every second
  useEffect(() => {
    const update = () => setBishkekTime(getBishkekTime());
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // IntersectionObserver to detect if the user is looking at the phone
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLookingAtPhone(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.3 }
    );

    const handleVisibility = () => {
      if (document.hidden) {
        setIsLookingAtPhone(false);
      } else if (phoneRef.current) {
        const rect = phoneRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsLookingAtPhone(inView);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    if (phoneRef.current) {
      observer.observe(phoneRef.current);
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Battery drain: -1% every 5 seconds while looking at phone
  useEffect(() => {
    if (!isLookingAtPhone || batteryLevel <= 0) return;

    const timer = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isLookingAtPhone, batteryLevel]);

  const handleGoToCourses = () => {
    if (onNavigateToCourses) {
      onNavigateToCourses();
    } else {
      window.location.href = '/courses';
    }
  };

  return (
    <section
      id="preparatory-courses-showcase"
      className="relative py-16 sm:py-24 bg-[#031510] text-white overflow-hidden border-t border-b border-emerald-800/40"
    >
      {/* Background ambient lighting and Kyrgyz pattern mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-12 left-10 text-emerald-500/5 rotate-12">
          <KyrgyzOrnamentSvg className="w-72 h-72" />
        </div>
        <div className="absolute bottom-10 right-10 text-emerald-500/5 -rotate-12">
          <KyrgyzOrnamentSvg className="w-80 h-80" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Row with Title and Pixel Dinosaur Mascot */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
            <span className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none whitespace-nowrap">
              {isKg ? 'Даярдоо' : 'Подготовительные'}
            </span>
            <span className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none whitespace-nowrap">
              {isKg ? 'курстары' : 'курсы'}
            </span>

            {/* Pixel Dinosaur Mascot with retro animated bouncing badge with text "ОРТ" */}
            <div className="relative group cursor-pointer hover:scale-105 transition-transform shrink-0">
              <div className="p-1.5 sm:p-2 md:p-2.5 rounded-xl bg-[#06291e] border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:text-emerald-200">
                <PixelDinosaurSvg className="w-5 h-6 sm:w-6.5 sm:h-7.5 md:w-8 md:h-9" />
              </div>
              <div className="absolute -top-2.5 -right-2.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[8px] uppercase tracking-wider shadow-md animate-bounce">
                ОРТ
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-emerald-100/80 font-medium max-w-2xl leading-relaxed">
            {isKg
              ? 'ЖРТга автордук даярдоо: интерактивдүү онлайн сабактар, бардык сабактар боюнча типтүү жана татаал тапшырмаларды талдоо жана 180+ баллга чейин боштуктарды жоюу.'
              : 'Авторская подготовка к ОРТ: интерактивные онлайн-уроки, разбор типовых и сложных заданий по всем предметам и закрытие пробелов на 180+ баллов.'}
          </p>
        </div>

        {/* Central Core Layout: 2 Left Cards | Center Phone | 2 Right Cards */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* LEFT SIDE CARDS (Desktop cols 1-4, 2 blocks) */}
          <div className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
            {/* Block 1: Высшее качество подготовки */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#062c20] via-[#041f17] to-[#031811] border border-emerald-600/50 shadow-xl hover:border-emerald-400 transition-all group relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-sm">✦</span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {isKg ? 'Жогорку сапаттагы даярдоо' : 'Высшее качество подготовки'}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                {isKg
                  ? 'Бардык сабактар боюнча ЖРТга даярдоонун автордук методикасы, максималдуу балл алуу үчүн тесттин бардык типтүү жана татаал тапшырмаларын системалуу талдоо.'
                  : 'Комплексная авторская методика подготовки к ОРТ по всем предметам, системный разбор всех типовых и сложных заданий для достижения максимального балла.'}
              </p>

              <div className="mt-4 pt-3 border-t border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isKg ? 'ЦООМОнун тесттерин 100% талдоо' : '100% разбор реальных тестов ЦООМО'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isKg ? 'ЖРТнын бардык бөлүмдөрү үчүн стратегиялар' : 'Стратегии и лайфхаки для всех разделов ОРТ'}</span>
                </div>
              </div>
            </div>

            {/* Block 2: Индивидуальная программа */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#062c20] via-[#041f17] to-[#031811] border border-emerald-600/50 shadow-xl hover:border-emerald-400 transition-all group relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-teal-400 text-sm">✦</span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {isKg ? 'Жеке окутуу программасы' : 'Индивидуальная программа'}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                {isKg
                  ? 'Окуучунун жеке темпи, бардык сабактар боюнча каталарды так талдоо жана ар бир бөлүмдөгү боштуктарды толук жоюу.'
                  : 'Персональный темп обучения, точечный разбор ошибок ученика по всем предметам и устранение пробелов по всем разделам.'}
              </p>

              <div className="mt-4 pt-3 border-t border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{isKg ? 'Жеке даярдануу траекториясы' : 'Персональная траектория подготовки'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{isKg ? 'Бардык сабактар боюнча боштуктарды жоюу' : 'Устранение пробелов по всем предметам'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: HIGH FIDELITY SMARTPHONE MOCKUP (Desktop cols 5-8) */}
          <div ref={phoneRef} className="lg:col-span-4 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              
              {/* Outer decorative ambient glow */}
              <div className="absolute -inset-4 bg-gradient-to-b from-emerald-500/25 via-teal-500/15 to-emerald-600/25 rounded-[52px] blur-2xl opacity-75" />

              {/* Smartphone Outer Titanium Frame */}
              <div className="relative rounded-[44px] bg-[#0c1411] p-3 border-4 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/20">
                
                {/* Physical buttons on sides */}
                <div className="absolute -left-4 top-24 w-1 h-10 bg-slate-700 rounded-l-md" />
                <div className="absolute -left-4 top-38 w-1 h-10 bg-slate-700 rounded-l-md" />
                <div className="absolute -right-4 top-28 w-1 h-14 bg-slate-700 rounded-r-md" />

                {/* Inner Screen Bezel */}
                <div className="relative rounded-[36px] bg-[#041a14] overflow-hidden border border-emerald-900/80 text-left p-4 pb-5 flex flex-col space-y-4 min-h-[500px]">
                  
                  {/* If battery reaches 0%, phone turns off completely */}
                  {batteryLevel === 0 ? (
                    <div className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-600">
                        <div className="w-5 h-8 border-2 border-zinc-600 rounded-sm flex items-center justify-center relative">
                          <div className="w-2 h-1 bg-zinc-600 absolute -top-1.5" />
                          <span className="text-xs text-rose-500 font-bold">!</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-zinc-500 tracking-wider">
                        {isKg ? 'Батарея өчтү' : 'Телефон выключен'}
                      </span>
                      <span className="text-[10px] text-zinc-700 mt-1">
                        {isKg ? 'Сайтты жаңыласаңыз, 100% болот' : 'Обновите страницу для 100%'}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Top Status Bar: Bishkek Time & Dynamic Island & Live Battery */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1 pt-0.5">
                        <span className="font-mono tracking-tight">{bishkekTime}</span>
                        
                        {/* Dynamic Island Pill */}
                        <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                        </div>

                        {/* Battery Level with Visual Icon */}
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold ${
                              batteryLevel <= 20
                                ? 'text-rose-400'
                                : batteryLevel <= 50
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                            }`}
                          >
                            {batteryLevel}%
                          </span>

                          <div className="w-5 h-2.5 rounded-[3px] border border-slate-400/80 p-0.5 flex items-center relative">
                            <div
                              className={`h-full rounded-[1px] transition-all duration-300 ${
                                batteryLevel <= 20
                                  ? 'bg-rose-500'
                                  : batteryLevel <= 50
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${batteryLevel}%` }}
                            />
                            <div className="w-0.5 h-1 bg-slate-400 rounded-r-xs absolute -right-1" />
                          </div>
                        </div>
                      </div>

                      {/* App Navigation Bar inside phone: "Мадылбаев Абдраим" + Profile Image */}
                      <div className="flex items-center justify-between pt-1 border-b border-emerald-800/40 pb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src="https://res.cloudinary.com/rw9qhk3a/image/upload/v1789309521/photo_10_2026-08-14_18-31-.jpg"
                            alt="Мадылбаев Абдраим"
                            className="w-7 h-7 rounded-full object-cover border border-emerald-400/50 shadow-xs shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-black text-xs text-white tracking-wide truncate">
                            Мадылбаев Абдраим
                          </span>
                        </div>

                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold text-emerald-300 shrink-0">
                          {isKg ? 'Курстар' : 'Курсы'}
                        </div>
                      </div>

                      {/* Main Score Prediction Card */}
                      <div className="rounded-2xl bg-gradient-to-b from-[#063324] to-[#042017] border-2 border-emerald-400/70 p-3.5 shadow-lg relative overflow-hidden">
                        <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                          <span>{isKg ? 'ЖРТ болжолу' : 'Прогноз баллов'}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 font-mono">
                            {isKg ? 'ЖРТ 2027' : 'ОРТ 2027'}
                          </span>
                        </div>

                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                          {isKg ? 'БҮГҮНКҮ КҮНГӨ:' : 'НА СЕГОДНЯ:'}
                        </div>

                        <div className="flex items-baseline justify-start mt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                              185
                            </span>
                            <div className="flex items-center text-xs font-black text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md border border-emerald-400/40">
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                              +18
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prediction Dynamics Bar Chart (language synchronized) */}
                      <div className="rounded-2xl bg-[#031510] border border-emerald-800/70 p-3 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white">
                          <span>{isKg ? 'Даярдык динамикасы' : 'Динамика подготовки'}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {isKg ? '+24 балл / ай' : '+24 балла / мес'}
                          </span>
                        </div>

                        {/* Chart Bars */}
                        <div className="flex items-end justify-between h-16 gap-1 pt-2 px-1">
                          {[
                            { dayKg: '1-апта', dayRu: '1-нед', score: '135', h: '35%', color: 'bg-emerald-700' },
                            { dayKg: '2-апта', dayRu: '2-нед', score: '152', h: '52%', color: 'bg-emerald-600' },
                            { dayKg: '3-апта', dayRu: '3-нед', score: '168', h: '68%', color: 'bg-emerald-500' },
                            { dayKg: '4-апта', dayRu: '4-нед', score: '176', h: '80%', color: 'bg-emerald-400' },
                            { dayKg: 'ЖРТ', dayRu: 'ОРТ', score: '185', h: '95%', color: 'bg-emerald-300' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full bg-emerald-950/60 rounded-t-md overflow-hidden flex items-end h-12">
                                <div
                                  style={{ height: item.h }}
                                  className={`w-full ${item.color} rounded-t-md transition-all duration-500`}
                                />
                              </div>
                              <span className="text-[8px] text-slate-400 font-mono">
                                {isKg ? item.dayKg : item.dayRu}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Topic Knowledge Mastery Card (2 modules only) */}
                      <div className="rounded-2xl bg-[#031510] border border-emerald-800/70 p-3 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white">
                          <span>{isKg ? 'Бөлүмдөр боюнча билим' : 'Знания по разделам'}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            {isKg ? '2 модуль' : '2 модуля'}
                          </span>
                        </div>

                        <div className="space-y-2 text-[10px]">
                          {/* Module 1 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-200 font-semibold">
                              <span className="truncate pr-1">
                                {isKg
                                  ? '01. Негизги ЖРТ тести (бардык бөлүмдөр)'
                                  : '01. Основной тест ОРТ (все разделы)'}
                              </span>
                              <span className="text-emerald-400 font-bold shrink-0">94%</span>
                            </div>
                            <div className="h-1.5 bg-emerald-950 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full w-[94%]" />
                            </div>
                          </div>

                          {/* Module 2 */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-slate-200 font-semibold">
                              <span className="truncate pr-1">
                                {isKg
                                  ? '02. Предметтик тесттер жана практика'
                                  : '02. Предметные тесты и практика'}
                              </span>
                              <span className="text-teal-300 font-bold shrink-0">88%</span>
                            </div>
                            <div className="h-1.5 bg-emerald-950 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-400 rounded-full w-[88%]" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Home Indicator bar */}
                      <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CARDS (Desktop cols 9-12, 2 blocks) */}
          <div className="lg:col-span-4 flex flex-col gap-5 order-3">
            {/* Block 3: Практика на интерактивной доске */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#062c20] via-[#041f17] to-[#031811] border border-emerald-600/50 shadow-xl hover:border-emerald-400 transition-all group relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-sm">✦</span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {isKg ? 'Интерактивдүү тактада практика' : 'Практика на интерактивной доске'}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                {isKg
                  ? 'Мугалимдин түз катышуусундагы жандуу онлайн-сабактар, виртуалдык тактада тапшырмаларды чогуу чыгаруу жана суроолорду дароо талдоо.'
                  : 'Живые онлайн-уроки с прямым включением преподавателя, решение заданий у интерактивной доски и мгновенный разбор всех вопросов.'}
              </p>

              <div className="mt-4 pt-3 border-t border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isKg ? 'Түз эфирде биргелешип чыгаруу' : 'Совместный разбор заданий в прямом эфире'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isKg ? 'Сабактардын жазуусу 24/7 жеткиликтүү' : 'Записи всех уроков доступны 24/7'}</span>
                </div>
              </div>
            </div>

            {/* Block 4: Мини-группы 6–10 человек */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#062c20] via-[#041f17] to-[#031811] border border-emerald-600/50 shadow-xl hover:border-emerald-400 transition-all group relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-sm">✦</span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {isKg ? '6–10 кишилик чакан топтор' : 'Мини-группы 6–10 человек'}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal">
                {isKg
                  ? 'Ар бир окуучуга жекече көңүл буруу, бардык суроолорду кеңири талдоо жана ар бир кадамда куратордук колдоо.'
                  : 'Индивидуальное внимание каждому ученику, подробный разбор всех возникающих вопросов и всесторонняя поддержка куратора.'}
              </p>

              <div className="mt-4 pt-3 border-t border-emerald-800/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isKg ? 'Ар бир окуучунун суроолоруна жеке көңүл' : 'Личное внимание к вопросам каждого ученика'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isKg ? 'Каталар менен деталдуу иштөө жана байланыш' : 'Детальная работа над ошибками и обратная связь'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM CALL TO ACTION: ONLY "Подробнее о курсах" button under the phone */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            type="button"
            onClick={handleGoToCourses}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer group"
          >
            <span>{isKg ? 'Курстар тууралуу толук маалымат' : 'Подробнее о курсах'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
