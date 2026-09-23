import type { VercelRequest, VercelResponse } from '@vercel/node';
import { upsertUser } from '../usersStore.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const user = req.body?.user || req.body;
    if (!user || typeof user !== 'object') {
      return res.status(400).json({ ok: false, error: 'Invalid user payload' });
    }

    const saved = upsertUser(user);
    return res.status(200).json({
      ok: true,
      success: true,
      user: saved,
    });
  } catch (err: any) {
    console.error('[API /api/users/sync] Error:', err);
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Server error',
    });
  }
}
