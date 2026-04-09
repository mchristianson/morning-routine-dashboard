# Step-by-Step Setup Guide

## Part 1: Local Setup (10 minutes)

### Step 1: Install Dependencies

```bash
cd morning-routine-dashboard
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env.local
```

Open `.env.local` and you'll see:

```
CRON_SECRET=your-random-cron-secret-here
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
OPENWEATHER_API_KEY=...
NEWS_API_KEY=...
```

Keep this file open - we'll fill in the values as we go.

### Step 3: Test Locally (Optional)

```bash
npm run dev
```

Visit http://localhost:3000 - You'll see mock data with placeholder content. This confirms everything is working before we add real APIs.

---

## Part 2: Google Setup (20 minutes)

### Google Cloud Project Setup

1. Go to https://console.cloud.google.com
2. Click "Select a Project" → "New Project"
3. Name it "Morning Routine Dashboard"
4. Click "Create"

### Enable Gmail API

1. Search for "Gmail API" in the search bar
2. Click the first result
3. Click "Enable"
4. Wait for it to enable

### Enable Google Calendar API

1. Search for "Google Calendar API"
2. Click the result
3. Click "Enable"

### Create OAuth Credentials

1. Go to "Credentials" (left sidebar)
2. Click "Create Credentials" → "OAuth client ID"
3. Click "Create OAuth client ID" (if prompted, click "Configure consent screen" first)
4. For "Consent Screen":
   - User Type: Select "External"
   - Click "Create"
   - Fill in:
     - App name: "Morning Routine Dashboard"
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Click "Add or Remove Scopes"
   - Search for and add:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/calendar.readonly`
   - Click "Update" then "Save and Continue"
   - Add yourself as a test user
   - Click "Save and Continue"

5. Back to "Credentials", click "Create Credentials" → "OAuth client ID"
6. Application type: "Desktop application"
7. Click "Create"
8. Click the download icon to get your credentials JSON
9. Open the JSON file and copy:
   - `client_id` → `GOOGLE_CLIENT_ID`
   - `client_secret` → `GOOGLE_CLIENT_SECRET`

### Get Google Refresh Tokens (Both Accounts)

You need to run the OAuth flow TWICE, once for each Gmail account. Create a temporary file called `get-token.js`:

```javascript
const { google } = require('googleapis');
const fs = require('fs');

const CLIENT_ID = 'your-client-id-from-above';
const CLIENT_SECRET = 'your-client-secret-from-above';
const REDIRECT_URL = 'http://localhost:3000/auth/callback'; // Doesn't need to exist

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Visit this URL:');
console.log(authUrl);
```

1. Run: `npm install googleapis`
2. Run: `node get-token.js`
3. Visit the URL printed
4. Sign in and grant permissions
5. You'll be redirected to a URL like: `http://localhost:3000/auth/callback?code=...`
6. Copy the code from the URL
7. Add this to the script and run it:

```javascript
// After creating oauth2Client, add this:
const { tokens } = await oauth2Client.getToken('paste-the-code-here');
console.log('Refresh Token:', tokens.refresh_token);
```

Copy the refresh token to your `.env.local`:

```
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

Delete the temporary `get-token.js` file.

---

## Part 3: Weather API (5 minutes)

1. Go to https://openweathermap.org/api
2. Click "Sign Up"
3. Create an account
4. Go to API keys section
5. Copy your API key
6. Add to `.env.local`:

```
OPENWEATHER_API_KEY=your-key
```

Update the cron job to use your location. In `app/api/data/route.ts`, update the weather fetch with your coordinates (Lakeville, MN is approximately 44.6°N, 93.3°W).

---

## Part 4: News API (5 minutes)

1. Go to https://newsapi.org
2. Click "Register"
3. Create an account and confirm email
4. Go to "API Keys" section
5. Copy your API key
6. Add to `.env.local`:

```
NEWS_API_KEY=your-key
```

---

## Part 5: Vercel Deployment (10 minutes)

### Create GitHub Repo

1. Go to https://github.com/new
2. Name it: `morning-routine-dashboard`
3. Choose "Private" (optional but recommended for security)
4. Don't initialize with README
5. Click "Create repository"

### Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: morning routine dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/morning-routine-dashboard.git
git push -u origin main
```

### Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL
5. Click "Import"
6. Fill in project name: `morning-routine-dashboard`
7. Click "Deploy"

### Add Environment Variables

1. After deployment, go to project settings
2. Click "Environment Variables"
3. Add all variables from your `.env.local`:
   - `CRON_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `OPENWEATHER_API_KEY`
   - `NEWS_API_KEY`
4. Click "Deploy" again (Vercel will redeploy with new variables)

### Verify Cron Job

1. In Vercel dashboard, go to "Deployments"
2. Click on your deployment
3. Look for "Cron Jobs" section
4. Should show: "0 6 * * 1-5" (6 AM, Monday-Friday CT)

---

## Part 6: Set as Google Homepage

### On Desktop

**Chrome/Edge:**
1. Open your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. Settings → On startup
3. Select "Open a specific page or set of pages"
4. Click "Add a new page"
5. Paste your dashboard URL
6. Click "Add"

**Safari:**
1. Preferences → General
2. Homepage: Enter your dashboard URL
3. When opening new windows: "Homepage"

### On iPhone

1. Open your Vercel dashboard URL in Safari
2. Tap the share icon
3. Scroll down and tap "Add to Home Screen"
4. Name it "Morning Routine"
5. Tap "Add"
6. Now tap the home screen icon each morning

---

## Part 7: Complete the API Implementation

The app currently shows mock data. Now you need to implement the real API calls:

### Update `/app/api/data/route.ts`

Replace the mock data functions with real API calls:

```typescript
// Example: Fetch real Gmail data
async function getFollowUpEmails() {
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: `after:${Math.floor(fiveDaysAgo.getTime() / 1000)}`,
    maxResults: 20,
  });
  
  // Process messages...
  return { highPriority: [], normal: [] };
}
```

See the README.md "Implementation Notes" section for more details on each API.

---

## Part 8: Testing

1. Visit your Vercel URL in browser
2. Should see mock data with weather, emails, calendar, etc.
3. Check mobile view (iPhone) - should look good
4. At 6 AM next Monday, cron job runs automatically
5. Check Vercel dashboard logs to confirm execution

---

## Troubleshooting

**"Gmail API not enabled"**
- Go back to Google Cloud Console
- Search for "Gmail API"
- Make sure you clicked "Enable"

**"Invalid refresh token"**
- Try the OAuth flow again with `get-token.js`
- Make sure you selected "offline" access

**"Cron job not running"**
- Verify `vercel.json` is at project root
- Check Vercel dashboard logs
- Make sure `CRON_SECRET` is set in environment variables

**"Weather showing wrong location"**
- Update coordinates in `app/api/data/route.ts`
- For Lakeville, MN: latitude 44.6, longitude -93.3

---

You're done! Your morning routine dashboard is now live and will automatically update every weekday at 6 AM. 🎉
