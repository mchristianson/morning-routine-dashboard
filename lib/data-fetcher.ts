// Multi-account Gmail fetcher with smart priority detection
// Fetches from both Gmail accounts and uses AI reasoning to prioritize

import axios from 'axios'

interface Email {
  id: string
  subject: string
  from: string
  account: 'account1' | 'account2'
  priority: 'high' | 'normal'
  link: string
  timestamp: number
  isUnread: boolean
  isStarred: boolean
}

// ============================================================
// PRIORITY DETECTION - AI Reasoning
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _calculateEmailPriority(email: {
  subject: string
  from: string
  isUnread: boolean
  isStarred: boolean
  ageHours: number
  hasAttachments: boolean
}): 'high' | 'normal' {
  let priorityScore = 0

  const subject = email.subject.toLowerCase()
  const from = email.from.toLowerCase()

  // High priority keywords (urgent, deadline, action needed)
  const urgentKeywords = [
    'urgent',
    'asap',
    'immediately',
    'critical',
    'emergency',
    'deadline',
    'action required',
    'action needed',
    'waiting on you',
    'blocked',
    'issue',
    'problem',
    'error',
    'failed',
    'down',
    'not working',
    'requires attention',
  ]

  // Check subject for urgent keywords
  if (urgentKeywords.some((keyword) => subject.includes(keyword))) {
    priorityScore += 50
  }

  // Follow-up related (implies previous conversation)
  if (
    subject.includes('follow up') ||
    subject.includes('re:') ||
    subject.includes('fwd:')
  ) {
    priorityScore += 20
  }

  // Sender signals (assume certain domains are important)
  if (from.includes('boss') || from.includes('manager') || from.includes('ceo')) {
    priorityScore += 30
  }

  // Client or external signals
  if (from.includes('client') || !from.includes('@arconinc.com')) {
    priorityScore += 15
  }

  // Google flags it as important
  if (email.isStarred) {
    priorityScore += 25
  }

  // Unread emails are higher priority
  if (email.isUnread) {
    priorityScore += 20
  }

  // Older unread emails are much higher priority (follow-ups from days ago)
  if (email.isUnread && email.ageHours > 24) {
    priorityScore += 40
  }

  // Has attachments (often important)
  if (email.hasAttachments) {
    priorityScore += 10
  }

  // Question marks indicate requests
  if (subject.includes('?')) {
    priorityScore += 5
  }

  // Decision threshold: 50+ = high priority
  return priorityScore >= 50 ? 'high' : 'normal'
}

// ============================================================
// MULTI-ACCOUNT GMAIL FETCHING
// ============================================================

export async function getFollowUpEmailsFromBothAccounts(): Promise<{
  highPriority: Email[]
  normal: Email[]
}> {
  try {
    // Fetch from both accounts in parallel
    const [account1Emails, account2Emails] = await Promise.all([
      fetchFollowUpEmailsForAccount(
        process.env.GOOGLE_REFRESH_TOKEN_ACCOUNT1!,
        'account1'
      ),
      fetchFollowUpEmailsForAccount(
        process.env.GOOGLE_REFRESH_TOKEN_ACCOUNT2!,
        'account2'
      ),
    ])

    // Combine emails from both accounts
    const allEmails = [...account1Emails, ...account2Emails]

    // Sort by priority and timestamp
    const highPriority = allEmails
      .filter((e) => e.priority === 'high')
      .sort((a, b) => b.timestamp - a.timestamp)
    const normal = allEmails
      .filter((e) => e.priority === 'normal')
      .sort((a, b) => b.timestamp - a.timestamp)

    return {
      highPriority: highPriority.slice(0, 20), // Limit to prevent overwhelming
      normal: normal.slice(0, 20),
    }
  } catch (error) {
    console.error('Error fetching emails from both accounts:', error)
    return { highPriority: [], normal: [] }
  }
}

async function fetchFollowUpEmailsForAccount(
  refreshToken: string,
  account: 'account1' | 'account2'
): Promise<Email[]> {
  try {
    // TODO: Implement Gmail API integration
    // 1. Get access token from refresh token
    // 2. Query Gmail for emails from last 5 days
    // 3. Filter for follow-up related emails
    // 4. For each email, calculate priority using _calculateEmailPriority()
    // 5. Return formatted Email objects

    // Pseudocode:
    // const accessToken = await getAccessToken(refreshToken)
    // const messages = await gmail.users.messages.list({
    //   userId: 'me',
    //   q: 'is:important OR is:starred OR subject:(follow up) OR label:flagged',
    //   maxResults: 50
    // })

    // Process each message and calculate priority...

    return []
  } catch (error) {
    console.error(`Error fetching emails from ${account}:`, error)
    return []
  }
}

