import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  Crown,
  Zap,
  Send,
  ExternalLink,
  Flame,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { SubscriptionPlan, AppLanguage } from '../types';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';

interface SubscriptionModalProps {
  plan: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

interface BankOption {
  id: string;
  name: string;
  logoUrl: string;
  getUrl: (planId: string, isUpgrade: boolean) => string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  plan,
  isOpen,
  onClose,
  lang,
}) => {
  const { user, subscriptionStatus } = useAuth();
  const [waitingForTelegram, setWaitingForTelegram] = useState(false);
  const [selectedBankName, setSelectedBankName] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const isKg = lang === 'kg';
  const isPremiumPlan = plan.id === 'premium';
  const isAdmin = Boolean(user?.identifier && user.identifier.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase());

  // Paid users have active subscription until June 1, 2027
  const isPaidUserPremium = (Boolean(user?.isPaid) && (user?.subscriptionPlan === 'premium' || subscriptionStatus.effectivePlan === 'premium')) || isAdmin;
  const isPaidUserStandard = Boolean(user?.isPaid) && user?.subscriptionPlan === 'standard' && !isPaidUserPremium;

  // Upgrade scenario: Paid Standard -> Premium discount (3 000 KGS instead of 5 000 KGS)
  const isUpgrade = isPremiumPlan && isPaidUserStandard;

  const planTitle = isKg ? plan.nameKg : plan.name;
  const displayedPrice = isUpgrade
    ? '3 000 сом'
    : isKg
    ? plan.priceLabelKg
    : plan.priceLabel;
  const planPeriod = isKg ? plan.periodLabelKg : plan.periodLabel;

  // Telegram message text:
  let telegramMessage = '';
  if (isUpgrade) {
    telegramMessage = isKg
      ? `Саламатсызбы! Менде «Жеткиликтүү жазылуу» бар. «Премиум жазылууга» өтүү үчүн 3 000 сом кошумча төлөдүм. Квитанцияны жөнөтөм, Премиум мүмкүнчүлүктү ачып бере аласызбы?`
      : `Здравствуйте! У меня активна «Доступная подписка». Я доплатил 3 000 сом для перехода на «Премиальную подписку». Отправляю квитанцию, откройте пожалуйста Премиум доступ!`;
  } else {
    const planNameInSentenceRu = isPremiumPlan ? 'Премиальную' : 'Доступную';
    const planNameInSentenceKg = isPremiumPlan ? 'Премиум' : 'Жеткиликтүү';
    telegramMessage = isKg
      ? `Саламатсызбы! Мен ${planNameInSentenceKg} жазылуусун сатып алып төлөдүм, азыр квитанцияны жөнөтөм, мага мүмкүнчүлүк ачып бере аласызбы?`
      : `Здравствуйте! Я купил ${planNameInSentenceRu} подписку и оплатил, сейчас отправлю квитанцию, можете мне открыть доступ?`;
  }

  const telegramUrl = `https://t.me/kyrgyzakylman?text=${encodeURIComponent(telegramMessage)}`;

  // Bank list with provided images and exact payment links
  const BANKS: BankOption[] = [
    {
      id: 'mbank',
      name: 'MBANK',
      logoUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787231313/1.png',
      getUrl: (planId: string, upgrade: boolean) =>
        upgrade
          ? 'https://app.mbank.kg/qr/#00020101021132500012c2c.mbank.kg010202101299670851994412021113021152049999530341754063000005910ABDRAIM%20M.6304b785'
          : planId === 'premium'
          ? 'https://app.mbank.kg/qr/#00020101021132500012c2c.mbank.kg010202101299670851994412021113021152049999530341754065000005910ABDRAIM%20M.6304cb9b'
          : 'https://app.mbank.kg/qr/#00020101021132500012c2c.mbank.kg010202101299670851994412021113021152049999530341754062000005910ABDRAIM%20M.6304bc84',
    },
    {
      id: 'bakai',
      name: 'Bakai Bank',
      logoUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787231318/3.png',
      getUrl: (planId: string, upgrade: boolean) =>
        upgrade
          ? 'https://bakai.app#00020101021132460011qr.bakai.kg010131016124207006115751413021233120008BAKAIAPP5204653853034175910Abdraim%20M.540630000063045E1B'
          : planId === 'premium'
          ? 'https://bakai.app#00020101021132460011qr.bakai.kg010131016124207006115751413021233120008BAKAIAPP5204653853034175910Abdraim%20M.540650000063043F7F'
          : 'https://bakai.app#00020101021132460011qr.bakai.kg010131016124207006115751413021233120008BAKAIAPP5204653853034175910Abdraim%20M.540620000063047CE5',
    },
    {
      id: 'kompanion',
      name: 'Компаньон',
      logoUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787231317/2.png',
      getUrl: (planId: string, upgrade: boolean) =>
        upgrade
          ? 'https://24.kompanion.kg/qr/#000201010211540630000032550015qr.kompanion.kg010410051012996708519944120212130212330401005303417520460125909KOMPANION3410ABDRAIM+M.63041A92'
          : planId === 'premium'
          ? 'https://24.kompanion.kg/qr/#000201010211540650000032550015qr.kompanion.kg010410051012996708519944120212130212330401005303417520460125909KOMPANION3410ABDRAIM+M.630449F3'
          : 'https://24.kompanion.kg/qr/#000201010211540620000032550015qr.kompanion.kg010410051012996708519944120212130212330401005303417520460125909KOMPANION3410ABDRAIM+M.6304EB82',
    },
    {
      id: 'obank',
      name: 'O!Bank',
      logoUrl: 'https://res.cloudinary.com/rw9qhk3a/image/upload/v1787231318/4.png',
      getUrl: (planId: string, upgrade: boolean) =>
        upgrade
          ? 'https://api.dengi.o.kg/#00020101021132680012p2p.dengi.kg01048580111231718595872210129967085199441202121302123410%D0%90%D0%91%D0%94%D0%A0%D0%90%D0%98%D0%9C%20%D0%9C.52047399530341754063000005906O%21Bank6304B721'
          : planId === 'premium'
          ? 'https://api.dengi.o.kg/#00020101021132680012p2p.dengi.kg01048580111231718595872210129967085199441202121302123410%D0%90%D0%91%D0%94%D0%A0%D0%90%D0%98%D0%9C%20%D0%9C.52047399530341754065000005906O%21Bank63048F31'
          : 'https://api.dengi.o.kg/#00020101021132680012p2p.dengi.kg01048580111273821559560010129967085199441202121302123410%D0%90%D0%91%D0%94%D0%A0%D0%90%D0%98%D0%9C%20%D0%9C.52047399530341754062000005906O%21Bank63049EB6',
    },
  ];

  const handleBankClick = (bank: BankOption) => {
    const bankUrl = bank.getUrl(plan.id, isUpgrade);
    setSelectedBankName(bank.name);
    setWaitingForTelegram(true);

    // 1. Open bank app link (deep-link / QR link with prefilled amount and recipient)
    window.open(bankUrl, '_blank');

    // 2. Open Telegram with prepared prefilled text
    setTimeout(() => {
      window.open(telegramUrl, '_blank');
    }, 600);
  };

  const handleResetModal = () => {
    setWaitingForTelegram(false);
    setSelectedBankName(null);
    onClose();
  };

  // Only block users who ALREADY PAID for permanent Premium until 2027
  if (isPaidUserPremium && !isUpgrade) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-lg bg-[#06261d] border border-amber-400/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 text-white text-center space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleResetModal}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/50 text-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Crown className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isKg ? 'Сизде Премиалдуу жазылуу активдүү!' : 'У вас активна «Премиальная подписка»!'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-2 leading-relaxed max-w-sm mx-auto">
              {isKg
                ? 'Сизде 2027-жылдын 1-июнуна чейин толук мүмкүнчүлүктөр ачык. Башка тариф сатып алуунун кажети жок.'
                : 'У вас действует подписка до 1 июня 2027 года со всеми материалами и тестами. Дополнительные тарифы не требуются.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetModal}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            {isKg ? 'Түшүндүм' : 'Понятно'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar my-auto transition-all ${
          isPremiumPlan
            ? 'bg-gradient-to-b from-[#1b1404] via-[#0d2218] to-[#041a14] border-2 border-amber-400/90 shadow-amber-500/25 ring-1 ring-amber-400/50'
            : 'bg-[#06261d] border border-emerald-700/80 shadow-emerald-950/80'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        {isPremiumPlan ? (
          <>
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* Close Button */}
        <button
          onClick={handleResetModal}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-colors cursor-pointer z-10 ${
            isPremiumPlan
              ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 hover:text-amber-100 border border-amber-400/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {waitingForTelegram ? (
          /* Step 2: Post-Click Screen -> Send Receipt to Telegram */
          <div className="text-center py-2 space-y-4 animate-in fade-in duration-300">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
                isPremiumPlan
                  ? 'bg-amber-400/20 border border-amber-400 text-amber-300 shadow-amber-500/30'
                  : 'bg-sky-500/20 border border-sky-400 text-sky-300 shadow-sky-500/30'
              }`}
            >
              <Send className={`w-7 h-7 sm:w-8 sm:h-8 translate-x-0.5 -translate-y-0.5 ${isPremiumPlan ? 'text-amber-300' : 'text-sky-400'}`} />
            </div>

            <div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2 ${
                  isPremiumPlan
                    ? 'bg-amber-400/20 border border-amber-400/50 text-amber-300'
                    : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isPremiumPlan ? 'text-amber-400' : 'text-emerald-400'}`} />
                <span>{selectedBankName ? `${selectedBankName}` : (isKg ? 'Төлөм' : 'Оплата')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isKg ? 'Квитанцияны жөнөтүңүз' : 'Отправьте квитанцию'}
              </h3>
              <p className={`text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed ${isPremiumPlan ? 'text-amber-100/90' : 'text-emerald-200/80'}`}>
                {isKg
                  ? 'Банк аркылуу төлөм өткөндөн кийин квитанцияны Telegram аркылуу жөнөтүңүз. Бардык төлөмдөр 100% коопсуз жана ачык-айкын, мүмкүнчүлүк текшерүүдөн соң дароо активдештирилет!'
                  : 'После перевода отправьте чек в Telegram. Все операции на 100% безопасны и прозрачны, подключение подтверждается надёжно и персонально для вашего аккаунта!'}
              </p>
            </div>

            {/* Prepared Message Box */}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl text-left space-y-2 ${
                isPremiumPlan
                  ? 'bg-[#151003] border border-amber-500/50'
                  : 'bg-[#031510] border border-emerald-800/80'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase">
                <span className={`flex items-center gap-1.5 ${isPremiumPlan ? 'text-amber-300' : 'text-emerald-400/90'}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isKg ? 'Даяр билдирүү:' : 'Готовое сообщение:'}</span>
                </span>
                <span className="text-amber-300 font-black">{displayedPrice}</span>
              </div>
              <p
                className={`text-xs p-3 rounded-xl font-sans leading-relaxed break-words ${
                  isPremiumPlan
                    ? 'text-amber-100 bg-[#0d0901] border border-amber-500/30'
                    : 'text-slate-200 bg-[#020e0b] border border-emerald-900/60'
                }`}
              >
                «{telegramMessage}»
              </p>
            </div>

            {/* Verification & Support Box */}
            <div
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl shadow-md ${
                isPremiumPlan
                  ? 'bg-[#151003] border border-amber-500/50'
                  : 'bg-[#031510] border border-emerald-700/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isPremiumPlan
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-left text-xs truncate">
                  <span className="text-white font-bold block truncate">Кыргыз Акылман</span>
                  <span className={`text-[10px] block truncate ${isPremiumPlan ? 'text-amber-300/80' : 'text-emerald-300/80'}`}>
                    {isKg ? 'Жеке текшерүү жана колдоо' : 'Личная проверка чека и кураторство'}
                  </span>
                </div>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                  isPremiumPlan
                    ? 'text-amber-300 bg-amber-950/80 border-amber-500/60'
                    : 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
                }`}
              >
                @kyrgyzakylman
              </span>
            </div>

            {/* Transparency / Timing Notice */}
            <div
              className={`p-3 rounded-xl text-left flex items-start gap-2.5 text-[11px] ${
                isPremiumPlan
                  ? 'bg-amber-950/40 border border-amber-500/40 text-amber-100/90'
                  : 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200/80'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isPremiumPlan ? 'text-amber-400' : 'text-emerald-400'}`} />
              <span>
                {isKg
                  ? 'Коопсуздук жана ачыктык: Төлөм расмий банктык реквизиттер боюнча жүргүзүлөт, ал эми мүмкүнчүлүктү куратор текшерип дароо активдештирет.'
                  : 'Безопасность и прозрачность: Оплата идёт напрямую через официальные банковские QR/счета, а подключение подписки куратор подтверждает лично.'}
              </span>
            </div>

            {/* Primary Telegram Button */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer active:scale-98 ${
                isPremiumPlan
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 hover:brightness-110 text-white shadow-sky-500/25'
              }`}
            >
              <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />
              <span>{isKg ? 'Telegram’га өтүү жана чекти жөнөтүү' : 'Перейти в Telegram и отправить чек'}</span>
            </a>

            <button
              onClick={() => setWaitingForTelegram(false)}
              className={`text-xs underline cursor-pointer transition-colors ${
                isPremiumPlan ? 'text-amber-300/80 hover:text-white' : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              {isKg ? '← Башка банкты тандоо' : '← Выбрать другой банк'}
            </button>
          </div>
        ) : (
          /* Step 1: Bank Selection Grid */
          <div className="space-y-4">
            {/* Header / Plan Info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    isPremiumPlan
                      ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {isPremiumPlan ? (
                    <Crown className="w-4 h-4 text-slate-950" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>{planTitle}</span>
                </div>

                {isUpgrade && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-300" />
                    <span>{isKg ? 'Жеңилдетилген доплата' : 'Доплата со скидкой'}</span>
                  </span>
                )}
              </div>

              {isUpgrade && (
                <div className="mb-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-400/50 text-xs text-amber-200 space-y-1">
                  <div className="font-black text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>
                      {isKg
                        ? 'Сизде «Жеткиликтүү жазылуу» бар (2 000 сом төлөнгөн)'
                        : 'У вас активна «Доступная подписка» (2 000 сом уже оплачено)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-100/80">
                    {isKg
                      ? 'Премиумга өтүү үчүн 5 000 сом эмес, болгону айырмасын — 3 000 сом гана төлөйсүз!'
                      : 'Для перехода на «Премиальную подписку» вам нужно доплатить лишь разницу — 3 000 сом вместо 5 000 сом!'}
                  </p>
                </div>
              )}

              <div className="flex items-baseline gap-2 flex-wrap mt-1">
                <span
                  className={`text-3xl sm:text-4xl font-black ${
                    isPremiumPlan
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400'
                      : 'text-white'
                  }`}
                >
                  {displayedPrice}
                </span>
                {isUpgrade && (
                  <span className="text-sm line-through text-slate-400 font-bold">5 000 сом</span>
                )}
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                    isPremiumPlan
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {planPeriod}
                </span>
              </div>

              <p className={`text-xs mt-1.5 ${isPremiumPlan ? 'text-amber-100/90' : 'text-emerald-200/70'}`}>
                {isKg ? plan.descriptionKg : plan.description}
              </p>
            </div>

            {/* Bank Payment Method Selection Section */}
            <div className={`space-y-3 pt-3 border-t ${isPremiumPlan ? 'border-amber-500/40' : 'border-emerald-800/60'}`}>
              <div className="text-center sm:text-left">
                <p
                  className={`text-xs font-black uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5 ${
                    isPremiumPlan ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isPremiumPlan ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span>{isKg ? 'Төлөм ыкмалары (Банкты тандаңыз):' : 'Способы оплаты (Выберите банк):'}</span>
                </p>
                <p className={`text-[11px] mt-0.5 ${isPremiumPlan ? 'text-amber-100/70' : 'text-emerald-200/60'}`}>
                  {isKg
                    ? 'Төлөмдөр 100% коопсуз жана ачык-айкын, квитанцияны Telegram аркылуу жөнөтүңүз'
                    : 'Все операции прозрачны и безопасны, подключение подтверждается после отправки чека в Telegram'}
                </p>
              </div>

              {/* Responsive Bank Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 justify-items-center pt-1">
                {BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankClick(bank)}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none transition-all active:scale-95 w-full max-w-[110px]"
                  >
                    {/* Square Bank Logo Box */}
                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 transition-all duration-200 flex items-center justify-center overflow-hidden border-2 ${
                        isPremiumPlan
                          ? 'bg-[#151003] border-amber-500/50 group-hover:border-amber-300 group-hover:shadow-lg group-hover:shadow-amber-500/30'
                          : 'bg-[#031510] border-emerald-800/80 group-hover:border-emerald-400 group-hover:shadow-lg group-hover:shadow-emerald-500/20'
                      }`}
                    >
                      <img
                        src={bank.logoUrl}
                        alt={bank.name}
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                        loading="eager"
                      />
                    </div>

                    {/* Bank Name below the square */}
                    <span
                      className={`text-xs font-black mt-1.5 tracking-tight transition-colors text-center truncate w-full ${
                        isPremiumPlan
                          ? 'text-amber-100 group-hover:text-amber-300'
                          : 'text-white group-hover:text-emerald-300'
                      }`}
                    >
                      {bank.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Telegram Assistant Link Footer */}
            <div
              className={`p-3 rounded-2xl flex items-center justify-between gap-3 text-xs border ${
                isPremiumPlan
                  ? 'bg-[#151003] border-amber-500/50'
                  : 'bg-[#031510] border-emerald-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                    isPremiumPlan
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="font-bold text-white leading-tight truncate">
                    {isKg ? 'Суроолор же чекти жөнөтүү:' : 'Вопросы или чек:'}
                  </p>
                  <p className={`text-[11px] font-semibold truncate ${isPremiumPlan ? 'text-amber-300' : 'text-emerald-400'}`}>
                    @kyrgyzakylman
                  </p>
                </div>
              </div>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 border ${
                  isPremiumPlan
                    ? 'bg-amber-400/20 hover:bg-amber-400/30 border-amber-400/50 text-amber-300'
                    : 'bg-sky-500/15 hover:bg-sky-500/30 border-sky-400/40 text-sky-300'
                }`}
              >
                <span>Telegram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
