import React, { useEffect, useState } from 'react';
import { AppLanguage } from '../types';

const MODAL_TRANSLATIONS = {
  ru: {
    seasonBadge: 'Сезон ОРТ 2026',
    title: 'Твой путь к Золотому Сертификату',
    desc: 'Привет, будущий студент! 🚀 Общереспубликанское тестирование — это не просто экзамен, это твой билет в университет мечты и возможность получить государственный грант.',
    timingTitle: 'Тайминг как на ОРТ',
    timingDesc: 'Тренируйся укладываться в отведенное время на каждый раздел теста.',
    analyticsTitle: 'Детальная аналитика',
    analyticsDesc: 'Узнай свои сильные и слабые темы с подробным расчетом баллов по шкале ЦООМО.',
    tipLabel: 'Совет:',
    tipText: 'Решай тесты без подсказок и черновиков на телефоне. Используй наш встроенный черновик для рисования и вычислений прямо на экране.',
    buttonText: 'Погнали к сотне баллов! 🚀',
  },
  kg: {
    seasonBadge: 'ЖРТ 2026 Сезону',
    title: 'Алтын Сертификатка карай жолуң',
    desc: 'Салам, болочоктогу студент! 🚀 Жалпы республикалык тестирлөө — бул жөн гана сынак эмес, бул сенин кыялданган университетиңе жана мамлекеттик грантка билет.',
    timingTitle: 'ЖРТдагыдай так убакыт',
    timingDesc: 'Тесттин ар бир бөлүмүнө бөлүнгөн убакытка тууралап иштөөгө көнүгүңүз.',
    analyticsTitle: 'Толук аналитика',
    analyticsDesc: 'БББОУБ шкаласы боюнча балдарды эсептөө менен күчтүү жана алсыз жактарыңызды билиңиз.',
    tipLabel: 'Кеңеш:',
    tipText: 'Тесттерди телефондон көчүрбөй жана өз алдынча иштеңиз. Экранда эсептөөлөр үчүн биздин ыңгайлуу караламаны колдонуңуз.',
    buttonText: 'Жогорку баллга алга! 🚀',
  },
};

export const MotivationModal: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const t = MODAL_TRANSLATIONS[lang] || MODAL_TRANSLATIONS.ru;

  useEffect(() => {
    if (!localStorage.getItem('has_seen_exam_motivation')) {
      const t1 = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      const t2 = setTimeout(() => {
        setIsVisible(true);
      }, 2100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('has_seen_exam_motivation', 'true');
    setTimeout(() => {
      setIsOpen(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />
      <div
        className={`relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 ease-out transform ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-12'
        } border border-slate-200/50 dark:border-slate-700/50 flex flex-col max-h-[90vh]`}
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="relative pt-6 sm:pt-8 px-5 sm:px-10 pb-3 sm:pb-4 flex justify-between items-start shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-emerald-500/30 shrink-0 animate-bounce">
              🎯
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                {t.seasonBadge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {t.title}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="px-5 sm:px-10 py-4 overflow-y-auto space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {t.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xl mb-1">⏱️</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.timingTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.timingDesc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-xl mb-1">📊</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.analyticsTitle}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.analyticsDesc}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200">
            💡 <b>{t.tipLabel}</b> {t.tipText}
          </div>
        </div>

        <div className="p-5 sm:px-10 sm:py-6 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end gap-3 shrink-0">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
          >
            {t.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
