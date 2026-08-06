import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')
    
    // For now, if no admin_token cookie exists, redirect to login
    // In a real implementation, you would verify this token with the backend
    if (!adminToken) {
      const loginUrl = new URL('/login', request.url)
      // Optional: append redirect URL
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
