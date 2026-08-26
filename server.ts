import express from 'express';
import path from 'path';
import cors from 'cors';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Включаем CORS для всех запросов
  app.use(cors());

  // Парсинг JSON и URL-encoded данных
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Проверка работоспособности сервера
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // TELEGRAM AUTH ENDPOINT
  // ==========================================
  app.post('/api/auth/telegram', (req, res) => {
    const data = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return res.status(500).json({ 
        success: false, 
        message: 'TELEGRAM_BOT_TOKEN не настроен в .env' 
      });
    }

    // Проверка подписи от Telegram
    const isValid = verifyTelegramAuth(data, botToken);
    if (!isValid) {
      return res.status(403).json({ 
        success: false, 
        message: 'Невалидная подпись Telegram' 
      });
    }

    // Проверка свежести данных (не старше 24 часов)
    if (Math.floor(Date.now() / 1000) - Number(data.auth_date) > 86400) {
      return res.status(400).json({ 
        success: false, 
        message: 'Данные авторизации устарели' 
      });
    }

    // Данные подлинные: извлекаем пользователя
    const { id, first_name, last_name, username, photo_url } = data;

    // Авторизация успешна
    return res.json({
      success: true,
      user: { id, first_name, last_name, username, photo_url },
    });
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
  });
}

// Функция проверки хэша Telegram (HMAC-SHA256)
function verifyTelegramAuth(data: Record<string, any>, botToken: string): boolean {
  const { hash, ...userData } = data;
  if (!hash) return false;

  const dataCheckString = Object.keys(userData)
    .sort()
    .map((key) => `${key}=${userData[key]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}

startServer();
