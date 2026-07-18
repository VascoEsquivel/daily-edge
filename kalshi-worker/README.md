# DAILY EDGE — data relay (Kalshi prices + ESPN geo-unblock)

One tiny read-only Cloudflare Worker, two jobs:
1. **Kalshi live prices** — Kalshi's public market API blocks browser reads (no CORS).
2. **ESPN relay** — ESPN's data API is geo-blocked from some countries/ISPs (e.g. the
   Philippines). Friends abroad paste this worker's URL into the app's 💹 box and the
   app automatically pulls ESPN through it when direct access fails.

Free tier is far more than enough (100k requests/day; the app makes ~1 per sport per
minute). Share the deployed URL with anyone you share the site with.

## Deploy (one time, ~2 minutes)

1. You need a free Cloudflare account (dash.cloudflare.com — sign up yourself).
2. In a terminal, from this folder:

   ```
   npx wrangler deploy
   ```

   The first run opens a browser window asking you to log in to Cloudflare and
   authorize Wrangler — approve it, then the deploy finishes and prints your URL:

   ```
   https://daily-edge-kalshi.<your-subdomain>.workers.dev
   ```

3. Open DAILY EDGE → brain bar → **more ▾** → paste that URL into the
   **Kalshi proxy** box. Done — live Kalshi prices start flowing into the
   ⚡ LIVE EDGE console, pregame value chips, and the hedge assistant.

## What it does / doesn't do

- Forwards ONLY read-only GET requests under `/trade-api/v2/(events|markets|series)`.
- No API keys, no account access, no order placement — market data only.
- 5-second edge cache so Kalshi never sees more than ~1 request/5s per endpoint.
- CORS is restricted to the DAILY EDGE origin (and localhost for dev) — edit
  `ALLOW_ORIGINS` in worker.js if you fork the app elsewhere.
