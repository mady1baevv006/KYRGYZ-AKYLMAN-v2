import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, Send } from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isKg = lang === 'kg';

  useEffect(() => {
    // If user is already authenticated, never display promo
    if (user) {
      setIsOpen(false);
      return;
    }

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
  }, [forceOpen, user]);

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

  if (!isOpen || user) return null;

  return (
    <aside
      aria-label={isKg ? 'Telegram каналы жөнүндө билдирүү' : 'Уведомление о Telegram-канале'}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[400px] pointer-events-auto animate-in slide-in-from-bottom-6 fade-in duration-300 select-none"
    >
      <div className="relative bg-gradient-to-br from-[#073325] via-[#041d16] to-[#02130e] border border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(16,185,129,0.22)] text-white overflow-hidden">
        {/* Atmospheric ambient glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close icon button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer z-20"
          aria-label={isKg ? 'Жабуу' : 'Закрыть'}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Notification content */}
        <div className="relative z-10 flex flex-col space-y-3">
          {/* Top row: Telegram Icon + Official Badge */}
          <div className="flex items-center gap-2.5 pr-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 flex items-center justify-center text-slate-950 shrink-0 shadow-md shadow-emerald-500/30">
              <Send className="w-4 h-4 text-slate-950 fill-slate-950 -translate-x-0.5 translate-y-0.5" />
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{isKg ? 'Расмий Telegram' : 'Официальный Telegram'}</span>
            </div>
          </div>

          {/* Heading and punchy hook text */}
          <div>
            <h4 className="text-sm sm:text-base font-black text-white tracking-tight leading-snug">
              {isKg
                ? 'ЖРТ тесттеринин автордук талдоолору'
                : 'Авторские разборы тестов ОРТ'}
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed mt-1">
              {isKg
                ? 'ЦООМОнун типтүү тапшырмаларынын чыгарылыштары жана даярдануу материалдары биринчи биздин каналда.'
                : 'Разборы заданий ЦООМО, эффективные методы решения и эксклюзивные материалы первыми в канале.'}
            </p>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleOpenChannel}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer group"
          >
            <span>{isKg ? 'Каналга кошулуу' : 'Подписаться на канал'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
};
