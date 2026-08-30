import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  LogOut,
  ShieldAlert,
  ArrowRight,
  Check,
  Crown,
} from 'lucide-react';
import { AppLanguage } from '../types';
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
  const { user, isVip, isTrial, isAdmin, logout, openAuthModal } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setLangMenuOpen(false);
      }
    };

    if (userDropdownOpen || langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen, langMenuOpen]);

  const t = {
    ru: {
      profile: 'Мой профиль',
      adminPanel: 'Панель админа',
      logout: 'Выйти',
      loginBtn: 'Войти',
      student: 'Ученик',
      vip: 'VIP Премиум',
      trial: 'VIP Доступ',
    },
    kg: {
      profile: 'Менин профилим',
      adminPanel: 'Админ панели',
      logout: 'Чыгуу',
      loginBtn: 'Кирүү',
      student: 'Окуучу',
      vip: 'VIP Премиум',
      trial: 'VIP Мүмкүнчүлүк',
    },
  }[lang];

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

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

            <div className="flex items-center min-w-0">
              <span className="font-black text-sm xs:text-base sm:text-2xl md:text-[26px] tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                KYRGYZ AKYLMAN
              </span>
            </div>
          </Link>

          {/* Right Side: Language Dropdown + Admin + Auth/Profile */}
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
                className="group relative inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black text-amber-300 bg-gradient-to-r from-amber-950/90 to-amber-900/80 border-2 border-amber-400/80 hover:border-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                title="Панель администратора"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="font-extrabold tracking-wide">Админ</span>
              </Link>
            )}

            {/* Main Auth Control: If logged in -> User Profile menu; If not -> Single glowing "Войти" button */}
            {user ? (
              <div className="relative shrink-0" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 sm:gap-2.5 p-1 sm:pr-3 rounded-2xl bg-emerald-950/70 hover:bg-emerald-900/80 transition-all cursor-pointer shadow-sm group text-left ${
                    isVip
                      ? 'border border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                      : 'border border-emerald-500/40'
                  }`}
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover bg-emerald-900/50 ${
                          isVip
                            ? 'border-2 border-amber-400 ring-1 ring-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'border border-emerald-400/40'
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm ${
                          isVip
                            ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 border-2 border-amber-400 ring-1 ring-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 border border-emerald-400/40'
                        }`}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'У'}
                      </div>
                    )}
                    {isVip && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-200 text-slate-950 p-0.5 rounded-full shadow">
                        <Crown className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 max-w-[120px]">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        isVip
                          ? 'text-amber-300'
                          : isTrial
                          ? 'text-emerald-300'
                          : 'text-emerald-400/80'
                      }`}
                    >
                      {isAdmin ? 'Администратор' : isVip ? t.vip : isTrial ? t.trial : t.student}
                    </span>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#06231b] border border-emerald-700/60 shadow-2xl z-50 p-2 text-white animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5 border-b border-emerald-800/40 mb-1">
                      <div className="font-bold text-sm text-white truncate">{user.name}</div>
                      <div className="text-xs text-emerald-300/70 truncate">{user.identifier}</div>
                      {isVip && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-bold">
                          <Crown className="w-3 h-3" />
                          <span>VIP Премиум доступ</span>
                        </div>
                      )}
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-100 hover:text-white hover:bg-emerald-800/50 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                      <span>{t.profile}</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>{t.adminPanel}</span>
                      </Link>
                    )}
                    <div className="my-1 border-t border-emerald-800/40" />
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="group relative inline-flex items-center gap-1 sm:gap-2 px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl text-xs sm:text-base font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:via-teal-200 hover:to-emerald-300 shadow-md sm:shadow-lg shadow-emerald-500/20 sm:shadow-emerald-500/30 hover:shadow-emerald-400/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shrink-0"
              >
                <span>{t.loginBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
