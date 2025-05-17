import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authMiddleware } from './auth';
import { rolesMiddleware } from './roles';
import { shopMiddleware } from './shop';
import { validateShop, validateProduct, validateBlog } from './validation';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // API route validation
  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/shop')) {
      const validationResult = await validateShop(request);
      if (validationResult instanceof NextResponse) {
        return validationResult;
      }
    }
    if (pathname.startsWith('/api/products')) {
      const validationResult = await validateProduct(request);
      if (validationResult instanceof NextResponse) {
        return validationResult;
      }
    }
    if (pathname.startsWith('/api/blogs')) {
      const validationResult = await validateBlog(request);
      if (validationResult instanceof NextResponse) {
        return validationResult;
      }
    }
  }

  // First run authentication middleware
  const authResult = await authMiddleware(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Get token for subsequent middleware
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Run role-based access control
  const roleResult = await rolesMiddleware(request, token);
  if (roleResult instanceof NextResponse) {
    return roleResult;
  }

  // Run shop verification
  const shopResult = await shopMiddleware(request, token);
  if (shopResult instanceof NextResponse) {
    return shopResult;
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/cart/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/auth/:path*'
  ]
}; 