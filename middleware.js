import { NextResponse } from 'next/server';

// Define protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/diet/:path*',
    '/workout/:path*',
    '/adddiet/:path*',
    '/addworkout/:path*'
  ]
};

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // If there's no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
