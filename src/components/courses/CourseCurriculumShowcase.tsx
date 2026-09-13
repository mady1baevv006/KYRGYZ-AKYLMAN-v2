import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Users,
  Video,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup, CourseLesson } from '../../types/courses';

interface CourseCurriculumShowcaseProps {
  course: CourseGroup;
  lang: AppLanguage;
  isPremium?: boolean;
  isVip?: boolean;
  onEnroll: (course: CourseGroup) => void;
  onEnterClassroom?: (course: CourseGroup) => void;
  isEnrolled?: boolean;
}

// Traditional Kyrgyz Tunduk / Ornament SVG
const KyrgyzOrnamentSvg: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="28" strokeDasharray="4 2" />
    <circle cx="32" cy="32" r="14" />
    <path d="M32 4 C32 18, 18 32, 4 32" strokeLinecap="round" />
    <path d="M32 4 C32 18, 46 32, 60 32" strokeLinecap="round" />
    <path d="M32 64 C32 46, 18 32, 4 32" strokeLinecap="round" />
    <path d="M32 64 C32 46, 46 32, 60 32" strokeLinecap="round" />
    <polygon points="32,26 38,32 32,38 26,32" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

// Traditional Kyrgyz Kochkor Muyuz (Ram Horn) Motif SVG
const KochkorMuyuzSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 36 C18 30, 8 26, 6 18 C4 10, 10 4, 18 6 C24 8, 24 16, 18 16 C14 16, 12 12, 14 10 C15 8, 17 8, 17 9 C17 11, 14 12, 16 13 C18 14, 20 10, 16 8 C11 6, 6 11, 8 18 C10 24, 18 28, 20 34 C22 28, 30 24, 32 18 C34 11, 29 6, 24 8 C20 10, 22 14, 24 13 C26 12, 23 11, 23 9 C23 8, 25 8, 26 10 C28 12, 26 16, 22 16 C16 16, 16 8, 22 6 C30 4, 36 10, 34 18 C32 26, 22 30, 20 36 Z" />
  </svg>
);

