import { NextResponse } from 'next/server'

// Mock data for GitHub contributions
const mockContributionData = {
  contributions: {
    totalContributions: 450,
    weeks: Array.from({ length: 52 }, () => ({
      days: Array.from({ length: 7 }, () => ({
        date: new Date().toISOString(),
        count: Math.floor(Math.random() * 10),
        level: Math.floor(Math.random() * 5) as 0 | 1 | 2 | 3 | 4
      }))
    }))
  },
  stats: {
    commits: 230,
    pullRequests: 45,
    issues: 28,
    stars: 150
  }
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Add artificial delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(mockContributionData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json(
      { error: 'Error fetching GitHub data' },
      { status: 500 }
    )
  }
} 