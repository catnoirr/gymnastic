import { NextResponse } from 'next/server';

// Define protected routes
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/profile/:path*',
    '/diet/:path*',
    '/workout/:path*',
    '/adddiet/:path*',
    '/addworkout/:path*',
    '/foocus/:path*',
    '/today-workout/:path*',
    '/reminder/:path*',
    '/auth/:path*',
    '/personalise/:path*',
  ]
};

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // List of public pages
  const publicPages = ['/', '/login', '/signup', '/auth'];
  const isPublicPage = publicPages.includes(pathname);

  // If user is authenticated and trying to access public pages, redirect to diet
  if (token && isPublicPage) {
    return NextResponse.redirect(new URL('/foocus', request.url));
  }

  // If user is not authenticated and trying to access protected pages, redirect to home
  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
