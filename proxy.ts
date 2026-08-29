import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin, checkAuth } from './app/lib/dal';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuth = await checkAuth();
  const isAdmin = await checkAdmin();

  if (isAuth && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuth && pathname === '/profile') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/admin') && (!isAuth || !isAdmin)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
