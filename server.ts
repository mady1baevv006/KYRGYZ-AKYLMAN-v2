import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// --- Telegram Bot Authentication State ---
interface TelegramAuthSession {
  token: string;
  createdAt: number;
  status: 'pending' | 'authenticated' | 'expired';
  origin?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
  };
}

const authSessions = new Map<string, TelegramAuthSession>();

// Cleanup expired sessions older than 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of authSessions.entries()) {
    if (now - session.createdAt > 15 * 60 * 1000) {
      authSessions.delete(token);
    }
  }
}, 60000);

let currentBotUsername = process.env.TELEGRAM_BOT_USERNAME || 'kyrgyzakylman_bot';
const botToken =
  process.env.TELEGRAM_BOT_TOKEN ||
  process.env.BOT_TOKEN ||
  '8778115011:AAGDKc9Sye6QPQR1yzU0pFJqXFXj0r5JQfM';

// Extract bot ID from token prefix
const botId = botToken.split(':')[0] || '8778115011';

/**
 * Verifies the Telegram Login Widget / WebApp data according to official Telegram specification:
 * https://core.telegram.org/widgets/login-legacy
 *
 * 1. Build data_check_string: alphabetical key=value joined by \n (excluding 'hash')
 * 2. secret_key = SHA256(botToken) [Widget] OR HMAC-SHA256("WebAppData", botToken) [WebApp]
 * 3. calculated_hash = HMAC-SHA256(secret_key, data_check_string)
 * 4. Verify auth_date freshness
 */
