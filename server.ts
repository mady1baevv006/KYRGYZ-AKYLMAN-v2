import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// In-memory store for 1-Click Telegram Deep Link Sessions
interface AuthSession {
  token: string;
  status: 'pending' | 'authorized' | 'expired';
  user?: {
    id: number | string;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
  };
  createdAt: number;
}

const authSessions = new Map<string, AuthSession>();

// Cleanup stale sessions older than 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of authSessions.entries()) {
    if (now - session.createdAt > 15 * 60 * 1000) {
      authSessions.delete(token);
    }
  }
}, 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON and URL-encoded body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // 1. Initialize Telegram 1-Click Session (supports GET & POST)
  app.all('/api/auth/init-session', (req, res) => {
    const randomPart = crypto.randomBytes(6).toString('hex');
    const timestampPart = Date.now().toString(36);
    const token = `auth_${randomPart}_${timestampPart}`;

    const session: AuthSession = {
      token,
      status: 'pending',
      createdAt: Date.now(),
    };

    authSessions.set(token, session);

    const botUsername = 'kyrgyzakylmanofficialbot';
    const telegramDeepLink = `https://t.me/${botUsername}?start=${token}`;

    return res.json({
      success: true,
      token,
      botUsername,
      telegramDeepLink,
      expiresIn: 900, // 15 minutes
    });
  });

  // 2. Check Auth Session Status (supports GET, POST & OPTIONS) - Polling endpoint
  app.all('/api/auth/check-status', (req, res) => {
    const token = (req.query.token as string) || (req.body && req.body.token);

    if (!token) {
      return res.status(400).json({
        success: false,
        authorized: false,
        error: 'Параметр token обязателен для проверки статуса',
      });
    }

    const session = authSessions.get(token);

    if (!session) {
      return res.json({
        success: true,
        authorized: false,
        status: 'not_found',
        message: 'Сессия не найдена или истекла',
      });
    }

    if (session.status === 'authorized' && session.user) {
      return res.json({
        success: true,
        authorized: true,
        status: 'authorized',
        user: session.user,
      });
    }

    return res.json({
      success: true,
      authorized: false,
      status: 'pending',
      message: 'Ожидание подтверждения от Telegram бота',
    });
  });

  // 3. Telegram Bot Webhook Endpoint (handles /start auth_xyz123)
  app.all('/api/telegram/webhook', async (req, res) => {
    try {
      const text = req.body?.message?.text || '';
      const chatId = req.body?.message?.chat?.id;
      const from = req.body?.message?.from;

      if (text.startsWith('/start') && from) {
        const token = text.startsWith('/start ') ? text.split(' ')[1]?.trim() : '';

        if (token) {
          const userObj = {
            id: from.id,
            telegramId: from.id,
            first_name: from.first_name || '',
            last_name: from.last_name || '',
            username: from.username || '',
            auth_date: Math.floor(Date.now() / 1000),
          };

          // Update session status to authorized
          const existingSession = authSessions.get(token);
          if (existingSession) {
            existingSession.status = 'authorized';
            existingSession.user = userObj;
          } else {
            authSessions.set(token, {
              token,
              status: 'authorized',
              user: userObj,
              createdAt: Date.now(),
            });
          }

          console.log(`[Telegram Webhook] Token ${token} successfully authorized for user @${from.username || from.id}`);
        }

        // Send confirmation message to user in Telegram immediately
        if (process.env.BOT_TOKEN && chatId) {
          try {
            await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN.trim()}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: '✅ Вы успешно авторизовались на сайте KYRGYZ AKYLMAN! Вернитесь на страницу браузера.',
              }),
            });
          } catch (tgErr) {
            console.error('Ошибка отправки ответного сообщения в Telegram:', tgErr);
          }
        }
      }

      return res.status(200).json({ ok: true });
    } catch (err: any) {
      console.error('Ошибка обработки Webhook Telegram:', err);
      return res.status(200).json({ ok: true, error: err.message });
    }
  });

  // 4. Fallback Manual Confirm endpoint for session authorization
  app.all('/api/auth/confirm-session', (req, res) => {
    const token = (req.query.token as string) || (req.body && req.body.token);
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    const userData = {
      id: req.body?.id || req.query.id || 8877236146,
      first_name: req.body?.first_name || req.query.first_name || 'Студент',
      last_name: req.body?.last_name || req.query.last_name || '',
      username: req.body?.username || req.query.username || 'kyrgyzakylman_user',
      auth_date: Math.floor(Date.now() / 1000),
    };

    authSessions.set(token, {
      token,
      status: 'authorized',
      user: userData,
      createdAt: Date.now(),
    });

    return res.json({
      success: true,
      message: 'Сессия успешно подтверждена',
      user: userData,
    });
  });

  // 5. Telegram auth verification endpoint using HMAC-SHA256 (supports POST & GET)
  app.all('/api/auth/telegram', (req, res) => {
    if (req.method !== 'POST') {
      return res.json({ success: true, message: 'Telegram Auth endpoint ready' });
    }

    try {
      const telegramData = req.body;
      if (!telegramData || !telegramData.id) {
        return res.status(400).json({ success: false, error: 'Данные от Telegram не получены' });
      }

      const botToken = process.env.BOT_TOKEN;
      if (!botToken) {
        console.warn('BOT_TOKEN не задан в переменных окружения. Авторизация Telegram пропущена в режиме разработки.');
        return res.json({
          success: true,
          verified: false,
          user: telegramData,
          message: 'BOT_TOKEN не задан, авторизовано в режиме разработки',
        });
      }

      const { hash, ...userData } = telegramData;
      if (!hash) {
        return res.status(400).json({ success: false, error: 'Отсутствует подпись (hash) Telegram' });
      }

      // 1. Filter and sort all valid fields alphabetically: key=value\n
      const checkString = Object.keys(userData)
        .filter((key) => userData[key] !== undefined && userData[key] !== null && key !== 'hash')
        .sort()
        .map((key) => `${key}=${userData[key]}`)
        .join('\n');

      // 2. Compute secret_key = SHA256(botToken)
      const secretKey = crypto.createHash('sha256').update(botToken.trim()).digest();

      // 3. Compute HMAC-SHA256(checkString, secretKey)
      const calculatedHash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

      // 4. Safe compare hashes
      const calculatedBuffer = Buffer.from(calculatedHash, 'utf8');
      const receivedBuffer = Buffer.from(String(hash).toLowerCase(), 'utf8');

      if (calculatedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(calculatedBuffer, receivedBuffer)) {
        console.warn('HMAC mismatch:', { calculatedHash, receivedHash: hash, checkString });
        return res.status(401).json({
          success: false,
          error: 'Недействительная подпись данных Telegram (hash mismatch)',
        });
      }

      return res.json({
        success: true,
        verified: true,
        user: telegramData,
      });
    } catch (err: any) {
      console.error('Ошибка проверки подписи Telegram:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Ошибка сервера при проверке подписи Telegram',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Auto-register Telegram Webhook on server start
    if (process.env.BOT_TOKEN) {
      fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN.trim()}/setWebhook?url=https://www.kyrgyzakylman.com/api/telegram/webhook`)
        .then(() => console.log('Webhook registered successfully'))
        .catch((err) => console.error('Webhook error:', err));
    }
  });
}

startServer();
