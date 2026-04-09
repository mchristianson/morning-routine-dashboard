import { NextResponse } from 'next/server'
import {
  getFollowUpEmailsFromBothAccounts,
  getTodayCalendarEvents,
  getTodayReminders,
  getWeather,
  getMediumPosts,
  getNews,
  getDailyQuote,
  getDailyTip,
} from '@/lib/data-fetcher'

// Fallback mock data in case of API failures
const mockEmails = {
  highPriority: [
    {
      subject: 'Urgent: Project deadline moved up',
      from: 'boss@company.com',
      link: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox',
    },
  ],
  normal: [
    {
      subject: 'Follow up on proposal',
      from: 'client@example.com',
      link: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox',
    },
    {
      subject: 'Meeting recap from Friday',
      from: 'team@company.com',
      link: 'https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox',
    },
  ],
}

const mockCalendar = [
  { time: '9:00 AM', title: 'Team standup' },
  { time: '10:30 AM', title: 'Client call' },
  { time: '2:00 PM', title: 'Code review session' },
  { time: '4:00 PM', title: 'Planning meeting' },
]

const mockReminders = [
  { title: 'Review pull requests', completed: false },
  { title: 'Update project status', completed: false },
  { title: 'Respond to emails', completed: false },
]

const mockMediumPosts = [
  {
    title: 'Building scalable web applications with Next.js',
    link: 'https://medium.com',
  },
  {
    title: 'TypeScript best practices for large teams',
    link: 'https://medium.com',
  },
  {
    title: 'Database optimization techniques',
    link: 'https://medium.com',
  },
]

const mockNews = [
  {
    title: 'New AI model shows promise in code generation',
    source: 'TechCrunch',
    link: 'https://techcrunch.com',
  },
  {
    title: 'Target announces new tech initiatives',
    source: 'Business Wire',
    link: 'https://businesswire.com',
  },
  {
    title: 'Cloud computing trends for 2024',
    source: 'InfoQ',
    link: 'https://infoq.com',
  },
]

export async function GET() {
  try {
    // Fetch all data in parallel
    const [
      emailData,
      calendarEvents,
      reminders,
      weatherData,
      mediumPosts,
      newsItems,
    ] = await Promise.all([
      getFollowUpEmailsFromBothAccounts(),
      getTodayCalendarEvents(),
      getTodayReminders(),
      getWeather(44.6, -93.3), // Lakeville, MN coordinates
      getMediumPosts(''),
      getNews(),
    ])

    const quote = getDailyQuote()
    const tip = getDailyTip()

    const dashboardData = {
      weather: weatherData,
      quote: quote,
      emails: emailData.highPriority.length > 0 ? emailData : mockEmails,
      calendar: calendarEvents.length > 0 ? calendarEvents : mockCalendar,
      reminders: reminders.length > 0 ? reminders : mockReminders,
      mediumPosts: mediumPosts.length > 0 ? mediumPosts : mockMediumPosts,
      news: newsItems.length > 0 ? newsItems : mockNews,
      tip: tip,
      refreshTime: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error in dashboard data route:', error)

    // Return mock data on error so dashboard still works
    const quote = getDailyQuote()
    const tip = getDailyTip()

    return NextResponse.json({
      weather: {
        temp: 72,
        condition: 'Unknown',
        icon: '❓',
        forecast: 'Unable to load weather',
      },
      quote: quote,
      emails: mockEmails,
      calendar: mockCalendar,
      reminders: mockReminders,
      mediumPosts: mockMediumPosts,
      news: mockNews,
      tip: tip,
      refreshTime: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    })
  }
}
