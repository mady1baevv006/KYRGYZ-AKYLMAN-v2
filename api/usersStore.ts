import fs from 'fs';
import path from 'path';
import { getFirestoreAdmin, getAdminAuth } from './firebaseAdmin.js';

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
  subscriptionUpdatedAt?: string;
  hasSeenWelcomeGift?: boolean;
  hasExtendedTrial?: boolean;
}

export const ADMIN_EMAIL = 'mady1baevv@kyrgyzakylman.com';

/**
 * Formats user login strictly as @username (lowercase, alphanumeric/underscore, 3-15 chars)
 */
export function formatUserLogin(login?: string, fallbackIdentifier?: string): string {
  if (login && typeof login === 'string' && login.trim()) {
    const clean = login.trim().replace(/^@+/, '').toLowerCase();
    return `@${clean}`;
  }
  if (fallbackIdentifier && typeof fallbackIdentifier === 'string') {
    const raw = fallbackIdentifier.trim().toLowerCase();
    const base = raw.includes('@') ? raw.split('@')[0] : raw;
    const clean = base.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 15) || 'student';
    return `@${clean}`;
  }
  return `@student_${Date.now().toString().slice(-4)}`;
}

export const DEFAULT_ADMIN_PROFILE: UserProfile = {
  id: 'admin_mady1baevv',
  name: 'Абдраим Мадылбаев (Администратор)',
  login: '@mady1baevv',
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

function isFirebaseAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 && process.env.FIREBASE_SERVICE_ACCOUNT_BASE64.trim());
}

function getFirestoreDocId(u: Partial<UserProfile>): string {
  const email = (u.email || (u.identifier && u.identifier.includes('@') && !u.identifier.startsWith('@') ? u.identifier : '')).trim().toLowerCase();
  if (email) {
    return 'email_' + email.replace(/[^a-z0-9@._-]/g, '_');
  }
  if (u.telegramId !== undefined && u.telegramId !== null) {
    return `tg_${u.telegramId}`;
  }
  if (u.id) {
    return String(u.id).replace(/[^a-zA-Z0-9_-]/g, '_');
  }
  return `user_${Date.now()}`;
}

function loadUsersFromDisk(): void {
  if (isLoaded && memoryUsers.length > 0) return;

  const filePath = getDataFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryUsers = parsed.map((u: UserProfile) => {
          const isMasterAdmin =
            u.id === 'admin_mady1baevv' ||
            u.identifier?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
            u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          return {
            ...u,
            login: isMasterAdmin ? '@mady1baevv' : formatUserLogin(u.login, u.email || u.identifier),
          };
        });
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
    memoryUsers[adminIndex] = {
      ...memoryUsers[adminIndex],
      ...DEFAULT_ADMIN_PROFILE,
      id: 'admin_mady1baevv',
      login: '@mady1baevv',
      identifier: ADMIN_EMAIL,
      email: ADMIN_EMAIL,
      subscriptionPlan: 'premium',
      isPaid: true,
      subscriptionExpiry: '2027-06-01',
    };
  }
}

function matchesUserQuery(
  u: UserProfile,
  query: {
    id?: string;
    email?: string;
    identifier?: string;
    telegramId?: number | string;
    telegramUsername?: string;
  }
): boolean {
  const qId = (query.id || '').trim();
  const qEmail = (query.email || '').trim().toLowerCase();
  const qIdentifier = (query.identifier || '').trim().toLowerCase();
  const qTgUsername = (query.telegramUsername || '').trim().toLowerCase();
  const qTgId = query.telegramId !== undefined && query.telegramId !== null && query.telegramId !== '' ? Number(query.telegramId) : undefined;

  if (qId && u.id === qId) return true;
  if (qTgId !== undefined && !isNaN(qTgId) && u.telegramId !== undefined && Number(u.telegramId) === qTgId) return true;

  const uEmail = (u.email || (u.identifier && u.identifier.includes('@') && !u.identifier.startsWith('@') ? u.identifier : '')).trim().toLowerCase();
  const uIdLower = (u.identifier || '').trim().toLowerCase();
  const uTgLower = (u.telegramUsername || '').trim().toLowerCase();

  if (qEmail && (uEmail === qEmail || uIdLower === qEmail)) return true;
  if (qIdentifier && (uIdLower === qIdentifier || uEmail === qIdentifier || uTgLower === qIdentifier)) return true;
  if (qTgUsername && (uTgLower === qTgUsername || uIdLower === qTgUsername)) return true;

  return false;
}

