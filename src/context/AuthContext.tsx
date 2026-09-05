import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithGoogle as firebaseLoginWithGoogle, logoutFirebase } from '../firebase';

export interface UserTestRecord {
  id: string;
  variantId: string | number;
  testName?: string;
  subject?: string;
  title: string;
  date: string;
  mode: 'full' | 'custom' | 'section' | 'practice';
  totalScore: number;
  maxScore: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  userAnswers?: Record<number, string>;
  language?: 'ru' | 'kg';
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface UserProfile {
  id: string;
  name: string;
  identifier: string; // email or phone or telegram
  email?: string;
  phone?: string;
  telegramUsername?: string;
  telegramId?: number;
  authProvider?: 'google' | 'telegram' | 'email_code' | 'phone_code' | 'password';
  authProviders?: string[]; // e.g. ['google', 'email_code'] for synchronized users
  password: string;
  avatar?: string;
  targetScore: number;
  targetUniversity?: string;
  registeredAt: string;
  lastLoginAt?: string;
  testHistory: UserTestRecord[];
  subscriptionPlan?: 'free' | 'standard' | 'premium';
  subscriptionExpiry?: string;
  isPaid?: boolean;
  hasSeenWelcomeGift?: boolean;
  hasExtendedTrial?: boolean;
}

export type TrialStage = 'trial_premium' | 'trial_standard' | 'expired' | 'paid';

export interface UserSubscriptionStatus {
  effectivePlan: 'free' | 'standard' | 'premium';
  isPaid: boolean;
  trialStage: TrialStage;
  hoursRemainingInStage: number;
  minutesRemainingInStage: number;
  totalHoursElapsed: number;
  stageTitleRu: string;
  stageTitleKg: string;
  stageDescriptionRu: string;
  stageDescriptionKg: string;
  badgeLabelRu: string;
  badgeLabelKg: string;
}

export function computeSubscriptionStatus(user: UserProfile | null): UserSubscriptionStatus {
  if (!user) {
    return {
      effectivePlan: 'free',
      isPaid: false,
      trialStage: 'expired',
      hoursRemainingInStage: 0,
      minutesRemainingInStage: 0,
      totalHoursElapsed: 999,
      stageTitleRu: 'Гостевой доступ',
      stageTitleKg: 'Конок режими',
      stageDescriptionRu: 'Зарегистрируйтесь, чтобы получить 24 часа бесплатной Премиальной подписки!',
      stageDescriptionKg: '24 сааттык акысыз Премиум жазылууну алуу үчүн катталыңыз!',
      badgeLabelRu: 'Бесплатный',
      badgeLabelKg: 'Акысыз',
    };
  }

  // Admin user always has full VIP Premium access
  const isMasterAdmin =
    Boolean(user?.identifier && user.identifier.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase());

  if (isMasterAdmin) {
    return {
      effectivePlan: 'premium',
      isPaid: true,
      trialStage: 'paid',
      hoursRemainingInStage: 9999,
      minutesRemainingInStage: 0,
      totalHoursElapsed: 0,
      stageTitleRu: 'Премиальная подписка (Администратор)',
      stageTitleKg: 'Премиум жазылуу (Администратор)',
      stageDescriptionRu: 'Полный неограниченный доступ администратора активен до 1 июня 2027 года.',
      stageDescriptionKg: 'Администратордун чексиз толук мүмкүнчүлүгү 2027-жылдын 1-июнуна чейин активдүү.',
      badgeLabelRu: 'VIP Премиум (Админ)',
      badgeLabelKg: 'VIP Премиум (Админ)',
    };
  }

  // If user paid for permanent plan (or is explicitly set as paid)
  if (user.isPaid && user.subscriptionPlan && user.subscriptionPlan !== 'free') {
    const isPrem = user.subscriptionPlan === 'premium';
    return {
      effectivePlan: user.subscriptionPlan,
      isPaid: true,
      trialStage: 'paid',
      hoursRemainingInStage: 9999,
      minutesRemainingInStage: 0,
      totalHoursElapsed: 0,
      stageTitleRu: isPrem ? 'Премиальная подписка' : 'Доступная подписка',
      stageTitleKg: isPrem ? 'Премиум жазылуу' : 'Жеткиликтүү жазылуу',
      stageDescriptionRu: 'Подписка активна до 1 июня 2027 года.',
      stageDescriptionKg: 'Жазылуу 2027-жылдын 1-июнуна чейин активдүү.',
      badgeLabelRu: isPrem ? 'VIP Премиум (до 2027)' : 'Доступный (до 2027)',
      badgeLabelKg: isPrem ? 'VIP Премиум (2027-ж. чейин)' : 'Жеткиликтүү (2027-ж. чейин)',
    };
  }

  // Trial timeline based on registration timestamp:
  const regTimestamp = user.registeredAt ? new Date(user.registeredAt).getTime() : Date.now();
  const msPassed = Math.max(0, Date.now() - regTimestamp);
  const totalHoursElapsed = msPassed / (1000 * 60 * 60);

  // 1. 0 - 24 hours -> VIP Premium trial (24 hours)
  if (totalHoursElapsed < 24) {
    const msRemaining = Math.max(0, 24 * 60 * 60 * 1000 - msPassed);
    const hoursRemainingInStage = Math.floor(msRemaining / (1000 * 60 * 60));
    const minutesRemainingInStage = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return {
      effectivePlan: 'premium',
      isPaid: false,
      trialStage: 'trial_premium',
      hoursRemainingInStage,
      minutesRemainingInStage,
      totalHoursElapsed,
      stageTitleRu: 'Временный VIP Премиум-доступ (24 часа)',
      stageTitleKg: 'Убактылуу VIP Премиум-мүмкүнчүлүк (24 саат)',
      stageDescriptionRu: `Вам предоставлен временный VIP Премиум-доступ на 24 часа. До окончания осталось: ${hoursRemainingInStage} ч. ${minutesRemainingInStage} мин.`,
      stageDescriptionKg: `Сизге 24 сааттык убактылуу VIP Премиум-мүмкүнчүлүк берилди. Калган убакыт: ${hoursRemainingInStage} саат ${minutesRemainingInStage} мүнөт.`,
      badgeLabelRu: `⏳ Премиум: ${hoursRemainingInStage}ч ${minutesRemainingInStage}м`,
      badgeLabelKg: `⏳ Премиум: ${hoursRemainingInStage}с ${minutesRemainingInStage}м`,
    };
  }

  // 2. Expired trial -> Free plan (after 24 hours)
  return {
    effectivePlan: 'free',
    isPaid: false,
    trialStage: 'expired',
    hoursRemainingInStage: 0,
    minutesRemainingInStage: 0,
    totalHoursElapsed,
    stageTitleRu: 'Бесплатный тариф (Пробный период завершен)',
    stageTitleKg: 'Акысыз тариф (Сыноо мөөнөтү бүттү)',
    stageDescriptionRu: 'Ваш бесплатный 24-часовой пробный период завершен. Оформите «Доступную» или «Премиальную» подписку для продолжения полной подготовки.',
    stageDescriptionKg: 'Сиздин акысыз 24 сааттык сыноо мөөнөтүңүз аяктады. Толук даярданууну улантуу үчүн «Жеткиликтүү» же «Премиум» жазылууну тандаңыз.',
    badgeLabelRu: 'Бесплатный',
    badgeLabelKg: 'Акысыз',
  };
}

export const ADMIN_EMAIL = 'mady1baevv@kyrgyzakylman.com';

const DEFAULT_ADMIN_PROFILE: UserProfile = {
  id: 'admin_mady1baevv',
  name: 'Абдраим Мадылбаев (Администратор)',
  identifier: ADMIN_EMAIL,
  email: ADMIN_EMAIL,
  telegramUsername: '@mady1baevv',
  authProvider: 'google',
  authProviders: ['google', 'email_code', 'telegram', 'password'],
  password: '123',
  avatar: '/avatars/snow_leopard.svg',
  targetScore: 240,
  targetUniversity: 'Кыргызский национальный университет (КНУ)',
  registeredAt: '2025-01-01T00:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
  testHistory: [
    {
      id: 'rec_admin_1',
      variantId: 1,
      testName: 'ЦООМО №1',
      subject: 'Математика',
      title: 'ЦООМО №1',
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      mode: 'section',
      totalScore: 238,
      maxScore: 245,
      accuracy: 97,
      correctAnswers: 29,
      totalQuestions: 30,
    },
  ],
  subscriptionPlan: 'premium',
  subscriptionExpiry: '2027-06-01',
  isPaid: true,
  hasSeenWelcomeGift: true,
};

const SEED_USERS: UserProfile[] = [
  DEFAULT_ADMIN_PROFILE,
  {
    id: 'user_seed_google',
    name: 'Айпери Касымова',
    identifier: 'aiperi.kasymova@gmail.com',
    email: 'aiperi.kasymova@gmail.com',
    authProvider: 'google',
    authProviders: ['google'],
    password: '',
    avatar: '/avatars/argali.svg',
    targetScore: 225,
    targetUniversity: 'КГТУ им. И. Раззакова (Политех)',
    registeredAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    testHistory: [
      {
        id: 'rec_s1',
        variantId: 1,
        testName: 'ЦООМО №1',
        subject: 'Математика',
        title: 'ЦООМО №1',
        date: new Date(Date.now() - 3600000 * 12).toISOString(),
        mode: 'section',
        totalScore: 212,
        maxScore: 245,
        accuracy: 86,
        correctAnswers: 26,
        totalQuestions: 30,
      },
    ],
    subscriptionPlan: 'standard',
    subscriptionExpiry: '2027-06-01',
    isPaid: true,
    hasSeenWelcomeGift: true,
  },
  {
    id: 'user_seed_sync',
    name: 'Эркин Бакиров',
    identifier: 'erkin.bakirov@gmail.com',
    email: 'erkin.bakirov@gmail.com',
    authProvider: 'google',
    authProviders: ['google', 'email_code'], // Synchronized Google & 6-digit Code!
    password: '',
    avatar: '/avatars/snow_leopard.svg',
    targetScore: 232,
    targetUniversity: 'АУЦА (Американский университет в ЦА)',
    registeredAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    testHistory: [
      {
        id: 'rec_s_sync',
        variantId: 2,
        testName: 'ЦООМО №2',
        subject: 'Математика',
        title: 'ЦООМО №2',
        date: new Date(Date.now() - 3600000 * 8).toISOString(),
        mode: 'section',
        totalScore: 224,
        maxScore: 245,
        accuracy: 91,
        correctAnswers: 27,
        totalQuestions: 30,
      },
    ],
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2027-06-01',
    isPaid: true,
    hasSeenWelcomeGift: true,
  },
  {
    id: 'user_seed_tg',
    name: 'Азамат Темиров',
    identifier: '@azamat_ort',
    telegramUsername: '@azamat_ort',
    telegramId: 894021482,
    authProvider: 'telegram',
    authProviders: ['telegram'],
    password: '',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    targetScore: 220,
    targetUniversity: 'КНУ им. Ж. Баласагына',
    registeredAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    testHistory: [],
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2027-06-01',
    isPaid: true,
    hasSeenWelcomeGift: true,
  },
  {
    id: 'user_seed_code',
    name: 'Чынгыз Айтматов',
    identifier: 'chyngyz.student@yandex.ru',
    email: 'chyngyz.student@yandex.ru',
    authProvider: 'email_code',
    authProviders: ['email_code'],
    password: '',
    avatar: '/avatars/argali.svg',
    targetScore: 218,
    targetUniversity: 'КГТУ им. И. Раззакова',
    registeredAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    testHistory: [],
    subscriptionPlan: 'standard',
    subscriptionExpiry: '2027-06-01',
    isPaid: true,
    hasSeenWelcomeGift: true,
  },
  {
    id: 'user_seed_phone',
    name: 'Бектур Сулайманов',
    identifier: '+996700123456',
    phone: '+996700123456',
    authProvider: 'phone_code',
    authProviders: ['phone_code'],
    password: '123',
    avatar: '/avatars/golden_eagle.svg',
    targetScore: 230,
    targetUniversity: 'АУЦА (Американский университет в ЦА)',
    registeredAt: new Date(Date.now() - 3600000 * 70).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    testHistory: [
      {
        id: 'rec_s2',
        variantId: 2,
        testName: 'ЦООМО №2',
        subject: 'Математика',
        title: 'ЦООМО №2',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
        mode: 'section',
        totalScore: 228,
        maxScore: 245,
        accuracy: 93,
        correctAnswers: 28,
        totalQuestions: 30,
      },
    ],
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2027-06-01',
    isPaid: true,
    hasSeenWelcomeGift: true,
  },
  {
    id: 'user_seed_email_pass',
    name: 'Нурайым Абдыкадырова',
    identifier: 'nurayim.abdyk@mail.ru',
    email: 'nurayim.abdyk@mail.ru',
    authProvider: 'password',
    authProviders: ['password'],
    password: '123',
    avatar: '/avatars/kyrgyz_horse.svg',
    targetScore: 210,
    targetUniversity: 'КГМА им. И. Ахунбаева (Медакадемия)',
    registeredAt: new Date(Date.now() - 3600000 * 90).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    testHistory: [],
    subscriptionPlan: 'free',
    subscriptionExpiry: '2027-06-01',
    isPaid: false,
    hasSeenWelcomeGift: true,
  },
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVip: boolean;
  isPremium: boolean;
  isTrial: boolean;
  subscriptionStatus: UserSubscriptionStatus;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isTrialWelcomeOpen: boolean;
  openTrialWelcomeModal: () => void;
  closeTrialWelcomeModal: () => void;
  login: (identifier: string, pass: string) => { success: boolean; error?: string };
  register: (name: string, identifier: string, pass: string) => { success: boolean; error?: string };
  loginWithCode: (identifier: string, name?: string) => { success: boolean; error?: string };
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithTelegram: (telegramUserOrUsername?: string | TelegramUser, name?: string) => { success: boolean; error?: string };
  loginWithWhatsApp: (phoneOrUsername?: string, name?: string) => { success: boolean; error?: string };
  extendTrial: () => { success: boolean; error?: string };
  logout: () => void;
  resetPassword: (identifier: string, newPass: string) => { success: boolean; error?: string };
  updateProfile: (data: Partial<UserProfile>) => void;
  saveTestResult: (result: Omit<UserTestRecord, 'id' | 'date'>) => void;
  // Admin Methods
  adminGetAllUsers: () => UserProfile[];
  adminSetUserSubscription: (
    userId: string,
    plan: 'free' | 'standard' | 'premium',
    isPaid: boolean,
    expiry?: string
  ) => void;
  adminUpdateUser: (userId: string, data: Partial<UserProfile>) => void;
  adminDeleteUser: (userId: string) => void;
  adminResetTrial: (userId: string) => void;
  adminCreateUser: (userData: Omit<UserProfile, 'id' | 'testHistory'>) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'ort_registered_users_v2';
const CURRENT_USER_KEY = 'ort_current_user_v2';

export const deduplicateUsers = (usersList: UserProfile[]): UserProfile[] => {
  if (!Array.isArray(usersList)) return [DEFAULT_ADMIN_PROFILE];

  const result: UserProfile[] = [];
  const seenIds = new Set<string>();
  let adminAdded = false;

  for (const u of usersList) {
    if (!u) continue;
    const rawIdentifier = (u.identifier || '').trim();
    const lowerIdentifier = rawIdentifier.toLowerCase();
    const email = (u.email || (rawIdentifier.includes('@') && !rawIdentifier.startsWith('@') ? rawIdentifier : '')).trim().toLowerCase();

    const isAdmin =
      u.id === 'admin_mady1baevv' ||
      lowerIdentifier === ADMIN_EMAIL.toLowerCase() ||
      email === ADMIN_EMAIL.toLowerCase() ||
      lowerIdentifier === '@mady1baevv' ||
      lowerIdentifier === '@kyrgyzakylman';

    if (isAdmin) {
      if (adminAdded) {
        continue;
      }
      adminAdded = true;
      seenIds.add('admin_mady1baevv');

      result.unshift({
        ...DEFAULT_ADMIN_PROFILE,
        ...u,
        id: 'admin_mady1baevv',
        identifier: ADMIN_EMAIL,
        email: ADMIN_EMAIL,
        authProviders: Array.from(new Set([...(u.authProviders || []), 'google', 'email_code', 'telegram'])),
        subscriptionPlan: 'premium',
        isPaid: true,
        subscriptionExpiry: '2027-06-01',
      });
      continue;
    }

    // Check if this user shares an email or identifier with an already processed user (e.g. Google auth + 6-digit code)
    const existingIndex = result.findIndex((r) => {
      const rEmail = (r.email || (r.identifier?.includes('@') && !r.identifier.startsWith('@') ? r.identifier : '')).toLowerCase();
      if (email && rEmail && email === rEmail) return true;
      if (lowerIdentifier && r.identifier?.toLowerCase() === lowerIdentifier) return true;
      return false;
    });

    if (existingIndex !== -1) {
      // Merge into the existing synchronized profile!
      const existing = result[existingIndex];
      const mergedProviders = Array.from(
        new Set([
          ...(existing.authProviders || (existing.authProvider ? [existing.authProvider] : [])),
          ...(u.authProviders || (u.authProvider ? [u.authProvider] : [])),
        ])
      );

      result[existingIndex] = {
        ...existing,
        ...u,
        id: existing.id,
        identifier: existing.identifier || u.identifier,
        email: existing.email || u.email || (email || undefined),
        name:
          existing.name && existing.name !== 'Ученик' && !existing.name.startsWith('Ученик (')
            ? existing.name
            : u.name || existing.name,
        avatar: existing.avatar && !existing.avatar.includes('snow_leopard.svg') ? existing.avatar : u.avatar || existing.avatar,
        authProviders: mergedProviders,
        authProvider: existing.authProvider || u.authProvider,
        isPaid: existing.isPaid || u.isPaid,
        subscriptionPlan:
          existing.subscriptionPlan === 'premium' || u.subscriptionPlan === 'premium'
            ? 'premium'
            : existing.subscriptionPlan === 'standard' || u.subscriptionPlan === 'standard'
            ? 'standard'
            : existing.subscriptionPlan || u.subscriptionPlan || 'free',
        testHistory: [...(existing.testHistory || []), ...(u.testHistory || [])].filter(
          (test, i, arr) => arr.findIndex((t) => t.id === test.id) === i
        ),
      };
      continue;
    }

    let uid = u.id ? String(u.id).trim() : '';
    if (!uid || seenIds.has(uid) || uid === 'admin_mady1baevv') {
      uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    seenIds.add(uid);

    // Infer auth provider if missing
    let inferredProvider = u.authProvider;
    if (!inferredProvider) {
      if (lowerIdentifier.startsWith('@') || uid.startsWith('tg_')) {
        inferredProvider = 'telegram';
      } else if (lowerIdentifier.startsWith('+')) {
        inferredProvider = 'phone_code';
      } else if (lowerIdentifier.includes('@')) {
        inferredProvider = 'email_code';
      } else {
        inferredProvider = 'password';
      }
    }

    const providers = u.authProviders && u.authProviders.length > 0 ? u.authProviders : [inferredProvider];

    result.push({
      ...u,
      id: uid,
      authProvider: inferredProvider,
      authProviders: providers,
      email: u.email || (rawIdentifier.includes('@') && !rawIdentifier.startsWith('@') ? rawIdentifier : undefined),
    });
  }

  if (!adminAdded) {
    result.unshift(DEFAULT_ADMIN_PROFILE);
  }

  return result;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem('user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.identifier?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          return {
            ...parsed,
            id: 'admin_mady1baevv',
            subscriptionPlan: 'premium',
            isPaid: true,
            subscriptionExpiry: '2027-06-01',
          };
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTrialWelcomeOpen, setIsTrialWelcomeOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Live timer tick every 30 seconds for accurate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Ensure default seed users exist and are cleanly deduplicated in localStorage
  useEffect(() => {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        const initial = deduplicateUsers(SEED_USERS);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      } else {
        const parsed = JSON.parse(existing);
        const clean = deduplicateUsers(parsed);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
      }
    } catch {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(deduplicateUsers(SEED_USERS)));
    }
  }, []);