function verifyTelegramWidgetData(
  data: Record<string, any>,
  token: string
): { valid: boolean; error?: string; user?: any } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Неверные данные авторизации' };
  }

  const cleanToken = (token || process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || '8778115011:AAGDKc9Sye6QPQR1yzU0pFJqXFXj0r5JQfM')
    .trim()
    .replace(/^["']|["']$/g, '');

  const receivedHash = String(data.hash || '').trim().toLowerCase();
  if (!receivedHash) {
    return { valid: false, error: 'Отсутствует параметр hash' };
  }

  const authDate = Number(data.auth_date);
  if (!authDate || isNaN(authDate)) {
    return { valid: false, error: 'Некорректная дата auth_date' };
  }

  // Allow up to 3 days window to prevent issues with timezone/clock skew
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (nowSeconds - authDate > 86400 * 3) {
    return { valid: false, error: 'Срок действия авторизации истек (auth_date устарел)' };
  }

  // Telegram official Login Widget keys
  const telegramStandardKeys = ['auth_date', 'first_name', 'id', 'last_name', 'photo_url', 'username'];

  // Construct data_check_string variations:
  // Variation A: Only standard Telegram keys present in data
  const standardCheckArr: string[] = [];
  telegramStandardKeys.sort().forEach((key) => {
    const val = data[key];
    if (val !== undefined && val !== null && val !== '') {
      standardCheckArr.push(`${key}=${val}`);
    }
  });
  const standardDataCheckString = standardCheckArr.join('\n');

  // Variation B: All keys excluding 'hash'
  const allCheckArr: string[] = [];
  Object.keys(data)
    .filter((k) => k !== 'hash')
    .sort()
    .forEach((key) => {
      const val = data[key];
      if (val !== undefined && val !== null && val !== '') {
        allCheckArr.push(`${key}=${val}`);
      }
    });
  const allDataCheckString = allCheckArr.join('\n');

  // Key derivation 1: Classic Widget secret_key = SHA256(bot_token)
  const widgetSecretKey = crypto.createHash('sha256').update(cleanToken).digest();
  const hashWidgetStandard = crypto.createHmac('sha256', widgetSecretKey).update(standardDataCheckString).digest('hex').toLowerCase();
  const hashWidgetAll = crypto.createHmac('sha256', widgetSecretKey).update(allDataCheckString).digest('hex').toLowerCase();

  // Key derivation 2: WebApp secret_key = HMAC-SHA256("WebAppData", bot_token)
  const webAppSecretKey = crypto.createHmac('sha256', 'WebAppData').update(cleanToken).digest();
  const hashWebAppStandard = crypto.createHmac('sha256', webAppSecretKey).update(standardDataCheckString).digest('hex').toLowerCase();
  const hashWebAppAll = crypto.createHmac('sha256', webAppSecretKey).update(allDataCheckString).digest('hex').toLowerCase();

  const isMatched =
    receivedHash === hashWidgetStandard ||
    receivedHash === hashWidgetAll ||
    receivedHash === hashWebAppStandard ||
    receivedHash === hashWebAppAll;

  if (!isMatched) {
    console.error('[Telegram Auth Error] Hash mismatch details:', {
      receivedHash,
      calculatedWidgetStandard: hashWidgetStandard,
      calculatedWidgetAll: hashWidgetAll,
      calculatedWebAppStandard: hashWebAppStandard,
      standardDataCheckString,
      botTokenPrefix: cleanToken.substring(0, 10) + '...',
    });
    return {
      valid: false,
      error: 'Неверная цифровая подпись Telegram HMAC-SHA-256',
    };
  }

  return {
    valid: true,
    user: {
      id: Number(data.id),
      first_name: String(data.first_name || ''),
      last_name: data.last_name ? String(data.last_name) : undefined,
      username: data.username ? `@${String(data.username).replace(/^@/, '')}` : undefined,
      photo_url: data.photo_url ? String(data.photo_url) : undefined,
      auth_date: authDate,
    },
  };
}

async function setupTelegramBot() {
  if (!botToken) {
    console.log('[Telegram Auth] No TELEGRAM_BOT_TOKEN provided. Mock/Dev auth mode enabled.');
    return;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    if (res.ok) {
      const data = (await res.json()) as any;
      if (data.ok && data.result?.username) {
        currentBotUsername = data.result.username;
        console.log(`[Telegram Auth] Connected to @${currentBotUsername}`);
      }
    }
  } catch (err) {
    console.error('[Telegram Auth] Error connecting to Telegram API:', err);
  }

  // Start background long polling to capture /start auth_<token>
  startTelegramPolling(botToken);
}

function handleTelegramMessage(message: any, token: string) {
  if (!message || !message.text) return;
  const text = message.text.trim();

  // Match /start auth_xxx or /start xxx
  if (text.startsWith('/start')) {
    const parts = text.split(/\s+/);
    const payload = parts[1] || '';

    let matchedToken = '';
    if (authSessions.has(payload)) {
      matchedToken = payload;
    } else if (payload.startsWith('auth_') && authSessions.has(payload.replace(/^auth_/, ''))) {
      matchedToken = payload.replace(/^auth_/, '');
    } else if (authSessions.has(`auth_${payload}`)) {
      matchedToken = `auth_${payload}`;
    }

    if (matchedToken && authSessions.has(matchedToken)) {
      const session = authSessions.get(matchedToken)!;
      const from = message.from;

      session.status = 'authenticated';
      session.user = {
        id: from.id,
        first_name: from.first_name || 'Ученик',
        last_name: from.last_name || '',
        username: from.username ? `@${from.username}` : `@id${from.id}`,
        auth_date: Math.floor(Date.now() / 1000),
      };

      console.log(`[Telegram Auth] Successfully authenticated user @${from.username || from.id} for session ${matchedToken}`);

      const siteBaseUrl = (session.origin || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://kyrgyzakylman.com').replace(/\/+$/, '');
      const returnUrl = `${siteBaseUrl}/?tg_auth=${matchedToken}`;

      // Send confirmation message with a button back to the site
      const replyText = `🎉 *Салам, ${from.first_name || 'Окуучу'}!*\n\n✅ Сиз *«Кыргыз Акылман»* платформасына кирүүнү ийгиликтүү ырастадыңыз!\n\nСайттагы баракчаңыз даяр. Сайтка кайтуу үчүн төмөнкү баскычты басыңыз же браузериңизди ачыңыз:`;

      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: replyText,
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🌐 Сайтка өтүү (Кабинетке кирүү)',
                  url: returnUrl,
                },
              ],
            ],
          },
        }),
      }).catch((e) => console.error('[Telegram Auth] Failed to send confirmation message:', e));
    } else {
      // General greeting for /start without token
      const greeting = `👋 *Салам, ${message.from?.first_name || 'досум'}!*\n\nБул *«Кыргыз Акылман»* ЖРТ даярдоо платформасынын расмий авторизация боту.\n\nСайтка кирүү үчүн сайттагы *«Telegram аркылуу кирүү»* баскычын басыңыз.`;
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: greeting,
          parse_mode: 'Markdown',
        }),
      }).catch(() => {});
    }
  }
}

