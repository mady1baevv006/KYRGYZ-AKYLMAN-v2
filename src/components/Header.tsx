import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check, User as UserIcon, Sparkles, ShieldCheck, Crown } from 'lucide-react';
import { AppLanguage } from '../types';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  setDarkMode?: (val: boolean) => void;
  lang?: AppLanguage;
  setLang?: (lang: AppLanguage) => void;
  adminAccess?: boolean;
}

const LANGUAGES: { code: AppLanguage; label: string; name: string }[] = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'kg', label: 'KG', name: 'Кыргызча' },
];

export const Header: React.FC<HeaderProps> = ({
  lang = 'ru',
  setLang,
}) => {
  const { user, isAdmin } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangMenuOpen(false);
      }
    };

    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langMenuOpen]);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const getLoginButtonText = () => {
    if (lang === 'kg') return 'Кирүү';
    return 'Войти';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#031510]/95 border-b border-emerald-950/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Side: Logo Icon + KYRGYZ AKYLMAN */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group shrink min-w-0 transition-transform active:scale-[0.99]"
            title="KYRGYZ AKYLMAN - Главная"
          >
            {/* Sparkling 4-point star / gem icon styled like the photo in glowing emerald */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.55)]"
              >
                <path
                  d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
                  className="fill-emerald-400 stroke-emerald-200"
                  strokeWidth="0.75"
                />
              </svg>
            </div>

            {/* Prominent Large Styled KYRGYZ AKYLMAN */}
            <div className="flex items-center min-w-0">
              <span className="font-black text-sm xs:text-base sm:text-2xl md:text-[26px] tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                KYRGYZ AKYLMAN
              </span>
            </div>
          </Link>

          {/* Right Side: Language Dropdown + User / "Войти →" Button */}
          <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
            {/* Language Selector Popover Window */}
            {setLang && (
              <div className="relative shrink-0" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLangMenuOpen((prev) => !prev)}
                  className="px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold tracking-wide border border-emerald-800/60 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95"
                  aria-expanded={langMenuOpen}
                  aria-haspopup="true"
                  title="Выбрать язык / Тилди тандоо"
                >
                  <span>{currentLangObj.label}</span>
                </button>

                {/* Dropdown Menu Window */}
                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 py-1.5 bg-[#07241c] border border-emerald-800/60 rounded-2xl shadow-xl shadow-black/15 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-lg">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 border-b border-white/5 mb-1">
                      {lang === 'kg' ? 'Тилди тандоо' : 'Выберите язык'}
                    </div>
                    {LANGUAGES.map((l) => {
                      const isSelected = l.code === lang;
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLang(l.code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-emerald-950/60 text-emerald-300 font-bold'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-white/10 text-emerald-200">
                              {l.label}
                            </span>
                            <span>{l.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Admin Panel Direct Access Button (Prominent for Administrator) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="group relative inline-flex items-center gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-2xl text-xs sm:text-sm font-black text-amber-300 bg-gradient-to-r from-amber-950/90 to-amber-900/80 border-2 border-amber-400/80 hover:border-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                title="Панель администратора (mady1baevv@kyrgyzakylman.com)"
              >
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
                <span className="font-extrabold tracking-wide">Админ</span>
              </Link>
            )}

            {/* Glowing Emerald Action Button: User Profile OR "Войти →" */}
            {user ? (
              <Link
                to="/profile"
                className="group relative inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-2xl text-xs sm:text-sm font-black text-emerald-200 bg-emerald-950/70 border border-emerald-700/60 hover:bg-emerald-900 hover:border-emerald-500 shadow-md shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                title="Личный кабинет"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-400/50 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="group relative inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl text-xs sm:text-base font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:via-teal-200 hover:to-emerald-300 shadow-md sm:shadow-lg shadow-emerald-500/20 sm:shadow-emerald-500/30 hover:shadow-emerald-400/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0"
              >
                <span>{getLoginButtonText()}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login / Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} lang={lang} />
    </>
  );
};
