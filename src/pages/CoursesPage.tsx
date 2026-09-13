import React, { useEffect } from 'react';
import { AppLanguage } from '../types';
import { CoursesSection } from '../components/courses/CoursesSection';
import { GraduationCap } from 'lucide-react';

interface CoursesPageProps {
  lang: AppLanguage;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ lang }) => {
  const isKg = lang === 'kg';

  useEffect(() => {
    document.title = isKg
      ? 'Страница курсов — Кыргыз Акылман'
      : 'Страница курсов — Кыргыз Акылман';
  }, [isKg]);

  return (
    <div className="min-h-screen bg-[#031510] text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title: Страница курсов */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-emerald-900/60">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {isKg ? 'Страница курсов' : 'Страница курсов'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/70 font-medium">
              {isKg ? 'ЖРТга даярдоо боюнча толук программалар жана маалымат' : 'Программы и полная информация о подготовительных курсах к ОРТ'}
            </p>
          </div>
        </div>

        <CoursesSection lang={lang} />
      </div>
    </div>
  );
};