export const CourseCurriculumShowcase: React.FC<CourseCurriculumShowcaseProps> = ({
  course,
  lang,
  isPremium = false,
  isVip = false,
  onEnroll,
  onEnterClassroom,
  isEnrolled = false,
}) => {
  const isKg = lang === 'kg';
  const hasVipAccess = isPremium || isVip;

  // Toggle state for Curriculum plan (when student clicks "Учебный план")
  const [isCurriculumOpen, setIsCurriculumOpen] = useState<boolean>(false);

  // Toggle state for Schedule & Format section (hidden by default, opens on click)
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);

  // Toggle state for Calendar detailed dates inside schedule
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // Active expanded module accordion item
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('mod-01');

  // Calendar View: Active Month (0 = Oct, 1 = Nov, 2 = Dec 2026, 3 = Jan 2027)
  const [activeMonthTab, setActiveMonthTab] = useState<number>(0);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(course.lessons[0] || null);

  const modules = course.curriculumModules || [];

  const monthLabels = [
    { id: 0, labelRu: 'Октябрь 2026', labelKg: 'Октябрь 2026', monthStr: '2026-10' },
    { id: 1, labelRu: 'Ноябрь 2026', labelKg: 'Ноябрь 2026', monthStr: '2026-11' },
    { id: 2, labelRu: 'Декабрь 2026', labelKg: 'Декабрь 2026', monthStr: '2026-12' },
    { id: 3, labelRu: 'Январь 2027', labelKg: 'Январь 2027', monthStr: '2027-01' },
  ];

  const currentMonthFilter = monthLabels[activeMonthTab]?.monthStr || '2026-10';
  const monthLessons = course.lessons.filter((l) => l.date.startsWith(currentMonthFilter));

  const toggleModule = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id));
  };

  const handleToggleCurriculum = () => {
    setIsCurriculumOpen((prev) => !prev);
  };

  const teacherAvatarUrl =
    'https://res.cloudinary.com/rw9qhk3a/image/upload/v1789319418/photo_2026-08-18_02-26-%D1%84%D1%8B%D0%B2%D1%84%D1%8B%D0%B2%D1%84%D1%8B.jpg';

  return (
    <div className="text-left w-full">
      {/* THE SOLE BIG COURSE BLOCK: "Математика ОРТ: Базовая подготовка для 180+ баллов" */}
      <div
        className={`relative rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border transition-all ${
          hasVipAccess
            ? 'bg-gradient-to-br from-[#07241c] via-[#051c15] to-[#121c0e] border-amber-400/80 shadow-amber-400/10'
            : 'bg-gradient-to-br from-[#062c20] via-[#041f17] to-[#02150f] border-emerald-600/50 shadow-emerald-500/10'
        }`}
      >
        {/* Background ambient ornaments */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 text-emerald-500/5 pointer-events-none">
          <KyrgyzOrnamentSvg className="w-80 h-80" />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Top Badges Row: "Подготовка к ОРТ" and "1-ый модуль" */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKg ? 'ЖРТга даярдоо' : 'Подготовка к ОРТ'}</span>
            </span>

            <span className="px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/50 text-teal-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>{isKg ? '1-модуль' : '1-ый модуль'}</span>
            </span>
          </div>

          {/* Big Course Title & Description */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {isKg
                ? 'Математика ЖРТ: 180+ балл үчүн базалык даярдоо'
                : 'Математика ОРТ: Базовая подготовка для 180+ баллов'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 leading-relaxed font-normal">
              {isKg
                ? 'Бул математиканын биринчи модулу: бардык базалык негиздерди башынан баштап нөлдөн өздөштүрөбүз. ЦООМОнун реалдуу тесттери менен иштейбиз, кемчиликтерди жоюп, 180+ баллга жетүү үчүн бекем пайдубал курабыз.'
                : 'Это первый модуль математики: проходим фундаментальную базу и осваиваем все начала с нуля. Будем заниматься с реальными тестами и алгоритмами ЦООМО, закрывать пробелы и закладывать прочную основу для уверенного выхода на 180+ баллов.'}
            </p>
          </div>

          {/* 4 Essential Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Price */}
            <div
              className={`p-4 rounded-2xl border ${
                hasVipAccess
                  ? 'bg-amber-950/20 border-amber-400/40'
                  : 'bg-[#031510] border-emerald-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
                <span>{isKg ? 'Баасы' : 'Стоимость'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {isKg ? '1 модуль' : 'за модуль'}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                <span className={hasVipAccess ? 'text-amber-300' : 'text-emerald-400'}>
                  12 000
                </span>
                <span className="text-sm font-bold text-slate-300">сом</span>
              </div>
              <p className="text-[11px] text-emerald-200/70 mt-1 font-medium">
                {isKg ? '3 айлык окуу цикли' : 'Цикл обучения на 3 месяца'}
              </p>
            </div>

            {/* 2. Duration */}
            <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
                <span>{isKg ? 'Узактыгы' : 'Длительность'}</span>
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isKg ? '3 ай' : '3 месяца'}
              </div>
              <p className="text-[11px] text-emerald-200/70 mt-1 font-medium">
                {isKg ? 'Ай = 28 күн (так 4 апта)' : 'Месяц = 28 дней (4 недели)'}
              </p>
            </div>

            {/* 3. Schedule */}
            <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
                <span>{isKg ? 'Күндөрдүн тартиби' : 'График занятий'}</span>
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Пн – Пт
              </div>
              <p className="text-[11px] text-emerald-200/70 mt-1 font-medium">
                {isKg ? 'Саат 19:00 - 20:00 (Сб, Жк эс алуу)' : '19:00 - 20:00 (Сб и Вс отдых)'}
              </p>
            </div>

            {/* 4. Start Date */}
            <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
                <span>{isKg ? 'Биринчи агымдын старты' : 'Старт первого потока'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 tracking-tight">
                {isKg ? '5-октябрь' : '5 октября'}
              </div>
              <p className="text-[11px] text-emerald-200/70 mt-1 font-medium">
                {isKg ? 'Саат 19:00дө' : 'В 19:00'}
              </p>
            </div>
          </div>

          {/* SCHEDULE TOGGLE BUTTON: Hidden by default, opens like "Учебный план" */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsScheduleOpen((prev) => !prev)}
              className={`w-full rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all cursor-pointer border shadow-lg ${
                isScheduleOpen
                  ? 'bg-[#02130e] border-emerald-500/80 shadow-emerald-500/10'
                  : 'bg-[#02130e]/80 hover:bg-[#031a14] border-emerald-700/60'
              }`}
            >
              <div className="flex items-center gap-3.5 text-left min-w-0">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                      {isKg ? 'Сабактардын расписаниеси & форматы' : 'Расписание и формат занятий'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                      Пн – Пт · 19:00 - 20:00
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/70 mt-0.5 truncate">
                    {isKg
                      ? 'Дүйшөмбүдөн Жумага чейин саат 19:00дөн 20:00гө чейин. Көрүү үчүн басыңыз.'
                      : 'Каждый день с понедельника по пятницу с 19:00 до 20:00. Нажмите, чтобы открыть.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs shrink-0">
                <span className="hidden sm:inline">
                  {isScheduleOpen ? (isKg ? 'Жашыруу' : 'Скрыть') : (isKg ? 'Көрсөтүү' : 'Показать')}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center transition-transform ${
                    isScheduleOpen ? 'rotate-180 bg-emerald-500/30 text-white' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* EXPANDED SCHEDULE SECTION (Only visible when toggled open) */}
            {isScheduleOpen && (
              <div className="rounded-3xl bg-[#02130e]/95 border border-emerald-700/60 p-5 sm:p-7 space-y-5 shadow-xl animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/50 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-base font-black text-white tracking-tight">
                        {isKg ? 'Апталык график жана сабактардын багыты' : 'Недельный график и структура уроков'}
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-200/70">
                      {isKg
                        ? 'Күн сайын Дүйшөмбүдөн Жумага чейин саат 19:00дөн 20:00гө чейин.'
                        : 'Каждый день с понедельника по пятницу с 19:00 до 20:00.'}
                    </p>
                  </div>

                  {/* Toggle detailed date calendar */}
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-bold text-xs flex items-center gap-2 transition-all self-start sm:self-center cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {isCalendarOpen
                        ? (isKg ? 'Календарды жабуу' : 'Скрыть календарь дат')
                        : (isKg ? 'Күндөр календары (Октябрь–Январь)' : 'Календарь дат (Октябрь–Январь)')}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {/* Weekday Cards Strip (Пн - Пт + Сб/Вс) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {[
                    { day: 'Пн', titleRu: 'Теория & разбор тем', titleKg: 'Теория & теманы талдоо', time: '19:00 - 20:00', isRest: false },
                    { day: 'Вт', titleRu: 'Практикум ЦООМО', titleKg: 'ЦООМО практикуму', time: '19:00 - 20:00', isRest: false },
                    { day: 'Ср', titleRu: 'Алгоритмы решений', titleKg: 'Чыгаруу алгоритмдери', time: '19:00 - 20:00', isRest: false },
                    { day: 'Чт', titleRu: 'Базовые ловушки ОРТ', titleKg: 'ЖРТ базалык татаалдыктары', time: '19:00 - 20:00', isRest: false },
                    { day: 'Пт', titleRu: 'Недельный срез & ДЗ', titleKg: 'Жумалык тест & ҮТ', time: '19:00 - 20:00', isRest: false },
                    { day: 'Сб - Вс', titleRu: 'Отдых & повторение', titleKg: 'Эс алуу & кайталоо', time: 'Выходные дни', isRest: true },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2 ${
                        item.isRest
                          ? 'bg-[#031510]/50 border-emerald-900/50 text-slate-400'
                          : 'bg-[#031a14] border-emerald-700/60 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                            item.isRest
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          }`}
                        >
                          {item.day}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300/80">{item.time}</span>
                      </div>
                      <p className="text-[11px] font-bold leading-tight">
                        {isKg ? item.titleKg : item.titleRu}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Detailed Interactive Date Calendar (if toggled open) */}
                {isCalendarOpen && (
                  <div className="pt-4 border-t border-emerald-800/40 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-slate-300">
                        {isKg ? 'Ай боюнча график:' : 'График по месяцам:'}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {monthLabels.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setActiveMonthTab(m.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              activeMonthTab === m.id
                                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                                : 'bg-[#031510] border border-emerald-800/70 text-emerald-200 hover:bg-emerald-900/40'
                            }`}
                          >
                            {isKg ? m.labelKg : m.labelRu}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grid of lessons in month */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                      {monthLessons.map((lesson) => {
                        const isSelected = selectedLesson?.id === lesson.id;
                        const isFirstLesson = lesson.date === '2026-10-05';

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-1 ${
                              isSelected
                                ? 'bg-[#062c20] border-emerald-400 shadow-sm'
                                : isFirstLesson
                                ? 'bg-[#05261c] border-emerald-500/80 ring-1 ring-emerald-400/40'
                                : 'bg-[#031510] border-emerald-800/60 hover:border-emerald-700'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">
                                {lesson.date}
                              </span>
                              <span className="text-emerald-400 font-bold">19:00 - 20:00</span>
                            </div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {lesson.titleRu}
                            </h4>
                            {isFirstLesson && (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
                                ★ СТАРТ КУРСА
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Teacher Profile & Action Buttons: [Учебный план] on left, [Записаться на курс] on right */}
          <div className="pt-4 border-t border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Teacher snippet: Photo with custom URL and no ORT score badge */}
            <div className="flex items-center gap-3.5">
              <img
                src={teacherAvatarUrl}
                alt={course.teacher.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-md shrink-0 bg-emerald-950"
              />
              <div>
                <h4 className="font-black text-white text-sm sm:text-base">
                  {course.teacher.name}
                </h4>
                <p className="text-xs text-emerald-300 mt-0.5 font-medium">
                  {isKg ? course.teacher.titleKg : course.teacher.title}
                </p>
              </div>
            </div>

            {/* Action Buttons: [Учебный план] first, and [Записаться на курс (12 000 сом)] on the right */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              {/* "Учебный план" button */}
              <button
                type="button"
                onClick={handleToggleCurriculum}
                className={`px-5 sm:px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 shadow-lg active:scale-95 ${
                  isCurriculumOpen
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 shadow-emerald-500/10'
                    : 'bg-[#031510] hover:bg-emerald-950/80 border-emerald-600/80 text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>{isKg ? 'Окуу планы' : 'Учебный план'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  7 {isKg ? 'модуль' : 'модулей'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isCurriculumOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* "Записаться на курс (12 000 сом)" button (or Enter Classroom if already enrolled) */}
              {isEnrolled ? (
                <button
                  type="button"
                  onClick={() => onEnterClassroom && onEnterClassroom(course)}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>{isKg ? 'Окуу кабинетине кирүү' : 'Войти в учебный класс'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onEnroll(course)}
                  className={`px-6 sm:px-7 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl active:scale-95 cursor-pointer flex items-center gap-2.5 ${
                    hasVipAccess
                      ? 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 shadow-amber-400/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isKg ? 'Курска жазылуу (12 000 сом)' : 'Записаться на курс (12 000 сом)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* CURRICULUM ACCORDION (EMBEDDED DIRECTLY IN THE BIG BLOCK WHEN OPEN) */}
          {isCurriculumOpen && (
            <div className="pt-6 border-t border-emerald-800/60 space-y-6 animate-in fade-in duration-300">
              {/* Curriculum Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#02130e]/80 p-4 sm:p-5 rounded-2xl border border-emerald-800/60">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {isKg ? 'Окуу планы: 7 модуль (102 ак. саат)' : 'Учебный план: 7 модулей (102 ак. ч)'}
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-200/70 mt-1">
                    {isKg
                      ? 'Ар бир модуль ЖРТнын конкреттүү бөлүмдөрүн толук камтыйт жана пошаговый чыгарылыштарды камтыйт.'
                      : 'Каждый модуль закрывает конкретные задания ОРТ по математике и включает фото-решения к каждому номеру.'}
                  </p>
                </div>

                <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700 self-start sm:self-center">
                  ЦООМО 2026–2027
                </span>
              </div>

              {/* 7 Modules Accordion List */}
              <div className="space-y-3">
                {modules.map((mod) => {
                  const isExpanded = expandedModuleId === mod.id;

                  return (
                    <div
                      key={mod.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isExpanded
                          ? hasVipAccess
                            ? 'bg-[#07241c] border-amber-400/60 shadow-lg'
                            : 'bg-[#062c20] border-emerald-500/70 shadow-lg'
                          : 'bg-[#031510] border-emerald-800/60 hover:border-emerald-700/90'
                      }`}
                    >
                      {/* Module Bar Header */}
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                          {/* Number Badge */}
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-inner ${
                              isExpanded
                                ? hasVipAccess
                                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                                  : 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                                : 'bg-[#020e0a] text-emerald-300 border border-emerald-800/80'
                            }`}
                          >
                            {mod.orderNumber}
                          </div>

                          {/* Module Title & Tasks */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm sm:text-base font-black text-white tracking-tight">
                                {isKg ? mod.titleKg : mod.titleRu}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                                {isKg ? mod.tasksCoveredKg : mod.tasksCoveredRu}
                              </span>
                            </div>
                            <p className="text-xs text-emerald-200/60 mt-0.5 line-clamp-1 font-medium hidden sm:block">
                              {isKg ? mod.descriptionKg : mod.descriptionRu}
                            </p>
                          </div>
                        </div>

                        {/* Right side: Academic Hours & Chevron */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-black text-emerald-300 whitespace-nowrap bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-800/70">
                            {mod.academicHours} {isKg ? 'ак. с' : 'ак. ч'}
                          </span>
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                              isExpanded ? 'bg-white/10 text-white rotate-180' : 'text-slate-400'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details View */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-emerald-800/50 space-y-4 animate-in fade-in duration-200">
                          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                            {isKg ? mod.descriptionKg : mod.descriptionRu}
                          </p>

                          {/* Topics List */}
                          {mod.topics && mod.topics.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{isKg ? 'Модулдагы негизги темалар:' : 'Ключевые темы модуля:'}</span>
                              </h5>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {mod.topics.map((topic, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="p-2.5 rounded-xl bg-[#020e0a] border border-emerald-800/60 text-xs text-emerald-100 flex items-start gap-2"
                                  >
                                    <span className="text-emerald-400 font-bold">›</span>
                                    <span>{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer note for module */}
                          <div className="pt-2 flex items-center justify-between text-[11px] text-emerald-300/80">
                            <span>
                              {isKg
                                ? 'Үй тапшырмасы жана ар бир тема боюнча фото-чыгарылыш камтылган'
                                : 'Включает домашние задания и пошаговые фото-решения к каждому номеру'}
                            </span>
                            <span className="font-bold text-emerald-400">ЦООМО 2026</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
