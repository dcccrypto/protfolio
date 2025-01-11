import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if it's an admin route
  if (path.startsWith('/admin')) {
    // Skip middleware for the login page and API routes
    if (path === '/admin/login' || path.startsWith('/admin/api/')) {
      return NextResponse.next()
    }

    // Check for auth token
    const token = request.cookies.get('admin_token')
    
    if (!token) {
      // Redirect to login if no token
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 