import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOTIVATIONAL_QUOTES_RU, MOTIVATIONAL_QUOTES_KG, MotivationalQuote } from '../data/constants';
import { AppLanguage } from '../types';
import { OrtCountdownTimer } from './OrtCountdownTimer';

const FOOTER_TRANSLATIONS = {
  ru: {
    terms: 'Пользовательское соглашение',
    privacy: 'Конфиденциальность',
    telegram: 'Телеграм',
    youtube: 'Ютуб',
  },
  kg: {
    terms: 'Колдонуучунун келишими',
    privacy: 'Купуялуулук саясаты',
    telegram: 'Телеграм',
    youtube: 'Ютуб',
  },
  en: {
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    telegram: 'Telegram',
    youtube: 'YouTube',
  },
};

export const Footer: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const t = FOOTER_TRANSLATIONS[lang] || FOOTER_TRANSLATIONS.ru;
  const quotesList: MotivationalQuote[] =
    lang === 'kg' ? MOTIVATIONAL_QUOTES_KG : MOTIVATIONAL_QUOTES_RU;

  // Selected randomly once on page load/mount
  const [quoteIndex] = useState(() => {
    return Math.floor(Math.random() * quotesList.length);
  });

  const currentQuote = quotesList[quoteIndex % quotesList.length] || quotesList[0];

  return (
    <footer className="bg-[#031913] border-t border-emerald-950/70 pt-8 pb-8 mt-auto font-sans transition-colors">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6">
        {/* Quotes Block (Left) and Square Countdown Timer (Right) on the same level */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch mb-6">
          {/* Quotes Card */}
          <div className="md:col-span-7 lg:col-span-8 relative py-4 px-5 sm:py-5 sm:px-7 rounded-2xl bg-[#05261c] border border-emerald-800/40 shadow-lg shadow-black/30 flex flex-col justify-between overflow-hidden">
            {/* Subtle ambient light */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Quote text with custom Merriweather serif typography */}
            <p className="text-sm sm:text-base text-emerald-50/95 font-normal leading-relaxed tracking-wide font-['Merriweather',_Georgia,_serif] relative z-10 my-auto">
              «{currentQuote.text}»
            </p>

            {/* Author info aligned to the right in italics */}
            <div className="text-right mt-3 pt-2.5 border-t border-emerald-900/40 relative z-10 flex flex-col items-end">
              <p className="text-xs sm:text-sm font-semibold text-emerald-400 italic">
                — {currentQuote.author}
              </p>
              {currentQuote.source && (
                <p className="text-[11px] sm:text-xs text-emerald-200/60 italic mt-0.5">
                  {currentQuote.source}
                </p>
              )}
            </div>
          </div>

          {/* Square-proportioned Countdown Timer Card (Right) */}
          <div className="md:col-span-5 lg:col-span-4 flex">
            <OrtCountdownTimer lang={lang} className="w-full h-full" />
          </div>
        </div>

        {/* Bottom copyright, emerald icon-only social links, and legal disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-emerald-900/30 text-xs text-emerald-300/60">
          <div className="flex items-center gap-3">
            <span className="font-black text-emerald-300">KYRGYZ AKYLMAN</span>
            <span>© 2026</span>
            
            {/* Emerald Icon-Only Social Buttons */}
            <div className="flex items-center gap-2 ml-2">
              <a
                href="https://t.me/kyrgyzakylman"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/90 border border-emerald-800/60 text-emerald-400 hover:text-emerald-200 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                title="Telegram: @kyrgyzakylman"
                aria-label="Telegram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@kyrgyzakylman"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/90 border border-emerald-800/60 text-emerald-400 hover:text-emerald-200 transition-all flex items-center justify-center active:scale-95 shadow-sm"
                title="YouTube: @kyrgyzakylman"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">
              {t.terms}
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
              {t.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
