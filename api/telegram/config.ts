export default function handler(req: any, res: any) {
  if (res.setHeader) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'kyrgyzakylman_bot';
  const botId = '8778115011';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://kyrgyzakylman.com';

  const data = {
    ok: true,
    success: true,
    botUsername,
    botId,
    siteUrl,
    hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN),
  };

  return res.status ? res.status(200).json(data) : new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET() {
  const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'kyrgyzakylman_bot';
  const botId = '8778115011';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://kyrgyzakylman.com';

  return new Response(
    JSON.stringify({
      ok: true,
      success: true,
      botUsername,
      botId,
      siteUrl,
      hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
