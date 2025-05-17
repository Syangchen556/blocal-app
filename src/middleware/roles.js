import { NextResponse } from 'next/server';

export async function rolesMiddleware(request, token) {
  const pathname = request.nextUrl.pathname;
  const userRole = token?.role || 'BUYER'; // Default to BUYER if role is not set

  // Admin routes protection
  if (pathname.startsWith('/dashboard/admin')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Seller routes and redirection
  if (userRole === 'SELLER') {
    // If seller is accessing dashboard root or buyer routes, redirect to seller profile
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/buyer')) {
      return NextResponse.redirect(new URL('/dashboard/seller/profile', request.url));
    }
    // Protect seller routes from non-sellers
    if (pathname.startsWith('/dashboard/seller')) {
      if (userRole !== 'SELLER') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // Buyer routes
  if (pathname.startsWith('/dashboard/buyer')) {
    if (userRole !== 'BUYER') {
      return NextResponse.redirect(new URL('/dashboard/seller', request.url));
    }
  }

  // Cart and wishlist are only for buyers
  if ((pathname.startsWith('/cart') || pathname.startsWith('/wishlist')) && userRole === 'SELLER') {
    return NextResponse.redirect(new URL('/dashboard/seller', request.url));
  }

  return NextResponse.next();
} 