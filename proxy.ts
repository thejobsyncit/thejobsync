import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /superadmin-erp routes
  if (pathname === '/superadmin-erp' || (pathname.startsWith('/superadmin-erp/') && pathname !== '/superadmin-erp/login')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/superadmin-erp/login', request.url));
    }

    try {
      const JWT_SECRET = new TextEncoder().encode(
        process.env.JWT_SECRET || 'gojobsync_jwt_secret_2024_secure'
      );
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // If they are not a super_admin or super_admin_erp, redirect to login
      if (payload.role !== 'super_admin' && payload.role !== 'super_admin_erp') {
        return NextResponse.redirect(new URL('/superadmin-erp/login', request.url));
      }
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL('/superadmin-erp/login', request.url));
    }
  }

  // Protect /admin-erp routes
  if (pathname === '/admin-erp' || (pathname.startsWith('/admin-erp/') && pathname !== '/admin-erp/login')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin-erp/login', request.url));
    }

    try {
      const JWT_SECRET = new TextEncoder().encode(
        process.env.JWT_SECRET || 'gojobsync_jwt_secret_2024_secure'
      );
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Admin, super_admin, and their ERP counterparts can access admin-erp
      if (
        payload.role !== 'admin' && 
        payload.role !== 'super_admin' && 
        payload.role !== 'admin_erp' && 
        payload.role !== 'super_admin_erp'
      ) {
        return NextResponse.redirect(new URL('/admin-erp/login', request.url));
      }
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL('/admin-erp/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/superadmin-erp/:path*',
    '/superadmin-erp',
    '/admin-erp/:path*',
    '/admin-erp',
  ],
};
