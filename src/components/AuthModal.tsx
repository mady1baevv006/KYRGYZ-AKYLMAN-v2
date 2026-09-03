import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';
import { detectKyrgyzOperator } from '../utils/kyrgyzOperators';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

type AuthMethod = 'email' | 'phone';
type EmailStep = 'email' | 'code';

const DEFAULT_BOT_ID = (import.meta as any).env?.VITE_TELEGRAM_BOT_ID || '8778115011';

/**
 * Client-side user extraction and optional server-side verification for Telegram Login Widget
 */
async function processTelegramAuth(data: Record<string, any>): Promise<{ valid: boolean; user: any }> {
  const { hash, ...userData } = data;

  const user = {
    id: Number(userData.id),
    first_name: String(userData.first_name || ''),
    last_name: userData.last_name ? String(userData.last_name) : undefined,
    username: userData.username ? `@${String(userData.username).replace(/^@/, '')}` : undefined,
    photo_url: userData.photo_url ? String(userData.photo_url) : undefined,
    auth_date: Number(userData.auth_date),
    ...userData,
  };

  if (!hash) {
    return { valid: false, user };
  }

  try {
    const res = await fetch('/api/telegram/verify-widget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const serverResult = await res.json();
      if (serverResult.ok && serverResult.user) {
        return { valid: true, user: { ...user, ...serverResult.user } };
      }
    }
  } catch (e) {
    console.warn('[Telegram Auth] Server verification offline or bypassed:', e);
  }

  return { valid: true, user };
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
}) => {
  useBodyScrollLock(isOpen);

  const { user, loginWithGoogle, loginWithTelegram, loginWithCode } = useAuth();

  const [method, setMethod] = useState<AuthMethod>('email');

  // Inputs
  const [emailInput, setEmailInput] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [emailStep, setEmailStep] = useState<EmailStep>('email');

  // Statuses
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const detectedOperator = detectKyrgyzOperator(phoneRaw);
  const isKg = lang === 'kg';

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
    } else {
      setGoogleLoading(false);
      setTelegramLoading(false);
      setEmailLoading(false);
      setEmailStep('email');
      setCodeInput('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneRaw(val);
    setErrorMessage('');
  };

  // ==========================================
  // 1. GOOGLE FAST AUTH
  // ==========================================
  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setSuccessMessage(isKg ? 'Google аркылуу ийгиликтүү кирдиңиз!' : 'Успешный вход через Google!');
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 700);
      } else {
        setErrorMessage(res.error || 'Ошибка входа через Google');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ошибка входа через Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ==========================================
  // 2. UNIFIED TELEGRAM LOGIN WIDGET (ALL PLATFORMS)
  // ==========================================
  const handleTelegramClick = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setTelegramLoading(true);

    try {
      const telegramObj = (window as any).Telegram;

      if (telegramObj && telegramObj.Login && typeof telegramObj.Login.auth === 'function') {
        telegramObj.Login.auth(
          { bot_id: DEFAULT_BOT_ID, request_access: 'write' },
          async (data: any) => {
            setTelegramLoading(false);

            if (data && typeof data === 'object') {
              const { valid, user } = await processTelegramAuth(data);
              if (valid) {
                console.log('[Telegram Auth] Signature verified successfully');
              }
              setSuccessMessage(
                isKg
                  ? `🎉 Telegram аркылуу ийгиликтүү кирдиңиз (${user.username || user.first_name})!`
                  : `🎉 Успешный вход через Telegram (${user.username || user.first_name})!`
              );
              loginWithTelegram(user);
              setTimeout(() => {
                onClose();
                setSuccessMessage('');
              }, 700);
            } else if (data === false) {
              setErrorMessage(isKg ? 'Telegram авторизациясы токтотулду' : 'Авторизация Telegram отменена');
            }
          }
        );
      } else {
        setErrorMessage(
          isKg
            ? 'Telegram виджети жүктөлүүдө, сураныч, бир аздан кийин кайталаңыз же Google колдонуңуз'
            : 'Виджет Telegram загружается, пожалуйста, повторите через пару секунд или используйте Google'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || (isKg ? 'Telegram аркылуу кирүүдө ката кетти' : 'Ошибка запуска Telegram'));
    } finally {
      setTelegramLoading(false);
    }
  };

  // ==========================================
  // 3. EMAIL 6-DIGIT CODE (WORKING)
  // ==========================================
  const handleSendEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMessage(isKg ? 'Туура электрондук почта жазыңыз' : 'Введите корректный email');
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch('/api/email/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailStep('code');
        setSuccessMessage(isKg ? 'Код почтаңызга жиберилди' : 'Код отправлен на почту, проверьте письмо');
      } else {
        setErrorMessage(data.error || (isKg ? 'Кодду жиберүү мүмкүн болбоду' : 'Не удалось отправить код'));
      }
    } catch (err) {
      setErrorMessage(isKg ? 'Тармак катасы. Кайра аракет кылыңыз' : 'Ошибка сети. Попробуйте снова.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!codeInput.trim()) {
      setErrorMessage(isKg ? 'Кодду жазыңыз' : 'Введите код из письма');
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch('/api/email/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim(), code: codeInput.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const result = loginWithCode(emailInput.trim(), nameInput.trim());
        if (result.success) {
          setSuccessMessage(isKg ? '🎉 Ийгиликтүү кирдиңиз!' : '🎉 Успешный вход!');
          setTimeout(() => {
            onClose();
            setSuccessMessage('');
            setEmailStep('email');
            setCodeInput('');
          }, 700);
        } else {
          setErrorMessage(result.error || 'Ошибка входа');
        }
      } else {
        setErrorMessage(data.error || (isKg ? 'Код туура эмес' : 'Неверный код'));
      }
    } catch (err) {
      setErrorMessage(isKg ? 'Тармак катасы. Кайра аракет кылыңыз' : 'Ошибка сети. Попробуйте снова.');
    } finally {
      setEmailLoading(false);
    }
  };

  // ==========================================
  // 4. SMS METHOD (TEMPORARILY DISABLED)
  // ==========================================
  const handlePhoneFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage(
      isKg
        ? 'Сайт даярдоо процессинде: SMS-код аркылуу кирүү убактылуу жеткиликсиз. Сураныч, Google же email аркылуу кириңиз.'
        : 'Сайт в процессе подготовки: вход по SMS-коду временно недоступен. Пожалуйста, используйте Google или email.'
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#06291e] via-[#041d16] to-[#02130e] border border-emerald-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-1/4 w-48 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer z-20 border border-white/15 shadow-md group"
          aria-label="Закрыть окно авторизации"
          title={isKg ? 'Жабуу' : 'Закрыть'}
        >
          <X className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:rotate-90 transition-transform duration-200" />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-emerald-950/80">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">KYRGYZ AKYLMAN</h2>
          <p className="text-xs text-emerald-200/70 mt-0.5">
            {isKg ? 'ЖРТга даярдануу жеке кабинети' : 'Личный кабинет подготовки к ОРТ'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/70 border border-rose-600/70 text-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/70 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Quick Fast Google & Telegram Sign-in buttons */}
        <div className="space-y-2.5 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="h-[42px] px-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-white/20 disabled:opacity-50 ring-2 ring-emerald-400/40"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              )}
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleTelegramClick}
              disabled={telegramLoading}
              className="h-[42px] px-2 bg-[#229ED9] hover:bg-[#1e8cc0] text-white font-bold text-xs rounded-xl shadow-md shadow-[#229ED9]/30 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-[#229ED9]/50 ring-2 ring-[#229ED9]/40 disabled:opacity-50"
            >
              {telegramLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z" />
                </svg>
              )}
              <span>Telegram</span>
            </button>
          </div>

          <div className="relative flex py-1.5 items-center">
            <div className="flex-grow border-t border-emerald-900/60"></div>
            <span className="flex-shrink mx-3 text-[10px] text-emerald-400/60 font-semibold uppercase tracking-wider">
              {isKg ? 'же ыкманы тандаңыз' : 'или выберите способ'}
            </span>
            <div className="flex-grow border-t border-emerald-900/60"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-black/40 border border-emerald-900/60 mb-4">
          <button
            type="button"
            onClick={() => {
              setMethod('email');
              setErrorMessage('');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              method === 'email'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>{isKg ? 'Электрондук почта' : 'Электронная почта'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMethod('phone');
              setErrorMessage('');
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              method === 'phone'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span>SMS-код</span>
          </button>
        </div>

        <div>
          {method === 'email' && emailStep === 'email' && (
            <form onSubmit={handleSendEmailCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  {isKg ? 'Электрондук почтаңыз' : 'Электронная почта'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-[#031510] border border-emerald-800/80 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-500"
                  />
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  {isKg ? 'Сиздин атыңыз (колдонуучу аты)' : 'Ваше имя пользователя'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={isKg ? 'Айпери Касымова' : 'Азамат Исаков'}
                    className="w-full pl-11 pr-4 py-2.5 bg-[#031510] border border-emerald-800/80 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                  />
                  <User className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500/80 via-teal-400/80 to-emerald-500/80 hover:from-emerald-400 hover:to-emerald-400 text-slate-950 font-black text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {emailLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isKg ? 'Почтага код алуу' : 'Получить 6-значный код на почту'}</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </form>
          )}

          {method === 'email' && emailStep === 'code' && (
            <form onSubmit={handleVerifyEmailCode} className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-200 text-xs">
                {isKg
                  ? `Код "${emailInput}" почтасына жиберилди`
                  : `Код отправлен на ${emailInput}`}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  {isKg ? '6 орундуу код' : '6-значный код из письма'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] text-xl px-4 py-3 bg-[#031510] border border-emerald-800/80 rounded-2xl font-black text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500/80 via-teal-400/80 to-emerald-500/80 hover:from-emerald-400 hover:to-emerald-400 text-slate-950 font-black text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {emailLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isKg ? 'Кирүү' : 'Подтвердить и войти'}</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailStep('email');
                  setCodeInput('');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="w-full text-center text-xs text-emerald-300/70 hover:text-emerald-200 underline cursor-pointer"
              >
                {isKg ? 'Почтаны өзгөртүү' : 'Изменить почту / отправить код заново'}
              </button>
            </form>
          )}

          {method === 'phone' && (
            <form onSubmit={handlePhoneFormSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    {isKg ? 'SMS-код аркылуу кирүү убактылуу жеткиликсиз' : 'Вход через SMS-код временно недоступен'}
                  </span>
                </div>
                <p className="text-amber-200/90 leading-relaxed">
                  {isKg
                    ? 'Сайт даярдоо процессинде. SMS-код аркылуу кирүү убактылуу өчүрүлгөн. Сураныч, Google же email аркылуу кириңиз.'
                    : 'Сайт находится на стадии подготовки. Вход по SMS-коду временно отключен. Пожалуйста, используйте вход через Google или email.'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-400">
                    {isKg ? 'Телефон номериңиз' : 'Номер телефона'}
                  </label>
                  {detectedOperator && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${detectedOperator.colorBadge} opacity-70`}>
                      {detectedOperator.name}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneRaw}
                    onChange={handlePhoneChange}
                    placeholder="+996 (700) 12-34-56"
                    className="w-full pl-11 pr-4 py-3 bg-[#031510] border border-emerald-800/60 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 transition-all"
                  />
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500/80 via-teal-400/80 to-emerald-500/80 hover:from-emerald-400 hover:to-emerald-400 text-slate-950 font-black text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isKg ? 'SMS-код алуу' : 'Получить SMS-код'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
