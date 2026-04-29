import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SITES = ['zevtaps', 'parkease', 'posease', 'amarhome', 'rently'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip api, _next, and files with extensions (images, etc)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle root
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/zevtaps';
    return NextResponse.rewrite(url);
  }

  // Check if the first segment is a site ID
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  if (firstSegment && SITES.includes(firstSegment)) {
    return NextResponse.next();
  }

  // If not a site ID, assume it's a page in zevtaps
  const url = request.nextUrl.clone();
  url.pathname = `/zevtaps${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
