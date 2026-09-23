import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllUsers, updateUser, deleteUser, upsertUser } from '../usersStore.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const users = getAllUsers();
      return res.status(200).json({
        ok: true,
        success: true,
        users,
        total: users.length,
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
