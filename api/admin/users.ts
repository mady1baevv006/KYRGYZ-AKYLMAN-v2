import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getAllUsers,
  getAllUsersAsync,
  updateUserAsync,
  deleteUser,
  upsertUserAsync,
  deleteUsersWithoutLogin,
  formatUserLogin,
} from '../usersStore.js';
import type { UserProfile } from '../usersStore.js';
import { getAdminAuth } from '../firebaseAdmin.js';

const ADMIN_EMAIL = 'mady1baevv@kyrgyzakylman.com';

/**
 * Читает ВСЕХ пользователей из Firebase Authentication (то, что видно в Firebase Console).
 * Благодаря этому в админ-панели появляются все, кто хоть раз вошёл через Google.
 */
async function getFirebaseAuthUsers(): Promise<UserProfile[]> {
  const auth = getAdminAuth();
  const result: UserProfile[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const page = await auth.listUsers(1000, pageToken);
    for (const u of page.users) {
      const email = (u.email || '').trim().toLowerCase();
      const providerIds = u.providerData.map((p) => p.providerId);
      const providers: string[] = [];
      if (providerIds.includes('google.com')) providers.push('google');
      if (providerIds.includes('password') || providerIds.length === 0) providers.push('email_code');
      if (providers.length === 0) providers.push('google');

      const created = u.metadata.creationTime ? new Date(u.metadata.creationTime) : null;
      const lastSignIn = u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime) : null;
      const claims = (u.customClaims || {}) as Record<string, any>;

      result.push({
        id: u.uid,
        name: u.displayName || (email ? email.split('@')[0] : 'Ученик'),
        identifier: email || u.uid,
        email: email || undefined,
        authProvider: providers[0] as UserProfile['authProvider'],
        authProviders: providers,
        avatar: u.photoURL || '/avatars/snow_leopard.svg',
        registeredAt: created && !isNaN(created.getTime()) ? created.toISOString() : new Date(0).toISOString(),
        lastLoginAt: lastSignIn && !isNaN(lastSignIn.getTime()) ? lastSignIn.toISOString() : undefined,
        testHistory: [],
        subscriptionPlan: (claims.subscriptionPlan as UserProfile['subscriptionPlan']) || 'free',
        isPaid: Boolean(claims.isPaid),
        subscriptionExpiry: claims.subscriptionExpiry || '2027-06-01',
        subscriptionUpdatedAt: claims.subscriptionUpdatedAt,
      });
    }
    pageToken = page.pageToken;
  } while (pageToken);

  return result;
}

