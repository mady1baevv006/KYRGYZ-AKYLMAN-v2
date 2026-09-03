import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { getFirestoreAdmin } from '../firebaseAdmin';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Некорректный email' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const code = generateCode();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  try {
    const db = getFirestoreAdmin();
    await db.collection('emailLoginCodes').doc(normalizedEmail).set({
      code,
      expiresAt,
      attempts: 0,
    });

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'KYRGYZ AKYLMAN <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: `Код входа: ${code}`,
      html: `<div style="font-family:sans-serif;font-size:16px;">
        <p>Ваш код для входа на сайт KYRGYZ AKYLMAN:</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:4px;">${code}</p>
        <p>Код действителен 10 минут. Если это были не вы — просто проигнорируйте это письмо.</p>
      </div>`,
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('send-code error:', err);
    return res.status(500).json({ error: 'Не удалось отправить код. Попробуйте позже.' });
  }
}
