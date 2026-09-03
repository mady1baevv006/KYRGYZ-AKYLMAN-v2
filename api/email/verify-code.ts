import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFirestoreAdmin } from '../_firebaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ error: 'Укажите email и код' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  try {
    const db = getFirestoreAdmin();
    const docRef = db.collection('emailLoginCodes').doc(normalizedEmail);
    const snap = await docRef.get();

    if (!snap.exists) {
      return res.status(400).json({ error: 'Код не найден. Запросите новый.' });
    }

    const data = snap.data() as { code: string; expiresAt: number; attempts: number };

    if (Date.now() > data.expiresAt) {
      await docRef.delete();
      return res.status(400).json({ error: 'Срок действия кода истёк. Запросите новый.' });
    }

    if ((data.attempts || 0) >= 5) {
      await docRef.delete();
      return res.status(400).json({ error: 'Слишком много попыток. Запросите новый код.' });
    }

    if (String(code).trim() !== data.code) {
      await docRef.update({ attempts: (data.attempts || 0) + 1 });
      return res.status(400).json({ error: 'Неверный код' });
    }

    await docRef.delete();
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('verify-code error:', err);
    return res.status(500).json({ error: 'Ошибка проверки кода. Попробуйте позже.' });
  }
}
