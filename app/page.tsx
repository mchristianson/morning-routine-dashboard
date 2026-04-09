'use client'

import { useEffect, useState } from 'react'

interface DashboardData {
  weather: {
    temp: number
    condition: string
    icon: string
    forecast: string
  }
  quote: string
  emails: {
    highPriority: Array<{ subject: string; from: string; link: string }>
    normal: Array<{ subject: string; from: string; link: string }>
  }
  calendar: Array<{ time: string; title: string }>
  reminders: Array<{ title: string; completed: boolean }>
  mediumPosts: Array<{ title: string; link: string }>
  news: Array<{ title: string; source: string; link: string }>
  tip: { product: string; tip: string }
  refreshTime: string
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [backgroundGradient, setBackgroundGradient] = useState('bg-gradient-clear')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      setData(data)

      // Set background based on weather condition
      if (data.weather.condition.includes('rain')) {
        setBackgroundGradient('bg-gradient-rainy')
      } else if (data.weather.condition.includes('cloud')) {
        setBackgroundGradient('bg-gradient-cloudy')
      } else if (data.weather.condition.includes('clear') || data.weather.condition.includes('sunny')) {
        setBackgroundGradient('bg-gradient-sunny')
      } else {
        setBackgroundGradient('bg-gradient-clear')
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  if (loading || !data) {
    return (
      <div className={`dashboard-container ${backgroundGradient} flex items-center justify-center`}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your morning routine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`dashboard-container ${backgroundGradient}`}>
      <div className="content-overlay">
        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-8">
          {/* Quote Section */}
          <div className="quote-container mb-6">
            <p className="text-lg">{data.quote}</p>
          </div>

          {/* Weather & Time */}
          <div className="text-white text-center mb-8">
            <div className="text-4xl font-bold mb-2">{data.weather.temp}°</div>
            <div className="text-xl mb-1">{data.weather.condition}</div>
            <div className="text-sm opacity-90">{data.weather.forecast}</div>
          </div>

          {/* High Priority Emails */}
          {data.emails.highPriority.length > 0 && (
            <div className="card">
              <div className="card-title">🚨 Action Required</div>
              {data.emails.highPriority.map((email, idx) => (
                <div key={idx} className="email-item high-priority">
                  <div className="font-semibold text-red-700">{email.subject}</div>
                  <div className="text-xs text-red-600 mt-1">{email.from}</div>
                  <a href={email.link} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 underline mt-1">
                    View email →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Regular Emails */}
          {data.emails.normal.length > 0 && (
            <div className="card">
              <div className="card-title">📧 Follow-ups (Last 5 Days)</div>
              {data.emails.normal.map((email, idx) => (
                <div key={idx} className="email-item normal">
                  <div className="font-semibold text-blue-700">{email.subject}</div>
                  <div className="text-xs text-blue-600 mt-1">{email.from}</div>
                  <a href={email.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline mt-1">
                    View email →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Calendar & Reminders */}
          <div className="card">
            <div className="card-title">📅 Today's Schedule</div>
            {data.calendar.map((event, idx) => (
              <div key={idx} className="event-item">
                <div className="font-semibold text-purple-700">{event.time}</div>
                <div className="text-sm text-purple-600 mt-1">{event.title}</div>
              </div>
            ))}
            {data.reminders.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="text-xs font-semibold text-purple-600 mb-2">REMINDERS</div>
                {data.reminders.map((reminder, idx) => (
                  <div key={idx} className="text-sm text-purple-700 mb-2">
                    <span className={reminder.completed ? 'line-through' : ''}>✓ {reminder.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Morning Activities */}
          <div className="card">
            <div className="card-title">🧘 Morning Activities</div>
            <div className="mb-4">
              <a href="https://www.youtube.com/results?search_query=tai+chi+beginner" target="_blank" rel="noopener noreferrer" className="link-button">
                🎥 Tai Chi Video
              </a>
              <a href="https://www.dailywire.com/podcasts/the-morning-wire" target="_blank" rel="noopener noreferrer" className="link-button">
                🎙️ Morning Wire
              </a>
              <a href="https://www.businessinsider.com/the-ai-daily-brief" target="_blank" rel="noopener noreferrer" className="link-button">
                🤖 AI Daily Brief
              </a>
            </div>
          </div>

          {/* Medium Posts */}
          {data.mediumPosts.length > 0 && (
            <div className="card">
              <div className="card-title">📚 Medium - For You</div>
              {data.mediumPosts.map((post, idx) => (
                <div key={idx} className="medium-item">
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                    {post.title}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* News */}
          {data.news.length > 0 && (
            <div className="card">
              <div className="card-title">📰 Tech News & Target</div>
              {data.news.map((item, idx) => (
                <div key={idx} className="news-item">
                  <div className="font-semibold text-cyan-700">{item.title}</div>
                  <div className="text-xs text-cyan-600 mt-1">{item.source}</div>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 underline mt-1">
                    Read →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Daily Tip */}
          <div className="card">
            <div className="card-title">💡 Daily Tip</div>
            <div className="tip-item">
              <div className="font-semibold text-green-700 mb-2">{data.tip.product}</div>
              <div className="text-green-800">{data.tip.tip}</div>
            </div>
          </div>

          {/* Refresh Time */}
          <div className="text-center text-white text-xs mt-8 opacity-75">
            <p>Last updated: {data.refreshTime}</p>
            <p className="mt-2">Refreshes daily at 6:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  )
}
