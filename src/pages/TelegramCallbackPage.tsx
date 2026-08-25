import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Send, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Home, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppLanguage, TelegramUser } from '../types';

interface TelegramCallbackProps {
  lang?: AppLanguage;
}

export const TelegramCallbackPage: React.FC<TelegramCallbackProps> = ({ lang = 'ru' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithTelegram, user } = useAuth();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [authPayload, setAuthPayload] = useState<TelegramUser | null>(null);

  const isKg = lang === 'kg';

  useEffect(() => {
    const parseAndVerifyTelegramAuth = async () => {
      try {
        let rawData: Record<string, any> = {};

        // 1. Check Search Parameters (?id=...&first_name=...&hash=...)
        const searchParams = new URLSearchParams(location.search || window.location.search);
        if (searchParams.has('id') && searchParams.has('hash')) {
          searchParams.forEach((value, key) => {
            rawData[key] = value;
          });
        }

        // 2. Check if tgAuthResult is present in search or hash (#tgAuthResult=base64)
        if (!rawData.id) {
          const hashStr = location.hash || window.location.hash;
          if (hashStr) {
            const cleanHash = hashStr.startsWith('#') ? hashStr.substring(1) : hashStr;
            const hashParams = new URLSearchParams(cleanHash);
            
            if (hashParams.has('tgAuthResult')) {
              try {
                const base64Data = hashParams.get('tgAuthResult')!;
                const decodedJson = atob(base64Data);
                rawData = JSON.parse(decodedJson);
              } catch (e) {
                console.error('Не удалось декодировать tgAuthResult:', e);
              }
            } else if (hashParams.has('id') && hashParams.has('hash')) {
              hashParams.forEach((value, key) => {
                rawData[key] = value;
              });
            }
          }
        }

        // 3. Fallback: check if tgAuthResult is in search params
        if (!rawData.id && searchParams.has('tgAuthResult')) {
          try {
            const base64Data = searchParams.get('tgAuthResult')!;
            const decodedJson = atob(base64Data);
            rawData = JSON.parse(decodedJson);
          } catch (e) {
            console.error('Не удалось декодировать tgAuthResult из search:', e);
          }
        }

        if (!rawData.id || !rawData.hash) {
          setStatus('error');
          setErrorMessage(
            isKg
              ? 'Telegram авторизациясынын маалыматтары табылган жок. Сураныч, кайра кириңиз.'
              : 'Параметры авторизации Telegram не найдены в запросе. Пожалуйста, попробуйте войти снова.'
          );
          return;
        }

        // Convert numeric id if present
        const telegramUser: TelegramUser = {
          id: Number(rawData.id),
          first_name: rawData.first_name || '',
          last_name: rawData.last_name || '',
          username: rawData.username || '',
          photo_url: rawData.photo_url || '',
          auth_date: Number(rawData.auth_date || Math.floor(Date.now() / 1000)),
          hash: String(rawData.hash),
        };

        setAuthPayload(telegramUser);

        // 4. Send to Backend API for HMAC-SHA256 signature verification
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(telegramUser),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.error || `HTTP ${response.status}: Ошибка валидации подписи Telegram`
          );
        }

        const data = await response.json();
        if (data.success) {
          const verifiedUser = data.user || telegramUser;
          // Apply verified user to AuthContext
          loginWithTelegram(verifiedUser);
          setStatus('success');

          // Redirect to profile or home after brief confirmation
          setTimeout(() => {
            navigate('/profile', { replace: true });
          }, 1400);
        } else {
          throw new Error(data.error || 'Недействительная подпись данных Telegram');
        }
      } catch (err: any) {
        console.error('Ошибка в Telegram Callback:', err);
        setStatus('error');
        setErrorMessage(
          err.message ||
            (isKg
              ? 'Telegram кол тамгасын текшерүүдө ката кетти'
              : 'Не удалось проверить подпись Telegram на сервере')
        );
      }
    };

    parseAndVerifyTelegramAuth();
  }, [location, isKg, loginWithTelegram, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-[#05261c] to-[#02130e] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-0 right-1/4 w-48 h-32 bg-[#229ED9]/20 rounded-full blur-3xl pointer-events-none" />

        {status === 'verifying' && (
          <div className="py-8 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#229ED9] to-[#167cae] p-0.5 shadow-xl shadow-[#229ED9]/30 mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-[#041d16] rounded-[14px] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#229ED9] border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {isKg ? 'Telegram авторизациясы текшерилүүдө...' : 'Проверка авторизации Telegram...'}
              </h2>
              <p className="text-xs text-emerald-200/70 mt-1.5 leading-relaxed max-w-xs mx-auto">
                {isKg
                  ? 'Коопсуздук сервери HMAC-SHA256 кол тамгасын жана боттун аныктыгын текшерип жатат'
                  : 'Сервер проверяет цифровую подпись HMAC-SHA256 и подлинность данных Telegram'}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#229ED9]/15 border border-[#229ED9]/30 text-[11px] font-semibold text-[#8ed8ff]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#229ED9]" />
              <span>KYRGYZ AKYLMAN Security Guard</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 shadow-xl shadow-emerald-500/30 mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-[#041d16] rounded-[14px] flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {isKg ? 'Ийгиликтүү кирдиңиз!' : 'Успешная авторизация!'}
              </h2>
              <p className="text-sm font-semibold text-emerald-300 mt-1">
                {authPayload?.first_name || authPayload?.username || (isKg ? 'Колдонуучу' : 'Пользователь')}
              </p>
              <p className="text-xs text-emerald-200/70 mt-1">
                {isKg
                  ? 'Өздүк кабинетке багытталууда...'
                  : 'Перенаправление в личный кабинет...'}
              </p>
            </div>

            <button
              onClick={() => navigate('/profile')}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              <span>{isKg ? 'Профилге өтүү' : 'Перейти в профиль'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 p-0.5 shadow-xl shadow-rose-500/30 mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-[#041d16] rounded-[14px] flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {isKg ? 'Авторизацияда ката кетти' : 'Ошибка авторизации'}
              </h2>
              <p className="text-xs text-rose-300 mt-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 leading-relaxed text-left">
                {errorMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                to="/"
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isKg ? 'Башкы бет' : 'На главную'}</span>
              </Link>
              <button
                onClick={() => {
                  const botId = '8877236146';
                  const origin = window.location.origin;
                  const returnTo = `${origin}/auth/callback`;
                  window.location.href = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(
                    origin
                  )}&return_to=${encodeURIComponent(returnTo)}&request_access=write`;
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1c8ec4] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#229ED9]/30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isKg ? 'Кайра аракет' : 'Повторить'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