/** Объединяет пользователей из Firebase Auth с тем, что уже лежит в нашем хранилище. */
function mergeUsers(stored: UserProfile[], authUsers: UserProfile[]): UserProfile[] {
  const isAdmin = (u: UserProfile) =>
    u.id === 'admin_mady1baevv' || (u.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const byEmail = new Map<string, number>();
  const byId = new Map<string, number>();
  const merged: UserProfile[] = stored.map((u, i) => {
    if (u.email) byEmail.set(u.email.toLowerCase(), i);
    if (u.id) byId.set(u.id, i);
    return {
      ...u,
      login: isAdmin(u) ? '@mady1baevv' : formatUserLogin(u.login, u.email || u.identifier),
    };
  });

  for (const a of authUsers) {
    const idx =
      (a.email ? byEmail.get(a.email.toLowerCase()) : undefined) ??
      (a.id ? byId.get(a.id) : undefined);
    if (idx !== undefined) {
      const s = merged[idx];
      const sTs = s.subscriptionUpdatedAt ? new Date(s.subscriptionUpdatedAt).getTime() : 0;
      const aTs = a.subscriptionUpdatedAt ? new Date(a.subscriptionUpdatedAt).getTime() : 0;
      const useAuthClaims = aTs > sTs || (!s.subscriptionUpdatedAt && !s.isPaid && Boolean(a.isPaid));

      merged[idx] = {
        ...s,
        login: isAdmin(s) ? '@mady1baevv' : (s.login || formatUserLogin(undefined, s.email || s.identifier)),
        // даты берём из Firebase — они самые точные
        registeredAt: a.registeredAt && new Date(a.registeredAt).getTime() > 0 ? a.registeredAt : s.registeredAt,
        lastLoginAt: a.lastLoginAt || s.lastLoginAt,
        avatar: s.avatar && !s.avatar.includes('snow_leopard.svg') ? s.avatar : a.avatar,
        name: s.name && s.name !== 'Ученик' ? s.name : a.name,
        ...(useAuthClaims
          ? {
              subscriptionPlan: a.subscriptionPlan || s.subscriptionPlan || 'free',
              isPaid: a.isPaid !== undefined ? Boolean(a.isPaid) : Boolean(s.isPaid),
              subscriptionExpiry: a.subscriptionExpiry || s.subscriptionExpiry || '2027-06-01',
              subscriptionUpdatedAt: a.subscriptionUpdatedAt || s.subscriptionUpdatedAt,
            }
          : {}),
      };
    } else {
      // Пользователь из Firebase Auth — добавляем в список с его логином вида @логин
      const userLogin = isAdmin(a) ? '@mady1baevv' : formatUserLogin(a.login, a.email || a.identifier);
      merged.push({
        ...a,
        login: userLogin,
      });
    }
  }

  // Все пользователи обязательно имеют логин вида @username
  const allFormatted = merged.map((u) => ({
    ...u,
    login: isAdmin(u) ? '@mady1baevv' : formatUserLogin(u.login, u.email || u.identifier),
  }));

  return allFormatted.sort((a, b) => {
    if (isAdmin(a)) return -1;
    if (isAdmin(b)) return 1;
    return new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime();
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const stored = await getAllUsersAsync();
      let users = stored;
      let authError: string | undefined;

      try {
        const authUsers = await getFirebaseAuthUsers();
        users = mergeUsers(stored, authUsers);
      } catch (e: any) {
        // Если Firebase Admin не настроен — панель не ломается, но мы увидим причину
        authError = e?.message || 'Не удалось прочитать Firebase Authentication';
        console.error('[API /api/admin/users] Firebase Auth error:', e);
      }

      return res.status(200).json({
        ok: true,
        success: true,
        users,
        total: users.length,
        authError,
      });
    }

    if (req.method === 'POST') {
      const action = req.body?.action;

      if (action === 'update') {
        const { userId, data, email, identifier, telegramId, telegramUsername, fallbackUser } = req.body || {};
        if (!userId && !email && !identifier && telegramId === undefined) {
          return res.status(400).json({ ok: false, error: 'Отсутствует userId' });
        }
        const mergedFallback: Partial<UserProfile> | undefined =
          fallbackUser ||
          (email || identifier || telegramId !== undefined || telegramUsername
            ? { id: userId, email, identifier, telegramId, telegramUsername }
            : userId
            ? { id: userId, ...(data || {}) }
            : undefined);

        const updated = await updateUserAsync(userId || '', data || {}, mergedFallback);
        return res.status(200).json({ ok: Boolean(updated), user: updated });
      }

      if (action === 'delete') {
        const { userId, email } = req.body || {};
        const targetEmail = String(email || '').trim().toLowerCase();
        if (!userId && !targetEmail) {
          return res.status(400).json({ ok: false, error: 'Отсутствует userId' });
        }
        if (userId === 'admin_mady1baevv' || targetEmail === ADMIN_EMAIL) {
          return res.status(403).json({ ok: false, error: 'Нельзя удалить главного администратора' });
        }

        // 1) Удаляем из Firebase Authentication (иначе пользователь появится снова)
        let authDeleted = false;
        let authError: string | undefined;
        try {
          const auth = getAdminAuth();
          let uid: string | undefined;
          if (userId) {
            try { await auth.getUser(userId); uid = userId; } catch { /* не найден по id */ }
          }
          if (!uid && targetEmail.includes('@')) {
            try { uid = (await auth.getUserByEmail(targetEmail)).uid; } catch { /* не найден по email */ }
          }
          if (uid) {
            await auth.deleteUser(uid);
            authDeleted = true;
          }
        } catch (e: any) {
          authError = e?.message || 'Не удалось удалить из Firebase Authentication';
          console.error('[API /api/admin/users] Auth delete error:', e);
        }

        // 2) Удаляем из нашего хранилища (по id и по email)
        let deleted = userId ? deleteUser(userId) : false;
        if (targetEmail) {
          for (const u of getAllUsers()) {
            const same =
              (u.email || '').toLowerCase() === targetEmail ||
              (u.identifier || '').toLowerCase() === targetEmail;
            if (same && u.id !== 'admin_mady1baevv') {
              deleted = deleteUser(u.id) || deleted;
            }
          }
        }

        return res.status(200).json({ ok: !authError, deleted, authDeleted, authError });
      }

      if (action === 'cleanup_no_login') {
        const deletedFromStore = deleteUsersWithoutLogin();
        let authDeletedCount = 0;
        try {
          const auth = getAdminAuth();
          const page = await auth.listUsers(1000);
          const validUsers = getAllUsers();
          const validEmails = new Set(validUsers.map((u) => (u.email || '').toLowerCase()).filter(Boolean));
          for (const u of page.users) {
            const email = (u.email || '').toLowerCase();
            if (email === ADMIN_EMAIL.toLowerCase()) continue;
            // If user in Firebase Auth doesn't have an account with a login in validEmails, delete from Auth
            if (!validEmails.has(email)) {
              try {
                await auth.deleteUser(u.uid);
                authDeletedCount++;
              } catch {}
            }
          }
        } catch (e: any) {
          console.warn('[API /api/admin/users] Auth cleanup error:', e);
        }

        return res.status(200).json({
          ok: true,
          deletedCount: deletedFromStore + authDeletedCount,
          deletedFromStore,
          authDeletedCount,
        });
      }

      if (action === 'create') {
        const { user } = req.body || {};
        if (!user) {
          return res.status(400).json({ ok: false, error: 'Отсутствуют данные пользователя' });
        }
        const created = await upsertUserAsync(user, { fromAdmin: true });
        return res.status(200).json({ ok: true, user: created });
      }

      // Default POST behavior: upsert user
      const user = req.body?.user || req.body;
      const saved = await upsertUserAsync(user, { fromAdmin: true });
      return res.status(200).json({ ok: true, user: saved });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[API /api/admin/users] Error:', err);
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Server error',
    });
  }
}
