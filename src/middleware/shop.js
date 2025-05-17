import { NextResponse } from 'next/server';

export async function shopMiddleware(request, token) {
  const pathname = request.nextUrl.pathname;
  const userRole = token?.role;

  // If user is a seller
  if (userRole === 'SELLER') {
    // Don't check for shop on these paths
    const excludedPaths = [
      '/dashboard/seller/create-shop',
      '/api/shop',
      '/auth',
      '/_next',
      '/images',
      '/favicon.ico'
    ];

    if (excludedPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    try {
      // Check if seller has a shop
      const shopResponse = await fetch(`${request.nextUrl.origin}/api/shop`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      const shop = await shopResponse.json();

      // If no shop exists and not already on create shop page, redirect to create shop
      if (!shop && !pathname.startsWith('/dashboard/seller/create-shop')) {
        return NextResponse.redirect(new URL('/dashboard/seller/create-shop', request.url));
      }
    } catch (error) {
      console.error('Error checking shop status:', error);
    }
  }

  return NextResponse.next();
} 