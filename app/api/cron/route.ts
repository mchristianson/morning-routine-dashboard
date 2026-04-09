import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  // Verify this is a cron request from Vercel
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // TODO: Implement actual data fetching here
    // This will be called by Vercel Cron at 6:00 AM CT
    // Fetch Gmail, Calendar, Weather, News, etc.
    // Store in Vercel KV or database

    console.log('Morning routine data fetch triggered at', new Date().toISOString())

    return NextResponse.json({
      success: true,
      message: 'Morning routine data fetched successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
