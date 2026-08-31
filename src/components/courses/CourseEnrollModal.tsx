import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Crown,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Phone,
  QrCode,
  GraduationCap,
} from 'lucide-react';
import { AppLanguage } from '../../types';
import { CourseGroup } from '../../types/courses';
import { useAuth } from '../../context/AuthContext';

interface CourseEnrollModalProps {
  course: CourseGroup;
  lang: AppLanguage;
  onClose: () => void;
  onEnrollSuccess: (courseId: string) => void;
}

export const CourseEnrollModal: React.FC<CourseEnrollModalProps> = ({
  course,
  lang,
  onClose,
  onEnrollSuccess,
}) => {
  const { user, isVip, isPremium } = useAuth();
  const isKg = lang === 'kg';

  const [paymentMethod, setPaymentMethod] = useState<'mbank' | 'optima' | 'odengi' | 'vip'>('mbank');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+996 ');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const spotsLeft = course.totalSpots - course.enrolledCount;

  const handleConfirmEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onEnrollSuccess(course.id);
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#05261c] border border-emerald-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-left space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">
              {isKg ? 'Сиз топко ийгиликтүү кошулдуңуз!' : 'Вы успешно записаны в группу!'}
            </h3>
            <p className="text-sm text-emerald-200/80 max-w-md mx-auto">
              {isKg
                ? 'Виртуалдык класс, интерактивдүү такта жана сабактар жадыбалы ачылууда...'
                : 'Открываем ваш личный кабинет группы, расписание и доступ к интерактивной доске...'}
            </p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                {isKg ? 'Курска жазылуу' : 'Запись на онлайн-курс'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                {isKg ? course.titleKg : course.titleRu}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/70 mt-1">
                {isKg ? 'Мугалим:' : 'Преподаватель:'} {course.teacher.name} ({course.teacher.title})
              </p>
            </div>

            {/* Group Specs Card */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#031510] border border-emerald-800/60 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {isKg ? 'Орундар' : 'Заполненность'}
                </span>
                <span className="font-black text-white text-sm">
                  {course.enrolledCount} / {course.totalSpots}
                </span>
                <span className="text-emerald-400 text-[10px] block">({spotsLeft} {isKg ? 'бош орун' : 'мест осталось'})</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {isKg ? 'Максат' : 'Целевой балл'}
                </span>
                <span className="font-black text-amber-300 text-sm">
                  {course.targetScore}+ {isKg ? 'балл' : 'баллов'}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  {isKg ? 'Баасы' : 'Стоимость'}
                </span>
                <span className="font-black text-emerald-300 text-sm">
                  {course.priceSom.toLocaleString('ru-RU')} сом
                </span>
              </div>
            </div>

            {/* VIP Status Banner */}
            {isVip || isPremium ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border border-amber-400/50 flex items-start gap-3">
                <Crown className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-amber-200">
                    {isKg ? 'Премиум подписканын артыкчылыгы!' : 'Привилегия Премиум подписки!'}
                  </h4>
                  <p className="text-xs text-amber-100/80 mt-0.5">
                    {isKg
                      ? 'Сизде Премиум тариф активдүү болгондуктан, бул курска кошулуу 0 сом (акысыз)!'
                      : 'Так как у вас активна Премиальная подписка, участие в этой онлайн-группе включено бесплатно (0 сом)!'}
                  </p>
                </div>
              </div>
            ) : (
              /* Payment Options Selection */
              <div className="space-y-3">
                <label className="block text-xs font-bold text-emerald-300">
                  {isKg ? 'Төлөм ыкмасын тандаңыз:' : 'Способ оплаты:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mbank')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mbank'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                        : 'bg-[#031510] border-emerald-800/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">MBank</div>
                    <div className="text-[10px] opacity-75">0% комиссия</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('optima')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'optima'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                        : 'bg-[#031510] border-emerald-800/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">Optima</div>
                    <div className="text-[10px] opacity-75">Карта / QR</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('odengi')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'odengi'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                        : 'bg-[#031510] border-emerald-800/60 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">О!Деньги</div>
                    <div className="text-[10px] opacity-75">Капчык</div>
                  </button>
                </div>
              </div>
            )}

            {/* Form Submit */}
            <form onSubmit={handleConfirmEnroll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-300 mb-1">
                  {isKg ? 'Байланыш телефону (WhatsApp/Telegram):' : 'Ваш номер телефона (WhatsApp/Telegram):'}
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+996 700 000 000"
                  className="w-full bg-[#031510] border border-emerald-800/80 rounded-2xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">{isKg ? 'Жалпы төлөм:' : 'К оплате:'}</span>
                  <span className="text-lg sm:text-xl font-black text-emerald-300">
                    {isVip || isPremium ? (isKg ? '0 сом (Премиум)' : '0 сом (Премиум)') : `${course.priceSom.toLocaleString('ru-RU')} сом`}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  {isProcessing
                    ? (isKg ? 'Катталууда...' : 'Оформление...')
                    : isVip || isPremium
                    ? (isKg ? 'Топко кирүү (Акысыз)' : 'Зайти в группу (Бесплатно)')
                    : (isKg ? 'Төлөө жана жазылуу' : 'Оплатить и записаться')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
