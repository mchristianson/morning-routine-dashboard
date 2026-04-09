# Setup Checklist

Use this to track your progress setting up the morning routine dashboard.

## Phase 1: Local Development

- [ ] Clone/download project to your computer
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run dev` to start local server
- [ ] Visit http://localhost:3000 in browser
- [ ] See dashboard with mock data

## Phase 2: Google Setup

### Google Cloud Console

- [ ] Go to https://console.cloud.google.com
- [ ] Create new project named "Morning Routine Dashboard"
- [ ] Search for and enable "Gmail API"
- [ ] Search for and enable "Google Calendar API"
- [ ] Go to "Credentials" section
- [ ] Create "OAuth 2.0 Client ID" (Desktop application)
- [ ] Download credentials JSON
- [ ] Copy `client_id` to `.env.local` as `GOOGLE_CLIENT_ID`
- [ ] Copy `client_secret` to `.env.local` as `GOOGLE_CLIENT_SECRET`

### Get Refresh Token

- [ ] Create temporary `get-token.js` file (see SETUP_GUIDE.md)
- [ ] Run the script to get authorization URL
- [ ] Visit the URL and sign in
- [ ] Copy auth code from redirect URL
- [ ] Run script with code to get refresh token
- [ ] Copy refresh token to `.env.local` as `GOOGLE_REFRESH_TOKEN`
- [ ] Delete `get-token.js` file

## Phase 3: Weather & News APIs

### OpenWeatherMap

- [ ] Go to https://openweathermap.org/api
- [ ] Sign up for free account
- [ ] Get API key from account dashboard
- [ ] Add to `.env.local` as `OPENWEATHER_API_KEY`

### NewsAPI

- [ ] Go to https://newsapi.org
- [ ] Sign up for free account
- [ ] Verify email
- [ ] Get API key from account dashboard
- [ ] Add to `.env.local` as `NEWS_API_KEY`

## Phase 4: Generate Cron Secret

- [ ] Run: `openssl rand -hex 32`
- [ ] Copy output to `.env.local` as `CRON_SECRET`

## Phase 5: Deploy to Vercel

### GitHub Setup

- [ ] Go to https://github.com/new
- [ ] Create new repo: `morning-routine-dashboard` (Private recommended)
- [ ] Don't initialize with README
- [ ] Copy repo URL

### Push Code

- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Run: `git branch -M main`
- [ ] Run: `git remote add origin [paste-your-repo-url]`
- [ ] Run: `git push -u origin main`

### Vercel Deployment

- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Click "Import Git Repository"
- [ ] Paste your GitHub repo URL
- [ ] Click "Import"
- [ ] Name project: `morning-routine-dashboard`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy your Vercel URL (e.g., https://your-app.vercel.app)

## Phase 6: Environment Variables in Vercel

- [ ] Go to your Vercel project dashboard
- [ ] Click "Settings"
- [ ] Click "Environment Variables"
- [ ] Add all 6 variables:
  - [ ] `CRON_SECRET`
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `GOOGLE_REFRESH_TOKEN`
  - [ ] `OPENWEATHER_API_KEY`
  - [ ] `NEWS_API_KEY`
- [ ] Click "Deploy" again (to redeploy with env vars)

## Phase 7: Verify Cron Job

- [ ] Go to Vercel project dashboard
- [ ] Click "Deployments"
- [ ] Click on latest deployment
- [ ] Look for "Cron Jobs" section
- [ ] Should show: `0 6 * * 1-5` (6 AM, Mon-Fri)

## Phase 8: Set as Homepage

### Chrome/Edge

- [ ] Open your Vercel dashboard URL in Chrome
- [ ] Settings → On startup
- [ ] Select "Open a specific page or set of pages"
- [ ] Click "Add a new page"
- [ ] Paste your Vercel URL
- [ ] Click "Add"
- [ ] Close and reopen Chrome → should show dashboard

### Safari

- [ ] Open your Vercel URL in Safari
- [ ] Preferences → General
- [ ] Homepage: paste your Vercel URL
- [ ] When opening new windows: select "Homepage"

### iPhone

- [ ] Open your Vercel URL in Safari
- [ ] Tap Share button
- [ ] Scroll down, tap "Add to Home Screen"
- [ ] Name it "Morning Routine"
- [ ] Tap "Add"
- [ ] Open home screen → should have new icon

## Phase 9: Test

- [ ] Visit dashboard in browser
- [ ] Check it looks good on desktop
- [ ] Check it looks good on iPhone
- [ ] Verify all sections are displaying (quote, weather, emails, etc.)
- [ ] Click a few links to make sure they work

## Phase 10: Optional - Implement Real APIs

These are optional. Dashboard works with mock data, but real data is better:

- [ ] Implement Gmail API calls in `app/api/data/route.ts`
- [ ] Implement Calendar API calls in `app/api/data/route.ts`
- [ ] Implement Medium RSS parsing
- [ ] Set up Vercel KV for data caching
- [ ] Test real data locally before deploying

## Done! 🎉

Your morning routine dashboard is now live!

**What happens:**
- Every weekday at 6 AM CT, Vercel runs your cron job
- Data is fetched and ready when you wake up
- Visit your dashboard URL (or home screen app)
- See everything you need for your morning in 10 minutes

**Next mornings:**
- Check your dashboard while in bed (iPhone)
- Or open on any computer
- All your important info in one place
- Automatically updated every 6 AM

---

## Stuck Somewhere?

- **Local setup issues?** → See SETUP_GUIDE.md Part 1
- **Google OAuth issues?** → See SETUP_GUIDE.md Part 2
- **Deployment issues?** → See SETUP_GUIDE.md Part 5
- **General questions?** → See README.md
- **Quick answers?** → See PROJECT_SUMMARY.md

Good luck! ☀️
