import React, { useEffect, useState } from 'react';
import { AppLanguage } from '../types';

const PROMPT_TRANSLATIONS = {
  ru: {
    boost: 'Прокачай подготовку',
    iosTitle: 'Забудь про браузер!',
    androidTitle: 'KYRGYZ AKYLMAN — теперь приложением',
    iosDesc: 'Установи веб-приложение на экран «Домой» для быстрого доступа, полного экрана и максимального удобства при решении тестов.',
    androidDesc: 'Установи приложение на устройство: быстрый доступ с главного экрана, без лишних вкладок и панелей браузера!',
    iosHint: 'Нажмите кнопку «Поделиться» в Safari, затем выберите «На экран „Домой“».',
    installButton: 'Установить приложение',
  },
  kg: {
    boost: 'Даярдыкты чыңда',
    iosTitle: 'Браузерди унут!',
    androidTitle: 'KYRGYZ AKYLMAN — эми тиркеме катары',
    iosDesc: 'Тесттерди ыңгайлуу иштөө жана толук экран режими үчүн тиркемени «Башкы экранга» орнотуңуз.',
    androidDesc: 'Түзмөгүңүзгө тиркемени орнотуңуз: башкы экрандан тез кирүү, ашыкча өтмөктөрсүз!',
    iosHint: 'Safari браузериндеги «Бөлүшүү» баскычын басып, андан кийин «Башкы экранга» тандаңыз.',
    installButton: 'Тиркемени орнотуу',
  },
  en: {
    boost: 'Boost Your Preparation',
    iosTitle: 'Forget the browser!',
    androidTitle: 'KYRGYZ AKYLMAN — now as an app',
    iosDesc: 'Install the web app to your Home Screen for quick access, full screen, and a seamless testing experience.',
    androidDesc: 'Install the app on your device: instant access from your home screen without extra browser bars!',
    iosHint: 'Tap "Share" in Safari, then select "Add to Home Screen".',
    installButton: 'Install App',
  },
};

export const InstallPrompt: React.FC<{ lang?: AppLanguage }> = ({ lang = 'ru' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const t = PROMPT_TRANSLATIONS[lang] || PROMPT_TRANSLATIONS.ru;

  useEffect(() => {
    // Check if already standalone
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setIsIOS(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || !isVisible || (!isIOS && !deferredPrompt)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-105 bg-[#041f17] text-white p-6 rounded-3xl shadow-[0_15px_60px_rgba(0,0,0,0.6)] z-50 border border-emerald-800/50 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-3xl flex items-center justify-center text-3xl shadow-inner shadow-white/30 shrink-0">
            💎
          </div>
          <div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-400 mb-1 leading-none">
              {t.boost}
            </h3>
            <p className="text-xl font-black text-white leading-tight tracking-tight">
              {isIOS ? t.iosTitle : t.androidTitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="shrink-0 text-slate-500 hover:text-rose-400 transition-colors p-1.5 -mt-8 -mr-1 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">
        {isIOS ? t.iosDesc : t.androidDesc}
      </p>

      {isIOS ? (
        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 flex items-center gap-3 text-xs text-slate-300">
          <span className="text-lg">📲</span>
          <span>{t.iosHint}</span>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
        >
          {t.installButton}
        </button>
      )}
    </div>
  );
};
