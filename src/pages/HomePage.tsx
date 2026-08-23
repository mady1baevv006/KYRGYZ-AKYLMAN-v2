import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, Clock } from 'lucide-react';
import { Variant, AppLanguage } from '../types';
import {
  API_BASE_URL,
  SECTION_NAMES,
  SECTION_NAMES_KG,
} from '../data/constants';
import { FALLBACK_VARIANTS } from '../data/fallbackVariants';
import { PricingSection } from '../components/PricingSection';
import { StudentsResultsSection } from '../components/StudentsResultsSection';
import { OrtScoreCalculator } from '../components/OrtScoreCalculator';
import { CreativeLoader } from '../components/CreativeLoader';
import heroEarthStarsImg from '../assets/images/hero_earth_stars_1787130940166.jpg';

const THEME_STYLES: Record<string, {
  bg: string;
  text: string;
  border: string;
  hoverBorder: string;
  groupHoverBg: string;
  groupHoverText: string;
  ring: string;
}> = {
  emerald: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-700',
    hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    groupHoverBg: 'group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40',
    groupHoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    ring: 'ring-emerald-50 dark:ring-emerald-950/30',
  },
  blue: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-700',
    hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    groupHoverBg: 'group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40',
    groupHoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    ring: 'ring-emerald-50 dark:ring-emerald-950/30',
  },
  indigo: {
    bg: 'bg-teal-600',
    text: 'text-teal-600',
    border: 'border-teal-700',
    hoverBorder: 'hover:border-teal-400 dark:hover:border-teal-500',
    groupHoverBg: 'group-hover:bg-teal-50 dark:group-hover:bg-teal-950/40',
    groupHoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    ring: 'ring-teal-50 dark:ring-teal-950/30',
  },
  rose: {
    bg: 'bg-rose-600',
    text: 'text-rose-600',
    border: 'border-rose-700',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-500',
    groupHoverBg: 'group-hover:bg-rose-50 dark:group-hover:bg-rose-900/30',
    groupHoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    ring: 'ring-rose-50 dark:ring-rose-900/20',
  },
  amber: {
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    border: 'border-amber-600',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-500',
    groupHoverBg: 'group-hover:bg-amber-50 dark:group-hover:bg-amber-900/30',
    groupHoverText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    ring: 'ring-amber-50 dark:ring-amber-900/20',
  },
  purple: {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-700',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-500',
    groupHoverBg: 'group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30',
    groupHoverText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    ring: 'ring-purple-50 dark:ring-purple-900/20',
  },
  cyan: {
    bg: 'bg-teal-500',
    text: 'text-teal-600',
    border: 'border-teal-600',
    hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-500',
    groupHoverBg: 'group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30',
    groupHoverText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    ring: 'ring-teal-50 dark:ring-teal-900/20',
  },
};

