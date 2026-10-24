import fs from 'fs';
import path from 'path';

export interface UserProfile {
  id: string;
  name: string;
  login?: string;
  identifier: string;
  email?: string;
  phone?: string;
  telegramUsername?: string;
  telegramId?: number;
  authProvider?: 'google' | 'telegram' | 'email_code' | 'phone_code' | 'password';
  authProviders?: string[];
  password?: string;
  avatar?: string;
  targetScore?: number;
  targetUniversity?: string;
  registeredAt: string;
  lastLoginAt?: string;
  testHistory?: any[];
  subscriptionPlan?: 'free' | 'standard' | 'premium';
  subscriptionExpiry?: string;
  isPaid?: boolean;
  hasSeenWelcomeGift?: boolean;
  hasExtendedTrial?: boolean;
}

export const ADMIN_EMAIL = 'mady1baevv@kyrgyzakylman.com';

export const DEFAULT_ADMIN_PROFILE: UserProfile = {
  id: 'admin_mady1baevv',
  name: 'Абдраим Мадылбаев (Администратор)',
  login: 'mady1baevv',
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
  testHistory: [],
  subscriptionPlan: 'premium',
  subscriptionExpiry: '2027-06-01',
  isPaid: true,
  hasSeenWelcomeGift: true,
};

   const SEED_USERS: UserProfile[] = [DEFAULT_ADMIN_PROFILE];

   const OLD_DEMO_USERS: UserProfile[] = [
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
    testHistory: [],
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
    authProviders: ['google', 'email_code'],
    password: '',
    avatar: '/avatars/snow_leopard.svg',
    targetScore: 232,
    targetUniversity: 'АУЦА (Американский университет в ЦА)',
    registeredAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    testHistory: [],
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
    avatar: '/avatars/falcon.svg',
    targetScore: 215,
    targetUniversity: 'БГУ им. К. Карасаева',
    registeredAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    lastLoginAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    testHistory: [],
    subscriptionPlan: 'free',
    isPaid: false,
    hasSeenWelcomeGift: false,
  },
];

// Determine data directory for persistence
function getDataFilePath(): string {
  const primaryDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    return path.join(primaryDir, 'users.json');
  } catch {
    const tmpDir = path.join('/tmp', 'kyrgyz_akylman_data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return path.join(tmpDir, 'users.json');
    } catch {
      return path.join('/tmp', 'users.json');
    }
  }
}

// In-memory cache of users
let memoryUsers: UserProfile[] = [];
let isLoaded = false;

function loadUsersFromDisk(): void {
  if (isLoaded && memoryUsers.length > 0) return;

  const filePath = getDataFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryUsers = parsed;
        ensureAdminUser();
        isLoaded = true;
        return;
      }
    }
  } catch (err) {
    console.warn('[UsersStore] Failed to read from disk:', err);
  }

  // Fallback to seed users
  memoryUsers = [...SEED_USERS];
  ensureAdminUser();
  saveUsersToDisk();
  isLoaded = true;
}

function saveUsersToDisk(): void {
  const filePath = getDataFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(memoryUsers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[UsersStore] Failed to save to disk:', err);
  }
}

function ensureAdminUser(): void {
  const adminIndex = memoryUsers.findIndex(
    (u) =>
      u.id === 'admin_mady1baevv' ||
      u.identifier?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  if (adminIndex === -1) {
    memoryUsers.unshift(DEFAULT_ADMIN_PROFILE);
  } else {
    // Ensure admin profile has full privileges
    memoryUsers[adminIndex] = {
      ...memoryUsers[adminIndex],
      ...DEFAULT_ADMIN_PROFILE,
      id: 'admin_mady1baevv',
      identifier: ADMIN_EMAIL,
      email: ADMIN_EMAIL,
      subscriptionPlan: 'premium',
      isPaid: true,
      subscriptionExpiry: '2027-06-01',
    };
  }
}

/**
 * Returns all users sorted: Admin at top, then newest registered first
 */
export function getAllUsers(): UserProfile[] {
  loadUsersFromDisk();

  return [...memoryUsers].sort((a, b) => {
    const isAdminA = a.id === 'admin_mady1baevv' || a.identifier?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isAdminB = b.id === 'admin_mady1baevv' || b.identifier?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (isAdminA) return -1;
    if (isAdminB) return 1;

    const getTime = (u: UserProfile): number => {
      if (u.registeredAt) {
        const t = new Date(u.registeredAt).getTime();
        if (!isNaN(t) && t > 0) return t;
      }
      if (typeof u.id === 'string' && u.id.startsWith('user_')) {
        const parts = u.id.split('_');
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > 1000000000) return num;
      }
      return 0;
    };

    return getTime(b) - getTime(a);
  });
}

