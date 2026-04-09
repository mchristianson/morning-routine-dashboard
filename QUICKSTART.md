# Quick Start (5 Minutes)

Already have your API keys ready? Here's the fast path:

## 1. Install & Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000 - you'll see the mock dashboard.

## 2. Add Your API Keys to `.env.local`

Get these from:
- **Google**: Client ID, Secret, Refresh Token (see SETUP_GUIDE.md)
- **OpenWeather**: API key from openweathermap.org
- **NewsAPI**: API key from newsapi.org
- **Cron Secret**: Generate with `openssl rand -hex 32`

```
CRON_SECRET=your-value
GOOGLE_CLIENT_ID=your-value
GOOGLE_CLIENT_SECRET=your-value
GOOGLE_REFRESH_TOKEN=your-value
OPENWEATHER_API_KEY=your-value
NEWS_API_KEY=your-value
```

## 3. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 4. Add Environment Variables in Vercel Dashboard

Copy all vars from `.env.local` into Vercel project settings → Environment Variables.

## 5. Set as Homepage

In your browser, set your Vercel URL as your homepage.

## Done!

Your dashboard auto-updates at 6 AM Monday-Friday. The cron job runs automatically via Vercel.

---

**Need detailed setup?** Read SETUP_GUIDE.md  
**Want API details?** Check README.md → Implementation Notes  
**Having issues?** See README.md → Troubleshooting
