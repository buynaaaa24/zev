import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SITES = ['zevtabs', 'parkease', 'posease', 'amarhome', 'rently', 'qr'];
const DEFAULT_SITE = 'zevtabs';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip api, _next, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Root → default site
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_SITE}`;
    return NextResponse.rewrite(url);
  }

  // If first segment is a known site ID, pass through
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();
  if (firstSegment && SITES.includes(firstSegment)) {
    return NextResponse.next();
  }

  // Otherwise prefix with the default site
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_SITE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