/**
 * Upserts a user profile into persistent store
 */
export function upsertUser(user: Partial<UserProfile>): UserProfile {
  loadUsersFromDisk();

  const rawId = (user.id || '').trim();
  const rawIdentifier = (user.identifier || '').trim().toLowerCase();
  const rawEmail = (user.email || '').trim().toLowerCase();
  const rawTgUsername = (user.telegramUsername || '').trim().toLowerCase();
  const rawTgId = user.telegramId;

  // Check if target is admin
  const isAdmin =
    rawId === 'admin_mady1baevv' ||
    rawIdentifier === ADMIN_EMAIL.toLowerCase() ||
    rawEmail === ADMIN_EMAIL.toLowerCase() ||
    rawIdentifier === '@mady1baevv' ||
    rawTgUsername === '@mady1baevv';

  if (isAdmin) {
    const adminIdx = memoryUsers.findIndex(
      (u) =>
        u.id === 'admin_mady1baevv' ||
        u.identifier?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
        u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );
    const updatedAdmin: UserProfile = {
      ...DEFAULT_ADMIN_PROFILE,
      ...(adminIdx !== -1 ? memoryUsers[adminIdx] : {}),
      ...user,
      id: 'admin_mady1baevv',
      identifier: ADMIN_EMAIL,
      email: ADMIN_EMAIL,
      subscriptionPlan: 'premium',
      isPaid: true,
      subscriptionExpiry: '2027-06-01',
      lastLoginAt: new Date().toISOString(),
    };

    if (adminIdx !== -1) {
      memoryUsers[adminIdx] = updatedAdmin;
    } else {
      memoryUsers.unshift(updatedAdmin);
    }
    saveUsersToDisk();
    return updatedAdmin;
  }

  // Find existing match by ID, Email, Telegram ID, Telegram username, or identifier
  const existingIndex = memoryUsers.findIndex((u) => {
    if (rawId && u.id === rawId) return true;
    if (rawTgId !== undefined && u.telegramId !== undefined && Number(u.telegramId) === Number(rawTgId)) return true;
    if (rawTgUsername && u.telegramUsername && u.telegramUsername.toLowerCase() === rawTgUsername) return true;
    if (rawEmail && u.email && u.email.toLowerCase() === rawEmail) return true;
    if (rawIdentifier && u.identifier && u.identifier.toLowerCase() === rawIdentifier) return true;
    return false;
  });

  const nowIso = new Date().toISOString();

  if (existingIndex !== -1) {
    const existing = memoryUsers[existingIndex];
    const mergedProviders = Array.from(
      new Set([
        ...(existing.authProviders || (existing.authProvider ? [existing.authProvider] : [])),
        ...(user.authProviders || (user.authProvider ? [user.authProvider] : [])),
      ])
    );

    const updated: UserProfile = {
      ...existing,
      ...user,
      id: existing.id,
      name: (user.name && user.name !== 'Ученик' ? user.name : existing.name) || 'Ученик',
      identifier: existing.identifier || user.identifier || '',
      email: existing.email || user.email,
      telegramUsername: existing.telegramUsername || user.telegramUsername,
      telegramId: existing.telegramId !== undefined ? existing.telegramId : user.telegramId,
      authProvider: user.authProvider || existing.authProvider,
      authProviders: mergedProviders.length > 0 ? mergedProviders : ['password'],
      registeredAt: existing.registeredAt || user.registeredAt || nowIso,
      lastLoginAt: nowIso,
      avatar: user.avatar && !user.avatar.includes('snow_leopard.svg') ? user.avatar : existing.avatar || '/avatars/snow_leopard.svg',
      targetScore: user.targetScore || existing.targetScore || 215,
      targetUniversity: user.targetUniversity || existing.targetUniversity || 'КНУ им. Ж. Баласагына',
      subscriptionPlan:
        user.subscriptionPlan === 'premium' || existing.subscriptionPlan === 'premium'
          ? 'premium'
          : user.subscriptionPlan === 'standard' || existing.subscriptionPlan === 'standard'
          ? 'standard'
          : user.subscriptionPlan || existing.subscriptionPlan || 'free',
      isPaid: user.isPaid !== undefined ? user.isPaid : existing.isPaid,
      subscriptionExpiry: user.subscriptionExpiry || existing.subscriptionExpiry || '2027-06-01',
      testHistory: user.testHistory || existing.testHistory || [],
    };

    memoryUsers[existingIndex] = updated;
    saveUsersToDisk();
    return updated;
  }

  // Create new profile
  const newId =
    rawId ||
    (rawTgId ? `tg_${rawTgId}` : `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);

  const created: UserProfile = {
    id: newId,
    name: user.name || (user.telegramUsername ? `@${user.telegramUsername.replace('@', '')}` : 'Ученик'),
    identifier: user.identifier || (rawTgUsername ? rawTgUsername : rawEmail || newId),
    email: user.email,
    telegramUsername: user.telegramUsername,
    telegramId: user.telegramId,
    authProvider: user.authProvider || 'password',
    authProviders: user.authProviders || (user.authProvider ? [user.authProvider] : ['password']),
    password: user.password || '',
    avatar: user.avatar || '/avatars/snow_leopard.svg',
    targetScore: user.targetScore || 215,
    targetUniversity: user.targetUniversity || 'КНУ им. Ж. Баласагына',
    registeredAt: user.registeredAt || nowIso,
    lastLoginAt: nowIso,
    testHistory: user.testHistory || [],
    subscriptionPlan: user.subscriptionPlan || 'free',
    isPaid: Boolean(user.isPaid),
    subscriptionExpiry: user.subscriptionExpiry || '2027-06-01',
  };

  memoryUsers.push(created);
  saveUsersToDisk();
  return created;
}

/**
 * Upserts a user directly from verified Telegram Widget or Bot data
 */
export function upsertTelegramUser(tgUser: {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
}): UserProfile {
  const tgId = Number(tgUser.id);
  const cleanUsername = tgUser.username
    ? tgUser.username.startsWith('@')
      ? tgUser.username
      : `@${tgUser.username}`
    : undefined;

  const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ').trim();
  const displayName = fullName || (cleanUsername ? cleanUsername : `Telegram (${tgId})`);
  const registeredTime = tgUser.auth_date
    ? new Date(tgUser.auth_date * 1000).toISOString()
    : new Date().toISOString();

  return upsertUser({
    id: `tg_${tgId}`,
    name: displayName,
    identifier: cleanUsername || `@id${tgId}`,
    telegramUsername: cleanUsername,
    telegramId: tgId,
    authProvider: 'telegram',
    authProviders: ['telegram'],
    avatar: tgUser.photo_url || '/avatars/snow_leopard.svg',
    registeredAt: registeredTime,
    lastLoginAt: new Date().toISOString(),
    subscriptionPlan: 'free',
    isPaid: false,
  });
}

/**
 * Updates an existing user (for Admin edits)
 */
export function updateUser(userId: string, data: Partial<UserProfile>): UserProfile | null {
  loadUsersFromDisk();

  const idx = memoryUsers.findIndex((u) => u.id === userId);
  if (idx === -1) return null;

  const current = memoryUsers[idx];
  const updated: UserProfile = {
    ...current,
    ...data,
    id: current.id, // Immutable ID
    registeredAt: current.registeredAt, // Preserve original registration time
  };

  memoryUsers[idx] = updated;
  saveUsersToDisk();
  return updated;
}

/**
 * Deletes a user by ID
 */
export function deleteUser(userId: string): boolean {
  loadUsersFromDisk();

  if (userId === 'admin_mady1baevv') {
    return false; // Cannot delete master admin
  }

  const prevLen = memoryUsers.length;
  memoryUsers = memoryUsers.filter(
       (u) => u.id !== userId
  );

  if (memoryUsers.length !== prevLen) {
    saveUsersToDisk();
    return true;
  }
  return false;
}