  const subscriptionStatus = computeSubscriptionStatus(user);

  const getUsers = (): UserProfile[] => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      if (!users) {
        const initial = deduplicateUsers(SEED_USERS);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(users);
      const clean = deduplicateUsers(parsed);
      if (clean.length !== parsed.length) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
      }
      return clean;
    } catch {
      return deduplicateUsers(SEED_USERS);
    }
  };

  const saveUsers = (users: UserProfile[]) => {
    const clean = deduplicateUsers(users);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(clean));
  };

  const login = (identifier: string, pass: string) => {
    const trimmedId = identifier.trim().toLowerCase();

    // Special auto-login for Admin
    if (trimmedId === ADMIN_EMAIL.toLowerCase() || trimmedId === '@mady1baevv' || trimmedId === '@kyrgyzakylman') {
      const adminProfile = {
        ...DEFAULT_ADMIN_PROFILE,
        name: user?.name || DEFAULT_ADMIN_PROFILE.name,
      };
      setUser(adminProfile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminProfile));

      const users = getUsers().filter(
        (u) => u.id !== 'admin_mady1baevv' && u.identifier.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()
      );
      users.unshift(adminProfile);
      saveUsers(users);
      return { success: true };
    }

    const users = getUsers();
    const found = users.find(
      (u) => u.identifier.trim().toLowerCase() === trimmedId && u.password === pass
    );

    if (!found) {
      return { success: false, error: 'Неверный логин или пароль' };
    }

    setUser(found);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    return { success: true };
  };

  const register = (name: string, identifier: string, pass: string) => {
    const trimmedId = identifier.trim().toLowerCase();
    const isAdminAccount = trimmedId === ADMIN_EMAIL.toLowerCase();

    const users = getUsers();
    const exists = users.some((u) => u.identifier.trim().toLowerCase() === trimmedId);

    if (exists && !isAdminAccount) {
      return { success: false, error: 'Пользователь с такими данными уже зарегистрирован' };
    }

    const newUser: UserProfile = {
      id: isAdminAccount ? 'admin_mady1baevv' : 'user_' + Date.now(),
      name: name.trim() || (isAdminAccount ? 'Абдраим Мадылбаев' : 'Ученик'),
      identifier: identifier.trim(),
      password: pass,
      avatar: '/avatars/snow_leopard.svg',
      targetScore: isAdminAccount ? 240 : 215,
      targetUniversity: 'КНУ им. Ж. Баласагына — Кыргызский национальный университет',
      registeredAt: new Date().toISOString(),
      testHistory: [],
      subscriptionPlan: isAdminAccount ? 'premium' : 'free',
      subscriptionExpiry: '2027-06-01',
      isPaid: isAdminAccount,
      hasSeenWelcomeGift: false,
    };

    const updated = users.filter((u) => u.identifier.trim().toLowerCase() !== trimmedId);
    updated.unshift(newUser);
    saveUsers(updated);
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    if (!isAdminAccount) {
      setIsTrialWelcomeOpen(true);
    }
    return { success: true };
  };

  const resetPassword = (identifier: string, newPass: string) => {
    const trimmedId = identifier.trim().toLowerCase();
    const users = getUsers();
    const idx = users.findIndex((u) => u.identifier.trim().toLowerCase() === trimmedId);

    if (idx === -1) {
      return { success: false, error: 'Пользователь с таким email/телефоном не найден' };
    }

    users[idx].password = newPass;
    saveUsers(users);

    if (user && user.identifier.trim().toLowerCase() === trimmedId) {
      const updatedUser = { ...user, password: newPass };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    return { success: true };
  };

  const loginWithCode = (identifier: string, name?: string) => {
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      return { success: false, error: 'Укажите номер телефона или email' };
    }

    const isEmail = trimmedId.includes('@');
    const normalizedEmail = isEmail ? trimmedId.toLowerCase() : '';
    const isAdminAccount = trimmedId.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const users = getUsers();

    // Match by email if email, or by identifier if phone/other
    const existingIndex = users.findIndex((u) => {
      if (isEmail) {
        const uIdent = (u.identifier || '').trim().toLowerCase();
        const uEmail = (u.email || '').trim().toLowerCase();
        return uIdent === normalizedEmail || uEmail === normalizedEmail;
      }
      return (u.identifier || '').trim().toLowerCase() === trimmedId.toLowerCase();
    });

    if (existingIndex !== -1) {
      const existing = users[existingIndex];
      const currentProviders = existing.authProviders || (existing.authProvider ? [existing.authProvider] : []);
      const updatedProviders = Array.from(
        new Set([...currentProviders, isEmail ? 'email_code' : 'phone_code'])
      );

      const updatedUser: UserProfile = {
        ...existing,
        identifier: isEmail ? normalizedEmail : existing.identifier,
        ...(isEmail ? { email: normalizedEmail } : {}),
        name:
          name && name.trim() && (!existing.name || existing.name === 'Ученик' || existing.name.startsWith('Ученик ('))
            ? name.trim()
            : existing.name,
        authProvider: existing.authProvider || (isEmail ? 'email_code' : 'phone_code'),
        authProviders: updatedProviders,
        lastLoginAt: new Date().toISOString(),
        ...(isAdminAccount
          ? { subscriptionPlan: 'premium', isPaid: true, subscriptionExpiry: '2027-06-01' }
          : {}),
      };

      users[existingIndex] = updatedUser;
      saveUsers(users);
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } else {
      // Auto-register new student via phone or email code
      const newUser: UserProfile = {
        id: isAdminAccount ? 'admin_mady1baevv' : 'user_' + Date.now(),
        name:
          name?.trim() ||
          (isEmail ? normalizedEmail.split('@')[0] : 'Ученик (' + trimmedId.slice(-4) + ')'),
        identifier: isEmail ? normalizedEmail : trimmedId,
        email: isEmail ? normalizedEmail : undefined,
        password: '',
        avatar: '/avatars/snow_leopard.svg',
        authProvider: isEmail ? 'email_code' : 'phone_code',
        authProviders: [isEmail ? 'email_code' : 'phone_code'],
        targetScore: isAdminAccount ? 240 : 215,
        targetUniversity: 'КНУ им. Ж. Баласагына — Кыргызский национальный университет',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        testHistory: [],
        subscriptionPlan: isAdminAccount ? 'premium' : 'free',
        subscriptionExpiry: '2027-06-01',
        isPaid: isAdminAccount,
        hasSeenWelcomeGift: false,
      };

      const filtered = users.filter((u) => {
        if (isEmail) {
          return (
            (u.identifier || '').trim().toLowerCase() !== normalizedEmail &&
            (u.email || '').trim().toLowerCase() !== normalizedEmail
          );
        }
        return (u.identifier || '').trim().toLowerCase() !== trimmedId.toLowerCase();
      });
      filtered.unshift(newUser);
      saveUsers(filtered);
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem('user', JSON.stringify(newUser));
      if (!isAdminAccount) {
        setIsTrialWelcomeOpen(true);
      }
      return { success: true };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await firebaseLoginWithGoogle();
      if (result.error) {
        return { success: false, error: result.error };
      }
      if (!result.user) {
        return { success: false, error: 'Пользователь Google не найден' };
      }

      const email = (result.user.email || '').trim().toLowerCase();
      const displayName = result.user.displayName || 'Ученик Google';
      const photoURL = result.user.photoURL || '/avatars/snow_leopard.svg';
      const isAdminAccount = email === ADMIN_EMAIL.toLowerCase();

      const users = getUsers();
      const existingIndex = users.findIndex(
        (u) =>
          (u.identifier && u.identifier.trim().toLowerCase() === email) ||
          (u.email && u.email.trim().toLowerCase() === email)
      );

      if (existingIndex !== -1) {
        const existing = users[existingIndex];
        const currentProviders = existing.authProviders || (existing.authProvider ? [existing.authProvider] : []);
        const updatedProviders = Array.from(new Set([...currentProviders, 'google']));

        const updatedUser: UserProfile = {
          ...existing,
          email: email,
          identifier: existing.identifier || email,
          name:
            existing.name && existing.name !== 'Ученик' && !existing.name.startsWith('Ученик (')
              ? existing.name
              : displayName || existing.name,
          avatar: photoURL || existing.avatar,
          authProvider: existing.authProvider || 'google',
          authProviders: updatedProviders,
          lastLoginAt: new Date().toISOString(),
          ...(isAdminAccount
            ? { subscriptionPlan: 'premium', isPaid: true, subscriptionExpiry: '2027-06-01' }
            : {}),
        };

        users[existingIndex] = updatedUser;
        saveUsers(users);
        setUser(updatedUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        const newUser: UserProfile = {
          id: isAdminAccount ? 'admin_mady1baevv' : 'user_' + Date.now(),
          name: displayName,
          identifier: email,
          email: email,
          password: '',
          avatar: photoURL,
          authProvider: 'google',
          authProviders: ['google'],
          targetScore: isAdminAccount ? 240 : 215,
          targetUniversity: 'КНУ им. Ж. Баласагына — Кыргызский национальный университет',
          registeredAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          testHistory: [],
          subscriptionPlan: isAdminAccount ? 'premium' : 'free',
          subscriptionExpiry: '2027-06-01',
          isPaid: isAdminAccount,
          hasSeenWelcomeGift: false,
        };

        const filtered = users.filter(
          (u) =>
            (u.identifier || '').trim().toLowerCase() !== email &&
            (u.email || '').trim().toLowerCase() !== email
        );
        filtered.unshift(newUser);
        saveUsers(filtered);
        setUser(newUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        localStorage.setItem('user', JSON.stringify(newUser));
        if (!isAdminAccount) {
          setIsTrialWelcomeOpen(true);
        }
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Ошибка авторизации через Google' };
    }
  };

  const loginWithTelegram = (telegramUserOrUsername?: string | TelegramUser, name?: string) => {
    let cleanUsername = '';
    let displayName = '';
    let avatarUrl = '/avatars/snow_leopard.svg';
    let telegramId: number | undefined;

    if (typeof telegramUserOrUsername === 'object' && telegramUserOrUsername !== null) {
      telegramId = telegramUserOrUsername.id;
      if (telegramUserOrUsername.username) {
        cleanUsername = telegramUserOrUsername.username.startsWith('@')
          ? telegramUserOrUsername.username
          : '@' + telegramUserOrUsername.username;
      } else {
        cleanUsername = `@tg_${telegramUserOrUsername.id}`;
      }
      displayName =
        [telegramUserOrUsername.first_name, telegramUserOrUsername.last_name]
          .filter(Boolean)
          .join(' ')
          .trim() || cleanUsername;
      if (telegramUserOrUsername.photo_url) {
        avatarUrl = telegramUserOrUsername.photo_url;
      }
    } else {
      const raw = String(telegramUserOrUsername || '').trim();
      if (!raw) {
        cleanUsername = '@student_' + Math.floor(1000 + Math.random() * 9000);
      } else {
        cleanUsername = raw.startsWith('@') ? raw : '@' + raw;
      }
      displayName = name?.trim() || (raw ? cleanUsername : 'Ученик Telegram');
    }

    const isAdminAccount =
      cleanUsername.toLowerCase() === '@mady1baevv' ||
      cleanUsername.toLowerCase() === '@kyrgyzakylman' ||
      (telegramId !== undefined && telegramId === 853874930794);

    const users = getUsers();
    const existingIndex = users.findIndex(
      (u) =>
        (u.identifier && u.identifier.trim().toLowerCase() === cleanUsername.toLowerCase()) ||
        (telegramId !== undefined && (u.telegramId === telegramId || u.id === `tg_${telegramId}`))
    );

    if (existingIndex !== -1) {
      const existing = users[existingIndex];
      const currentProviders = existing.authProviders || (existing.authProvider ? [existing.authProvider] : []);
      const updatedProviders = Array.from(new Set([...currentProviders, 'telegram']));

      const updatedUser: UserProfile = {
        ...existing,
        name: displayName || existing.name,
        telegramUsername: cleanUsername,
        telegramId: telegramId || existing.telegramId,
        avatar: avatarUrl !== '/avatars/snow_leopard.svg' ? avatarUrl : existing.avatar,
        authProvider: existing.authProvider || 'telegram',
        authProviders: updatedProviders,
        lastLoginAt: new Date().toISOString(),
        ...(isAdminAccount
          ? { subscriptionPlan: 'premium', isPaid: true, subscriptionExpiry: '2027-06-01' }
          : {}),
      };
      users[existingIndex] = updatedUser;
      saveUsers(users);
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } else {
      const newUser: UserProfile = {
        id: isAdminAccount ? 'admin_mady1baevv' : telegramId ? `tg_${telegramId}` : 'user_' + Date.now(),
        name: displayName,
        identifier: cleanUsername,
        telegramUsername: cleanUsername,
        telegramId: telegramId,
        authProvider: 'telegram',
        authProviders: ['telegram'],
        password: '',
        avatar: avatarUrl,
        targetScore: isAdminAccount ? 240 : 215,
        targetUniversity: 'КНУ им. Ж. Баласагына — Кыргызский национальный университет',
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        testHistory: [],
        subscriptionPlan: isAdminAccount ? 'premium' : 'free',
        subscriptionExpiry: '2027-06-01',
        isPaid: isAdminAccount,
        hasSeenWelcomeGift: false,
      };

      const filtered = users.filter(
        (u) =>
          (u.identifier || '').trim().toLowerCase() !== cleanUsername.toLowerCase() &&
          !(telegramId !== undefined && (u.telegramId === telegramId || u.id === `tg_${telegramId}`))
      );
      filtered.unshift(newUser);
      saveUsers(filtered);
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem('user', JSON.stringify(newUser));
      if (!isAdminAccount) {
        setIsTrialWelcomeOpen(true);
      }
      return { success: true };
    }
  };

  const loginWithWhatsApp = (phoneOrUsername?: string, name?: string) => {
    let cleanPhone = String(phoneOrUsername || '').trim();
    if (!cleanPhone) {
      cleanPhone = '+99670' + Math.floor(1000000 + Math.random() * 9000000);
    }
    const displayName = name?.trim() || 'Ученик WhatsApp';
    const avatarUrl = '/avatars/snow_leopard.svg';

    const users = getUsers();
    const existing = users.find(
      (u) => u.identifier.trim().toLowerCase() === cleanPhone.toLowerCase()
    );

    if (existing) {
      const updatedUser: UserProfile = {
        ...existing,
        name: displayName || existing.name,
      };
      const updatedUsers = users.map((u) =>
        u.id === existing.id || u.identifier.trim().toLowerCase() === cleanPhone.toLowerCase()
          ? updatedUser
          : u
      );
      saveUsers(updatedUsers);
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } else {
      const newUser: UserProfile = {
        id: 'user_' + Date.now(),
        name: displayName,
        identifier: cleanPhone,
        password: '',
        avatar: avatarUrl,
        targetScore: 215,
        targetUniversity: 'КНУ им. Ж. Баласагына — Кыргызский национальный университет',
        registeredAt: new Date().toISOString(),
        testHistory: [],
        subscriptionPlan: 'free',
        subscriptionExpiry: '2027-06-01',
        isPaid: false,
        hasSeenWelcomeGift: false,
      };

      const filtered = users.filter(
        (u) => u.identifier.trim().toLowerCase() !== cleanPhone.toLowerCase()
      );
      filtered.unshift(newUser);
      saveUsers(filtered);
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsTrialWelcomeOpen(true);
      return { success: true };
    }
  };

  const extendTrial = () => {
    if (!user) {
      return { success: false, error: 'Сначала необходимо войти в аккаунт' };
    }
    const updatedUser: UserProfile = {
      ...user,
      registeredAt: new Date().toISOString(),
      subscriptionPlan: 'free',
      isPaid: false,
      hasExtendedTrial: true,
      hasSeenWelcomeGift: false,
    };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    localStorage.setItem('user', JSON.stringify(updatedUser));

    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      saveUsers(users);
    }
    setIsTrialWelcomeOpen(true);
    return { success: true };
  };

  const logout = () => {
    logoutFirebase();
    setUser(null);
    setIsTrialWelcomeOpen(false);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('user');
    try {
      sessionStorage.clear();
    } catch {}
    // Cleanly redirect and reload the site to instantly remove all member-accessible elements
    window.location.href = '/';
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser: UserProfile = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      saveUsers(users);
    }
  };

  const openTrialWelcomeModal = () => {
    setIsTrialWelcomeOpen(true);
  };

  const closeTrialWelcomeModal = () => {
    setIsTrialWelcomeOpen(false);
    if (user && !user.hasSeenWelcomeGift) {
      updateProfile({ hasSeenWelcomeGift: true });
    }
  };

  const saveTestResult = (result: Omit<UserTestRecord, 'id' | 'date'>) => {
    const newRecord: UserTestRecord = {
      ...result,
      id: 'rec_' + Date.now(),
      date: new Date().toISOString(),
    };

    if (user) {
      const updatedHistory = [newRecord, ...(user.testHistory || [])];
      updateProfile({ testHistory: updatedHistory });
    } else {
      // For guests, also persist locally
      try {
        const guestHistory = JSON.parse(localStorage.getItem('ort_guest_history') || '[]');
        localStorage.setItem(
          'ort_guest_history',
          JSON.stringify([newRecord, ...guestHistory].slice(0, 20))
        );
      } catch {}
    }
  };

  const isAdmin = Boolean(
    user && user.identifier.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  const adminGetAllUsers = (): UserProfile[] => {
    return getUsers();
  };

  const adminSetUserSubscription = (
    userId: string,
    plan: 'free' | 'standard' | 'premium',
    isPaid: boolean,
    expiry: string = '2027-06-01'
  ) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].subscriptionPlan = plan;
      users[idx].isPaid = isPaid;
      users[idx].subscriptionExpiry = expiry;
      saveUsers(users);

      if (user && user.id === userId) {
        const updatedSelf = { ...user, subscriptionPlan: plan, isPaid, subscriptionExpiry: expiry };
        setUser(updatedSelf);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedSelf));
      }
    }
  };

  const adminUpdateUser = (userId: string, data: Partial<UserProfile>) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveUsers(users);

      if (user && user.id === userId) {
        const updatedSelf = { ...user, ...data };
        setUser(updatedSelf);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedSelf));
      }
    }
  };

  const adminDeleteUser = (userId: string) => {
    const users = getUsers();
    const updated = users.filter((u) => u.id !== userId);
    saveUsers(updated);
  };

  const adminResetTrial = (userId: string) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      users[idx].registeredAt = new Date().toISOString();
      users[idx].subscriptionPlan = 'free';
      users[idx].isPaid = false;
      saveUsers(users);

      if (user && user.id === userId) {
        const updatedSelf = {
          ...user,
          registeredAt: new Date().toISOString(),
          subscriptionPlan: 'free',
          isPaid: false,
        };
        setUser(updatedSelf);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedSelf));
      }
    }
  };

  const adminCreateUser = (userData: Omit<UserProfile, 'id' | 'testHistory'>) => {
    const trimmedId = userData.identifier.trim().toLowerCase();
    const users = getUsers();
    const exists = users.some((u) => u.identifier.trim().toLowerCase() === trimmedId);

    if (exists) {
      return { success: false, error: 'Пользователь с таким email/телефоном уже существует' };
    }

    const newUser: UserProfile = {
      ...userData,
      id: 'user_' + Date.now(),
      name: userData.name.trim() || 'Ученик',
      identifier: userData.identifier.trim(),
      password: userData.password || '123456',
      avatar: userData.avatar || '/avatars/snow_leopard.svg',
      targetScore: userData.targetScore || 215,
      targetUniversity: userData.targetUniversity || 'Кыргызский национальный университет',
      registeredAt: userData.registeredAt || new Date().toISOString(),
      testHistory: [],
      subscriptionPlan: userData.subscriptionPlan || 'free',
      subscriptionExpiry: userData.subscriptionExpiry || '2027-06-01',
      isPaid: userData.isPaid ?? false,
      hasSeenWelcomeGift: true,
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    return { success: true };
  };

  const isVip =
    subscriptionStatus.effectivePlan === 'premium' ||
    user?.subscriptionPlan === 'premium' ||
    isAdmin;
  const isPremium = isVip;
  const isTrial =
    !user?.isPaid &&
    !isAdmin &&
    (subscriptionStatus.trialStage === 'trial_premium' ||
      subscriptionStatus.trialStage === 'trial_standard');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isVip,
        isPremium,
        isTrial,
        subscriptionStatus,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isTrialWelcomeOpen,
        openTrialWelcomeModal,
        closeTrialWelcomeModal,
        login,
        register,
        loginWithCode,
        loginWithGoogle,
        loginWithTelegram,
        loginWithWhatsApp,
        extendTrial,
        logout,
        resetPassword,
        updateProfile,
        saveTestResult,
        adminGetAllUsers,
        adminSetUserSubscription,
        adminUpdateUser,
        adminDeleteUser,
        adminResetTrial,
        adminCreateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
