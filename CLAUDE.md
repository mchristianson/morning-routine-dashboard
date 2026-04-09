# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start local development server
npm run build    # Production build
npm run lint     # ESLint via Next.js
```

## Architecture

**Next.js 15 App Router** dashboard with two key layers:

1. **Frontend**: `app/page.tsx` — single client component that fetches `/api/data` on load and renders all dashboard sections with weather-based gradient backgrounds.

2. **API**: `app/api/data/route.ts` — aggregates all data sources in parallel via `Promise.all()`, returns a single JSON object. Falls back to mock data if any source fails.

3. **Data fetching**: `lib/data-fetcher.ts` — all external API calls live here. Each data source has its own function. Weather (OpenWeatherMap) and News (NewsAPI) are implemented; Gmail (multi-account), Google Calendar, and Medium RSS are stubbed and ready to implement.

4. **Cron**: `app/api/cron/route.ts` — Vercel calls this at 6 AM CT weekdays (configured in `vercel.json`). Currently a stub; intended to pre-fetch and cache data to Vercel KV.

## Data flow

```
page.tsx → GET /api/data → data-fetcher.ts → External APIs
```

The `/api/data` response shape is defined inline in `app/api/data/route.ts` and consumed directly in `app/page.tsx`.

## Key implementation details

- **Gmail priority scoring**: `_calculateEmailPriority()` in `lib/data-fetcher.ts` scores emails; 50+ points = high priority. Supports two Google accounts via `GOOGLE_REFRESH_TOKEN_ACCOUNT1` / `GOOGLE_REFRESH_TOKEN_ACCOUNT2`.
- **Weather-based theming**: Four Tailwind gradient presets (`gradient-clear`, `gradient-cloudy`, `gradient-rainy`, `gradient-sunny`) defined in `tailwind.config.ts`; selected in `page.tsx` based on weather condition string.
- **Location hardcoded**: Weather coordinates (44.6°N, -93.3°W — Lakeville, MN) are hardcoded in `lib/data-fetcher.ts`.

## Environment variables

See `.env.example` for all required keys: `CRON_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN_ACCOUNT1`, `GOOGLE_REFRESH_TOKEN_ACCOUNT2`, `OPENWEATHER_API_KEY`, `NEWS_API_KEY`.

`scratch/get-token.js` is a one-off script for generating Google OAuth refresh tokens — not part of the app.
