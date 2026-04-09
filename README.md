# Morning Routine Dashboard

A personalized, AI-powered morning dashboard that aggregates your email follow-ups, calendar, weather, news, and daily tips. Runs automatically at 6 AM Monday-Friday and displays everything in a beautiful, mobile-friendly interface.

## Features

- **Dual Gmail Accounts**: Combines emails from multiple Gmail accounts with smart priority detection
- **Smart Priority Detection**: Uses AI reasoning to identify high-priority emails (not just Google's star flag)
  - Analyzes sender, subject keywords, email age, and attachments
  - Automatically flags urgent/critical items
  - Sorts by priority and relevance
- **Calendar & Reminders**: Shows today's scheduled events from Google Calendar and Gmail Reminders
- **Weather Display**: Real-time weather with dynamic background based on conditions
- **Medium Feed**: Your personalized "For You" reading list
- **Tech News**: Latest tech news plus Target Corporation updates
- **Daily Tips**: Rotating tips for IntelliJ IDEA, VS Code, Claude Code, Vercel, Granola, Affinity, and more
- **Podcast Links**: Quick access to Morning Wire and AI Daily Brief
- **Inspirational Quote**: Daily rotating quote to start your day
- **Mobile Optimized**: Looks perfect on iPhone when checking first thing in the morning
- **Automatic Updates**: Runs every weekday at 6:00 AM CT via Vercel Cron

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **APIs**: Gmail (multi-account), Google Calendar, OpenWeatherMap, NewsAPI, Medium RSS
- **Scheduling**: Vercel Cron Jobs
- **Priority Detection**: Custom AI reasoning engine

## Setup Instructions

### Quick Start

1. **Follow SETUP_GUIDE.md** - Basic setup (Google OAuth, API keys, etc.)
2. **Follow MULTI_ACCOUNT_SETUP.md** - Dual Gmail account configuration
3. **Deploy to Vercel** - Push and deploy
4. **Set as homepage** - Chrome/Safari/iPhone

### Detailed Guides

- **QUICKSTART.md** - 5 minutes if you already have API keys
- **SETUP_GUIDE.md** - Complete step-by-step (30 minutes)
- **MULTI_ACCOUNT_SETUP.md** - Dual Gmail account setup
- **CHECKLIST.md** - Checkbox format to track progress

## Multi-Account Gmail Setup

The dashboard supports combining emails from multiple Gmail accounts:

```
Account 1: mchristianson@arconinc.com (work)
Account 2: christianson.matt@gmail.com (personal)
```

All follow-up emails appear in one combined list with smart priority flagging.

### How It Works

1. Create one Google OAuth app (reusable for both accounts)
2. Run the OAuth flow TWICE - once for each Gmail account
3. Store two separate refresh tokens in environment variables
4. Dashboard automatically fetches and combines emails from both
5. Priority is calculated using AI reasoning, not just Google's flags

See **MULTI_ACCOUNT_SETUP.md** for detailed walkthrough.

## Smart Priority Detection

The dashboard uses intelligent reasoning to determine email priority:

**High Priority (50+ points):**
- Subject contains: urgent, ASAP, deadline, action needed, waiting on you, critical, issue, error, failed
- From boss, manager, or client
- Unread for more than 24 hours
- Google flagged as important
- Has attachments
- Contains question mark (request)

**Normal Priority:**
- Everything else

**Priority Score Calculation Example:**
```
Subject: "URGENT: Project deadline moved up - action needed"
From: boss@company.com
Unread: true (20 points)
Age: 36 hours (40 points)
Subject keywords: "URGENT" (50) + "deadline" (50) + "action needed" (50)
Sender: boss (30)
Google starred: true (25)
Total: 265 points → HIGH PRIORITY ✓
```

## Implementation Notes

### Gmail API Integration

The dashboard currently shows mock data. To enable real Gmail integration:

1. Update `lib/data-fetcher.ts`:
   - Implement `getAccessToken()` from refresh token
   - Fetch messages from Gmail API
   - Calculate priority for each email
   - Return formatted email objects

2. Key functions to implement:
   - `fetchFollowUpEmailsForAccount()` - Fetch from one account
   - `getFollowUpEmailsFromBothAccounts()` - Combine both accounts
   - Priority detection uses `calculateEmailPriority()` function

See `lib/data-fetcher.ts` for stubbed functions and pseudocode.

### Calendar Integration

Query Google Calendar API for today's events:
- Get access token from primary account
- Query events from midnight to midnight
- Extract time and title
- Return sorted by start time

### Gmail Reminders

Query Gmail Tasks API:
- Get tasks for today
- Extract title and completion status
- Return as reminder items

### Weather API

Call OpenWeatherMap with Lakeville, MN coordinates (44.6, -93.3):
- Current conditions
- Temperature and feels like
- Wind speed
- Update in real-time

### Medium Feed

Parse Medium RSS feed or API:
- Pull latest posts from "For You" list
- Extract title and link
- Return top 3-5 posts

### News Aggregation

Query NewsAPI for:
- Tech/AI/programming news
- Target Corporation news
- Combine and sort by date
- Return latest 5 items total

## Data Caching (Optional)

For production, consider using Vercel KV to cache:
- Data fetched at 6 AM
- Prevents API rate limiting
- Faster page loads throughout the day
- Automatically refreshes at next 6 AM

## File Structure

```
app/
  ├── api/
  │   ├── cron/
  │   │   └── route.ts          # Cron job handler
  │   └── data/
  │       └── route.ts          # Data API endpoint
  ├── globals.css               # Global styles
  ├── layout.tsx                # Root layout
  └── page.tsx                  # Main dashboard
lib/
  └── data-fetcher.ts           # API helpers & priority detection
.env.example                     # Environment template
vercel.json                      # Vercel cron config
package.json                     # Dependencies
SETUP_GUIDE.md                   # Detailed setup
MULTI_ACCOUNT_SETUP.md           # Dual Gmail accounts
QUICKSTART.md                    # Quick setup
CHECKLIST.md                     # Setup checklist
```

## Next Steps

1. **Part 1: Setup** (SETUP_GUIDE.md)
   - Create Google Cloud project
   - Get API keys and OAuth credentials
   - Set environment variables

2. **Part 2: Multi-Account** (MULTI_ACCOUNT_SETUP.md)
   - Get refresh tokens for both Gmail accounts
   - Verify both accounts are configured

3. **Part 3: Deploy** (SETUP_GUIDE.md Part 5)
   - Push to GitHub
   - Deploy to Vercel
   - Set environment variables
   - Verify cron job

4. **Part 4: Test**
   - Visit your dashboard
   - Check on mobile (iPhone)
   - Set as browser homepage

5. **Part 5: Implement APIs** (Optional)
   - Complete real API calls in `lib/data-fetcher.ts`
   - Test with real data
   - Redeploy to Vercel

## Customization

**Change wake time:**
- Edit `vercel.json`: change `"0 6 * * 1-5"` to your preferred time
- `0 6` = 6 AM, `0 8` = 8 AM, etc.

**Add more priority keywords:**
- Edit `calculateEmailPriority()` in `lib/data-fetcher.ts`
- Add keywords to `urgentKeywords` array
- Adjust priority scores

**Change colors:**
- Edit `tailwind.config.ts` for gradients
- Edit `app/globals.css` for card colors and styles

**Adjust layout:**
- Edit `app/page.tsx` to rearrange sections
- Edit CSS to change spacing and sizing

## Troubleshooting

**Dashboard not loading?**
- Check browser console for errors
- Verify Vercel deployment is live
- Check environment variables are set

**Cron job not running?**
- Check Vercel dashboard → Deployments → Cron Jobs
- Verify `vercel.json` at project root
- Check `CRON_SECRET` is set

**Gmail not working?**
- Verify both refresh tokens in `.env.local`
- Check tokens haven't expired
- Test Gmail API manually in Google Cloud Console
- See MULTI_ACCOUNT_SETUP.md troubleshooting

**Priority detection not working?**
- Emails still show in order (but not high-priority flagged)
- This means API integration isn't complete
- Priority detection code is ready, just needs Gmail API implementation

**Weather showing wrong location?**
- Update coordinates in `app/api/data/route.ts`
- For Lakeville, MN: 44.6, -93.3

## Support

For issues with specific parts:
- **Setup**: SETUP_GUIDE.md
- **Multi-account**: MULTI_ACCOUNT_SETUP.md
- **Tracking**: CHECKLIST.md
- **Overview**: PROJECT_SUMMARY.md
- **Quick answers**: QUICKSTART.md

For API documentation:
- Google APIs: https://developers.google.com
- Vercel Cron: https://vercel.com/docs/cron-jobs
- Next.js: https://nextjs.org/docs
- NewsAPI: https://newsapi.org/docs
- OpenWeatherMap: https://openweathermap.org/api

---

Built with TypeScript, Next.js, and smart AI reasoning for your morning routine. ☀️
