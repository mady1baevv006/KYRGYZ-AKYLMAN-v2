import React from 'react';
import { Link } from 'react-router-dom';
import { AppLanguage } from '../types';

const PRACTICE_TRANSLATIONS = {
  ru: {
    title: 'Полигон обновляется',
    subtitle: 'Сейчас идёт загрузка новых тестов. Прошу ожидайте, скоро здесь появится много полезных материалов для точечной тренировки!',
    backHome: 'Вернуться на главную',
  },
  kg: {
    title: 'Полигон жаңыланууда',
    subtitle: 'Азыр жаңы тесттер жүктөлүп жатат. Күтө туруңуз, жакында бул жерде бөлүмдөр боюнча машыгуу үчүн пайдалуу материалдар чыгат!',
    backHome: 'Башкы бетке кайтуу',
  },
};

export const PracticePage: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const t = PRACTICE_TRANSLATIONS[lang] || PRACTICE_TRANSLATIONS.ru;

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 text-center font-sans selection:bg-emerald-500/30 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/15 dark:bg-emerald-600/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white dark:bg-[#06261d] border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-xl">
          🚧
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.title}
        </h1>
        <p className="text-slate-600 dark:text-emerald-200/80 font-medium max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
          {t.subtitle}
        </p>
        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-600/30 text-xs"
        >
          {t.backHome}
        </Link>
      </div>
    </div>
  );
};
