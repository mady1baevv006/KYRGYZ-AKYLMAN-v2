function resolveBotConfig() {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'kyrgyzakylman_bot';
  const token = (process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || '').trim();
  const botId = token.includes(':')
    ? token.split(':')[0]
    : (process.env.TELEGRAM_BOT_ID || process.env.VITE_TELEGRAM_BOT_ID || '8778115011');
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://kyrgyzakylman.com';

  return {
    ok: true,
    success: true,
    botUsername,
    botId,
    siteUrl,
    hasToken: Boolean(token),
  };
}

export default function handler(req: any, res: any) {
  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  const data = resolveBotConfig();
  return res.status ? res.status(200).json(data) : new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET() {
  const data = resolveBotConfig();
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
