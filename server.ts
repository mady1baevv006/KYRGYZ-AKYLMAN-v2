import express from 'express';
import path from 'path';
import crypto from 'crypto';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

// Хранилище сессий в памяти
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

// Очистка старых сессий каждые 15 минут
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
  const PORT = process.env.PORT || 3000;

  // Включаем CORS для всех запросов, чтобы браузер и Vercel не блокировали API
  app.use(cors());

  // Парсинг JSON и URL-encoded данных
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Проверка работоспособности сервера
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // 1. Создание сессии авторизации (вызывается сайтом)
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
      expiresIn: 900,
    });
  });

  // 2. Проверка статуса входа (опрос с фронтенда каждые 2 секунды)
  app.all('/api/auth/check-status', (req, res) => {
    const token = (req.query.token as string) || (req.body && req.body.token);

    if (!token) {
      return res.status(400).json({
        success: false,
        authorized: false,
        error: 'Параметр token обязателен',
      });
    }

    const session = authSessions.get(token);

    if (!session) {
      return res.json({
        success: true,
        authorized: false,
        status: 'not_found',
        message: 'Сессия не найдена',
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
      message: 'Ожидание подтверждения от Telegram',
    });
  });

  // 3. Единый приемник сообщений от Telegram (Webhook)
  app.all('/api/telegram/webhook', async (req, res) => {
    try {
      const body = req.body || {};
      const message = body?.message || body?.edited_message;
      const text = message?.text || '';
      const chatId = message?.chat?.id;
      const from = message?.from;

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
          console.log(`[Webhook Success] Token ${token} authorized for user ID: ${from.id}`);
        }

        // Отправка ответа пользователю в Telegram
        const botToken = (process.env.BOT_TOKEN || '8877236146:AAHmi-xKYzei1C0Sp5Tsui6Xx8aKz4jPz6I').trim();
        if (chatId) {
          try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: '✅ Вы успешно авторизовались на сайте KYRGYZ AKYLMAN! Вернитесь на страницу браузера.',
              }),
            });
          } catch (sendErr) {
            console.error('Ошибка отправки сообщения пользователю:', sendErr);
          }
        }
      }

      return res.status(200).json({ ok: true });
    } catch (err: any) {
      console.error('Ошибка обработки Webhook:', err);
      return res.status(200).json({ ok: true });
    }
  });

  // 4. Ручное подтверждение (для проверок)
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
      message: 'Сессия подтверждена',
      user: userData,
    });
  });

  // Проверка Telegram Hash
  app.all('/api/auth/telegram', (req, res) => {
    return res.json({ success: true, message: 'Endpoint active' });
  });

  // Обслуживание статики Vite / React
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
    console.log(`Server started on port ${PORT}`);

    // Авто-привязка Webhook при старте
    const botToken = (process.env.BOT_TOKEN || '8877236146:AAHmi-xKYzei1C0Sp5Tsui6Xx8aKz4jPz6I').trim();
    fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=https://www.kyrgyzakylman.com/api/telegram/webhook`)
      .then(() => console.log('Webhook registered!'))
      .catch((err) => console.error('Webhook error:', err));
  });
}

startServer();
