import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { setMemoryEmailCode } from './codeStore.js';

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

  // 1. Always store in shared in-memory code store
  setMemoryEmailCode(normalizedEmail, code, expiresAt);

  // 2. Try Firestore if credentials exist
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      const { getFirestoreAdmin } = await import('../firebaseAdmin.js');
      const db = getFirestoreAdmin();
      await db.collection('emailLoginCodes').doc(normalizedEmail).set({
        code,
        expiresAt,
        attempts: 0,
      });
    }
  } catch (dbErr) {
    console.warn('[Email Auth] Firestore write skipped/fallback to memory:', dbErr);
  }

  // 3. Try sending email via Resend if RESEND_API_KEY is configured
  let sentViaEmail = false;
  let emailErrorMessage = '';
  if (!process.env.RESEND_API_KEY) {
    emailErrorMessage = 'не настроена отправка писем (нет RESEND_API_KEY)';
  } else {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const sendResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'KYRGYZ AKYLMAN <onboarding@resend.dev>',
        to: normalizedEmail,
        subject: `Код входа: ${code}`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <div style="background:#041d16;padding:24px;text-align:center;border-radius:16px 16px 0 0;">
            <img src="https://res.cloudinary.com/rw9qhk3a/image/upload/v1786956449/%D0%A4%D0%B0%D0%B2%D0%B8%D0%BA%D0%BE%D0%BD_KYRGYZ_AKYLMAN.png" alt="KYRGYZ AKYLMAN" width="56" height="56" style="border-radius:12px;" />
            <p style="color:#ffffff;font-size:18px;font-weight:bold;margin:12px 0 0;">KYRGYZ AKYLMAN</p>
          </div>
          <div style="padding:24px;font-size:16px;color:#111;">
            <p>Ваш код для входа на сайт KYRGYZ AKYLMAN:</p>
            <p style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#05261c;">${code}</p>
            <p style="color:#555;font-size:14px;">Код действителен 10 минут. Если это были не вы — просто проигнорируйте это письмо.</p>
          </div>
        </div>`,
      });
      if (sendResult.error) {
        emailErrorMessage = sendResult.error.message || 'ошибка сервиса почты';
        console.error('[Email Auth] Resend error:', sendResult.error);
      } else {
        sentViaEmail = true;
      }
    } catch (resendErr: any) {
      emailErrorMessage = resendErr?.message || 'ошибка сервиса почты';
      console.error('[Email Auth] Resend delivery failed:', resendErr);
    }
  }

  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

  // На боевом сайте код НИКОГДА не отдаём в браузер: иначе любой сможет войти под чужой почтой.
  if (!sentViaEmail && isProduction) {
    return res.status(502).json({
      error: `Не удалось отправить письмо с кодом: ${emailErrorMessage}`,
    });
  }

  console.log(`[Email Auth Code] Code generated for ${normalizedEmail} (sentViaEmail: ${sentViaEmail})`);

  return res.status(200).json({
    success: true,
    sentViaEmail,
    devCode: !isProduction && !sentViaEmail ? code : undefined,
    message: 'Код отправлен на почту',
  });
}

