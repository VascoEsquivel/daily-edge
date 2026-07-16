// DAILY EDGE — Kalshi CORS proxy (Cloudflare Worker)
// Kalshi's public market-data API sends no CORS headers, so a browser page can't read
// it directly. This worker forwards READ-ONLY GET requests to the public trade API and
// adds CORS. No auth, no keys, no order endpoints — market data only.
const UPSTREAM = 'https://api.elections.kalshi.com';
const ALLOW_PATH = /^\/trade-api\/v2\/(events|markets|series)\b/;   // read-only market data
const ALLOW_ORIGINS = [
  'https://vascoesquivel.github.io',
  'http://localhost:4173', 'http://127.0.0.1:4173',   // local preview
];

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const origin = req.headers.get('origin') || '';
    const cors = {
      'access-control-allow-origin': ALLOW_ORIGINS.includes(origin) ? origin : ALLOW_ORIGINS[0],
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'accept, content-type',
      'vary': 'origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'GET') return new Response('GET only', { status: 405, headers: cors });
    if (!ALLOW_PATH.test(url.pathname)) return new Response('forbidden path', { status: 403, headers: cors });

    const upstream = UPSTREAM + url.pathname + url.search;
    const r = await fetch(upstream, {
      headers: { accept: 'application/json' },
      cf: { cacheTtl: 5, cacheEverything: true },        // 5s edge cache — kind to Kalshi, fresh enough for live
    });
    return new Response(r.body, {
      status: r.status,
      headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=5', ...cors },
    });
  },
};
