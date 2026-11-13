import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findUserAsync, upsertUserAsync } from '../usersStore.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { id, email, identifier, telegramId, telegramUsername } = (req.query || {}) as Record<string, string | undefined>;
      const found = await findUserAsync({
        id,
        email,
        identifier,
        telegramId,
        telegramUsername,
      });
      return res.status(200).json({
        ok: true,
        success: true,
        user: found,
      });
    }

    if (req.method === 'POST') {
      const user = req.body?.user || req.body;
      if (!user || typeof user !== 'object') {
        return res.status(400).json({ ok: false, error: 'Invalid user payload' });
      }

      const saved = await upsertUserAsync(user, { fromAdmin: false });
      return res.status(200).json({
        ok: true,
        success: true,
        user: saved,
      });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[API /api/users/sync] Error:', err);
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Server error',
    });
  }
}
