import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin, checkAuth } from './app/lib/dal';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuth = await checkAuth();
  const isAdmin = await checkAdmin();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  if (isAuth && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuth && pathname === '/profile') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuth && pathname.startsWith('/course/')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const protectedPatterns = [
    /^\/course\/create$/,
    /^\/course\/[^\/]+\/edit$/,
    /^\/course\/[^\/]+\/lesson\/create$/,
    /^\/course\/[^\/]+\/lesson\/[^\/]+\/edit$/,
    /^\/course\/[^\/]+\/lesson\/[^\/]+\/file\/create$/,
    /^\/course\/[^\/]+\/lesson\/[^\/]+\/file\/[^\/]+\/edit$/,
  ];

  const isProtected = protectedPatterns.some(pattern => pattern.test(pathname));

  if (isProtected && (!isAuth || !isAdmin)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
