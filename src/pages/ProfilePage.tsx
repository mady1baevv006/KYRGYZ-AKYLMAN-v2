import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Award,
  TrendingUp,
  Target,
  Clock,
  Calendar,
  LogOut,
  Edit3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Sparkles,
  School,
  Crown,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Flame,
  GraduationCap,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth, UserTestRecord } from '../context/AuthContext';
import { AppLanguage, SubscriptionPlan } from '../types';
import { KYRGYZ_UNIVERSITIES } from '../data/constants';
import { SUBSCRIPTION_PLANS } from '../data/subscriptions';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { TheoriesSection } from '../components/TheoriesSection';
import { AuthModal } from '../components/AuthModal';
import { processAndCompressImage } from '../utils/imageUpload';

interface ProfilePageProps {
  lang: AppLanguage;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ lang }) => {
  const { user, subscriptionStatus, logout, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'history' | 'theories'>('history');

  const [editName, setEditName] = useState(user?.name || '');
  const [editTargetScore, setEditTargetScore] = useState(user?.targetScore || 210);
  const [editUniversity, setEditUniversity] = useState(user?.targetUniversity || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isPremium =
    subscriptionStatus.effectivePlan === 'premium' ||
    user?.subscriptionPlan === 'premium' ||
    isAdmin;
  const isPaidUserPremium =
    (Boolean(user?.isPaid) && (user?.subscriptionPlan === 'premium' || subscriptionStatus.effectivePlan === 'premium')) ||
    isAdmin;
  const isPaidUserStandard = Boolean(user?.isPaid) && user?.subscriptionPlan === 'standard';
  const isTrialPremium = !user?.isPaid && !isAdmin && subscriptionStatus.trialStage === 'trial_premium';

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressingPhoto(true);
    try {
      const compressed = await processAndCompressImage(file, 400);
      setEditAvatar(compressed);
    } catch (err: any) {
      alert(err?.message || 'Ошибка загрузки фотографии');
    } finally {
      setIsCompressingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const t = {
    ru: {
      title: 'Личный кабинет',
      subtitle: 'Профиль ученика и история тестирований',
      notLoggedIn: 'Вы не авторизованы',
      notLoggedInDesc: 'Войдите или зарегистрируйтесь, чтобы сохранять результаты тестов и отслеживать прогресс.',
      loginBtn: 'Войти / Зарегистрироваться',
      goHome: 'На главную',
      studentBadge: 'Абитуриент 2027',
      targetScore: 'Цель на ОРТ',
      points: 'баллов',
      testsCompleted: 'Пройдено тестов',
      bestScore: 'Лучший результат',
      avgAccuracy: 'Средняя точность',
      historyTitle: 'История прохождения тестов',
      noHistory: 'Вы еще не проходили тесты',
      noHistoryDesc: 'Выберите пробный вариант или отдельный раздел на главной странице и проверьте свои знания.',
      startTestBtn: 'Пройти первый тест',
      editProfile: 'Редактировать профиль',
      avatarLabel: 'Выберите аватарку',
      changeAvatarBtn: 'Выбрать аватарку',
      avatarModalTitle: 'Коллекция аватарок',
      avatarDesc: 'Иконки созданы Magnific - Flaticon',
      closeAvatarPicker: 'Выбрать эту аватарку',
      logout: 'Выйти',
      saveChanges: 'Сохранить изменения',
      cancel: 'Отмена',
      nameLabel: 'Ваше имя',
      targetScoreLabel: 'Целевой балл (110 - 245)',
      targetUniLabel: 'Целевой ВУЗ',
      selectUniPlaceholder: '-- Выберите один целевой ВУЗ --',
      savedSuccess: 'Данные успешно обновлены!',
      registeredSince: 'Регистрация:',
      reviewResult: 'Подробнее',
      date: 'Дата',
      testName: 'Название теста',
      score: 'Результат',
      accuracy: 'Точность',
      mode: 'Режим',
      fullMode: 'Полный ОРТ',
      customMode: 'Блок Математика',
      sectionMode: 'Секция',
      practiceMode: 'Практика',
    },
    kg: {
      title: 'Жеке кабинет',
      subtitle: 'Окуучунун профили жана тесттердин тарыхы',
      notLoggedIn: 'Сиз аккаунтка кирген жоксуз',
      notLoggedInDesc: 'Тесттердин жыйынтыктарын сактоо жана прогрессти көрүү үчүн кириңиз же катталыңыз.',
      loginBtn: 'Кирүү / Катталуу',
      goHome: 'Башкы бетке',
      studentBadge: 'Абитуриент 2027',
      targetScore: 'ЖРТ максаты',
      points: 'балл',
      testsCompleted: 'Тапшырылган тесттер',
      bestScore: 'Эң жогорку балл',
      avgAccuracy: 'Орточо тактык',
      historyTitle: 'Тест тапшыруу тарыхы',
      noHistory: 'Сиз азырынча тест тапшыра элексиз',
      noHistoryDesc: 'Башкы беттен сыноо вариантын тандап, өзүңүздүн билим деңгээлиңизди текшериңиз.',
      startTestBtn: 'Биринчи тестти баштоо',
      editProfile: 'Профилди өзгөртүү',
      avatarLabel: 'Аватар тандаңыз',
      changeAvatarBtn: 'Аватар тандоо',
      avatarModalTitle: 'Аватарлар жыйнагы',
      avatarDesc: 'Сүрөттөр Magnific - Flaticon тарабынан түзүлгөн',
      closeAvatarPicker: 'Бул аватарды тандоо',
      logout: 'Чыгуу',
      saveChanges: 'Өзгөртүүлөрдү сактоо',
      cancel: 'Жокко чыгаруу',
      nameLabel: 'Сиздин атыңыз',
      targetScoreLabel: 'Максаттуу балл (110 - 245)',
      targetUniLabel: 'Максат кылган ЖОЖ',
      selectUniPlaceholder: '-- Бир максаттуу ЖОЖду тандаңыз --',
      savedSuccess: 'Маалыматтар ийгиликтүү жаңыртылды!',
      registeredSince: 'Катталган күнү:',
      reviewResult: 'Толук көрүү',
      date: 'Күнү',
      testName: 'Тесттин аты',
      score: 'Жыйынтык',
      accuracy: 'Тактык',
      mode: 'Режим',
      fullMode: 'Толук ЖРТ',
      customMode: 'Математика блогу',
      sectionMode: 'Бөлүм',
      practiceMode: 'Практика',
    },
  }[lang] || {
    title: 'Личный кабинет',
    subtitle: 'Профиль ученика и история тестирований',
    notLoggedIn: 'Вы не авторизованы',
    notLoggedInDesc: 'Войдите или зарегистрируйтесь, чтобы сохранять результаты тестов и отслеживать прогресс.',
    loginBtn: 'Войти / Зарегистрироваться',
    goHome: 'На главную',
    studentBadge: 'Абитуриент 2027',
    targetScore: 'Цель на ОРТ',
    points: 'баллов',
    testsCompleted: 'Пройдено тестов',
    bestScore: 'Лучший результат',
    avgAccuracy: 'Средняя точность',
    historyTitle: 'История прохождения тестов',
    noHistory: 'Вы еще не проходили тесты',
    noHistoryDesc: 'Выберите пробный вариант или отдельный раздел на главной странице и проверьте свои знания.',
    startTestBtn: 'Пройти первый тест',
    editProfile: 'Редактировать профиль',
    avatarLabel: 'Выберите аватарку',
    changeAvatarBtn: 'Выбрать аватарку',
    avatarModalTitle: 'Коллекция аватарок',
    avatarDesc: 'Иконки созданы Magnific - Flaticon',
    closeAvatarPicker: 'Выбрать эту аватарку',
    logout: 'Выйти',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',
    nameLabel: 'Ваше имя',
    targetScoreLabel: 'Целевой балл (110 - 245)',
    targetUniLabel: 'Целевой ВУЗ',
    selectUniPlaceholder: '-- Выберите один целевой ВУЗ --',
    savedSuccess: 'Данные успешно обновлены!',
    registeredSince: 'Регистрация:',
    reviewResult: 'Подробнее',
    date: 'Дата',
    testName: 'Название теста',
    score: 'Результат',
    accuracy: 'Точность',
    mode: 'Режим',
    fullMode: 'Полный ОРТ',
    customMode: 'Блок Математика',
    sectionMode: 'Секция',
    practiceMode: 'Практика',
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black mb-3">{t.notLoggedIn}</h1>
        <p className="text-sm text-emerald-200/70 max-w-md mx-auto mb-8">
          {t.notLoggedInDesc}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
          >
            {lang === 'kg' ? 'Кирүү / Катталуу' : 'Войти в аккаунт'}
          </button>
          <Link
            to="/"
            className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-all cursor-pointer"
          >
            {t.goHome}
          </Link>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          lang={lang}
        />
      </div>
    );
  }

  const history = user.testHistory || [];
  const testsCount = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map((h) => h.totalScore)) : 0;
  const avgAccuracy =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + (h.accuracy || 0), 0) / history.length)
      : 0;

  const targetProgress = Math.min(100, Math.round((bestScore / (user.targetScore || 215)) * 100));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || user.name,
      targetScore: Number(editTargetScore) || 215,
      targetUniversity: editUniversity.trim() || undefined,
      avatar: editAvatar,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1000);
  };

  const getRecordSubjectName = (record: UserTestRecord): string => {
    if (record.subject) return record.subject;
    const isKg = record.language === 'kg' || lang === 'kg';
    
    if (record.mode === 'full') {
      return isKg ? 'Толук ЖРТ' : 'Полный ОРТ';
    }
    
    if (record.mode === 'section') {
      return isKg ? 'Математика' : 'Математика';
    }

    return isKg ? 'Математика' : 'Математика';
  };

  const getRecordTestName = (record: UserTestRecord): string => {
    if (record.testName) return record.testName;
    if (record.title && !record.title.startsWith('Вариант') && !record.title.startsWith('Variant')) {
      return record.title;
    }
    const vId = record.variantId || 1;
    return `ЦООМО №${vId}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-12 space-y-8 text-white">
      {/* Top Banner / User Hero */}
      <div
        className={`relative rounded-3xl bg-[#06261d] p-5 sm:p-8 overflow-hidden transition-all ${
          isPremium
            ? 'border-2 border-amber-400/90 shadow-[0_0_35px_rgba(251,191,36,0.22)]'
            : 'border border-emerald-800/60 shadow-xl shadow-black/40'
        }`}
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* User info */}
          <div className="flex items-center gap-3.5 sm:gap-6 min-w-0 flex-1 w-full sm:w-auto">
            <div
              onClick={() => {
                setEditName(user.name);
                setEditTargetScore(user.targetScore || 215);
                setEditUniversity(user.targetUniversity || '');
                setEditAvatar(user.avatar || '');
                setIsEditing(true);
              }}
              className="relative group cursor-pointer shrink-0"
              title="Нажмите, чтобы изменить профиль и фото"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl object-cover group-hover:scale-105 transition-all bg-emerald-950 ${
                    isPremium
                      ? 'border-3 border-amber-400 ring-4 ring-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.55)]'
                      : 'border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/20'
                  }`}
                />
              ) : (
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black text-2xl sm:text-3xl group-hover:scale-105 transition-all ${
                    isPremium
                      ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 border-3 border-amber-400 ring-4 ring-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.55)]'
                      : 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 border-2 border-emerald-400/60'
                  }`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'У'}
                </div>
              )}
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md border ${
                  isPremium
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-emerald-500 text-slate-950 border-[#06261d]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-lg sm:text-3xl font-black tracking-tight truncate max-w-full text-white">{user.name}</h1>
                
                {/* Badges in the exact same line/row */}
                <div className="inline-flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0 shadow-xs">
                    {t.studentBadge}
                  </span>

                  {isPaidUserPremium ? (
                    <div
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1 shrink-0 shadow-sm"
                      title={lang === 'kg' ? 'Премиум жазылуу 2027-жылдын 1-июнуна чейин активдүү' : 'Премиальная подписка активна до 1 июня 2027 г.'}
                    >
                      <Crown className="w-3 h-3 text-amber-300" />
                      <span>{lang === 'kg' ? 'VIP Премиум (до 2027)' : 'VIP Премиум (до 2027)'}</span>
                      <span className="text-[10px] text-amber-400 font-bold ml-0.5">★</span>
                    </div>
                  ) : isTrialPremium ? (
                    <div
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/25 text-amber-300 border border-amber-400/70 flex items-center gap-1.5 shrink-0 shadow-sm"
                      title={lang === 'kg' ? `Сыноо Премиум-мөөнөтү. Калган убакыт: ${subscriptionStatus.hoursRemainingInStage} саат ${subscriptionStatus.minutesRemainingInStage} мүнөт` : `Временный VIP Премиум-доступ на 24 часа. До окончания осталось: ${subscriptionStatus.hoursRemainingInStage} ч. ${subscriptionStatus.minutesRemainingInStage} мин.`}
                    >
                      <Clock className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                      <span>{lang === 'kg' ? `⏳ Пробный VIP: ${subscriptionStatus.hoursRemainingInStage}с ${subscriptionStatus.minutesRemainingInStage}м` : `⏳ Пробный VIP: ${subscriptionStatus.hoursRemainingInStage} ч ${subscriptionStatus.minutesRemainingInStage} мин`}</span>
                    </div>
                  ) : isPaidUserStandard ? (
                    <button
                      type="button"
                      onClick={() => setIsPlansModalOpen(true)}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:border-teal-400 transition-colors flex items-center gap-1 shrink-0 cursor-pointer active:scale-95 shadow-sm"
                      title="Нажмите, чтобы просмотреть тарифы"
                    >
                      <Zap className="w-3 h-3 text-teal-400" />
                      <span>{lang === 'kg' ? 'Жеткиликтүү (2027)' : 'Доступная (до 2027)'}</span>
                      <span className="text-[10px] text-teal-400 font-bold ml-0.5">★</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPlansModalOpen(true)}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/5 hover:bg-emerald-500/20 text-emerald-300/90 hover:text-emerald-300 border border-emerald-700/60 hover:border-emerald-400 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 shadow-xs"
                      title="Нажмите, чтобы открыть все доступные тарифы"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{lang === 'kg' ? 'Акысыз тариф' : 'Бесплатный тариф'}</span>
                      <span className="text-[10px] text-emerald-400">↑</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/70 font-medium truncate">
                {user.identifier}
              </p>
              {user.targetUniversity && (
                <div className="text-xs text-emerald-300 font-bold mt-1.5 inline-flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-1 rounded-xl w-fit max-w-full shadow-xs">
                  <School className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs leading-snug text-emerald-200 truncate">
                    {user.targetUniversity}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons (only edit profile & logout) - placed side-by-side on mobile */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0">
            <button
              onClick={() => {
                setEditName(user.name);
                setEditTargetScore(user.targetScore || 215);
                setEditUniversity(user.targetUniversity || '');
                setEditAvatar(user.avatar || '');
                setIsEditing(true);
              }}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-700/50 text-xs sm:text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
            >
              <Edit3 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.editProfile}</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-xs sm:text-sm font-bold text-rose-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
            >
              <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Panel Direct Access Card (for Master Administrator) */}
      {isAdmin && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c2f24] via-[#083526] to-[#122b1c] border-2 border-amber-400/80 p-5 sm:p-6 shadow-2xl shadow-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1 relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/60 shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-black text-white">Панель управления администратора</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  MASTER ADMIN
                </span>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Вы вошли как главный администратор ({user.identifier}). Вам доступно: выдача подписок любым пользователям, просмотр всех зарегистрированных учеников и результатов тестов, редактирование правильных ответов ОРТ.
              </p>
            </div>
          </div>

          <Link
            to="/admin"
            className="relative z-10 w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            <span>Открыть Админ-панель</span>
            <ArrowRight className="w-4 h-4 sm:w-4 sm:h-4 text-slate-950" />
          </Link>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#07241c] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-white">{t.editProfile}</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.savedSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Photo Upload Card */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
                id="profile-avatar-upload"
              />

              <div className="p-4 rounded-2xl bg-[#041a14] border border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer group shrink-0"
                    title={lang === 'kg' ? 'Галереядан же камерадан сүрөт жүктөө' : 'Загрузить фото из галереи или камеры'}
                  >
                    {editAvatar ? (
                      <img
                        src={editAvatar}
                        alt="Preview"
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md group-hover:scale-105 transition-transform">
                        {editName ? editName.charAt(0).toUpperCase() : 'У'}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md border border-[#041a14]">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                      {lang === 'kg' ? 'Профиль сүрөтү' : 'Фотография профиля'}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                      {editAvatar ? (lang === 'kg' ? 'Сүрөт тандалды' : 'Своё фото') : (lang === 'kg' ? 'Баштапкы монограмма' : 'Монограмма с инициалом')}
                    </p>
                    <span className="text-[11px] text-emerald-200/60 block truncate">
                      {isCompressingPhoto ? (lang === 'kg' ? 'Сүрөт кысылууда...' : 'Сжатие фото...') : (lang === 'kg' ? 'JPG, PNG, WEBP (авто-кысуу)' : 'JPG, PNG, WEBP из галереи')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <button
                    type="button"
                    disabled={isCompressingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isCompressingPhoto ? (lang === 'kg' ? 'Иштетилүүдө...' : 'Обработка...') : (lang === 'kg' ? 'Сүрөт жүктөө' : 'Загрузить фото')}</span>
                  </button>

                  {editAvatar && (
                    <button
                      type="button"
                      onClick={() => setEditAvatar('')}
                      className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 transition-colors cursor-pointer"
                      title={lang === 'kg' ? 'Сүрөттү өчүрүү' : 'Удалить фото и оставить инициал'}
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="ФИО / Имя ученика"
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Target Score Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-200">{t.targetScoreLabel}</label>
                  <span className="text-xs font-black text-amber-400">{editTargetScore} {t.points}</span>
                </div>
                <input
                  type="number"
                  min="110"
                  max="245"
                  required
                  value={editTargetScore}
                  onChange={(e) => setEditTargetScore(Number(e.target.value))}
                  placeholder="210"
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Target University Field */}
              <div className="w-full min-w-0">
                <label className="block text-xs font-bold text-slate-200 mb-1.5">{t.targetUniLabel}</label>
                <select
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="w-full max-w-full px-3 sm:px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-emerald-400 cursor-pointer truncate"
                >
                  <option value="" className="bg-[#031510] text-slate-400">
                    {t.selectUniPlaceholder}
                  </option>
                  {KYRGYZ_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni} className="bg-[#031510] text-white">
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 font-black text-xs text-slate-950 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
                >
                  {t.saveChanges}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3 Subscription Plans Modal */}
      {isPlansModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#05231a] border border-emerald-700/80 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-emerald-950 text-white max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsPlansModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'kg' ? 'Тарифтик пландар' : 'Тарифные планы'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {lang === 'kg' ? 'Даярдануу үчүн тарифти тандаңыз' : 'Выберите подходящий тариф'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/70">
                {lang === 'kg'
                  ? 'Сиз тандаган тариф дароо профилиңизге активдештирилет'
                  : 'Все тарифы действуют для комплексной подготовки к ОРТ'}
              </p>
            </div>

            {/* 3 Plans Grid (Matching Main Page Pricing Design) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch mb-6">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isKg = lang === 'kg';
                const isPremium = plan.id === 'premium';
                const isStandard = plan.id === 'standard';
                const isFree = plan.id === 'free';
                const isCurrent = (user.subscriptionPlan || 'free') === plan.id;
                const planName = isKg ? plan.nameKg : plan.name;
                const planPeriod = isKg ? plan.periodLabelKg : plan.periodLabel;
                const planPrice = isKg ? plan.priceLabelKg : plan.priceLabel;
                const planBadge = isKg ? plan.badgeKg : plan.badge;
                const planDesc = isKg ? plan.descriptionKg : plan.description;
                const features = isKg ? plan.featuresKg : plan.features;

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
                      isPremium
                        ? 'bg-gradient-to-b from-[#093527] to-[#041a14] border-2 border-amber-400/90 shadow-2xl shadow-amber-500/20 hover:border-amber-300'
                        : isStandard
                        ? 'bg-[#041a14] border-2 border-emerald-500/80 shadow-xl hover:border-emerald-400'
                        : 'bg-[#031510]/80 border border-slate-700/60 shadow-lg opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Top VIP Floating Badge for Premium */}
                    {isPremium && (
                      <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Crown className="w-3 h-3 text-slate-950" />
                        <span>VIP • {isKg ? 'Баары камтылган' : 'Все включено'}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Badge & Title */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isPremium
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                              : isStandard
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                              : 'bg-slate-800/80 text-slate-300 border-slate-700'
                          }`}
                        >
                          {planBadge}
                        </span>
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                            {isKg ? 'Учурдагы' : 'Текущий'}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">{planPeriod}</span>
                        )}
                      </div>

                      <div>
                        <h4
                          className={`text-lg sm:text-xl font-bold ${
                            isPremium ? 'text-amber-100' : isStandard ? 'text-emerald-100' : 'text-slate-200'
                          }`}
                        >
                          {planName}
                        </h4>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span
                            className={`text-2xl sm:text-3xl font-black ${
                              isPremium ? 'text-amber-300' : isStandard ? 'text-emerald-300' : 'text-slate-300'
                            }`}
                          >
                            {planPrice}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300/80 mt-1 leading-relaxed">{planDesc}</p>
                      </div>

                      {/* Features List */}
                      <div className="pt-3 border-t border-emerald-900/60 space-y-2">
                        {features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-tight">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                                isPremium
                                  ? 'text-amber-400'
                                  : isStandard
                                  ? 'text-emerald-400'
                                  : 'text-slate-400'
                              }`}
                            />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-5">
                      {isCurrent ? (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-emerald-300 font-bold text-xs text-center">
                          {isKg ? 'Сиздин активдүү тарифиңиз' : 'Ваш активный тариф'}
                        </div>
                      ) : isFree ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-slate-700/60 text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-default"
                        >
                          <Check className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isKg ? 'Базалык мүмкүнчүлүк' : 'Базовый доступ'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlanForCheckout(plan);
                          }}
                          className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                            isPremium
                              ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 hover:brightness-110 shadow-amber-500/30'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/30'
                          }`}
                        >
                          {isPremium ? (
                            <Crown className="w-3.5 h-3.5 text-slate-950" />
                          ) : (
                            <Zap className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isPremium
                              ? isKg
                                ? 'Премиум — 5 000 сом'
                                : 'Выбрать Премиум — 5 000 сом'
                              : isKg
                              ? 'Жеткиликтүү — 2 000 сом'
                              : 'Выбрать — 2 000 сом'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Note - 100% Secure & Transparent */}
            <div className="text-center pt-3 border-t border-emerald-900/60 text-xs text-emerald-200/80 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'kg'
                  ? 'Банк аркылуу төлөөдө баары ачык-айкын, расмий жана 100% коопсуз'
                  : 'Все операции и оплата проходят прозрачно, официально и на 100% безопасно'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Subscription Checkout Modal */}
      {selectedPlanForCheckout && (
        <SubscriptionModal
          plan={selectedPlanForCheckout}
          isOpen={Boolean(selectedPlanForCheckout)}
          onClose={() => {
            setSelectedPlanForCheckout(null);
            setIsPlansModalOpen(false);
          }}
          lang={lang}
        />
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-[#06261d] border border-emerald-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300/80">
              {t.testsCompleted}
            </span>
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{testsCount}</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#06261d] border border-emerald-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300/80">
              {t.bestScore}
            </span>
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {bestScore > 0 ? bestScore : '—'}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#06261d] border border-emerald-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300/80">
              {t.avgAccuracy}
            </span>
            <TrendingUp className="w-4 h-4 text-teal-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {avgAccuracy > 0 ? `${avgAccuracy}%` : '—'}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#06261d] border border-emerald-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300/80">
              {t.targetScore}
            </span>
            <Target className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-300">
            {user.targetScore || 215}
          </div>
        </div>
      </div>

      {/* Section Level Navigation Tabs: История тестов & Теории */}
      <div className="flex flex-wrap items-center justify-start gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => setActiveProfileTab('history')}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'history'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]'
              : 'bg-[#06261d] text-emerald-200/80 hover:text-white border border-emerald-800/70 hover:border-emerald-600'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t.historyTitle}</span>
          {history.length > 0 && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-black ${
                activeProfileTab === 'history'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
              }`}
            >
              {history.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveProfileTab('theories')}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeProfileTab === 'theories'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]'
              : 'bg-[#06261d] text-emerald-200/80 hover:text-white border border-emerald-800/70 hover:border-emerald-600'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{lang === 'kg' ? 'Теория' : 'Теория'}</span>
        </button>
      </div>

      {activeProfileTab === 'theories' ? (
        <TheoriesSection
          user={user}
          lang={lang}
          onOpenSubscriptionModal={(plan) => {
            setSelectedPlanForCheckout(plan || SUBSCRIPTION_PLANS[0]);
          }}
        />
      ) : (
        /* Test History Section */
        <div className="bg-[#06261d] border border-emerald-800/50 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-emerald-800/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'kg' ? 'Тесттер тарыхы' : 'История тестов'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{t.historyTitle}</span>
                {history.length > 0 && (
                  <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-xl border border-emerald-800/60">
                    {history.length}
                  </span>
                )}
              </h2>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 px-4 border border-dashed border-emerald-800/60 rounded-2xl">
              <BookOpen className="w-10 h-10 mx-auto text-emerald-600 mb-2.5 opacity-60" />
              <h4 className="text-base font-bold text-white mb-1">{t.noHistory}</h4>
              <p className="text-xs text-emerald-200/60 max-w-sm mx-auto mb-5">{t.noHistoryDesc}</p>
              <Link
                to="/test/1?mode=section&id=1"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
              >
                <span>{t.startTestBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(showAllHistory ? history : history.slice(0, 3)).map((record) => {
                const formattedDate = new Date(record.date).toLocaleDateString(
                  lang === 'kg' ? 'ky-KG' : 'ru-RU',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                );

                return (
                  <div
                    key={record.id}
                    className="bg-[#031510] border border-emerald-900/80 hover:border-emerald-700/90 rounded-2xl p-3.5 sm:p-4 transition-all space-y-2.5"
                  >
                    {/* Top Level: Test Title & Variant on Left, Subject Badge on the Right */}
                    <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        {/* Primary: Test Title (e.g. ЦООМО №1) */}
                        <h4 className="font-black text-sm sm:text-base text-white tracking-tight">
                          {getRecordTestName(record)}
                        </h4>

                        {/* Secondary: Variant Label */}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-emerald-300/80 border border-emerald-900/60">
                          {lang === 'kg' ? `Вариант ${record.variantId}` : `Вариант ${record.variantId}`}
                        </span>
                      </div>

                      {/* Subject badge on the same level to the right */}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 ml-auto sm:ml-0">
                        {getRecordSubjectName(record)}
                      </span>
                    </div>

                    {/* Bottom Level: Date & Stats on Left, Total Score on Right */}
                    <div className="flex items-center justify-between gap-3 border-t border-emerald-950/80 pt-2 text-xs text-emerald-200/60">
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
                          {formattedDate}
                        </span>
                        <span>
                          {t.accuracy}: <strong className="text-white">{record.accuracy}%</strong>
                        </span>
                        <span>
                          {lang === 'kg' ? 'Туура:' : 'Правильных:'}{' '}
                          <strong className="text-emerald-400">{record.correctAnswers}</strong>/{record.totalQuestions}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] uppercase font-bold text-emerald-300/70 block">
                          {t.score}
                        </span>
                        <span className="text-base sm:text-xl font-black text-amber-400">
                          {record.totalScore}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Show All / Collapse History Button */}
              {history.length > 3 && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllHistory((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span>
                      {showAllHistory
                        ? (lang === 'kg' ? 'Кыскартуу (3 тест)' : 'Свернуть историю')
                        : (lang === 'kg'
                            ? `Бардыгын көрүү (${history.length})`
                            : `Показать все (${history.length})`)}
                    </span>
                    {showAllHistory ? (
                      <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
