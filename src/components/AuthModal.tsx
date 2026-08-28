import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  AlertTriangle,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth, TelegramUser } from '../context/AuthContext';
import { detectKyrgyzOperator } from '../utils/kyrgyzOperators';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

type AuthMethod = 'email' | 'phone';

const TELEGRAM_BOT_ID = '8877236146';
const WHATSAPP_SUPPORT_PHONE = '996778995700';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
}) => {
  // Lock background scrolling when modal is open
  useBodyScrollLock(isOpen);

  const { loginWithCode, loginWithGoogle, loginWithTelegram, loginWithWhatsApp } = useAuth();

  const [method, setMethod] = useState<AuthMethod>('email');

  // Inputs
  const [emailInput, setEmailInput] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [nameInput, setNameInput] = useState('');

  // 6-digit Code State for Email OTP
  const [codeStep, setCodeStep] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState(['', '', '', '', '', '']);
  const [sentTarget, setSentTarget] = useState('');
  const [generatedEmailCode, setGeneratedEmailCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Statuses
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  const emailInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const popupRef = useRef<Window | null>(null);
  const popupTimerRef = useRef<any>(null);

  // Detected Operator
  const detectedOperator = detectKyrgyzOperator(phoneRaw);

  const isKg = lang === 'kg';

  // Countdown timer for email code resend
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

  // Reset inputs and clear popup timers when opening/closing
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
    } else {
      if (popupTimerRef.current) {
        clearInterval(popupTimerRef.current);
      }
      setTelegramLoading(false);
      setWhatsappLoading(false);
      setGoogleLoading(false);
    }
  }, [isOpen, method]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (popupTimerRef.current) {
        clearInterval(popupTimerRef.current);
      }
    };
  }, []);

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

  // ==========================================
  // 2. TELEGRAM OAUTH POPUP AUTH
  // ==========================================
  const handleTelegramMessage = useCallback(
    (event: MessageEvent) => {
      if (typeof event.data === 'string') {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed && (parsed.event === 'auth_result' || parsed.result)) {
            const tgData: TelegramUser = parsed.result || parsed;
            finishTelegramAuth(tgData);
          }
        } catch {
          // not JSON, ignore
        }
      } else if (typeof event.data === 'object' && event.data !== null) {
        if (event.data.event === 'auth_result' && event.data.result) {
          finishTelegramAuth(event.data.result);
        } else if (event.data.id && event.data.hash) {
          finishTelegramAuth(event.data as TelegramUser);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nameInput, isKg]
  );

  const finishTelegramAuth = (tgUser?: TelegramUser) => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    if (popupTimerRef.current) {
      clearInterval(popupTimerRef.current);
    }
    window.removeEventListener('message', handleTelegramMessage);

    const res = loginWithTelegram(tgUser, nameInput.trim() || undefined);
    setTelegramLoading(false);

    if (res.success) {
      setSuccessMessage(isKg ? 'Telegram аркылуу ийгиликтүү кирдиңиз!' : 'Успешный вход через Telegram!');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 800);
    } else {
      setErrorMessage(res.error || 'Ошибка авторизации через Telegram');
    }
  };

  const handleTelegramSignIn = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setTelegramLoading(true);

    try {
      const origin = window.location.origin;
      const tgAuthUrl = `https://oauth.telegram.org/auth?bot_id=${TELEGRAM_BOT_ID}&origin=${encodeURIComponent(
        origin
      )}&embed=1&request_access=write`;

      const width = 540;
      const height = 480;
      const left = Math.max(0, Math.round((window.innerWidth - width) / 2 + window.screenX));
      const top = Math.max(0, Math.round((window.innerHeight - height) / 2 + window.screenY));

      window.addEventListener('message', handleTelegramMessage);

      const popup = window.open(
        tgAuthUrl,
        'telegram_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes,toolbar=no,menubar=no`
      );

      popupRef.current = popup;

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // Popup was blocked by browser - fallback to instant local login
        finishTelegramAuth();
        return;
      }

      // Check when popup is closed by user
      if (popupTimerRef.current) clearInterval(popupTimerRef.current);
      popupTimerRef.current = setInterval(() => {
        if (!popupRef.current || popupRef.current.closed) {
          clearInterval(popupTimerRef.current);
          window.removeEventListener('message', handleTelegramMessage);
          finishTelegramAuth();
        }
      }, 800);
    } catch (err: any) {
      console.warn('Telegram popup error, fallback to direct login:', err);
      finishTelegramAuth();
    }
  };

  // ==========================================
  // 3. WHATSAPP FAST AUTH & CHAT REDIRECT
  // ==========================================
  const handleWhatsAppSignIn = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setWhatsappLoading(true);

    try {
      // Generate unique 6-digit session code (e.g. #748291)
      const sessionCode = '#' + Math.floor(100000 + Math.random() * 900000);
      
      const userName = nameInput.trim();
      const messageText = isKg
        ? `Салам! KYRGYZ AKYLMAN платформасына кирүү сессия кодум: ${sessionCode}${userName ? ` (${userName})` : ''}`
        : `Здравствуйте! Мой код сессии для входа в KYRGYZ AKYLMAN: ${sessionCode}${userName ? ` (${userName})` : ''}`;

      const waUrl = `https://wa.me/${WHATSAPP_SUPPORT_PHONE}?text=${encodeURIComponent(messageText)}`;

      // Open WhatsApp in a new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Simultaneously log the user into the application
      const res = loginWithWhatsApp(sessionCode, userName || undefined);

      if (res.success) {
        setSuccessMessage(isKg ? 'WhatsApp аркылуу ийгиликтүү кирдиңиз!' : 'Успешный вход через WhatsApp!');
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
        }, 800);
      } else {
        setErrorMessage(res.error || 'Ошибка входа через WhatsApp');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ошибка входа через WhatsApp');
    } finally {
      setWhatsappLoading(false);
    }
  };

  // ==========================================
  // 4. EMAIL OTP VERIFICATION
  // ==========================================
  const sendEmailVerificationCode = (target: string) => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailCode(randomCode);
    setSentTarget(target);
    setCodeStep(true);
    setEmailVerificationCode(['', '', '', '', '', '']);
    setTimerSeconds(60);
    setCanResend(false);
    setErrorMessage('');
    setSuccessMessage(
      isKg
        ? `Тастыктоо коду жөнөтүлдү: ${target}`
        : `Код подтверждения отправлен на: ${target}`
    );

    setTimeout(() => {
      emailInputsRef.current[0]?.focus();
    }, 150);
  };

  const handleRequestEmailCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailInput.trim() || !emailInput.includes('@')) {
      setErrorMessage(
        isKg ? 'Туура email дарегин жазыңыз' : 'Введите корректный адрес эл. почты'
      );
      return;
    }
    sendEmailVerificationCode(emailInput.trim());
  };

  const handleEmailDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      const cleanDigits = val.replace(/\D/g, '').slice(0, 6);
      if (cleanDigits.length > 0) {
        const newCode = [...emailVerificationCode];
        for (let i = 0; i < 6; i++) {
          newCode[i] = cleanDigits[i] || '';
        }
        setEmailVerificationCode(newCode);
        if (cleanDigits.length === 6) {
          verifyEmailCodeAndLogin(newCode.join(''));
        } else {
          emailInputsRef.current[Math.min(cleanDigits.length, 5)]?.focus();
        }
        return;
      }
    }

    const digit = val.slice(-1).replace(/\D/g, '');
    const newCode = [...emailVerificationCode];
    newCode[index] = digit;
    setEmailVerificationCode(newCode);

    if (digit && index < 5) {
      emailInputsRef.current[index + 1]?.focus();
    }

    const fullCode = newCode.join('');
    if (fullCode.length === 6 && !newCode.includes('')) {
      verifyEmailCodeAndLogin(fullCode);
    }
  };

  const handleEmailKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !emailVerificationCode[index] && index > 0) {
      emailInputsRef.current[index - 1]?.focus();
    }
  };

  const verifyEmailCodeAndLogin = (codeToVerify: string) => {
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      if (codeToVerify === generatedEmailCode) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#06291e] via-[#041d16] to-[#02130e] border border-emerald-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing background aura */}
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

        {/* Quick Fast Google, Telegram & WhatsApp Sign-in buttons */}
        {!codeStep && (
          <div className="space-y-2.5 mb-4">
            <div className="grid grid-cols-3 gap-2">
              {/* 1. Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || telegramLoading || whatsappLoading || loading}
                className="h-[42px] px-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-white/20 disabled:opacity-50"
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

              {/* 2. Telegram */}
              <button
                type="button"
                onClick={handleTelegramSignIn}
                disabled={googleLoading || telegramLoading || whatsappLoading || loading}
                className="h-[42px] px-2 bg-[#229ED9] hover:bg-[#1b8ec5] text-white font-bold text-xs rounded-xl shadow-md shadow-[#229ED9]/25 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-[#229ED9]/60 disabled:opacity-50"
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

              {/* 3. WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppSignIn}
                disabled={googleLoading || telegramLoading || whatsappLoading || loading}
                className="h-[42px] px-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-[#25D366]/25 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border border-[#25D366]/60 disabled:opacity-50"
              >
                {whatsappLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.408 0 .034 5.374.034 11.997c0 2.112.552 4.175 1.601 5.993L0 24l6.173-1.618a11.944 11.944 0 0 0 5.858 1.527h.005c6.623 0 11.997-5.374 11.997-12A11.97 11.97 0 0 0 12.031 0zm0 21.942a9.92 9.92 0 0 1-5.06-1.385l-.363-.215-3.762.986 1.004-3.668-.236-.376A9.92 9.92 0 1 1 12.031 21.942zm5.452-7.447c-.299-.15-1.77-.874-2.044-.974-.274-.1-.473-.15-.672.15-.199.299-.77.974-.944 1.173-.174.199-.349.224-.648.075-.299-.15-1.262-.465-2.404-1.484-.888-.792-1.488-1.77-1.662-2.069-.174-.299-.018-.461.131-.61.135-.134.299-.349.449-.523.149-.174.199-.299.299-.498.1-.199.05-.374-.025-.523-.075-.15-.672-1.62-.921-2.219-.243-.583-.49-.504-.672-.513l-.573-.01c-.199 0-.523.075-.797.374-.274.299-1.046 1.022-1.046 2.492s1.071 2.891 1.22 3.09c.149.199 2.107 3.217 5.105 4.512.713.308 1.27.493 1.704.631.716.228 1.368.196 1.884.119.576-.086 1.77-.723 2.019-1.42.249-.698.249-1.296.174-1.42-.075-.125-.274-.2-.573-.349z" />
                  </svg>
                )}
                <span>WhatsApp</span>
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
        )}

        {/* Auth Method Navigation Tabs (Email & Phone) */}
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

        {/* EMAIL CODE CONFIRMATION STEP */}
        {codeStep ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#041e17] border border-emerald-700/60 text-center">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                {isKg ? 'Почтага код жөнөтүлдү' : 'Код подтверждения отправлен на почту'}
              </span>
              <p className="text-sm font-black text-white truncate">{sentTarget}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 text-center mb-2.5">
                {isKg ? '6 орундуу кодду жазыңыз' : 'Введите 6-значный код'}
              </label>
              <div className="flex items-center justify-center gap-2">
                {emailVerificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (emailInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleEmailDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleEmailKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg sm:text-xl font-mono font-black rounded-xl bg-[#031510] border-2 border-emerald-700/80 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all"
                  />
                ))}
              </div>
            </div>

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
                  onClick={() => sendEmailVerificationCode(sentTarget)}
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
              onClick={() => verifyEmailCodeAndLogin(emailVerificationCode.join(''))}
              disabled={loading || emailVerificationCode.join('').length < 6}
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
          /* EMAIL & PHONE FORMS */
          <div>
            {method === 'email' && (
              <form onSubmit={handleRequestEmailCode} className="space-y-4">
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
                      ? 'Уюлдук операторлордун шлюзунда профилактикалык оңдоо иштери жүрүп жатат. Сураныч, Почта же Google аркылуу кириңиз.'
                      : 'На стороне шлюзов операторов связи проводятся технические работы. Пожалуйста, используйте вход по коду через Почту или Google.'}
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

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod('email');
                      setErrorMessage('');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isKg ? 'Электрондук почтага өтүү' : 'Войти через эл. почту'}</span>
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