async function startTelegramPolling(token: string) {
  let offset = 0;
  console.log('[Telegram Auth] Started long polling listener for Telegram updates...');

  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=25`);
      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.ok && Array.isArray(data.result)) {
          for (const update of data.result) {
            offset = Math.max(offset, update.update_id + 1);
            if (update.message) {
              handleTelegramMessage(update.message, token);
            }
          }
        }
      } else {
        await new Promise((r) => setTimeout(r, 4000));
      }
    } catch {
      await new Promise((r) => setTimeout(r, 4000));
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      telegramBot: currentBotUsername,
      hasBotToken: Boolean(botToken),
    });
  });

  // --- Telegram Bot Auth Endpoints ---

  // 1. Get Telegram Bot info & ID
  app.get('/api/telegram/config', (req, res) => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || (req.headers.origin as string) || 'https://kyrgyzakylman.com';
    res.json({
      ok: true,
      botUsername: currentBotUsername,
      botId,
      siteUrl,
      hasToken: Boolean(botToken),
    });
  });

  // 2. Verify Telegram Login Widget authentication (Official HMAC-SHA-256 verification, supporting POST, GET & OPTIONS)
  const handleTelegramVerify = (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    try {
      // Support payload in req.body (POST) or req.query (GET)
      const payload =
        req.method === 'GET'
          ? (req.query as Record<string, any>)
          : req.body && Object.keys(req.body).length > 0
          ? req.body
          : (req.query as Record<string, any>);

      console.log(`[Telegram Auth API] Incoming ${req.method} verification request:`, payload ? Object.keys(payload) : null);

      if (!payload || typeof payload !== 'object' || !payload.hash) {
        return res.status(400).json({
          success: false,
          ok: false,
          error: 'Отсутствуют данные авторизации Telegram или параметр hash',
        });
      }

      const activeToken = (
        process.env.TELEGRAM_BOT_TOKEN ||
        process.env.BOT_TOKEN ||
        botToken ||
        '8778115011:AAGDKc9Sye6QPQR1yzU0pFJqXFXj0r5JQfM'
      ).trim();

      if (!activeToken) {
        return res.status(500).json({
          success: false,
          ok: false,
          error: 'Telegram Bot Token не задан в переменных окружения сервера',
        });
      }

      const result = verifyTelegramWidgetData(payload, activeToken);
      if (!result.valid) {
        console.warn('[Telegram Auth API] Verification failed:', result.error);
        return res.status(401).json({
          success: false,
          ok: false,
          error: result.error || 'Ошибка проверки цифровой подписи Telegram',
        });
      }

      console.log(
        `[Telegram Widget] Successfully verified user @${result.user?.username || result.user?.id} via HMAC-SHA-256`
      );

      return res.status(200).json({
        success: true,
        ok: true,
        user: result.user,
      });
    } catch (err: any) {
      console.error('[Telegram Auth API] Server exception:', err);
      return res.status(500).json({
        success: false,
        ok: false,
        error: err?.message || 'Внутренняя ошибка сервера при обработке авторизации Telegram',
      });
    }
  };

  app.all('/api/telegram/verify-widget', handleTelegramVerify);
  app.all('/api/auth/telegram', handleTelegramVerify);
  app.all('/api/telegram/verify', handleTelegramVerify);

  // 3. Generate new Telegram Auth Session (for direct bot /start fallback)
  app.post('/api/telegram/create-session', (req, res) => {
    const token = 'akylman_' + crypto.randomBytes(16).toString('hex');
    const detectedOrigin =
      req.body?.origin ||
      (req.headers.origin as string) ||
      (req.headers.referer ? new URL(req.headers.referer).origin : '') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      'https://kyrgyzakylman.com';

    const session: TelegramAuthSession = {
      token,
      createdAt: Date.now(),
      status: 'pending',
      origin: detectedOrigin,
    };
    authSessions.set(token, session);

    const botUrl = `https://t.me/${currentBotUsername}?start=${token}`;
    res.json({
      ok: true,
      token,
      botUrl,
      botUsername: currentBotUsername,
      origin: detectedOrigin,
    });
  });

  // 3. Check/Poll Telegram Auth Session Status
  app.get('/api/telegram/check-session', (req, res) => {
    const token = String(req.query.token || '');
    if (!token || !authSessions.has(token)) {
      return res.json({ ok: false, status: 'expired', error: 'Сессия не найдена или истекла' });
    }

    const session = authSessions.get(token)!;
    res.json({
      ok: true,
      status: session.status,
      user: session.user || null,
    });
  });

  // 4. Mock / Dev Confirm Auth (allows testing in preview or dev mode)
  app.post('/api/telegram/mock-authenticate', (req, res) => {
    const { token, username, firstName } = req.body;
    if (!token || !authSessions.has(token)) {
      return res.status(404).json({ ok: false, error: 'Сессия не найдена' });
    }

    const session = authSessions.get(token)!;
    session.status = 'authenticated';
    session.user = {
      id: Math.floor(100000000 + Math.random() * 900000000),
      first_name: firstName || 'Тестовый Ученик',
      username: username ? (username.startsWith('@') ? username : `@${username}`) : '@test_student',
      auth_date: Math.floor(Date.now() / 1000),
    };

    res.json({ ok: true, session });
  });

  // 5. Telegram Webhook Endpoint (optional alternative to polling)
  app.post('/api/telegram/webhook', (req, res) => {
    const update = req.body;
    if (update && update.message && botToken) {
      handleTelegramMessage(update.message, botToken);
    }
    res.json({ ok: true });
  });

  // Initialize bot connection in background
  setupTelegramBot().catch((e) => console.error('[Telegram Init Error]', e));

  // Vite middleware for development vs static build for production
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

