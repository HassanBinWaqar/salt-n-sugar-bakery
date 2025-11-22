import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin dashboard route
  if (pathname.startsWith('/admin/dashboard')) {
    // Check for admin token in cookies or headers
    const adminToken = request.cookies.get('admin-token')?.value;
    
    if (!adminToken) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Allow admin login page without token
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