const HOME_TRANSLATIONS = {
  ru: {
    loading: 'Загрузка платформы...',
    draftNotice: 'У вас есть сохраненный незавершенный тест (Вариант {id})!',
    draftResume: 'Продолжить тестирование →',
    badge: '✨ KYRGYZ AKYLMAN • Изумрудный стиль',
    heroLine1: 'Подготовься',
    heroLine2: 'к тесту',
    heroTitleItalic: 'профессионально',
    heroSubtitle: 'Выбирай конкретные разделы для тренировки или сдавай полный тест как на настоящем экзамене.',
    yourGoal: 'Твоя цель',
    goldCert: 'Золотой сертификат',
    score: '210+',
    grantSub: 'Высший балл и госгрант 🏆',
    langRu: 'Русский',
    langKg: 'Кыргызча',
    variantPrefix: 'Вариант',
    newBadge: 'Новый',
    allSectionsAvailable: 'Доступны все разделы',
    sectionsLoaded: 'Загружено разделов: {count} из 5',
    selectFormat: 'Выбрать формат',
    hideSections: 'Скрыть разделы',
    chooseFormatTitle: 'Выбери формат тренировки:',
    fullTestButton: 'ПОЛНЫЙ ТЕСТ ОРТ',
    mathBoth: 'Математика (Обе части)',
    downloadPdf: 'Скачать PDF версию этого теста',
    inProgress: 'В процессе',
    noTestsFound: 'Тесты не найдены.',
    tryChangeSearch: 'В данном разделе пока нет доступных тестов.',
  },
  kg: {
    loading: 'Платформа жүктөлүүдө...',
    draftNotice: 'Сизде сакталган бүтө элек тест бар (Вариант {id})!',
    draftResume: 'Тестирлөөнү улантуу →',
    badge: '✨ KYRGYZ AKYLMAN • Изумруддук стиль',
    heroLine1: 'Даярдан',
    heroLine2: 'тестке',
    heroTitleItalic: 'кесипкөйлүк менен',
    heroSubtitle: 'Машыгуу үчүн атайын бөлүмдөрдү танда же чыныгы экзамендегидей толук тестти тапшыр.',
    yourGoal: 'Сенин максатың',
    goldCert: 'Алтын сертификат',
    score: '210+',
    grantSub: 'Эң жогорку балл жана мамлекеттик грант 🏆',
    langRu: 'Орусча',
    langKg: 'Кыргызча',
    variantPrefix: 'Вариант',
    newBadge: 'Жаңы',
    allSectionsAvailable: 'Бардык бөлүмдөр жеткиликтүү',
    sectionsLoaded: 'Жүктөлгөн бөлүмдөр: {count} ичинен 5',
    selectFormat: 'Форматты тандоо',
    hideSections: 'Бөлүмдөрдү жашыруу',
    chooseFormatTitle: 'Машыгуу форматын танда:',
    fullTestButton: 'ТОЛУК ЖРТ ТЕСТИ',
    mathBoth: 'Математика (Эки бөлүгү тең)',
    downloadPdf: 'Бул тесттин PDF версиясын көчүрүп алуу',
    inProgress: 'В процессе',
    noTestsFound: 'Тесттер табылган жок.',
    tryChangeSearch: 'Бул бөлүмдө азырынча тесттер жок.',
  },
};

