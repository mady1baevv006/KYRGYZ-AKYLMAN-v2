import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, Send } from 'lucide-react';
import { AppLanguage } from '../types';

interface TelegramChannelPromoModalProps {
  lang: AppLanguage;
  forceOpen?: boolean;
  onClose?: () => void;
}

const STORAGE_KEY = 'kyrgyzakylman_tg_channel_promo_seen';
const TELEGRAM_CHANNEL_URL = 'https://t.me/kyrgyzakylmanedu';

export const TelegramChannelPromoModal: React.FC<TelegramChannelPromoModalProps> = ({
  lang,
  forceOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isKg = lang === 'kg';

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Check if the user already saw this modal in the current session
    try {
      const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
      if (!alreadySeen) {
        // Smooth entrance delay so the initial page paint is fully settled
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors in private mode
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    setIsOpen(false);
    onClose?.();
  };

  const handleOpenChannel = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    setIsOpen(false);
    onClose?.();
    window.open(TELEGRAM_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#062c20] via-[#041d16] to-[#02120e] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.35)] text-white overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glowing atmospheric orbs behind modal content */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close icon button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer z-20"
          aria-label={isKg ? 'Жабуу' : 'Закрыть'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal body */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-4 pt-1">
          {/* Animated Telegram Icon with Glowing Aura */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/40 transform hover:scale-105 transition-transform">
              {/* Telegram Paper Plane Icon */}
              <Send className="w-8 h-8 sm:w-9 sm:h-9 text-slate-950 fill-slate-950 -translate-x-0.5 translate-y-0.5" />
            </div>
            {/* Subtle pulse ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400/50 animate-ping pointer-events-none opacity-40" />
          </div>

          {/* Hook Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isKg ? 'Расмий Telegram-канал' : 'Официальный Telegram'}</span>
          </div>

          {/* Punchy Title Hook */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
              {isKg
                ? 'ЖРТ тесттеринин автордук талдоолору жана пайдалуу материалдар'
                : 'Авторские разборы тестов ОРТ и полезные материалы'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed px-1">
              {isKg
                ? 'ЦООМОнун типтүү тапшырмаларынын чыгарылыштарын, тез чыгаруу ыкмаларын жана даярдануу материалдарын биринчилерден болуп чыгарабыз.'
                : 'Публикуем разборы заданий ЦООМО, эффективные методы решения за 30 секунд и эксклюзивные материалы подготовки первыми в канале.'}
            </p>
          </div>

          {/* Channel Tag chip */}
          <div className="px-3 py-1 rounded-lg bg-[#020e0b] border border-emerald-800/80 font-mono text-xs font-bold text-emerald-300">
            @kyrgyzakylmanedu
          </div>

          {/* Primary Action Button (The clickable hook) */}
          <div className="w-full space-y-2 pt-2">
            <button
              type="button"
              onClick={handleOpenChannel}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/35 transition-all cursor-pointer group"
            >
              <span>{isKg ? 'Каналга кошулуу' : 'Подписаться на канал'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Skip / Continue to site text button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2 text-xs font-bold text-emerald-300/70 hover:text-emerald-200 transition-colors cursor-pointer"
            >
              {isKg ? 'Сайтка өтүү' : 'Продолжить на сайте'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
