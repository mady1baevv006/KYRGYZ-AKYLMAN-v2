import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Shield, Sparkles, AtSign } from 'lucide-react';
import { AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';

interface SetLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
  onSuccess?: (login: string) => void;
  isMandatory?: boolean;
}

export const SetLoginModal: React.FC<SetLoginModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
  onSuccess,
  isMandatory = false,
}) => {
  const { user, setUserLogin } = useAuth();
  const [loginInput, setLoginInput] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const isKg = lang === 'kg';

  if (!isOpen) return null;

  // Strict sanitization: filter out anything except English letters and numbers, max 15 chars
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Keep only alphanumeric [a-zA-Z0-9], max 15 chars
    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
    setLoginInput(cleaned);
    setError('');

    if (raw !== cleaned) {
      setError(
        isKg
          ? 'Латын тамгалары жана сандар гана жазылат (белгилер жана боштуктар жарабайт)'
          : 'Разрешены только латинские буквы и цифры (без точек, пробелов, знаков и скобок)'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = loginInput.trim();
    if (!trimmed) {
      setError(isKg ? 'Логинди жазыңыз' : 'Введите желаемый логин');
      return;
    }
    if (trimmed.length < 3) {
      setError(isKg ? 'Логин кеминде 3 белгиден турушу керек' : 'Логин должен содержать минимум 3 символа');
      return;
    }
    if (trimmed.length > 15) {
      setError(isKg ? 'Логин 15 белгиден ашпашы керек' : 'Логин не должен превышать 15 знаков');
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
      setError(
        isKg
          ? 'Логинге латын тамгалары жана сандар гана жарайт'
          : 'Разрешены только латинские буквы и цифры'
      );
      return;
    }

    const res = setUserLogin(trimmed);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess(trimmed);
      }, 1000);
    } else {
      setError(res.error || (isKg ? 'Ката кетти' : 'Ошибка сохранения логина'));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (!isMandatory && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-[#06291e] via-[#041d16] to-[#02130e] border border-emerald-700/70 rounded-3xl p-6 sm:p-7 shadow-2xl text-white text-left space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Hidden if mandatory) */}
        {!isMandatory && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">
              {isKg ? 'Логин ийгиликтүү бекитилди!' : 'Логин успешно сохранён!'}
            </h3>
            <p className="text-sm font-mono text-emerald-300 font-bold">
              @{loginInput}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <AtSign className="w-3.5 h-3.5" />
                <span>{isKg ? 'Милдеттүү логин' : 'Обязательный логин'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                {isKg ? 'Сайттагы логиниңизди тандаңыз' : 'Укажите ваш уникальный логин'}
              </h3>
              
              {/* Deletion Warning Banner */}
              <div className="mt-2.5 p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs leading-relaxed space-y-1">
                <div className="font-black text-amber-300 flex items-center gap-1.5 text-xs">
                  <span>⚠️</span>
                  <span>{isKg ? 'Маанилүү эскертүү!' : 'Важное предупреждение!'}</span>
                </div>
                <p>
                  {isKg
                    ? 'Бардык колдонуучулар үчүн өздүк логин тандоо милдеттүү. 1 жума ичинде логин тандалбаган аккаунттар автоматтык түрдө өчүрүлөт!'
                    : 'Наличие уникального логина обязательно для всех пользователей. Аккаунты без установленного логина удаляются через неделю!'}
                </p>
                <p className="text-[11px] text-amber-300/80 pt-0.5">
                  {isKg
                    ? 'Логин бир гана жолу тандалат жана кийин өзгөртүлбөйт.'
                    : 'Логин задается один раз и не подлежит изменению.'}
                </p>
              </div>
            </div>

            {/* Rules list */}
            <div className="p-3.5 rounded-2xl bg-[#031510] border border-emerald-800/60 text-xs space-y-1.5 text-emerald-100/90">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-emerald-400 text-sm">✦</span>
                <span>{isKg ? 'Латын тамгалары жана сандар гана (a-z, 0-9)' : 'Только латинские буквы и цифры (a-z, 0-9)'}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-emerald-400 text-sm">✦</span>
                <span>{isKg ? 'Кеминде 3, эң көбү 15 белги' : 'Длина от 3 до 15 знаков'}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-emerald-400 text-sm">✦</span>
                <span>{isKg ? 'Бир колдонуучуга бир гана кайталанбас логин' : 'Один уникальный логин на пользователя (без повторов)'}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {isKg ? 'Сиздин жаңы логин' : 'Ваш уникальный логин'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={handleInputChange}
                    placeholder="aktan2026"
                    maxLength={15}
                    autoFocus
                    className="w-full pl-8 pr-16 py-3 rounded-2xl bg-[#02130e] border border-emerald-600/70 focus:border-emerald-400 focus:outline-none text-white text-base font-bold font-mono placeholder-slate-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400">
                    {loginInput.length}/15
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                {!isMandatory && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    {isKg ? 'Кийинчерээк' : 'Позже'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loginInput.trim().length < 3}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/30 cursor-pointer text-center"
                >
                  {isKg ? 'Сактоо жана улантуу' : 'Сохранить логин и продолжить'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
