import crypto from 'crypto';

function verifyTelegramWidgetData(
  data: Record<string, any>,
  token: string
): { valid: boolean; error?: string; user?: any } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Отсутствуют данные авторизации' };
  }

  const cleanToken = (token || process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || '8778115011:AAGDKc9Sye6QPQR1yzU0pFJqXFXj0r5JQfM')
    .trim()
    .replace(/^["']|["']$/g, '');

  const receivedHash = String(data.hash || '').trim().toLowerCase();
  if (!receivedHash) {
    return { valid: false, error: 'Отсутствует обязательный параметр hash' };
  }

  const authDate = Number(data.auth_date);
  if (!authDate || isNaN(authDate)) {
    return { valid: false, error: 'Некорректная дата auth_date' };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (nowSeconds - authDate > 86400 * 3) {
    // 3 days window to allow minor timezone / device clock differences
    return { valid: false, error: 'Срок действия авторизации истек (auth_date устарел)' };
  }

  // Telegram official Login Widget keys
  const telegramStandardKeys = ['auth_date', 'first_name', 'id', 'last_name', 'photo_url', 'username'];

  // Variation A: Only standard Telegram keys
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
    console.error('[Telegram Auth API Error] Hash mismatch details:', {
      receivedHash,
      calculatedWidgetStandard: hashWidgetStandard,
      calculatedWidgetAll: hashWidgetAll,
      calculatedWebAppStandard: hashWebAppStandard,
      standardDataCheckString,
      botTokenPrefix: cleanToken.substring(0, 10) + '...',
    });
    return { valid: false, error: 'Неверная цифровая подпись Telegram HMAC-SHA-256' };
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

function extractPayload(req: any): Record<string, any> {
  let payload: Record<string, any> = {};

  // Check query parameters (GET)
  if (req.query && Object.keys(req.query).length > 0) {
    payload = { ...req.query };
  }

  // Check body (POST)
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        payload = { ...payload, ...JSON.parse(req.body) };
      } catch {
        // May be URL encoded
        const params = new URLSearchParams(req.body);
        for (const [k, v] of params.entries()) {
          payload[k] = v;
        }
      }
    } else if (typeof req.body === 'object') {
      payload = { ...payload, ...req.body };
    }
  }

  // Check url search params if Web Request
  if (req.url && req.url.includes('?')) {
    try {
      const url = new URL(req.url, 'http://localhost');
      for (const [k, v] of url.searchParams.entries()) {
        if (!payload[k]) {
          payload[k] = v;
        }
      }
    } catch {}
  }

  return payload;
}

// 1. Standard Node.js Serverless Handler (Vercel Node / Express)
export default async function handler(req: any, res: any) {
  // Set CORS and JSON headers
  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  }

  if (req.method === 'OPTIONS') {
    return res.status ? res.status(200).end() : new Response(null, { status: 200 });
  }

  try {
    const payload = extractPayload(req);
    console.log(`[Telegram Auth Vercel] Incoming ${req.method} request:`, Object.keys(payload));

    if (!payload || !payload.hash) {
      const resp = {
        success: false,
        ok: false,
        error: 'Отсутствуют данные авторизации Telegram или параметр hash',
      };
      return res.status ? res.status(400).json(resp) : new Response(JSON.stringify(resp), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const botToken = (
      process.env.TELEGRAM_BOT_TOKEN ||
      process.env.BOT_TOKEN ||
      '8778115011:AAGDKc9Sye6QPQR1yzU0pFJqXFXj0r5JQfM'
    ).trim();

    const result = verifyTelegramWidgetData(payload, botToken);
    if (!result.valid) {
      const resp = {
        success: false,
        ok: false,
        error: result.error || 'Ошибка проверки цифровой подписи Telegram',
      };
      return res.status ? res.status(401).json(resp) : new Response(JSON.stringify(resp), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    console.log(`[Telegram Auth Vercel] Successfully verified user @${result.user?.username || result.user?.id}`);

    const resp = {
      success: true,
      ok: true,
      user: result.user,
    };
    return res.status ? res.status(200).json(resp) : new Response(JSON.stringify(resp), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    console.error('[Telegram Auth Vercel Exception]:', err);
    const resp = {
      success: false,
      ok: false,
      error: err?.message || 'Внутренняя ошибка сервера при авторизации Telegram',
    };
    return res.status ? res.status(500).json(resp) : new Response(JSON.stringify(resp), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// 2. Web Standards Handlers for Next.js App Router / Vercel Edge Runtime
export async function POST(request: Request) {
  try {
    let payload: Record<string, any> = {};
    try {
      payload = await request.json();
    } catch {
      const text = await request.text();
      const params = new URLSearchParams(text);
      for (const [k, v] of params.entries()) {
        payload[k] = v;
      }
    }

    const botToken = (
      process.env.TELEGRAM_BOT_TOKEN ||
      process.env.BOT_TOKEN ||
      '8778115011:AAGDKc9Sye6QPQR1yzU0pFJqXFXj0r5JQfM'
    ).trim();

    const result = verifyTelegramWidgetData(payload, botToken);
    if (!result.valid) {
      return new Response(JSON.stringify({ success: false, ok: false, error: result.error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ success: true, ok: true, user: result.user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, ok: false, error: err?.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const payload: Record<string, any> = {};
    for (const [k, v] of url.searchParams.entries()) {
      payload[k] = v;
    }

    const botToken = (
      process.env.TELEGRAM_BOT_TOKEN ||
      process.env.BOT_TOKEN ||
      '8778115011:AAGDKc9Sye6QPQR1yzU0pFJqXFXj0r5JQfM'
    ).trim();

    const result = verifyTelegramWidgetData(payload, botToken);
    if (!result.valid) {
      return new Response(JSON.stringify({ success: false, ok: false, error: result.error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify({ success: true, ok: true, user: result.user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, ok: false, error: err?.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    },
  });
}
