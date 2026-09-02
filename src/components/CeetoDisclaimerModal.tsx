import React from 'react';
import { AppLanguage } from '../types';

interface CeetoDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

export const CeetoDisclaimerModal: React.FC<CeetoDisclaimerModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
}) => {
  if (!isOpen) return null;

  const isKg = lang === 'kg';

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0c1a30] rounded-3xl border-2 border-[#334290] shadow-2xl shadow-[#334290]/25 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Blue Accent */}
        <div className="bg-[#334290] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-md border border-white/40">
              <img
                src="https://res.cloudinary.com/rw9qhk3a/image/upload/v1788172390/%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D0%B1%D0%B5%D0%B7_%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F_13.png"
                alt="ЦООМО / CEETO"
                className="h-7 w-auto object-contain drop-shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-wider text-white">
                {isKg ? 'Расмий билдирүү' : 'Официальное уведомление'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-sm font-bold transition-all cursor-pointer active:scale-95"
            title="Жабуу / Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-slate-800 dark:text-slate-100">
          <div className="flex items-center gap-3 p-3.5 mb-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
            <div className="w-10 h-10 rounded-xl bg-[#334290] text-white flex items-center justify-center text-xl shrink-0 shadow-sm">
              ℹ️
            </div>
            <p className="text-xs font-semibold text-[#334290] dark:text-blue-300 leading-relaxed">
              {isKg
                ? 'Билим берүүнү баалоо жана окутуу усулдары борбору'
                : 'Центр оценки в образовании и методов обучения'}
            </p>
          </div>

          <p className="text-sm leading-relaxed mb-6 font-medium text-slate-700 dark:text-slate-200">
            {isKg
              ? 'Бул сыноо тесттеринин жана тапшырмаларынын бардык автордук укуктары Билим берүүнү баалоо жана окутуу усулдары борборуна (ЦООМО) таандык. Материалдар окуучулардын даярдануусу үчүн гана билим берүү максатында сунушталат.'
              : 'Правообладателем материалов, бланков и заданий пробных тестов является Центр оценки в образовании и методов обучения (ЦООМО). Материалы представлены исключительно в образовательных целях для подготовки абитуриентов.'}
          </p>

          {/* Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#334290] hover:bg-[#263375] active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#334290]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>✓</span>
            <span>{isKg ? 'Түшүнүктүү, тестке өтүү' : 'Понятно, перейти к тесту'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
