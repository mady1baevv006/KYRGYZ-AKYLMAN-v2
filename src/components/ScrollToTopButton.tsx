import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';

interface ScrollToTopButtonProps {
  lang?: AppLanguage;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ lang = 'ru' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, subscriptionStatus, isAdmin } = useAuth();

  const isPremium =
    subscriptionStatus.effectivePlan === 'premium' ||
    user?.subscriptionPlan === 'premium' ||
    isAdmin;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  const label = lang === 'kg' ? 'Жогору чыгуу' : 'Наверх';

  return (
    <button
      id="scroll-to-top-btn"
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      className={`fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group animate-in fade-in zoom-in-75 ${
        isPremium
          ? 'bg-amber-950/50 hover:bg-amber-900/80 text-amber-300 border border-amber-400/60 hover:border-amber-300 shadow-lg shadow-amber-950/50'
          : 'bg-[#041d16]/50 hover:bg-[#062c20]/80 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 shadow-lg shadow-emerald-950/50'
      }`}
    >
      <ArrowUp
        className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform duration-200 ${
          isPremium ? 'text-amber-300' : 'text-emerald-300'
        }`}
      />
    </button>
  );
};

