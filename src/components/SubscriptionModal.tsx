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
} from 'lucide-react';
import { SubscriptionPlan, AppLanguage } from '../types';
import { useAuth } from '../context/AuthContext';

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
  const hasUserStandard =
    user?.subscriptionPlan === 'standard' ||
    (user?.isPaid && subscriptionStatus.effectivePlan === 'standard');
  const hasUserPremium =
    user?.subscriptionPlan === 'premium' ||
    (user?.isPaid && subscriptionStatus.effectivePlan === 'premium');

  // Upgrade scenario: Standard -> Premium discount (3 000 KGS instead of 5 000 KGS)
  const isUpgrade = isPremiumPlan && hasUserStandard;

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
      ? `Саламатсызбы Абдраим Турусбекович! Менде «Жеткиликтүү жазылуу» бар. «Премиум жазылууга» өтүү үчүн 3 000 сом кошумча төлөдүм. Квитанцияны жөнөтөм, Премиум мүмкүнчүлүктү ачып бере аласызбы?`
      : `Здравствуйте Абдраим Турусбекович! У меня активна «Доступная подписка». Я доплатил 3 000 сом для перехода на «Премиальную подписку». Отправляю квитанцию, откройте пожалуйста Премиум доступ!`;
  } else {
    const planNameInSentenceRu = isPremiumPlan ? 'Премиальную' : 'Доступную';
    const planNameInSentenceKg = isPremiumPlan ? 'Премиум' : 'Жеткиликтүү';
    telegramMessage = isKg
      ? `Саламатсызбы Абдраим Турусбекович! Мен сизден ${planNameInSentenceKg} жазылуусун сатып алып төлөдүм, азыр квитанцияны жөнөтөм, мага мүмкүнчүлүк ачып бере аласызбы?`
      : `Здравствуйте Абдраим Турусбекович! Я купил у вас ${planNameInSentenceRu} подписку и оплатил, сейчас отправлю квитанцию, можете мне открыть доступ?`;
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

  if (hasUserPremium && !isUpgrade) {
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
              {isKg ? 'Сизде Премиум жазылуу активдүү!' : 'У вас активна «Премиальная подписка»!'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-2 leading-relaxed max-w-sm mx-auto">
              {isKg
                ? 'Сизде максималдуу мүмкүнчүлүктөр ачык (Теория, сүрөт-чечмелөөлөр, видеосабактар жана үй тапшырмасы). Башка тариф сатып алуунун кажети жок.'
                : 'Вам уже доступны все материалы, видеоуроки, фоторазборы и домашние задания. Дополнительные тарифы не требуются.'}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#06261d] border border-emerald-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/80 text-white max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleResetModal}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {waitingForTelegram ? (
          /* Step 2: Post-Click Screen -> Send Receipt to Telegram */
          <div className="text-center py-3 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400 text-sky-300 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30">
              <Send className="w-8 h-8 translate-x-0.5 -translate-y-0.5 text-sky-400" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedBankName ? `${selectedBankName}` : (isKg ? 'Төлөм' : 'Оплата')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {isKg ? 'Квитанцияны жөнөтүңүз' : 'Отправьте квитанцию'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 max-w-sm mx-auto mt-1 leading-relaxed">
                {isKg
                  ? 'Төлөм жасалгандан кийин, квитанцияны (чекти) Telegram аркылуу жөнөтүңүз. Мен текшерип, дароо толук мүмкүнчүлүктү ачып берем!'
                  : 'После перевода отправьте квитанцию (чек) в Telegram. Я лично проверю и сразу открою вам полный доступ к материалам!'}
              </p>
            </div>

            {/* Prepared Message Box */}
            <div className="p-4 rounded-2xl bg-[#031510] border border-emerald-800/80 text-left space-y-2">
              <div className="flex items-center justify-between text-[11px] text-emerald-400/90 font-bold uppercase">
                <span>{isKg ? 'Даяр билдирүү:' : 'Готовое сообщение:'}</span>
                <span className="text-amber-300 font-black">{displayedPrice}</span>
              </div>
              <p className="text-xs text-slate-200 bg-[#020e0b] p-3 rounded-xl border border-emerald-900/60 font-sans leading-relaxed">
                «{telegramMessage}»
              </p>
            </div>

            {/* Primary Telegram Button */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-sky-500/25 transition-all cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />
              <span>{isKg ? 'Telegram’га өтүү жана чекти жөнөтүү' : 'Перейти в Telegram и отправить чек'}</span>
            </a>

            <button
              onClick={() => setWaitingForTelegram(false)}
              className="text-xs text-emerald-300/70 hover:text-white underline cursor-pointer transition-colors"
            >
              {isKg ? '← Башка банкты тандоо' : '← Выбрать другой банк'}
            </button>
          </div>
        ) : (
          /* Step 1: Bank Selection Grid (100x100 squares) */
          <div className="space-y-4">
            {/* Header / Plan Info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                  {isPremiumPlan ? (
                    <Crown className="w-3.5 h-3.5 text-amber-300" />
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

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white">{displayedPrice}</span>
                {isUpgrade && (
                  <span className="text-sm line-through text-slate-400 font-bold">5 000 сом</span>
                )}
                <span className="text-xs text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                  {planPeriod}
                </span>
              </div>

              <p className="text-xs text-emerald-200/70 mt-1">
                {isKg ? plan.descriptionKg : plan.description}
              </p>
            </div>

            {/* Bank Payment Method Selection Section */}
            <div className="space-y-3 pt-2 border-t border-emerald-800/60">
              <div className="text-center sm:text-left">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isKg ? 'Төлөм ыкмалары (Банкты тандаңыз):' : 'Способы оплаты (Выберите банк):'}</span>
                </p>
                <p className="text-[11px] text-emerald-200/60 mt-0.5">
                  {isKg
                    ? 'Банкты басканда төлөм барагы ачылып, чекти жөнөтүү үчүн Telegram даярдалат'
                    : 'При нажатии на банк откроется перевод с суммой и откроется Telegram для отправки чека'}
                </p>
              </div>

              {/* 4 Square 100x100 Bank Buttons Grid */}
              <div className="grid grid-cols-2 min-[440px]:grid-cols-4 gap-3 sm:gap-4 justify-items-center pt-1">
                {BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankClick(bank)}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none transition-all active:scale-95"
                  >
                    {/* Square 100x100 px Logo Box */}
                    <div className="w-[100px] h-[100px] rounded-2xl p-1 bg-[#031510] border-2 border-emerald-800/80 group-hover:border-emerald-400 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={bank.logoUrl}
                        alt={bank.name}
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                        loading="eager"
                      />
                    </div>

                    {/* Bank Name below the square */}
                    <span className="text-xs font-black text-white group-hover:text-emerald-300 mt-2 tracking-tight transition-colors text-center">
                      {bank.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Telegram Assistant Link Footer */}
            <div className="p-3 rounded-2xl bg-[#031510] border border-emerald-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">
                    {isKg ? 'Суроолор же чекти жөнөтүү:' : 'Вопросы или чек:'}
                  </p>
                  <p className="text-[11px] text-sky-300 font-semibold">@kyrgyzakylman</p>
                </div>
              </div>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-[11px] font-bold transition-all flex items-center gap-1 shrink-0"
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
