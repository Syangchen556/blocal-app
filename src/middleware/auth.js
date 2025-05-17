import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function authMiddleware(request) {
  const pathname = request.nextUrl.pathname;

  // Get the token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Protect all routes that require authentication
  if (!token) {
    // If trying to access protected routes without being logged in
    if (pathname.startsWith('/dashboard') || 
        pathname.startsWith('/cart') || 
        pathname.startsWith('/wishlist') ||
        pathname.startsWith('/checkout')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    return NextResponse.next();
  }

  // Public routes - allow access regardless of authentication
  if (pathname.startsWith('/auth')) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
} 