async function syncUserToCloud(user: UserProfile, isSubscriptionChange = false): Promise<void> {
  if (!isFirebaseAdminConfigured()) return;

  // 1. Firestore persistence (with short guard)
  try {
    const db = getFirestoreAdmin();
    const docId = getFirestoreDocId(user);
    const cleanData = JSON.parse(JSON.stringify(user));
    await Promise.race([
      db.collection('users').doc(docId).set(cleanData, { merge: true }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore write timeout')), 3000)),
    ]);
  } catch (e) {
    // Non-fatal: Firestore may not be provisioned on this project
  }

  // 2. Firebase Auth Custom Claims persistence (works even if only Firebase Auth is enabled!)
  if (isSubscriptionChange) {
    try {
      const auth = getAdminAuth();
      const email = (user.email || (user.identifier?.includes('@') && !user.identifier.startsWith('@') ? user.identifier : '')).trim().toLowerCase();
      let uid: string | undefined;

      if (user.id && !user.id.startsWith('user_') && !user.id.startsWith('tg_') && user.id !== 'admin_mady1baevv') {
        try {
          await auth.getUser(user.id);
          uid = user.id;
        } catch {}
      }
      if (!uid && email) {
        try {
          const authUser = await auth.getUserByEmail(email);
          uid = authUser.uid;
        } catch {}
      }

      if (uid) {
        const existingRecord = await auth.getUser(uid);
        const existingClaims = existingRecord.customClaims || {};
        await auth.setCustomUserClaims(uid, {
          ...existingClaims,
          subscriptionPlan: user.subscriptionPlan || 'free',
          isPaid: Boolean(user.isPaid),
          subscriptionExpiry: user.subscriptionExpiry || '2027-06-01',
          subscriptionUpdatedAt: user.subscriptionUpdatedAt || new Date().toISOString(),
        });
      }
    } catch (e) {
      // Non-fatal if user is Telegram-only or Auth unavailable
    }
  }
}

async function hydrateFromCloud(): Promise<void> {
  if (!isFirebaseAdminConfigured()) return;
  loadUsersFromDisk();

  try {
    const db = getFirestoreAdmin();
    const snapshot = (await Promise.race([
      db.collection('users').get(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore read timeout')), 3000)),
    ])) as any;

    if (snapshot && Array.isArray(snapshot.docs)) {
      let changed = false;
      for (const doc of snapshot.docs) {
        const remote = doc.data() as UserProfile;
        if (!remote) continue;

        const existingIdx = memoryUsers.findIndex((u) =>
          matchesUserQuery(u, {
            id: remote.id,
            email: remote.email,
            identifier: remote.identifier,
            telegramId: remote.telegramId,
            telegramUsername: remote.telegramUsername,
          })
        );

        if (existingIdx !== -1) {
          const local = memoryUsers[existingIdx];
          const remoteTs = remote.subscriptionUpdatedAt ? new Date(remote.subscriptionUpdatedAt).getTime() : 0;
          const localTs = local.subscriptionUpdatedAt ? new Date(local.subscriptionUpdatedAt).getTime() : 0;

          if (remoteTs > localTs || (!local.isPaid && remote.isPaid)) {
            memoryUsers[existingIdx] = {
              ...local,
              ...remote,
              id: local.id,
              subscriptionPlan: remote.subscriptionPlan || local.subscriptionPlan,
              isPaid: remote.isPaid !== undefined ? remote.isPaid : local.isPaid,
              subscriptionExpiry: remote.subscriptionExpiry || local.subscriptionExpiry,
              subscriptionUpdatedAt: remote.subscriptionUpdatedAt || local.subscriptionUpdatedAt,
            };
            changed = true;
          }
        } else {
          memoryUsers.push(remote);
          changed = true;
        }
      }
      if (changed) {
        ensureAdminUser();
        saveUsersToDisk();
      }
    }
  } catch {
    // Non-fatal fallback to disk/memory
  }
}

/**
 * Returns all users sorted: Admin at top, then newest registered first.
 * Every user is guaranteed to have their login formatted as @username.
 */
export function getAllUsers(): UserProfile[] {
  loadUsersFromDisk();

  return [...memoryUsers]
    .map((u) => {
      const isMasterAdmin =
        u.id === 'admin_mady1baevv' ||
        u.identifier?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
        u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      return {
        ...u,
        login: isMasterAdmin ? '@mady1baevv' : formatUserLogin(u.login, u.email || u.identifier),
      };
    })
    .sort((a, b) => {
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

export async function getAllUsersAsync(): Promise<UserProfile[]> {
  await hydrateFromCloud();
  return getAllUsers();
}

export function findUser(query: {
  id?: string;
  email?: string;
  identifier?: string;
  telegramId?: number | string;
  telegramUsername?: string;
}): UserProfile | null {
  loadUsersFromDisk();
  const found = memoryUsers.find((u) => matchesUserQuery(u, query));
  return found || null;
}

export async function findUserAsync(query: {
  id?: string;
  email?: string;
  identifier?: string;
  telegramId?: number | string;
  telegramUsername?: string;
}): Promise<UserProfile | null> {
  await hydrateFromCloud();
  const existing = findUser(query);
  if (existing) return existing;

  // Also check Firebase Auth customClaims if user exists there
  if (isFirebaseAdminConfigured()) {
    try {
      const auth = getAdminAuth();
      const email = (query.email || (query.identifier?.includes('@') && !query.identifier.startsWith('@') ? query.identifier : '')).trim().toLowerCase();
      if (email) {
        const authUser = await auth.getUserByEmail(email);
        const claims = authUser.customClaims || {};
        if (claims.subscriptionPlan || claims.isPaid !== undefined) {
          return upsertUser({
            id: authUser.uid,
            name: authUser.displayName || email.split('@')[0],
            email,
            identifier: email,
            avatar: authUser.photoURL || '/avatars/snow_leopard.svg',
            authProvider: 'google',
            authProviders: ['google'],
            registeredAt: authUser.metadata.creationTime ? new Date(authUser.metadata.creationTime).toISOString() : new Date().toISOString(),
            subscriptionPlan: claims.subscriptionPlan || 'free',
            isPaid: Boolean(claims.isPaid),
            subscriptionExpiry: claims.subscriptionExpiry || '2027-06-01',
            subscriptionUpdatedAt: claims.subscriptionUpdatedAt,
          }, { fromAdmin: true });
        }
      }
    } catch {}
  }

  return null;
}

/**
 * Upserts a user profile into persistent store.
 * When `fromAdmin` is false (default for client sync), server-side subscription fields
 * (`subscriptionPlan`, `isPaid`, `subscriptionExpiry`) are authoritative and NOT overwritten
 * by stale client data.
 */
export function upsertUser(
  user: Partial<UserProfile>,
  options?: { fromAdmin?: boolean }
): UserProfile {
  loadUsersFromDisk();
  const fromAdmin = Boolean(options?.fromAdmin);

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
      ...(adminIdx !== -1 ? memoryUsers[adminIndexOrZero(adminIdx)] : {}),
      ...user,
      id: 'admin_mady1baevv',
      login: '@mady1baevv',
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
  const existingIndex = memoryUsers.findIndex((u) =>
    matchesUserQuery(u, {
      id: rawId,
      email: rawEmail,
      identifier: rawIdentifier,
      telegramId: rawTgId,
      telegramUsername: rawTgUsername,
    })
  );

  const nowIso = new Date().toISOString();

  if (existingIndex !== -1) {
    const existing = memoryUsers[existingIndex];
    const mergedProviders = Array.from(
      new Set([
        ...(existing.authProviders || (existing.authProvider ? [existing.authProvider] : [])),
        ...(user.authProviders || (user.authProvider ? [user.authProvider] : [])),
      ])
    );

    const cleanLogin = formatUserLogin(
      user.login || existing.login,
      user.email || user.identifier || existing.email || existing.identifier
    );

    // Merge test histories cleanly by id
    const mergedHistory = [...(user.testHistory || []), ...(existing.testHistory || [])].filter(
      (t, i, arr) => t && t.id && arr.findIndex((x) => x && x.id === t.id) === i
    );

    // Server is authoritative for subscription fields during client sync!
    const authoritativePlan = fromAdmin
      ? (user.subscriptionPlan ?? existing.subscriptionPlan ?? 'free')
      : (existing.subscriptionPlan ?? user.subscriptionPlan ?? 'free');
    const authoritativeIsPaid = fromAdmin
      ? (user.isPaid !== undefined ? Boolean(user.isPaid) : Boolean(existing.isPaid))
      : (existing.isPaid !== undefined ? Boolean(existing.isPaid) : Boolean(user.isPaid));
    const authoritativeExpiry = fromAdmin
      ? (user.subscriptionExpiry || existing.subscriptionExpiry || '2027-06-01')
      : (existing.subscriptionExpiry || user.subscriptionExpiry || '2027-06-01');

    const updated: UserProfile = {
      ...existing,
      ...user,
      id: existing.id,
      login: cleanLogin,
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
      subscriptionPlan: authoritativePlan,
      isPaid: authoritativeIsPaid,
      subscriptionExpiry: authoritativeExpiry,
      subscriptionUpdatedAt: fromAdmin ? nowIso : existing.subscriptionUpdatedAt,
      testHistory: mergedHistory,
    };

    memoryUsers[existingIndex] = updated;
    saveUsersToDisk();
    return updated;
  }

  // Create new profile
  const newId =
    rawId ||
    (rawTgId ? `tg_${rawTgId}` : `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);

  const cleanLogin = formatUserLogin(
    user.login,
    user.email || user.identifier || rawEmail || newId
  );

  const created: UserProfile = {
    id: newId,
    name: user.name || (user.telegramUsername ? `@${user.telegramUsername.replace('@', '')}` : 'Ученик'),
    login: cleanLogin,
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
    subscriptionUpdatedAt: fromAdmin ? nowIso : user.subscriptionUpdatedAt,
  };

  memoryUsers.push(created);
  saveUsersToDisk();
  return created;
}

function adminIdxOrZero(idx: number): number {
  return idx >= 0 ? idx : 0;
}

function adminIndexOrZero(idx: number): number {
  return adminIdxOrZero(idx);
}

export async function upsertUserAsync(
  user: Partial<UserProfile>,
  options?: { fromAdmin?: boolean }
): Promise<UserProfile> {
  await hydrateFromCloud();

  // Check Firebase Auth customClaims for authoritative subscription status (survives Vercel cold starts / separate lambdas)
  let authoritativeClaims: Partial<UserProfile> | null = null;
  if (!options?.fromAdmin && isFirebaseAdminConfigured()) {
    const email = (user.email || (user.identifier?.includes('@') && !user.identifier.startsWith('@') ? user.identifier : '')).trim().toLowerCase();
    const existingLocal = findUser({
      id: user.id,
      email,
      identifier: user.identifier,
      telegramId: user.telegramId,
      telegramUsername: user.telegramUsername,
    });
    if (email) {
      try {
        const auth = getAdminAuth();
        const authUser = await auth.getUserByEmail(email);
        const claims = authUser.customClaims || {};
        if (claims.subscriptionPlan || claims.isPaid !== undefined) {
          const claimsTs = claims.subscriptionUpdatedAt ? new Date(claims.subscriptionUpdatedAt).getTime() : 0;
          const localTs = existingLocal?.subscriptionUpdatedAt ? new Date(existingLocal.subscriptionUpdatedAt).getTime() : 0;
          if (!existingLocal || claimsTs > localTs || (!existingLocal.subscriptionUpdatedAt && claims.isPaid && !existingLocal.isPaid)) {
            authoritativeClaims = {
              subscriptionPlan: claims.subscriptionPlan || 'free',
              isPaid: claims.isPaid !== undefined ? Boolean(claims.isPaid) : false,
              subscriptionExpiry: claims.subscriptionExpiry || '2027-06-01',
              subscriptionUpdatedAt: claims.subscriptionUpdatedAt,
            };
          }
        }
      } catch {}
    }
  }

  let saved = upsertUser(
    authoritativeClaims ? { ...user, ...authoritativeClaims } : user,
    authoritativeClaims ? { fromAdmin: true } : options
  );
  await syncUserToCloud(saved, Boolean(options?.fromAdmin));
  return saved;
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
  }, { fromAdmin: false });
}

/**
 * Updates an existing user (for Admin edits).
 * Matches by userId OR email OR identifier OR telegramId OR telegramUsername.
 * If the user only came from Firebase Auth and wasn't in store yet, creates them using fallbackUser!
 */
export function updateUser(
  userId: string,
  data: Partial<UserProfile>,
  fallbackUser?: Partial<UserProfile>
): UserProfile | null {
  loadUsersFromDisk();

  const searchQuery = {
    id: userId,
    email: data.email || fallbackUser?.email,
    identifier: data.identifier || fallbackUser?.identifier,
    telegramId: data.telegramId ?? fallbackUser?.telegramId,
    telegramUsername: data.telegramUsername || fallbackUser?.telegramUsername,
  };

  const matchingIndices: number[] = [];
  memoryUsers.forEach((u, i) => {
    if (matchesUserQuery(u, searchQuery)) {
      matchingIndices.push(i);
    }
  });

  const nowIso = new Date().toISOString();
  const isSubChange =
    data.subscriptionPlan !== undefined ||
    data.isPaid !== undefined ||
    data.subscriptionExpiry !== undefined;

  if (matchingIndices.length === 0) {
    // User came dynamically (e.g. Firebase Auth listUsers) and isn't on disk yet — upsert them!
    if (fallbackUser || data.email || data.identifier) {
      return upsertUser(
        {
          id: userId,
          ...fallbackUser,
          ...data,
          subscriptionUpdatedAt: isSubChange ? nowIso : undefined,
        },
        { fromAdmin: true }
      );
    }
    return null;
  }

  let primaryUpdated: UserProfile | null = null;
  for (const idx of matchingIndices) {
    const current = memoryUsers[idx];
    const cleanLogin =
      data.login !== undefined
        ? (data.login ? formatUserLogin(data.login, current.email || current.identifier) : undefined)
        : (current.login ? formatUserLogin(current.login, current.email || current.identifier) : undefined);

    const updated: UserProfile = {
      ...current,
      ...data,
      login: cleanLogin,
      id: current.id, // Immutable ID
      registeredAt: data.registeredAt || current.registeredAt,
      subscriptionUpdatedAt: isSubChange ? nowIso : current.subscriptionUpdatedAt,
    };

    memoryUsers[idx] = updated;
    if (!primaryUpdated) {
      primaryUpdated = updated;
    }
  }

  saveUsersToDisk();
  return primaryUpdated;
}

export async function updateUserAsync(
  userId: string,
  data: Partial<UserProfile>,
  fallbackUser?: Partial<UserProfile>
): Promise<UserProfile | null> {
  await hydrateFromCloud();
  const updated = updateUser(userId, data, fallbackUser);
  if (updated) {
    const isSubChange =
      data.subscriptionPlan !== undefined ||
      data.isPaid !== undefined ||
      data.subscriptionExpiry !== undefined;
    await syncUserToCloud(updated, isSubChange);
  }
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

  const target = memoryUsers.find((u) => u.id === userId);
  const prevLen = memoryUsers.length;
  memoryUsers = memoryUsers.filter((u) => u.id !== userId);

  if (memoryUsers.length !== prevLen) {
    saveUsersToDisk();
    if (target && isFirebaseAdminConfigured()) {
      try {
        const db = getFirestoreAdmin();
        db.collection('users').doc(getFirestoreDocId(target)).delete().catch(() => {});
      } catch {}
    }
    return true;
  }
  return false;
}

/**
 * Purges all non-admin users without a login from disk and memory
 */
export function deleteUsersWithoutLogin(): number {
  loadUsersFromDisk();
  const prevLen = memoryUsers.length;
  memoryUsers = memoryUsers.filter((u) => {
    const isMasterAdmin =
      u.id === 'admin_mady1baevv' ||
      u.identifier?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (isMasterAdmin) return true;
    return Boolean(u.login && typeof u.login === 'string' && u.login.trim().length > 0);
  });
  const deletedCount = prevLen - memoryUsers.length;
  if (deletedCount > 0) {
    saveUsersToDisk();
  }
  return deletedCount;
}
