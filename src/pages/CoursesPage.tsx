import React, { useEffect } from 'react';
import { AppLanguage } from '../types';
import { CoursesSection } from '../components/courses/CoursesSection';
import { GraduationCap, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CoursesPageProps {
  lang: AppLanguage;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ lang }) => {
  const isKg = lang === 'kg';
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = isKg
      ? 'Страница курсов — Кыргыз Акылман'
      : 'Страница курсов — Кыргыз Акылман';
  }, [isKg]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[82vh] bg-[#031510] text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#05261c] border border-emerald-800/60 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-inner">
            <Lock className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-300" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 mb-4">
            {isKg ? 'Жаңыртууда' : 'Обновление'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
            {isKg ? 'Временно недоступен' : 'Временно недоступен'}
          </h1>

          <p className="text-sm text-emerald-200/70 font-medium leading-relaxed mb-8">
            {isKg
              ? 'Курстар бөлүмү администратор тарабынан жаңыланууда. Жакында кайрадан ачылат.'
              : 'Раздел курсов временно закрыт на обновление учебных материалов и программ администратором.'}
          </p>

          <button
            onClick={handleGoBack}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-[#031510] shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isKg ? 'Вернуться назад' : 'Вернуться назад'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#031510] text-slate-100 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title: Страница курсов */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/60">
          <div className="flex items-center gap-3.5">
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

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isKg ? 'Администратордун режими' : 'Режим администратора'}</span>
          </div>
        </div>

        <CoursesSection lang={lang} />
      </div>
    </div>
  );
};
