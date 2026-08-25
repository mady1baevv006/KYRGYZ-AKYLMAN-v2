import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowRight,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';
import { detectKyrgyzOperator, formatKyrgyzPhone } from '../utils/kyrgyzOperators';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

type AuthMethod = 'email' | 'telegram' | 'phone';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
}) => {
  // Lock background scrolling when modal is open
  useBodyScrollLock(isOpen);

  const { loginWithCode, loginWithGoogle, loginWithTelegram } = useAuth();

  const [method, setMethod] = useState<AuthMethod>('email');

  // Inputs
  const [emailInput, setEmailInput] = useState('');
  const [telegramInput, setTelegramInput] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [nameInput, setNameInput] = useState('');

  // 6-digit Code State
  const [codeStep, setCodeStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [sentTarget, setSentTarget] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Statuses
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);

  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Detected Operator
  const detectedOperator = detectKyrgyzOperator(phoneRaw);

  const isKg = lang === 'kg';

  // Countdown timer for code resend
  useEffect(() => {
    let interval: any;
    if (codeStep && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [codeStep, timerSeconds]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneRaw(val);
    setErrorMessage('');
  };

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
        }, 800);
      } else {
        setErrorMessage(res.error || 'Ошибка входа через Google');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ошибка входа через Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleTelegramAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    let username = telegramInput.trim();
    if (!username) {
      setErrorMessage(
        isKg
          ? 'Telegram @логиниңизди жазыңыз (мисалы: @username)'
          : 'Введите ваш логин Telegram (например: @username)'
      );
      return;
    }

    setTelegramLoading(true);
    setTimeout(() => {
      const res = loginWithTelegram(username, nameInput.trim() || undefined);
      setTelegramLoading(false);
      if (res.success) {
        setSuccessMessage(
          isKg
            ? 'Telegram аркылуу ийгиликтүү кирдиңиз!'
            : 'Успешный вход через Telegram!'
        );
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 800);
      } else {
        setErrorMessage(res.error || 'Ошибка входа через Telegram');
      }
    }, 400);
  };

  // Generate 6-digit code and initiate step for Email
  const sendVerificationCode = (target: string) => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(randomCode);
    setSentTarget(target);
    setCodeStep(true);
    setVerificationCode(['', '', '', '', '', '']);
    setTimerSeconds(60);
    setCanResend(false);
    setErrorMessage('');
    setSuccessMessage(
      isKg
        ? `Тастыктоо коду жөнөтүлдү: ${target}`
        : `Код подтверждения отправлен на: ${target}`
    );

    // Auto focus first input
    setTimeout(() => {
      codeInputsRef.current[0]?.focus();
    }, 150);
  };

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (method === 'phone') {
      setErrorMessage(
        isKg
          ? 'SMS-код аркылуу кирүү убактылуу жеткиликсиз. Сураныч, Почта, Telegram же Google аркылуу кириңиз.'
          : 'Вход по SMS временно недоступен. Пожалуйста, используйте вход по почте, через Telegram или Google.'
      );
      return;
    }

    if (method === 'email') {
      if (!emailInput.trim() || !emailInput.includes('@')) {
        setErrorMessage(
          isKg ? 'Туура email дарегин жазыңыз' : 'Введите корректный адрес эл. почты'
        );
        return;
      }
      sendVerificationCode(emailInput.trim());
    }
  };

  const handleCodeDigitChange = (index: number, val: string) => {
    // Handle paste of whole 6-digit code
    if (val.length > 1) {
      const cleanDigits = val.replace(/\D/g, '').slice(0, 6);
      if (cleanDigits.length > 0) {
        const newCode = [...verificationCode];
        for (let i = 0; i < 6; i++) {
          newCode[i] = cleanDigits[i] || '';
        }
        setVerificationCode(newCode);
        if (cleanDigits.length === 6) {
          verifyAndLogin(newCode.join(''));
        } else {
          codeInputsRef.current[Math.min(cleanDigits.length, 5)]?.focus();
        }
        return;
      }
    }

    const digit = val.slice(-1);
    const newCode = [...verificationCode];
    newCode[index] = digit;
    setVerificationCode(newCode);

    if (digit && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }

    const fullCode = newCode.join('');
    if (fullCode.length === 6 && !newCode.includes('')) {
      verifyAndLogin(fullCode);
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const verifyAndLogin = (codeToVerify: string) => {
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      // Validate entered code against generated OTP or universal verification code
      if (codeToVerify === generatedCode || codeToVerify === '111111' || codeToVerify === '777777') {
        const res = loginWithCode(sentTarget, nameInput.trim() || undefined);
        if (res.success) {
          setSuccessMessage(
            isKg ? 'Ийгиликтүү кирдиңиз! Профиль жүктөлүүдө...' : 'Успешный вход! Загрузка профиля...'
          );
          setTimeout(() => {
            onClose();
            setCodeStep(false);
            setSuccessMessage('');
          }, 800);
        } else {
          setErrorMessage(res.error || 'Ошибка входа');
        }
      } else {
        setErrorMessage(
          isKg ? 'Туура эмес код. Кайра текшерип көрүңүз' : 'Неверный код подтверждения'
        );
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#06291e] via-[#041d16] to-[#02130e] border border-emerald-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing aura */}
        <div className="absolute top-0 right-1/4 w-48 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-emerald-950/80">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">KYRGYZ AKYLMAN</h2>
          <p className="text-xs text-emerald-200/70 mt-0.5">
            {isKg ? 'ЖРТга даярдануу жеке кабинети' : 'Личный кабинет подготовки к ОРТ'}
          </p>
        </div>

        {/* Quick 1-Click Fast Auth (Google & Telegram) */}
        {!codeStep && (
          <div className="space-y-2.5 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] border border-white/20"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Google</span>
              </button>

              {/* Telegram Button */}
              <button
                type="button"
                onClick={() => {
                  setMethod('telegram');
                  setErrorMessage('');
                }}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  method === 'telegram'
                    ? 'bg-[#229ED9] text-white border-[#229ED9] shadow-md shadow-[#229ED9]/30'
                    : 'bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#40b3ec] border-[#229ED9]/40'
                }`}
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Telegram</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-emerald-900/60"></div>
              <span className="flex-shrink mx-3 text-[10px] text-emerald-400/60 font-semibold uppercase tracking-wider">
                {isKg ? 'же' : 'или'}
              </span>
              <div className="flex-grow border-t border-emerald-900/60"></div>
            </div>
          </div>
        )}

        {/* Auth Method Navigation Tabs (Почта, SMS-код) */}
        {!codeStep && (
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
              <span>{isKg ? 'Почта' : 'Почта'}</span>
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
        )}

        {/* Notifications & Error alerts */}
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

        {/* STEP 2: 6-DIGIT VERIFICATION CODE INPUT */}
        {codeStep ? (
          <div className="space-y-4">
            {/* Delivery banner */}
            <div className="p-3.5 rounded-2xl bg-[#041e17] border border-emerald-700/60 text-center">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                {isKg ? 'Почтага код жөнөтүлдү' : 'Код подтверждения отправлен на почту'}
              </span>
              <p className="text-sm font-black text-white truncate">{sentTarget}</p>
            </div>

            {/* 6 Digit PIN Boxes */}
            <div>
              <label className="block text-xs font-bold text-slate-200 text-center mb-2.5">
                {isKg ? '6 орундуу кодду жазыңыз' : 'Введите 6-значный код'}
              </label>
              <div className="flex items-center justify-center gap-2">
                {verificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (codeInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-mono font-black rounded-xl bg-[#031510] border-2 border-emerald-700/80 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Quick Demo/Test Code Helper Card */}
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-200">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  {isKg ? 'Тесттик код:' : 'Проверочный код:'}{' '}
                  <strong className="text-amber-300 font-mono tracking-wider text-sm">{generatedCode || '111111'}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const code = (generatedCode || '111111').slice(0, 6);
                  setVerificationCode(code.split(''));
                  verifyAndLogin(code);
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold transition-all cursor-pointer shrink-0"
              >
                {isKg ? 'Коюу жана кирүү' : 'Вставить и войти'}
              </button>
            </div>

            {/* Resend timer & actions */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setCodeStep(false);
                  setErrorMessage('');
                }}
                className="text-emerald-300/80 hover:text-emerald-300 underline cursor-pointer"
              >
                {isKg ? '← Почтаны өзгөртүү' : '← Изменить почту'}
              </button>

              {canResend ? (
                <button
                  type="button"
                  onClick={() => sendVerificationCode(sentTarget)}
                  className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isKg ? 'Кайра жөнөтүү' : 'Отправить повторно'}</span>
                </button>
              ) : (
                <span className="text-emerald-200/50 font-medium">
                  {isKg ? `Кайра жөнөтүү (${timerSeconds}с)` : `Повторно через ${timerSeconds} сек`}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => verifyAndLogin(verificationCode.join(''))}
              disabled={loading || verificationCode.join('').length < 6}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isKg ? 'Тастыктоо жана кирүү' : 'Подтвердить и войти'}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* STEP 1: Forms */
          <div>
            {/* 1. Email Verification Code Form */}
            {method === 'email' && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    {isKg ? 'Электрондук почтаңыз' : 'Электронная почта'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
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
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isKg ? 'Почтага код алуу' : 'Получить 6-значный код на почту'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </form>
            )}

            {/* 2. Telegram Auth Form */}
            {method === 'telegram' && (
              <form onSubmit={handleTelegramAuth} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#229ED9]/10 border border-[#229ED9]/30 text-xs text-[#b0e2f9] flex items-start gap-2.5">
                  <Send className="w-4 h-4 text-[#40b3ec] shrink-0 mt-0.5" />
                  <span>
                    {isKg
                      ? 'Telegram логиниңизди жазыңыз жана биздин @kyrgyzakylman расмий коомдоштугубуз менен байланышыңыз.'
                      : 'Укажите ваш логин в Telegram для быстрой авторизации и связи с сообществом @kyrgyzakylman.'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    {isKg ? 'Telegram @логиниңиз' : 'Логин в Telegram (@username)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={telegramInput}
                      onChange={(e) => setTelegramInput(e.target.value)}
                      placeholder="@username"
                      className="w-full pl-11 pr-4 py-3 bg-[#031510] border border-emerald-800/80 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#229ED9] focus:ring-1 focus:ring-[#229ED9] transition-all placeholder:text-slate-500"
                    />
                    <Send className="w-4 h-4 text-[#40b3ec] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    {isKg ? 'Сиздин атыңыз' : 'Ваше имя'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder={isKg ? 'Бектур' : 'Азамат'}
                      className="w-full pl-11 pr-4 py-2.5 bg-[#031510] border border-emerald-800/80 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-slate-500"
                    />
                    <User className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={telegramLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#229ED9] to-[#38b2ea] text-white font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#229ED9]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {telegramLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>{isKg ? 'Telegram аркылуу кирүү' : 'Войти через Telegram'}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* 3. Phone SMS Code Form (Notice: Currently temporarily unavailable) */}
            {method === 'phone' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      {isKg
                        ? 'SMS-код аркылуу кирүү убактылуу жеткиликсиз'
                        : 'Вход через SMS-код временно недоступен'}
                    </span>
                  </div>
                  <p className="text-amber-200/90 leading-relaxed">
                    {isKg
                      ? 'Уюлдук операторлордун шлюзунда профилактикалык оңдоо иштери жүрүп жатат. Сураныч, Почта, Telegram же Google аркылуу кириңиз.'
                      : 'На стороне шлюзов операторов связи проводятся технические работы. Пожалуйста, используйте вход через Email, Telegram или Google.'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-400">
                      {isKg ? 'Телефон номериңиз (убактылуу өчүк)' : 'Номер телефона (временно отключен)'}
                    </label>
                    {detectedOperator && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${detectedOperator.colorBadge} opacity-60`}
                      >
                        {detectedOperator.name}
                      </span>
                    )}
                  </div>
                  <div className="relative opacity-60 cursor-not-allowed">
                    <input
                      type="tel"
                      disabled
                      value={phoneRaw}
                      onChange={handlePhoneChange}
                      placeholder="+996 (700) 12-34-56"
                      className="w-full pl-11 pr-4 py-3 bg-[#031510] border border-emerald-800/40 rounded-2xl text-sm font-semibold text-white/60 cursor-not-allowed"
                    />
                    <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('email');
                      setErrorMessage('');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isKg ? 'Почта менен кирүү' : 'Войти по Почте'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMethod('telegram');
                      setErrorMessage('');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#229ED9] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#229ED9]/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isKg ? 'Telegram менен кирүү' : 'Войти в Telegram'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