export const HomePage: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [languageFilter, setLanguageFilter] = useState<'ru' | 'kg'>(() => (lang === 'kg' ? 'kg' : 'ru'));

  const t = HOME_TRANSLATIONS[lang] || HOME_TRANSLATIONS.ru;

  useEffect(() => {
    setLanguageFilter(lang === 'kg' ? 'kg' : 'ru');
  }, [lang]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        // Display all variants (ЦООМО №1, №2, №3)
        setVariants(FALLBACK_VARIANTS);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, []);

  const toggleCard = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const filteredVariants = variants.filter((v) => {
    const vLang = v.language || 'ru';
    return vLang === languageFilter && !v.isPractice;
  });

  if (loading) {
    return (
      <CreativeLoader
        size="fullscreen"
        text={lang === 'kg' ? 'Тесттер жүктөлүүдө...' : 'Загрузка тестов...'}
        subtext={lang === 'kg' ? 'Кыргыз Акылман • Бардык варианттар даярдалууда' : 'Кыргыз Акылман • Подготовка базы заданий'}
      />
    );
  }

  return (
    <div className="flex-1 bg-transparent transition-colors duration-200 font-sans pb-20 relative overflow-hidden">
      {/* Hero section (Full-screen viewport) */}
      <section className="bg-gradient-to-b from-[#031510]/80 via-transparent to-transparent text-white min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] py-12 sm:py-24 px-4 sm:px-8 relative overflow-hidden border-b border-emerald-950/80 flex flex-col justify-between transition-colors duration-200">
        {/* Realistic Monochrome Space Background: Earth & Stars (Subtle, faint, grayscale) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
          <img
            src={heroEarthStarsImg}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right-bottom filter grayscale contrast-125 brightness-95 opacity-20 sm:opacity-25 mix-blend-screen transform scale-105"
          />
          {/* Subtle celestial atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#041d16] via-transparent to-[#031510]/80" />
          <div className="absolute inset-0 bg-radial-[circle_at_75%_65%] from-transparent via-[#041d16]/30 to-[#041d16]/85" />
          
          {/* Subtle twinkling white star particles */}
          <div className="absolute top-[18%] left-[12%] w-1 h-1 bg-white/70 rounded-full shadow-[0_0_6px_#fff] animate-pulse" />
          <div className="absolute top-[32%] left-[28%] w-1.5 h-1.5 bg-white/60 rounded-full shadow-[0_0_8px_#fff] animate-ping duration-1000" style={{ animationDuration: '3s' }} />
          <div className="absolute top-[14%] right-[35%] w-1 h-1 bg-white/80 rounded-full shadow-[0_0_6px_#fff] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[55%] left-[8%] w-0.5 h-0.5 bg-white/50 rounded-full" />
          <div className="absolute top-[72%] left-[22%] w-1 h-1 bg-white/60 rounded-full shadow-[0_0_4px_#fff] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[25%] right-[18%] w-1.5 h-1.5 bg-white/50 rounded-full shadow-[0_0_8px_#fff] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[8%] left-[45%] w-1 h-1 bg-white/70 rounded-full shadow-[0_0_5px_#fff]" />
          
          {/* Faint shooting star streaks (white/monochrome) */}
          <div className="absolute top-[15%] left-[20%] w-24 sm:w-36 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent -rotate-45 transform pointer-events-none opacity-40" />
          <div className="absolute top-[28%] right-[25%] w-32 sm:w-48 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent -rotate-45 transform pointer-events-none opacity-30" />
        </div>

        {/* Ambient Glowing Emerald Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-35 pointer-events-none z-[1]">
          <div className="absolute top-[-10%] left-[-10%] w-[26rem] sm:w-[36rem] h-[26rem] sm:h-[36rem] bg-emerald-600 rounded-full blur-[120px] sm:blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[26rem] sm:w-[36rem] h-[26rem] sm:h-[36rem] bg-teal-600 rounded-full blur-[120px] sm:blur-[160px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] sm:w-[34rem] h-[16rem] sm:h-[22rem] bg-emerald-500/20 rounded-full blur-[90px] sm:blur-[130px]" />
        </div>

        <div className="w-full max-w-5xl mx-auto relative z-10 my-auto text-center flex flex-col items-center justify-center px-3 sm:px-6">
          <h1 id="hero-title" className="font-hero-heavy tracking-tight leading-[1.06] flex flex-col items-center justify-center text-center gap-1 sm:gap-2 select-none w-full mx-auto">
            <span className="font-hero-heavy block w-full text-center mx-auto text-[2.05rem] min-[360px]:text-[2.25rem] min-[390px]:text-[2.5rem] min-[430px]:text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl uppercase font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              {t.heroLine1}
            </span>
            <span className="font-hero-heavy block w-full text-center mx-auto text-[2.05rem] min-[360px]:text-[2.25rem] min-[390px]:text-[2.5rem] min-[430px]:text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl uppercase font-black tracking-tight text-slate-100 drop-shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              {t.heroLine2}
            </span>
            <span className="inline-block w-full text-center mx-auto px-1 sm:px-4 pb-1 text-[1.75rem] min-[360px]:text-[1.95rem] min-[390px]:text-[2.15rem] min-[430px]:text-[2.35rem] sm:text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display',_'Cormorant_Garamond',_Georgia,_serif] italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 drop-shadow-[0_0_40px_rgba(52,211,153,0.55)] tracking-normal mt-0.5 sm:mt-1">
              {t.heroTitleItalic}
            </span>
          </h1>
        </div>

        {/* Scroll indicator with smooth scroll trigger */}
        <div className="relative z-10 text-center pt-6 pb-2">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('tests-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex flex-col items-center gap-1.5 text-emerald-400/70 hover:text-emerald-300 transition-colors group cursor-pointer"
            aria-label={lang === 'kg' ? 'Тесттерди көрүү' : 'Смотреть тесты'}
          >
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest opacity-85 group-hover:opacity-100 transition-opacity drop-shadow-xs">
              {lang === 'kg' ? 'Тесттерди көрүү' : 'Смотреть тесты'}
            </span>
            <span className="text-xl animate-bounce drop-shadow-xs">↓</span>
          </button>
        </div>
      </section>

      {/* Main content: filters and variant cards */}
      <section id="tests-section" className="max-w-5xl mx-auto px-3 sm:px-4 pt-10 sm:pt-16 pb-8 sm:pb-14 relative z-20">
        {/* Filter controls: compact and right-aligned on desktop, responsive on mobile */}
        <div className="flex justify-center sm:justify-end mb-6 sm:mb-8">
          <div className="bg-[#06261d] p-1.5 sm:p-2 rounded-2xl shadow-xl shadow-black/40 border border-emerald-800/50 w-full sm:w-auto inline-flex items-center justify-center sm:justify-end transition-all">
            {/* Language tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#031510] rounded-xl w-full sm:w-72 border border-emerald-900/50">
              <button
                onClick={() => setLanguageFilter('ru')}
                className={`px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 text-center truncate ${
                  languageFilter === 'ru'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${languageFilter === 'ru' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-200'}`}>RU</span>
                <span className="truncate">{t.langRu}</span>
              </button>
              <button
                onClick={() => setLanguageFilter('kg')}
                className={`px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 text-center truncate ${
                  languageFilter === 'kg'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${languageFilter === 'kg' ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-200'}`}>KG</span>
                <span className="truncate">{t.langKg}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Variants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {filteredVariants.map((variant) => {
            const isExpanded = expandedCardId === variant.id;
            const isBlurred = expandedCardId !== null && !isExpanded;
            const isKg = variant.language === 'kg';
            const sectionDict = (lang === 'kg' || isKg) ? SECTION_NAMES_KG : SECTION_NAMES;
            const availableCount = variant.availableSections?.length || 0;
            const isFull = availableCount === 5;
            const hasMathBoth =
              variant.availableSections?.includes(1) && variant.availableSections?.includes(2);

            return (
              <div
                key={variant.id}
                className={`group relative bg-white dark:bg-[#07241c] rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col ${
                  isExpanded
                    ? 'border-emerald-500 dark:border-emerald-400 shadow-2xl shadow-emerald-500/25 ring-2 ring-emerald-500/80 scale-[1.02] z-20'
                    : isBlurred
                    ? 'border-emerald-950/40 dark:border-emerald-950/60 shadow-none opacity-40 blur-[3px] grayscale-[25%] scale-[0.98] cursor-pointer hover:opacity-75 hover:blur-none hover:scale-100 z-0'
                    : 'border-emerald-100/80 dark:border-emerald-900/60 hover:border-emerald-400/80 dark:hover:border-emerald-500/80 shadow-lg shadow-emerald-950/5 dark:shadow-black/30 hover:shadow-2xl hover:shadow-emerald-950/20 hover:-translate-y-1 z-10'
                }`}
              >
                {/* Subtle Top Glow Line */}
                <div className={`h-1.5 w-full transition-all duration-300 ${
                  isExpanded
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                    : 'bg-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-500/40 group-hover:to-teal-500/40'
                }`} />

                {/* Card Main Body */}
                <div
                  onClick={() => toggleCard(variant.id)}
                  className="p-6 cursor-pointer select-none flex flex-col flex-1"
                >
                  {/* Top Meta Bar (Only show New badge if applicable, without #id and language duplicates) */}
                  {variant.isNew && (
                    <div className="flex items-center justify-end mb-2">
                      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border border-emerald-300/60 dark:border-emerald-700/80 shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t.newBadge}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {variant.title || `${t.variantPrefix} ${variant.id}`}
                  </h3>

                  {/* Sections Indicator Dots & Status */}
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-emerald-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((secId) => {
                        const isAvail = variant.availableSections?.includes(secId);
                        return (
                          <span
                            key={secId}
                            title={`${secId}: ${sectionDict[secId]} (${isAvail ? 'Доступен' : 'Недоступен'})`}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              isAvail
                                ? 'bg-emerald-500 dark:bg-emerald-400 shadow-xs shadow-emerald-500/40'
                                : 'bg-slate-200 dark:bg-emerald-950/80 border border-slate-300 dark:border-emerald-900'
                            }`}
                          />
                        );
                      })}
                    </div>

                    <span className="text-[11px] font-bold text-slate-500 dark:text-emerald-300/80">
                      {isFull
                        ? t.allSectionsAvailable
                        : t.sectionsLoaded.replace('{count}', String(availableCount))}
                    </span>
                  </div>
                </div>

                {/* Card expand action bar */}
                <button
                  onClick={() => toggleCard(variant.id)}
                  className={`w-full py-3.5 px-6 font-black text-xs uppercase tracking-wider flex items-center justify-between border-t transition-colors cursor-pointer ${
                    isExpanded
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
                      : 'bg-slate-50/90 dark:bg-[#051c16] text-slate-700 dark:text-emerald-200/90 border-slate-100 dark:border-emerald-900/50 hover:bg-emerald-50/80 dark:hover:bg-[#0a2e24]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-600'}`} />
                    {isExpanded ? t.hideSections : t.selectFormat}
                  </span>
                  <svg
                    className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 transform transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expandable options menu */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50/90 dark:bg-[#041d16] border-t border-emerald-100 dark:border-emerald-900/60 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-emerald-800 dark:text-emerald-400">
                        {t.chooseFormatTitle}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCardId(null);
                        }}
                        className="text-[11px] font-bold text-slate-400 dark:text-emerald-400/70 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Full test option */}
                    {isFull && (
                      <Link
                        to={`/test/${variant.id}?mode=full`}
                        className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98] group/btn"
                      >
                        <span className="flex items-center gap-2 text-sm tracking-wide">
                          <span>🎯</span>
                          {t.fullTestButton}
                        </span>
                        <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs group-hover/btn:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </Link>
                    )}

                    {/* Math both parts */}
                    {hasMathBoth && !isFull && (
                      <Link
                        to={`/test/${variant.id}?mode=custom&sections=1,2`}
                        className="w-full bg-white dark:bg-[#07241c] hover:bg-emerald-50 dark:hover:bg-[#0b382b] border border-emerald-200 dark:border-emerald-800/70 text-slate-800 dark:text-emerald-100 font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-all shadow-xs group/btn"
                      >
                        <span className="text-sm flex items-center gap-2">
                          <span>📐</span>
                          {t.mathBoth}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover/btn:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    )}

                    {/* Individual sections */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      {[1, 2, 3, 4, 5].map((secId) => {
                        const isAvailable = variant.availableSections?.includes(secId);
                        const secName = sectionDict[secId];

                        return isAvailable ? (
                          <Link
                            key={secId}
                            to={`/test/${variant.id}?mode=section&id=${secId}`}
                            className="w-full bg-white dark:bg-[#07241c] border border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400 dark:hover:border-emerald-400 text-slate-800 dark:text-emerald-100 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold py-2.5 px-3.5 rounded-xl flex items-center justify-between transition-all shadow-xs group/item"
                          >
                            <span className="text-xs flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-[10px] flex items-center justify-center">
                                {secId}
                              </span>
                              <span>{secName}</span>
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs group-item:translate-x-0.5 transition-transform">→</span>
                          </Link>
                        ) : (
                          <div
                            key={secId}
                            className="w-full bg-slate-100/60 dark:bg-slate-900/30 border border-slate-200/50 dark:border-emerald-950/40 text-slate-400 dark:text-emerald-900 font-medium py-2.5 px-3.5 rounded-xl flex items-center justify-between cursor-not-allowed opacity-60"
                          >
                            <span className="text-xs flex items-center gap-2 line-through">
                              <span className="w-5 h-5 rounded-md bg-slate-200/60 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 font-bold text-[10px] flex items-center justify-center">
                                {secId}
                              </span>
                              <span>{secName}</span>
                            </span>
                            <span className="text-[10px]">✕</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* PDF Version Download Link (Requested by User) */}
                    <div className="pt-2 mt-1 border-t border-slate-200/80 dark:border-emerald-900/60">
                      {variant.pdfUrl ? (
                        <a
                          href={variant.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-between transition-all group/pdf cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{t.downloadPdf}</span>
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 group-hover/pdf:translate-y-0.5 transition-transform">
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </span>
                        </a>
                      ) : (
                        <div
                          className="w-full py-2 px-3 rounded-xl bg-slate-100/70 dark:bg-emerald-950/40 border border-slate-200/70 dark:border-emerald-900/40 text-slate-500 dark:text-emerald-300/70 text-xs flex items-center justify-between"
                        >
                          <span className="flex items-center gap-1.5 text-[11px] font-medium">
                            <FileText className="w-3.5 h-3.5 opacity-60 shrink-0" />
                            <span>{t.downloadPdf}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white/60 dark:bg-[#02100c] border border-slate-200/80 dark:border-emerald-800/60 text-[10px] font-bold text-slate-600 dark:text-emerald-300/90 flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3 text-emerald-500/80" />
                            <span>{t.inProgress}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredVariants.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 font-medium bg-white dark:bg-[#07241c] rounded-3xl border border-emerald-200 dark:border-emerald-800/60 border-dashed shadow-sm">
              {t.noTestsFound} <br />
              {t.tryChangeSearch}
            </div>
          )}
        </div>
      </section>

      {/* ORT Score Calculator (SchoolClub exact formulas & emerald design) */}
      <OrtScoreCalculator lang={lang} />

      {/* Students Results Section (Результаты наших учеников говорят за нас) */}
      <StudentsResultsSection lang={lang} />

      {/* Pricing / Subscriptions Section */}
      <PricingSection lang={lang} />
    </div>
  );
};
