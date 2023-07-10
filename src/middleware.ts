// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = path === '/' || path === '/login' || path === '/signup';

  const accessToken = req.cookies.get('accessToken');
  if (isPublicPath && accessToken) return NextResponse.redirect(new URL('/profile', req.nextUrl));
  if (!isPublicPath && !accessToken) return NextResponse.redirect(new URL('/login', req.nextUrl));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/profile', '/login', '/signup'],
};
