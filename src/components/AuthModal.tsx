import React, { useState } from 'react';
import { X, ArrowRight, User, Lock, Mail, Sparkles, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
  initialTab = 'login',
}) => {
  const { login, register, resetPassword, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setSuccessMessage(lang === 'kg' ? 'Google аркылуу ийгиликтүү кирдиңиз!' : 'Успешный вход через Google!');
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 1000);
      } else {
        setErrorMessage(res.error || 'Ошибка входа через Google');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ошибка входа через Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    setTimeout(() => {
      if (tab === 'login') {
        const res = login(identifier, password);
        if (res.success) {
          setSuccessMessage(lang === 'kg' ? 'Ийгиликтүү кирдиңиз!' : 'Успешный вход в аккаунт!');
          setTimeout(() => {
            onClose();
            setSuccessMessage('');
          }, 1200);
        } else {
          setErrorMessage(
            lang === 'kg'
              ? 'Логин же сыр сөз туура эмес'
              : res.error || 'Неверный логин или пароль'
          );
        }
      } else if (tab === 'register') {
        if (!name.trim()) {
          setErrorMessage(lang === 'kg' ? 'Атыңызды жазыңыз' : 'Укажите ваше имя');
          setLoading(false);
          return;
        }
        if (password.length < 4) {
          setErrorMessage(
            lang === 'kg'
              ? 'Сыр сөз 4 символдон кем болбосун'
              : 'Пароль должен содержать минимум 4 символа'
          );
          setLoading(false);
          return;
        }
        const res = register(name, identifier, password);
        if (res.success) {
          setSuccessMessage(
            lang === 'kg' ? 'Катталуу ийгиликтүү бүттү!' : 'Регистрация успешно завершена!'
          );
          setTimeout(() => {
            onClose();
            setSuccessMessage('');
          }, 1200);
        } else {
          setErrorMessage(
            lang === 'kg'
              ? 'Мындай маалымат менен колдонуучу мурун катталган'
              : res.error || 'Пользователь уже существует'
          );
        }
      } else if (tab === 'forgot') {
        if (newPassword.length < 4) {
          setErrorMessage(
            lang === 'kg'
              ? 'Жаңы сыр сөз 4 символдон кем болбосун'
              : 'Новый пароль должен содержать минимум 4 символа'
          );
          setLoading(false);
          return;
        }
        const res = resetPassword(identifier, newPassword);
        if (res.success) {
          setSuccessMessage(
            lang === 'kg'
              ? 'Сыр сөз ийгиликтүү жаңыртылды!'
              : 'Пароль успешно обновлен! Теперь вы можете войти.'
          );
          setTimeout(() => {
            setTab('login');
            setPassword(newPassword);
            setSuccessMessage('');
          }, 1500);
        } else {
          setErrorMessage(
            lang === 'kg'
              ? 'Бул email/телефон менен колдонуучу табылган жок'
              : res.error || 'Пользователь не найден'
          );
        }
      }
      setLoading(false);
    }, 400);
  };

  const t = {
    ru: {
      login: 'Войти',
      register: 'Регистрация',
      forgot: 'Восстановление',
      welcome: 'KYRGYZ AKYLMAN',
      subtitle: 'Ваш личный кабинет для подготовки и сдачи ОРТ',
      emailOrPhone: 'Электронная почта или телефон',
      password: 'Пароль',
      newPassword: 'Новый пароль',
      name: 'Ваше имя',
      forgotPass: 'Забыли пароль?',
      submitLogin: 'Войти в аккаунт',
      submitRegister: 'Создать аккаунт',
      submitForgot: 'Сбросить и сохранить пароль',
      backToLogin: 'Вернуться ко входу',
      guest: 'Продолжить без входа',
    },
    kg: {
      login: 'Кирүү',
      register: 'Катталуу',
      forgot: 'Калыбына келтирүү',
      welcome: 'KYRGYZ AKYLMAN',
      subtitle: 'ЖРТга даярдануу үчүн жеке кабинетиңиз',
      emailOrPhone: 'Электрондук почта же телефон',
      password: 'Сыр сөз',
      newPassword: 'Жаңы сыр сөз',
      name: 'Сиздин атыңыз',
      forgotPass: 'Сыр сөздү унуттуңузбу?',
      submitLogin: 'Аккаунтка кирүү',
      submitRegister: 'Аккаунт түзүү',
      submitForgot: 'Жаңы сыр сөздү сактоо',
      backToLogin: 'Кирүүгө кайтуу',
      guest: 'Кирүүсүз улантуу',
    },
  }[lang] || {
    ru: {
      login: 'Войти',
      register: 'Регистрация',
      forgot: 'Восстановление',
      welcome: 'KYRGYZ AKYLMAN',
      subtitle: 'Ваш личный кабинет для подготовки и сдачи ОРТ',
      emailOrPhone: 'Электронная почта или телефон',
      password: 'Пароль',
      newPassword: 'Новый пароль',
      name: 'Ваше имя',
      forgotPass: 'Забыли пароль?',
      submitLogin: 'Войти в аккаунт',
      submitRegister: 'Создать аккаунт',
      submitForgot: 'Сбросить и сохранить пароль',
      backToLogin: 'Вернуться ко входу',
      guest: 'Продолжить без входа',
    },
  }.ru;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#07241c] border border-emerald-800/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="font-black text-sm tracking-wider uppercase text-emerald-400">
              KYRGYZ AKYLMAN
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            {tab === 'forgot'
              ? t.forgot
              : tab === 'register'
              ? t.register
              : t.login}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* Tab switch (for Login & Register) */}
        {tab !== 'forgot' && (
          <div className="flex p-1 bg-[#031510] rounded-2xl mb-6 border border-emerald-900/60">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.register}
            </button>
          </div>
        )}

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google One-Click Login Button */}
        {tab !== 'forgot' && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] border border-white/20"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>
                {googleLoading
                  ? (lang === 'kg' ? 'Кирүүдө...' : 'Вход...')
                  : (lang === 'kg' ? 'Google менен кирүү' : 'Продолжить с Google')}
              </span>
            </button>
            <div className="relative flex py-3.5 items-center">
              <div className="flex-grow border-t border-emerald-900/60"></div>
              <span className="flex-shrink mx-3 text-xs text-emerald-400/60 font-semibold uppercase tracking-wider">
                {lang === 'kg' ? 'же' : 'или'}
              </span>
              <div className="flex-grow border-t border-emerald-900/60"></div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                {t.name}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Алибек"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              {t.emailOrPhone}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="student@example.com / +996..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          {tab !== 'forgot' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  {t.password}
                </label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setErrorMessage('');
                    }}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                  >
                    {t.forgotPass}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                {t.newPassword}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-5 rounded-xl font-black text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.99] cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {tab === 'login'
                    ? t.submitLogin
                    : tab === 'register'
                    ? t.submitRegister
                    : t.submitForgot}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-emerald-900/40 flex flex-col items-center gap-2">
          {tab === 'forgot' ? (
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMessage('');
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
            >
              ← {t.backToLogin}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-emerald-400 font-medium cursor-pointer"
            >
              {t.guest}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

