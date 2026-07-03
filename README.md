# ⚡ DAILY EDGE — Sports Prediction Engine

**Live site: https://vascoesquivel.github.io/daily-edge/**

A single-file sports prediction dashboard. No build, no backend — one HTML file pulling live data from ESPN's public API.

## What it does
- **Daily slates** for MLB, WNBA, World Cup, tennis (ATP/WTA), MLS, NBA, NHL, NFL
- **Win probabilities** from regressed records + log5 matchup math + home advantage (ranking points for tennis, points-per-game for soccer, market prior for tournament knockouts)
- **⭐ Best pick per match** — expected value vs the listed line, ¼-Kelly stake sizing, and an honest PASS when nothing beats the vig
- **💰 The Card** — the whole day's +EV plays across every sport in one view
- **🎟️ Bet slip** — build parlays with combined odds, model hit probability, and EV
- **⚡ Live win probability** (Stern model) updating every minute, with movement vs the opening line
- **🧠 Learning brain** — per-team Elo + calibration layers updated from every final, persisted in your browser; match-by-match history and a settled-pick P/L ledger

## Run locally
Open `index.html` in a browser. That's it.

## Honest disclaimer
Predictions are statistical estimates for entertainment and research. The model doesn't know injuries, pitchers, or lineups — sportsbooks do. No model prints money; bet what you can afford to lose.