// ============================================================
// GOOGLE CALENDAR - Today's events
// ============================================================

export async function getTodayCalendarEvents() {
  try {
    // TODO: Implement Google Calendar API integration
    // Use primary calendar from the main account

    return []
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return []
  }
}

// ============================================================
// GMAIL REMINDERS - Today's reminders
// ============================================================

export async function getTodayReminders() {
  try {
    // TODO: Implement Gmail Reminders via Gmail API
    // Reminders are stored in Gmail's task lists

    return []
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return []
  }
}

// ============================================================
// OPENWEATHER - Current weather and forecast
// ============================================================

export async function getWeather(latitude: number, longitude: number) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'imperial',
      },
    })

    const data = response.data
    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      forecast: `Feels like ${Math.round(data.main.feels_like)}°F, Wind ${Math.round(data.wind.speed)} mph`,
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return {
      temp: 72,
      condition: 'Unknown',
      icon: '❓',
      forecast: 'Unable to load weather',
    }
  }
}

// ============================================================
// MEDIUM - For You reading list
// ============================================================

export async function getMediumPosts(username: string) {
  try {
    // TODO: Parse RSS feed to get latest posts
    // npm install feed
    // const parser = new Parser()
    // const feed = await parser.parseURL(`https://medium.com/@${username}/rss`)

    return []
  } catch (error) {
    console.error('Error fetching Medium posts:', error)
    return []
  }
}

// ============================================================
// NEWS API - Tech news and Target Corporation
// ============================================================

export async function getNews() {
  try {
    // Fetch tech news
    const techResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'technology OR AI OR programming',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY,
      },
    })

    // Fetch Target news
    const targetResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'Target Corporation',
        sortBy: 'publishedAt',
        pageSize: 3,
        apiKey: process.env.NEWS_API_KEY,
      },
    })

    const techNews = techResponse.data.articles.slice(0, 3).map((article: any) => ({
      title: article.title,
      source: article.source.name,
      link: article.url,
    }))

    const targetNews = targetResponse.data.articles.slice(0, 2).map((article: any) => ({
      title: article.title,
      source: article.source.name,
      link: article.url,
    }))

    return [...techNews, ...targetNews]
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

// ============================================================
// QUOTES - Daily inspiration
// ============================================================

export function getDailyQuote() {
  const quotes = [
    "The only way to do great work is to love what you do. — Steve Jobs",
    "Your work is going to fill a large part of your life. Make it count. — Steve Jobs",
    "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
    "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
    "The way to get started is to quit talking and begin doing. — Walt Disney",
    "Success is not final, failure is not fatal. — Winston Churchill",
    "Believe you can and you're halfway there. — Theodore Roosevelt",
    "The only impossible journey is the one you never begin. — Tony Robbins",
    "It is during our darkest moments that we must focus to see the light. — Aristotle",
    "The only limit to our realization of tomorrow is our doubts of today. — FDR",
  ]

  return quotes[Math.floor(Math.random() * quotes.length)]
}

// ============================================================
// DAILY TIPS - Rotating tips for tools
// ============================================================

export function getDailyTip() {
  const tips = [
    {
      product: 'IntelliJ IDEA',
      tip: 'Use Ctrl+Shift+A (Cmd+Shift+A on Mac) to search for any action. Perfect for finding settings and commands quickly.',
    },
    {
      product: 'VS Code',
      tip: 'Use Ctrl+K Ctrl+S (Cmd+K Cmd+S on Mac) to open keyboard shortcuts. Customize them to match your workflow.',
    },
    {
      product: 'Claude Code',
      tip: 'Use inline prompts in your editor with ⌘+K to get AI assistance directly in your development workflow.',
    },
    {
      product: 'Vercel',
      tip: 'Use environment variables for sensitive data. Deploy with git push - no extra steps needed.',
    },
    {
      product: 'Granola',
      tip: 'Add meeting notes as you go. Granola will automatically surface action items and decisions from your calls.',
    },
    {
      product: 'Affinity',
      tip: 'Use symbols for reusable design elements. Edit the master symbol and all instances update automatically.',
    },
    {
      product: 'OpenCode',
      tip: 'Use the command palette (Cmd+P / Ctrl+P) to quickly navigate to any file in your project.',
    },
  ]

  return tips[Math.floor(Math.random() * tips.length)]
}
