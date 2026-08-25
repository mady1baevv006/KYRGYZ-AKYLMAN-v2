import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Telegram auth verification endpoint using HMAC-SHA256
  app.post('/api/auth/telegram', (req, res) => {
    try {
      const telegramData = req.body;
      if (!telegramData || !telegramData.id) {
        return res.status(400).json({ success: false, error: 'Данные от Telegram не получены' });
      }

      const botToken = process.env.BOT_TOKEN;
      if (!botToken) {
        // If BOT_TOKEN is not yet set in environment variables, accept data with note for development
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

      // 5. Verify auth_date freshness (e.g. 24 hours max)
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const authDate = Number(telegramData.auth_date);
      if (nowInSeconds - authDate > 86400) {
        return res.status(401).json({
          success: false,
          error: 'Срок действия данных авторизации Telegram истек',
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
  });
}

startServer();
