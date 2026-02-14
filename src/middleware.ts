
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log(`[Middleware] Path: ${pathname}`);

    const token = request.cookies.get('auth_token')?.value;
    console.log(`[Middleware] Token present: ${!!token}`);

    // Admin login is a special auth path — must be checked BEFORE protected paths
    const adminLoginPath = '/admin/login';
    const isAdminLogin = pathname === adminLoginPath;

    // Paths that require authentication
    const protectedPaths = ['/dashboard', '/admin', '/department', '/complaints'];
    const isProtected = !isAdminLogin && protectedPaths.some((path) => pathname.startsWith(path));

    // Paths reserved for unauthenticated users (login, register)
    const authPaths = ['/login', '/register', '/forgot-password', '/admin/login'];
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

    if (isProtected) {
        // Admin paths get their own login page
        const loginRedirect = pathname.startsWith('/admin') ? '/admin/login' : '/login';

        if (!token) {
            console.log(`[Middleware] No token, redirecting to ${loginRedirect}`);
            return NextResponse.redirect(new URL(loginRedirect, request.url));
        }

        const decoded = await verifyToken(token) as any;
        console.log(`[Middleware] Decoded token:`, decoded ? 'Valid' : 'Invalid');

        if (!decoded) {
            console.log(`[Middleware] Invalid token, redirecting to ${loginRedirect}`);
            return NextResponse.redirect(new URL(loginRedirect, request.url));
        }

        // Role-based protection (basic example)
        if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
            // Special case: If visiting /admin root, send to admin login to allow account switch
            if (pathname === '/admin') {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            console.log('[Middleware] Unauthorized admin access, redirecting to dashboard');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (pathname.startsWith('/department') && decoded.role !== 'department_staff') {
            console.log('[Middleware] Unauthorized department access, redirecting to dashboard');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    if (isAuthPath && token) {
        // If logged in, redirect away from login/register
        const decoded = await verifyToken(token) as any;
        if (decoded) {
            // Admin login: only redirect if already logged in as admin
            if (isAdminLogin) {
                if (decoded.role === 'admin') {
                    console.log('[Middleware] Admin already logged in, redirecting to admin dashboard');
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
                }
                // Non-admin users can access admin login to switch accounts
                return NextResponse.next();
            }
            // Normal auth pages: redirect logged-in users to dashboard
            console.log('[Middleware] User logged in, redirecting to dashboard');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|tn-emblem.png).*)'],
};
