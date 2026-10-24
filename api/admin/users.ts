import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllUsers, updateUser, deleteUser, upsertUser } from '../usersStore.js';
import type { UserProfile } from '../usersStore.js';
import { getAdminAuth } from '../firebaseAdmin.js';

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
        subscriptionPlan: 'free',
        isPaid: false,
      });
    }
    pageToken = page.pageToken;
  } while (pageToken);

  return result;
}

/** Объединяет пользователей из Firebase Auth с тем, что уже лежит в нашем хранилище. */
function mergeUsers(stored: UserProfile[], authUsers: UserProfile[]): UserProfile[] {
  const byEmail = new Map<string, number>();
  const merged: UserProfile[] = stored.map((u, i) => {
    if (u.email) byEmail.set(u.email.toLowerCase(), i);
    return { ...u };
  });

  for (const a of authUsers) {
    const idx = a.email ? byEmail.get(a.email.toLowerCase()) : undefined;
    if (idx !== undefined) {
      const s = merged[idx];
      merged[idx] = {
        ...s,
        // даты берём из Firebase — они самые точные
        registeredAt: a.registeredAt && new Date(a.registeredAt).getTime() > 0 ? a.registeredAt : s.registeredAt,
        lastLoginAt: a.lastLoginAt || s.lastLoginAt,
        avatar: s.avatar && !s.avatar.includes('snow_leopard.svg') ? s.avatar : a.avatar,
        name: s.name && s.name !== 'Ученик' ? s.name : a.name,
      };
    } else {
      merged.push(a);
    }
  }

  const ADMIN_EMAIL = 'mady1baevv@kyrgyzakylman.com';
  const isAdmin = (u: UserProfile) =>
    u.id === 'admin_mady1baevv' || (u.email || '').toLowerCase() === ADMIN_EMAIL;

  return merged.sort((a, b) => {
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
      const stored = getAllUsers();
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
        const { userId, data } = req.body || {};
        if (!userId) {
          return res.status(400).json({ ok: false, error: 'Отсутствует userId' });
        }
        const updated = updateUser(userId, data);
        return res.status(200).json({ ok: true, user: updated });
      }

      if (action === 'delete') {
        const { userId } = req.body || {};
        if (!userId) {
          return res.status(400).json({ ok: false, error: 'Отсутствует userId' });
        }
        const deleted = deleteUser(userId);
        return res.status(200).json({ ok: true, deleted });
      }

      if (action === 'create') {
        const { user } = req.body || {};
        if (!user) {
          return res.status(400).json({ ok: false, error: 'Отсутствуют данные пользователя' });
        }
        const created = upsertUser(user);
        return res.status(200).json({ ok: true, user: created });
      }

      // Default POST behavior: upsert user
      const user = req.body?.user || req.body;
      const saved = upsertUser(user);
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
