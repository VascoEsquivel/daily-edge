// DAILY EDGE — data relay (Cloudflare Worker)
// Two jobs, both read-only GET:
// 1. Kalshi market data: their public API sends no CORS headers, so a browser can't
//    read it directly. No auth, no keys, no order endpoints — market data only.
// 2. ESPN relay: ESPN's data API is geo-blocked from some countries/ISPs; viewers
//    there route ESPN reads through this worker (Cloudflare egress, not their ISP).
const ROUTES = [
  ['/espn-site', 'https://site.api.espn.com'],
  ['/espn-core', 'https://sports.core.api.espn.com'],
  ['/espn-web', 'https://site.web.api.espn.com'],
];
const KALSHI = 'https://api.elections.kalshi.com';
const KALSHI_PATH = /^\/trade-api\/v2\/(events|markets|series)\b/;   // read-only market data
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

    let upstream = null;
    for (const [prefix, host] of ROUTES)
      if (url.pathname.startsWith(prefix + '/')) upstream = host + url.pathname.slice(prefix.length) + url.search;
    if (!upstream && KALSHI_PATH.test(url.pathname)) upstream = KALSHI + url.pathname + url.search;
    if (!upstream) return new Response('forbidden path', { status: 403, headers: cors });
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
