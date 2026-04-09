# Multi-Account Gmail Setup Guide

This guide explains how to set up the morning routine dashboard to fetch emails from both your Gmail accounts with smart priority detection.

## Why Two Accounts?

- **Account 1**: mchristianson@arconinc.com (work/Arcon)
- **Account 2**: christianson.matt@gmail.com (personal)

The dashboard will combine emails from both accounts, show follow-ups in one list, and use AI reasoning to flag high-priority items automatically (not just relying on Google's star flag).

## How Priority Detection Works

The dashboard uses smart reasoning to determine email priority based on:

1. **Subject keywords** - Urgent, ASAP, deadline, action needed, waiting on you, issue, problem, error, failed
2. **Sender analysis** - Boss, manager, client, external senders get higher priority
3. **Email age** - Unread emails older than 24 hours are flagged as high priority
4. **Google flags** - Starred emails count as important
5. **Attachments** - Emails with attachments are slightly higher priority
6. **Question marks** - Questions in subject get minor boost

**Priority Score Calculation:**
- 50+ points = HIGH PRIORITY
- Below 50 = NORMAL

## Setup Steps

### Step 1: You Already Have Client ID & Secret

From Part 2 of SETUP_GUIDE.md, you should have:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

These are shared for BOTH accounts. No need to create new ones.

### Step 2: Get Refresh Token for Account 1 (mchristianson@arconinc.com)

Create a temporary file `get-token.js`:

```javascript
const { google } = require('googleapis');

const CLIENT_ID = 'paste-your-client-id-here';
const CLIENT_SECRET = 'paste-your-client-secret-here';
const REDIRECT_URL = 'http://localhost:3000/auth/callback';

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

console.log('ACCOUNT 1: Visit this URL and sign in with mchristianson@arconinc.com');
console.log(authUrl);
console.log('\nAfter signing in, you will be redirected to a URL.');
console.log('Copy the CODE from the URL (looks like: ...&code=4/0A...&...');
console.log('Then run: node get-token.js YOUR_CODE_HERE\n');

// If code is provided as argument, exchange it for tokens
if (process.argv[2]) {
  oauth2Client.getToken(process.argv[2], (err, tokens) => {
    if (err) {
      console.error('Error getting token:', err);
      return;
    }
    console.log('SUCCESS! Add this to .env.local:');
    console.log(`GOOGLE_REFRESH_TOKEN_ACCOUNT1=${tokens.refresh_token}`);
  });
}
```

**Run it:**

```bash
npm install googleapis
node get-token.js
```

1. Visit the URL printed
2. Sign in with **mchristianson@arconinc.com**
3. Grant permissions
4. You'll be redirected to a URL like: `http://localhost:3000/auth/callback?code=4/0A...`
5. Copy the long code after `code=`
6. Run: `node get-token.js 4/0A...` (paste your code)
7. It will print your refresh token
8. Copy it to `.env.local`:

```
GOOGLE_REFRESH_TOKEN_ACCOUNT1=your-refresh-token-here
```

### Step 3: Get Refresh Token for Account 2 (christianson.matt@gmail.com)

Repeat Step 2, but:

1. Visit the URL again
2. Sign in with **christianson.matt@gmail.com** (different account!)
3. Grant permissions again
4. Copy the new code
5. Run: `node get-token.js [new-code]`
6. Copy the token to `.env.local`:

```
GOOGLE_REFRESH_TOKEN_ACCOUNT2=your-second-refresh-token-here
```

### Step 4: Verify Your .env.local

Should look like:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN_ACCOUNT1=first-refresh-token
GOOGLE_REFRESH_TOKEN_ACCOUNT2=second-refresh-token
OPENWEATHER_API_KEY=...
NEWS_API_KEY=...
CRON_SECRET=...
```

### Step 5: Clean Up

Delete the temporary file:

```bash
rm get-token.js
```

### Step 6: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and check that the dashboard loads.

When you implement the real Gmail API calls, it will automatically fetch from both accounts.

## How It Works in the Dashboard

1. **At 6 AM**, the cron job runs
2. **Fetches emails** from both Gmail accounts (last 5 days)
3. **Analyzes each email** to calculate priority score
4. **Sorts emails** by priority and time
5. **Displays them** with high-priority flagged separately

Example output:

```
HIGH PRIORITY
🚨 Urgent: Q4 budget review needed (from boss@arconinc.com)
🚨 Project deadline ASAP - waiting on you (from client@example.com)
🚨 Critical issue in production (from team@arconinc.com)

FOLLOW-UPS (Last 5 Days)
📧 Follow up on proposal (from contact@acme.com)
📧 Meeting recap from Friday (from team@arconinc.com)
📧 Follow-up discussion (from personal@gmail.com)
```

## Troubleshooting

**"Invalid refresh token for account 1"**
- Make sure you signed in with the CORRECT email address
- The refresh token is tied to that specific account
- Try getting a new token

**"Can't access emails from one account"**
- Verify both refresh tokens are in `.env.local`
- Check that you didn't mix up ACCOUNT1 and ACCOUNT2
- Make sure you have read permission in both accounts

**"All emails showing as normal priority"**
- The priority detection might not be matching your keywords
- Check `lib/data-fetcher.ts` → `calculateEmailPriority()` for keywords
- Add your own keywords if needed

**"Dashboard shows mock data instead of real emails"**
- The API implementation isn't complete yet
- See README.md → "Implementation Notes" for what to implement
- Mock data will show until you complete the Gmail API calls in `lib/data-fetcher.ts`

## Customizing Priority Detection

If you want to adjust how priority is calculated, edit `lib/data-fetcher.ts`:

```typescript
function calculateEmailPriority(email) {
  // Add your own keywords
  const urgentKeywords = [
    'urgent',
    'asap',
    'your-custom-keyword-here',
    // ...
  ]
  
  // Adjust priority scores
  if (urgentKeywords.some(...)) {
    priorityScore += 50  // Change this number
  }
}
```

Higher scores = more likely to be flagged as high priority.

## What's Next

1. ✓ Set up both Gmail accounts
2. ✓ Get both refresh tokens
3. Implement the Gmail API calls (see README.md → Implementation Notes)
4. Deploy to Vercel
5. Both accounts' emails will automatically sync at 6 AM

---

You now have dual Gmail accounts feeding into one beautiful morning dashboard. 🎯
